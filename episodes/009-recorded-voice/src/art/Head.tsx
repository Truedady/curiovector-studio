import React from 'react';
import {staticFile} from 'remotion';
import {Curve, curveD, pointAt, sample} from '../geom';
import {C} from '../theme';

// Profile portrait of the CurioVector narrator character, facing right.
// Native artboard: 700 × 800. Every anatomical landmark used by the
// diagrams is exported so both compositions can attach paths to it.

export const HEAD_W = 700;
export const HEAD_H = 800;

// Landmarks follow adult profile proportions: crown→chin ≈ 400 units, brow line
// ≈ 1/3 down the face, nose base ≈ 2/3, ear between brow and nose-base heights
// and just behind the vertical midline of the head's depth (back of skull → nose tip ≈ 0.9 × height).
export const MOUTH: [number, number] = [484, 410];
export const EAR_OPENING: [number, number] = [306, 334];
export const EARDRUM: [number, number] = [268, 336];
export const COCHLEA: [number, number] = [240, 346];
export const LARYNX: [number, number] = [380, 556];

// Path 1 (cyan): out of the mouth, through the air around the head, into the ear.
export const AIR_CURVE: Curve = {
  start: MOUTH,
  segs: [
    [590, 416, 650, 300, 618, 190],
    [584, 66, 430, 22, 300, 42],
    [158, 62, 88, 190, 110, 282],
    [130, 352, 230, 348, EAR_OPENING[0], EAR_OPENING[1]],
  ],
};
// Continuation inside the ear: canal → eardrum → cochlea.
export const CANAL_CURVE: Curve = {
  start: EAR_OPENING,
  segs: [[292, 334, 280, 336, EARDRUM[0], EARDRUM[1]], [258, 337, 248, 342, COCHLEA[0], COCHLEA[1]]],
};
// Path 2 (orange): vocal cords → tissue & bone of jaw/skull → inner ear.
export const BONE_CURVE: Curve = {
  start: LARYNX,
  segs: [
    [366, 520, 342, 490, 332, 456],
    [322, 420, 302, 392, 278, 374],
    [262, 362, 250, 352, COCHLEA[0], COCHLEA[1]],
  ],
};

export const AIR_S = sample(AIR_CURVE);
export const CANAL_S = sample(CANAL_CURVE);
export const BONE_S = sample(BONE_CURVE);

// Head silhouette (neck drawn separately behind it so the jaw edge stays crisp):
// crown → forehead → brow ridge → nasion → nose → philtrum → lips → chin →
// under-jaw → jaw angle → ramus below the ear → skull base → occiput.
const HEAD_D =
  'M 300 100 C 372 96 432 128 452 186 C 460 210 462 238 462 258 C 463 270 468 280 466 290 ' +
  'C 464 296 460 300 461 306 C 470 322 486 340 497 352 C 501 358 499 366 492 369 C 486 372 480 372 475 371 ' +
  'C 476 380 481 390 483 398 C 484 403 480 407 475 409 C 479 412 482 418 480 424 C 478 430 472 434 468 438 ' +
  'C 470 448 476 458 475 468 C 474 482 466 494 452 498 C 422 500 372 490 346 464 ' +
  'C 332 450 326 428 324 404 C 300 412 262 430 236 446 C 196 424 156 380 144 318 ' +
  'C 132 252 150 170 200 132 C 230 110 264 100 300 100 Z';
// Neck: front rises to just under the jaw, back meets the skull at the nape.
const NECK_D = 'M 236 440 C 248 496 254 552 254 612 L 414 612 C 406 574 400 540 400 484 C 380 488 356 478 344 462 C 334 446 328 428 326 412 C 296 420 264 432 236 440 Z';
const TORSO_D = 'M 70 800 C 84 690 160 614 254 596 L 414 596 C 520 610 612 690 634 800 Z';
// Short, textured cut that follows the skull with modest volume; sideburn in
// front of the ear, hair line clearing the top of the ear.
const HAIR_D =
  'M 452 190 C 472 166 470 128 444 104 C 408 72 330 68 270 78 C 200 90 146 138 130 210 ' +
  'C 120 270 128 340 152 390 C 168 418 196 436 228 442 C 240 426 252 408 262 392 ' +
  'C 268 360 266 320 276 298 C 288 276 316 270 332 280 C 342 290 344 312 346 330 L 358 330 ' +
  'C 356 300 362 262 382 240 C 402 220 430 204 452 190 Z';
// Variant for a second character: same skull, shoulder-length hair falling behind the ear.
const HAIR_LONG_D =
  'M 452 190 C 472 166 470 128 444 104 C 408 72 330 68 270 78 C 200 90 146 138 130 210 ' +
  'C 116 290 118 400 146 500 C 164 560 214 592 268 584 C 262 524 262 462 270 410 ' +
  'C 268 360 266 320 276 298 C 288 276 316 270 332 280 C 342 290 344 312 346 330 L 358 330 ' +
  'C 356 300 362 262 382 240 C 402 220 430 204 452 190 Z';

export type Look = {id: string; skin: [string, string, string]; neck: [string, string]; hair: [string, string, string]; top: [string, string]; longHair?: boolean};
const DEFAULT_LOOK: Look = {
  id: 'cv9',
  skin: ['#B87458', '#E3A27D', '#F4BE96'],
  neck: ['#8E5640', '#D08E6A'],
  hair: ['#1A1430', '#2B1E3C', '#3D2A48'],
  top: ['#123A63', '#0B2142'],
};

const EAR_D =
  'M 316 294 C 300 278 272 282 266 306 C 260 328 264 354 280 370 C 288 380 300 384 308 378 ' +
  'C 314 372 312 362 316 354 C 322 346 318 336 320 326 C 322 314 324 302 316 294 Z';
const SKULL_D =
  'M 300 114 C 366 112 424 142 444 196 C 452 224 452 256 452 280 C 446 300 440 318 446 340 ' +
  'C 450 360 458 372 456 388 L 414 392 C 382 392 352 386 330 378 C 300 386 270 404 246 420 ' +
  'C 196 404 158 364 150 306 C 142 240 160 168 206 136 C 234 118 266 113 300 114 Z';
const JAW_D = 'M 458 400 C 462 420 464 448 462 468 C 460 482 454 488 440 488 C 410 486 370 474 350 456 C 338 444 334 420 334 396';

const cochleaD = (() => {
  const pts: string[] = [];
  const turns = 2.6;
  for (let i = 0; i <= 80; i++) {
    const k = i / 80;
    const a = k * turns * Math.PI * 2;
    const r = 15 * (1 - 0.82 * k);
    pts.push(`${(COCHLEA[0] + Math.cos(a) * r).toFixed(1)} ${(COCHLEA[1] + Math.sin(a) * r).toFixed(1)}`);
  }
  return 'M ' + pts.join(' L ');
})();

export type HeadProps = {
  t: number;
  xray: number; // 0 portrait … 1 transparent editorial anatomy view
  talk: number; // mouth opening 0..1 (already modulated)
  recoil: number; // surprised lean-back
  air: number; // draw progress of the air path
  airFlow: number; // opacity of moving air pulses
  bone: number; // draw progress of the bone path
  boneFlow: number; // opacity of moving vibration pulses
  boneGhost: number; // dashed "missing" bone path
  cords: number; // vocal-cord highlight
  frown?: number;
  waves?: number; // sound arcs leaving the mouth (defaults to airFlow)
  airOpacity?: number; // dims the drawn air path while path 2 is explained
  look?: Look; // palette / hair variant for other people built on the same anatomy
};

const Pulses: React.FC<{s: ReturnType<typeof sample>; t: number; speed: number; n: number; color: string; r: number; op: number; img: string}> = ({
  s,
  t,
  speed,
  n,
  color,
  r,
  op,
  img,
}) => {
  if (op <= 0.01) return null;
  return (
    <g opacity={op}>
      {Array.from({length: n}).map((_, i) => {
        const f = (t * speed + i / n) % 1;
        const [x, y] = pointAt(s, f);
        const fade = Math.min(1, f * 6, (1 - f) * 6);
        return (
          <g key={i} opacity={fade}>
            <image href={img} x={x - r * 2.2} y={y - r * 2.2} width={r * 4.4} height={r * 4.4} />
            <circle cx={x} cy={y} r={r * 0.45} fill={color} />
          </g>
        );
      })}
    </g>
  );
};

export const Head: React.FC<HeadProps> = (p) => {
  const {t, xray} = p;
  const lk = p.look ?? DEFAULT_LOOK;
  const id = (n: string) => `${lk.id}-${n}`;
  const skinOp = 1 - 0.62 * xray;
  const hairOp = 1 - 0.75 * xray;
  const brow = -9 * p.recoil + 3 * (p.frown ?? 0);
  const eyeOpen = 1 + 0.35 * p.recoil;
  const tilt = -7 * p.recoil;
  const mouthRy = 0.5 + p.talk * 4.5 + p.recoil * 3.5;
  const vib = Math.sin(t * 60) * 1.6 * p.cords;

  return (
    <svg width={HEAD_W} height={HEAD_H} viewBox={`0 0 ${HEAD_W} ${HEAD_H}`} style={{overflow: 'visible'}}>
      <defs>
        <linearGradient id={id('skin')} x1="0" y1="0" x2="1" y2="0.2">
          <stop offset="0" stopColor={lk.skin[0]} />
          <stop offset="0.55" stopColor={lk.skin[1]} />
          <stop offset="1" stopColor={lk.skin[2]} />
        </linearGradient>
        <linearGradient id={id('neck')} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor={lk.neck[0]} />
          <stop offset="1" stopColor={lk.neck[1]} />
        </linearGradient>
        <linearGradient id={id('hair')} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor={lk.hair[0]} />
          <stop offset="0.6" stopColor={lk.hair[1]} />
          <stop offset="1" stopColor={lk.hair[2]} />
        </linearGradient>
        <linearGradient id={id('hoodie')} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor={lk.top[0]} />
          <stop offset="1" stopColor={lk.top[1]} />
        </linearGradient>
      </defs>

      {/* torso & neck */}
      <path d={TORSO_D} fill={`url(#${id('hoodie')})`} />
      <path d="M 200 640 C 270 690 420 690 486 636" stroke={C.cyan} strokeOpacity={0.35} strokeWidth={4} fill="none" />
      <g opacity={skinOp}>
        <path d={NECK_D} fill={`url(#${id('neck')})`} />
        {/* soft core shadow cast by the jaw onto the neck */}
        <path d="M 400 486 C 380 506 340 500 312 478 C 300 500 296 520 298 540 C 340 530 380 520 400 512 Z" fill="#6E3F30" opacity={0.22} />
        <path d="M 400 520 C 398 540 400 560 404 576" stroke="#9B5E47" strokeOpacity={0.5} strokeWidth={3} fill="none" strokeLinecap="round" />
      </g>
      <path d="M 254 596 C 300 640 380 640 414 596" stroke="#0A1A35" strokeWidth={18} fill="none" strokeLinecap="round" />

      <g transform={`rotate(${tilt} 330 470)`}>
        {/* rim light (cyan, behind) */}
        <path d={HEAD_D} fill="none" stroke={C.cyan} strokeOpacity={0.55 * (1 - xray * 0.5)} strokeWidth={6} transform="translate(-4 -2)" />
        <path d={HEAD_D} fill={`url(#${id('skin')})`} opacity={skinOp} />
        <g opacity={skinOp}>
          {/* cheekbone plane, temple shadow, jaw-edge shading and chin highlight */}
          <path d="M 446 352 C 430 340 404 340 382 352 C 400 360 426 362 446 352 Z" fill="#FFD2B0" opacity={0.35} />
          <path d="M 362 300 C 372 330 372 370 356 404 C 346 380 344 330 362 300 Z" fill="#B87458" opacity={0.22} />
          <path d="M 346 464 C 372 488 420 498 452 496" stroke="#9B5E47" strokeOpacity={0.45} strokeWidth={4} fill="none" strokeLinecap="round" />
          <path d="M 468 440 C 472 452 474 462 472 472" stroke="#FFD9BC" strokeOpacity={0.6} strokeWidth={3} fill="none" strokeLinecap="round" />
          <ellipse cx={428} cy={378} rx={22} ry={13} fill="#F08C7C" opacity={0.14} />
        </g>

        {/* x-ray anatomy layer */}
        <g opacity={xray}>
          <path d={SKULL_D} fill={C.navy} fillOpacity={0.45} stroke={C.cyan} strokeOpacity={0.55} strokeWidth={3} />
          <path d={JAW_D} fill="none" stroke={C.cyan} strokeOpacity={0.55} strokeWidth={4} strokeLinecap="round" />
          {/* teeth hint */}
          <path d="M 440 398 L 458 398 M 440 414 L 458 414" stroke={C.white} strokeOpacity={0.45} strokeWidth={5} strokeLinecap="round" />
          {/* ear canal */}
          <path d="M 306 326 C 290 324 276 326 268 328 M 306 344 C 290 346 276 346 268 344" stroke={C.white} strokeOpacity={0.6} strokeWidth={2.5} fill="none" />
          <ellipse cx={EARDRUM[0]} cy={EARDRUM[1]} rx={3.5} ry={13} fill={C.white} fillOpacity={0.8} />
          <path d="M 262 328 L 254 334 L 258 342 M 254 334 L 248 338" stroke={C.white} strokeOpacity={0.7} strokeWidth={2.5} fill="none" strokeLinecap="round" />
          <path d={cochleaD} stroke={C.white} strokeWidth={3} fill="none" strokeLinecap="round" />
          {/* airway + vocal cords */}
          <path d="M 366 516 C 364 556 366 600 370 640 M 396 512 C 396 556 398 600 402 640" stroke={C.cyan} strokeOpacity={0.35} strokeWidth={3} fill="none" />
          <g transform={`translate(${LARYNX[0]} ${LARYNX[1]})`}>
            <ellipse cx={0} cy={0} rx={20} ry={12} fill={C.navy} stroke={C.white} strokeOpacity={0.6} strokeWidth={2} />
            <path d={`M -14 ${-6 + vib} Q 0 ${2 + vib} 14 ${-6 + vib} M -14 ${6 - vib} Q 0 ${-2 - vib} 14 ${6 - vib}`} stroke={p.cords > 0.05 ? C.orange : C.white} strokeWidth={3} fill="none" strokeLinecap="round" />
          </g>
          {p.cords > 0.01 && (
            <image href={staticFile('glow_orange.png')} x={LARYNX[0] - 70} y={LARYNX[1] - 70} width={140} height={140} opacity={p.cords * (0.7 + 0.3 * Math.sin(t * 20))} />
          )}
        </g>

        {/* ear: helix, antihelix, concha, tragus, lobe */}
        <g opacity={skinOp}>
          <path d={EAR_D} fill="#D99572" />
          <path d="M 312 298 C 296 288 278 292 274 310 C 270 330 274 350 286 364" stroke="#B06F52" strokeWidth={4} fill="none" strokeLinecap="round" />
          <path d="M 304 304 C 290 302 284 318 288 334 C 290 346 296 352 302 350" stroke="#9B5E47" strokeWidth={3.5} fill="none" strokeLinecap="round" />
          <ellipse cx={306} cy={336} rx={6} ry={9} fill="#8E5640" opacity={0.7} />
          <path d="M 318 330 C 322 336 322 344 316 348" stroke="#C98361" strokeWidth={4} fill="none" strokeLinecap="round" />
        </g>

        {/* hair */}
        <path d={lk.longHair ? HAIR_LONG_D : HAIR_D} fill={`url(#${id('hair')})`} opacity={hairOp} />
        <g opacity={hairOp} strokeWidth={3} fill="none" strokeLinecap="round">
          <g stroke={C.cyan} strokeOpacity={0.35}>
            <path d="M 206 112 C 262 82 352 80 420 106" />
            <path d="M 146 236 C 152 180 186 132 240 104" />
            <path d="M 150 340 C 140 300 140 270 146 246" />
          </g>
          <g stroke="#5A4068" strokeOpacity={0.9} strokeWidth={4}>
            <path d="M 446 108 C 420 92 380 90 340 98" />
            <path d="M 452 150 C 420 128 374 124 330 134" />
            <path d="M 440 196 C 410 182 380 190 362 214" />
            <path d="M 250 140 C 220 170 210 210 214 250" />
          </g>
        </g>

        {/* face features */}
        <g opacity={Math.max(0.55, skinOp)}>
          {/* brow follows the brow ridge */}
          <path d={`M 424 ${282 + brow} C 436 ${274 + brow} 452 ${272 + brow} 464 ${278 + brow}`} stroke="#2A1E36" strokeWidth={6.5} strokeLinecap="round" fill="none" />
          {/* eye set back from the nasion, profile almond with visible cornea */}
          <g transform={`translate(444 302) scale(1 ${eyeOpen}) translate(-444 -302)`}>
            <path d="M 432 300 C 440 292 450 294 456 302 C 450 308 440 310 432 304 Z" fill={C.white} />
            <path d="M 446 296 C 452 298 455 302 452 307 C 447 307 444 302 446 296 Z" fill="#3B2A1E" />
            <circle cx={450} cy={300} r={1.6} fill={C.white} />
            <path d="M 430 298 C 438 290 450 291 458 300" stroke="#2A1E36" strokeWidth={3.2} fill="none" strokeLinecap="round" />
            <path d="M 434 308 C 442 311 450 310 455 305" stroke="#9B5E47" strokeWidth={1.8} fill="none" strokeLinecap="round" />
          </g>
          {/* nostril wing */}
          <path d="M 478 368 C 470 366 466 358 472 352 C 478 350 484 356 486 364" stroke="#9B5E47" strokeWidth={2.8} fill="none" strokeLinecap="round" />
          {/* lips and mouth opening */}
          <path d="M 481 393 C 484 398 482 405 476 409 C 472 404 475 398 481 393 Z" fill="#C46E66" />
          <ellipse cx={474} cy={410 + p.talk * 1.5} rx={5 + p.recoil * 1.5} ry={mouthRy} fill="#4A1E24" />
          <path d={`M 476 ${411 + p.talk * 3} C 481 ${415 + p.talk * 3} 482 ${422 + p.talk * 3} 478 ${427 + p.talk * 3} C 473 ${423 + p.talk * 3} 472 ${416 + p.talk * 3} 476 ${411 + p.talk * 3} Z`} fill="#C9766C" />
          <path d="M 466 409 C 470 410 472 410 474 410" stroke="#7A3A34" strokeWidth={2} strokeLinecap="round" />
        </g>

        {/* PATH 2: bone conduction (orange) */}
        {p.bone > 0.001 && (
          <g>
            <path d={curveD(BONE_CURVE)} stroke={C.orange} strokeOpacity={0.35} strokeWidth={22} fill="none" strokeLinecap="round" strokeDasharray={BONE_S.length} strokeDashoffset={BONE_S.length * (1 - p.bone)} />
            <path d={curveD(BONE_CURVE)} stroke={C.orange} strokeWidth={6} fill="none" strokeLinecap="round" strokeDasharray={BONE_S.length} strokeDashoffset={BONE_S.length * (1 - p.bone)} />
            {/* vibration ripples through jaw & skull */}
            {[0, 1, 2].map((i) => {
              const k = (t * 0.9 + i / 3) % 1;
              return (
                <path
                  key={i}
                  d={`M ${LARYNX[0] - 40 - k * 120} ${LARYNX[1] - 30 - k * 140} A ${60 + k * 160} ${60 + k * 160} 0 0 1 ${LARYNX[0] + 50 + k * 70} ${LARYNX[1] - 50 - k * 170}`}
                  stroke={C.orange}
                  strokeOpacity={(1 - k) * 0.5 * p.boneFlow}
                  strokeWidth={4}
                  fill="none"
                  strokeLinecap="round"
                />
              );
            })}
          </g>
        )}
        {p.boneGhost > 0.01 && (
          <path d={curveD(BONE_CURVE)} stroke={C.orange} strokeOpacity={0.55 * p.boneGhost} strokeWidth={5} fill="none" strokeDasharray="4 14" strokeLinecap="round" />
        )}
        <Pulses s={BONE_S} t={t} speed={0.8} n={4} color={C.orange} r={9} op={p.boneFlow} img={staticFile('spark_orange.png')} />

        {/* PATH 1: air conduction (cyan) */}
        {p.air > 0.001 && (
          <g opacity={p.airOpacity ?? 1}>
            <path d={curveD(AIR_CURVE)} stroke={C.cyan} strokeOpacity={0.25} strokeWidth={20} fill="none" strokeLinecap="round" strokeDasharray={AIR_S.length} strokeDashoffset={AIR_S.length * (1 - p.air)} />
            <path d={curveD(AIR_CURVE)} stroke={C.cyan} strokeWidth={5} fill="none" strokeLinecap="round" strokeDasharray={`${AIR_S.length}`} strokeDashoffset={AIR_S.length * (1 - p.air)} />
            <path d={curveD(CANAL_CURVE)} stroke={C.cyan} strokeWidth={5} fill="none" strokeLinecap="round" strokeDasharray={CANAL_S.length} strokeDashoffset={CANAL_S.length * (1 - Math.max(0, (p.air - 0.85) / 0.15))} />
          </g>
        )}
        <Pulses s={AIR_S} t={t} speed={0.45} n={5} color={C.cyan} r={9} op={p.airFlow} img={staticFile('spark_cyan.png')} />
        {/* sound waves leaving the mouth */}
        {(p.waves ?? p.airFlow) > 0.01 &&
          [0, 1, 2].map((i) => {
            const k = (t * 1.3 + i / 3) % 1;
            const r = 20 + k * 90;
            return (
              <path
                key={i}
                d={`M ${MOUTH[0] + r * 0.55} ${MOUTH[1] - r * 0.8} A ${r} ${r} 0 0 1 ${MOUTH[0] + r * 0.55} ${MOUTH[1] + r * 0.8}`}
                stroke={C.cyan}
                strokeOpacity={(1 - k) * 0.8 * (p.waves ?? p.airFlow)}
                strokeWidth={5}
                fill="none"
                strokeLinecap="round"
              />
            );
          })}
        {/* inner-ear meeting point */}
        {(p.air > 0.95 || p.bone > 0.95) && (
          <image href={staticFile('glow_white.png')} x={COCHLEA[0] - 45} y={COCHLEA[1] - 45} width={90} height={90} opacity={0.6 + 0.3 * Math.sin(t * 8)} />
        )}
      </g>
    </svg>
  );
};
