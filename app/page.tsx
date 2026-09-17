import Hero from './components/Hero';
import TwoSides from './components/TwoSides';
import Experience from './components/Experience';
import Education from './components/Education';
import ProjectsSection from './components/ProjectsSection';
import OtherHalfSection from './components/OtherHalfSection';
import ContactSection from './components/ContactSection';

export default function FullStackPortfolio() {
	return (
		<main id="main" className="relative min-h-screen text-white">
			<div id="home">
				<section aria-labelledby="hero-title">
					<Hero />
				</section>
				<TwoSides />
				<Experience />
				<Education />
			</div>

			<div aria-hidden="true" className="container-ink">
				<div className="rule-double" />
			</div>

			<ProjectsSection />
			<OtherHalfSection />
			<ContactSection />
		</main>
	);
}
