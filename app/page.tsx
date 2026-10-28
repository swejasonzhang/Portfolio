import About from './components/About';
import Contact from './components/Contact';
import Hero from './components/Hero';
import Projects from './components/Projects';
import Skills from './components/Skills';

/** Awakening → Projects → Abilities → the climb → the next gate. */
export default function Page() {
	return (
		<main id="main" className="relative">
			<Hero />
			<Projects />
			<Skills />
			<About />
			<Contact />
		</main>
	);
}
