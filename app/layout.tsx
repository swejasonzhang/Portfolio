import type { Metadata, Viewport } from 'next';
import { Geist, Geist_Mono, Pirata_One } from 'next/font/google';
import './globals.css';
import MotionProvider from './components/MotionProvider';
import Preloader from './components/Preloader';
import InkCursor from './components/InkCursor';
import AnimatedBackground from './components/AnimatedBackground';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import BackToTop from './components/BackToTop';
import { siteConfig } from './site';

const geistSans = Geist({
	variable: '--font-geist-sans',
	subsets: ['latin'],
});

const geistMono = Geist_Mono({
	variable: '--font-geist-mono',
	subsets: ['latin'],
});

const pirata = Pirata_One({
	weight: '400',
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
		'Full-Stack Developer',
		'Software Engineer',
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
	themeColor: '#050505',
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
	jobTitle: siteConfig.role,
	address: {
		'@type': 'PostalAddress',
		addressLocality: siteConfig.locationLocality,
		addressRegion: siteConfig.locationRegion,
		addressCountry: siteConfig.locationCountry,
	},
	alumniOf: [
		{ '@type': 'CollegeOrUniversity', name: 'CUNY Queens College' },
		{ '@type': 'CollegeOrUniversity', name: 'CUNY College of Staten Island' },
		{ '@type': 'EducationalOrganization', name: 'App Academy' },
	],
	knowsAbout: ['React', 'Next.js', 'TypeScript', 'Node.js', 'PostgreSQL', 'MongoDB'],
	sameAs: [
		siteConfig.socials.github,
		siteConfig.socials.linkedin,
		siteConfig.socials.x,
	],
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en">
			<body className={`${geistSans.variable} ${geistMono.variable} ${pirata.variable} antialiased`}>
				<script
					type="application/ld+json"
					dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd) }}
				/>
				<a
					href="#main"
					className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[200] focus:rounded-sm focus:bg-white focus:px-4 focus:py-2 focus:font-mono focus:text-xs focus:uppercase focus:tracking-btn focus:text-black"
				>
					Skip to content
				</a>
				<MotionProvider>
					<Preloader />
					<InkCursor />
					<AnimatedBackground />
					<Navbar />
					{children}
					<Footer />
					<BackToTop />
				</MotionProvider>
			</body>
		</html>
	);
}
