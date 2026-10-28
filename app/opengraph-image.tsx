import { ImageResponse } from 'next/og';
import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { siteConfig } from './site';

export const dynamic = 'force-static';
export const alt = 'Jason Zhang — Software Engineer';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default async function OpengraphImage() {
	const [regular, bold] = await Promise.all([
		readFile(join(process.cwd(), 'app/fonts/Inter-400.ttf')),
		readFile(join(process.cwd(), 'app/fonts/Inter-700.ttf')),
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
					background: '#ffffff',
					color: '#0f1219',
					fontFamily: 'Inter',
				}}
			>
				<div style={{ display: 'flex', alignItems: 'center', fontSize: 24, color: '#525968' }}>
					<div style={{ width: 12, height: 12, borderRadius: 6, background: '#10b981', marginRight: 14 }} />
					Available for software engineering internships and co-ops
				</div>
				<div style={{ display: 'flex', flexDirection: 'column' }}>
					<div style={{ fontSize: 96, fontWeight: 700, letterSpacing: -3 }}>Jason Zhang</div>
					<div style={{ marginTop: 18, fontSize: 36, color: '#3b4252', lineHeight: 1.3 }}>
						Software engineer · Founder of Inkmity · Computer Science at Queens College (CUNY)
					</div>
				</div>
				<div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 24, color: '#525968' }}>
					<span>{siteConfig.url.replace('https://', '')}</span>
					<span style={{ color: '#2563eb' }}>New York, NY</span>
				</div>
			</div>
		),
		{
			...size,
			fonts: [
				{ name: 'Inter', data: regular, weight: 400, style: 'normal' },
				{ name: 'Inter', data: bold, weight: 700, style: 'normal' },
			],
		}
	);
}
