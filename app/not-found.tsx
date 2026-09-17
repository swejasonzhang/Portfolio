import MagneticButton from './components/MagneticButton';
import YinYang from './components/YinYang';

export const metadata = { title: 'Not found' };

export default function NotFound() {
	return (
		<main
			id="main"
			className="flex min-h-screen flex-col items-center justify-center gap-6 px-5 text-center"
		>
			<p className="font-mono text-2xs uppercase tracking-kicker text-gray-400">
				Nº 404 · Out of balance
			</p>
			<h1 className="font-display ink-bleed text-[9rem] leading-none text-white md:text-[12rem]">
				4
				<YinYang className="inline-block h-[0.72em] w-[0.72em] align-baseline" />
				4
			</h1>
			<span aria-hidden="true" className="block h-0.5 w-12 bg-white" />
			<p className="max-w-[44ch] text-pretty text-gray-400">
				Nothing here. The page you&apos;re after doesn&apos;t exist, or it moved.
			</p>
			<div className="flex flex-wrap justify-center gap-4">
				<MagneticButton href="/" variant="yang">
					Return home
				</MagneticButton>
				<MagneticButton href="/#projects" variant="yin">
					See the work
				</MagneticButton>
			</div>
		</main>
	);
}
