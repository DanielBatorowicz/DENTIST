/**
 * player.js — the fighter entity and its state machine.
 *
 * Players roam freely on the plaza (x/z plane). The joystick moves the
 * character in world space (the camera is roughly axis-aligned, so screen
 * up = north). The character automatically turns to face the opponent —
 * movement is effectively strafing, which keeps 1v1 combat readable.
 *
 * States:
 *   idle    — standing / running (movement lives here)
 *   attack  — melee swing: windup -> active hit window -> recover
 *   draw    — archer only: charging the bow, aiming via gyro
 *   block   — shield raised (tank class only)
 *   dash    — special dash-type ability in flight
 *   hitstun — staggered after taking a hit
 *   dead    — round lost, falling over
 *
 * ARCHER AIMING: the ballistic elevation needed to hit the opponent at the
 * current draw strength is solved analytically every frame; the gyroscope
 * then offsets that solution (tilt up/down = elevation, tilt left/right =
 * horizontal trim), so the bow is playable everywhere and precise with
 * motion controls. Dodging and cover are the counterplay.
 */

import {
  WORLD, CLASSES, OBSTACLES, GRAVITY, KB_DECAY, PLAYER_R, BOW_H, TURN_SPEED,
  GYRO_PITCH_GAIN, GYRO_YAW_GAIN, AIM_MIN, AIM_MAX, YAW_TRIM_MAX,
  clamp, lerp, angleDiff,
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
    this.wins = 0;       // round wins in the current match
    this.reset(0, 0, 0);
  }

  /** Reset for a new round. */
  reset(x, z, heading) {
    this.x = x;
    this.z = z;
    this.heading = heading;  // facing direction on the x/z plane (radians)
    this.kbx = 0;            // knockback velocity (decays)
    this.kbz = 0;
    this.hp = this.cls.hp;
    this.dispHp = this.cls.hp; // smoothed HP shown by the HUD damage trail
    this.state = 'idle';
    this.t = 0;              // time inside the current state
    this.atkCd = 0;
    this.specialCd = 0;
    this.charge = 0;         // bow draw charge (s)
    this.aim = 0.25;         // bow elevation above horizontal (radians)
    this.yawTrim = 0;        // gyro horizontal trim applied on top of auto-face
    this.drawRef = null;     // gyro snapshot taken when the draw started
    this.arrows = this.cls.ranged ? this.cls.bow.maxArrows : 0;
    this.arrowT = 0;
    this.hitDone = false;    // one hit per swing / dash
    this.flash = 0;          // white hit flash timer
    this.deadT = 0;
    this.walkT = 0;          // walk cycle phase for the renderer
    this.moving = false;
    this.dashDir = 0;        // heading captured when a dash starts
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

    // Smoothly turn towards the opponent (combat lock-on).
    if (this.alive && this.state !== 'dash') {
      const want = Math.atan2(opp.z - this.z, opp.x - this.x) +
        (this.state === 'draw' ? this.yawTrim : 0);
      const d = angleDiff(this.heading, want);
      this.heading += clamp(d, -TURN_SPEED * dt, TURN_SPEED * dt);
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
        this._updateDraw(dt, cmd, opp, fx, arrows);
        break;

      case 'block':
        if (!cmd.block.held || !this.cls.canBlock) this.state = 'idle';
        break;

      case 'idle':
        this._updateIdle(dt, cmd, fx, arrows);
        break;
    }

    // Knockback integration + decay (applies in every state).
    this.x += this.kbx * dt;
    this.z += this.kbz * dt;
    const decay = Math.min(1, KB_DECAY * dt);
    this.kbx -= this.kbx * decay;
    this.kbz -= this.kbz * decay;

    this._collide();
  }

  /** Arena walls + solid plaza props (cylinder push-out). */
  _collide() {
    this.x = clamp(this.x, WORLD.wallPad, WORLD.width - WORLD.wallPad);
    this.z = clamp(this.z, WORLD.wallPad, WORLD.depth - WORLD.wallPad);
    for (const o of OBSTACLES) {
      const dx = this.x - o.x;
      const dz = this.z - o.z;
      const d = Math.hypot(dx, dz);
      const min = o.r + PLAYER_R;
      if (d < min) {
        const n = d || 1;
        this.x = o.x + (dx / n) * min;
        this.z = o.z + (dz / n) * min;
      }
    }
  }

  _move(cmd, dt, factor = 1) {
    const mag = Math.hypot(cmd.axisX, cmd.axisY);
    if (mag < 0.2) return;
    const s = this.cls.speed * factor * Math.min(1, mag) / mag;
    this.x += cmd.axisX * s * dt;
    this.z += cmd.axisY * s * dt;
    this.walkT += dt * (2 + Math.min(1, mag) * 6) * factor;
    this.moving = true;
  }

  // --- state handlers -------------------------------------------------------

  _updateIdle(dt, cmd, fx, arrows) {
    this._move(cmd, dt);

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
        this.yawTrim = 0;
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

  _updateDraw(dt, cmd, opp, fx, arrows) {
    const bow = this.cls.bow;
    this.t += dt;
    this.charge = Math.min(bow.maxCharge, this.charge + dt);

    // Base elevation: the ballistic solution for the current draw power.
    let aim = this._solveElevation(opp);

    // GYRO AIMING: offset the solution with the phone-tilt delta taken
    // since the draw started. Pitch = elevation, yaw = horizontal trim.
    if (gyro.active && this.drawRef) {
      const d = gyro.delta(this.drawRef);
      aim += d.pitch * GYRO_PITCH_GAIN;
      this.yawTrim = clamp(d.yaw * GYRO_YAW_GAIN, -YAW_TRIM_MAX, YAW_TRIM_MAX);
    }
    this.aim = clamp(aim, AIM_MIN, AIM_MAX);

    // Slow strafing while drawing.
    this._move(cmd, dt, bow.moveFactor);

    // Release fires. (`!held` also covers taps whose release edge landed
    // on a frame we already consumed.)
    if (cmd.attack.released || !cmd.attack.held) {
      this._fireArrow(fx, arrows, this.charge / bow.maxCharge);
      this.state = 'idle';
      this.atkCd = 0.25;
    }
  }

  /** Elevation that lands an arrow on the opponent at current draw power. */
  _solveElevation(opp) {
    const bow = this.cls.bow;
    const v = lerp(bow.minSpeed, bow.maxSpeed,
      clamp(this.charge / bow.maxCharge, 0.15, 1));
    const d = Math.hypot(opp.x - this.x, opp.z - this.z);
    const s = (GRAVITY * d) / (v * v);
    return s >= 1 ? Math.PI / 4 : 0.5 * Math.asin(s);
  }

  _updateDash(dt, opp, fx) {
    const s = this.cls.special;
    this.t += dt;
    this.x += Math.cos(this.dashDir) * s.speed * dt;
    this.z += Math.sin(this.dashDir) * s.speed * dt;
    fx.dust(this.x, this.z, 1);

    if (!this.hitDone && Math.hypot(opp.x - this.x, opp.z - this.z) < PLAYER_R * 2 + 18) {
      if (tryMeleeHit(this, opp, {
        range: PLAYER_R * 2 + 20,
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
      this.dashDir = this.heading;
      fx.sfx.dash();
      fx.dust(this.x, this.z, 6);
    } else if (s.type === 'triple') {
      // Archer: instantly loose three full-power arrows in a yaw fan.
      if (this.arrows <= 0) {
        this.specialCd = 0.5; // not enough ammo — short retry lock only
        return;
      }
      const aim = this.aim;
      for (let i = -1; i <= 1; i++) {
        this._spawnArrow(arrows, aim, this.heading + i * s.spread, 1);
      }
      this.arrows--;
      this.atkCd = 0.35;
      fx.sfx.shoot();
    }
  }

  _fireArrow(fx, arrows, chargeRatio) {
    if (this.arrows <= 0) return;
    const c = clamp(chargeRatio, 0.15, 1);
    this._spawnArrow(arrows, this.aim, this.heading, c);
    this.arrows--;
    fx.sfx.shoot();
  }

  _spawnArrow(arrows, aim, heading, power) {
    const bow = this.cls.bow;
    const speed = lerp(bow.minSpeed, bow.maxSpeed, power);
    const damage = Math.round(lerp(bow.damageMin, bow.damageMax, power));
    const hv = Math.cos(aim) * speed; // horizontal speed component
    arrows.push(new Arrow(
      this.index,
      this.x + Math.cos(heading) * 30,
      BOW_H,
      this.z + Math.sin(heading) * 30,
      Math.cos(heading) * hv,
      Math.sin(aim) * speed,
      Math.sin(heading) * hv,
      damage,
    ));
  }
}
