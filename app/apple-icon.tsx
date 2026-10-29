import { ImageResponse } from 'next/og';
import { readFile } from 'node:fs/promises';
import { join } from 'node:path';

export const dynamic = 'force-static';
export const size = { width: 180, height: 180 };
export const contentType = 'image/png';

/** Home-screen icon for iPhone and iPad: the JZ monogram as a PNG (iOS ignores SVG icons). */
export default async function AppleIcon() {
	const svg = await readFile(join(process.cwd(), 'app/icon.svg'), 'utf8');
	// iOS rounds the corners itself, so draw the tile square.
	const square = svg.replace('rx="11"', 'rx="0"');
	return new ImageResponse(
		(
			<img width={180} height={180} src={`data:image/svg+xml;base64,${Buffer.from(square).toString('base64')}`} alt="" />
		),
		size
	);
}
