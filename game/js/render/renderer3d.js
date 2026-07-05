/**
 * renderer3d.js — WebGL renderer (Three.js): an open town-plaza arena.
 *
 * World mapping: scene x = world x − width/2, scene z = world z − depth/2,
 * y is up. The fight happens on a paved plaza surrounded by low-poly
 * buildings with lit windows, street lamps, trees and mountains on the
 * horizon. A chase camera follows the midpoint between the fighters and
 * zooms with their separation; in the menu it slowly orbits the plaza.
 *
 * HP bars, banners and touch controls are drawn by the 2D UI modules onto
 * a transparent overlay canvas above the WebGL view.
 *
 * Mobile budget: one 1024px shadow map, three point lights, shared
 * building textures, instanced particles/aim-dots, pixel ratio cap 2.
 */

import * as THREE from '../../lib/three.module.min.js';
import { WORLD, GRAVITY, OBSTACLES, PLAYER_COLORS, BOW_H, clamp, lerp } from '../game/config.js';
import { Fighter3D } from './fighter3d.js';
import { drawHUD, drawBanner } from '../ui/hud.js';
import { drawControls } from '../ui/controls.js';

const ARROW_POOL = 32;
const AIM_DOTS = 26;
const CX = WORLD.width / 2;
const CZ = WORLD.depth / 2;

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
    this._v = new THREE.Vector3();
    this._toScene = (x, y, z) => this._v.set(x - CX, y, z - CZ);

    this.renderer = new THREE.WebGLRenderer({ canvas: glCanvas, antialias: true });
    if (!this.renderer.getContext()) throw new Error('WebGL unavailable');
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    this.scene = new THREE.Scene();
    this.scene.fog = new THREE.Fog(0x3b1d6e, 1500, 3200);
    this.scene.background = this._skyTexture();

    this.camera = new THREE.PerspectiveCamera(48, 2, 10, 5000);
    this._camPos = new THREE.Vector3(0, 520, 640);
    this._camLook = new THREE.Vector3(0, 40, 0);
    this.camera.position.copy(this._camPos);
    this.camera.lookAt(this._camLook);

    this._buildWorld();
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

  /** Shared facade texture: dark wall with a grid of (randomly lit) windows. */
  _facadeTexture() {
    const c = document.createElement('canvas');
    c.width = 128;
    c.height = 256;
    const g = c.getContext('2d');
    g.fillStyle = '#241c3a';
    g.fillRect(0, 0, 128, 256);
    for (let y = 14; y < 244; y += 30) {
      for (let x = 12; x < 116; x += 26) {
        g.fillStyle = Math.random() < 0.42 ? '#ffd479' : '#141026';
        g.fillRect(x, y, 14, 18);
      }
    }
    const t = new THREE.CanvasTexture(c);
    t.colorSpace = THREE.SRGBColorSpace;
    return t;
  }

  /** Paving texture for the plaza slab. */
  _pavingTexture() {
    const c = document.createElement('canvas');
    c.width = c.height = 256;
    const g = c.getContext('2d');
    g.fillStyle = '#3a2f4e';
    g.fillRect(0, 0, 256, 256);
    g.strokeStyle = '#2c2340';
    g.lineWidth = 3;
    for (let i = 0; i <= 256; i += 32) {
      g.beginPath(); g.moveTo(i, 0); g.lineTo(i, 256); g.stroke();
      g.beginPath(); g.moveTo(0, i); g.lineTo(256, i); g.stroke();
    }
    // Subtle tile variation.
    for (let i = 0; i < 40; i++) {
      g.fillStyle = `rgba(255,255,255,${0.02 + Math.random() * 0.03})`;
      g.fillRect(Math.floor(Math.random() * 8) * 32, Math.floor(Math.random() * 8) * 32, 32, 32);
    }
    const t = new THREE.CanvasTexture(c);
    t.wrapS = t.wrapT = THREE.RepeatWrapping;
    t.repeat.set(6, 4);
    t.colorSpace = THREE.SRGBColorSpace;
    return t;
  }

  _buildWorld() {
    // Lights.
    this.scene.add(new THREE.HemisphereLight(0x9a8cff, 0x2a1a3e, 1.3));
    const sun = new THREE.DirectionalLight(0xffe8c8, 2.1);
    sun.position.set(400, 700, 300);
    sun.castShadow = true;
    sun.shadow.mapSize.set(1024, 1024);
    Object.assign(sun.shadow.camera, { left: -800, right: 800, top: 600, bottom: -600, near: 100, far: 2200 });
    sun.shadow.camera.updateProjectionMatrix();
    this.scene.add(sun);

    // Terrain far beyond the plaza.
    const terrain = new THREE.Mesh(
      new THREE.PlaneGeometry(8000, 8000),
      new THREE.MeshStandardMaterial({ color: 0x241b36, roughness: 1 }),
    );
    terrain.rotation.x = -Math.PI / 2;
    terrain.position.y = -1;
    terrain.receiveShadow = true;
    this.scene.add(terrain);

    // The plaza slab the fight happens on.
    const plaza = new THREE.Mesh(
      new THREE.BoxGeometry(WORLD.width + 140, 6, WORLD.depth + 140),
      new THREE.MeshStandardMaterial({ map: this._pavingTexture(), roughness: 0.9 }),
    );
    plaza.position.y = -3;
    plaza.receiveShadow = true;
    this.scene.add(plaza);

    // Ring road around the plaza with dashed center lines.
    const roadMat = new THREE.MeshStandardMaterial({ color: 0x1b1528, roughness: 1 });
    const dashMat = new THREE.MeshBasicMaterial({ color: 0xcabffb });
    const roadW = 130;
    const rx = WORLD.width / 2 + 70 + roadW / 2;
    const rz = WORLD.depth / 2 + 70 + roadW / 2;
    for (const [w, d, x, z] of [
      [WORLD.width + 140 + roadW * 2, roadW, 0, -rz],
      [WORLD.width + 140 + roadW * 2, roadW, 0, rz],
      [roadW, WORLD.depth + 140, -rx, 0],
      [roadW, WORLD.depth + 140, rx, 0],
    ]) {
      const road = new THREE.Mesh(new THREE.BoxGeometry(w, 2, d), roadMat);
      road.position.set(x, -1.5, z);
      road.receiveShadow = true;
      this.scene.add(road);
      // Dashes along the longer axis.
      const n = Math.floor(Math.max(w, d) / 90);
      for (let i = 0; i < n; i++) {
        const t = (i + 0.5) / n - 0.5;
        const dash = new THREE.Mesh(new THREE.BoxGeometry(w > d ? 34 : 6, 0.6, w > d ? 6 : 34), dashMat);
        dash.position.set(x + (w > d ? t * w : 0), 0.4, z + (w > d ? 0 : t * d));
        this.scene.add(dash);
      }
    }

    this._buildBuildings();
    this._buildProps();
    this._buildSkyline();
  }

  /** Low-poly city blocks surrounding the plaza. */
  _buildBuildings() {
    const facade = this._facadeTexture();
    const tones = [0x4a3c6e, 0x3d3258, 0x55416d, 0x463763];
    const ring = 420; // distance of building fronts from the plaza edge center
    const spots = [];
    // North & south rows.
    for (let i = -3; i <= 3; i++) {
      spots.push([i * 320 + (i % 2) * 40, -(WORLD.depth / 2 + ring)]);
      spots.push([i * 320 - (i % 2) * 40, WORLD.depth / 2 + ring]);
    }
    // East & west rows.
    for (let i = -1; i <= 1; i++) {
      spots.push([-(WORLD.width / 2 + ring + 60), i * 380]);
      spots.push([WORLD.width / 2 + ring + 60, i * 380]);
    }

    for (const [x, z] of spots) {
      const w = 160 + Math.random() * 120;
      const h = 180 + Math.random() * 260;
      const d = 140 + Math.random() * 100;
      const mat = new THREE.MeshStandardMaterial({
        color: tones[Math.floor(Math.random() * tones.length)],
        map: facade,
        emissive: 0xffd479,
        emissiveMap: facade,
        emissiveIntensity: 0.55,
        roughness: 0.95,
      });
      const b = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), mat);
      b.position.set(x, h / 2, z);
      this.scene.add(b);
      // Flat roof lip for a nicer silhouette.
      const roof = new THREE.Mesh(
        new THREE.BoxGeometry(w + 10, 8, d + 10),
        new THREE.MeshStandardMaterial({ color: 0x1c1530, roughness: 1 }),
      );
      roof.position.set(x, h + 4, z);
      this.scene.add(roof);
    }
  }

  /** Plaza furniture: cover props, street lamps, trees. */
  _buildProps() {
    const wood = new THREE.MeshStandardMaterial({ color: 0x8a5a2b, roughness: 0.9 });
    const woodDark = new THREE.MeshStandardMaterial({ color: 0x5f3d1c, roughness: 0.9 });
    const stone = new THREE.MeshStandardMaterial({ color: 0x6b5f85, roughness: 0.8 });
    const water = new THREE.MeshStandardMaterial({
      color: 0x3aa7d9, emissive: 0x1c5f8a, emissiveIntensity: 0.5, roughness: 0.2,
    });

    // Collidable props — visuals match OBSTACLES in config.js.
    for (const o of OBSTACLES) {
      const v = this._toScene(o.x, 0, o.z);
      if (o.type === 'fountain') {
        const base = new THREE.Mesh(new THREE.CylinderGeometry(o.r, o.r + 4, 18, 20), stone);
        base.position.set(v.x, 9, v.z);
        const pool = new THREE.Mesh(new THREE.CylinderGeometry(o.r - 8, o.r - 8, 4, 20), water);
        pool.position.set(v.x, 18, v.z);
        const column = new THREE.Mesh(new THREE.CylinderGeometry(7, 9, 46, 10), stone);
        column.position.set(v.x, 40, v.z);
        const bowl = new THREE.Mesh(new THREE.CylinderGeometry(20, 6, 10, 12), stone);
        bowl.position.set(v.x, 62, v.z);
        base.castShadow = column.castShadow = true;
        base.receiveShadow = true;
        this.scene.add(base, pool, column, bowl);
      } else if (o.type === 'crate') {
        const c = new THREE.Mesh(new THREE.BoxGeometry(o.r * 1.8, o.h, o.r * 1.8), wood);
        c.position.set(v.x, o.h / 2, v.z);
        c.rotation.y = 0.4;
        c.castShadow = c.receiveShadow = true;
        this.scene.add(c);
      } else if (o.type === 'barrel') {
        const b = new THREE.Mesh(new THREE.CylinderGeometry(o.r, o.r - 3, o.h, 10), woodDark);
        b.position.set(v.x, o.h / 2, v.z);
        b.castShadow = b.receiveShadow = true;
        this.scene.add(b);
        for (const ry of [o.h * 0.25, o.h * 0.75]) {
          const ring = new THREE.Mesh(new THREE.TorusGeometry(o.r - 0.5, 1.4, 5, 14), stone);
          ring.rotation.x = Math.PI / 2;
          ring.position.set(v.x, ry, v.z);
          this.scene.add(ring);
        }
      }
    }

    // Street lamps at the plaza corners; two carry real point lights.
    this._flames = [];
    this._torchLights = [];
    const lampPosts = [
      [80, 80, true], [WORLD.width - 80, WORLD.depth - 80, true],
      [WORLD.width - 80, 80, false], [80, WORLD.depth - 80, false],
    ];
    const metal = new THREE.MeshStandardMaterial({ color: 0x342a4a, roughness: 0.7, metalness: 0.4 });
    for (const [wx, wz, lit] of lampPosts) {
      const v = this._toScene(wx, 0, wz);
      const pole = new THREE.Mesh(new THREE.CylinderGeometry(3.5, 5, 120, 8), metal);
      pole.position.set(v.x, 60, v.z);
      pole.castShadow = true;
      const bulb = new THREE.Mesh(
        new THREE.SphereGeometry(9, 10, 8),
        new THREE.MeshBasicMaterial({ color: 0xffd479 }),
      );
      bulb.position.set(v.x, 124, v.z);
      this.scene.add(pole, bulb);
      this._flames.push(bulb);
      if (lit) {
        const light = new THREE.PointLight(0xffb45e, 26000, 520, 2);
        light.position.set(v.x, 118, v.z);
        this.scene.add(light);
        this._torchLights.push(light);
      }
    }

    // Trees scattered between the plaza and the buildings.
    const trunkMat = new THREE.MeshStandardMaterial({ color: 0x4a3020, roughness: 1 });
    const leafMat = new THREE.MeshStandardMaterial({ color: 0x1d4d3b, roughness: 1, flatShading: true });
    const treeSpots = [
      [-760, -160], [-720, 300], [760, -260], [790, 240],
      [-320, -560], [340, -580], [-380, 600], [420, 580], [40, -600], [0, 620],
    ];
    for (const [x, z] of treeSpots) {
      const s = 0.8 + Math.random() * 0.6;
      const trunk = new THREE.Mesh(new THREE.CylinderGeometry(6 * s, 8 * s, 50 * s, 6), trunkMat);
      trunk.position.set(x, 25 * s, z);
      const c1 = new THREE.Mesh(new THREE.ConeGeometry(38 * s, 70 * s, 7), leafMat);
      c1.position.set(x, 80 * s, z);
      const c2 = new THREE.Mesh(new THREE.ConeGeometry(28 * s, 55 * s, 7), leafMat);
      c2.position.set(x, 120 * s, z);
      trunk.castShadow = c1.castShadow = c2.castShadow = true;
      this.scene.add(trunk, c1, c2);
    }
  }

  /** Horizon dressing: mountains, moon, stars. */
  _buildSkyline() {
    for (const [x, z, w, h] of [
      [-1500, -2200, 700, 620], [-400, -2500, 900, 780], [800, -2300, 650, 560],
      [1900, -2400, 800, 700], [-2300, -2100, 750, 640], [2600, -1900, 600, 520],
    ]) {
      const m = new THREE.Mesh(
        new THREE.ConeGeometry(w, h, 4),
        new THREE.MeshStandardMaterial({ color: 0x241a48, roughness: 1, flatShading: true }),
      );
      m.position.set(x, h / 2 - 10, z);
      m.rotation.y = Math.random() * Math.PI;
      this.scene.add(m);
    }

    const moon = new THREE.Mesh(
      new THREE.SphereGeometry(60, 20, 16),
      new THREE.MeshBasicMaterial({ color: 0xfef9c3, fog: false }),
    );
    moon.position.set(600, 700, -2600);
    this.scene.add(moon);

    const starPos = new Float32Array(180 * 3);
    for (let i = 0; i < 180; i++) {
      starPos[i * 3] = (Math.random() - 0.5) * 6000;
      starPos[i * 3 + 1] = 250 + Math.random() * 1400;
      starPos[i * 3 + 2] = -2800;
    }
    const starGeo = new THREE.BufferGeometry();
    starGeo.setAttribute('position', new THREE.BufferAttribute(starPos, 3));
    this.scene.add(new THREE.Points(starGeo,
      new THREE.PointsMaterial({ color: 0xe0d9ff, size: 3, sizeAttenuation: false, fog: false })));
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
    this._arrowDir = new THREE.Vector3();
    this._xAxis = new THREE.Vector3(1, 0, 0);

    // Instanced particles fed by the shared particle pool.
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

  // --- public API --------------------------------------------------------------

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

    this.camera.aspect = this.w / this.h;
    this.camera.updateProjectionMatrix();
  }

  shake(power) {
    this.shakeP = Math.min(14, this.shakeP + power);
  }

  /** @param {{match, input, particles, paused:boolean}} game */
  render(game) {
    const time = performance.now() / 1000;

    // Lamp flicker.
    for (let i = 0; i < this._torchLights.length; i++) {
      this._torchLights[i].intensity = 26000 * (1 + Math.sin(time * 9 + i * 4) * 0.08);
    }

    const match = game.match;
    if (match !== this._matchRef) this._rebuildFighters(match);

    this._updateCamera(match, time);

    if (match) {
      for (const f of this._fighters) f.sync(time, this._toScene);
      this._syncArrows(match.arrows);
      this._syncParticles(game.particles);
      this._syncAimGuides(match.players);
    }

    this.renderer.render(this.scene, this.camera);
    this._renderOverlay(game);
  }

  // --- per-frame sync ----------------------------------------------------------

  /** Chase camera in-match, slow orbit around the plaza in the menu. */
  _updateCamera(match, time) {
    const p = this._camPos;
    const l = this._camLook;
    if (match) {
      const [a, b] = match.players;
      const midX = (a.x + b.x) / 2 - CX;
      const midZ = (a.z + b.z) / 2 - CZ;
      const sep = Math.hypot(a.x - b.x, a.z - b.z);
      const dist = clamp(430 + sep * 0.5, 500, 820);
      // Bias towards the plaza center so the arena frame stays readable.
      const tx = midX * 0.62;
      const tz = midZ * 0.5;
      const k = 0.06; // smoothing per frame
      // Low chase angle (~35°) so the city and skyline stay in frame.
      p.x += (tx - p.x) * k;
      p.y += (dist * 0.6 - p.y) * k;
      p.z += (tz + dist * 0.95 - p.z) * k;
      l.x += (tx - l.x) * k;
      l.y += (55 - l.y) * k;
      l.z += (tz - l.z) * k;
    } else {
      const a = time * 0.12;
      p.set(Math.sin(a) * 640, 250, Math.cos(a) * 640);
      l.set(0, 60, 0);
    }
    this.camera.position.set(
      p.x + (Math.random() - 0.5) * this.shakeP,
      p.y + (Math.random() - 0.5) * this.shakeP,
      p.z,
    );
    this.shakeP *= 0.86;
    this.camera.lookAt(l);
  }

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
      mesh.position.copy(this._toScene(a.x, a.y, a.z));
      if (!a.stuck) {
        this._arrowDir.set(a.vx, a.vy, a.vz).normalize();
        mesh.quaternion.setFromUnitVectors(this._xAxis, this._arrowDir);
      }
      // Stuck arrows shrink away instead of alpha-fading (cheaper).
      mesh.scale.setScalar(a.stuck ? Math.max(0.01, a.stuckT / 1.4) : 1);
    }
  }

  _syncParticles(particles) {
    const d = this._dummy;
    let n = 0;
    for (const p of particles.pool) {
      if (!p.alive) continue;
      d.position.copy(this._toScene(p.x, p.y, p.z));
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
      const hv = Math.cos(p.aim) * speed;
      let x = p.x + Math.cos(p.heading) * 30;
      let z = p.z + Math.sin(p.heading) * 30;
      let y = BOW_H;
      let vx = Math.cos(p.heading) * hv;
      let vz = Math.sin(p.heading) * hv;
      let vy = Math.sin(p.aim) * speed;
      const dt = 0.045;
      let n = 0;
      for (let i = 0; i < AIM_DOTS; i++) {
        vy -= GRAVITY * dt;
        x += vx * dt;
        y += vy * dt;
        z += vz * dt;
        if (y < 0) break;
        // The preview honors cover, exactly like the real arrow will.
        let blocked = false;
        for (const o of OBSTACLES) {
          if (y < o.h && Math.hypot(x - o.x, z - o.z) < o.r) { blocked = true; break; }
        }
        if (blocked) break;
        d.position.copy(this._toScene(x, y, z));
        d.scale.setScalar(1 - (i / AIM_DOTS) * 0.75);
        d.updateMatrix();
        mesh.setMatrixAt(n++, d.matrix);
      }
      mesh.count = n;
      mesh.instanceMatrix.needsUpdate = true;
    }
  }

  /** HP bars, banners, touch controls, pause dim — 2D UI modules on top. */
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
