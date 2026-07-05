/**
 * config.js — all gameplay tuning in one place.
 *
 * The simulation runs in a fixed logical world of 1000x560 units; the
 * renderer letterboxes and scales it to the physical screen, so gameplay
 * is identical on every device and aspect ratio.
 */

export const WORLD = {
  width: 1000,
  height: 560,
  groundY: 480,   // y of the floor (player feet)
  wallPad: 45,    // min distance of a player from the arena edge
};

export const GRAVITY = 1500;          // arrow gravity (units/s^2)
export const ROUNDS_TO_WIN = 3;       // first to 3 round wins takes the match
export const ROUND_INTRO_TIME = 2.4;  // 3-2-1 countdown length (s)
export const ROUND_END_TIME = 2.4;    // pause after a round is decided (s)
export const HIT_STUN = 0.34;         // default stagger after taking a hit (s)
export const KB_DECAY = 8;            // knockback velocity decay rate
export const PLAYER_HALF_W = 22;      // half-width of the player hurtbox
export const PLAYER_HEIGHT = 100;     // hurtbox height above the feet

// Spawn positions at the start of every round.
export const SPAWN_X = [260, 740];

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
      type: 'triple', spread: 0.09, // radians between the three arrows
    },
  },
};

export const CLASS_LIST = ['brawler', 'sword', 'tank', 'archer'];

// Gyro aim sensitivity: radians of aim change per radian of phone tilt.
export const GYRO_PITCH_GAIN = 1.1;  // vertical tilt — coarse elevation
export const GYRO_YAW_GAIN = 0.35;   // horizontal tilt — fine trim
export const AIM_MIN = -1.25;        // radians (down)
export const AIM_MAX = 1.4;          // radians (up)
export const STICK_AIM_SPEED = 2.0;  // fallback aim speed via joystick (rad/s)

// Player identity colors.
export const PLAYER_COLORS = ['#3b82f6', '#ef4444'];
export const PLAYER_COLORS_DARK = ['#1d4ed8', '#b91c1c'];

export const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
export const lerp = (a, b, t) => a + (b - a) * t;
