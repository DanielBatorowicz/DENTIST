/**
 * input.js — unified touch + mouse + keyboard input manager.
 *
 * Screen controls (virtual joystick + action buttons) are registered as
 * simple circle descriptors via setControls(). Pointer Events are used so
 * the same code path handles multi-touch on phones and the mouse on
 * desktop. Keyboard bindings exist purely as a development convenience.
 *
 * Per player the manager exposes:
 *   axisX / axisY               joystick axes in [-1, 1]
 *   attack / block / special    buttons with { held, pressed, released }
 *
 * "pressed"/"released" are edge flags accumulated between frames; the game
 * calls endFrame() once per simulation frame to clear them, so short taps
 * that begin and end between frames are never lost.
 */

const BUTTONS = ['attack', 'block', 'special'];

// Development keyboard layout (documented in README):
// P1: A/D move, W/S aim, F attack, G block, H special
// P2: arrows move/aim, K attack, L block, P special
const KEYMAP = {
  KeyA: [0, 'left'], KeyD: [0, 'right'], KeyW: [0, 'up'], KeyS: [0, 'down'],
  KeyF: [0, 'attack'], KeyG: [0, 'block'], KeyH: [0, 'special'],
  ArrowLeft: [1, 'left'], ArrowRight: [1, 'right'],
  ArrowUp: [1, 'up'], ArrowDown: [1, 'down'],
  KeyK: [1, 'attack'], KeyL: [1, 'block'], KeyP: [1, 'special'],
};

function makeButton() {
  return { touch: 0, key: false, pressed: false, released: false };
}

function makePlayerState() {
  return {
    stick: { active: false, x: 0, y: 0 },       // touch joystick axes
    keys: { left: false, right: false, up: false, down: false },
    buttons: { attack: makeButton(), block: makeButton(), special: makeButton() },
  };
}

export class Input {
  constructor(canvas) {
    this.canvas = canvas;
    this.controls = [];               // active on-screen control descriptors
    this.players = [makePlayerState(), makePlayerState()];
    this._pointers = new Map();       // pointerId -> captured control
    this.onAnyPress = null;           // hook used to unlock audio on iOS

    canvas.addEventListener('pointerdown', (e) => this._down(e));
    window.addEventListener('pointermove', (e) => this._move(e));
    window.addEventListener('pointerup', (e) => this._up(e));
    window.addEventListener('pointercancel', (e) => this._up(e));
    window.addEventListener('keydown', (e) => this._key(e, true));
    window.addEventListener('keyup', (e) => this._key(e, false));

    // Block page scroll / pinch-zoom gestures while playing.
    canvas.addEventListener('touchstart', (e) => e.preventDefault(), { passive: false });
    canvas.addEventListener('touchmove', (e) => e.preventDefault(), { passive: false });
  }

  /**
   * Replace all on-screen controls. Each control:
   * { id: 'stick'|'attack'|'block'|'special', type: 'stick'|'button',
   *   player: 0|1, x, y, r }   (screen-space CSS pixels)
   */
  setControls(controls) {
    this.controls = controls;
    this._pointers.clear();
    for (const p of this.players) {
      p.stick.active = false;
      p.stick.x = p.stick.y = 0;
      for (const b of BUTTONS) p.buttons[b].touch = 0;
    }
  }

  /** Snapshot of one player's input, consumed by the Match each frame. */
  state(i) {
    const p = this.players[i];
    const kx = (p.keys.right ? 1 : 0) - (p.keys.left ? 1 : 0);
    const ky = (p.keys.down ? 1 : 0) - (p.keys.up ? 1 : 0);
    const out = {
      axisX: p.stick.active ? p.stick.x : kx,
      axisY: p.stick.active ? p.stick.y : ky,
    };
    for (const b of BUTTONS) {
      const btn = p.buttons[b];
      out[b] = {
        held: btn.touch > 0 || btn.key,
        pressed: btn.pressed,
        released: btn.released,
      };
    }
    return out;
  }

  /** Clear edge flags — must be called once per simulation frame. */
  endFrame() {
    for (const p of this.players) {
      for (const b of BUTTONS) {
        p.buttons[b].pressed = false;
        p.buttons[b].released = false;
      }
    }
  }

  /** Visual state of a control (for rendering highlights / knob offset). */
  visual(control) {
    const p = this.players[control.player];
    if (control.type === 'stick') return p.stick;
    const b = p.buttons[control.id];
    return { active: b.touch > 0 || b.key };
  }

  // --- internal -----------------------------------------------------------

  _down(e) {
    if (this.onAnyPress) this.onAnyPress();
    const x = e.clientX, y = e.clientY;
    // Pick the closest control whose (slightly enlarged) circle contains the touch.
    let best = null, bestD = Infinity;
    for (const c of this.controls) {
      const d = Math.hypot(x - c.x, y - c.y);
      if (d < c.r * 1.45 && d < bestD) { best = c; bestD = d; }
    }
    if (!best) return;
    e.preventDefault();
    this._pointers.set(e.pointerId, best);
    const p = this.players[best.player];
    if (best.type === 'stick') {
      p.stick.active = true;
      this._applyStick(best, x, y);
    } else {
      const b = p.buttons[best.id];
      b.touch++;
      b.pressed = true;
    }
  }

  _move(e) {
    const c = this._pointers.get(e.pointerId);
    if (!c) return;
    if (c.type === 'stick') this._applyStick(c, e.clientX, e.clientY);
  }

  _up(e) {
    const c = this._pointers.get(e.pointerId);
    if (!c) return;
    this._pointers.delete(e.pointerId);
    const p = this.players[c.player];
    if (c.type === 'stick') {
      // Only release the stick if no other pointer is still driving it.
      let stillHeld = false;
      for (const other of this._pointers.values()) {
        if (other === c) { stillHeld = true; break; }
      }
      if (!stillHeld) {
        p.stick.active = false;
        p.stick.x = p.stick.y = 0;
      }
    } else {
      const b = p.buttons[c.id];
      b.touch = Math.max(0, b.touch - 1);
      if (b.touch === 0) b.released = true;
    }
  }

  _applyStick(c, x, y) {
    const p = this.players[c.player];
    p.stick.x = Math.max(-1, Math.min(1, (x - c.x) / c.r));
    p.stick.y = Math.max(-1, Math.min(1, (y - c.y) / c.r));
  }

  _key(e, down) {
    const m = KEYMAP[e.code];
    if (!m) return;
    const [pi, k] = m;
    const p = this.players[pi];
    if (k in p.keys) {
      p.keys[k] = down;
    } else {
      const b = p.buttons[k];
      if (down && !b.key) b.pressed = true;
      if (!down && b.key) b.released = true;
      b.key = down;
    }
    e.preventDefault();
  }
}
