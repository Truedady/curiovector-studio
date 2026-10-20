// Bundle once, render many stills:  node tools/stills.mjs w:100,200 t:100
import {bundle} from '@remotion/bundler';
import {renderStill, selectComposition} from '@remotion/renderer';
import path from 'node:path';
import fs from 'node:fs';

const root = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const browserExecutable = '/opt/pw-browsers/chromium_headless_shell-1194/chrome-linux/headless_shell';
const outDir = path.join(root, 'out', 'stills');
fs.mkdirSync(outDir, {recursive: true});
const serveUrl = await bundle({entryPoint: path.join(root, 'src', 'index.ts'), publicDir: path.join(root, 'public')});
const ids = {w: 'CV010InternetLandscape', t: 'CV010InternetShorts'};
for (const arg of process.argv.slice(2)) {
  const [k, frames] = arg.split(':');
  const composition = await selectComposition({serveUrl, id: ids[k], browserExecutable});
  for (const f of frames.split(',').map(Number)) {
    const output = path.join(outDir, `${k}_${String(f).padStart(4, '0')}.jpg`);
    await renderStill({composition, serveUrl, output, frame: f, imageFormat: 'jpeg', jpegQuality: 85, browserExecutable});
    console.log(output);
  }
}
