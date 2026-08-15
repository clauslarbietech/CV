/** Multisensory speech helpers — hear phonemes/words during Structured Literacy practice */

export function canSpeak(): boolean {
  return typeof window !== "undefined" && "speechSynthesis" in window;
}

export function stopSpeaking() {
  if (!canSpeak()) return;
  window.speechSynthesis.cancel();
}

export function speakText(text: string, opts?: { rate?: number; soundOff?: boolean }) {
  if (!canSpeak() || opts?.soundOff) return;
  window.speechSynthesis.cancel();
  const utter = new SpeechSynthesisUtterance(text);
  utter.rate = opts?.rate ?? 0.9;
  window.speechSynthesis.speak(utter);
}

/** Speak phoneme labels like "/sh/" as approximate sounds for learners */
export function speakPhoneme(phoneme: string, opts?: { rate?: number; soundOff?: boolean }) {
  const map: Record<string, string> = {
    "/k/": "kuh",
    "/a/": "ah",
    "/t/": "tuh",
    "/d/": "duh",
    "/o/": "ah",
    "/g/": "guh",
    "/s/": "sss",
    "/u/": "uh",
    "/n/": "nnn",
    "/m/": "mmm",
    "/p/": "puh",
    "/b/": "buh",
    "/f/": "fff",
    "/i/": "ih",
    "/r/": "rrr",
    "/e/": "eh",
    "/sh/": "shh",
    "/ch/": "chuh",
    "/th/": "thh",
    "/w/": "wuh",
    "/l/": "lll",
    "/v/": "vvv",
    "/z/": "zzz",
  };
  const spoken = map[phoneme] ?? phoneme.replace(/\//g, "");
  speakText(spoken, { rate: opts?.rate ?? 0.75, soundOff: opts?.soundOff });
}

export function speakPhonemeSequence(phonemes: string[], opts?: { rate?: number; soundOff?: boolean }) {
  if (!canSpeak() || opts?.soundOff) return;
  window.speechSynthesis.cancel();
  phonemes.forEach((p, i) => {
    window.setTimeout(() => speakPhoneme(p, opts), i * 450);
  });
}
