// Synteettiset äänet Web Audio API:lla — ei binääriassetteja, toimii offline.
// Kaikki äänet kunnioittavat soundEnabled-asetusta (kutsuja tarkistaa sen).

let ctx: AudioContext | null = null;

function audioCtx(): AudioContext | null {
  if (typeof window === 'undefined') return null;
  const Ctor = window.AudioContext ?? (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
  if (!Ctor) return null;
  if (!ctx) ctx = new Ctor();
  return ctx;
}

interface Tone {
  freq: number;
  start: number;
  duration: number;
  type?: OscillatorType;
  gain?: number;
}

function playTones(tones: Tone[]): void {
  const ac = audioCtx();
  if (!ac) return;
  if (ac.state === 'suspended') void ac.resume();
  const now = ac.currentTime;
  for (const t of tones) {
    const osc = ac.createOscillator();
    const gain = ac.createGain();
    osc.type = t.type ?? 'sine';
    osc.frequency.value = t.freq;
    const peak = t.gain ?? 0.15;
    const startAt = now + t.start;
    gain.gain.setValueAtTime(0.0001, startAt);
    gain.gain.exponentialRampToValueAtTime(peak, startAt + 0.01);
    gain.gain.exponentialRampToValueAtTime(0.0001, startAt + t.duration);
    osc.connect(gain).connect(ac.destination);
    osc.start(startAt);
    osc.stop(startAt + t.duration + 0.02);
  }
}

/** Iloinen pling oikeasta vastauksesta. */
export function playCorrect(): void {
  playTones([
    { freq: 660, start: 0, duration: 0.12 },
    { freq: 990, start: 0.09, duration: 0.16 },
  ]);
}

/** Pehmeä, ei-rankaiseva sointu väärästä (paljastus). */
export function playReveal(): void {
  playTones([{ freq: 300, start: 0, duration: 0.18, type: 'triangle', gain: 0.1 }]);
}

/** Fanfaari juhlaan (3 tähteä tai uusi taso). */
export function playCelebrate(): void {
  playTones([
    { freq: 523, start: 0, duration: 0.18 },
    { freq: 659, start: 0.12, duration: 0.18 },
    { freq: 784, start: 0.24, duration: 0.18 },
    { freq: 1047, start: 0.36, duration: 0.32, gain: 0.2 },
  ]);
}
