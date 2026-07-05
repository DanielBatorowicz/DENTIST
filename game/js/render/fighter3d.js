/**
 * fighter3d.js — 3D fighter rig built from primitives.
 *
 * Each fighter is a small hierarchy of Three.js meshes (capsule torso,
 * sphere head, cylinder limbs, class weapon) animated every frame from the
 * exact same Player state the 2D renderer uses — the simulation stays
 * renderer-agnostic. No model files are loaded; everything is procedural.
 *
 * Hierarchy:
 *   root (world x, facing via rotation.y)
 *   └─ tilt (death fall / hit-stun wobble via rotation.z)
 *      ├─ legL, legR             pivot at the hip
 *      └─ upper (walk bob)
 *         ├─ torso, head, back arm
 *         ├─ armFront (melee swing) → fist / sword
 *         ├─ shield (tank)
 *         └─ bowGroup (archer, rotation.z = aim) + charge ring
 */

import * as THREE from '../../lib/three.module.min.js';
import { PLAYER_COLORS, PLAYER_COLORS_DARK, clamp } from '../game/config.js';
import { swingAngle } from './sprites.js';

const SKIN = 0xfcd9b8;

function std(color, opts = {}) {
  return new THREE.MeshStandardMaterial({ color, roughness: 0.7, metalness: 0.05, ...opts });
}

/** Punch extension for the brawler — same curve as the 2D renderer. */
function punchExt(p) {
  const a = p.cls.attack;
  if (p.state === 'dash') return a.range;
  if (p.state !== 'attack') return 14;
  const t = p.t;
  if (t < a.windup) return 14 - 8 * (t / a.windup);
  if (t < a.windup + a.active) return 6 + (a.range - 6) * ((t - a.windup) / a.active);
  return a.range - (a.range - 14) * clamp((t - a.windup - a.active) / a.recover, 0, 1);
}

export class Fighter3D {
  /** @param {import('../game/player.js').Player} p */
  constructor(p) {
    this.player = p;
    this.mats = []; // all materials, for the white hit flash

    const bodyMat = this._mat(std(PLAYER_COLORS[p.index]));
    const darkMat = this._mat(std(PLAYER_COLORS_DARK[p.index]));
    const skinMat = this._mat(std(SKIN));
    const metalMat = this._mat(std(0xd8dee9, { roughness: 0.3, metalness: 0.7 }));
    const woodMat = this._mat(std(0xa16207));

    this.root = new THREE.Group();
    this.tilt = new THREE.Group();
    this.root.add(this.tilt);
    this.upper = new THREE.Group();
    this.tilt.add(this.upper);

    // Legs: unit cylinders anchored at the hip, pointing down.
    const legGeo = new THREE.CylinderGeometry(4.5, 3.5, 32, 6);
    legGeo.translate(0, -16, 0);
    this.legL = new THREE.Mesh(legGeo, darkMat);
    this.legR = new THREE.Mesh(legGeo, darkMat);
    this.legL.position.set(0, 32, -7);
    this.legR.position.set(0, 32, 7);
    this.tilt.add(this.legL, this.legR);

    // Torso + head.
    const torso = new THREE.Mesh(new THREE.CapsuleGeometry(14, 28, 4, 10), bodyMat);
    torso.position.y = 56;
    const head = new THREE.Mesh(new THREE.SphereGeometry(14, 14, 12), skinMat);
    head.position.y = 94;
    const band = new THREE.Mesh(new THREE.CylinderGeometry(14.4, 14.4, 6, 14), darkMat);
    band.position.y = 100;
    const eyeGeo = new THREE.SphereGeometry(2.2, 6, 6);
    const eyeMat = std(0x1e293b);
    const eyeL = new THREE.Mesh(eyeGeo, eyeMat);
    const eyeR = new THREE.Mesh(eyeGeo, eyeMat);
    eyeL.position.set(11.5, 95, -5);
    eyeR.position.set(11.5, 95, 5);
    this.upper.add(torso, head, band, eyeL, eyeR);

    // Back arm (simple counter-swing).
    const armGeo = new THREE.CylinderGeometry(4, 4, 1, 6);
    armGeo.rotateZ(-Math.PI / 2);   // unit length along +X …
    armGeo.translate(0.5, 0, 0);    // … anchored at the shoulder
    this.armBack = new THREE.Mesh(armGeo, darkMat);
    this.armBack.position.set(0, 76, -14);
    this.armBack.scale.x = 24;
    this.armBack.rotation.z = -0.9;
    this.upper.add(this.armBack);

    // Front arm — carries the weapon and swings.
    this.armFront = new THREE.Group();
    this.armFront.position.set(2, 76, 12);
    this.armMesh = new THREE.Mesh(armGeo, darkMat);
    this.armMesh.scale.x = 20;
    this.armFront.add(this.armMesh);
    this.upper.add(this.armFront);

    // Class weapon.
    switch (p.cls.id) {
      case 'brawler': {
        this.fist = new THREE.Mesh(new THREE.SphereGeometry(7.5, 10, 8), skinMat);
        this.armFront.add(this.fist);
        break;
      }
      case 'sword':
      case 'tank': {
        const len = p.cls.id === 'sword' ? 58 : 44;
        const sword = new THREE.Group();
        const blade = new THREE.Mesh(new THREE.BoxGeometry(len, 4.5, 2), metalMat);
        blade.position.x = 24 + len / 2;
        const guard = new THREE.Mesh(new THREE.BoxGeometry(3, 16, 6), woodMat);
        guard.position.x = 23;
        sword.add(blade, guard);
        this.armFront.add(sword);

        if (p.cls.id === 'tank') {
          this.shield = new THREE.Group();
          const plate = new THREE.Mesh(new THREE.BoxGeometry(5, 56, 32), metalMat);
          // Round the silhouette a bit with a chamfered second plate.
          const rim = new THREE.Mesh(new THREE.BoxGeometry(3, 62, 26), darkMat);
          const boss = new THREE.Mesh(new THREE.SphereGeometry(6, 8, 8), darkMat);
          boss.position.x = 4;
          this.shield.add(rim, plate, boss);
          this.shield.position.set(16, 60, 4);
          this.tilt.add(this.shield);
        }
        break;
      }
      case 'archer': {
        this.bowGroup = new THREE.Group();
        this.bowGroup.position.set(16, 72, 10);
        // Bow limbs: partial torus opening backwards.
        const bow = new THREE.Mesh(new THREE.TorusGeometry(26, 2.2, 6, 18, Math.PI * 0.8), woodMat);
        bow.rotation.z = -Math.PI * 0.4; // center the arc on +X
        this.bowGroup.add(bow);
        // Nocked arrow, visible while drawing.
        this.nock = new THREE.Group();
        const shaft = new THREE.Mesh(new THREE.CylinderGeometry(1.1, 1.1, 30, 5), this._mat(std(0xf8fafc)));
        shaft.rotation.z = -Math.PI / 2;
        shaft.position.x = 12;
        const tip = new THREE.Mesh(new THREE.ConeGeometry(2.6, 7, 6), metalMat);
        tip.rotation.z = -Math.PI / 2;
        tip.position.x = 29;
        this.nock.add(shaft, tip);
        this.nock.visible = false;
        this.bowGroup.add(this.nock);
        this.upper.add(this.bowGroup);

        // Charge ring above the head (yellow -> green at full draw).
        this.ringMat = new THREE.MeshBasicMaterial({ color: 0xfde047 });
        this.ring = new THREE.Mesh(new THREE.TorusGeometry(11, 1.6, 6, 20), this.ringMat);
        this.ring.position.y = 126;
        this.ring.visible = false;
        this.tilt.add(this.ring);
        break;
      }
    }

    this.root.traverse((o) => { if (o.isMesh) o.castShadow = true; });
  }

  _mat(m) {
    m.emissive = new THREE.Color(0xffffff);
    m.emissiveIntensity = 0;
    this.mats.push(m);
    return m;
  }

  /** Mirror the Player state onto the rig. Called once per rendered frame. */
  sync(time) {
    const p = this.player;
    this.root.position.set(p.x - 500, 0, 0);
    this.root.rotation.y = p.facing === 1 ? 0 : Math.PI;

    // Death fall / hit-stun wobble.
    if (p.state === 'dead') {
      this.tilt.rotation.z = Math.min(1, p.deadT / 0.5) * Math.PI / 2;
    } else if (p.state === 'hitstun') {
      this.tilt.rotation.z = Math.sin(time * 55) * 0.05;
    } else {
      this.tilt.rotation.z = 0;
    }

    // Walk cycle.
    const swing = p.moving ? Math.sin(p.walkT * 10) * 0.6 : 0.08;
    this.legL.rotation.z = swing;
    this.legR.rotation.z = p.moving ? -swing : -0.08;
    this.upper.position.y = p.moving ? Math.abs(Math.sin(p.walkT * 10)) * 2 : 0;
    this.armBack.rotation.z = -0.9 + (p.moving ? Math.sin(p.walkT * 10) * 0.25 : 0);

    // White flash on hit.
    const glow = p.flash > 0 ? 0.9 : 0;
    for (const m of this.mats) m.emissiveIntensity = glow;

    // Class-specific animation.
    switch (p.cls.id) {
      case 'brawler': {
        const ext = punchExt(p);
        this.armMesh.scale.x = ext;
        this.fist.position.set(ext + 4, 0, 0);
        this.armFront.rotation.z = 0;
        break;
      }
      case 'sword':
      case 'tank': {
        this.armFront.rotation.z = p.state === 'dash' ? 0.1 : -swingAngle(p);
        if (this.shield) {
          const block = p.state === 'block';
          const bash = p.state === 'dash';
          this.shield.position.x = block ? 26 : bash ? 32 : 16;
          this.shield.scale.setScalar(block || bash ? 1.18 : 1);
        }
        break;
      }
      case 'archer': {
        const drawing = p.state === 'draw';
        this.bowGroup.rotation.z = p.aim;
        this.nock.visible = drawing && p.arrows > 0;
        if (drawing) {
          const c = clamp(p.charge / p.cls.bow.maxCharge, 0, 1);
          this.nock.position.x = -c * 14;
          this.ring.visible = true;
          this.ring.scale.setScalar(0.4 + c * 0.8);
          this.ringMat.color.setHex(c >= 1 ? 0x4ade80 : 0xfde047);
        } else {
          this.ring.visible = false;
        }
        break;
      }
    }
  }

  dispose(scene) {
    scene.remove(this.root);
    this.root.traverse((o) => {
      if (o.isMesh) {
        o.geometry.dispose();
        (Array.isArray(o.material) ? o.material : [o.material]).forEach((m) => m.dispose());
      }
    });
  }
}
