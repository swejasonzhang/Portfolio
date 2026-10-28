import type { Metadata, Viewport } from 'next';
import { Instrument_Serif, Inter } from 'next/font/google';
import './globals.css';
import { siteConfig } from './site';

const sans = Inter({
	subsets: ['latin'],
	variable: '--font-sans',
	display: 'swap',
});

const serif = Instrument_Serif({
	subsets: ['latin'],
	weight: '400',
	style: ['normal', 'italic'],
	variable: '--font-serif',
	display: 'swap',
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
	themeColor: '#09090c',
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
		<html lang="en" className={`${sans.variable} ${serif.variable}`} suppressHydrationWarning>
			<head>
				{/* Marks that scripts run, so scroll reveals only hide content when they can show it again. */}
				<script dangerouslySetInnerHTML={{ __html: "document.documentElement.classList.add('js')" }} />
			</head>
			<body>
				<script
					type="application/ld+json"
					dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd) }}
				/>
				<a
					href="#main"
					className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-md focus:bg-bright focus:px-4 focus:py-2 focus:text-sm focus:text-bg"
				>
					Skip to content
				</a>
				{children}
			</body>
		</html>
	);
}
