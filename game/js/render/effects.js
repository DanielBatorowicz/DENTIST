/**
 * effects.js — pooled particle system (3D world space).
 *
 * A fixed-size pool (no garbage in the hot path) covers hit sparks, shield
 * sparks, dust and death bursts. Coordinates are world units with y up;
 * the renderer draws the pool as one instanced mesh.
 */

const POOL_SIZE = 160;

export class Particles {
  constructor() {
    this.pool = new Array(POOL_SIZE);
    for (let i = 0; i < POOL_SIZE; i++) {
      this.pool[i] = {
        alive: false, x: 0, y: 0, z: 0, vx: 0, vy: 0, vz: 0,
        life: 0, maxLife: 0, size: 0, color: '#fff', gravity: 0,
      };
    }
    this.cursor = 0;
  }

  spawn(x, y, z, vx, vy, vz, life, size, color, gravity = 0) {
    const p = this.pool[this.cursor];
    this.cursor = (this.cursor + 1) % POOL_SIZE;
    p.alive = true;
    p.x = x; p.y = y; p.z = z;
    p.vx = vx; p.vy = vy; p.vz = vz;
    p.life = life; p.maxLife = life;
    p.size = size; p.color = color; p.gravity = gravity;
  }

  /** Uniformly random direction on a (slightly squashed) sphere. */
  _burst(x, y, z, n, speedMin, speedVar, life, size, colorFn, gravity) {
    for (let i = 0; i < n; i++) {
      const a = Math.random() * Math.PI * 2;
      const b = (Math.random() - 0.35) * Math.PI;
      const s = speedMin + Math.random() * speedVar;
      this.spawn(x, y, z,
        Math.cos(a) * Math.cos(b) * s,
        Math.sin(b) * s,
        Math.sin(a) * Math.cos(b) * s,
        life + Math.random() * life * 0.8,
        size + Math.random() * size,
        colorFn(i), gravity);
    }
  }

  /** Yellow-white burst on a landed hit. */
  hitSpark(x, y, z) {
    this._burst(x, y, z, 10, 120, 220, 0.22, 2.4,
      (i) => (i % 3 ? '#fde047' : '#ffffff'), 500);
  }

  /** Cool blue-white flash on a blocked attack. */
  blockSpark(x, y, z) {
    this._burst(x, y, z, 8, 100, 160, 0.18, 2,
      (i) => (i % 2 ? '#93c5fd' : '#ffffff'), 400);
  }

  /** Ground dust for dashes and landings. */
  dust(x, z, n) {
    for (let i = 0; i < n; i++) {
      this.spawn(
        x + (Math.random() - 0.5) * 24, 4, z + (Math.random() - 0.5) * 24,
        (Math.random() - 0.5) * 70, 30 + Math.random() * 60, (Math.random() - 0.5) * 70,
        0.35 + Math.random() * 0.3, 3 + Math.random() * 4, '#94836e', 60);
    }
  }

  /** Big burst when a fighter goes down. */
  deathBurst(x, y, z, color) {
    this._burst(x, y, z, 22, 100, 300, 0.45, 3,
      (i) => (i % 3 ? color : '#ffffff'), 600);
  }

  update(dt) {
    for (const p of this.pool) {
      if (!p.alive) continue;
      p.life -= dt;
      if (p.life <= 0) { p.alive = false; continue; }
      p.vy -= p.gravity * dt;
      p.x += p.vx * dt;
      p.y += p.vy * dt;
      p.z += p.vz * dt;
      if (p.y < 1) { p.y = 1; p.vy = 0; }
    }
  }
}
