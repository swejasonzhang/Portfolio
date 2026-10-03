import { ImageResponse } from 'next/og';
import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { siteConfig } from './site';
import YinYang from './components/YinYang';

export const dynamic = 'force-static';
export const alt = `${siteConfig.name} — ${siteConfig.role}`;
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

const CORNERS = [
	{ top: 46, left: 46 },
	{ top: 46, right: 46 },
	{ bottom: 46, left: 46 },
	{ bottom: 46, right: 46 },
];

export default async function OpengraphImage() {
	const [pirata, mono] = await Promise.all([
		readFile(join(process.cwd(), 'app/fonts/PirataOne-Regular.ttf')),
		readFile(join(process.cwd(), 'app/fonts/GeistMono.ttf')),
	]);

	return new ImageResponse(
		(
			<div
				style={{
					width: '100%',
					height: '100%',
					display: 'flex',
					position: 'relative',
					background: '#050505',
					color: '#ffffff',
				}}
			>
				{/* Flash-frame: outer plate border + inset keyline */}
				<div
					style={{
						position: 'absolute',
						top: 28,
						left: 28,
						right: 28,
						bottom: 28,
						border: '2px solid rgba(255,255,255,0.75)',
					}}
				/>
				<div
					style={{
						position: 'absolute',
						top: 40,
						left: 40,
						right: 40,
						bottom: 40,
						border: '1px solid rgba(255,255,255,0.3)',
					}}
				/>
				{CORNERS.map((pos, i) => (
					<div
						key={i}
						style={{
							position: 'absolute',
							width: 10,
							height: 10,
							background: '#ffffff',
							transform: 'rotate(45deg)',
							...pos,
						}}
					/>
				))}

				{/* Left column: kicker, name, url */}
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
							fontFamily: 'Geist Mono',
							fontSize: 22,
							letterSpacing: 6,
							color: '#a3a3a3',
							marginBottom: 28,
						}}
					>
						Nº 01 · CS STUDENT & DEVELOPER · NYC
					</div>
					<div
						style={{
							display: 'flex',
							fontFamily: 'Pirata One',
							fontSize: 150,
							lineHeight: 0.9,
							color: '#ffffff',
						}}
					>
						Jason
					</div>
					<div
						style={{
							display: 'flex',
							fontFamily: 'Pirata One',
							fontSize: 150,
							lineHeight: 0.9,
							color: '#ffffff',
						}}
					>
						Zhang
					</div>
				</div>

				<div
					style={{
						position: 'absolute',
						left: 96,
						bottom: 72,
						display: 'flex',
						fontFamily: 'Geist Mono',
						fontSize: 20,
						letterSpacing: 4,
						color: '#737373',
					}}
				>
					{siteConfig.url.replace('https://', '')}
				</div>

				{/* Right: the signature mark */}
				<div
					style={{
						position: 'absolute',
						left: 860,
						top: 0,
						height: '100%',
						display: 'flex',
						alignItems: 'center',
					}}
				>
					<YinYang size={220} />
				</div>
			</div>
		),
		{
			...size,
			fonts: [
				{ name: 'Pirata One', data: pirata, weight: 400, style: 'normal' },
				{ name: 'Geist Mono', data: mono, weight: 400, style: 'normal' },
			],
		}
	);
}
