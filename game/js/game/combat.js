/**
 * combat.js — shared hit resolution for melee attacks and damage.
 *
 * Kept separate from the Player class so regular attacks, dash specials
 * and arrows all funnel through the same applyDamage() path (knockback,
 * hit-stun, death, feedback effects).
 *
 * Directions matter in the free-roam arena: melee lands only inside the
 * attacker's frontal cone, and a raised shield protects only against
 * attacks arriving inside the blocker's frontal cone.
 */

import { HIT_STUN, PLAYER_R, MELEE_CONE, BLOCK_CONE } from './config.js';

/** True if `target` is blocking against something located at (fromX, fromZ). */
export function isBlockingAgainst(target, fromX, fromZ) {
  if (target.state !== 'block') return false;
  const dx = fromX - target.x;
  const dz = fromZ - target.z;
  const d = Math.hypot(dx, dz) || 1;
  const dot = (dx / d) * Math.cos(target.heading) + (dz / d) * Math.sin(target.heading);
  return dot >= BLOCK_CONE;
}

/**
 * Apply damage with knockback + stagger; handles death.
 * Knockback is a world-space (x, z) impulse.
 */
export function applyDamage(target, damage, kbx, kbz, stun, fx) {
  if (target.state === 'dead') return;
  target.hp = Math.max(0, target.hp - damage);
  target.kbx += kbx;
  target.kbz += kbz;
  target.flash = 0.14;
  fx.hitSpark(target.x, 60, target.z);
  fx.shake(Math.min(8, 2 + damage * 0.35));

  if (target.hp <= 0) {
    target.die();
    fx.deathBurst(target);
    fx.sfx.death();
  } else {
    target.state = 'hitstun';
    target.t = stun;
    fx.sfx.hit();
  }
}

/**
 * Resolve one melee strike from `attacker` against `target`.
 * spec: { range, damage, knockback, stun?, breaksGuard? }
 * Returns 'hit' | 'blocked' | false (missed).
 */
export function tryMeleeHit(attacker, target, spec, fx) {
  if (target.state === 'dead') return false;
  const dx = target.x - attacker.x;
  const dz = target.z - attacker.z;
  const dist = Math.hypot(dx, dz);
  if (dist - PLAYER_R > spec.range + PLAYER_R) return false;

  // Frontal cone check — you cannot hit what is behind you.
  const nx = dx / (dist || 1);
  const nz = dz / (dist || 1);
  const facingDot = nx * Math.cos(attacker.heading) + nz * Math.sin(attacker.heading);
  if (facingDot < MELEE_CONE) return false;

  if (isBlockingAgainst(target, attacker.x, attacker.z) && !spec.breaksGuard) {
    // Blocked: no damage, both fighters get pushed apart slightly.
    const push = spec.knockback;
    target.kbx += nx * push * 0.35;
    target.kbz += nz * push * 0.35;
    attacker.kbx -= nx * push * 0.45;
    attacker.kbz -= nz * push * 0.45;
    fx.blockSpark(target.x - nx * 26, 55, target.z - nz * 26);
    fx.sfx.block();
    fx.shake(2);
    return 'blocked';
  }

  applyDamage(target, spec.damage, nx * spec.knockback, nz * spec.knockback,
    spec.stun ?? HIT_STUN, fx);
  return 'hit';
}
