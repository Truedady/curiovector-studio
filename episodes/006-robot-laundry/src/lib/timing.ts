// Master timeline derived once from "Robot shirt.mp3" (109.09 s).
// Sentence boundaries come from ffmpeg silencedetect (-35 dB, 0.25 s)
// fitted to the script; both compositions share these exact values.
export const FPS = 30;
export const AUDIO_SECONDS = 109.087;
export const DURATION_FRAMES = Math.ceil(AUDIO_SECONDS * FPS);

export const SENTENCES: [number, number, string][] = [
  [0.0, 2.07, 'You can fold a shirt in seconds.'],
  [2.43, 4.77, 'For a robot, that can be a nightmare.'],
  [5.32, 6.38, "And that's strange."],
  [6.9, 11.7, 'Because modern AI can already solve problems that once looked impossibly hard.'],
  [12.19, 18.16, 'It can write code, pass difficult exams, and help scientists analyze huge amounts of information.'],
  [18.68, 24.0, 'So why does a household chore like folding laundry still give robots such a hard time?'],
  [24.59, 25.81, 'The answer is simple.'],
  [26.28, 28.59, 'A T-shirt is much harder than it looks.'],
  [29.14, 38.09, 'When you pick up a shirt, your brain instantly understands its shape, its weight, how it bends, how it drapes, and where your hands should move next.'],
  [38.58, 39.85, 'You barely think about it.'],
  [40.43, 43.89, 'But for a robot, almost every part of that is difficult.'],
  [44.44, 46.9, 'First, it has to see the shirt clearly.'],
  [47.47, 49.12, "But cloth doesn't stay still."],
  [49.62, 55.66, 'It wrinkles, folds, hides its own edges, and changes shape every time the robot touches it.'],
  [56.19, 59.24, 'Then the robot has to predict what will happen next.'],
  [59.72, 62.05, 'If it pulls here, will the sleeve flip over?'],
  [62.44, 63.56, 'Will the fabric bunch up?'],
  [64.01, 65.49, 'Will the whole shirt slide away?'],
  [66.08, 67.75, 'And then comes control.'],
  [68.27, 73.02, 'A tiny mistake in grip, angle, or force can ruin the whole motion.'],
  [73.54, 75.01, "That's the real challenge."],
  [75.52, 78.02, 'A math problem stays the same while you solve it.'],
  [78.52, 80.54, 'A shirt changes every second.'],
  [81.09, 90.22, 'So even though AI is becoming incredibly good at reasoning, the physical world is still messy, unpredictable, and full of hidden complexity.'],
  [90.78, 95.29, "That's why robots may beat you at chess, calculations, or pattern recognition…"],
  [95.76, 97.62, 'but still struggle with your laundry.'],
  [98.18, 102.95, "And that's also why the future of robotics isn't just about making smarter AI."],
  [103.46, 109.08, "It's about building machines that can truly understand and handle the chaos of the real world."],
];

// Scene windows in seconds (cuts sit inside narration pauses).
export const SCENES = {
  hook: [0, 5.1],
  ai: [5.1, 18.42],
  question: [18.42, 28.86],
  human: [28.86, 40.15],
  see: [40.15, 55.93],
  predict: [55.93, 65.78],
  control: [65.78, 75.27],
  equation: [75.27, 90.5],
  scoreboard: [90.5, 97.9],
  closing: [97.9, AUDIO_SECONDS],
} as const;

export const clamp = (x: number, a = 0, b = 1) => Math.min(b, Math.max(a, x));
export const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
export const easeInOut = (x: number) =>
  x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2;
export const easeOut = (x: number) => 1 - Math.pow(1 - x, 3);
export const ramp = (T: number, a: number, b: number, fn = easeInOut) =>
  fn(clamp((T - a) / (b - a)));
// 0 → 1 → 0 window with soft edges.
export const pulse = (T: number, a: number, b: number, edge = 0.35) =>
  Math.min(ramp(T, a, a + edge), 1 - ramp(T, b - edge, b));
