import React from 'react';
import {T} from '../timing';
import {Bg, C, EASE_IN_OUT, Em, FONT, Glow, Headline, Svg, Tag, ramp, useLay} from '../lib';

const BITS = [1, 0, 1, 1, 0, 1, 0, 0, 1, 1, 1, 0, 0, 1, 0, 1, 1, 0, 1, 0, 0, 0, 1, 1, 0, 1];

/** Cable stripped back layer by layer, drawn along +x (local coords). */
const CableCutaway: React.FC<{t: number; a: number}> = ({t, a}) => {
  const fibers = Array.from({length: 8}, (_, i) => i);
  const step = (i: number) => ramp(t, a + 0.2 + i * 0.35, a + 0.7 + i * 0.35);
  const wires = Array.from({length: 22}, (_, i) => i);
  return (
    <g>
      {/* fibers fan out of the tube */}
      {fibers.map((i) => {
        const dy = (i - 3.5) * 40;
        const d = `M1100,${(i - 3.5) * 6} C1300,${(i - 3.5) * 8} 1400,${dy} 1760,${dy * 1.15}`;
        const k = step(4);
        return (
          <g key={i} opacity={k}>
            <path d={d} fill="none" stroke={C.cyan} strokeOpacity={0.18} strokeWidth={16} />
            <path d={d} fill="none" stroke={['#9BE3FF', '#43C5F5', '#FFFFFF', '#7FD6FF'][i % 4]} strokeWidth={4} />
            <circle cx={1760} cy={dy * 1.15} r={9} fill="#FFFFFF" />
            <circle cx={1760} cy={dy * 1.15} r={40} fill="url(#g-cy)" />
          </g>
        );
      })}
      {/* inner steel tube with gel */}
      <rect x={-200} y={-30} width={1310} height={60} rx={30} fill="url(#g-steel)" />
      {/* stranded steel wires */}
      <g opacity={1}>
        <rect x={-200} y={-74} width={1110} height={148} rx={20} fill="#4A5D80" />
        {wires.map((i) => (
          <line key={i} x1={-200 + i * 52} y1={-74} x2={-150 + i * 52} y2={74} stroke="#C9D6EA" strokeOpacity={0.55} strokeWidth={10} />
        ))}
      </g>
      {/* copper layer */}
      <rect x={-200} y={-90} width={980} height={180} rx={24} fill="url(#g-copper)" />
      {/* polyethylene jacket */}
      <rect x={-200} y={-126} width={820} height={252} rx={40} fill="url(#g-jacket)" stroke="#5E7299" strokeWidth={2} />
      <rect x={-200} y={-112} width={820} height={30} rx={15} fill="#FFFFFF" opacity={0.06} />
    </g>
  );
};

// 37.2–49 s · thin glass strands → modulated light in the core → repeaters over long distances.
export const Fiber: React.FC<{t: number}> = ({t}) => {
  const {w: W, h: H, tall} = useLay();
  const zoomK = ramp(t, T.light - 0.4, T.light + 0.5, EASE_IN_OUT);
  const far = ramp(t, T.distance, T.distance + 1);

  // ---- phase A placement
  const aS = tall ? 0.8 : 1.0;
  const aT = tall ? `translate(${540} ${2000}) rotate(-90) scale(${aS})` : `translate(${60} ${640}) scale(${aS})`;
  const zA = 1 + 2.4 * zoomK;
  const tip = tall ? [540, 2000 - 1760 * aS] : [60 + 1760 * aS, 640];

  // ---- phase B: one fiber, local x along the fiber
  const len = tall ? H + 200 : W + 200;
  const cladH = tall ? 420 : 340;
  const coreH = tall ? 120 : 100;
  const cellW = tall ? 84 : 88;
  const travel = (t - T.light) * 240 + Math.max(0, t - T.distance) * 660;
  const repSpacing = tall ? 1100 : 1300;
  const fT = tall ? `translate(${560} ${-100}) rotate(90)` : `translate(${-100} ${600})`;
  const r0 = repSpacing * 0.7 - (travel % repSpacing);
  const reps = [-1, 0, 1, 2, 3].map((i) => r0 + i * repSpacing);
  const nCells = Math.ceil(len / cellW) + 2;
  const startIdx = Math.floor(-travel / cellW) - 1;
  const cells = Array.from({length: nCells}, (_, j) => {
    const n = startIdx + j;
    const x = n * cellW + travel;
    const bit = BITS[((n % BITS.length) + BITS.length) % BITS.length];
    // light fades with distance from the last repeater and is restored at the next one
    const dist = (((x - r0) % repSpacing) + repSpacing) % repSpacing;
    const atten = 1 - 0.6 * far * (dist / repSpacing);
    return {x, bit, atten};
  });
  const zig = Array.from({length: Math.ceil(len / 90) + 4}, (_, i) => {
    const x = i * 90 - (travel % 180);
    return `${x},${(i % 2 ? 1 : -1) * (coreH / 2 - 6)}`;
  }).join(' L');
  const bO = ramp(t, T.light - 0.1, T.light + 0.5);

  // label anchors in screen space
  const L = (lx: number, ly: number): [number, number] => (tall ? [560 - ly, -100 + lx] : [-100 + lx, 600 + ly]);
  const coreLab: [number, number] = tall ? [540, 1560] : L(1500, -coreH / 2 - 30);
  const cladLab: [number, number] = tall ? [540, 1640] : L(1500, cladH / 2 + 50);

  return (
    <div style={{position: 'absolute', inset: 0}}>
      <Bg kind="studio" />
      <Svg>
        {/* phase A */}
        <g opacity={1 - ramp(t, T.light - 0.1, T.light + 0.4)} transform={`translate(${tip[0]} ${tip[1]}) scale(${zA}) translate(${-tip[0]} ${-tip[1]})`}>
          <g transform={aT}>
            <CableCutaway t={t} a={T.glass} />
          </g>
          <Tag x={tall ? 300 : 460} y={tall ? 1720 : 850} text="PROTECTIVE LAYERS" size={tall ? 30 : 26} o={ramp(t, T.glass + 0.3, T.glass + 0.8)} />
          <Tag x={tall ? 830 : 1560} y={tall ? 760 : 900} text="GLASS FIBERS" size={tall ? 36 : 30} color={C.cyan} o={ramp(t, T.glass + 1.8, T.glass + 2.3)} />
          <Tag x={tall ? 830 : 1560} y={tall ? 825 : 955} text="ABOUT AS THIN AS A HAIR" size={tall ? 24 : 21} color={C.cyanSoft} o={ramp(t, T.glass + 2.3, T.glass + 2.8)} />
        </g>
        {/* phase B/C */}
        <g opacity={bO}>
          <g transform={fT}>
            <Glow x={len / 2} y={0} r={len * 0.6} o={0.25} />
            <rect x={0} y={-cladH / 2} width={len} height={cladH} fill="url(#g-glass)" stroke={C.cyanSoft} strokeOpacity={0.6} strokeWidth={3} />
            <rect x={0} y={-coreH / 2} width={len} height={coreH} fill="#0E3A66" stroke={C.cyan} strokeOpacity={0.8} strokeWidth={2} />
            {cells.map((c, i) =>
              c.bit ? (
                <g key={i} opacity={c.atten}>
                  <rect x={c.x + 4} y={-coreH / 2 + 4} width={cellW - 8} height={coreH - 8} rx={8} fill={C.cyan} opacity={0.55} />
                  <rect x={c.x + 12} y={-coreH / 2 + 14} width={cellW - 24} height={coreH - 28} rx={6} fill="#FFFFFF" opacity={0.85} />
                </g>
              ) : null,
            )}
            <path d={`M${zig}`} fill="none" stroke="#FFFFFF" strokeOpacity={0.35} strokeWidth={2} />
            {/* bit readout, simplified */}
            <g opacity={1 - far}>
              {cells.map((c, i) => {
                const [bx, by] = [c.x + cellW / 2, -cladH / 2 - 34];
                return (
                  <text
                    key={i}
                    x={bx}
                    y={by}
                    textAnchor="middle"
                    transform={tall ? `rotate(-90 ${bx} ${by})` : undefined}
                    fill={c.bit ? C.white : C.dim}
                    fontFamily={FONT}
                    fontWeight={700}
                    fontSize={tall ? 34 : 36}
                  >
                    {c.bit}
                  </text>
                );
              })}
            </g>
            {/* repeaters (appear when we travel far) */}
            {reps.map((rx, i) => (
              <g key={i} opacity={far} transform={`translate(${rx} 0)`}>
                <rect x={-70} y={-cladH / 2 - 40} width={140} height={cladH + 80} rx={26} fill="#1A2B52" stroke={C.orange} strokeWidth={4} />
                <rect x={-70} y={-coreH / 2} width={140} height={coreH} fill={C.orange} opacity={0.35} />
                <circle r={130} fill="url(#g-or)" opacity={0.6} />
              </g>
            ))}
          </g>
          {tall && <rect x={0} y={0} width={W} height={640} fill="url(#g-shadeTop)" />}
          {/* transmitter */}
          <g opacity={1 - far}>
            {!tall && (
              <g>
                <rect x={-20} y={470} width={150} height={260} rx={22} fill="#13244A" stroke={C.cyan} strokeWidth={3} />
                <circle cx={110} cy={600} r={70} fill="url(#g-wh)" />
                <text x={65} y={770} textAnchor="middle" fill={C.white} fontFamily={FONT} fontWeight={700} fontSize={22} letterSpacing={2}>
                  LASER
                </text>
              </g>
            )}
          </g>
          <Tag x={coreLab[0]} y={coreLab[1]} text="GLASS CORE · LIGHT TRAVELS HERE" size={tall ? 26 : 24} color={C.cyan} o={ramp(t, T.light + 0.6, T.light + 1.1) * (1 - far)} />
          <Tag x={cladLab[0]} y={cladLab[1]} text="CLADDING KEEPS THE LIGHT INSIDE" size={tall ? 26 : 24} color={C.cyanSoft} o={ramp(t, T.light + 1.4, T.light + 1.9) * (1 - far)} />
          {!tall && (
            <Tag x={960} y={380} text="1 = BRIGHTER · 0 = DIMMER   (SIMPLIFIED)" size={22} color={C.cyanSoft} o={ramp(t, T.light + 2.2, T.light + 2.7) * (1 - far)} />
          )}
          <Tag
            x={tall ? 300 : 960}
            y={tall ? 1240 : 860}
            text="REPEATERS BOOST THE LIGHT"
            size={tall ? 30 : 28}
            color={C.orange}
            o={ramp(t, T.distance + 0.8, T.distance + 1.3)}
          />
        </g>
      </Svg>
      <Headline
        t={t}
        a={T.glass}
        b={T.light}
        kicker="INSIDE THE CABLE"
        lines={tall ? [<>Incredibly thin</>, <>strands of <Em>glass</Em></>] : [<>Incredibly thin strands of <Em>glass</Em></>]}
        wide={{size: 70}}
        tall={{size: 84}}
      />
      <Headline
        t={t}
        a={T.light}
        b={T.distance}
        lines={tall ? [<>Rapidly changing</>, <>patterns of <Em>light</Em></>] : [<>Rapidly changing patterns</>, <>of <Em>light</Em></>]}
        sub="The light itself carries the digital information"
        wide={{size: 70}}
        tall={{size: 84, width: 900, x: 90}}
      />
      <Headline
        t={t}
        a={T.distance}
        b={T.surprise + 0.3}
        lines={tall ? [<>Across <Em>enormous</Em></>, <>distances</>] : [<>Across <Em>enormous</Em> distances</>]}
        sub="Thousands of kilometers under the sea"
        wide={{size: 76}}
        tall={{size: 90}}
      />
    </div>
  );
};

