// Text safe-area audit without writing images: node tools/audit-text.mjs <compId> [everyNthFrame]
import fs from 'node:fs';
import path from 'node:path';
import {bundle} from '@remotion/bundler';
import {renderFrames, selectComposition} from '@remotion/renderer';

const [id, nth = '5'] = process.argv.slice(2);
const shell = '/opt/pw-browsers/chromium_headless_shell-1194/chrome-linux/headless_shell';
const browserExecutable = fs.existsSync(shell) ? shell : null;
const inputProps = {safeAudit: true};
const serveUrl = await bundle({entryPoint: path.resolve('src/index.ts')});
const composition = await selectComposition({serveUrl, id, inputProps, browserExecutable});
const hits = new Map();
await renderFrames({
	serveUrl,
	composition,
	inputProps,
	browserExecutable,
	imageFormat: 'none',
	everyNthFrame: Number(nth),
	outputDir: null,
	onStart: () => {},
	onFrameUpdate: () => {},
	onBrowserLog: (l) => {
		if (!l.text.startsWith('SAFE|')) return;
		const [, fr, left, right, top, text] = l.text.split('|');
		const k = text;
		const prev = hits.get(k);
		if (!prev) hits.set(k, {first: +fr, last: +fr, left: +left, right: +right, top: +top});
		else Object.assign(prev, {last: Math.max(prev.last, +fr), left: Math.min(prev.left, +left), right: Math.max(prev.right, +right)});
	},
});
console.log(`${id}: ${hits.size} text items outside safe area`);
for (const [k, v] of hits) console.log(`  f${v.first}-${v.last} x[${v.left},${v.right}] y${v.top}  "${k}"`);
