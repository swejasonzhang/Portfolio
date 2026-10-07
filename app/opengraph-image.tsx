import { ImageResponse } from 'next/og';
import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { siteConfig } from './site';

export const dynamic = 'force-static';
export const alt = 'Jason Zhang — Software Engineer, Builder, Founder';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

const INK = '#0c0b0a';
const WASHI = '#efe8da';
const ASH = '#8d8679';
const SHU = '#a8321f';

export default async function OpengraphImage() {
	const [serif, serifItalic, mono] = await Promise.all([
		readFile(join(process.cwd(), 'app/fonts/InstrumentSerif-Regular.ttf')),
		readFile(join(process.cwd(), 'app/fonts/InstrumentSerif-Italic.ttf')),
		readFile(join(process.cwd(), 'app/fonts/GeistMono.ttf')),
	]);

	const monoStyle = {
		fontFamily: 'Geist Mono',
		color: ASH,
	} as const;

	return new ImageResponse(
		(
			<div
				style={{
					width: '100%',
					height: '100%',
					display: 'flex',
					position: 'relative',
					background: INK,
					color: WASHI,
				}}
			>
				{/* Hairline frame */}
				<div
					style={{
						position: 'absolute',
						top: 36,
						left: 36,
						right: 36,
						bottom: 36,
						border: '1px solid rgba(239,232,218,0.32)',
					}}
				/>

				{/* Chapter label */}
				<div
					style={{
						position: 'absolute',
						left: 96,
						top: 84,
						display: 'flex',
						fontSize: 22,
						letterSpacing: 6,
						...monoStyle,
					}}
				>
					I · ENTRANCE
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
					}}
				>
					<div
						style={{
							display: 'flex',
							fontFamily: 'Instrument Serif',
							fontSize: 196,
							lineHeight: 0.82,
							letterSpacing: -6,
							color: WASHI,
						}}
					>
						JASON
					</div>
					<div
						style={{
							display: 'flex',
							fontFamily: 'Instrument Serif',
							fontStyle: 'italic',
							fontSize: 196,
							lineHeight: 0.82,
							letterSpacing: -6,
							color: WASHI,
						}}
					>
						ZHANG
					</div>
				</div>

				{/* Identity line */}
				<div
					style={{
						position: 'absolute',
						left: 96,
						bottom: 84,
						display: 'flex',
						flexDirection: 'row',
						fontSize: 20,
						letterSpacing: 4,
						...monoStyle,
					}}
				>
					<span>SOFTWARE ENGINEER</span>
					<span style={{ color: SHU, margin: '0 14px' }}>/</span>
					<span>BUILDER</span>
					<span style={{ color: SHU, margin: '0 14px' }}>/</span>
					<span>FOUNDER — NEW YORK</span>
				</div>

				{/* The seal */}
				<div
					style={{
						position: 'absolute',
						right: 96,
						top: 84,
						display: 'flex',
						flexDirection: 'column',
						alignItems: 'center',
					}}
				>
					<div
						style={{
							width: 112,
							height: 112,
							display: 'flex',
							alignItems: 'center',
							justifyContent: 'center',
							background: SHU,
							transform: 'rotate(-3deg)',
						}}
					>
						<div
							style={{
								width: 80,
								height: 80,
								display: 'flex',
								alignItems: 'center',
								justifyContent: 'center',
								border: '1px solid rgba(239,232,218,0.55)',
								fontFamily: 'Instrument Serif',
								fontStyle: 'italic',
								fontSize: 60,
								letterSpacing: -4,
								color: WASHI,
							}}
						>
							JZ
						</div>
					</div>
					<div
						style={{
							display: 'flex',
							marginTop: 22,
							fontSize: 18,
							letterSpacing: 2,
							...monoStyle,
						}}
					>
						{siteConfig.url.replace('https://', '')}
					</div>
				</div>
			</div>
		),
		{
			...size,
			fonts: [
				{ name: 'Instrument Serif', data: serif, weight: 400, style: 'normal' },
				{ name: 'Instrument Serif', data: serifItalic, weight: 400, style: 'italic' },
				{ name: 'Geist Mono', data: mono, weight: 400, style: 'normal' },
			],
		}
	);
}
