import Link from 'next/link';

export const metadata = { title: 'Not found' };

export default function NotFound() {
	return (
		<main
			id="main"
			className="relative flex min-h-screen flex-col items-center justify-center gap-6 px-6 text-center"
		>
			<p className="hud text-sys">Gate 404 · no such gate</p>
			<h1 className="font-display text-display-name font-bold uppercase text-ice">
				4<span className="hollow">0</span>4
			</h1>
			<span aria-hidden="true" className="rule-glow w-40" />
			<p className="max-w-[40ch] text-pretty text-ice-2">
				No gate opens here. The page does not exist, or it moved.
			</p>
			<div className="flex flex-wrap justify-center gap-4">
				<Link href="/" className="btn-sys">
					Return to the awakening
				</Link>
				<Link href="/#inkmity" className="btn-ghost">
					Enter the S-Rank gate
				</Link>
			</div>
		</main>
	);
}
