/**
 * main.js — application entry point: wires the engine, renderer, input,
 * screens and match together.
 */

import { Engine } from './core/engine.js';
import { Input } from './core/input.js';
import { initAudio, sfx } from './core/audio.js';
import { WORLD, PLAYER_COLORS } from './game/config.js';
import { Match } from './game/match.js';
import { Renderer } from './render/renderer.js';
import { Particles } from './render/effects.js';
import { layoutControls } from './ui/controls.js';
import { Screens } from './ui/screens.js';

const canvas = document.getElementById('game'); // transparent UI overlay + input surface
const glCanvas = document.getElementById('gl'); // WebGL scene underneath

// Prefer the 3D renderer; fall back to pure 2D canvas when WebGL (or the
// vendored three.js module) is unavailable on the device.
let renderer;
try {
  const { Renderer3D } = await import('./render/renderer3d.js');
  renderer = new Renderer3D(glCanvas, canvas);
} catch (e) {
  console.warn('WebGL renderer unavailable — using the 2D fallback.', e);
  glCanvas.style.display = 'none';
  renderer = new Renderer(canvas);
}

const input = new Input(canvas);
const particles = new Particles();
const pauseBtn = document.getElementById('pauseBtn');

let match = null;
let paused = false;
let lastSetup = null; // remembered for the rematch button

// Feedback facade passed into the simulation — gameplay code never touches
// the renderer or particle system directly.
const fx = {
  sfx,
  hitSpark: (x, y) => particles.hitSpark(x, y),
  blockSpark: (x, y) => particles.blockSpark(x, y),
  dust: (x, y, n) => particles.dust(x, y, n),
  deathBurst: (p) => particles.deathBurst(p.x, WORLD.groundY - 55, PLAYER_COLORS[p.index]),
  shake: (power) => renderer.shake(power),
};

const screens = new Screens(document.getElementById('ui'), {
  onStart: (mode, classIds) => startMatch(mode, classIds),
  onRematch: () => startMatch(lastSetup.mode, lastSetup.classIds),
  onMenu: () => {
    match = null;
    paused = false;
    input.setControls([]);
    pauseBtn.style.display = 'none';
    screens.showMenu();
  },
  onResume: () => { paused = false; },
});

function startMatch(mode, classIds) {
  lastSetup = { mode, classIds };
  paused = false;
  match = new Match({
    mode, classIds, input, fx,
    onMatchEnd: (winner) => {
      input.setControls([]);
      pauseBtn.style.display = 'none';
      screens.showMatchEnd(
        match.names[winner], winner,
        [match.players[0].wins, match.players[1].wins],
      );
    },
  });
  screens.hide();
  pauseBtn.style.display = 'block';
  relayout();
  enterFullscreen();
}

/** Recompute canvas size and touch-control layout (resize / rotation). */
function relayout() {
  renderer.resize();
  if (match && match.phase !== 'matchEnd') {
    input.setControls(layoutControls(renderer.w, renderer.h, match));
  }
}
window.addEventListener('resize', relayout);
window.addEventListener('orientationchange', () => setTimeout(relayout, 250));

/** Best-effort fullscreen + landscape lock (silently unavailable on iOS). */
async function enterFullscreen() {
  try {
    if (!document.fullscreenElement && document.documentElement.requestFullscreen) {
      await document.documentElement.requestFullscreen({ navigationUI: 'hide' });
    }
    if (screen.orientation && screen.orientation.lock) {
      await screen.orientation.lock('landscape');
    }
  } catch { /* not supported — CSS portrait warning covers it */ }
}

// Unlock WebAudio on the first interaction anywhere (mobile requirement).
document.addEventListener('pointerdown', () => initAudio(), { capture: true });

pauseBtn.addEventListener('click', () => {
  if (!match || match.phase === 'matchEnd') return;
  paused = true;
  screens.showPause();
});

const engine = new Engine({
  update(dt) {
    if (match && !paused) {
      match.update(dt);
      particles.update(dt);
    }
    input.endFrame();
  },
  render() {
    renderer.render({ match, input, particles, paused });
  },
});

screens.showMenu();
engine.start();

// Offline support when hosted over HTTPS (skipped during local dev).
if ('serviceWorker' in navigator && location.protocol === 'https:' &&
    !['localhost', '127.0.0.1'].includes(location.hostname)) {
  navigator.serviceWorker.register('./sw.js').catch(() => {});
}

// Debug/test handle (used by the automated smoke test).
window.__game = {
  get match() { return match; },
  input, renderer, startMatch,
};
