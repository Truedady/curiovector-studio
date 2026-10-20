// Master timeline for episode 010, derived ONCE from voiceover.mp3
// (ffprobe duration 105.404063 s; sentence starts from an ffmpeg
// silencedetect pass, -35 dB / 0.28 s). Both compositions share it.

export const FPS = 30;
export const AUDIO_SECONDS = 105.404063;
export const DURATION_FRAMES = Math.ceil(AUDIO_SECONDS * FPS); // 3163

// Sentence starts (seconds) — one per line of script.txt.
export const T = {
  hook: 0, // "That message you sent overseas probably traveled underwater."
  notSpace: 4.07, // "Not through space."
  seriously: 5.54, // "Seriously."
  floating: 6.69, // "When you open a video, it feels like the internet is floating…"
  wifi: 11.7, // "Wi-Fi. Cell towers. Satellites."
  imagine: 14.94, // "So it's easy to imagine your data flying … through the sky."
  zoomOut: 19.84, // "But zoom out."
  firstHop: 21.22, // "Your phone sends a wireless signal to a router or cell tower."
  physical: 25.04, // "And after that short hop, the journey becomes much more physical."
  fiberNet: 29.15, // "Your data races through networks of fiber-optic cables."
  ocean: 32.87, // "And if it needs to cross an ocean, it's likely to travel along the seafloor."
  glass: 37.19, // "Inside those cables are incredibly thin strands of glass."
  light: 41.47, // "Equipment sends rapidly changing patterns of light through them,"
  distance: 45.04, // "carrying digital information across enormous distances."
  surprise: 48.99, // "The surprising part?"
  notPipe: 50.39, // "Much of an undersea cable isn't a giant steel pipe."
  hose: 54.01, // "In deep water, it can be roughly as thick as a garden hose,"
  layers: 57.84, // "with protective layers wrapped around tiny glass fibers."
  hundreds: 61.46, // "And there are hundreds of these cable systems linking continents."
  whySat: 65.17, // "Why not just use satellites?"
  satVital: 67.14, // "Satellites are vital for some places and services."
  fiberCost: 70.51, // "But undersea fiber can carry extraordinary amounts of data…"
  vulnerable: 76.56, // "Now here's the vulnerable part."
  canBreak: 78.88, // "These cables can break."
  hazards: 80.8, // "Fishing equipment, ship anchors, and natural hazards can damage them."
  reroute: 85.24, // "When that happens, networks often reroute data…"
  outage: 89.71, // "But places with few alternatives may suffer major outages."
  notCloud: 93.87, // "So the internet isn't some weightless cloud."
  skeleton: 96.97, // "It has a physical skeleton."
  finale: 98.98, // "And a remarkable amount of our digital world depends on…"
  end: AUDIO_SECONDS,
} as const;

// Scene windows [start, end) in seconds. Neighbours cross-fade over XF.
export const XF = 0.4;
export const SCENES = {
  hook: [T.hook, T.floating],
  invisible: [T.floating, T.zoomOut],
  firstHop: [T.zoomOut, T.ocean],
  seafloor: [T.ocean, T.glass],
  fiber: [T.glass, T.surprise],
  anatomy: [T.surprise, T.hundreds],
  network: [T.hundreds, T.satVital],
  satellites: [T.satVital, T.vulnerable],
  hazards: [T.vulnerable, T.reroute],
  reroute: [T.reroute, T.notCloud],
  finale: [T.notCloud, T.end],
} as const;
