/**
 * Interface sound (docs/visual-experience.md, "Sound").
 *
 * OFF by default and opt-in through the speaker toggle in the nav; the
 * choice is remembered. Every sound is synthesised with the Web Audio API
 * at the moment it plays: no audio files, so nothing is downloaded on a
 * phone plan. Sound marks only moments where it carries information:
 *
 *   detent()  a tick as a control passes a step (the beam load, each 250 N),
 *             pitched higher as the value rises
 *   warn()    a low two-tone when something crosses a limit (steel yields)
 *   tick()    a soft click when a toggle changes state
 *
 * Nothing plays on hover, scroll or page load. Browsers only allow audio
 * after a user gesture, and every sound here answers one.
 */

const KEY = "4tun.sound";
const EVENT = "4tun:sound";

let ctx: AudioContext | null = null;

export function soundEnabled(): boolean {
  if (typeof window === "undefined") return false;
  try {
    return localStorage.getItem(KEY) === "on";
  } catch {
    return false;
  }
}

export function setSoundEnabled(on: boolean) {
  try {
    localStorage.setItem(KEY, on ? "on" : "off");
  } catch {
    /* private mode: the toggle still works for this page */
  }
  window.dispatchEvent(new CustomEvent(EVENT, { detail: on }));
  if (on) tick(true);
}

export function onSoundChange(fn: (on: boolean) => void) {
  const h = (e: Event) => fn((e as CustomEvent<boolean>).detail);
  window.addEventListener(EVENT, h);
  return () => window.removeEventListener(EVENT, h);
}

function audio(force = false): AudioContext | null {
  if (!force && !soundEnabled()) return null;
  if (typeof window === "undefined" || !("AudioContext" in window)) return null;
  ctx ??= new AudioContext();
  if (ctx.state === "suspended") void ctx.resume();
  return ctx;
}

function envelope(c: AudioContext, peak: number, attack: number, decay: number) {
  const g = c.createGain();
  const t = c.currentTime;
  g.gain.setValueAtTime(0.0001, t);
  g.gain.exponentialRampToValueAtTime(peak, t + attack);
  g.gain.exponentialRampToValueAtTime(0.0001, t + attack + decay);
  g.connect(c.destination);
  return g;
}

/** A short mechanical click. `force` plays it even while turning sound on. */
export function tick(force = false) {
  const c = audio(force);
  if (!c) return;
  const o = c.createOscillator();
  o.type = "triangle";
  o.frequency.setValueAtTime(1400, c.currentTime);
  o.frequency.exponentialRampToValueAtTime(700, c.currentTime + 0.04);
  o.connect(envelope(c, 0.06, 0.002, 0.05));
  o.start();
  o.stop(c.currentTime + 0.07);
}

/** A detent: `level` 0–1 sets the pitch, like a ratchet tightening. */
export function detent(level: number) {
  const c = audio();
  if (!c) return;
  const o = c.createOscillator();
  o.type = "square";
  o.frequency.value = 520 + level * 900;
  const f = c.createBiquadFilter();
  f.type = "bandpass";
  f.frequency.value = o.frequency.value * 2;
  f.Q.value = 6;
  o.connect(f);
  f.connect(envelope(c, 0.035, 0.001, 0.03));
  o.start();
  o.stop(c.currentTime + 0.04);
}

/** A low, falling two-tone: a limit was crossed. */
export function warn() {
  const c = audio();
  if (!c) return;
  [0, 0.14].forEach((delay, i) => {
    const o = c.createOscillator();
    o.type = "sawtooth";
    const t = c.currentTime + delay;
    o.frequency.setValueAtTime(i ? 150 : 210, t);
    o.frequency.exponentialRampToValueAtTime(i ? 110 : 170, t + 0.18);
    const lp = c.createBiquadFilter();
    lp.type = "lowpass";
    lp.frequency.value = 900;
    const g = c.createGain();
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(0.07, t + 0.01);
    g.gain.exponentialRampToValueAtTime(0.0001, t + 0.2);
    o.connect(lp);
    lp.connect(g);
    g.connect(c.destination);
    o.start(t);
    o.stop(t + 0.22);
  });
}
