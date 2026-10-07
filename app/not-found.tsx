import Link from 'next/link';
import Seal from './components/Seal';

export const metadata = { title: 'Not found' };

export default function NotFound() {
	return (
		<main
			id="main"
			className="relative flex min-h-screen flex-col items-center justify-center gap-6 px-6 text-center"
		>
			<p className="font-mono text-2xs uppercase tracking-kicker text-ash">
				Gate 404 · no such chapter
			</p>
			<h1 className="font-serif text-display-name text-washi">
				4<span className="hollow">0</span>4
			</h1>
			<span aria-hidden="true" className="rule w-12" />
			<p className="max-w-[40ch] text-pretty text-ash">
				Nothing is carved here. The page you want does not exist, or it moved.
			</p>
			<div className="flex flex-wrap justify-center gap-4">
				<Link href="/" className="btn-stamp">
					Return to the entrance
				</Link>
				<Link href="/#inkmity" className="btn-ghost">
					Read the Inkmity study
				</Link>
			</div>
			<Seal className="mt-6 h-10 w-10" />
		</main>
	);
}
