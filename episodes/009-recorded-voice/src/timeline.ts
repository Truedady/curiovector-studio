// Master timing for episode 009, measured ONCE from voiceover.mp3
// (ffprobe duration 100.440813 s; sentence boundaries from ffmpeg silencedetect,
// -38 dB / 0.12 s). Both compositions share this exact timeline.

export const FPS = 30;
export const AUDIO_SECONDS = 100.440813;
export const DURATION_FRAMES = Math.ceil(AUDIO_SECONDS * FPS); // 3014

export type Line = {from: number; to: number; text: string};

export const LINES: Line[] = [
  {from: 0.0, to: 3.59, text: 'Ever heard your own voice in a recording and thought, “Who is that?”'},
  {from: 4.07, to: 8.19, text: 'Maybe it sounds thinner. Higher. Just… wrong.'},
  {from: 8.74, to: 11.14, text: 'You hear yourself talk every single day.'},
  {from: 11.47, to: 15.05, text: 'So why does a simple phone recording make you sound like a stranger?'},
  {from: 15.62, to: 16.78, text: 'Here’s the strange part.'},
  {from: 17.19, to: 21.6, text: 'When you speak, you’re hearing your voice through two different paths at the same time.'},
  {from: 22.0, to: 23.41, text: 'The first is obvious.'},
  {from: 23.77, to: 27.66, text: 'Sound leaves your mouth, travels through the air, and reaches your ears.'},
  {from: 28.01, to: 30.11, text: 'That’s roughly the path other people hear.'},
  {from: 30.59, to: 33.06, text: 'But there’s a second route that nobody else gets.'},
  {from: 33.47, to: 36.44, text: 'Every time you speak, your vocal cords vibrate.'},
  {from: 36.82, to: 41.76, text: 'Some of those vibrations travel through the tissues and bones of your head to your inner ears.'},
  {from: 42.15, to: 44.1, text: 'And that route changes the sound.'},
  {from: 44.49, to: 51.46, text: 'It adds a different mix of frequencies and physical vibrations, often making your own voice seem deeper or fuller to you.'},
  {from: 51.93, to: 55.86, text: 'Your brain grows up treating that combined sound as your normal voice.'},
  {from: 56.42, to: 57.73, text: 'Now press record.'},
  {from: 58.26, to: 61.63, text: 'A microphone mainly captures the sound traveling through the air.'},
  {from: 62.08, to: 67.13, text: 'When you play it back, your skull isn’t carrying those same speech vibrations to your ears.'},
  {from: 67.5, to: 70.8, text: 'So one familiar part of your voice is suddenly missing.'},
  {from: 71.21, to: 75.62, text: 'That’s why the recording can sound so strange, even when it’s perfectly clear.'},
  {from: 76.16, to: 79.56, text: 'Of course, phone microphones and speakers can change the sound, too.'},
  {from: 80.0, to: 83.07, text: 'But the weird feeling isn’t necessarily a bad recording.'},
  {from: 83.51, to: 89.91, text: 'It’s a mismatch between the voice you’ve heard inside your head your entire life and the voice traveling through the room.'},
  {from: 90.33, to: 93.87, text: 'So next time you cringe at your recorded voice, remember:'},
  {from: 94.32, to: 96.72, text: 'The microphone didn’t invent a stranger.'},
  {from: 97.06, to: 100.18, text: 'It let you hear something closer to what everyone else hears.'},
];

// Speech activity windows (seconds) used to drive the character's mouth.
export const SPEECH: [number, number][] = LINES.map((l) => [l.from, l.to]);

// Scene boundaries (seconds). A new visual discovery lands every ~7–14 s.
export const SCENES = {
  hook: 0,
  contrast: 8.5,
  twoPaths: 15.4,
  air: 23.6,
  bone: 30.4,
  mix: 44.3,
  record: 56.2,
  caveat: 75.9,
  mismatch: 83.3,
  finale: 90.2,
  end: AUDIO_SECONDS,
} as const;
