import React from 'react';
import {Phone, Rack, Router, Skyline, Tower} from '../art';
import {T} from '../timing';
import {Bg, C, EASE_IN_OUT, Em, FONT, Glow, GlowLine, Headline, P, Svg, Tag, lerp, ramp, smooth, useLay} from '../lib';

const House: React.FC<{x: number; y: number; s?: number; lit?: number}> = ({x, y, s = 1, lit = 1}) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <path d="M-90,0 L-90,-110 L0,-175 L90,-110 L90,0 Z" fill="#15294F" stroke="#3B5A8C" strokeWidth={3} />
    <rect x={-60} y={-95} width={50} height={40} fill="#FFD9A0" opacity={0.3 + 0.4 * lit} />
    <rect x={18} y={-70} width={40} height={70} fill="#0B1735" stroke="#3B5A8C" strokeWidth={2} />
  </g>
);

const Vault: React.FC<{x: number; y: number; w: number; h: number; label: string; active: number; t: number; size: number}> = ({
  x,
  y,
  w,
  h,
  label,
  active,
  t,
  size,
}) => (
  <g>
    <rect x={x - w / 2} y={y - h / 2} width={w} height={h} rx={18} fill="#081230" stroke={C.cyan} strokeOpacity={0.35 + 0.5 * active} strokeWidth={3} />
    <Rack x={x} y={y + h / 2 - 22} s={(h - 70) / 150} n={3} active={active} t={t} />
    <text x={x} y={y - h / 2 - 14} textAnchor="middle" fill={C.white} fontFamily={FONT} fontWeight={700} fontSize={size} letterSpacing={3} opacity={0.4 + 0.6 * active}>
      {label}
    </text>
  </g>
);

// 19.8–32.9 s · zoom out: wireless first hop → physical fiber networks → toward the coast.
export const PhysicalPath: React.FC<{t: number}> = ({t}) => {
  const {w: W, h: H, tall} = useLay();
  const gY = tall ? 1000 : 720;
  const phone: P = tall ? [190, 880] : [330, 590];
  const house: P = tall ? [440, gY] : [540, gY];
  const tower: P = tall ? [820, gY] : [770, gY];

  // camera: from a close-up on the phone to the whole landscape
  const zk = ramp(t, T.zoomOut + 0.1, T.zoomOut + 1.5, EASE_IN_OUT);
  const z = lerp(tall ? 2.3 : 2.6, tall ? 1 : 1.25, zk);
  const fx = lerp(phone[0], tall ? W / 2 : 1010, zk);
  const fy = lerp(phone[1], tall ? H / 2 : 610, zk);
  const cam = `translate(${W / 2} ${H / 2}) scale(${z}) translate(${-fx} ${-fy})`;

  const hop = ramp(t, T.firstHop, T.firstHop + 0.6);
  const phys = ramp(t, T.physical, T.physical + 2.2);
  const web = ramp(t, T.fiberNet, T.fiberNet + 1.8);
  const pul = (o = 1) => ({t, speed: 0.22, len: 0.02, gap: 0.09, o});

  // fiber routes
  let trunk: P[];
  let feeds: P[][];
  let branches: P[][];
  let hubs: {x: number; y: number; w: number; h: number; label: string}[];
  if (!tall) {
    const tY = 840;
    trunk = [[tower[0], gY], [tower[0], tY], [1060, tY], [1400, tY], [1690, tY], [1690, gY + 10], [1760, gY + 40], [1860, gY + 130], [1990, gY + 220]];
    feeds = [[[house[0], gY], [house[0], 780], [tower[0] - 40, 780], [tower[0] - 40, tY]]];
    branches = [
      [[900, tY], [900, 930], [1300, 930], [1300, tY]],
      [[1060, tY], [1060, 1000], [1560, 1000], [1560, tY]],
      [[1250, tY], [1250, gY]],
      [[1520, tY], [1520, gY]],
      [[840, tY], [840, 960], [650, 960], [650, gY]],
      [[650, 960], [300, 960], [300, gY]],
    ];
    hubs = [];
  } else {
    trunk = [[tower[0], gY], [tower[0], 1110], [540, 1110], [540, 1300], [540, 1560], [540, 1720], [540, 1990]];
    feeds = [[[house[0], gY], [house[0], 1060], [700, 1060], [700, 1110]]];
    branches = [
      [[540, 1210], [130, 1210], [130, gY]],
      [[540, 1430], [960, 1430], [960, 1200], [1100, 1200]],
      [[540, 1430], [120, 1430], [120, 1700], [-20, 1700]],
      [[540, 1660], [940, 1660], [940, 1820], [1100, 1820]],
      [[300, 1210], [300, 1520], [540, 1520]],
    ];
    hubs = [
      {x: 540, y: 1300, w: 300, h: 150, label: 'NETWORK HUB'},
      {x: 540, y: 1580, w: 300, h: 150, label: 'DATA CENTER'},
    ];
  }
  const line = (pts: P[]) => `M${pts.map(([x, y]) => `${x},${y}`).join(' L')}`;

  return (
    <div style={{position: 'absolute', inset: 0}}>
      <Bg kind="space" />
      <Svg>
        <g transform={cam}>
          {/* ground cutaway */}
          <rect x={-400} y={gY} width={W + 800} height={H + 400} fill="url(#g-soil)" />
          {[60, 150, 260, 400].map((d, i) => (
            <path key={d} d={`M-400,${gY + d} Q${W / 3},${gY + d + 20 * (i % 2 ? 1 : -1)} ${W + 400},${gY + d}`} fill="none" stroke="#2A4370" strokeOpacity={0.35} strokeWidth={2} strokeDasharray={i % 2 ? '18 14' : undefined} />
          ))}
          <rect x={-400} y={gY - 3} width={W + 800} height={6} fill={C.cyan} opacity={0.35} />
          {!tall && (
            <>
              {/* sea at the coast */}
              <path d={`M1760,${gY + 4} L${W + 400},${gY + 4} L${W + 400},${H + 400} L1960,${H + 400} Z`} fill="url(#g-water)" />
              <rect x={1760} y={gY - 2} width={W} height={4} fill={C.cyanSoft} opacity={0.5} />
              <Skyline kind="city" x={1050} y={gY} s={0.75} lit={0.6 + 0.4 * web} />
              <Skyline kind="city" x={1330} y={gY} s={0.6} lit={0.6 + 0.4 * web} />
              <Rack x={1080} y={gY} s={0.6} n={2} active={phys} t={t} />
              <Rack x={1420} y={gY} s={0.8} n={4} active={phys} t={t} />
              <rect x={1640} y={gY - 90} width={110} height={90} rx={6} fill="#15294F" stroke={C.cyan} strokeOpacity={0.6} strokeWidth={2.5} />
              <circle cx={1695} cy={gY - 45} r={14} fill={C.orange} opacity={0.5 + 0.5 * phys} />
            </>
          )}
          {tall && <Skyline kind="city" x={560} y={gY} s={0.55} lit={0.6 + 0.4 * web} />}
          <House x={house[0]} y={house[1]} s={tall ? 0.9 : 0.85} lit={1} />
          <Router x={house[0] - 30} y={house[1] - 40} s={0.32} active={hop} />
          <Tower x={tower[0]} y={tower[1]} s={tall ? 0.95 : 0.9} active={hop} />
          {/* wireless first hop */}
          <g opacity={hop * (1 - 0.6 * phys)}>
            {[0, 1, 2].map((i) => {
              const k = ((t - T.firstHop) * 0.8 + i / 3) % 1;
              const r = 40 + k * Math.hypot(tower[0] - phone[0], tower[1] - 300 - phone[1]);
              return <circle key={i} cx={phone[0]} cy={phone[1]} r={r} fill="none" stroke={C.cyan} strokeWidth={4 / z} opacity={(1 - k) * 0.8} />;
            })}
          </g>
          {/* fiber network */}
          {branches.map((b, i) => (
            <GlowLine key={i} d={line(b)} w={tall ? 4 : 3.5} progress={ramp(t, T.fiberNet + i * 0.25, T.fiberNet + 1 + i * 0.25)} pulses={pul(0.8)} halo={0.7} o={0.85} />
          ))}
          {feeds.map((f, i) => (
            <GlowLine key={i} d={line(f)} w={tall ? 5 : 4.5} progress={phys} pulses={pul()} />
          ))}
          <GlowLine d={smooth(trunk, 0)} w={tall ? 7 : 6} progress={phys} pulses={pul()} />
          {hubs.map((hb, i) => (
            <Vault key={i} {...hb} active={ramp(t, T.physical + 0.8 + i * 0.6, T.physical + 1.4 + i * 0.6)} t={t} size={30} />
          ))}
          <Phone x={phone[0]} y={phone[1]} s={tall ? 0.95 : 0.8} glow={1} />
          <Glow x={phone[0]} y={phone[1]} r={140} o={0.5 * hop} />
          {/* labels */}
          <Tag
            x={tall ? 480 : (phone[0] + tower[0]) / 2 + 40}
            y={tall ? 640 : 455}
            text="SHORT WIRELESS HOP"
            size={tall ? 34 : 28}
            o={ramp(t, T.firstHop + 0.4, T.firstHop + 0.9) * (1 - ramp(t, T.fiberNet, T.fiberNet + 0.4))}
          />
          <Tag
            x={tall ? 540 : 1060}
            y={tall ? 1855 : 1000}
            text={tall ? 'FIBER-OPTIC NETWORKS' : 'FIBER-OPTIC NETWORKS UNDER STREETS'}
            size={tall ? 34 : 28}
            o={ramp(t, T.fiberNet + 0.8, T.fiberNet + 1.3)}
          />
          {!tall && (
            <>
              <Tag x={1080} y={gY - 150} text="NETWORK HUB" size={22} o={ramp(t, T.physical + 0.8, T.physical + 1.3)} />
              <Tag x={1420} y={gY - 190} text="DATA CENTER" size={22} o={ramp(t, T.physical + 1.4, T.physical + 1.9)} />
              <Tag x={1655} y={gY - 120} text="TO THE SEA →" size={22} color={C.orange} o={ramp(t, T.physical + 2, T.physical + 2.5)} />
            </>
          )}
          {tall && <Tag x={540} y={1760} text="↓ ONWARD TO THE COAST" size={30} color={C.orange} o={ramp(t, T.physical + 2.2, T.physical + 2.7) * (1 - ramp(t, T.fiberNet + 0.6, T.fiberNet + 1))} />}
        </g>
      </Svg>
      <Headline t={t} a={T.zoomOut} b={T.firstHop} lines={[<>But <Em>zoom out</Em></>]} wide={{size: 92}} tall={{size: 104}} />
      <Headline
        t={t}
        a={T.firstHop}
        b={T.physical}
        kicker="STEP 1"
        lines={tall ? [<>A wireless signal</>, <>to a <Em>router</Em> or</>, <Em>cell tower</Em>] : [<>A wireless signal to a</>, <><Em>router</Em> or <Em>cell tower</Em></>]}
        wide={{size: 66}}
        tall={{size: 80}}
      />
      <Headline
        t={t}
        a={T.physical}
        b={T.fiberNet}
        kicker="STEP 2"
        lines={tall ? [<>Then the journey</>, <>gets <Em>physical</Em></>] : [<>Then the journey gets <Em>physical</Em></>]}
        wide={{size: 66}}
        tall={{size: 80}}
      />
      <Headline
        t={t}
        a={T.fiberNet}
        b={T.ocean + 0.3}
        kicker="STEP 3"
        lines={tall ? [<>Racing through</>, <Em>fiber-optic</Em>, <>cables</>] : [<>Racing through</>, <><Em>fiber-optic</Em> cables</>]}
        wide={{size: 66}}
        tall={{size: 80}}
      />
    </div>
  );
};
