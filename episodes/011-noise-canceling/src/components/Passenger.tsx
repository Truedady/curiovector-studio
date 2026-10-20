import React from 'react';
import {C} from '../theme';

/**
 * Side-on adult passenger wearing over-ear headphones, facing right.
 * Local coordinate box: 0..760 x 0..900. The earcup centre is EAR — kept
 * fixed so every wave/label that targets the ear stays aligned.
 *
 * Proportions (crown→chin H = 400): crown y164, brow y336, eye y364,
 * nose base y456, mouth y490, chin y564; ear centred between brow and nose
 * base, just behind the middle of a skull that is ~0.85 H deep. Flat vector
 * shapes + linear gradients only (no filters) so it is cheap every frame.
 */
export const EAR = {x: 318, y: 392};

export const Passenger: React.FC<{
	id: string;
	ancOn?: number; // 0..1 glow of the ANC indicator
	cupGlow?: number;
}> = ({id, ancOn = 0, cupGlow = 0}) => {
	const g = (n: string) => `${id}-${n}`;
	return (
		<g>
			<defs>
				<linearGradient id={g('skin')} x1="0" y1="0" x2="1" y2="0">
					<stop offset="0" stopColor={C.skinShade} />
					<stop offset="0.5" stopColor={C.skin} />
					<stop offset="1" stopColor="#F4CBAA" />
				</linearGradient>
				<linearGradient id={g('neck')} x1="0" y1="0" x2="1" y2="0">
					<stop offset="0" stopColor="#9E6C5A" />
					<stop offset="1" stopColor={C.skinShade} />
				</linearGradient>
				<linearGradient id={g('hair')} x1="0" y1="0" x2="1" y2="1">
					<stop offset="0" stopColor="#2A2438" />
					<stop offset="1" stopColor={C.hair} />
				</linearGradient>
				<linearGradient id={g('shirt')} x1="0" y1="0" x2="1" y2="1">
					<stop offset="0" stopColor="#1C2D5C" />
					<stop offset="1" stopColor="#0E1A3C" />
				</linearGradient>
				<linearGradient id={g('cup')} x1="0" y1="0" x2="1" y2="1">
					<stop offset="0" stopColor="#3B4C82" />
					<stop offset="0.5" stopColor="#1A2650" />
					<stop offset="1" stopColor="#0B1433" />
				</linearGradient>
				<linearGradient id={g('band')} x1="0" y1="0" x2="1" y2="0">
					<stop offset="0" stopColor="#24356A" />
					<stop offset="1" stopColor="#4A62A0" />
				</linearGradient>
			</defs>
			{/* torso / shoulder, seated */}
			<path d="M96 900 C 100 800 150 712 252 652 C 300 676 380 700 452 704 C 516 716 556 766 572 900 Z" fill={`url(#${g('shirt')})`} />
			<path d="M262 660 C 312 712 392 730 448 706" fill="none" stroke="#2C437E" strokeWidth={6} />
			{/* neck: joins behind the jaw and below the skull, slight forward lean */}
			<path d="M226 486 C 236 540 244 600 256 664 C 320 700 400 716 448 708 C 436 664 430 622 440 584 C 416 566 378 540 340 500 Z" fill={`url(#${g('neck')})`} />
			{/* head */}
			<path
				d="M228 505 C 182 478 156 430 152 370 C 148 300 170 228 222 192 C 268 160 330 152 382 162
				C 438 172 478 206 494 258 C 504 290 506 318 502 336 C 500 346 494 352 494 358
				C 500 380 520 408 534 428 C 540 437 536 448 524 450 C 516 452 508 452 502 456
				C 504 464 508 472 506 480 C 503 486 498 488 498 490 C 503 494 506 500 502 508
				C 498 514 492 516 492 522 C 494 536 502 548 496 560 C 490 570 476 574 462 572
				C 430 568 380 548 352 524 C 340 512 332 494 330 478 C 300 490 262 505 228 505 Z"
				fill={`url(#${g('skin')})`}
			/>
			{/* under-jaw shadow onto the neck */}
			<path d="M462 572 C 430 568 380 548 352 524 C 372 562 410 590 446 596 C 452 588 458 580 462 572 Z" fill="#8F5E4E" opacity={0.45} />
			{/* face details */}
			<ellipse cx={462} cy={440} rx={26} ry={16} fill="#F29B83" opacity={0.22} />
			<path d="M452 338 C 466 330 484 330 500 336" stroke={C.hair} strokeWidth={7} fill="none" strokeLinecap="round" />
			<path d="M470 362 C 478 356 488 356 494 362 C 488 368 478 370 470 366 Z" fill="#F4F1EE" />
			<path d="M486 358 C 492 360 494 364 490 368 C 486 366 484 362 486 358 Z" fill="#2A1E1A" />
			<path d="M466 360 C 476 352 488 352 496 360" stroke="#3A2A2A" strokeWidth={4} fill="none" strokeLinecap="round" />
			<path d="M500 440 C 508 432 520 436 518 446" stroke={C.skinShade} strokeWidth={3} fill="none" strokeLinecap="round" />
			<path d="M498 490 L 485 492" stroke="#9C5D52" strokeWidth={3} fill="none" strokeLinecap="round" />
			<path d="M476 528 C 484 534 492 534 496 530" stroke={C.skinShade} strokeWidth={2} fill="none" opacity={0.6} />
			{/* hair: follows the skull, temple hairline + short sideburn */}
			<path
				d="M486 236 C 470 196 432 168 382 156 C 326 146 262 154 214 186 C 160 222 140 300 144 372
				C 148 430 172 484 216 516 C 224 520 232 518 238 512 C 270 506 302 494 332 480 L 372 410
				C 378 360 376 320 392 292 C 412 262 446 248 486 236 Z"
				fill={`url(#${g('hair')})`}
			/>
			<path d="M226 200 C 286 166 356 160 420 178" stroke="#3A3656" strokeWidth={5} fill="none" opacity={0.8} strokeLinecap="round" />
			<path d="M170 300 C 176 250 196 220 226 200" stroke="#3A3656" strokeWidth={4} fill="none" opacity={0.6} strokeLinecap="round" />
			{/* headband: rises from the yoke over the crown, just clear of the hair */}
			<path d="M321 276 C 318 224 320 184 328 146" fill="none" stroke={`url(#${g('band')})`} strokeWidth={28} strokeLinecap="round" />
			<path d="M330 260 C 328 216 330 186 335 156" fill="none" stroke="#7F96D4" strokeWidth={3} opacity={0.6} />
			{/* yoke */}
			<rect x={EAR.x - 14} y={EAR.y - 128} width={28} height={46} rx={10} fill="#33457C" />
			{/* earcup (≈10 cm tall at this scale) fully covering the ear */}
			<g transform={`rotate(-6 ${EAR.x} ${EAR.y})`}>
				<rect x={EAR.x - 75} y={EAR.y - 92} width={150} height={184} rx={68} fill="#0A1230" />
				<rect x={EAR.x - 68} y={EAR.y - 85} width={136} height={170} rx={62} fill={`url(#${g('cup')})`} />
				<rect x={EAR.x - 46} y={EAR.y - 64} width={92} height={128} rx={44} fill="none" stroke="#5E77B8" strokeWidth={3} opacity={0.55} />
				{/* outside mic grille */}
				<circle cx={EAR.x - 22} cy={EAR.y - 52} r={6} fill="#0A1230" stroke="#6F86C4" strokeWidth={2} />
				{/* ANC indicator */}
				<circle cx={EAR.x + 26} cy={EAR.y + 58} r={6} fill={ancOn > 0.01 ? C.cyan : '#2A375F'} opacity={0.4 + 0.6 * ancOn} />
				<rect x={EAR.x - 68} y={EAR.y - 85} width={136} height={170} rx={62} fill="none" stroke={C.cyan} strokeWidth={5} opacity={cupGlow} />
			</g>
		</g>
	);
};
