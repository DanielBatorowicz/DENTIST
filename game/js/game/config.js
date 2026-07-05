/**
 * config.js — all gameplay tuning in one place.
 *
 * The game simulates a free-roam 3D arena: a town plaza. Coordinates are
 * world units with x = east, z = south and y = up (0 = ground). Players
 * move freely on the x/z plane; arrows fly with real 3D ballistics.
 */

export const WORLD = {
  width: 1100,   // arena size along x
  depth: 700,    // arena size along z
  wallPad: 60,   // min distance of a player from the arena edge
};

export const GRAVITY = 1500;          // arrow gravity (units/s^2)
export const ROUNDS_TO_WIN = 3;       // first to 3 round wins takes the match
export const ROUND_INTRO_TIME = 2.4;  // 3-2-1 countdown length (s)
export const ROUND_END_TIME = 2.4;    // pause after a round is decided (s)
export const HIT_STUN = 0.34;         // default stagger after taking a hit (s)
export const KB_DECAY = 8;            // knockback velocity decay rate
export const PLAYER_R = 20;           // body radius (movement & hurtbox)
export const PLAYER_HEIGHT = 105;     // hurtbox height above the feet
export const BOW_H = 62;              // height arrows are fired from
export const TURN_SPEED = 12;         // heading tracking speed (rad/s)

// Melee connects only inside this frontal cone (dot-product threshold).
export const MELEE_CONE = 0.45;   // ~63° half-angle
// A shield protects against attacks arriving inside this frontal cone.
export const BLOCK_CONE = 0.35;   // ~70° half-angle

// Round-start spawn points, facing each other across the plaza.
export const SPAWN = [
  { x: 270, z: 350 },
  { x: 830, z: 350 },
];

/**
 * Solid props on the plaza. Players cannot walk through them and arrows
 * are stopped by them (cover!). Cylindrical collision: radius r, height h.
 * The renderer builds matching visuals from `type`.
 */
export const OBSTACLES = [
  { x: 550, z: 350, r: 62, h: 40, type: 'fountain' },
  { x: 315, z: 165, r: 26, h: 42, type: 'crate' },
  { x: 795, z: 535, r: 26, h: 42, type: 'crate' },
  { x: 330, z: 555, r: 20, h: 48, type: 'barrel' },
  { x: 780, z: 155, r: 20, h: 48, type: 'barrel' },
];

/**
 * Character classes. All four are defined by data so balancing is a matter
 * of editing numbers, not code.
 *
 * Melee attack timing: windup -> active (hit window) -> recover, then the
 * attack button is locked for `cooldown` seconds counted from the start.
 */
export const CLASSES = {
  brawler: {
    id: 'brawler',
    name: 'Walka wręcz',
    icon: '👊',
    desc: 'Bardzo szybki, ciosy z bliska',
    hp: 100,
    speed: 275,
    canBlock: false,
    attack: { range: 62, damage: 8, windup: 0.07, active: 0.09, recover: 0.10, cooldown: 0.26, knockback: 150 },
    special: {
      name: 'Szarża', icon: '⚡', cooldown: 5,
      type: 'dash', speed: 780, duration: 0.22, damage: 12, knockback: 320, stun: 0.4,
    },
  },
  sword: {
    id: 'sword',
    name: 'Miecz',
    icon: '🗡️',
    desc: 'Średni zasięg, balans ataku i obrony',
    hp: 115,
    speed: 210,
    canBlock: false,
    attack: { range: 96, damage: 14, windup: 0.16, active: 0.12, recover: 0.18, cooldown: 0.46, knockback: 240 },
    special: {
      name: 'Wypad', icon: '⚡', cooldown: 6,
      type: 'dash', speed: 660, duration: 0.2, damage: 18, knockback: 380, stun: 0.45,
    },
  },
  tank: {
    id: 'tank',
    name: 'Miecz i tarcza',
    icon: '🛡️',
    desc: 'Wolny, ale blokuje ataki z przodu',
    hp: 135,
    speed: 160,
    canBlock: true,
    attack: { range: 90, damage: 16, windup: 0.22, active: 0.12, recover: 0.24, cooldown: 0.62, knockback: 270 },
    special: {
      name: 'Taran', icon: '⚡', cooldown: 7,
      type: 'dash', speed: 540, duration: 0.24, damage: 10, knockback: 420, stun: 1.0,
      breaksGuard: true, // shield bash goes through an enemy block
    },
  },
  archer: {
    id: 'archer',
    name: 'Łucznik',
    icon: '🏹',
    desc: 'Walka na dystans, celowanie żyroskopem',
    hp: 90,
    speed: 190,
    canBlock: false,
    ranged: true,
    bow: {
      maxArrows: 5,        // quiver size
      regen: 2.2,          // seconds to regenerate one arrow
      minSpeed: 520,       // arrow speed at minimum draw
      maxSpeed: 1000,      // arrow speed at full draw
      maxCharge: 0.9,      // seconds to reach a full draw
      damageMin: 7,
      damageMax: 18,
      moveFactor: 0.4,     // movement speed multiplier while drawing
    },
    special: {
      name: 'Potrójny strzał', icon: '⚡', cooldown: 8,
      type: 'triple', spread: 0.12, // radians between the three arrows (yaw)
    },
  },
};

export const CLASS_LIST = ['brawler', 'sword', 'tank', 'archer'];

// Gyro aiming (archer): the ballistic elevation towards the opponent is
// solved automatically; tilting the phone adjusts it around that solution.
export const GYRO_PITCH_GAIN = 1.0;  // vertical tilt — elevation offset
export const GYRO_YAW_GAIN = 0.8;    // horizontal tilt — left/right trim
export const AIM_MIN = -0.5;         // radians below horizontal
export const AIM_MAX = 1.35;         // radians above horizontal
export const YAW_TRIM_MAX = 0.5;     // max horizontal trim (radians)

// Player identity colors.
export const PLAYER_COLORS = ['#3b82f6', '#ef4444'];
export const PLAYER_COLORS_DARK = ['#1d4ed8', '#b91c1c'];

export const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
export const lerp = (a, b, t) => a + (b - a) * t;

/** Shortest-arc angle difference a→b, in (-PI, PI]. */
export function angleDiff(a, b) {
  let d = (b - a) % (Math.PI * 2);
  if (d > Math.PI) d -= Math.PI * 2;
  if (d < -Math.PI) d += Math.PI * 2;
  return d;
}
