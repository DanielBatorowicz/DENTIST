/**
 * sprites.js — procedural vector fighters.
 *
 * Characters are drawn with plain canvas shapes (no image assets), which
 * keeps the download at zero and lets us tint per player and flash on
 * hits for free. All drawing happens in world units with the fighter's
 * feet at the local origin; the local +x axis always points the way the
 * fighter is facing (handled with a scale flip).
 */

import { WORLD, PLAYER_COLORS, PLAYER_COLORS_DARK, clamp } from '../game/config.js';

/** roundRect with a fallback for older mobile browsers. */
export function rr(ctx, x, y, w, h, r) {
  if (ctx.roundRect) {
    ctx.beginPath();
    ctx.roundRect(x, y, w, h, r);
    return;
  }
  r = Math.min(r, w / 2, h / 2);
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}

/** Melee swing angle (radians) for the current attack phase. */
function swingAngle(p) {
  const a = p.cls.attack;
  const REST = 0.6, BACK = -2.0, FRONT = 1.15;
  const t = p.t;
  if (p.state !== 'attack') return REST;
  if (t < a.windup) return REST + (BACK - REST) * (t / a.windup);
  if (t < a.windup + a.active) return BACK + (FRONT - BACK) * ((t - a.windup) / a.active);
  return FRONT + (REST - FRONT) * clamp((t - a.windup - a.active) / a.recover, 0, 1);
}

export function drawFighter(ctx, p) {
  const color = p.flash > 0 ? '#ffffff' : PLAYER_COLORS[p.index];
  const dark = p.flash > 0 ? '#e2e8f0' : PLAYER_COLORS_DARK[p.index];
  const skin = p.flash > 0 ? '#ffffff' : '#fcd9b8';

  ctx.save();
  ctx.translate(p.x, WORLD.groundY);

  // Ground shadow.
  ctx.globalAlpha = 0.25;
  ctx.fillStyle = '#000';
  ctx.beginPath();
  ctx.ellipse(0, 2, 26, 6, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.globalAlpha = 1;

  // Face the movement/opponent direction; +x is now "forward".
  ctx.scale(p.facing, 1);

  // Death animation: fall backwards over ~0.5 s.
  if (p.state === 'dead') {
    const fall = Math.min(1, p.deadT / 0.5);
    ctx.rotate(-fall * Math.PI / 2);
    ctx.globalAlpha = 1 - Math.min(0.5, Math.max(0, p.deadT - 1.2) * 0.5);
  }

  const bob = p.moving ? Math.sin(p.walkT * 10) * 2 : 0;

  // Legs — simple walk cycle.
  ctx.strokeStyle = dark;
  ctx.lineWidth = 8;
  ctx.lineCap = 'round';
  const step = p.moving ? Math.sin(p.walkT * 10) * 11 : 0;
  ctx.beginPath();
  ctx.moveTo(-5, -32);
  ctx.lineTo(-8 + step, -2);
  ctx.moveTo(5, -32);
  ctx.lineTo(8 - step, -2);
  ctx.stroke();

  // Torso.
  ctx.fillStyle = color;
  rr(ctx, -15, -80 + bob, 30, 52, 13);
  ctx.fill();

  // Head.
  ctx.fillStyle = skin;
  ctx.beginPath();
  ctx.arc(3, -93 + bob, 14, 0, Math.PI * 2);
  ctx.fill();
  // Headband in the player color.
  ctx.fillStyle = dark;
  rr(ctx, -11, -101 + bob, 28, 7, 3);
  ctx.fill();
  // Eye looking forward.
  ctx.fillStyle = '#1e293b';
  ctx.beginPath();
  ctx.arc(10, -93 + bob, 2.6, 0, Math.PI * 2);
  ctx.fill();

  // Class-specific arms & weapon.
  const shoulder = { x: 8, y: -68 + bob };
  switch (p.cls.id) {
    case 'brawler': drawFists(ctx, p, shoulder, skin, dark); break;
    case 'sword': drawSword(ctx, p, shoulder, dark, 58); break;
    case 'tank': drawSword(ctx, p, shoulder, dark, 46); drawShield(ctx, p, dark, bob); break;
    case 'archer': drawBow(ctx, p, shoulder, dark); break;
  }

  ctx.restore();
}

function drawFists(ctx, p, sh, skin, dark) {
  const a = p.cls.attack;
  let ext = 14; // fist extension from the shoulder
  if (p.state === 'attack') {
    const t = p.t;
    if (t < a.windup) ext = 14 - 8 * (t / a.windup);
    else if (t < a.windup + a.active) ext = 6 + (a.range - 6) * ((t - a.windup) / a.active);
    else ext = a.range - (a.range - 14) * clamp((t - a.windup - a.active) / a.recover, 0, 1);
  } else if (p.state === 'dash') {
    ext = a.range; // flying punch during the dash special
  }
  ctx.strokeStyle = dark;
  ctx.lineWidth = 7;
  ctx.beginPath();
  ctx.moveTo(sh.x, sh.y);
  ctx.lineTo(sh.x + ext, sh.y - 2);
  ctx.stroke();
  ctx.fillStyle = skin;
  ctx.beginPath();
  ctx.arc(sh.x + ext + 4, sh.y - 2, 8, 0, Math.PI * 2);
  ctx.arc(sh.x - 10, sh.y + 10, 6, 0, Math.PI * 2);
  ctx.fill();
}

function drawSword(ctx, p, sh, dark, len) {
  const ang = p.state === 'dash' ? 0.1 : swingAngle(p);
  const dir = { x: Math.cos(ang), y: Math.sin(ang) };
  // Arm to the hilt.
  ctx.strokeStyle = dark;
  ctx.lineWidth = 7;
  ctx.beginPath();
  ctx.moveTo(sh.x, sh.y);
  ctx.lineTo(sh.x + dir.x * 16, sh.y + dir.y * 16);
  ctx.stroke();
  // Blade.
  ctx.strokeStyle = '#e2e8f0';
  ctx.lineWidth = 6;
  ctx.beginPath();
  ctx.moveTo(sh.x + dir.x * 18, sh.y + dir.y * 18);
  ctx.lineTo(sh.x + dir.x * (18 + len), sh.y + dir.y * (18 + len));
  ctx.stroke();
  // Crossguard.
  ctx.strokeStyle = '#a16207';
  ctx.lineWidth = 5;
  ctx.beginPath();
  ctx.moveTo(sh.x + dir.x * 18 - dir.y * 8, sh.y + dir.y * 18 + dir.x * 8);
  ctx.lineTo(sh.x + dir.x * 18 + dir.y * 8, sh.y + dir.y * 18 - dir.x * 8);
  ctx.stroke();
  // Swing trail during the active window.
  const a = p.cls.attack;
  if (p.state === 'attack' && p.t >= a.windup && p.t < a.windup + a.active) {
    ctx.globalAlpha = 0.35;
    ctx.strokeStyle = '#fff';
    ctx.lineWidth = 10;
    ctx.beginPath();
    ctx.arc(sh.x, sh.y, 18 + len - 6, -1.8, ang);
    ctx.stroke();
    ctx.globalAlpha = 1;
  }
}

function drawShield(ctx, p, dark, bob) {
  const blocking = p.state === 'block';
  const bashing = p.state === 'dash';
  const x = blocking ? 20 : bashing ? 26 : 14;
  const w = blocking || bashing ? 15 : 11;
  const h = blocking || bashing ? 62 : 44;
  const y = (blocking || bashing ? -95 : -84) + bob;
  ctx.fillStyle = '#94a3b8';
  rr(ctx, x, y, w, h, 6);
  ctx.fill();
  ctx.strokeStyle = dark;
  ctx.lineWidth = 3;
  rr(ctx, x, y, w, h, 6);
  ctx.stroke();
  // Boss.
  ctx.fillStyle = dark;
  ctx.beginPath();
  ctx.arc(x + w / 2, y + h / 2, 4, 0, Math.PI * 2);
  ctx.fill();
}

function drawBow(ctx, p, sh, dark) {
  const drawing = p.state === 'draw';
  const aim = p.aim;
  const pull = drawing ? clamp(p.charge / p.cls.bow.maxCharge, 0, 1) * 14 : 0;

  ctx.save();
  ctx.translate(sh.x + 12, sh.y + 4);
  ctx.rotate(-aim); // aim > 0 means "up", which is -y in canvas space

  // Arm along the bow.
  ctx.strokeStyle = dark;
  ctx.lineWidth = 7;
  ctx.beginPath();
  ctx.moveTo(-12, 2);
  ctx.lineTo(6, 0);
  ctx.stroke();

  // Bow limbs.
  ctx.strokeStyle = '#a16207';
  ctx.lineWidth = 5;
  ctx.beginPath();
  ctx.arc(0, 0, 26, -Math.PI / 2.4, Math.PI / 2.4);
  ctx.stroke();
  // String, pulled back while drawing.
  const tipY = 26 * Math.sin(Math.PI / 2.4);
  const tipX = 26 * Math.cos(Math.PI / 2.4);
  ctx.strokeStyle = '#e2e8f0';
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(tipX, -tipY);
  ctx.lineTo(-pull, 0);
  ctx.lineTo(tipX, tipY);
  ctx.stroke();

  // Nocked arrow.
  if (drawing && p.arrows > 0) {
    ctx.strokeStyle = '#f8fafc';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(-pull, 0);
    ctx.lineTo(30 - pull, 0);
    ctx.stroke();
    ctx.fillStyle = '#f8fafc';
    ctx.beginPath();
    ctx.moveTo(34 - pull, 0);
    ctx.lineTo(27 - pull, -4);
    ctx.lineTo(27 - pull, 4);
    ctx.fill();
  }
  ctx.restore();

  // Draw-charge indicator above the head.
  if (drawing) {
    const c = clamp(p.charge / p.cls.bow.maxCharge, 0, 1);
    ctx.strokeStyle = c >= 1 ? '#4ade80' : '#fde047';
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.arc(3, -120, 10, -Math.PI / 2, -Math.PI / 2 + c * Math.PI * 2);
    ctx.stroke();
  }
}

/** Arrow projectile (world space, not flipped). */
export function drawArrow(ctx, a) {
  ctx.save();
  ctx.translate(a.x, a.y);
  ctx.rotate(a.angle);
  ctx.globalAlpha = a.stuck ? Math.max(0, a.stuckT / 1.4) : 1;
  ctx.strokeStyle = '#f8fafc';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(-16, 0);
  ctx.lineTo(10, 0);
  ctx.stroke();
  ctx.fillStyle = '#f8fafc';
  ctx.beginPath();
  ctx.moveTo(15, 0);
  ctx.lineTo(8, -4);
  ctx.lineTo(8, 4);
  ctx.fill();
  // Fletching.
  ctx.strokeStyle = '#f87171';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(-16, 0);
  ctx.lineTo(-20, -4);
  ctx.moveTo(-16, 0);
  ctx.lineTo(-20, 4);
  ctx.stroke();
  ctx.restore();
  ctx.globalAlpha = 1;
}
