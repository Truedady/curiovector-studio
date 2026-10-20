import React from 'react';
import {MiniPhone, Satellite} from '../art';
import {C, Earth, FONT, Fill, Headline, Rings, Svg, Tag, map, pick, rise, useL} from '../lib';
import {CUE} from '../timing';

// 24.75–34.62 s: satellites only broadcast "where I am + what time it is"; the phone only listens.
const MONO = "'DejaVu Sans Mono', monospace";

const Card: React.FC<{t: number; at: number; x: number; y: number; time: string; scale?: number}> = ({t, at, x, y, time, scale = 1}) => {
  const k = rise(t, at, 0.5);
  if (k <= 0.002) return null;
  return (
    <div
      style={{
        position: 'absolute',
        left: x,
        top: y,
        transform: `translate(-50%, 0) scale(${(0.92 + 0.08 * k) * scale})`,
        opacity: k,
        background: 'rgba(8,19,47,0.9)',
        border: `2px solid ${C.cyan}`,
        borderRadius: 14,
        padding: '10px 18px',
        fontFamily: MONO,
        fontSize: 22,
        color: C.white,
        whiteSpace: 'nowrap',
        lineHeight: 1.45,
      }}
    >
      <div>
        <span style={{color: C.cyan, fontFamily: FONT, fontWeight: 800, letterSpacing: '0.08em'}}>I'M HERE </span> orbit x·y·z
      </div>
      <div>
        <span style={{color: C.orange, fontFamily: FONT, fontWeight: 800, letterSpacing: '0.08em'}}>TIME </span> {time}
      </div>
    </div>
  );
};

export const Broadcast: React.FC<{t: number}> = ({t}) => {
  const L = useL();
  const P = L.P;
  const earth = pick(L, {cx: 960, cy: 1720, r: 1060}, {cx: 540, cy: 2080, r: 920});
  const ph = {x: earth.cx, y: earth.cy - earth.r + 4};

  // Satellites ride a slow orbit (landscape) / are stacked vertically (portrait).
  const orbitR = pick(L, 1460, 1300);
  const spin = (t - 24.75) * 0.35;
  const landscapeAngles = [-31, -12, 10, 29];
  const sats = P
    ? [
        {x: 225, y: 560},
        {x: 850, y: 640},
        {x: 240, y: 930},
        {x: 860, y: 1010},
      ].map((s, i) => ({x: s.x + Math.sin(t * 0.4 + i) * 10, y: s.y}))
    : landscapeAngles.map((a) => {
        const r = ((a + spin) * Math.PI) / 180;
        return {x: earth.cx + Math.sin(r) * orbitR, y: earth.cy - Math.cos(r) * orbitR};
      });

  const ringO = rise(t, 25.2, 0.8);
  const listen = rise(t, CUE.listens, 0.6);
  const zoom = map(t, [CUE.clever, 34.62], [1, 1.12]);
  const time = (offset: number) => {
    const tt = Math.max(0, t - 27 + offset);
    const ss = String(7 + Math.floor(tt)).padStart(2, '0');
    const frac = String(Math.floor((tt % 1) * 1e6)).padStart(6, '0');
    return `09:41:${ss}.${frac.slice(0, 3)} ${frac.slice(3)}`;
  };

  const hx = pick(L, 110, 70);
  const hy = pick(L, 90, 190);
  const hs = pick(L, 70, 72);
  const hw = pick(L, 1100, 940);

  return (
    <Fill>
      <div style={{position: 'absolute', inset: 0, transform: `scale(${zoom})`, transformOrigin: `${sats[1].x}px ${sats[1].y}px`}}>
        <Earth cx={earth.cx} cy={earth.cy} r={earth.r} />
        <Svg>
          {/* orbit guide */}
          {!P && <circle cx={earth.cx} cy={earth.cy} r={orbitR} fill="none" stroke={C.cyan} strokeWidth={2} strokeDasharray="4 14" opacity={0.35} />}
          {P &&
            [0, 1].map((i) => (
              <ellipse key={i} cx={540} cy={600 + i * 370} rx={560} ry={70} fill="none" stroke={C.cyan} strokeWidth={2} strokeDasharray="4 14" opacity={0.3} />
            ))}
          {sats.map((s, i) => (
            <Rings key={i} t={t} x={s.x} y={s.y + 30} maxR={pick(L, 820, 760)} period={2.6} count={3} phase={i * 0.6} opacity={ringO * 0.75} width={3} />
          ))}
          <MiniPhone x={ph.x} y={ph.y} s={pick(L, 1.25, 1.5)} lit={listen} />
          {listen > 0 &&
            sats.map((s, i) => (
              <line
                key={i}
                x1={s.x}
                y1={s.y + 40}
                x2={ph.x}
                y2={ph.y - 50}
                stroke={C.cyan}
                strokeWidth={2.5}
                strokeDasharray="3 10"
                opacity={listen * 0.7}
              />
            ))}
        </Svg>
        {sats.map((s, i) => (
          <Satellite key={i} id={`bc${i}`} t={t} x={s.x} y={s.y} scale={pick(L, 0.55, 0.6)} rot={P ? 0 : (landscapeAngles[i] + spin) * 0.6} glow={0.5} />
        ))}
        <Card t={t} at={CUE.broadcast + 0.3} x={P ? 470 : sats[1].x} y={P ? 680 : sats[1].y + 70} time={time(0)} scale={pick(L, 1, 1.12)} />
        {!P && <Card t={t} at={CUE.broadcast + 0.9} x={sats[2].x} y={sats[2].y + 70} time={time(0)} />}
      </div>

      <Tag t={t} at={CUE.dontKnow + 0.6} out={CUE.listens} x={ph.x} y={ph.y - pick(L, 150, 190)} text="who? no idea." color={C.orange} size={pick(L, 24, 28)} />
      <Tag t={t} at={CUE.listens + 0.3} out={34.5} x={ph.x} y={ph.y - pick(L, 150, 190)} text="receive only · sends nothing" color={C.cyan} size={pick(L, 24, 28)} />

      <Headline t={t} at={CUE.dontKnow} out={CUE.broadcast} x={hx} y={hy} size={hs} width={hw} text="The satellites *don't know you exist.*" />
      <Headline t={t} at={CUE.broadcast} out={CUE.listens} x={hx} y={hy} size={hs} width={hw} text="They just _broadcast_ where they are + *the exact time.*" />
      <Headline t={t} at={CUE.listens} out={CUE.clever} x={hx} y={hy} size={hs} width={hw} text="Your phone just *listens.*" />
      <Headline t={t} at={CUE.clever} out={34.6} x={hx} y={hy} size={hs} width={hw} text="Here's the *clever part…*" />
      <Headline
        t={t}
        at={CUE.broadcast + 1.5}
        out={34.6}
        x={pick(L, 110, 70)}
        y={pick(L, 1010, 1520)}
        size={pick(L, 24, 28)}
        width={pick(L, 1200, 940)}
        weight={600}
        color={C.dim}
        lift={0}
        text="GPS is one of several satellite systems (GNSS) a phone can listen to."
      />
    </Fill>
  );
};
