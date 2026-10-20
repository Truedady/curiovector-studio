// Bundle once, render review stills: node tools/stills.mjs <compId> <outDir> <frame> [frame...]
import fs from 'node:fs';
import path from 'node:path';
import {bundle} from '@remotion/bundler';
import {renderStill, selectComposition} from '@remotion/renderer';

const [id, outDir, ...frames] = process.argv.slice(2);
const shell = '/opt/pw-browsers/chromium_headless_shell-1194/chrome-linux/headless_shell';
const browserExecutable = fs.existsSync(shell) ? shell : null;
const serveUrl = await bundle({entryPoint: path.resolve('src/index.ts')});
const composition = await selectComposition({serveUrl, id, browserExecutable});
fs.mkdirSync(outDir, {recursive: true});
for (const fr of frames) {
	const output = path.join(outDir, `${id}_${String(fr).padStart(4, '0')}.png`);
	await renderStill({serveUrl, composition, frame: Number(fr), output, browserExecutable});
	console.log(output);
}
