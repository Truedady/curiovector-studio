// Master timeline for CV007, aligned ONCE to the approved voiceover
// (voiceovers/007-gps.mp3, 97.488938 s, sha256 c82589af…cb01) using ffmpeg
// silencedetect (-35 dB, 0.25 s). Each cue is the start of a spoken sentence, in seconds.

export const FPS = 30;
export const AUDIO_SECONDS = 97.488938;
export const DURATION_IN_FRAMES = Math.ceil(AUDIO_SECONDS * FPS); // 2925

export const CUE = {
  hook: 0.0, // "Your phone can find you without internet."
  notTracking: 2.59, // "But the satellites aren't tracking you."
  hiking: 4.96, // "Imagine you're hiking somewhere remote."
  noService: 7.27, // "No cell service. No Wi-Fi."
  calculate: 9.77, // "Yet your phone can still calculate where you are,"
  mapWontLoad: 12.58, // "even if the map itself won't load."
  howKnow: 15.0, // "So how does it know?"
  myth: 16.98, // "You might imagine a satellite looking down…"
  notHow: 22.43, // "But that's not how GPS works."
  dontKnow: 24.91, // "The satellites don't know you exist."
  broadcast: 27.38, // "They simply broadcast their own position and the exact time."
  listens: 31.31, // "And your phone listens."
  clever: 33.29, // "Here's the clever part."
  lightSpeed: 34.79, // "Those radio signals travel at the speed of light."
  measure: 38.24, // "By measuring how long each one took to arrive,"
  distance: 41.19, // "your phone can estimate its distance from that satellite."
  oneNotEnough: 44.58, // "One distance isn't enough."
  sphere: 46.58, // "You could be anywhere on an enormous sphere."
  second: 49.6, // "A second satellite narrows the possibilities."
  third: 52.57, // "A third narrows them further."
  problem: 54.83, // "But your phone has a problem:"
  atomic: 56.72, // "its clock isn't nearly as accurate as the atomic clocks in space."
  four: 60.98, // "So signals from at least four satellites normally let the receiver solve two mysteries at once:"
  whereItIs: 67.12, // "where it is,"
  clockOff: 68.07, // "and how far its own clock is off."
  twist: 70.68, // "And there's one more twist."
  fast: 72.51, // "Because those satellites move so fast, so high above Earth,"
  einstein: 76.47, // "even Einstein's theory of relativity matters."
  correct: 79.53, // "Engineers correct for its effects to keep GPS accurate."
  clearSky: 83.39, // "Of course, GPS works best with a clear view of the sky."
  nextTime: 87.36, // "But next time you see that tiny blue dot, remember:"
  noSatellite: 90.9, // "No satellite had to find you."
  foundItself: 93.13, // "Your phone found itself."
  clocksInSpace: 95.07, // "By listening to clocks in space."
  end: AUDIO_SECONDS,
} as const;

// Scene windows (seconds). Neighbouring scenes overlap by XFADE for crossfades.
export const XFADE = 0.45;
export const SCENES = {
  hook: [0, 16.8],
  myth: [16.8, 24.75],
  broadcast: [24.75, 34.62],
  flight: [34.62, 44.4],
  spheres: [44.4, 54.65],
  clock: [54.65, 70.5],
  relativity: [70.5, 83.2],
  sky: [83.2, 87.2],
  finale: [87.2, DURATION_IN_FRAMES / FPS],
} as const;
