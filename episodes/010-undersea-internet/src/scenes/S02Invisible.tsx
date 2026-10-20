import React from 'react';
import {Phone, Router, Satellite, Tower} from '../art';
import {T} from '../timing';
import {Bg, C, Em, Glow, GlowLine, Headline, P, Svg, Tag, pop, quad, ramp, useLay} from '../lib';

// 6.7–19.8 s · the intuition: an invisible internet in the air (Wi-Fi, towers, satellites, sky arcs).
export const Invisible: React.FC<{t: number}> = ({t}) => {
  const {w: W, h: H, tall} = useLay();
  const sky = ramp(t, T.imagine - 0.2, T.imagine + 0.9);

  // phase A/B anchors
  const phone: P = tall ? [540, 1080] : [960, 610];
  const router: P = tall ? [250, 1480] : [500, 760];
  const tower: P = tall ? [850, 1700] : [1430, 900];
  const sat: P = tall ? [800, 700] : [1540, 330];
  const iconK = [pop(t, T.wifi), pop(t, T.wifi + 0.85), pop(t, T.wifi + 1.75)];
  const shrink = 1 - 0.35 * sky;

  // floating data motes
  const motes = Array.from({length: 46}, (_, i) => {
    const bx = (i * 397) % W;
    const by = (i * 613) % H;
    const sp = 18 + (i % 7) * 7;
    const y = (((by - (t - T.floating) * sp) % H) + H) % H;
    const x = bx + Math.sin(t * 0.6 + i) * 18;
    return {x, y, s: 6 + (i % 5) * 3, o: 0.12 + ((i * 37) % 10) / 22};
  });

  // phase C: curved horizon with imagined sky arcs
  const R = tall ? 2600 : 3600;
  const hTop = tall ? 1520 : 820;
  const cx = W / 2;
  const cy = hTop + R;
  const onH = (x: number): P => [x, cy - Math.sqrt(R * R - (x - cx) * (x - cx))];
  const pairs: [number, number, number][] = tall
    ? [
        [120, 960, 620],
        [260, 820, 860],
        [60, 600, 980],
        [480, 1020, 760],
      ]
    : [
        [180, 1700, 300],
        [420, 1300, 480],
        [700, 1820, 400],
        [80, 980, 560],
        [1100, 1560, 640],
      ];
  return (
    <div style={{position: 'absolute', inset: 0}}>
      <Bg kind="studio" />
      <Bg kind="space" o={sky} />
      <Svg>
        {/* invisible-internet motes */}
        <g opacity={1 - 0.6 * sky}>
          {motes.map((m, i) => (
            <rect key={i} x={m.x} y={m.y} width={m.s} height={m.s} rx={2} fill={i % 6 === 0 ? C.orange : C.cyan} opacity={m.o * ramp(t, T.floating, T.floating + 1)} />
          ))}
        </g>
        {/* phase A/B */}
        <g opacity={1 - sky} transform={`translate(${phone[0]} ${phone[1]}) scale(${shrink}) translate(${-phone[0]} ${-phone[1]})`}>
          {[0, 1, 2, 3].map((i) => {
            const k = ((t - T.floating) * 0.45 + i / 4) % 1;
            return (
              <circle key={i} cx={phone[0]} cy={phone[1]} r={140 + k * (tall ? 520 : 460)} fill="none" stroke={C.cyan} strokeWidth={3} opacity={(1 - k) * 0.4 * ramp(t, T.floating, T.floating + 0.8)} />
            );
          })}
          {[router, [tower[0], tower[1] - 300], sat].map((p, i) =>
            iconK[i] > 0 ? (
              <path
                key={i}
                d={`M${phone[0]},${phone[1]} L${p[0]},${p[1]}`}
                stroke={C.cyanSoft}
                strokeWidth={3}
                strokeDasharray="6 12"
                strokeDashoffset={-t * 40}
                opacity={0.6 * Math.min(1, iconK[i])}
              />
            ) : null,
          )}
          <Phone x={phone[0]} y={phone[1]} s={tall ? 2.1 : 1.55} play glow={1.4} />
          <g opacity={Math.min(1, iconK[0])}>
            <Router x={router[0]} y={router[1]} s={(tall ? 1.3 : 1.15) * iconK[0]} active={1} />
            <Tag x={router[0]} y={router[1] + (tall ? 130 : 105)} text="WI-FI" size={tall ? 38 : 30} />
          </g>
          <g opacity={Math.min(1, iconK[1])}>
            <Tower x={tower[0]} y={tower[1]} s={(tall ? 0.95 : 0.85) * iconK[1]} active={1} />
            <Tag x={tower[0]} y={tower[1] + (tall ? -420 : -350)} text="CELL TOWERS" size={tall ? 38 : 30} />
          </g>
          <g opacity={Math.min(1, iconK[2])}>
            <Satellite x={sat[0]} y={sat[1]} s={(tall ? 1.15 : 1.05) * iconK[2]} r={-10} />
            <Tag x={sat[0]} y={sat[1] + (tall ? 120 : 110)} text="SATELLITES" size={tall ? 38 : 30} />
          </g>
        </g>
        {/* phase C: the sky-highway intuition */}
        <g opacity={sky}>
          <Glow x={cx} y={hTop} r={W * 0.9} o={0.45} />
          <circle cx={cx} cy={cy} r={R} fill="url(#g-sphere)" />
          <circle cx={cx} cy={cy} r={R} fill="none" stroke={C.cyan} strokeWidth={4} opacity={0.8} />
          <circle cx={cx} cy={cy} r={R + 18} fill="none" stroke={C.cyan} strokeWidth={30} opacity={0.12} />
          {pairs.map(([x0, x1, peak], i) => {
            const a = onH(x0);
            const b = onH(x1);
            const c: P = [(x0 + x1) / 2, peak - (tall ? 120 : 160)];
            const st = T.imagine + 0.3 + i * 0.45;
            const k = ramp(t, st, st + 1.1);
            const u = ((t - st) * 0.35) % 1;
            const d = quad(a, c, b, u);
            const mid = quad(a, c, b, 0.5);
            return (
              <g key={i}>
                <GlowLine d={`M${a[0]},${a[1]} Q${c[0]},${c[1]} ${b[0]},${b[1]}`} w={3.5} progress={k} halo={0.8} />
                <circle cx={a[0]} cy={a[1]} r={9} fill={C.orange} opacity={k} />
                <circle cx={b[0]} cy={b[1]} r={9} fill={C.orange} opacity={k} />
                {k >= 1 && <Glow x={d[0]} y={d[1]} r={34} color="wh" />}
                {i % 2 === 0 && <Satellite x={mid[0]} y={mid[1] - 10} s={0.45} o={ramp(t, st + 0.6, st + 1)} r={-8} />}
              </g>
            );
          })}
          <Tag x={tall ? W / 2 : W / 2} y={tall ? 1640 : 990} text="HOW IT FEELS" size={tall ? 40 : 32} color={C.orange} o={ramp(t, T.imagine + 1, T.imagine + 1.5)} />
        </g>
      </Svg>
      <Headline
        t={t}
        a={T.floating}
        b={T.wifi}
        lines={tall ? [<>The internet</>, <>feels like it&apos;s</>, <Em>floating</Em>, <>around you</>] : [<>The internet feels like</>, <>it&apos;s <Em>floating</Em> around you</>]}
        wide={{size: 72}}
        tall={{size: 92}}
      />
      <Headline
        t={t}
        a={T.wifi}
        b={T.imagine}
        lines={[<>Wi-Fi.</>, <>Cell towers.</>, <Em>Satellites.</Em>]}
        at={[T.wifi, T.wifi + 0.85, T.wifi + 1.75]}
        wide={{size: 80}}
        tall={{size: 100}}
      />
      <Headline
        t={t}
        a={T.imagine}
        b={T.zoomOut + 0.3}
        lines={tall ? [<>So we imagine</>, <>data flying</>, <>through the <Em>sky</Em></>] : [<>So we imagine data flying</>, <>through the <Em>sky</Em></>]}
        wide={{size: 72}}
        tall={{size: 92}}
      />
    </div>
  );
};

