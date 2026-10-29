import { ImageResponse } from 'next/og';
import { readFile } from 'node:fs/promises';
import { join } from 'node:path';

export const dynamic = 'force-static';
export const size = { width: 180, height: 180 };
export const contentType = 'image/png';

/** Home-screen icon for iPhone and iPad (iOS ignores SVG icons): the amethyst crystals on ink black. */
export default async function AppleIcon() {
	const svg = await readFile(join(process.cwd(), 'app/icon.svg'), 'utf8');
	return new ImageResponse(
		(
			<div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#09090c' }}>
				<img width={132} height={132} src={`data:image/svg+xml;base64,${Buffer.from(svg).toString('base64')}`} alt="" />
			</div>
		),
		size
	);
}
