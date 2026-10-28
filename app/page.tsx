import About from './components/About';
import Contact from './components/Contact';
import Experience from './components/Experience';
import Header from './components/Header';
import Hero from './components/Hero';
import Projects from './components/Projects';

export default function Page() {
	return (
		<>
			<Header />
			<main id="main">
				<Hero />
				<Projects />
				<Experience />
				<About />
				<Contact />
			</main>
		</>
	);
}
