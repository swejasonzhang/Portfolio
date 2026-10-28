import Link from 'next/link';

export const metadata = { title: 'Page not found' };

export default function NotFound() {
	return (
		<main id="main" className="mx-auto flex min-h-screen max-w-screen-md flex-col items-start justify-center gap-6 px-6">
			<p className="label text-accent">404</p>
			<h1 className="font-serif text-5xl text-bright">This page doesn&rsquo;t exist.</h1>
			<p className="max-w-md text-lg text-muted">It may have moved. Everything is on the home page.</p>
			<div className="flex flex-wrap gap-3">
				<Link href="/" className="btn-primary">
					Go home
				</Link>
				<Link href="/#projects" className="btn-ghost">
					See projects
				</Link>
			</div>
		</main>
	);
}
