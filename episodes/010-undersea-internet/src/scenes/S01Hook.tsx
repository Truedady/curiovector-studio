import React from 'react';
import {Img, staticFile} from 'remotion';
import {Phone, Satellite, Skyline} from '../art';
import {T} from '../timing';
import {C, EASE_IN_OUT, Em, FONT, Glow, GlowLine, Headline, P, Tag, along, lerp, quad, ramp, useLay, win} from '../lib';

// Atlantic cross-section depth profile, u: 0 (NY coast) → 1 (UK coast), returns 0..1 of max depth.
const KEYS: [number, number][] = [
  [0, 0.05], [0.06, 0.09], [0.11, 0.14], [0.18, 0.7], [0.25, 0.92], [0.34, 1], [0.43, 0.95], [0.5, 0.8],
  [0.57, 0.94], [0.66, 1], [0.75, 0.93], [0.82, 0.7], [0.89, 0.14], [0.94, 0.09], [1, 0.05],
];
export const atlanticDepth = (u: number) => {
  let i = 0;
  while (i < KEYS.length - 2 && u > KEYS[i + 1][0]) i++;
  const [u0, d0] = KEYS[i];
  const [u1, d1] = KEYS[i + 1];
  const k = Math.max(0, Math.min(1, (u - u0) / (u1 - u0)));
  const s = (1 - Math.cos(Math.PI * k)) / 2;
  const deep = Math.min(1, Math.max(0, (lerp(d0, d1, s) - 0.2) / 0.5));
  return lerp(d0, d1, s) + deep * (0.006 * Math.sin(u * 110) + 0.006 * Math.sin(u * 47 + 1));
};

// 0–7 s · NY → London message, imagined satellite hop freezes, camera dives to the seafloor cable.
export const Hook: React.FC<{t: number}> = ({t}) => {
  const {w: W, h: H, tall} = useLay();
  const sY = tall ? 1430 : 610; // sea surface (world y)
  const bY = tall ? 1790 : 1000; // deepest floor
  const coastL = tall ? 150 : 300;
  const coastR = W - coastL;
  const DIVE_A = 4.85;
  const DIVE_B = 6.15;
  const dk = ramp(t, DIVE_A, DIVE_B, EASE_IN_OUT);

  const N = 90;
  const floor: P[] = Array.from({length: N + 1}, (_, i) => {
    const u = i / N;
    return [coastL + u * (coastR - coastL), sY + 30 + atlanticDepth(u) * (bY - sY - 30)];
  });
  const poly = (pts: P[]) => pts.map(([x, y]) => `${x.toFixed(1)},${y.toFixed(1)}`).join(' L');
  const floorD = `M-200,${sY - 28} L${coastL - 40},${sY - 28} L${poly(floor)} L${coastR + 40},${sY - 28} L${W + 200},${sY - 28} L${W + 200},${bY + 1200} L-200,${bY + 1200} Z`;
  const strata = [22, 55].map((off) => `M${poly(floor.map(([x, y]) => [x, y + off] as P))}`);
  const cablePts: P[] = [[coastL - 70, sY - 22], ...floor.slice(2, -2).map(([x, y]) => [x, y - 3] as P), [coastR + 70, sY - 22]];
  const cableD = `M${poly(cablePts)}`;

  // camera: zoom-dive onto the abyssal plain next to the ridge
  const focusU = tall ? 0.34 : 0.36;
  const fIdx = Math.round(focusU * N);
  const zEnd = tall ? 3.3 : 3.0;
  const target: P = [floor[fIdx][0] + (tall ? 30 : 60), floor[fIdx][1] - (H * (tall ? 0.19 : 0.15)) / zEnd];
  const z = lerp(1, zEnd, dk) * (1 + 0.025 * ramp(t, 0, DIVE_A)) * (1 + 0.04 * ramp(t, DIVE_B, 7.3));
  const fx = lerp(W / 2, target[0], dk);
  const fy = lerp(H / 2, target[1], dk);
  const cam = `translate(${W / 2}px, ${H / 2}px) scale(${z}) translate(${-fx}px, ${-fy}px)`;

  // imagined sky path
  const ny: P = tall ? [250, 1150] : [coastL - 110, sY - 250];
  const lon: P = tall ? [W - 130, sY - 300] : [W - coastL + 110, sY - 280];
  const sat: P = tall ? [720, 760] : [1340, 250];
  const c1: P = [ny[0] + (sat[0] - ny[0]) * 0.1, sat[1] - 20];
  const c2: P = [lon[0] - (lon[0] - sat[0]) * 0.1, sat[1] - 20];
  const up = ramp(t, 0.7, 3.1);
  const dot = quad(ny, c1, sat, up);
  const freeze = ramp(t, T.notSpace, T.notSpace + 0.35);
  const arcCol = freeze > 0.5 ? C.orange : C.cyan;

  const msg = along(cablePts, lerp(0.18, 0.45, ramp(t, 5.4, 7.3)));
    const ridge = floor[Math.round(N / 2)];

  return (
    <div style={{position: 'absolute', inset: 0, overflow: 'hidden', background: C.navyDeep}}>
      <div style={{position: 'absolute', left: 0, top: 0, width: W, height: H, transformOrigin: '0 0', transform: cam}}>
        <Img src={staticFile(`img/space_${tall ? 'tall' : 'wide'}.jpg`)} style={{position: 'absolute', left: 0, top: sY - H, width: W, height: H}} />
        <Img
          src={staticFile(`img/ocean_${tall ? 'tall' : 'wide'}.jpg`)}
          style={{position: 'absolute', left: -200, top: sY, width: W + 400, height: ((W + 400) * H) / W}}
        />
        <svg width={W} height={H} style={{position: 'absolute', left: 0, top: 0, overflow: 'visible'}}>
          <Glow x={W / 2} y={sY} r={W * 0.55} o={0.3} />
          {/* imagined route through space */}
          <g opacity={1 - ramp(t, DIVE_A + 0.1, DIVE_A + 0.6)}>
            <path
              d={`M${ny[0]},${ny[1]} Q${c1[0]},${c1[1]} ${sat[0]},${sat[1]} Q${c2[0]},${c2[1]} ${lon[0]},${lon[1]}`}
              fill="none"
              stroke={arcCol}
              strokeOpacity={0.45 * ramp(t, 0.6, 1.2)}
              strokeWidth={4}
              strokeDasharray="14 14"
              strokeDashoffset={-t * 30 * (1 - freeze)}
            />
            <GlowLine d={`M${ny[0]},${ny[1]} Q${c1[0]},${c1[1]} ${sat[0]},${sat[1]}`} w={5} color={arcCol} progress={up} o={1 - 0.35 * freeze} />
            <Satellite x={sat[0]} y={sat[1]} s={tall ? 1.05 : 1} r={-12} o={ramp(t, 0.2, 0.8)} beam={up} />
            <Glow x={dot[0]} y={dot[1]} r={60} color={freeze > 0.5 ? 'or' : 'wh'} o={ramp(t, 0.7, 0.9)} />
            <circle cx={dot[0]} cy={dot[1]} r={11} fill={C.white} opacity={ramp(t, 0.7, 0.9)} />
            <Tag
              x={tall ? 560 : 760}
              y={tall ? sat[1] + 220 : sat[1] + 130}
              text="WHAT WE IMAGINE"
              size={tall ? 32 : 26}
              color={C.cyanSoft}
              o={win(t, 1.3, T.notSpace + 0.1)}
            />
            <g opacity={freeze} transform={`translate(${sat[0]} ${sat[1]}) scale(${0.6 + 0.4 * freeze})`}>
              <circle r={92} fill="none" stroke={C.orange} strokeWidth={9} />
              <path d="M-52,-52 L52,52 M52,-52 L-52,52" stroke={C.orange} strokeWidth={14} strokeLinecap="round" />
            </g>
          </g>
          {/* land, seabed and sediment */}
          <path d={floorD} fill="url(#g-seabed)" stroke="#4A6A9C" strokeWidth={1.5} />
          {strata.map((d, i) => (
            <path key={i} d={d} fill="none" stroke="#5E7299" strokeOpacity={0.22 - i * 0.07} strokeWidth={1.2} strokeDasharray={i === 1 ? '10 6' : undefined} />
          ))}
          {floor.filter((_, i) => i % 5 === 2 && i > 8 && i < N - 8).map(([x, y], i) => (
            <ellipse key={i} cx={x + (i % 3) * 3} cy={y + 1.5} rx={3 + (i % 4) * 1.5} ry={1.8 + (i % 3) * 0.7} fill="#2A4370" />
          ))}
          <rect x={-200} y={sY - 4} width={W + 400} height={5} fill={C.cyanSoft} opacity={0.35} />
          <Skyline kind="ny" x={tall ? -60 : 30} y={sY - 26} s={tall ? 0.8 : 0.95} />
          <Skyline kind="london" x={W - (tall ? -60 : 30)} y={sY - 26} s={tall ? 0.8 : 0.95} flip />
          <text x={tall ? 30 : 60} y={sY + 44} fill={C.white} fontFamily={FONT} fontWeight={700} fontSize={tall ? 32 : 26} letterSpacing={3}>
            NEW YORK
          </text>
          <text x={W - (tall ? 30 : 60)} y={sY + 44} fill={C.white} fontFamily={FONT} fontWeight={700} fontSize={tall ? 32 : 26} letterSpacing={3} textAnchor="end">
            LONDON
          </text>
          {/* the real route */}
          <GlowLine d={cableD} w={tall ? 2.6 : 2.4} progress={ramp(t, T.notSpace + 0.2, DIVE_B)} pulses={{t, speed: 0.06, len: 0.006, gap: 0.03}} />
          <Glow x={msg[0]} y={msg[1]} r={26} color="wh" o={win(t, 5.4, 7.6, 0.3)} />
          <circle cx={msg[0]} cy={msg[1]} r={3} fill="#FFFFFF" opacity={win(t, 5.4, 7.6, 0.3)} />
          <Tag x={ridge[0]} y={ridge[1] + 24} text="MID-ATLANTIC RIDGE" size={tall ? 7 : 7.5} color={C.cyanSoft} o={ramp(t, DIVE_B - 0.2, DIVE_B + 0.3)} />
          <Phone x={ny[0]} y={ny[1]} s={tall ? 1.05 : 0.55} bubble={ramp(t, 0.15, 0.6)} o={1 - ramp(t, DIVE_A, DIVE_A + 0.5)} />
        </svg>
      </div>
      {/* screen-space depth counter during the dive */}
      <div
        style={{
          position: 'absolute',
          right: tall ? 70 : 90,
          top: tall ? 1380 : 880,
          textAlign: 'right',
          fontFamily: FONT,
          fontWeight: 700,
          color: C.cyanSoft,
          opacity: ramp(t, DIVE_A, DIVE_A + 0.3),
        }}
      >
        <div style={{fontSize: tall ? 26 : 22, letterSpacing: '0.2em'}}>DEPTH</div>
        <div style={{fontSize: tall ? 64 : 54, color: C.white, fontVariantNumeric: 'tabular-nums'}}>
          {(Math.round((4000 * dk) / 50) * 50).toLocaleString('en-US')} m
        </div>
      </div>
      <Headline
        t={t}
        a={0}
        b={T.notSpace}
        kicker="NEW YORK → LONDON"
        lines={tall ? [<>That message</>, <>probably traveled</>, <Em>underwater</Em>] : [<>That message probably</>, <>traveled <Em>underwater</Em></>]}
        wide={{size: 70, width: 1100, y: 64}}
        tall={{size: 92}}
      />
      <Headline t={t} a={T.notSpace} b={T.seriously + 0.1} lines={[<>Not through</>, <Em>space.</Em>]} wide={{size: 88}} tall={{size: 104}} />
      <Headline t={t} a={T.seriously} b={7.4} lines={[<>Seriously.</>]} sub="A fiber-optic cable resting on the seafloor" wide={{size: 88}} tall={{size: 104}} />
    </div>
  );
};
