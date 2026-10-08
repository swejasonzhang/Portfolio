import { ImageResponse } from 'next/og';
import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { siteConfig } from './site';

export const dynamic = 'force-static';
export const alt = 'Jason Zhang — Software Engineer, Builder, Founder';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

const VOID = '#06070b';
const ICE = '#e6ecff';
const SYS = '#58a6ff';
const SYS_BRIGHT = '#9cd0ff';
const MUTE = '#7d86a3';

const TICK = 14;
const FRAME = 28;

function Tick({ style }: { style: Record<string, string | number> }) {
	return (
		<div
			style={{
				position: 'absolute',
				width: TICK,
				height: TICK,
				borderColor: SYS_BRIGHT,
				borderStyle: 'solid',
				...style,
			}}
		/>
	);
}

export default async function OpengraphImage() {
	const [display, mono] = await Promise.all([
		readFile(join(process.cwd(), 'app/fonts/BarlowCondensed-Bold.ttf')),
		readFile(join(process.cwd(), 'app/fonts/GeistMono.ttf')),
	]);

	const monoStyle = {
		fontFamily: 'Geist Mono',
		fontSize: 20,
		letterSpacing: 5,
	} as const;

	const slash = { color: SYS, margin: '0 14px' } as const;

	return new ImageResponse(
		(
			<div
				style={{
					width: '100%',
					height: '100%',
					display: 'flex',
					position: 'relative',
					background: VOID,
					color: ICE,
				}}
			>
				{/* System frame */}
				<div
					style={{
						position: 'absolute',
						top: FRAME,
						left: FRAME,
						right: FRAME,
						bottom: FRAME,
						border: '1px solid rgba(88,166,255,0.35)',
					}}
				/>
				{/* Inner frame */}
				<div
					style={{
						position: 'absolute',
						top: 40,
						left: 40,
						right: 40,
						bottom: 40,
						border: '1px solid rgba(88,166,255,0.12)',
					}}
				/>

				{/* Corner ticks */}
				<Tick style={{ top: FRAME - 1, left: FRAME - 1, borderWidth: '2px 0 0 2px' }} />
				<Tick style={{ top: FRAME - 1, right: FRAME - 1, borderWidth: '2px 2px 0 0' }} />
				<Tick style={{ bottom: FRAME - 1, left: FRAME - 1, borderWidth: '0 0 2px 2px' }} />
				<Tick style={{ bottom: FRAME - 1, right: FRAME - 1, borderWidth: '0 2px 2px 0' }} />

				{/* Gate label */}
				<div
					style={{
						position: 'absolute',
						left: 96,
						top: 84,
						display: 'flex',
						color: SYS,
						...monoStyle,
					}}
				>
					[GATE 00 · AWAKENING]
				</div>

				{/* The name */}
				<div
					style={{
						position: 'absolute',
						left: 96,
						top: 0,
						height: '100%',
						display: 'flex',
						flexDirection: 'column',
						justifyContent: 'center',
						fontFamily: 'Barlow Condensed',
						fontWeight: 700,
						fontSize: 220,
						lineHeight: 0.85,
						textTransform: 'uppercase',
					}}
				>
					<div style={{ display: 'flex', color: ICE }}>JASON</div>
					<div style={{ display: 'flex', color: SYS_BRIGHT }}>ZHANG</div>
				</div>

				{/* Identity line */}
				<div
					style={{
						position: 'absolute',
						left: 96,
						bottom: 84,
						display: 'flex',
						flexDirection: 'row',
						color: MUTE,
						...monoStyle,
					}}
				>
					<span>SOFTWARE ENGINEER</span>
					<span style={slash}>/</span>
					<span>BUILDER</span>
					<span style={slash}>/</span>
					<span>FOUNDER — NEW YORK</span>
				</div>

				{/* Register */}
				<div
					style={{
						position: 'absolute',
						right: 96,
						top: 84,
						display: 'flex',
						flexDirection: 'column',
						alignItems: 'flex-end',
						fontFamily: 'Geist Mono',
						fontSize: 18,
						letterSpacing: 3,
					}}
				>
					<div style={{ display: 'flex', color: MUTE }}>LV 1 · XP 0%</div>
					<div style={{ display: 'flex', marginTop: 10, color: ICE }}>
						{siteConfig.url.replace('https://', '')}
					</div>
				</div>
			</div>
		),
		{
			...size,
			fonts: [
				{ name: 'Barlow Condensed', data: display, weight: 700, style: 'normal' },
				{ name: 'Geist Mono', data: mono, weight: 400, style: 'normal' },
			],
		}
	);
}
