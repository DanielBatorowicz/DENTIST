/**
 * renderer3d.js — WebGL renderer (Three.js) with a 2D UI overlay.
 *
 * The gameplay plane sits at z = 0: three-space X = world x − 500,
 * Y = groundY − world y (up). A perspective camera looks slightly down at
 * the arena, so the flat side-view gameplay gains real depth: lit low-poly
 * mountains, a shadow-casting sun, torch point lights and fog.
 *
 * HP bars, banners and touch controls are still drawn by the existing 2D
 * modules onto a transparent overlay canvas — that code is shared with the
 * 2D fallback renderer (used automatically when WebGL is unavailable).
 *
 * Mobile budget: one 1024px shadow map, two point lights, instanced
 * particles/aim-dots, pixel ratio capped at 2.
 */

import * as THREE from '../../lib/three.module.min.js';
import { WORLD, GRAVITY, PLAYER_COLORS, clamp, lerp } from '../game/config.js';
import { Fighter3D } from './fighter3d.js';
import { drawHUD, drawBanner } from '../ui/hud.js';
import { drawControls } from '../ui/controls.js';

const ARROW_POOL = 32;
const AIM_DOTS = 26;
const w2x = (x) => x - WORLD.width / 2;
const w2y = (y) => WORLD.groundY - y;

export class Renderer3D {
  /**
   * @param {HTMLCanvasElement} glCanvas  WebGL target
   * @param {HTMLCanvasElement} uiCanvas  transparent 2D overlay on top
   */
  constructor(glCanvas, uiCanvas) {
    this.uiCanvas = uiCanvas;
    this.ui = uiCanvas.getContext('2d');
    this.shakeP = 0;
    this._matchRef = null;
    this._fighters = [];
    this._dummy = new THREE.Object3D();
    this._color = new THREE.Color();

    this.renderer = new THREE.WebGLRenderer({ canvas: glCanvas, antialias: true });
    if (!this.renderer.getContext()) throw new Error('WebGL unavailable');
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    this.scene = new THREE.Scene();
    this.scene.fog = new THREE.Fog(0x3b1d6e, 1300, 2800);
    this.scene.background = this._skyTexture();

    this.camera = new THREE.PerspectiveCamera(45, 2, 10, 4000);
    this._camBase = new THREE.Vector3(0, 215, 950);
    this.camera.position.copy(this._camBase);
    this.camera.lookAt(0, 105, 0);

    this._buildArena();
    this._buildPools();
    this.resize();
  }

  // --- scene construction ---------------------------------------------------

  _skyTexture() {
    const c = document.createElement('canvas');
    c.width = 2;
    c.height = 256;
    const g = c.getContext('2d');
    const grad = g.createLinearGradient(0, 0, 0, 256);
    grad.addColorStop(0, '#171338');
    grad.addColorStop(0.55, '#4c1d95');
    grad.addColorStop(1, '#9d4b6b');
    g.fillStyle = grad;
    g.fillRect(0, 0, 2, 256);
    return new THREE.CanvasTexture(c);
  }

  _buildArena() {
    // Lights.
    this.scene.add(new THREE.HemisphereLight(0x9a8cff, 0x2a1a3e, 1.3));
    const sun = new THREE.DirectionalLight(0xffe8c8, 2.3);
    sun.position.set(350, 650, 450);
    sun.castShadow = true;
    sun.shadow.mapSize.set(1024, 1024);
    Object.assign(sun.shadow.camera, { left: -650, right: 650, top: 400, bottom: -100, near: 100, far: 2000 });
    sun.shadow.camera.updateProjectionMatrix();
    this.scene.add(sun);

    // Ground.
    const ground = new THREE.Mesh(
      new THREE.PlaneGeometry(6000, 3200),
      new THREE.MeshStandardMaterial({ color: 0x2d2438, roughness: 0.95 }),
    );
    ground.rotation.x = -Math.PI / 2;
    ground.position.z = -600;
    ground.receiveShadow = true;
    this.scene.add(ground);

    // A lighter fighting strip so the arena reads clearly.
    const strip = new THREE.Mesh(
      new THREE.BoxGeometry(WORLD.width + 60, 4, 220),
      new THREE.MeshStandardMaterial({ color: 0x453558, roughness: 0.9 }),
    );
    strip.position.set(0, -1, 0);
    strip.receiveShadow = true;
    this.scene.add(strip);

    // Low-poly mountains in two depth layers.
    const mkMountain = (x, z, w, h, color) => {
      const m = new THREE.Mesh(
        new THREE.ConeGeometry(w, h, 4),
        new THREE.MeshStandardMaterial({ color, roughness: 1, flatShading: true }),
      );
      m.position.set(x, h / 2 - 5, z);
      m.rotation.y = Math.random() * Math.PI;
      this.scene.add(m);
    };
    mkMountain(-700, -900, 420, 380, 0x2a2052);
    mkMountain(-150, -1100, 520, 460, 0x241a48);
    mkMountain(450, -950, 380, 330, 0x2a2052);
    mkMountain(950, -1200, 560, 500, 0x241a48);
    mkMountain(-1200, -1150, 500, 430, 0x241a48);
    // Foreground rocks for parallax depth.
    for (const [x, z, s] of [[-620, 160, 26], [640, 190, 32], [-380, -260, 40], [520, -300, 34]]) {
      const rock = new THREE.Mesh(
        new THREE.DodecahedronGeometry(s, 0),
        new THREE.MeshStandardMaterial({ color: 0x3a2d50, roughness: 1, flatShading: true }),
      );
      rock.position.set(x, s * 0.5, z);
      rock.castShadow = rock.receiveShadow = true;
      this.scene.add(rock);
    }

    // Moon.
    const moon = new THREE.Mesh(
      new THREE.SphereGeometry(46, 20, 16),
      new THREE.MeshBasicMaterial({ color: 0xfef9c3, fog: false }),
    );
    moon.position.set(380, 470, -1600);
    this.scene.add(moon);

    // Stars.
    const starPos = new Float32Array(140 * 3);
    for (let i = 0; i < 140; i++) {
      starPos[i * 3] = (Math.random() - 0.5) * 3600;
      starPos[i * 3 + 1] = 150 + Math.random() * 900;
      starPos[i * 3 + 2] = -1700;
    }
    const starGeo = new THREE.BufferGeometry();
    starGeo.setAttribute('position', new THREE.BufferAttribute(starPos, 3));
    this.scene.add(new THREE.Points(starGeo,
      new THREE.PointsMaterial({ color: 0xe0d9ff, size: 3, sizeAttenuation: false, fog: false })));

    // Boundary torches with flickering point lights.
    this._flames = [];
    this._torchLights = [];
    for (const wx of [WORLD.wallPad - 20, WORLD.width - WORLD.wallPad + 20]) {
      const x = w2x(wx);
      const post = new THREE.Mesh(
        new THREE.CylinderGeometry(4, 5, 95, 6),
        new THREE.MeshStandardMaterial({ color: 0x3f3350, roughness: 0.9 }),
      );
      post.position.set(x, 47, 0);
      post.castShadow = true;
      const flame = new THREE.Mesh(
        new THREE.SphereGeometry(8, 8, 8),
        new THREE.MeshBasicMaterial({ color: 0xfb923c }),
      );
      flame.position.set(x, 102, 0);
      const light = new THREE.PointLight(0xfb923c, 14000, 420, 2);
      light.position.set(x, 108, 20);
      this.scene.add(post, flame, light);
      this._flames.push(flame);
      this._torchLights.push(light);
    }
  }

  _buildPools() {
    // Arrow meshes, recycled across the match.
    this._arrowMeshes = [];
    const shaftGeo = new THREE.CylinderGeometry(1.2, 1.2, 26, 5);
    shaftGeo.rotateZ(-Math.PI / 2);
    const tipGeo = new THREE.ConeGeometry(2.8, 8, 6);
    tipGeo.rotateZ(-Math.PI / 2);
    tipGeo.translate(16, 0, 0);
    const fleGeo = new THREE.BoxGeometry(6, 4, 1);
    fleGeo.translate(-13, 0, 0);
    const shaftMat = new THREE.MeshStandardMaterial({ color: 0xf8fafc, roughness: 0.5 });
    const fleMat = new THREE.MeshStandardMaterial({ color: 0xf87171, roughness: 0.8 });
    for (let i = 0; i < ARROW_POOL; i++) {
      const g = new THREE.Group();
      g.add(new THREE.Mesh(shaftGeo, shaftMat), new THREE.Mesh(tipGeo, shaftMat), new THREE.Mesh(fleGeo, fleMat));
      g.visible = false;
      this.scene.add(g);
      this._arrowMeshes.push(g);
    }

    // Instanced particles fed by the shared 2D particle pool.
    this._partMesh = new THREE.InstancedMesh(
      new THREE.BoxGeometry(1, 1, 1),
      new THREE.MeshBasicMaterial({ color: 0xffffff }),
      160,
    );
    this._partMesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
    this.scene.add(this._partMesh);

    // Aim-guide dots, one instanced set per player.
    this._aimDots = [0, 1].map((i) => {
      const m = new THREE.InstancedMesh(
        new THREE.SphereGeometry(3.5, 6, 6),
        new THREE.MeshBasicMaterial({ color: PLAYER_COLORS[i] }),
        AIM_DOTS,
      );
      m.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
      this.scene.add(m);
      return m;
    });
  }

  // --- public API (same shape as the 2D Renderer) -----------------------------

  resize() {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    this.w = window.innerWidth;
    this.h = window.innerHeight;
    this.dpr = dpr;

    this.renderer.setPixelRatio(dpr);
    this.renderer.setSize(this.w, this.h);

    this.uiCanvas.width = Math.round(this.w * dpr);
    this.uiCanvas.height = Math.round(this.h * dpr);
    this.uiCanvas.style.width = this.w + 'px';
    this.uiCanvas.style.height = this.h + 'px';

    // Fit the camera so the whole 1000x560 arena is always on screen.
    const aspect = this.w / this.h;
    const dist = this._camBase.z;
    const fovH = 2 * Math.atan(540 / dist);
    let fovV = 2 * Math.atan(Math.tan(fovH / 2) / aspect);
    fovV = Math.max(fovV, 2 * Math.atan(330 / dist));
    this.camera.fov = THREE.MathUtils.radToDeg(fovV);
    this.camera.aspect = aspect;
    this.camera.updateProjectionMatrix();
  }

  shake(power) {
    this.shakeP = Math.min(14, this.shakeP + power);
  }

  /** @param {{match, input, particles, paused:boolean}} game */
  render(game) {
    const time = performance.now() / 1000;

    // Torch flicker.
    for (let i = 0; i < this._flames.length; i++) {
      const f = 1 + Math.sin(time * 11 + i * 4) * 0.18 + Math.sin(time * 23 + i) * 0.08;
      this._flames[i].scale.setScalar(f);
      this._torchLights[i].intensity = 14000 * f;
    }

    // Camera shake.
    this.camera.position.set(
      this._camBase.x + (Math.random() - 0.5) * this.shakeP,
      this._camBase.y + (Math.random() - 0.5) * this.shakeP,
      this._camBase.z,
    );
    this.shakeP *= 0.86;

    const match = game.match;
    if (match !== this._matchRef) this._rebuildFighters(match);
    if (match) {
      for (const f of this._fighters) f.sync(time);
      this._syncArrows(match.arrows);
      this._syncParticles(game.particles);
      this._syncAimGuides(match.players);
    } else {
      // Idle menu background: slow camera sway.
      this.camera.position.x += Math.sin(time * 0.3) * 18;
    }

    this.renderer.render(this.scene, this.camera);
    this._renderOverlay(game);
  }

  // --- per-frame sync ----------------------------------------------------------

  _rebuildFighters(match) {
    for (const f of this._fighters) f.dispose(this.scene);
    this._fighters = [];
    this._matchRef = match;
    if (!match) return;
    for (const p of match.players) {
      const f = new Fighter3D(p);
      this.scene.add(f.root);
      this._fighters.push(f);
    }
  }

  _syncArrows(arrows) {
    for (let i = 0; i < ARROW_POOL; i++) {
      const mesh = this._arrowMeshes[i];
      const a = arrows[i];
      if (!a) { mesh.visible = false; continue; }
      mesh.visible = true;
      mesh.position.set(w2x(a.x), w2y(a.y), 0);
      mesh.rotation.z = -a.angle; // canvas angles are y-down
      // Stuck arrows shrink away instead of alpha-fading (cheaper).
      mesh.scale.setScalar(a.stuck ? Math.max(0.01, a.stuckT / 1.4) : 1);
    }
  }

  _syncParticles(particles) {
    const d = this._dummy;
    let n = 0;
    for (const p of particles.pool) {
      if (!p.alive) continue;
      d.position.set(w2x(p.x), w2y(p.y), 24);
      // Encode remaining life as scale (no per-instance alpha needed).
      const s = p.size * (0.4 + 0.6 * (p.life / p.maxLife));
      d.scale.setScalar(s);
      d.rotation.set(p.life * 7, p.life * 5, 0);
      d.updateMatrix();
      this._partMesh.setMatrixAt(n, d.matrix);
      this._partMesh.setColorAt(n, this._color.set(p.color));
      n++;
    }
    this._partMesh.count = n;
    this._partMesh.instanceMatrix.needsUpdate = true;
    if (this._partMesh.instanceColor) this._partMesh.instanceColor.needsUpdate = true;
  }

  /** Ballistic trajectory preview while an archer draws — mirrors projectile.js. */
  _syncAimGuides(players) {
    const d = this._dummy;
    for (let pi = 0; pi < 2; pi++) {
      const p = players[pi];
      const mesh = this._aimDots[pi];
      if (p.state !== 'draw' || !p.cls.ranged || p.arrows <= 0) {
        mesh.count = 0;
        mesh.instanceMatrix.needsUpdate = true;
        continue;
      }
      const bow = p.cls.bow;
      const power = clamp(p.charge / bow.maxCharge, 0.15, 1);
      const speed = lerp(bow.minSpeed, bow.maxSpeed, power);
      let x = p.x + p.facing * 30;
      let y = WORLD.groundY - 62;
      let vx = Math.cos(p.aim) * speed * p.facing;
      let vy = -Math.sin(p.aim) * speed;
      const dt = 0.045;
      let n = 0;
      for (let i = 0; i < AIM_DOTS; i++) {
        vy += GRAVITY * dt;
        x += vx * dt;
        y += vy * dt;
        if (y > WORLD.groundY) break;
        d.position.set(w2x(x), w2y(y), 6);
        d.scale.setScalar(1 - (i / AIM_DOTS) * 0.75);
        d.updateMatrix();
        mesh.setMatrixAt(n++, d.matrix);
      }
      mesh.count = n;
      mesh.instanceMatrix.needsUpdate = true;
    }
  }

  /** HP bars, banners, touch controls, pause dim — shared 2D UI modules. */
  _renderOverlay(game) {
    const { ui, w, h } = this;
    ui.setTransform(this.dpr, 0, 0, this.dpr, 0, 0);
    ui.clearRect(0, 0, w, h);
    const match = game.match;
    if (!match) return;
    drawHUD(ui, match, w, h);
    drawBanner(ui, match, w, h);
    if (match.phase === 'intro' || match.phase === 'fight') {
      drawControls(ui, game.input, match, w, h);
    }
    if (game.paused) {
      ui.fillStyle = 'rgba(0,0,0,0.55)';
      ui.fillRect(0, 0, w, h);
    }
  }
}
