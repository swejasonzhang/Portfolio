import { ImageResponse } from 'next/og';
import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { siteConfig } from './site';

export const dynamic = 'force-static';
export const alt = 'Jason Zhang, software engineer and founder of Inkmity';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

const AMETHYST = '#9966CC';

export default async function OpengraphImage() {
	const [regular, serif] = await Promise.all([
		readFile(join(process.cwd(), 'app/fonts/Inter-400.ttf')),
		readFile(join(process.cwd(), 'app/fonts/InstrumentSerif-400.ttf')),
	]);

	return new ImageResponse(
		(
			<div
				style={{
					width: '100%',
					height: '100%',
					display: 'flex',
					flexDirection: 'column',
					justifyContent: 'space-between',
					padding: '64px 80px',
					backgroundColor: '#09090c',
					backgroundImage: 'radial-gradient(circle at 0% 0%, rgba(153,102,204,0.22), rgba(9,9,12,0) 55%)',
					color: '#d6d6d6',
					fontFamily: 'Inter',
				}}
			>
				<div style={{ display: 'flex', alignItems: 'center', fontSize: 24, color: '#ffffff' }}>
					<span style={{ width: 12, height: 12, borderRadius: 6, background: AMETHYST, marginRight: 14 }} />
					Open to software engineering internships and co-ops
				</div>
				<div style={{ display: 'flex', flexDirection: 'column' }}>
					<div style={{ display: 'flex', fontFamily: 'Instrument Serif', fontSize: 132, color: '#ffffff', letterSpacing: -2, lineHeight: 1 }}>
						Jason&nbsp;<span style={{ color: AMETHYST, fontStyle: 'italic' }}>Zhang</span>
					</div>
					<div style={{ marginTop: 22, fontSize: 34, color: '#d6d6d6', lineHeight: 1.3 }}>
						Software engineer · Founder of Inkmity · Computer Science at Queens College (CUNY)
					</div>
				</div>
				<div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 24, color: '#8a8a8a' }}>
					<span>{siteConfig.url.replace('https://', '')}</span>
					<span style={{ color: '#c4a7ec' }}>New York, NY</span>
				</div>
			</div>
		),
		{
			...size,
			fonts: [
				{ name: 'Inter', data: regular, weight: 400, style: 'normal' },
				{ name: 'Instrument Serif', data: serif, weight: 400, style: 'normal' },
			],
		}
	);
}
