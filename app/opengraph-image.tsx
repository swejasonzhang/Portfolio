import { ImageResponse } from 'next/og';
import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { siteConfig } from './site';

export const dynamic = 'force-static';
export const alt = 'Jason Zhang — Software Engineer';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

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
					padding: '72px 80px',
					backgroundColor: '#09090c',
					backgroundImage: 'radial-gradient(circle at 0% 0%, rgba(167,139,250,0.18), rgba(9,9,12,0) 55%)',
					color: '#c8cad4',
					fontFamily: 'Inter',
				}}
			>
				<div style={{ display: 'flex', alignItems: 'center', fontSize: 24, color: '#9699a6' }}>
					<div style={{ width: 12, height: 12, borderRadius: 6, background: '#34d399', marginRight: 14 }} />
					Available for software engineering internships and co-ops
				</div>
				<div style={{ display: 'flex', flexDirection: 'column' }}>
					<div style={{ display: 'flex', fontFamily: 'Instrument Serif', fontSize: 128, color: '#f4f4f7', letterSpacing: -2 }}>
						Jason&nbsp;<span style={{ color: '#a78bfa', fontStyle: 'italic' }}>Zhang</span>
					</div>
					<div style={{ marginTop: 10, fontSize: 34, color: '#c8cad4', lineHeight: 1.3 }}>
						Software engineer · Founder of Inkmity · Computer Science at Queens College (CUNY)
					</div>
				</div>
				<div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 24, color: '#696c7a' }}>
					<span>{siteConfig.url.replace('https://', '')}</span>
					<span style={{ color: '#a78bfa' }}>New York, NY</span>
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
