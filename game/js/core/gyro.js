/**
 * gyro.js — device-orientation based bow aiming.
 *
 * The archer aims by tilting the phone. We never use absolute orientation:
 * when the player starts drawing the bow we take a reference snapshot and
 * aim with the *delta* from that snapshot, so the game works no matter how
 * the phone is initially held.
 *
 * Device beta/gamma axes swap meaning in landscape, so readings are
 * remapped by the current screen angle into a consistent pair:
 *   pitch — tilting the top edge of the screen towards/away from you
 *   yaw   — rotating the phone around the axis pointing at your face
 *
 * iOS 13+ requires an explicit user-gesture permission request, exposed
 * here as enable() and wired to a menu button.
 */

export const gyro = {
  supported: typeof DeviceOrientationEvent !== 'undefined',
  active: false,
  pitch: 0,   // degrees
  yaw: 0,     // degrees
  _listener: null,

  /** Request permission (iOS) and start listening. Returns true on success. */
  async enable() {
    if (!this.supported || this.active) return this.active;
    try {
      if (typeof DeviceOrientationEvent.requestPermission === 'function') {
        const res = await DeviceOrientationEvent.requestPermission();
        if (res !== 'granted') return false;
      }
    } catch {
      return false;
    }
    this._listener = (e) => this._onOrientation(e);
    window.addEventListener('deviceorientation', this._listener);
    this.active = true;
    return true;
  },

  disable() {
    if (this._listener) window.removeEventListener('deviceorientation', this._listener);
    this._listener = null;
    this.active = false;
  },

  /** Reference snapshot taken when the bow draw starts. */
  snapshot() {
    return { pitch: this.pitch, yaw: this.yaw };
  },

  /** Delta from a snapshot, in radians, clamped to a sane range. */
  delta(ref) {
    const clamp = (v) => Math.max(-60, Math.min(60, v));
    return {
      pitch: clamp(this.pitch - ref.pitch) * Math.PI / 180,
      yaw: clamp(this.yaw - ref.yaw) * Math.PI / 180,
    };
  },

  _onOrientation(e) {
    if (e.beta == null || e.gamma == null) return;
    const angle = (screen.orientation && screen.orientation.angle != null)
      ? screen.orientation.angle
      : (window.orientation || 0);
    // Remap beta/gamma into screen-relative pitch/yaw for each rotation.
    switch (angle) {
      case 90:   this.pitch = -e.gamma; this.yaw = e.beta; break;
      case -90:
      case 270:  this.pitch = e.gamma; this.yaw = -e.beta; break;
      case 180:  this.pitch = -e.beta; this.yaw = -e.gamma; break;
      default:   this.pitch = e.beta; this.yaw = e.gamma; break;
    }
  },
};
