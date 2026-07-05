/**
 * combat.js — shared hit resolution for melee attacks and damage.
 *
 * Kept separate from the Player class so both regular attacks, dash
 * specials and arrows funnel through the same applyDamage() path
 * (knockback, hit-stun, death, feedback effects).
 */

import { HIT_STUN, PLAYER_HALF_W } from './config.js';

/** True if `target` is blocking against something located at fromX. */
export function isBlockingAgainst(target, fromX) {
  return target.state === 'block' && (fromX - target.x) * target.facing >= 0;
}

/**
 * Apply damage with knockback + stagger; handles death.
 * All feedback (sparks, shake, sfx) goes through the fx facade.
 */
export function applyDamage(target, damage, knockback, stun, fx) {
  if (target.state === 'dead') return;
  target.hp = Math.max(0, target.hp - damage);
  target.vx += knockback;
  target.flash = 0.14;
  fx.hitSpark(target.x, target.groundY() - 60);
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
  const dx = (target.x - attacker.x) * attacker.facing; // distance in front of attacker
  if (dx < -PLAYER_HALF_W || dx > spec.range + PLAYER_HALF_W) return false;

  if (isBlockingAgainst(target, attacker.x) && !spec.breaksGuard) {
    // Blocked: no damage, both fighters get pushed apart slightly.
    target.vx += attacker.facing * spec.knockback * 0.35;
    attacker.vx -= attacker.facing * spec.knockback * 0.45;
    fx.blockSpark(target.x - target.facing * 30, target.groundY() - 55);
    fx.sfx.block();
    fx.shake(2);
    return 'blocked';
  }

  applyDamage(target, spec.damage, attacker.facing * spec.knockback, spec.stun ?? HIT_STUN, fx);
  return 'hit';
}
