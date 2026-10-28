import Link from 'next/link';

export const metadata = { title: 'Page not found' };

export default function NotFound() {
	return (
		<main id="main" className="container-page flex min-h-screen flex-col items-start justify-center gap-6">
			<p className="eyebrow">404</p>
			<h1 className="text-4xl font-semibold tracking-tight">This page doesn&rsquo;t exist.</h1>
			<p className="max-w-md text-lg text-muted">It may have moved. Everything is on the home page.</p>
			<div className="flex flex-wrap gap-3">
				<Link href="/" className="btn-primary">
					Go home
				</Link>
				<Link href="/#projects" className="btn-secondary">
					See projects
				</Link>
			</div>
		</main>
	);
}
