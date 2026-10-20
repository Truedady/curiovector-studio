import {useLayoutEffect} from 'react';
import {getInputProps, useCurrentFrame, useVideoConfig} from 'remotion';

/**
 * QA only (inputProps.safeAudit === true): measures every visible text node
 * each frame and logs any that leave the safe area (5% landscape, 8% Shorts
 * side inset). Read by tools/audit-text.mjs via onBrowserLog. Inert in renders.
 */
export const SafeAudit: React.FC = () => {
	const frame = useCurrentFrame();
	const {width, height} = useVideoConfig();
	const on = Boolean((getInputProps() as {safeAudit?: boolean}).safeAudit);
	useLayoutEffect(() => {
		if (!on) return;
		const inset = width * (width > height ? 0.05 : 0.08);
		const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
		for (let n = walker.nextNode(); n; n = walker.nextNode()) {
			const text = (n.textContent ?? '').trim();
			if (!text) continue;
			let op = 1;
			for (let el = n.parentElement; el; el = el.parentElement) op *= Number(getComputedStyle(el).opacity);
			if (op < 0.05) continue;
			const range = document.createRange();
			range.selectNodeContents(n);
			const r = range.getBoundingClientRect();
			if (r.width === 0) continue;
			if (r.left < inset - 0.5 || r.right > width - inset + 0.5) {
				console.log(`SAFE|${frame}|${Math.round(r.left)}|${Math.round(r.right)}|${Math.round(r.top)}|${text}`);
			}
		}
	}, [frame, on, width, height]);
	return null;
};
