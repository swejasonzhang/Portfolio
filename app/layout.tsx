import type { Metadata, Viewport } from 'next';
import { Geist, Geist_Mono, Barlow_Condensed } from 'next/font/google';
import './globals.css';
import MotionProvider from './components/MotionProvider';
import Arise from './components/Arise';
import Notifier from './components/Notifier';
import Rail from './components/Rail';
import { siteConfig } from './site';

const geistSans = Geist({
	variable: '--font-geist-sans',
	subsets: ['latin'],
});

const geistMono = Geist_Mono({
	variable: '--font-geist-mono',
	subsets: ['latin'],
});

const display = Barlow_Condensed({
	weight: ['600', '700', '800'],
	variable: '--font-display',
	subsets: ['latin'],
});

export const metadata: Metadata = {
	metadataBase: new URL(siteConfig.url),
	title: {
		default: siteConfig.title,
		template: `%s — ${siteConfig.name}`,
	},
	description: siteConfig.description,
	applicationName: siteConfig.name,
	keywords: [
		'Jason Zhang',
		'swejasonzhang',
		'Software Engineer',
		'Founder',
		'Inkmity',
		'React',
		'Next.js',
		'Node.js',
		'TypeScript',
		'New York',
	],
	authors: [{ name: siteConfig.name, url: siteConfig.url }],
	creator: siteConfig.name,
	publisher: siteConfig.name,
	alternates: { canonical: siteConfig.url },
	icons: {
		icon: '/icon.svg',
		shortcut: '/icon.svg',
		apple: '/icon.svg',
	},
	openGraph: {
		title: siteConfig.title,
		description: siteConfig.description,
		url: siteConfig.url,
		siteName: siteConfig.name,
		locale: 'en_US',
		type: 'website',
	},
	twitter: {
		card: 'summary_large_image',
		title: siteConfig.title,
		description: siteConfig.description,
		creator: siteConfig.twitterHandle,
	},
	robots: {
		index: true,
		follow: true,
		googleBot: {
			index: true,
			follow: true,
			'max-video-preview': -1,
			'max-image-preview': 'large',
			'max-snippet': -1,
		},
	},
	category: 'technology',
};

export const viewport: Viewport = {
	themeColor: '#06070b',
	colorScheme: 'dark',
	width: 'device-width',
	initialScale: 1,
	viewportFit: 'cover',
};

const personJsonLd = {
	'@context': 'https://schema.org',
	'@type': 'Person',
	name: siteConfig.name,
	url: siteConfig.url,
	email: `mailto:${siteConfig.email}`,
	jobTitle: 'Software Engineer and Founder',
	address: {
		'@type': 'PostalAddress',
		addressLocality: siteConfig.locationLocality,
		addressRegion: siteConfig.locationRegion,
		addressCountry: siteConfig.locationCountry,
	},
	alumniOf: [
		{ '@type': 'CollegeOrUniversity', name: 'Queens College (CUNY)' },
		{ '@type': 'CollegeOrUniversity', name: 'College of Staten Island (CUNY)' },
		{ '@type': 'EducationalOrganization', name: 'App Academy' },
	],
	knowsAbout: ['React', 'TypeScript', 'Node.js', 'Express', 'MongoDB', 'PostgreSQL', 'Stripe'],
	sameAs: [siteConfig.socials.github, siteConfig.socials.linkedin, siteConfig.socials.x, siteConfig.inkmity],
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en">
			<body className={`${geistSans.variable} ${geistMono.variable} ${display.variable} antialiased`}>
				<script
					type="application/ld+json"
					dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd) }}
				/>
				<a
					href="#main"
					className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[200] focus:bg-sys focus:px-4 focus:py-2 focus:font-mono focus:text-xs focus:uppercase focus:tracking-label focus:text-void"
				>
					Skip to content
				</a>
				<MotionProvider>
					<Arise />
					<Rail />
					<Notifier />
					{children}
				</MotionProvider>
			</body>
		</html>
	);
}
