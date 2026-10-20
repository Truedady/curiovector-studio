import React from 'react';
import {MiniPhone} from '../art';
import {C, FONT, Fill, Headline, Svg, pick, rise, useL} from '../lib';
import {CUE} from '../timing';

// 83.2–87.2 s: open sky (clean direct signals) vs. city canyon (blocked / bounced signals).
const Panel: React.FC<{t: number; x: number; y: number; w: number; h: number; city: boolean}> = ({t, x, y, w, h, city}) => {
  const k = rise(t, CUE.clearSky + (city ? 0.6 : 0.1), 0.6);
  const ground = y + h * 0.8;
  const ph = {x: x + w * 0.5, y: ground};
  const sources = [0.1, 0.35, 0.65, 0.9].map((f) => ({x: x + w * f, y: y + 30}));
  const draw = rise(t, CUE.clearSky + (city ? 1.0 : 0.5), 1.0);
  return (
    <g opacity={k}>
      <rect x={x} y={y} width={w} height={h} rx={26} fill="#0C1A40" stroke={city ? C.orange : C.cyan} strokeWidth={3} />
      {!city && <path d={`M ${x} ${ground + 10} Q ${x + w * 0.5} ${ground - 60} ${x + w} ${ground + 10} L ${x + w} ${y + h} L ${x} ${y + h} Z`} fill="#13285A" />}
      {city && (
        <g>
          <rect x={x} y={ground} width={w} height={y + h - ground} fill="#13285A" />
          {[
            [0.06, 0.62],
            [0.22, 0.42],
            [0.66, 0.36],
            [0.82, 0.58],
          ].map(([fx, fh], i) => {
            const bx = x + w * fx;
            const bh = (h * 0.8) * (1 - fh) + 20;
            return (
              <g key={i}>
                <rect x={bx} y={ground - bh} width={w * 0.14} height={bh} fill="#1A2C5E" stroke="#2C4688" strokeWidth={2} />
                {Array.from({length: Math.floor(bh / 46)}).map((_, j) => (
                  <rect key={j} x={bx + 12} y={ground - bh + 16 + j * 46} width={w * 0.14 - 24} height={14} fill={C.orange} opacity={0.18 + ((i + j) % 3) * 0.1} />
                ))}
              </g>
            );
          })}
        </g>
      )}
      {/* signal paths */}
      {sources.map((s, i) => {
        if (!city) {
          return (
            <line key={i} x1={s.x} y1={s.y} x2={s.x + (ph.x - s.x) * draw} y2={s.y + (ph.y - 40 - s.y) * draw} stroke={C.cyan} strokeWidth={4} strokeDasharray="12 9" />
          );
        }
        if (i === 1 || i === 2) {
          // one clean path, one bounced path
          return i === 1 ? (
            <line key={i} x1={ph.x - 20} y1={s.y} x2={ph.x - 20 + 10 * draw} y2={s.y + (ph.y - 40 - s.y) * draw} stroke={C.cyan} strokeWidth={4} strokeDasharray="12 9" />
          ) : (
            <polyline
              key={i}
              points={`${s.x},${s.y} ${x + w * 0.69},${y + h * 0.45} ${ph.x + 12},${ph.y - 40}`}
              fill="none"
              stroke={C.orange}
              strokeWidth={4}
              strokeDasharray="12 9"
              opacity={draw}
            />
          );
        }
        // blocked by a building
        const bx = i === 0 ? x + w * 0.2 : x + w * 0.82;
        const by = y + h * (i === 0 ? 0.33 : 0.48);
        return (
          <g key={i} opacity={draw}>
            <line x1={s.x} y1={s.y} x2={bx} y2={by} stroke={C.orange} strokeWidth={4} strokeDasharray="12 9" />
            <g transform={`translate(${bx},${by})`} stroke={C.orange} strokeWidth={6} strokeLinecap="round">
              <line x1={-14} y1={-14} x2={14} y2={14} />
              <line x1={14} y1={-14} x2={-14} y2={14} />
            </g>
          </g>
        );
      })}
      <MiniPhone x={ph.x} y={ph.y} s={1.25} lit={city ? 0.2 : 1} />
      <text x={x + 30} y={y + h - 26} fontFamily={FONT} fontWeight={800} fontSize={30} letterSpacing="2" fill={city ? C.orange : C.cyan}>
        {city ? 'CITY CANYON · INDOORS' : 'OPEN SKY'}
      </text>
      <text x={x + w - 30} y={y + h - 26} textAnchor="end" fontFamily={FONT} fontWeight={800} fontSize={34} fill={city ? C.orange : C.cyan}>
        {city ? 'harder' : 'best'}
      </text>
    </g>
  );
};

export const Sky: React.FC<{t: number}> = ({t}) => {
  const L = useL();
  const P = L.P;
  const a = pick(L, {x: 110, y: 270, w: 820, h: 620}, {x: 70, y: 470, w: 940, h: 500});
  const b = pick(L, {x: 990, y: 270, w: 820, h: 620}, {x: 70, y: 1010, w: 940, h: 500});
  return (
    <Fill>
      <Svg>
        <Panel t={t} {...a} city={false} />
        <Panel t={t} {...b} city />
      </Svg>
      <Headline t={t} at={CUE.clearSky} out={87.15} x={pick(L, 110, 70)} y={pick(L, 80, 190)} size={pick(L, 64, 66)} width={pick(L, 1700, 940)} text="GPS works best with a *clear view of the sky.*" />
      <Headline
        t={t}
        at={CUE.clearSky + 1.4}
        out={87.15}
        x={pick(L, 110, 70)}
        y={pick(L, 935, 1530)}
        size={pick(L, 26, 28)}
        width={pick(L, 1700, 940)}
        weight={600}
        color={C.dim}
        lift={0}
        text={P ? 'Buildings, roofs and dense trees can block or bounce signals.' : 'Buildings, roofs and dense trees can block or bounce signals — phones often blend in other clues when they can.'}
      />
    </Fill>
  );
};
