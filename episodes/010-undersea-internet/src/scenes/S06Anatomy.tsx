import React from 'react';
import {T} from '../timing';
import {Bg, C, EASE_IN_OUT, Em, FONT, Glow, Headline, Svg, Tag, lerp, pop, ramp, useLay} from '../lib';

/** Deep-water (lightweight) cable cross-section, simplified. build: 0..5 layers visible, inside → out. */
const Section: React.FC<{cx: number; cy: number; R: number; build?: number; marks?: number}> = ({cx, cy, R, build = 5, marks = 0}) => {
  const v = (i: number) => Math.max(0, Math.min(1, build - i));
  const wires = Array.from({length: 18}, (_, i) => (i / 18) * Math.PI * 2);
  const fibers = Array.from({length: 8}, (_, i) => (i / 8) * Math.PI * 2);
  const markPos: [number, number, number][] = [
    [0, 0, 0],
    [0.19, -0.75, 1],
    [0.31, -2.2, 2],
    [0.43, 2.4, 3],
    [0.74, 0.6, 4],
  ];
  return (
    <g>
      <circle cx={cx} cy={cy} r={R * 1.25} fill="url(#g-cy)" opacity={0.35} />
      {/* 5 polyethylene insulation */}
      <circle cx={cx} cy={cy} r={R * (0.46 + 0.54 * v(4))} fill="url(#g-section)" stroke="#6E86B3" strokeWidth={Math.max(1.5, R * 0.012)} opacity={v(4)} />
      {/* 4 copper */}
      <circle cx={cx} cy={cy} r={R * 0.46} fill="url(#g-copper)" opacity={v(3)} />
      <circle cx={cx} cy={cy} r={R * 0.4} fill="#1A2440" opacity={v(2)} />
      {/* 3 steel strength wires */}
      {wires.map((a, i) => (
        <circle key={i} cx={cx + Math.cos(a) * R * 0.31} cy={cy + Math.sin(a) * R * 0.31} r={R * 0.075} fill="url(#g-steel)" opacity={v(2)} />
      ))}
      {/* 2 steel tube */}
      <circle cx={cx} cy={cy} r={R * 0.22} fill="url(#g-steel)" opacity={v(1)} />
      <circle cx={cx} cy={cy} r={R * 0.165} fill="#0E2A50" />
      {/* 1 fibers */}
      {fibers.map((a, i) => (
        <g key={i}>
          <circle cx={cx + Math.cos(a) * R * 0.085} cy={cy + Math.sin(a) * R * 0.085} r={R * 0.032} fill="#FFFFFF" />
        </g>
      ))}
      <circle cx={cx} cy={cy} r={R * 0.16} fill="url(#g-wh)" opacity={0.7} />
      {marks > 0 &&
        markPos.map(([rr, ang, i]) => {
          const o = Math.max(0, Math.min(1, marks - i));
          const x = cx + Math.cos(ang) * R * rr;
          const y = cy + Math.sin(ang) * R * rr;
          return (
            <g key={i} opacity={o}>
              <circle cx={x} cy={y} r={R * 0.075} fill={C.orange} stroke={C.navy} strokeWidth={3} />
              <text x={x} y={y + R * 0.028} textAnchor="middle" fill={C.navy} fontFamily={FONT} fontWeight={700} fontSize={R * 0.085}>
                {i + 1}
              </text>
            </g>
          );
        })}
    </g>
  );
};

const LAYERS: [string, string][] = [
  ['GLASS FIBERS', 'carry the light'],
  ['STEEL TUBE + GEL', 'shields the fibers'],
  ['STEEL WIRES', 'give strength'],
  ['COPPER LAYER', 'powers the repeaters'],
  ['POLYETHYLENE', 'insulates & protects'],
];

// 49–61.5 s · not a giant pipe → garden-hose thick → layers around the fibers.
export const Anatomy: React.FC<{t: number}> = ({t}) => {
  const {w: W, h: H, tall} = useLay();
  const seaY = tall ? 1560 : 900;
  const pipe = tall ? {x: 540, y: seaY - 400, r: 380} : {x: 1180, y: seaY - 330, r: 320};
  const pipeIn = pop(t, T.surprise + 0.1, 0.6);
  const strike = ramp(t, T.notPipe + 0.3, T.notPipe + 0.7);
  const pk = ramp(t, T.notPipe + 1.0, T.notPipe + 2.6, EASE_IN_OUT);
  const studio = ramp(t, T.hose - 0.5, T.hose + 0.3);

  // the real cable section travels: tiny on the seabed → hose-sized → hero size
  const real0 = tall ? {x: 540, y: seaY - 14, r: 14} : {x: 1180, y: seaY - 12, r: 12};
  const pipeAt = {x: lerp(pipe.x, real0.x, pk), y: lerp(pipe.y, real0.y, pk), s: lerp(1, real0.r / pipe.r, pk)};
  const real1 = tall ? {x: 540, y: 960, r: 190} : {x: 700, y: 610, r: 190};
  const real2 = tall ? {x: 540, y: 880, r: 300} : {x: 620, y: 600, r: 330};
  const k1 = ramp(t, T.hose - 0.4, T.hose + 0.6, EASE_IN_OUT);
  const k2 = ramp(t, T.layers - 0.3, T.layers + 0.6, EASE_IN_OUT);
  const sec = {
    x: lerp(lerp(real0.x, real1.x, k1), real2.x, k2),
    y: lerp(lerp(real0.y, real1.y, k1), real2.y, k2),
    r: lerp(lerp(real0.r, real1.r, k1), real2.r, k2),
  };
  const build = t < T.layers ? 5 : ramp(t, T.layers + 0.2, T.layers + 2.6) * 5;
  const hose = tall ? {x: 540, y: 1430} : {x: 1250, y: 610};
  const hoseO = ramp(t, T.hose + 0.2, T.hose + 0.7) * (1 - ramp(t, T.layers - 0.4, T.layers));
  const listX = tall ? 120 : 1080;
  const listY = tall ? 1300 : 330;
  const listGap = tall ? 74 : 100;

  return (
    <div style={{position: 'absolute', inset: 0}}>
      <Bg kind="ocean" />
      <Bg kind="studio" o={studio} />
      <Svg>
        {/* seabed */}
        <g opacity={1 - studio}>
          <path d={`M-20,${seaY} Q${W * 0.3},${seaY - 30} ${W * 0.6},${seaY - 6} T${W + 20},${seaY - 10} L${W + 20},${H + 20} L-20,${H + 20} Z`} fill="url(#g-seabed)" stroke="#4A6A9C" strokeWidth={2} />
          {/* imagined giant pipe */}
          <g opacity={pipeIn > 0 ? Math.min(1, pipeIn) * (1 - ramp(pk, 0.75, 1)) : 0} transform={`translate(${pipeAt.x} ${pipeAt.y}) scale(${Math.max(0.01, pipeIn) * pipeAt.s})`}>
            <circle r={pipe.r} fill="#8EA3C4" fillOpacity={0.12} stroke="#C9D6EA" strokeWidth={10} strokeDasharray="28 18" />
            <circle r={pipe.r * 0.82} fill="#040A1C" fillOpacity={0.55} stroke="#8EA3C4" strokeOpacity={0.6} strokeWidth={6} />
            <text opacity={1 - ramp(pk, 0, 0.2)} y={-pipe.r - 40} textAnchor="middle" fill={C.cyanSoft} fontFamily={FONT} fontWeight={700} fontSize={tall ? 34 : 30} letterSpacing={3}>
              WHAT WE PICTURE: A GIANT PIPE
            </text>
            <g opacity={strike * (1 - ramp(pk, 0, 0.3))}>
              <line x1={-pipe.r * 1.05} y1={pipe.r * 1.05} x2={pipe.r * 1.05} y2={-pipe.r * 1.05} stroke={C.orange} strokeWidth={22} strokeLinecap="round" />
            </g>
          </g>
          <Tag x={real0.x} y={real0.y + (tall ? 80 : 70)} text="THE REAL CABLE" size={tall ? 32 : 28} color={C.orange} o={ramp(t, T.notPipe + 2.4, T.notPipe + 2.9) * (1 - studio)} />
        </g>
        {/* garden hose for scale */}
        <g opacity={hoseO}>
          <circle cx={hose.x} cy={hose.y} r={190} fill="#2F7A55" stroke="#6CC28F" strokeWidth={6} />
          <circle cx={hose.x} cy={hose.y} r={150} fill="#071028" stroke="#1E5C3E" strokeWidth={8} />
          <circle cx={hose.x - 60} cy={hose.y - 70} r={60} fill="#FFFFFF" opacity={0.06} />
          <Tag x={hose.x} y={hose.y + (tall ? 260 : 270)} text="GARDEN HOSE" size={tall ? 32 : 30} o={1} />
        </g>
        <Glow x={sec.x} y={sec.y} r={sec.r * 3 + 40} o={(1 - studio) * ramp(t, T.notPipe + 2.3, T.notPipe + 2.9)} />
        <g opacity={ramp(t, T.notPipe + 2.2, T.notPipe + 2.6)}>
          <Section cx={sec.x} cy={sec.y} R={sec.r} build={build} marks={ramp(t, T.layers + 0.4, T.layers + 3) * 5} />
        </g>
        <g opacity={hoseO}>
          <Tag x={real1.x} y={real1.y + (tall ? -250 : 270)} text="DEEP-WATER CABLE" size={tall ? 32 : 30} color={C.cyan} />
          {!tall && <text x={(real1.x + hose.x) / 2} y={real1.y + 12} textAnchor="middle" fill={C.white} fontFamily={FONT} fontWeight={700} fontSize={56}>≈</text>}
        </g>
        {/* layer key */}
        {LAYERS.map(([name, what], i) => {
          const o = ramp(t, T.layers + 0.5 + i * 0.5, T.layers + 0.9 + i * 0.5);
          const y = listY + i * listGap;
          return (
            <g key={name} opacity={o} transform={`translate(${(1 - o) * 30} 0)`}>
              <circle cx={listX + 26} cy={y - 10} r={24} fill={C.orange} />
              <text x={listX + 26} y={y} textAnchor="middle" fill={C.navy} fontFamily={FONT} fontWeight={700} fontSize={28}>
                {i + 1}
              </text>
              <text x={listX + 70} y={y + (tall ? 0 : -6)} fill={C.white} fontFamily={FONT} fontWeight={700} fontSize={tall ? 34 : 34} letterSpacing={1}>
                {name}
                {tall && <tspan fill={C.cyanSoft} fontWeight={600} fontSize={28}>{`  ${what}`}</tspan>}
              </text>
              {!tall && (
                <text x={listX + 70} y={y + 30} fill={C.cyanSoft} fontFamily={FONT} fontWeight={600} fontSize={26}>
                  {what}
                </text>
              )}
            </g>
          );
        })}
        <Tag
          x={tall ? 540 : 1380}
          y={tall ? 1680 : 900}
          text={tall ? 'NEAR SHORE: EXTRA ARMOR, THICKER' : 'NEAR SHORE: EXTRA STEEL ARMOR — MUCH THICKER'}
          size={tall ? 28 : 24}
          color={C.orange}
          o={ramp(t, T.layers + 2.6, T.layers + 3.1)}
        />
      </Svg>
      <Headline t={t} a={T.surprise} b={T.notPipe} lines={[<>The <Em>surprising</Em> part?</>]} wide={{size: 84}} tall={{size: 96}} />
      <Headline
        t={t}
        a={T.notPipe}
        b={T.hose}
        lines={tall ? [<>It&apos;s <Em>not</Em> a giant</>, <>steel pipe</>] : [<>It&apos;s <Em>not</Em> a giant steel pipe</>]}
        wide={{size: 76}}
        tall={{size: 92}}
      />
      <Headline
        t={t}
        a={T.hose}
        b={T.layers}
        kicker="IN DEEP WATER"
        lines={tall ? [<>Roughly as thick</>, <>as a <Em>garden hose</Em></>] : [<>Roughly as thick as a</>, <Em>garden hose</Em>]}
        wide={{size: 76}}
        tall={{size: 86}}
      />
      <Headline
        t={t}
        a={T.layers}
        b={T.hundreds + 0.3}
        lines={tall ? [<>Layers wrapped</>, <>around tiny <Em>glass</Em></>] : [<>Protective layers around</>, <>tiny <Em>glass fibers</Em></>]}
        sub={tall ? undefined : 'Simplified deep-water design · construction varies'}
        wide={{size: 64, width: 1000}}
        tall={{size: 84}}
      />
    </div>
  );
};
