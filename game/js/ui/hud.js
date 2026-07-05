/**
 * hud.js — in-match heads-up display, drawn in screen space.
 *
 * Health bars for both players at the top of the screen (with a smoothed
 * white "damage trail"), round-win pips, ammo for archers and the big
 * center banners (round intro countdown, FIGHT!, round results).
 */

import { CLASSES, ROUNDS_TO_WIN, PLAYER_COLORS } from '../game/config.js';

const FONT = '"Segoe UI", system-ui, sans-serif';

export function drawHUD(ctx, match, w, h) {
  const barW = Math.min(w * 0.36, 430);
  const barH = Math.max(14, Math.min(20, h * 0.035));
  const y = 14;

  for (let i = 0; i < 2; i++) {
    const p = match.players[i];
    const x = i === 0 ? 16 : w - 16 - barW;
    const rtl = i === 1; // player 2's bar drains right-to-left

    // Frame.
    ctx.fillStyle = 'rgba(0,0,0,0.45)';
    ctx.fillRect(x - 2, y - 2, barW + 4, barH + 4);

    // Damage trail (smoothed) then current HP.
    const trail = Math.max(0, p.dispHp / p.cls.hp);
    const hp = Math.max(0, p.hp / p.cls.hp);
    ctx.fillStyle = '#f8fafc';
    fillBar(ctx, x, y, barW, barH, trail, rtl);
    ctx.fillStyle = PLAYER_COLORS[i];
    fillBar(ctx, x, y, barW, barH, hp, rtl);

    // Name + class.
    ctx.fillStyle = '#f8fafc';
    ctx.font = `bold ${Math.round(barH * 0.85)}px ${FONT}`;
    ctx.textBaseline = 'top';
    ctx.textAlign = i === 0 ? 'left' : 'right';
    ctx.fillText(
      `${match.names[i]}  ${p.cls.icon} ${p.cls.name}`,
      i === 0 ? x : x + barW,
      y + barH + 7,
    );

    // Round-win pips under the name, growing towards the center.
    for (let r = 0; r < ROUNDS_TO_WIN; r++) {
      const px = i === 0 ? x + 8 + r * 22 : x + barW - 8 - r * 22;
      const py = y + barH + 32;
      ctx.beginPath();
      ctx.arc(px, py, 7, 0, Math.PI * 2);
      ctx.fillStyle = r < p.wins ? '#fde047' : 'rgba(255,255,255,0.25)';
      ctx.fill();
    }
  }

  // Round number, top center.
  ctx.fillStyle = 'rgba(255,255,255,0.8)';
  ctx.font = `bold ${Math.round(Math.min(w, h) * 0.032)}px ${FONT}`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'top';
  ctx.fillText(`RUNDA ${match.roundNum}`, w / 2, 12);
}

function fillBar(ctx, x, y, w, h, ratio, rtl) {
  const fw = w * ratio;
  ctx.fillRect(rtl ? x + w - fw : x, y, fw, h);
}

export function drawBanner(ctx, match, w, h) {
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  const big = Math.round(Math.min(w, h) * 0.16);
  const med = Math.round(Math.min(w, h) * 0.085);

  if (match.phase === 'intro') {
    text(ctx, `RUNDA ${match.roundNum}`, w / 2, h * 0.34, med, '#f8fafc');
    text(ctx, String(match.countdown), w / 2, h * 0.52, big, '#fde047');
  } else if (match.phase === 'fight' && match.fightFlashT > 0) {
    const pop = 1 + Math.max(0, match.fightFlashT - 0.6) * 2;
    text(ctx, 'WALCZ!', w / 2, h * 0.42, big * pop, '#fde047');
  } else if (match.phase === 'roundEnd') {
    text(ctx, match.roundBanner, w / 2, h * 0.42, med, '#fde047');
  }
}

function text(ctx, str, x, y, size, color) {
  ctx.font = `bold ${Math.round(size)}px ${FONT}`;
  ctx.lineWidth = Math.max(3, size * 0.12);
  ctx.strokeStyle = 'rgba(0,0,0,0.7)';
  ctx.strokeText(str, x, y);
  ctx.fillStyle = color;
  ctx.fillText(str, x, y);
}
