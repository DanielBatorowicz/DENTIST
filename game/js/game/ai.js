/**
 * ai.js — a lightweight bot for the single-phone practice mode.
 *
 * The bot produces the exact same `cmd` object a human controller does, so
 * the Player code has no idea it is fighting a machine. Behaviour is
 * deliberately simple: keep a class-appropriate distance, attack when in
 * range, occasionally block or use the special. The archer bot solves the
 * ballistic firing angle analytically and adds noise so it can miss.
 */

import { GRAVITY, PLAYER_HALF_W, clamp } from './config.js';

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
    this.moveDir = 0;
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

  _melee(me, opp, dt, c) {
    const dist = Math.abs(opp.x - me.x);
    const dir = Math.sign(opp.x - me.x) || 1;
    const range = me.cls.attack.range;

    this.thinkT -= dt;
    if (this.thinkT <= 0) {
      this.thinkT = 0.15 + Math.random() * 0.3;

      // Approach until inside strike range, with a little wobble.
      if (dist > range * 0.75) this.moveDir = dir;
      else this.moveDir = (Math.random() < 0.25) ? -dir : 0;

      // Strike when close enough.
      if (dist < range + PLAYER_HALF_W && me.atkCd <= 0 && Math.random() < 0.75) {
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
    c.axisX = c.block.held ? 0 : this.moveDir;
  }

  _archer(me, opp, dt, c) {
    const dx = Math.abs(opp.x - me.x);

    // Kite: stay in a comfortable band.
    this.thinkT -= dt;
    if (this.thinkT <= 0) {
      this.thinkT = 0.2 + Math.random() * 0.3;
      const dir = Math.sign(opp.x - me.x) || 1;
      if (dx < 260) this.moveDir = -dir;
      else if (dx > 560) this.moveDir = dir;
      else this.moveDir = (Math.random() < 0.3) ? dir * (Math.random() < 0.5 ? 1 : -1) : 0;
    }
    c.axisX = this.moveDir;

    if (this.drawing) {
      // Keep holding the button, track the target, release at desired charge.
      c.attack.held = true;
      this.drawT += dt;
      me.aim = this._solveAim(me, opp);
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
      this.drawTarget = clamp(dx / 700, 0.3, 0.95) * me.cls.bow.maxCharge + 0.1;
    }

    // Triple shot when the target is mid-range and ammo allows.
    if (me.specialCd <= 0 && me.arrows > 1 && dx > 220 && dx < 520 && Math.random() < dt * 0.5) {
      me.aim = this._solveAim(me, opp);
      c.special.pressed = true;
    }
  }

  /**
   * Ballistic elevation to hit the opponent (same height, full-draw speed):
   * angle = 0.5 * asin(g * d / v^2), plus noise so the bot is beatable.
   */
  _solveAim(me, opp) {
    const bow = me.cls.bow;
    const v = bow.minSpeed + (bow.maxSpeed - bow.minSpeed) *
      clamp(this.drawTarget / bow.maxCharge, 0, 1);
    const d = Math.abs(opp.x - me.x);
    const s = (GRAVITY * d) / (v * v);
    const angle = s >= 1 ? Math.PI / 4 : 0.5 * Math.asin(s);
    return angle + (Math.random() - 0.5) * 0.08;
  }
}
