/**
 * controls.js — on-screen touch controls: layout + rendering.
 *
 * Layout is computed from the current screen size (called again on every
 * resize/rotation) and registered with the Input manager for hit-testing.
 * Player 1's cluster sits in the bottom-left corner, player 2's is
 * mirrored bottom-right. In bot mode only player 1 gets controls.
 *
 * Per player:
 *   - virtual joystick (move left/right; vertical axis trims bow aim)
 *   - ATTACK  (melee swing, or hold-to-draw / release-to-fire for archers)
 *   - SPECIAL (class ability, radial cooldown indicator)
 *   - BLOCK   (only for the sword & shield class — a dedicated button)
 */

import { clamp } from '../game/config.js';

export function layoutControls(w, h, match) {
  const R = clamp(Math.min(w, h) * 0.085, 34, 60);
  const controls = [];
  const humans = match.ai ? [0] : [0, 1];

  for (const pi of humans) {
    const cls = match.players[pi].cls;
    // Mirror x for player 2.
    const mx = (x) => (pi === 0 ? x : w - x);

    controls.push(
      { id: 'stick', type: 'stick', player: pi, x: mx(R * 2.0), y: h - R * 1.9, r: R * 1.15 },
      { id: 'attack', type: 'button', player: pi, x: mx(R * 5.1), y: h - R * 1.5, r: R * 0.95 },
      { id: 'special', type: 'button', player: pi, x: mx(R * 4.4), y: h - R * 3.4, r: R * 0.62 },
    );
    if (cls.canBlock) {
      controls.push(
        { id: 'block', type: 'button', player: pi, x: mx(R * 6.7), y: h - R * 2.9, r: R * 0.7 },
      );
    }
  }
  return controls;
}

const ICONS = { block: '🛡️' };

export function drawControls(ctx, input, match, w, h) {
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';

  for (const c of input.controls) {
    const p = match.players[c.player];
    const vis = input.visual(c);

    if (c.type === 'stick') {
      // Base ring.
      ctx.globalAlpha = 0.28;
      ctx.fillStyle = '#000';
      circle(ctx, c.x, c.y, c.r);
      ctx.globalAlpha = 0.5;
      ctx.strokeStyle = '#fff';
      ctx.lineWidth = 2;
      ring(ctx, c.x, c.y, c.r);
      // Knob follows the touch.
      ctx.globalAlpha = vis.active ? 0.75 : 0.45;
      ctx.fillStyle = '#fff';
      circle(ctx, c.x + vis.x * c.r * 0.5, c.y + vis.y * c.r * 0.5, c.r * 0.42);
      ctx.globalAlpha = 1;
      continue;
    }

    const active = vis.active;
    ctx.globalAlpha = active ? 0.6 : 0.3;
    ctx.fillStyle = active ? '#fff' : '#000';
    circle(ctx, c.x, c.y, c.r);
    ctx.globalAlpha = 0.6;
    ctx.strokeStyle = '#fff';
    ctx.lineWidth = 2;
    ring(ctx, c.x, c.y, c.r);
    ctx.globalAlpha = 1;

    // Icon.
    let icon = ICONS[c.id];
    if (c.id === 'attack') icon = p.cls.ranged ? '🏹' : '⚔️';
    if (c.id === 'special') icon = p.cls.special.icon;
    ctx.font = `${Math.round(c.r * 0.9)}px system-ui`;
    ctx.fillText(icon, c.x, c.y + 1);

    // Special cooldown sweep.
    if (c.id === 'special' && p.specialCd > 0) {
      const frac = p.specialCd / p.cls.special.cooldown;
      ctx.globalAlpha = 0.55;
      ctx.fillStyle = '#000';
      ctx.beginPath();
      ctx.moveTo(c.x, c.y);
      ctx.arc(c.x, c.y, c.r, -Math.PI / 2, -Math.PI / 2 + frac * Math.PI * 2);
      ctx.closePath();
      ctx.fill();
      ctx.globalAlpha = 1;
    }

    // Archer ammo counter next to the attack button.
    if (c.id === 'attack' && p.cls.ranged) {
      ctx.font = `bold ${Math.round(c.r * 0.5)}px system-ui`;
      ctx.fillStyle = p.arrows > 0 ? '#f8fafc' : '#f87171';
      ctx.strokeStyle = 'rgba(0,0,0,0.7)';
      ctx.lineWidth = 3;
      const tx = c.x;
      const ty = c.y - c.r - 14;
      ctx.strokeText(`➶ ${p.arrows}`, tx, ty);
      ctx.fillText(`➶ ${p.arrows}`, tx, ty);
    }
  }
}

function circle(ctx, x, y, r) {
  ctx.beginPath();
  ctx.arc(x, y, r, 0, Math.PI * 2);
  ctx.fill();
}

function ring(ctx, x, y, r) {
  ctx.beginPath();
  ctx.arc(x, y, r, 0, Math.PI * 2);
  ctx.stroke();
}
