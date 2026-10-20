// Bake static vector artwork to transparent PNGs in public/art (run once after art changes).
// Usage: node scripts/export_art.mjs
import {bundle} from '@remotion/bundler';
import {openBrowser, renderStill, selectComposition} from '@remotion/renderer';
import path from 'node:path';

const JOBS = [
  ['CV007ArtPhoneMap', 'phone_map.png'],
  ['CV007ArtPhoneOffline', 'phone_offline.png'],
  ['CV007ArtMountainsWide', 'mountains_wide.png'],
  ['CV007ArtMountainsTall', 'mountains_tall.png'],
];
const serveUrl = await bundle({entryPoint: path.resolve('src/index.ts')});
const browserExecutable = process.env.CV_BROWSER ?? null;
const puppeteerInstance = await openBrowser('chrome', {browserExecutable, chromiumOptions: {gl: 'angle'}});
for (const [id, file] of JOBS) {
  const composition = await selectComposition({serveUrl, id, puppeteerInstance, browserExecutable});
  const output = path.resolve('public/art', file);
  await renderStill({composition, serveUrl, frame: 0, output, imageFormat: 'png', puppeteerInstance, browserExecutable});
  console.log('baked', output);
}
await puppeteerInstance.close({silent: true});
