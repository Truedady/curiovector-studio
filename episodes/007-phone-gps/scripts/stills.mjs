// Render a list of stills for review with a single bundle + browser.
// Usage: node scripts/stills.mjs <CompositionId> <outDir> <sec,sec,...> [scale]
import {bundle} from '@remotion/bundler';
import {openBrowser, renderStill, selectComposition} from '@remotion/renderer';
import path from 'node:path';

const [id, outDir, list, scale = '1'] = process.argv.slice(2);
const serveUrl = await bundle({entryPoint: path.resolve('src/index.ts')});
const browserExecutable = process.env.CV_BROWSER ?? null;
const puppeteerInstance = await openBrowser('chrome', {browserExecutable, chromiumOptions: {gl: 'swangle'}});
const composition = await selectComposition({serveUrl, id, puppeteerInstance, browserExecutable});
for (const s of list.split(',')) {
  const frame = Math.min(composition.durationInFrames - 1, Math.round(Number(s) * composition.fps));
  const output = path.join(outDir, `${id}_${String(s).padStart(5, '0')}.jpg`);
  await renderStill({composition, serveUrl, frame, output, imageFormat: 'jpeg', jpegQuality: 85, scale: Number(scale), puppeteerInstance, browserExecutable});
  console.log('still', output);
}
await puppeteerInstance.close({silent: true});
