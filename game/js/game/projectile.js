/**
 * projectile.js — arrow physics.
 *
 * Arrows fly on a proper ballistic trajectory (constant gravity, no drag)
 * and rotate to follow their velocity vector. They can be blocked by a
 * shield raised towards the shooter, stick into the ground briefly, and
 * despawn off-screen. The arrows array is kept small and iterated in
 * place — no per-frame allocations.
 */

import { WORLD, GRAVITY, PLAYER_HALF_W, PLAYER_HEIGHT, HIT_STUN } from './config.js';
import { applyDamage, isBlockingAgainst } from './combat.js';

export class Arrow {
  constructor(owner, x, y, vx, vy, damage) {
    this.owner = owner;       // player index that fired it
    this.x = x;
    this.y = y;
    this.vx = vx;
    this.vy = vy;
    this.damage = damage;
    this.angle = Math.atan2(vy, vx);
    this.stuck = false;       // lying in the ground, fading out
    this.stuckT = 0;
    this.dead = false;
  }
}

/**
 * Advance all arrows and resolve their collisions with players/ground.
 * Removes dead arrows in place.
 */
export function updateArrows(arrows, players, fx, dt) {
  for (let i = arrows.length - 1; i >= 0; i--) {
    const a = arrows[i];

    if (a.stuck) {
      a.stuckT -= dt;
      if (a.stuckT <= 0) a.dead = true;
    } else {
      a.vy += GRAVITY * dt;
      a.x += a.vx * dt;
      a.y += a.vy * dt;
      a.angle = Math.atan2(a.vy, a.vx);

      // Ground impact — stick and fade out.
      if (a.y >= WORLD.groundY) {
        a.y = WORLD.groundY;
        a.stuck = true;
        a.stuckT = 1.4;
        fx.sfx.arrowStick();
        fx.dust(a.x, WORLD.groundY, 3);
      } else if (a.x < -80 || a.x > WORLD.width + 80 || a.y < -600) {
        a.dead = true;
      } else {
        hitTestPlayers(a, players, fx);
      }
    }

    if (a.dead) arrows.splice(i, 1);
  }
}

function hitTestPlayers(a, players, fx) {
  for (const p of players) {
    if (p.index === a.owner || p.state === 'dead') continue;
    const withinX = Math.abs(a.x - p.x) < PLAYER_HALF_W + 6;
    const withinY = a.y > WORLD.groundY - PLAYER_HEIGHT && a.y < WORLD.groundY;
    if (!withinX || !withinY) continue;

    // A raised shield stops arrows arriving from the front.
    if (isBlockingAgainst(p, a.x) && a.vx * p.facing < 0) {
      fx.blockSpark(p.x + p.facing * 28, a.y);
      fx.sfx.block();
    } else {
      applyDamage(p, a.damage, Math.sign(a.vx) * 180, HIT_STUN, fx);
    }
    a.dead = true;
    return;
  }
}
