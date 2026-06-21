import AnimatedBackground from './components/AnimatedBackground';
import HeroSection from './components/HeroSection';
import ProjectsSection from './components/ProjectsSection';
import ContactSection from './components/ContactSection';

export default function FullStackPortfolio() {
	return (
		<main className="relative min-h-screen text-white">
			<AnimatedBackground />
			<section id="home">
				<HeroSection />
			</section>
			<section id="projects">
				<ProjectsSection />
			</section>
			<section id="contact">
				<ContactSection />
			</section>
		</main>
	);
}
