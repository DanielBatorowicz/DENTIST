/**
 * engine.js — fixed-timestep game loop.
 *
 * Uses a fixed 60 Hz simulation step with an accumulator so gameplay speed
 * is identical on 60/90/120 Hz phone displays, while rendering runs once
 * per requestAnimationFrame. The accumulator is clamped so a backgrounded
 * tab does not fast-forward the simulation when it resumes.
 */

const STEP = 1 / 60;        // fixed simulation timestep (seconds)
const MAX_ACCUM = 0.25;     // max buffered time — prevents spiral of death

export class Engine {
  /**
   * @param {{update:(dt:number)=>void, render:()=>void}} hooks
   */
  constructor({ update, render }) {
    this.update = update;
    this.render = render;
    this.running = false;
    this._last = 0;
    this._accum = 0;
    this._raf = 0;
    this._tick = this._tick.bind(this);

    // Reset timing after the tab was hidden so dt does not explode.
    document.addEventListener('visibilitychange', () => {
      this._last = performance.now();
      this._accum = 0;
    });
  }

  start() {
    if (this.running) return;
    this.running = true;
    this._last = performance.now();
    this._raf = requestAnimationFrame(this._tick);
  }

  stop() {
    this.running = false;
    cancelAnimationFrame(this._raf);
  }

  _tick(now) {
    if (!this.running) return;
    this._accum = Math.min(this._accum + (now - this._last) / 1000, MAX_ACCUM);
    this._last = now;

    while (this._accum >= STEP) {
      this.update(STEP);
      this._accum -= STEP;
    }
    this.render();
    this._raf = requestAnimationFrame(this._tick);
  }
}
