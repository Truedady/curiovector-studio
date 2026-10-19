import React from 'react';
import {Footnote, Panel, Reveal, Txt} from '../art/ui';
import {C, FONT} from '../lib/theme';
import {clamp, easeOut, ramp} from '../lib/timing';
import {SceneProps} from './types';

// Deterministic pseudo-random for stable node layouts.
const rnd = (i: number) => {
  const x = Math.sin(i * 127.1 + 311.7) * 43758.5453;
  return x - Math.floor(x);
};

const Constellation: React.FC<{W: number; H: number; T: number; at: number}> = ({W, H, T, at}) => {
  const n = 46;
  const nodes = Array.from({length: n}, (_, i) => [rnd(i) * W, rnd(i + 99) * H] as const);
  const k = ramp(T, at, at + 2.5);
  const edges: [number, number][] = [];
  for (let i = 0; i < n; i++)
    for (let j = i + 1; j < n; j++) {
      const d = Math.hypot(nodes[i][0] - nodes[j][0], nodes[i][1] - nodes[j][1]);
      if (d < Math.max(W, H) * 0.13) edges.push([i, j]);
    }
  return (
    <g opacity={0.55 * k}>
      {edges.map(([i, j], e) => (
        <line
          key={e}
          x1={nodes[i][0]}
          y1={nodes[i][1]}
          x2={nodes[j][0]}
          y2={nodes[j][1]}
          stroke={C.cyan}
          strokeOpacity={0.12 + 0.18 * Math.max(0, Math.sin(T * 1.4 + e))}
          strokeWidth={1.5}
        />
      ))}
      {nodes.map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r={2.5 + 2 * rnd(i + 7)} fill={C.cyan} opacity={0.5 + 0.5 * Math.sin(T * 2 + i)} />
      ))}
    </g>
  );
};

type Art = (x: number, y: number, w: number, h: number, k: number, T: number) => React.ReactNode;

const CodeArt: Art = (x, y, w, h, k) => {
  const rows = [
    [0.18, 0.32, 0.2],
    [0.06, 0.22, 0.4],
    [0.12, 0.3, 0.16, 0.12],
    [0.12, 0.18, 0.35],
    [0.06, 0.14],
    [0.12, 0.26, 0.2, 0.14],
    [0.06, 0.3],
  ];
  const cols = [C.cyan, C.white, C.orange, '#8FA6E8'];
  const lh = (h - 50) / rows.length;
  return (
    <g>
      <rect x={x} y={y} width={w} height={h} rx={16} fill="#0A1533" stroke="#2C4280" strokeWidth={2} />
      {[0, 1, 2].map((i) => (
        <circle key={i} cx={x + 22 + i * 20} cy={y + 20} r={6} fill={[C.orange, '#F5C542', C.cyan][i]} opacity={0.8} />
      ))}
      {rows.map((r, ri) => {
        const indent = ri === 0 || ri === 4 || ri === 6 ? 0 : 0.06;
        let cx = x + 22 + indent * w;
        return r.map((seg, si) => {
          const appear = clamp(k * rows.length * 1.1 - ri - si * 0.25);
          const ww = seg * (w - 50) * appear;
          const el = (
            <rect key={`${ri}-${si}`} x={cx} y={y + 44 + ri * lh} width={Math.max(0, ww)} height={lh * 0.42} rx={lh * 0.2} fill={cols[(ri + si) % 4]} opacity={0.85} />
          );
          cx += seg * (w - 50) + 10;
          return el;
        });
      })}
    </g>
  );
};

const ExamArt: Art = (x, y, w, h, k) => {
  const pw = w * 0.62;
  const rows = 5;
  const score = easeOut(clamp(k * 1.2));
  const rr = Math.min(h, w - pw) * 0.32;
  const cx = x + pw + (w - pw) / 2 + 8;
  const cy = y + h / 2;
  return (
    <g>
      <rect x={x} y={y} width={pw} height={h} rx={10} fill="#EEF2FB" />
      {Array.from({length: rows}, (_, i) => {
        const ry = y + 26 + i * ((h - 40) / rows);
        const ck = clamp(k * rows * 1.1 - i);
        return (
          <g key={i}>
            <rect x={x + 18} y={ry} width={pw * (0.5 + 0.2 * rnd(i))} height={9} rx={4} fill="#9AA8C9" />
            <rect x={x + 18} y={ry + 16} width={pw * (0.35 + 0.2 * rnd(i + 5))} height={7} rx={3} fill="#C3CCE0" />
            <path
              d={`M${x + pw - 46},${ry + 8} l9,9 l17,-18`}
              fill="none"
              stroke="#16A36B"
              strokeWidth={5}
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeDasharray={40}
              strokeDashoffset={40 * (1 - ck)}
            />
          </g>
        );
      })}
      <circle cx={cx} cy={cy} r={rr} fill="none" stroke="#24366D" strokeWidth={12} />
      <circle
        cx={cx}
        cy={cy}
        r={rr}
        fill="none"
        stroke={C.cyan}
        strokeWidth={12}
        strokeLinecap="round"
        strokeDasharray={`${2 * Math.PI * rr * 0.92 * score} 999`}
        transform={`rotate(-90 ${cx} ${cy})`}
      />
      <text x={cx} y={cy + rr * 0.22} textAnchor="middle" fontFamily={FONT} fontWeight={800} fontSize={rr * 0.62} fill={C.white}>
        A+
      </text>
    </g>
  );
};

const DataArt: Art = (x, y, w, h, k, T) => {
  const n = 70;
  return (
    <g>
      <rect x={x} y={y} width={w} height={h} rx={16} fill="#0A1533" stroke="#2C4280" strokeWidth={2} />
      <line x1={x + 20} y1={y + h - 20} x2={x + w - 16} y2={y + h - 20} stroke="#3A5296" strokeWidth={2} />
      <line x1={x + 20} y1={y + 16} x2={x + 20} y2={y + h - 20} stroke="#3A5296" strokeWidth={2} />
      {Array.from({length: n}, (_, i) => {
        const cl = i % 3 === 0;
        const px = cl ? 0.62 + (rnd(i) - 0.5) * 0.2 : 0.08 + rnd(i) * 0.86;
        const py = cl ? 0.3 + (rnd(i + 3) - 0.5) * 0.24 : 0.12 + rnd(i + 3) * 0.78;
        const a = clamp(k * 4 - (i / n) * 1.5);
        return (
          <circle
            key={i}
            cx={x + 24 + px * (w - 44)}
            cy={y + 16 + py * (h - 40)}
            r={4}
            fill={cl && k > 0.45 ? C.orange : C.cyan}
            opacity={a * (0.55 + 0.35 * Math.sin(T * 2 + i))}
          />
        );
      })}
      <ellipse
        cx={x + 24 + 0.62 * (w - 44)}
        cy={y + 16 + 0.3 * (h - 40)}
        rx={(w - 44) * 0.14}
        ry={(h - 40) * 0.2}
        fill="none"
        stroke={C.orange}
        strokeWidth={3}
        strokeDasharray="8 6"
        opacity={ramp(k, 0.45, 0.65)}
      />
    </g>
  );
};

const CARDS: {title: string; at: number; art: Art}[] = [
  {title: 'Write code', at: 12.19, art: CodeArt},
  {title: 'Pass difficult exams', at: 13.25, art: ExamArt},
  {title: 'Analyze huge datasets', at: 14.9, art: DataArt},
];

export const AiAbstract: React.FC<SceneProps> = ({T, W, H, v}) => {
  const strange = Math.min(ramp(T, 5.25, 5.6), 1 - ramp(T, 6.45, 6.8));
  return (
    <g>
      <Constellation W={W} H={H} T={T} at={6.6} />
      {strange > 0 && (
        <g opacity={strange} transform={`translate(${W / 2},${H / 2}) scale(${0.94 + 0.06 * strange})`}>
          <Txt x={0} y={20} anchor="middle" size={v ? 110 : 120} lines={[['And that’s ', {t: 'strange.'}]]} />
        </g>
      )}
      <Reveal T={T} at={6.9}>
        {v ? (
          <Txt
            x={80}
            y={330}
            size={68}
            lines={[['Modern AI can already'], ['solve problems that'], ['once looked '], [{t: 'impossibly hard.'}]]}
          />
        ) : (
          <Txt x={120} y={180} size={66} lines={[['Modern AI can already solve problems'], ['that once looked ', {t: 'impossibly hard.'}]]} />
        )}
      </Reveal>
      {CARDS.map((c, i) => {
        const k = ramp(T, c.at, c.at + 0.55, easeOut);
        if (k <= 0) return null;
        const prog = ramp(T, c.at, c.at + 3.2);
        if (v) {
          const x = 70;
          const y = 680 + i * 320;
          const w = 940;
          const h = 290;
          return (
            <g key={i} opacity={k} transform={`translate(${(1 - k) * 60},0)`}>
              <Panel x={x} y={y} w={w} h={h} />
              {c.art(x + 24, y + 24, 470, h - 48, prog, T)}
              <Txt x={x + 530} y={y + h / 2 + 4} size={46} lines={c.title.split(' ').length > 2 ? [[c.title.split(' ').slice(0, 2).join(' ')], [c.title.split(' ').slice(2).join(' ')]] : [[c.title]]} />
              <text x={x + 530} y={y + 70} fontFamily={FONT} fontSize={24} fontWeight={700} letterSpacing={4} fill={C.cyan}>
                {`0${i + 1}`}
              </text>
            </g>
          );
        }
        const x = 120 + i * 570;
        const y = 380;
        const w = 520;
        const h = 500;
        return (
          <g key={i} opacity={k} transform={`translate(0,${(1 - k) * 50})`}>
            <Panel x={x} y={y} w={w} h={h} />
            {c.art(x + 26, y + 26, w - 52, 330, prog, T)}
            <text x={x + 28} y={y + 410} fontFamily={FONT} fontSize={22} fontWeight={700} letterSpacing={4} fill={C.cyan}>
              {`0${i + 1}`}
            </text>
            <Txt x={x + 28} y={y + 458} size={40} lines={[[c.title]]} />
          </g>
        );
      })}
      <Reveal T={T} at={16.0}>
        <Footnote
          x={v ? 80 : 120}
          y={v ? 632 : 960}
          size={v ? 25 : 24}
          text="Selected abstract tasks — abilities vary widely between AI systems."
        />
      </Reveal>
    </g>
  );
};
