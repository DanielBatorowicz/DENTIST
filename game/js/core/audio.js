/**
 * audio.js — tiny procedural sound effects via WebAudio.
 *
 * No audio assets are shipped: every effect is a short synthesized blip,
 * which keeps the game a zero-download, cache-friendly bundle. The
 * AudioContext is created lazily on the first user gesture (required by
 * mobile browsers).
 */

let ctx = null;

/** Must be called from a user gesture (any pointerdown) to unlock audio. */
export function initAudio() {
  if (ctx) {
    if (ctx.state === 'suspended') ctx.resume();
    return;
  }
  const AC = window.AudioContext || window.webkitAudioContext;
  if (AC) ctx = new AC();
}

/**
 * Fire-and-forget beep.
 * @param {number} freq   start frequency (Hz)
 * @param {number} dur    duration (s)
 * @param {string} type   oscillator type
 * @param {number} gain   peak gain
 * @param {number} slide  frequency multiplier at the end of the note
 */
function beep(freq, dur = 0.08, type = 'square', gain = 0.06, slide = 1) {
  if (!ctx || ctx.state !== 'running') return;
  const t = ctx.currentTime;
  const osc = ctx.createOscillator();
  const g = ctx.createGain();
  osc.type = type;
  osc.frequency.setValueAtTime(freq, t);
  osc.frequency.exponentialRampToValueAtTime(Math.max(30, freq * slide), t + dur);
  g.gain.setValueAtTime(gain, t);
  g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
  osc.connect(g).connect(ctx.destination);
  osc.start(t);
  osc.stop(t + dur + 0.02);
}

/** Short white-noise burst — used for impacts. */
function noise(dur = 0.1, gain = 0.05) {
  if (!ctx || ctx.state !== 'running') return;
  const t = ctx.currentTime;
  const len = Math.floor(ctx.sampleRate * dur);
  const buf = ctx.createBuffer(1, len, ctx.sampleRate);
  const data = buf.getChannelData(0);
  for (let i = 0; i < len; i++) data[i] = (Math.random() * 2 - 1) * (1 - i / len);
  const src = ctx.createBufferSource();
  const g = ctx.createGain();
  src.buffer = buf;
  g.gain.value = gain;
  src.connect(g).connect(ctx.destination);
  src.start(t);
}

export const sfx = {
  click: () => beep(600, 0.05, 'square', 0.04, 1.2),
  countdown: () => beep(440, 0.09, 'square', 0.05),
  fight: () => { beep(660, 0.16, 'square', 0.06, 1.5); noise(0.08, 0.03); },
  swing: () => noise(0.06, 0.03),
  hit: () => { beep(180, 0.09, 'sawtooth', 0.07, 0.5); noise(0.09, 0.06); },
  block: () => { beep(900, 0.06, 'triangle', 0.06, 0.7); noise(0.04, 0.03); },
  shoot: () => { beep(1200, 0.12, 'sine', 0.05, 0.3); noise(0.05, 0.02); },
  drawBow: () => beep(220, 0.15, 'sine', 0.02, 1.6),
  dash: () => noise(0.12, 0.05),
  arrowStick: () => beep(300, 0.05, 'triangle', 0.03, 0.6),
  death: () => beep(300, 0.5, 'sawtooth', 0.06, 0.2),
  roundWin: () => { beep(523, 0.12, 'square', 0.05); setTimeout(() => beep(659, 0.12, 'square', 0.05), 130); setTimeout(() => beep(784, 0.2, 'square', 0.05), 260); },
  matchWin: () => { [523, 659, 784, 1047].forEach((f, i) => setTimeout(() => beep(f, 0.18, 'square', 0.06), i * 150)); },
};
