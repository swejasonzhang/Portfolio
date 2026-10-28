import { About, Contact, Experience, Projects } from './components/Sections';
import Sidebar from './components/Sidebar';

export default function Page() {
	return (
		<div className="mx-auto min-h-screen max-w-screen-xl px-6 py-12 md:px-12 md:py-20 lg:flex lg:justify-between lg:gap-10 lg:px-24 lg:py-0">
			<Sidebar />
			<main id="main" className="space-y-24 pt-20 md:space-y-32 lg:w-[50%] lg:py-24 lg:pt-24">
				<About />
				<Projects />
				<Experience />
				<Contact />
			</main>
		</div>
	);
}
