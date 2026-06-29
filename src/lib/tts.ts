// Indian-voice-aware text-to-speech helper for AVANYA.
// Picks an Indian English / Hindi voice when available, with graceful fallback.

export type VoicePref = "auto" | "hi-IN" | "en-IN";

const HINDI_PRIORITY = [
  /google.*हिन्दी/i,
  /google.*hindi/i,
  /microsoft.*heera/i,
  /microsoft.*hemant/i,
  /hi-?in/i,
];

const EN_IN_PRIORITY = [
  /google.*indian english/i,
  /google.*english.*india/i,
  /microsoft.*ravi/i,
  /microsoft.*heera/i,
  /en-?in/i,
];

function getVoices(): SpeechSynthesisVoice[] {
  if (typeof window === "undefined" || !("speechSynthesis" in window)) return [];
  return window.speechSynthesis.getVoices() || [];
}

export function ensureVoicesLoaded(cb?: () => void) {
  if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
  const synth = window.speechSynthesis;
  if (synth.getVoices().length) {
    cb?.();
    return;
  }
  const handler = () => {
    synth.removeEventListener?.("voiceschanged", handler);
    cb?.();
  };
  synth.addEventListener?.("voiceschanged", handler);
}

function pickByPatterns(voices: SpeechSynthesisVoice[], patterns: RegExp[]) {
  for (const p of patterns) {
    const m = voices.find((v) => p.test(`${v.name} ${v.lang}`));
    if (m) return m;
  }
  return undefined;
}

// Heuristic: detect if a text is Hindi or Hinglish (vs pure English).
export function detectIndicLang(text: string): "hi" | "en" {
  if (/[\u0900-\u097F]/.test(text)) return "hi"; // Devanagari
  const hinglishMarkers = /\b(hai|hain|aap|main|kya|kar|karna|karein|kijiye|nahi|nahin|mujhe|mera|meri|apna|apni|kaise|kyun|bilkul|namaste|dhanyavaad|paisa|paise|khata|bank|wala|wali|theek|acha|haan|ji)\b/i;
  return hinglishMarkers.test(text) ? "hi" : "en";
}

export function pickVoice(pref: VoicePref, text: string): SpeechSynthesisVoice | undefined {
  const voices = getVoices();
  if (!voices.length) return undefined;

  let target: "hi" | "en";
  if (pref === "hi-IN") target = "hi";
  else if (pref === "en-IN") target = "en";
  else target = detectIndicLang(text);

  if (target === "hi") {
    return (
      pickByPatterns(voices, HINDI_PRIORITY) ||
      pickByPatterns(voices, EN_IN_PRIORITY) ||
      voices.find((v) => /^en-?in/i.test(v.lang)) ||
      undefined
    );
  }
  return (
    pickByPatterns(voices, EN_IN_PRIORITY) ||
    voices.find((v) => /^en-?in/i.test(v.lang)) ||
    undefined
  );
}

export function speak(text: string, pref: VoicePref = "auto") {
  if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
  const clean = text.replace(/\n+/g, " ");
  const run = () => {
    const u = new SpeechSynthesisUtterance(clean);
    const voice = pickVoice(pref, clean);
    if (voice) {
      u.voice = voice;
      u.lang = voice.lang;
    } else {
      // Fallback: hint Indian locale even without a matching voice.
      u.lang = detectIndicLang(clean) === "hi" ? "hi-IN" : "en-IN";
    }
    u.rate = 0.9;
    u.pitch = 0.95;
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(u);
  };
  if (!getVoices().length) ensureVoicesLoaded(run);
  else run();
}