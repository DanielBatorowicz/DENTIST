/**
 * effects.js — pooled particle system.
 *
 * A fixed-size pool (no garbage in the hot path) covers hit sparks, shield
 * sparks and dust. Particles live in world space and are drawn by the
 * renderer inside the world transform.
 */

const POOL_SIZE = 160;

export class Particles {
  constructor() {
    this.pool = new Array(POOL_SIZE);
    for (let i = 0; i < POOL_SIZE; i++) {
      this.pool[i] = { alive: false, x: 0, y: 0, vx: 0, vy: 0, life: 0, maxLife: 0, size: 0, color: '#fff', gravity: 0 };
    }
    this.cursor = 0;
  }

  spawn(x, y, vx, vy, life, size, color, gravity = 0) {
    const p = this.pool[this.cursor];
    this.cursor = (this.cursor + 1) % POOL_SIZE;
    p.alive = true;
    p.x = x; p.y = y; p.vx = vx; p.vy = vy;
    p.life = life; p.maxLife = life;
    p.size = size; p.color = color; p.gravity = gravity;
  }

  /** Yellow-white burst on a landed hit. */
  hitSpark(x, y) {
    for (let i = 0; i < 10; i++) {
      const a = Math.random() * Math.PI * 2;
      const s = 120 + Math.random() * 260;
      this.spawn(x, y, Math.cos(a) * s, Math.sin(a) * s, 0.25 + Math.random() * 0.2,
        2 + Math.random() * 3, i % 3 ? '#fde047' : '#ffffff', 500);
    }
  }

  /** Cool blue-white flash on a blocked attack. */
  blockSpark(x, y) {
    for (let i = 0; i < 8; i++) {
      const a = -Math.PI / 2 + (Math.random() - 0.5) * 2.2;
      const s = 100 + Math.random() * 180;
      this.spawn(x, y, Math.cos(a) * s, Math.sin(a) * s, 0.2 + Math.random() * 0.15,
        2 + Math.random() * 2, i % 2 ? '#93c5fd' : '#ffffff', 400);
    }
  }

  /** Ground dust for dashes and landings. */
  dust(x, y, n) {
    for (let i = 0; i < n; i++) {
      this.spawn(x + (Math.random() - 0.5) * 20, y - 4,
        (Math.random() - 0.5) * 80, -30 - Math.random() * 60,
        0.35 + Math.random() * 0.3, 3 + Math.random() * 4, 'rgba(148,131,110,0.7)', -60);
    }
  }

  /** Big burst when a fighter goes down. */
  deathBurst(x, y, color) {
    for (let i = 0; i < 22; i++) {
      const a = Math.random() * Math.PI * 2;
      const s = 100 + Math.random() * 320;
      this.spawn(x, y, Math.cos(a) * s, Math.sin(a) * s - 120, 0.5 + Math.random() * 0.4,
        2 + Math.random() * 4, i % 3 ? color : '#ffffff', 700);
    }
  }

  update(dt) {
    for (const p of this.pool) {
      if (!p.alive) continue;
      p.life -= dt;
      if (p.life <= 0) { p.alive = false; continue; }
      p.vy += p.gravity * dt;
      p.x += p.vx * dt;
      p.y += p.vy * dt;
    }
  }

  /** Draw inside the world transform (ctx already scaled). */
  draw(ctx) {
    for (const p of this.pool) {
      if (!p.alive) continue;
      ctx.globalAlpha = Math.max(0, p.life / p.maxLife);
      ctx.fillStyle = p.color;
      const s = p.size;
      ctx.fillRect(p.x - s / 2, p.y - s / 2, s, s);
    }
    ctx.globalAlpha = 1;
  }
}
