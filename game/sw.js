/**
 * sw.js — minimal offline cache (PWA).
 * Bump VERSION whenever any game file changes to invalidate old caches.
 */

const VERSION = 'arena-duel-v3';
const ASSETS = [
  './',
  './index.html',
  './css/style.css',
  './manifest.json',
  './icon.svg',
  './js/main.js',
  './js/core/engine.js',
  './js/core/input.js',
  './js/core/gyro.js',
  './js/core/audio.js',
  './js/game/config.js',
  './js/game/player.js',
  './js/game/projectile.js',
  './js/game/combat.js',
  './js/game/ai.js',
  './js/game/match.js',
  './js/render/renderer3d.js',
  './js/render/fighter3d.js',
  './js/render/effects.js',
  './lib/three.module.min.js',
  './lib/three.core.min.js',
  './js/ui/hud.js',
  './js/ui/controls.js',
  './js/ui/screens.js',
];

self.addEventListener('install', (e) => {
  e.waitUntil(caches.open(VERSION).then((c) => c.addAll(ASSETS)));
  self.skipWaiting();
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== VERSION).map((k) => caches.delete(k)))),
  );
  self.clients.claim();
});

self.addEventListener('fetch', (e) => {
  e.respondWith(
    caches.match(e.request).then((hit) => hit || fetch(e.request)),
  );
});
