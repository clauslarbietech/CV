/** HERO sonic identity — four soft notes (H-E-Я-O). Original composition via Web Audio. */

export function playHeroSonic(mode: "kids" | "adult", soundOff: boolean) {
  if (soundOff || typeof window === "undefined") return;

  const Ctx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
  if (!Ctx) return;

  const ctx = new Ctx();
  const now = ctx.currentTime;
  const notes = mode === "kids" ? [261.63, 329.63, 392.0, 523.25] : [196.0, 246.94, 293.66, 392.0];
  const gain = ctx.createGain();
  gain.gain.setValueAtTime(0.0001, now);
  gain.gain.exponentialRampToValueAtTime(0.08, now + 0.15);
  gain.gain.exponentialRampToValueAtTime(0.0001, now + 2.2);
  gain.connect(ctx.destination);

  notes.forEach((freq, i) => {
    const osc = ctx.createOscillator();
    const noteGain = ctx.createGain();
    osc.type = mode === "kids" ? "triangle" : "sine";
    osc.frequency.setValueAtTime(freq, now + i * 0.28);
    noteGain.gain.setValueAtTime(0.0001, now + i * 0.28);
    noteGain.gain.exponentialRampToValueAtTime(0.35, now + i * 0.28 + 0.05);
    noteGain.gain.exponentialRampToValueAtTime(0.0001, now + i * 0.28 + 0.45);
    osc.connect(noteGain);
    noteGain.connect(gain);
    osc.start(now + i * 0.28);
    osc.stop(now + i * 0.28 + 0.5);
  });

  // Soft spatial pulse underneath
  const pulse = ctx.createOscillator();
  const pulseGain = ctx.createGain();
  pulse.type = "sine";
  pulse.frequency.setValueAtTime(55, now);
  pulseGain.gain.setValueAtTime(0.0001, now);
  pulseGain.gain.exponentialRampToValueAtTime(0.04, now + 0.3);
  pulseGain.gain.exponentialRampToValueAtTime(0.0001, now + 2.5);
  pulse.connect(pulseGain);
  pulseGain.connect(gain);
  pulse.start(now);
  pulse.stop(now + 2.6);

  window.setTimeout(() => void ctx.close(), 3000);
}

export function playAmbientPulse(soundOff: boolean) {
  if (soundOff || typeof window === "undefined") return;
  const Ctx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
  if (!Ctx) return;
  const ctx = new Ctx();
  const now = ctx.currentTime;
  const osc = ctx.createOscillator();
  const g = ctx.createGain();
  osc.type = "sine";
  osc.frequency.setValueAtTime(72, now);
  g.gain.setValueAtTime(0.0001, now);
  g.gain.exponentialRampToValueAtTime(0.025, now + 0.8);
  g.gain.exponentialRampToValueAtTime(0.0001, now + 3);
  osc.connect(g);
  g.connect(ctx.destination);
  osc.start(now);
  osc.stop(now + 3.2);
  window.setTimeout(() => void ctx.close(), 3500);
}
