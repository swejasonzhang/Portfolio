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
		template: `%s | ${siteConfig.name}`,
	},
	description: siteConfig.description,
	applicationName: siteConfig.name,
	keywords: [
		'Jason Zhang',
		'Jason Zhang software engineer',
		'swejasonzhang',
		'software engineer New York',
		'software engineering intern',
		'software engineering co-op',
		'full-stack developer',
		'Inkmity',
		'Queens College',
		'CUNY',
		'React',
		'TypeScript',
		'Node.js',
		'Express',
		'MongoDB',
		'Stripe',
		'Next.js',
	],
	authors: [{ name: siteConfig.name, url: siteConfig.url }],
	creator: siteConfig.name,
	publisher: siteConfig.name,
	alternates: { canonical: '/' },
	formatDetection: { email: false, address: false, telephone: false },
	openGraph: {
		type: 'profile',
		firstName: siteConfig.givenName,
		lastName: siteConfig.familyName,
		username: 'swejasonzhang',
		title: siteConfig.title,
		description: siteConfig.description,
		url: '/',
		siteName: siteConfig.name,
		locale: 'en_US',
	},
	twitter: {
		card: 'summary_large_image',
		title: siteConfig.title,
		description: siteConfig.description,
		site: siteConfig.twitterHandle,
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

/** Structured data for search engines: the site, this profile page, and the person it is about. */
const personId = `${siteConfig.url}/#person`;
const structuredData = {
	'@context': 'https://schema.org',
	'@graph': [
		{
			'@type': 'WebSite',
			'@id': `${siteConfig.url}/#website`,
			url: siteConfig.url,
			name: siteConfig.name,
			description: siteConfig.description,
			inLanguage: 'en-US',
			publisher: { '@id': personId },
		},
		{
			'@type': 'ProfilePage',
			'@id': `${siteConfig.url}/#profile`,
			url: siteConfig.url,
			name: siteConfig.title,
			isPartOf: { '@id': `${siteConfig.url}/#website` },
			mainEntity: { '@id': personId },
		},
		{
			'@type': 'Person',
			'@id': personId,
			name: siteConfig.name,
			givenName: siteConfig.givenName,
			familyName: siteConfig.familyName,
			url: siteConfig.url,
			image: `${siteConfig.url}/opengraph-image`,
			email: `mailto:${siteConfig.email}`,
			jobTitle: siteConfig.jobTitle,
			description: siteConfig.description,
			worksFor: { '@type': 'Organization', name: 'Inkmity', url: siteConfig.inkmity },
			affiliation: { '@type': 'CollegeOrUniversity', name: 'Queens College, City University of New York' },
			alumniOf: [
				{ '@type': 'CollegeOrUniversity', name: 'College of Staten Island, City University of New York' },
				{ '@type': 'EducationalOrganization', name: 'App Academy' },
			],
			address: {
				'@type': 'PostalAddress',
				addressLocality: siteConfig.locationLocality,
				addressRegion: siteConfig.locationRegion,
				addressCountry: siteConfig.locationCountry,
			},
			knowsAbout: ['Software engineering', 'Full-stack web development', 'React', 'TypeScript', 'Node.js', 'Express', 'MongoDB', 'PostgreSQL', 'Stripe payments', 'Python'],
			sameAs: [siteConfig.socials.github, siteConfig.socials.linkedin, siteConfig.socials.x, siteConfig.inkmity],
		},
	],
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en" className={`${sans.variable} ${serif.variable}`} suppressHydrationWarning>
			<head>
				{/* Marks that scripts run, so scroll reveals only hide content when they can show it again.
				    Also removes stray comment and blank text nodes from <head>: Netlify injects a comment
				    there (with line breaks around it), and React's hydration stops on them (React error
				    #418). Next.js renders <head> as elements only, so nothing of ours is removed. */}
				<script
					dangerouslySetInnerHTML={{
						__html:
							"document.documentElement.classList.add('js');" +
							"Array.prototype.slice.call(document.head.childNodes).forEach(function(n){if(n.nodeType===8||(n.nodeType===3&&!n.nodeValue.trim()))n.parentNode.removeChild(n)});",
					}}
				/>
			</head>
			<body>
				<script
					type="application/ld+json"
					dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
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
