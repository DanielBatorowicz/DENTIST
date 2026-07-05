/**
 * ai.js — a lightweight bot for the single-phone practice mode.
 *
 * The bot produces the exact same `cmd` object a human controller does, so
 * the Player code has no idea it is fighting a machine. In the free-roam
 * arena the bot steers on the x/z plane: melee classes close the distance
 * with a sideways wobble, the archer kites and shoots (bow elevation is
 * solved by the Player itself, so the bot only times draws and releases).
 */

import { PLAYER_R, clamp } from './config.js';

function makeCmd() {
  return {
    axisX: 0, axisY: 0,
    attack: { held: false, pressed: false, released: false },
    block: { held: false, pressed: false, released: false },
    special: { held: false, pressed: false, released: false },
  };
}

export class AiController {
  constructor() {
    this.cmd = makeCmd();
    this.thinkT = 0;         // decision re-roll timer
    this.moveX = 0;          // current steering vector
    this.moveZ = 0;
    this.strafe = 1;         // sideways wobble direction
    this.drawing = false;    // archer: currently holding the bow
    this.drawT = 0;
    this.drawTarget = 0.5;   // desired charge time for this shot
    this.blockT = 0;
  }

  /** Produce commands for `me` versus `opp` for this frame. */
  getCommands(me, opp, dt) {
    const c = this.cmd;
    // Clear edges from last frame.
    c.attack.pressed = c.attack.released = false;
    c.special.pressed = false;

    if (me.cls.ranged) this._archer(me, opp, dt, c);
    else this._melee(me, opp, dt, c);
    return c;
  }

  /** Steering helper: blend approach direction with a sideways wobble. */
  _steer(me, opp, towards, strafeAmt) {
    const dx = opp.x - me.x;
    const dz = opp.z - me.z;
    const d = Math.hypot(dx, dz) || 1;
    const nx = dx / d, nz = dz / d;
    // Perpendicular (strafe) direction.
    const px = -nz * this.strafe, pz = nx * this.strafe;
    this.moveX = nx * towards + px * strafeAmt;
    this.moveZ = nz * towards + pz * strafeAmt;
  }

  _melee(me, opp, dt, c) {
    const dist = Math.hypot(opp.x - me.x, opp.z - me.z);
    const range = me.cls.attack.range;

    this.thinkT -= dt;
    if (this.thinkT <= 0) {
      this.thinkT = 0.15 + Math.random() * 0.3;
      if (Math.random() < 0.2) this.strafe = -this.strafe;

      // Approach until inside strike range, circling a little.
      if (dist > range * 0.8) this._steer(me, opp, 1, 0.4);
      else this._steer(me, opp, Math.random() < 0.25 ? -0.5 : 0, 0.7);

      // Strike when close enough.
      if (dist < range + PLAYER_R && me.atkCd <= 0 && Math.random() < 0.75) {
        c.attack.pressed = true;
      }

      // Dash special from mid distance.
      if (me.specialCd <= 0 && dist > 140 && dist < 320 && Math.random() < 0.35) {
        c.special.pressed = true;
      }

      // Raise the shield for a moment when the enemy is winding up.
      if (me.cls.canBlock &&
          (opp.state === 'attack' || opp.state === 'draw' || opp.state === 'dash') &&
          Math.random() < 0.5) {
        this.blockT = 0.4 + Math.random() * 0.4;
      }
    }

    this.blockT = Math.max(0, this.blockT - dt);
    c.block.held = this.blockT > 0;
    c.axisX = c.block.held ? 0 : this.moveX;
    c.axisY = c.block.held ? 0 : this.moveZ;
  }

  _archer(me, opp, dt, c) {
    const dist = Math.hypot(opp.x - me.x, opp.z - me.z);

    // Kite: stay in a comfortable band, drifting sideways.
    this.thinkT -= dt;
    if (this.thinkT <= 0) {
      this.thinkT = 0.2 + Math.random() * 0.3;
      if (Math.random() < 0.25) this.strafe = -this.strafe;
      if (dist < 260) this._steer(me, opp, -1, 0.5);
      else if (dist > 560) this._steer(me, opp, 1, 0.3);
      else this._steer(me, opp, 0, Math.random() < 0.6 ? 0.8 : 0);
    }
    c.axisX = this.moveX;
    c.axisY = this.moveZ;

    if (this.drawing) {
      // Keep holding the button, release at the desired charge.
      c.attack.held = true;
      this.drawT += dt;
      if (this.drawT >= this.drawTarget) {
        c.attack.held = false;
        c.attack.released = true;
        this.drawing = false;
      }
    } else if (me.arrows > 0 && me.state === 'idle' && me.atkCd <= 0 && Math.random() < dt * 1.4) {
      c.attack.pressed = true;
      c.attack.held = true;
      this.drawing = true;
      this.drawT = 0;
      // Charge longer for far targets.
      this.drawTarget = clamp(dist / 700, 0.3, 0.95) * me.cls.bow.maxCharge + 0.1;
    }

    // Triple shot when the target is mid-range and ammo allows.
    if (me.specialCd <= 0 && me.arrows > 1 && dist > 220 && dist < 520 && Math.random() < dt * 0.5) {
      c.special.pressed = true;
    }
  }
}
