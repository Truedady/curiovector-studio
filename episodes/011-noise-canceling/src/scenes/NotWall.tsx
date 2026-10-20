import React from 'react';
import {AbsoluteFill} from 'remotion';
import {mix, ramp, rampIO, win} from '../anim';
import {Cabin, Seat} from '../components/Cabin';
import {Passenger} from '../components/Passenger';
import {Glow, Headline, Kicker} from '../components/ui';
import {C, Fmt, SIZE} from '../theme';
import {T} from '../timeline';
import {earPos, EngineRings, NoiseToEar, stage} from './Hook';

/** Beat 2: not a soundproof wall — sound fights sound. Zooms into the earcup. */
export const NotWall: React.FC<{fmt: Fmt; t: number}> = ({fmt, t}) => {
	const {w, h} = SIZE[fmt];
	const s = stage(fmt);
	const ear = earPos(fmt);
	const land = fmt === 'land';
	const head = {x: s.px + 330 * s.ps, y: s.py + 360 * s.ps};
	const R = 300 * s.ps;

	const dome = win(t, T.noWall + 0.2, T.fighting, 0.5);
	const strike = ramp(t, T.noWall + 2.0, 0.6);
	const fight = ramp(t, T.fighting, 0.8);
	const zoom = rampIO(t, T.howTo + 0.1, 1.1);
	const sc = mix(1.03, land ? 2.6 : 2.2, zoom);
	const flash = fight * (0.55 + 0.45 * Math.sin(t * 6));

	// brick courses of the imaginary soundproof dome
	const bricks: string[] = [];
	for (let row = 0; row < 7; row++) {
		const a = (Math.PI * (row + 1)) / 8;
		const yy = head.y - R * Math.cos(a) * 0.95;
		const half = R * Math.sin(a);
		bricks.push(`M${head.x - half} ${yy} L${head.x + half} ${yy}`);
		for (let c = -4; c <= 4; c++) {
			const xx = head.x + c * 70 * s.ps + (row % 2) * 35 * s.ps;
			if (Math.abs(xx - head.x) < half - 10) bricks.push(`M${xx} ${yy} L${xx} ${yy + 46 * s.ps}`);
		}
	}

	return (
		<AbsoluteFill>
			<svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} style={{position: 'absolute'}}>
				<g transform={`translate(${ear.x} ${ear.y}) scale(${sc}) translate(${-ear.x} ${-ear.y})`}>
					<Cabin id={`nw${fmt}`} w={w} h={h} windows={s.windows} t={t} floorY={s.floorY} />
					<EngineRings x={s.windows[0].x + 10} y={s.windows[0].y + 60} t={t} hum={1} />
					<Glow color="orange" cx={s.windows[0].x} cy={s.windows[0].y + 40} r={land ? 300 : 360} opacity={0.35} />
					<Seat x={s.seat.x} y={s.seat.y} s={s.seat.s} />
					<g transform={`translate(${s.px} ${s.py}) scale(${s.ps})`}>
						<Passenger id={`nw${fmt}p`} ancOn={1} cupGlow={0.5 + 0.3 * fight} />
					</g>
					<Glow color="cyan" cx={ear.x} cy={ear.y} r={land ? 220 : 280} opacity={0.5 + 0.3 * fight} />
					<NoiseToEar fmt={fmt} t={t} amp={land ? 78 : 84} ear={ear} cancel={1} anti={1} startX={s.windows[0].x + 40} />
					<Glow color="white" cx={ear.x - (land ? 150 : 140)} cy={ear.y} r={land ? 110 : 130} opacity={0.5 * flash} />
					{/* the soundproof wall that ISN'T there */}
					<g opacity={dome}>
						<path
							d={`M${head.x - R} ${head.y + R * 0.95} A ${R} ${R * 0.95} 0 0 1 ${head.x + R} ${head.y + R * 0.95}`}
							fill="#6F86C4"
							fillOpacity={0.12}
							stroke={C.white}
							strokeWidth={4}
						/>
						<path d={bricks.join(' ')} stroke={C.white} strokeOpacity={0.35} strokeWidth={2} fill="none" />
						<g stroke={C.orange} strokeWidth={14} strokeLinecap="round">
							<path d={`M${head.x - R * 0.6} ${head.y - R * 0.5} L${head.x + R * 0.6} ${head.y + R * 0.7}`} pathLength={1} strokeDasharray="1 1" strokeDashoffset={1 - strike} />
							<path d={`M${head.x + R * 0.6} ${head.y - R * 0.5} L${head.x - R * 0.6} ${head.y + R * 0.7}`} pathLength={1} strokeDasharray="1 1" strokeDashoffset={1 - ramp(t, T.noWall + 2.3, 0.6)} />
						</g>
					</g>
				</g>
			</svg>
			{land ? (
				<>
					<Kicker x={1044} y={200} text="Not a wall" size={30} opacity={win(t, T.noWall, T.fighting, 0.4)} />
					<Headline x={1040} y={250} size={78} width={780} opacity={win(t, T.noWall, T.fighting, 0.4)} lines={[['No soundproof'], ['wall around'], ['your ', {hi: 'head'}]]} />
					<Kicker x={1044} y={200} text="Instead…" size={30} opacity={win(t, T.fighting, T.howTo + 0.6, 0.4)} />
					<Headline x={1040} y={250} size={84} width={780} opacity={win(t, T.fighting, T.howTo + 0.6, 0.4)} lines={[['Fighting'], [{hi: 'sound'}, ' with'], [{hi: 'sound', color: C.cyan}]]} />
					<Headline x={1040} y={420} size={92} width={780} opacity={win(t, T.howTo, 23, 0.3)} lines={[["Here's how"]]} />
				</>
			) : (
				<>
					<Kicker x={540} y={200} text="Not a wall" size={36} align="center" width={900} opacity={win(t, T.noWall, T.fighting, 0.4)} />
					<Headline x={540} y={260} size={86} width={900} align="center" opacity={win(t, T.noWall, T.fighting, 0.4)} lines={[['No soundproof wall'], ['around your ', {hi: 'head'}]]} />
					<Kicker x={540} y={200} text="Instead…" size={36} align="center" width={900} opacity={win(t, T.fighting, T.howTo + 0.6, 0.4)} />
					<Headline x={540} y={260} size={96} width={900} align="center" opacity={win(t, T.fighting, T.howTo + 0.6, 0.4)} lines={[['Fighting ', {hi: 'sound'}], ['with ', {hi: 'sound', color: C.cyan}]]} />
					<Headline x={540} y={300} size={104} width={900} align="center" opacity={win(t, T.howTo, 23, 0.3)} lines={[["Here's how"]]} />
				</>
			)}
		</AbsoluteFill>
	);
};
