/**
 * player.js — the fighter entity and its state machine.
 *
 * States:
 *   idle    — standing / walking (movement lives here)
 *   attack  — melee swing: windup -> active hit window -> recover
 *   draw    — archer only: charging the bow, aiming via gyro/stick
 *   block   — shield raised (tank class only)
 *   dash    — special dash-type ability in flight
 *   hitstun — staggered after taking a hit
 *   dead    — round lost, falling over
 *
 * Commands come in a normalized `cmd` object each frame, so a human on
 * touch, a human on keyboard and the AI all drive the player identically.
 */

import {
  WORLD, CLASSES, HIT_STUN, KB_DECAY, PLAYER_HALF_W,
  GYRO_PITCH_GAIN, GYRO_YAW_GAIN, AIM_MIN, AIM_MAX, STICK_AIM_SPEED,
  clamp, lerp,
} from './config.js';
import { tryMeleeHit } from './combat.js';
import { Arrow } from './projectile.js';
import { gyro } from '../core/gyro.js';

export const NEUTRAL_CMD = Object.freeze({
  axisX: 0, axisY: 0,
  attack: { held: false, pressed: false, released: false },
  block: { held: false, pressed: false, released: false },
  special: { held: false, pressed: false, released: false },
});

export class Player {
  /**
   * @param {number} index    0 or 1
   * @param {string} classId  key into CLASSES
   */
  constructor(index, classId) {
    this.index = index;
    this.cls = CLASSES[classId];
    this.isHuman = true; // false for the bot — gyro aiming is humans-only
    this.wins = 0;      // round wins in the current match
    this.reset(0, 1);
  }

  /** Reset for a new round. */
  reset(x, facing) {
    this.x = x;
    this.facing = facing;
    this.vx = 0;            // knockback velocity (decays)
    this.hp = this.cls.hp;
    this.dispHp = this.cls.hp; // smoothed HP shown by the HUD damage trail
    this.state = 'idle';
    this.t = 0;             // time inside the current state
    this.atkCd = 0;
    this.specialCd = 0;
    this.charge = 0;        // bow draw charge (s)
    this.aim = 0.25;        // bow elevation in radians (persists between shots)
    this.aimBase = this.aim;
    this.drawRef = null;    // gyro snapshot taken when the draw started
    this.arrows = this.cls.ranged ? this.cls.bow.maxArrows : 0;
    this.arrowT = 0;
    this.hitDone = false;   // one hit per swing / dash
    this.flash = 0;         // white hit flash timer
    this.deadT = 0;
    this.walkT = 0;         // walk cycle phase for the renderer
    this.moving = false;
  }

  groundY() {
    return WORLD.groundY;
  }

  die() {
    this.state = 'dead';
    this.deadT = 0;
  }

  get alive() {
    return this.state !== 'dead';
  }

  /**
   * Advance one fixed timestep.
   * @param {number} dt
   * @param {object} cmd     normalized input commands
   * @param {Player} opp     the opponent
   * @param {object} fx      feedback facade (particles / sfx / shake)
   * @param {Arrow[]} arrows shared projectile list
   */
  update(dt, cmd, opp, fx, arrows) {
    this.atkCd = Math.max(0, this.atkCd - dt);
    this.specialCd = Math.max(0, this.specialCd - dt);
    this.flash = Math.max(0, this.flash - dt);
    this.moving = false;

    // Quiver regeneration.
    if (this.cls.ranged && this.arrows < this.cls.bow.maxArrows) {
      this.arrowT += dt;
      if (this.arrowT >= this.cls.bow.regen) {
        this.arrowT = 0;
        this.arrows++;
      }
    }

    // Always face the opponent (with a small dead zone to avoid jitter
    // when the fighters overlap).
    if (this.alive && Math.abs(opp.x - this.x) > 14) {
      this.facing = opp.x > this.x ? 1 : -1;
    }

    switch (this.state) {
      case 'dead':
        this.deadT += dt;
        break;

      case 'hitstun':
        this.t -= dt;
        if (this.t <= 0) this.state = 'idle';
        break;

      case 'dash':
        this._updateDash(dt, opp, fx);
        break;

      case 'attack':
        this._updateAttack(dt, opp, fx);
        break;

      case 'draw':
        this._updateDraw(dt, cmd, fx, arrows);
        break;

      case 'block':
        if (!cmd.block.held || !this.cls.canBlock) this.state = 'idle';
        break;

      case 'idle':
        this._updateIdle(dt, cmd, fx, arrows);
        break;
    }

    // Knockback integration + decay (applies in every state).
    this.x += this.vx * dt;
    this.vx -= this.vx * Math.min(1, KB_DECAY * dt);
    this.x = clamp(this.x, WORLD.wallPad, WORLD.width - WORLD.wallPad);
  }

  // --- state handlers -------------------------------------------------------

  _updateIdle(dt, cmd, fx, arrows) {
    // Horizontal movement.
    if (Math.abs(cmd.axisX) > 0.18) {
      this.x += cmd.axisX * this.cls.speed * dt;
      this.walkT += dt * (2 + Math.abs(cmd.axisX) * 6);
      this.moving = true;
    }

    // Shield up (tank only) — a dedicated button, as per the class design.
    if (cmd.block.held && this.cls.canBlock) {
      this.state = 'block';
      return;
    }

    // Special ability.
    if (cmd.special.pressed && this.specialCd <= 0) {
      this._startSpecial(fx, arrows);
      return;
    }

    // Attack: melee swing or start drawing the bow.
    if (this.cls.ranged) {
      if (cmd.attack.pressed && this.arrows > 0 && this.atkCd <= 0) {
        this.state = 'draw';
        this.t = 0;
        this.charge = 0;
        this.aimBase = this.aim;
        this.drawRef = (gyro.active && this.isHuman) ? gyro.snapshot() : null;
        fx.sfx.drawBow();
      }
    } else if (cmd.attack.pressed && this.atkCd <= 0) {
      this.state = 'attack';
      this.t = 0;
      this.hitDone = false;
      this.atkCd = this.cls.attack.cooldown;
      fx.sfx.swing();
    }
  }

  _updateAttack(dt, opp, fx) {
    const a = this.cls.attack;
    this.t += dt;
    const inActive = this.t >= a.windup && this.t < a.windup + a.active;
    if (inActive && !this.hitDone) {
      if (tryMeleeHit(this, opp, a, fx)) this.hitDone = true;
    }
    if (this.t >= a.windup + a.active + a.recover) this.state = 'idle';
  }

  _updateDraw(dt, cmd, fx, arrows) {
    const bow = this.cls.bow;
    this.t += dt;
    this.charge = Math.min(bow.maxCharge, this.charge + dt);

    // GYRO AIMING: aim is the draw-start aim plus the phone-tilt delta.
    // Vertical tilt gives coarse elevation, horizontal tilt fine trim.
    if (gyro.active && this.drawRef) {
      const d = gyro.delta(this.drawRef);
      this.aim = clamp(
        this.aimBase + d.pitch * GYRO_PITCH_GAIN + d.yaw * GYRO_YAW_GAIN,
        AIM_MIN, AIM_MAX,
      );
    }
    // Fallback / trim: joystick vertical axis (push up = aim up).
    if (Math.abs(cmd.axisY) > 0.25) {
      this.aim = clamp(this.aim - cmd.axisY * STICK_AIM_SPEED * dt, AIM_MIN, AIM_MAX);
    }

    // Slow strafing while drawing.
    if (Math.abs(cmd.axisX) > 0.18) {
      this.x += cmd.axisX * this.cls.speed * bow.moveFactor * dt;
      this.walkT += dt * 4;
      this.moving = true;
    }

    // Release fires. (`!held` also covers taps whose release edge landed
    // on a frame we already consumed.)
    if (cmd.attack.released || !cmd.attack.held) {
      this._fireArrow(fx, arrows, this.aim, this.charge / bow.maxCharge);
      this.state = 'idle';
      this.atkCd = 0.25;
    }
  }

  _updateDash(dt, opp, fx) {
    const s = this.cls.special;
    this.t += dt;
    this.x += this.facing * s.speed * dt;
    fx.dust(this.x - this.facing * 14, WORLD.groundY, 1);

    if (!this.hitDone && Math.abs(opp.x - this.x) < PLAYER_HALF_W * 2 + 18) {
      if (tryMeleeHit(this, opp, {
        range: PLAYER_HALF_W * 2 + 20,
        damage: s.damage,
        knockback: s.knockback,
        stun: s.stun,
        breaksGuard: s.breaksGuard,
      }, fx)) this.hitDone = true;
    }
    if (this.t >= s.duration) this.state = 'idle';
  }

  // --- actions ---------------------------------------------------------------

  _startSpecial(fx, arrows) {
    const s = this.cls.special;
    this.specialCd = s.cooldown;

    if (s.type === 'dash') {
      this.state = 'dash';
      this.t = 0;
      this.hitDone = false;
      fx.sfx.dash();
      fx.dust(this.x, WORLD.groundY, 6);
    } else if (s.type === 'triple') {
      // Archer: instantly loose three full-power arrows in a small spread.
      if (this.arrows <= 0) {
        this.specialCd = 0.5; // not enough ammo — short retry lock only
        return;
      }
      for (let i = -1; i <= 1; i++) {
        this._spawnArrow(arrows, this.aim + i * s.spread, 1);
      }
      this.arrows--;
      this.atkCd = 0.35;
      fx.sfx.shoot();
    }
  }

  _fireArrow(fx, arrows, aim, chargeRatio) {
    if (this.arrows <= 0) return;
    const c = clamp(chargeRatio, 0.15, 1);
    this._spawnArrow(arrows, aim, c);
    this.arrows--;
    fx.sfx.shoot();
  }

  _spawnArrow(arrows, aim, power) {
    const bow = this.cls.bow;
    const speed = lerp(bow.minSpeed, bow.maxSpeed, power);
    const damage = Math.round(lerp(bow.damageMin, bow.damageMax, power));
    arrows.push(new Arrow(
      this.index,
      this.x + this.facing * 30,
      WORLD.groundY - 62, // bow height
      Math.cos(aim) * speed * this.facing,
      -Math.sin(aim) * speed,
      damage,
    ));
  }
}
