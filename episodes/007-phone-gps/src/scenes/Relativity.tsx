import React from 'react';
import {ClockFace, Satellite} from '../art';
import {C, Earth, FONT, Fill, Headline, Rich, Svg, Tag, lerp, map, pick, rise, useL} from '../lib';
import {CUE} from '../timing';

// 70.5–83.2 s: GPS satellites are fast (~14,000 km/h) and high (~20,200 km).
// Special relativity: moving clocks tick slower. General relativity: clocks in weaker
// gravity tick faster. Engineers build in corrections. Offsets shown are illustrative only.

const Card: React.FC<{t: number; at: number; x: number; y: number; w: number; title: string; body: string; color: string}> = ({
  t,
  at,
  x,
  y,
  w,
  title,
  body,
  color,
}) => {
  const k = rise(t, at, 0.5);
  if (k <= 0.002) return null;
  return (
    <div
      style={{
        position: 'absolute',
        left: x,
        top: y,
        width: w,
        opacity: k,
        transform: `translateX(${(1 - k) * 40}px)`,
        background: 'rgba(8,19,47,0.9)',
        borderLeft: `6px solid ${color}`,
        borderRadius: 14,
        padding: '18px 24px',
        boxSizing: 'border-box',
        fontFamily: FONT,
        color: C.white,
      }}
    >
      <div style={{fontSize: 20, fontWeight: 800, letterSpacing: '0.12em', color}}>{title}</div>
      <div style={{fontSize: 32, fontWeight: 700, marginTop: 6, lineHeight: 1.18}}>
        <Rich text={body} />
      </div>
    </div>
  );
};

export const Relativity: React.FC<{t: number}> = ({t}) => {
  const L = useL();
  const P = L.P;
  const earth = pick(L, {cx: 300, cy: 1300, r: 760}, {cx: 540, cy: 2350, r: 950});
  const orbitR = pick(L, 1250, 1600);
  const a0 = pick(L, 27, -8);
  const a1 = pick(L, 47, 8);
  const ang = (map(t, [70.5, 83.2], [a0, a1], (x) => x) * Math.PI) / 180;
  const sat = {x: earth.cx + Math.sin(ang) * orbitR, y: earth.cy - Math.cos(ang) * orbitR};
  const surf = {x: earth.cx + Math.sin(ang) * earth.r, y: earth.cy - Math.cos(ang) * earth.r};
  const tan = {x: Math.cos(ang), y: Math.sin(ang)};

  const facts = rise(t, CUE.fast + 0.3, 0.6);
  const fix = rise(t, CUE.correct + 1.3, 0.8);
  // illustrative drift between satellite & ground clocks, removed by the correction
  const drift = rise(t, CUE.einstein + 2.2, 2.5) * 22 * (1 - fix);
  const ground = (Math.floor((t - 70) * 4) / 4) * 6;

  const hx = pick(L, 110, 70);
  const hy = pick(L, 80, 190);
  const hs = pick(L, 64, 70);
  const hw = pick(L, 700, 940);
  const card = pick(L, {x: 1300, y: 240, w: 540, gap: 175}, {x: 70, y: 920, w: 940, gap: 160});
  const pair = pick(L, {x: 1300, y: 600, w: 540}, {x: 70, y: 1250, w: 940});

  return (
    <Fill>
      <Earth cx={earth.cx} cy={earth.cy} r={earth.r} />
      <Svg>
        <circle cx={earth.cx} cy={earth.cy} r={orbitR} fill="none" stroke={C.cyan} strokeWidth={2} strokeDasharray="4 14" opacity={0.4} />
        {/* speed streaks behind the satellite */}
        {[0, 1, 2, 3].map((i) => (
          <line
            key={i}
            x1={sat.x - tan.x * (130 + i * 12) + (i - 1.5) * 16 * -tan.y}
            y1={sat.y - tan.y * (130 + i * 12) + (i - 1.5) * 16 * tan.x}
            x2={sat.x - tan.x * (330 + i * 50) + (i - 1.5) * 16 * -tan.y}
            y2={sat.y - tan.y * (330 + i * 50) + (i - 1.5) * 16 * tan.x}
            stroke={C.cyan}
            strokeWidth={4}
            strokeLinecap="round"
            opacity={0.5 * facts}
          />
        ))}
        {/* altitude bracket */}
        <g opacity={facts}>
          <line x1={lerp(surf.x, sat.x, 0.02)} y1={lerp(surf.y, sat.y, 0.02)} x2={lerp(surf.x, sat.x, 0.86)} y2={lerp(surf.y, sat.y, 0.86)} stroke={C.orange} strokeWidth={3} strokeDasharray="10 8" />
          <circle cx={surf.x} cy={surf.y} r={7} fill={C.orange} />
        </g>
      </Svg>
      <Satellite id="rel" t={t} x={sat.x} y={sat.y} scale={pick(L, 0.75, 0.72)} rot={(ang * 180) / Math.PI} glow={0.7} />
      <Tag t={t} at={CUE.fast + 0.4} out={P ? CUE.einstein + 0.5 : CUE.correct + 0.3} x={lerp(surf.x, sat.x, 0.45) + pick(L, 30, 34)} y={lerp(surf.y, sat.y, 0.45)} text="≈ 20,200 km up" color={C.orange} size={pick(L, 26, 28)} anchor="left" />
      <Tag t={t} at={CUE.fast + 1.2} out={CUE.correct + 0.3} x={sat.x} y={sat.y + pick(L, 110, -100)} text="≈ 14,000 km/h" color={C.cyan} size={pick(L, 26, 28)} />

      <Card t={t} at={CUE.einstein + 0.5} x={card.x} y={card.y} w={card.w} color={C.cyan} title="SPECIAL RELATIVITY" body="Moving fast → its clock ticks a little *slower*" />
      <Card t={t} at={CUE.einstein + 1.3} x={card.x} y={card.y + card.gap} w={card.w} color={C.orange} title="GENERAL RELATIVITY" body="Weaker gravity up high → ticks a little *faster*" />

      {/* satellite vs ground clock, drifting then corrected */}
      {rise(t, CUE.correct, 0.5) > 0.002 && (
        <div style={{position: 'absolute', left: pair.x, top: pair.y, width: pair.w, height: 250, opacity: rise(t, CUE.correct, 0.5), background: 'rgba(8,19,47,0.88)', borderRadius: 18}}>
          <svg width={pair.w} height={250} style={{position: 'absolute', left: 0, top: 0, overflow: 'visible'}}>
            <ClockFace x={pair.w * 0.22} y={92} r={66} color={C.cyan} angle={ground + drift} />
            <ClockFace x={pair.w * 0.78} y={92} r={66} color={C.white} angle={ground} />
            <text x={pair.w * 0.22} y={196} textAnchor="middle" fontFamily={FONT} fontWeight={700} fontSize={22} fill={C.cyan}>
              IN ORBIT
            </text>
            <text x={pair.w * 0.78} y={196} textAnchor="middle" fontFamily={FONT} fontWeight={700} fontSize={22} fill={C.white}>
              ON THE GROUND
            </text>
            <text x={pair.w * 0.5} y={100} textAnchor="middle" fontFamily={FONT} fontWeight={800} fontSize={30} fill={fix > 0.5 ? C.cyan : C.orange}>
              {fix > 0.5 ? 'in sync ✓' : 'drifting'}
            </text>
          </svg>
        </div>
      )}
      <Headline
        t={t}
        at={CUE.correct + 1.5}
        out={83.15}
        x={pair.x + pair.w / 2}
        y={pair.y + 262}
        size={22}
        width={pair.w}
        weight={600}
        color={C.dim}
        lift={0}
        align="center"
        text="Illustration only — real offsets are tiny but add up fast."
      />

      <Headline t={t} at={CUE.twist} out={CUE.fast} x={hx} y={hy} size={hs * 1.15} width={hw} text="One more *twist…*" />
      <Headline t={t} at={CUE.fast} out={CUE.einstein} x={hx} y={hy} size={hs} width={hw} text="They move *fast*, very *high* above Earth." />
      <Headline t={t} at={CUE.einstein} out={CUE.correct} x={hx} y={hy} size={hs} width={hw} text="Even *Einstein's relativity* matters." />
      <Headline t={t} at={CUE.correct} out={83.15} x={hx} y={hy} size={hs} width={hw} text="Engineers *correct for it* to keep GPS accurate." />
    </Fill>
  );
};
