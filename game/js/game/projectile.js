/**
 * projectile.js — 3D arrow ballistics.
 *
 * Arrows fly through the arena volume: constant gravity on y, straight
 * flight on x/z. They collide with players (cylindrical hurtboxes), with
 * plaza props (cover!) and with the ground, where they stick briefly.
 * The arrows array is iterated in place — no per-frame allocations.
 */

import { WORLD, GRAVITY, OBSTACLES, PLAYER_R, PLAYER_HEIGHT, HIT_STUN } from './config.js';
import { applyDamage, isBlockingAgainst } from './combat.js';

export class Arrow {
  constructor(owner, x, y, z, vx, vy, vz, damage) {
    this.owner = owner;       // player index that fired it
    this.x = x; this.y = y; this.z = z;
    this.vx = vx; this.vy = vy; this.vz = vz;
    this.damage = damage;
    this.stuck = false;       // in the ground / a prop, fading out
    this.stuckT = 0;
    this.dead = false;
  }
}

/**
 * Advance all arrows and resolve their collisions. Removes dead arrows
 * in place.
 */
export function updateArrows(arrows, players, fx, dt) {
  for (let i = arrows.length - 1; i >= 0; i--) {
    const a = arrows[i];

    if (a.stuck) {
      a.stuckT -= dt;
      if (a.stuckT <= 0) a.dead = true;
    } else {
      a.vy -= GRAVITY * dt;
      a.x += a.vx * dt;
      a.y += a.vy * dt;
      a.z += a.vz * dt;

      if (a.y <= 0) {
        // Ground impact — stick and fade out.
        a.y = 0;
        a.stuck = true;
        a.stuckT = 1.4;
        fx.sfx.arrowStick();
        fx.dust(a.x, a.z, 3);
      } else if (a.x < -120 || a.x > WORLD.width + 120 ||
                 a.z < -120 || a.z > WORLD.depth + 120 || a.y > 1200) {
        a.dead = true;
      } else if (hitObstacle(a)) {
        a.stuck = true;
        a.stuckT = 1.0;
        fx.sfx.arrowStick();
      } else {
        hitTestPlayers(a, players, fx);
      }
    }

    if (a.dead) arrows.splice(i, 1);
  }
}

/** Props provide cover: cylindrical collision against every obstacle. */
function hitObstacle(a) {
  for (const o of OBSTACLES) {
    if (a.y < o.h && Math.hypot(a.x - o.x, a.z - o.z) < o.r) return true;
  }
  return false;
}

function hitTestPlayers(a, players, fx) {
  for (const p of players) {
    if (p.index === a.owner || p.state === 'dead') continue;
    if (a.y > PLAYER_HEIGHT) continue;
    if (Math.hypot(a.x - p.x, a.z - p.z) > PLAYER_R + 6) continue;

    // A raised shield stops arrows arriving from the front.
    if (isBlockingAgainst(p, a.x - a.vx * 0.02, a.z - a.vz * 0.02)) {
      fx.blockSpark(a.x, a.y, a.z);
      fx.sfx.block();
    } else {
      const hv = Math.hypot(a.vx, a.vz) || 1;
      applyDamage(p, a.damage, (a.vx / hv) * 180, (a.vz / hv) * 180, HIT_STUN, fx);
    }
    a.dead = true;
    return;
  }
}
