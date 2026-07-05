/**
 * renderer.js — canvas rendering, camera transform and screen shake.
 *
 * The logical 1000x560 world is scaled uniformly and centered on the
 * physical screen. The sky and ground are painted edge-to-edge so no
 * letterbox bars are visible. devicePixelRatio is capped at 2 — higher
 * ratios burn fill-rate on phones for no visible gain.
 */

import { WORLD, GRAVITY, PLAYER_COLORS, clamp, lerp } from '../game/config.js';
import { drawFighter, drawArrow } from './sprites.js';
import { drawHUD, drawBanner } from '../ui/hud.js';
import { drawControls } from '../ui/controls.js';

// Static decorative speckles on the ground, generated once per session.
const SPECKLES = [];
for (let i = 0; i < 40; i++) {
  SPECKLES.push({
    x: Math.random() * WORLD.width,
    y: WORLD.groundY + 14 + Math.random() * 60,
    s: 2 + Math.random() * 4,
  });
}

export class Renderer {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.shakeP = 0;
    this.resize();
  }

  resize() {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    this.w = window.innerWidth;
    this.h = window.innerHeight;
    this.dpr = dpr;
    this.canvas.width = Math.round(this.w * dpr);
    this.canvas.height = Math.round(this.h * dpr);
    this.canvas.style.width = this.w + 'px';
    this.canvas.style.height = this.h + 'px';
  }

  shake(power) {
    this.shakeP = Math.min(14, this.shakeP + power);
  }

  /** @param {{match: import('../game/match.js').Match|null, input, particles, paused:boolean}} game */
  render(game) {
    const { ctx, w, h } = this;
    ctx.setTransform(this.dpr, 0, 0, this.dpr, 0, 0);

    // View transform: uniform scale, centered.
    const s = Math.min(w / WORLD.width, h / WORLD.height);
    const ox = (w - WORLD.width * s) / 2;
    const oy = (h - WORLD.height * s) / 2;
    const shx = (Math.random() - 0.5) * this.shakeP;
    const shy = (Math.random() - 0.5) * this.shakeP;
    this.shakeP *= 0.86;

    // Sky — painted in screen space so it covers the whole display.
    const sky = ctx.createLinearGradient(0, 0, 0, h);
    sky.addColorStop(0, '#1e1b4b');
    sky.addColorStop(0.55, '#4c1d95');
    sky.addColorStop(1, '#9d4b6b');
    ctx.fillStyle = sky;
    ctx.fillRect(0, 0, w, h);

    ctx.save();
    ctx.translate(ox + shx, oy + shy);
    ctx.scale(s, s);
    this._drawArena(ctx);

    const match = game.match;
    if (match) {
      for (const a of match.arrows) drawArrow(ctx, a);
      for (const p of match.players) drawFighter(ctx, p);
      game.particles.draw(ctx);
      for (const p of match.players) this._drawAimGuide(ctx, p);
    }
    ctx.restore();

    if (match) {
      drawHUD(ctx, match, w, h);
      drawBanner(ctx, match, w, h);
      if (match.phase === 'intro' || match.phase === 'fight') {
        drawControls(ctx, game.input, match, w, h);
      }
      if (game.paused) {
        ctx.fillStyle = 'rgba(0,0,0,0.55)';
        ctx.fillRect(0, 0, w, h);
      }
    }
  }

  _drawArena(ctx) {
    const g = WORLD.groundY;
    // Moon.
    ctx.fillStyle = '#fef9c3';
    ctx.globalAlpha = 0.9;
    ctx.beginPath();
    ctx.arc(820, 90, 34, 0, Math.PI * 2);
    ctx.fill();
    ctx.globalAlpha = 1;

    // Distant hills (two parallax-ish layers, static).
    ctx.fillStyle = 'rgba(30, 27, 75, 0.55)';
    ctx.beginPath();
    ctx.moveTo(-1000, g);
    ctx.lineTo(-200, g - 150);
    ctx.lineTo(200, g - 60);
    ctx.lineTo(560, g - 190);
    ctx.lineTo(900, g - 70);
    ctx.lineTo(1400, g - 170);
    ctx.lineTo(2000, g);
    ctx.closePath();
    ctx.fill();
    ctx.fillStyle = 'rgba(15, 12, 41, 0.7)';
    ctx.beginPath();
    ctx.moveTo(-1000, g);
    ctx.lineTo(-100, g - 90);
    ctx.lineTo(400, g - 30);
    ctx.lineTo(760, g - 120);
    ctx.lineTo(1200, g - 40);
    ctx.lineTo(2000, g);
    ctx.closePath();
    ctx.fill();

    // Ground slab, extended far past the world so letterboxing never shows.
    ctx.fillStyle = '#2d2438';
    ctx.fillRect(-1000, g, 3000, 1500);
    ctx.fillStyle = '#4a3960';
    ctx.fillRect(-1000, g, 3000, 8);
    ctx.fillStyle = 'rgba(255,255,255,0.06)';
    for (const sp of SPECKLES) ctx.fillRect(sp.x, sp.y, sp.s, sp.s);

    // Arena boundary torches.
    for (const x of [WORLD.wallPad - 20, WORLD.width - WORLD.wallPad + 20]) {
      ctx.fillStyle = '#3f3350';
      ctx.fillRect(x - 4, g - 90, 8, 90);
      ctx.fillStyle = '#fb923c';
      ctx.beginPath();
      ctx.arc(x, g - 98, 7 + Math.sin(performance.now() / 120 + x) * 1.5, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#fde047';
      ctx.beginPath();
      ctx.arc(x, g - 100, 3.5, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  /**
   * Dotted trajectory preview while an archer is drawing — this is what
   * makes gyro aiming feel precise. Simulated with the same gravity the
   * real arrow uses.
   */
  _drawAimGuide(ctx, p) {
    if (p.state !== 'draw' || p.arrows <= 0) return;
    const bow = p.cls.bow;
    const power = clamp(p.charge / bow.maxCharge, 0.15, 1);
    const speed = lerp(bow.minSpeed, bow.maxSpeed, power);
    let x = p.x + p.facing * 30;
    let y = WORLD.groundY - 62;
    let vx = Math.cos(p.aim) * speed * p.facing;
    let vy = -Math.sin(p.aim) * speed;
    const dt = 0.045;

    ctx.fillStyle = PLAYER_COLORS[p.index];
    for (let i = 0; i < 26; i++) {
      vy += GRAVITY * dt;
      x += vx * dt;
      y += vy * dt;
      if (y > WORLD.groundY) break;
      ctx.globalAlpha = 0.55 * (1 - i / 26);
      ctx.beginPath();
      ctx.arc(x, y, 3.5, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.globalAlpha = 1;
  }
}
