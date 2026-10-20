// Render review stills for both formats in one bundle: node scripts/stills.mjs L 30,90 P 30,90
import path from 'node:path';
import fs from 'node:fs';
import {bundle} from '@remotion/bundler';
import {renderStill, selectComposition} from '@remotion/renderer';

const root = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const outDir = path.join(root, 'out', 'stills');
fs.mkdirSync(outDir, {recursive: true});
const browser = '/opt/pw-browsers/chromium_headless_shell-1194/chrome-linux/headless_shell';
const browserExecutable = fs.existsSync(browser) ? browser : null;
const args = process.argv.slice(2);
const jobs = [];
for (let i = 0; i < args.length; i += 2) {
	const id = args[i] === 'L' ? 'CV008ElevatorLandscape' : 'CV008ElevatorShorts';
	for (const f of args[i + 1].split(',')) jobs.push({id, tag: args[i], frame: Number(f)});
}
const serveUrl = await bundle({entryPoint: path.join(root, 'src/index.ts'), publicDir: path.join(root, 'public')});
const comps = {};
for (const j of jobs) {
	comps[j.id] ??= await selectComposition({serveUrl, id: j.id, browserExecutable});
	const output = path.join(outDir, `${j.tag}_${String(j.frame).padStart(4, '0')}.png`);
	await renderStill({serveUrl, composition: comps[j.id], frame: j.frame, output, browserExecutable, overwrite: true});
	console.log(output);
}
