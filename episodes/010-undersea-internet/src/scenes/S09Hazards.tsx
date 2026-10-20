import React from 'react';
import {Img, staticFile} from 'remotion';
import {Anchor, Ship, Trawler} from '../art';
import {T} from '../timing';
import {C, EASE_IN_OUT, Em, Glow, GlowLine, Headline, P, Svg, Tag, lerp, ramp, useLay} from '../lib';

// 76.6–85.2 s · cables can break: fishing gear, dragged anchors, quakes/landslides (accidents, not sabotage).
export const Hazards: React.FC<{t: number}> = ({t}) => {
  const {w: W, h: H, tall} = useLay();
  const sY = tall ? 640 : 300;
  const base = tall ? 1390 : 900;
  const slopeX = tall ? 820 : 1500;
  const slopeK = tall ? 0.9 : 0.45;
  const bed = (x: number) => (x < slopeX ? base + 7 * Math.sin(x / 85) : base + 7 * Math.sin(slopeX / 85) - (x - slopeX) * slopeK);
  const N = 60;
  const bedPts: P[] = Array.from({length: N + 1}, (_, i) => {
    const x = -40 + (i / N) * (W + 80);
    return [x, bed(x)];
  });
  const poly = (pts: P[]) => pts.map(([x, y]) => `${x.toFixed(1)},${y.toFixed(1)}`).join(' L');
  const bedD = `M${poly(bedPts)} L${W + 40},${H + 40} L-40,${H + 40} Z`;

  // anchor: drops, then drags toward the cable and snags it
  const shipX0 = tall ? 780 : 1300;
  const drift = ramp(t, T.hazards + 0.2, T.hazards + 2.2, EASE_IN_OUT) * (tall ? 110 : 260);
  const shipX = shipX0 - drift;
  const drop = ramp(t, T.canBreak, T.canBreak + 1.4, EASE_IN_OUT);
  const bow: P = [shipX + (tall ? 70 : 100), sY - 4];
  const ax = lerp(bow[0] + 40, shipX0 + 40 - (tall ? 230 : 300), ramp(t, T.hazards + 0.2, T.hazards + 2.2, EASE_IN_OUT));
  const ay = lerp(bow[1] + 20, bed(ax) - 112, drop);
  const breakX = shipX0 + 40 - (tall ? 230 : 300);
  const snap = ramp(t, T.hazards + 2.1, T.hazards + 2.4);
  const gap = 26 * snap;
  const cableL: P[] = bedPts.filter(([x]) => x < breakX).map(([x, y]) => [x, y - 9] as P);
  const cableR: P[] = bedPts.filter(([x]) => x > breakX).map(([x, y]) => [x, y - 9] as P);
  cableL.push([breakX - gap, bed(breakX) - 9 + 18 * snap]);
  cableR.unshift([breakX + gap, bed(breakX) - 9 + 22 * snap]);

  // trawl gear
  const trawlX = (tall ? 240 : 400) + ramp(t, T.hazards - 0.4, T.hazards + 4) * 60;
  const netO = ramp(t, T.hazards - 0.3, T.hazards + 0.4);
  const netY = bed(trawlX - 60);
  // landslide rocks
  const slide = ramp(t, T.hazards + 2.6, T.hazards + 4.3);
  const rocks = Array.from({length: 9}, (_, i) => {
    const x0 = (tall ? 1040 : 1860) - (i % 3) * 30;
    const run = (tall ? 160 : 300) * slide * (0.6 + (i % 4) * 0.15);
    const x = x0 - run;
    return {x, y: bed(x) - 12 - (i % 3) * 10, r: 9 + (i % 4) * 4};
  });
  const sizeT = tall ? 28 : 24;

  return (
    <div style={{position: 'absolute', inset: 0, background: C.navyDeep}}>
      <Img src={staticFile(`img/space_${tall ? 'tall' : 'wide'}.jpg`)} style={{position: 'absolute', left: 0, top: sY - H, width: W, height: H}} />
      <Img src={staticFile(`img/ocean_${tall ? 'tall' : 'wide'}.jpg`)} style={{position: 'absolute', left: 0, top: sY, width: W, height: H}} />
      <Svg>
        <rect x={0} y={sY - 3} width={W} height={5} fill={C.cyanSoft} opacity={0.5} />
        {/* trawler and its gear */}
        <Trawler x={trawlX} y={sY} s={tall ? 0.75 : 0.9} />
        <g opacity={netO}>
          <path d={`M${trawlX - 100},${sY} L${trawlX - 150},${netY - 60} M${trawlX - 90},${sY} L${trawlX + 10},${netY - 60}`} stroke="#8EA3C4" strokeWidth={2.5} />
          <path
            d={`M${trawlX - 150},${netY - 60} L${trawlX + 10},${netY - 60} L${trawlX - 10},${netY - 4} L${trawlX - 200},${netY - 4} Z`}
            fill="#8EA3C4"
            fillOpacity={0.15}
            stroke="#C9D6EA"
            strokeWidth={2.5}
            strokeDasharray="8 6"
          />
          <Tag x={trawlX - 90} y={netY - 110} text="FISHING GEAR" size={sizeT} color={C.orange} o={ramp(t, T.hazards, T.hazards + 0.4)} />
        </g>
        {/* seabed + cable */}
        <path d={bedD} fill="url(#g-seabed)" stroke="#4A6A9C" strokeWidth={2} />
        {[50, 130, 240].map((off, i) => (
          <path key={off} d={`M${poly(bedPts.map(([x, y]) => [x, y + off] as P))}`} fill="none" stroke="#5E7299" strokeOpacity={0.25 - i * 0.06} strokeWidth={2} strokeDasharray={i === 1 ? '24 14' : undefined} />
        ))}
        <GlowLine d={`M${poly(cableL)}`} w={tall ? 6 : 5} pulses={{t, speed: 0.25, len: 0.02, gap: 0.08}} />
        <GlowLine d={`M${poly(cableR)}`} w={tall ? 6 : 5} color={snap > 0.5 ? '#4A5D80' : C.cyan} halo={1 - snap} pulses={snap > 0.5 ? undefined : {t, speed: 0.25, len: 0.02, gap: 0.08}} />
        {/* the break */}
        <g opacity={snap * (1 - 0.5 * ramp(t, T.reroute - 0.6, T.reroute))}>
          <Glow x={breakX} y={bed(breakX) - 10} r={180 * (1 + 0.15 * Math.sin(t * 9))} color="or" />
          {Array.from({length: 8}, (_, i) => {
            const ang = (i / 8) * Math.PI * 2 + 0.3;
            const r0 = 30;
            const r1 = 30 + 50 * ramp(t, T.hazards + 2.1, T.hazards + 2.6);
            return (
              <line
                key={i}
                x1={breakX + Math.cos(ang) * r0}
                y1={bed(breakX) - 10 + Math.sin(ang) * r0}
                x2={breakX + Math.cos(ang) * r1}
                y2={bed(breakX) - 10 + Math.sin(ang) * r1}
                stroke={C.orange}
                strokeWidth={5}
                strokeLinecap="round"
              />
            );
          })}
        </g>
        {/* ship, chain and anchor */}
        <Ship x={shipX} y={sY} s={tall ? 0.6 : 0.7} />
        <g opacity={drop > 0 ? 1 : 0}>
          <path d={`M${bow[0]},${bow[1]} Q${(bow[0] + ax) / 2 + 40},${(bow[1] + ay) / 2} ${ax},${ay}`} fill="none" stroke="#C9D6EA" strokeWidth={5} strokeDasharray="10 5" />
          <Anchor x={ax} y={ay} s={tall ? 1 : 1.05} r={lerp(0, 25, ramp(t, T.hazards, T.hazards + 1))} />
          <Tag x={ax + (tall ? -10 : 0)} y={ay - 50} text="SHIP ANCHORS" size={sizeT} color={C.orange} o={ramp(t, T.hazards + 1.1, T.hazards + 1.5)} />
        </g>
        {/* natural hazard: undersea landslide */}
        <g opacity={ramp(t, T.hazards + 2.5, T.hazards + 2.9)}>
          {rocks.map((r, i) => (
            <circle key={i} cx={r.x} cy={r.y} r={r.r} fill="#3A5888" stroke="#6E86B3" strokeWidth={2} />
          ))}
          <path
            d={`M${tall ? 900 : 1640},${bed(tall ? 900 : 1640) - (tall ? 190 : 160)} l18,-26 l12,24 l16,-30 l12,26 l16,-22`}
            fill="none"
            stroke={C.orange}
            strokeWidth={5}
            strokeLinejoin="round"
          />
          <Tag
            x={tall ? 830 : 1640}
            y={bed(tall ? 900 : 1640) - (tall ? 250 : 220)}
            text={tall ? 'QUAKES & LANDSLIDES' : 'QUAKES & UNDERSEA LANDSLIDES'}
            size={sizeT}
            color={C.orange}
          />
        </g>
        <Tag x={breakX} y={bed(breakX) + (tall ? 90 : 70)} text="SIGNAL CUT" size={sizeT + 2} color={C.white} o={ramp(t, T.hazards + 2.5, T.hazards + 3)} />
      </Svg>
      <Headline t={t} a={T.vulnerable} b={T.canBreak} lines={tall ? [<>Now, the</>, <Em>vulnerable</Em>, <>part</>] : [<>Now, the <Em>vulnerable</Em> part</>]} wide={{size: 76, y: 70}} tall={{size: 90}} />
      <Headline
        t={t}
        a={T.canBreak}
        b={T.reroute + 0.3}
        lines={tall ? [<>These cables</>, <>can <Em>break</Em></>] : [<>These cables can <Em>break</Em></>]}
        sub={T.hazards < t ? 'Usually by accident — not sabotage' : undefined}
        wide={{size: 76, y: 70}}
        tall={{size: 90}}
      />
    </div>
  );
};
