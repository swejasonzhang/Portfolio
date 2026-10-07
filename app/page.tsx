import Entrance from './components/Entrance';
import InkmityStudy from './components/InkmityStudy';
import Works from './components/Works';
import Record from './components/Record';
import Self from './components/Self';
import Closing from './components/Closing';

export default function Page() {
	return (
		<main id="main" className="relative">
			<Entrance />
			<InkmityStudy />
			<Works />
			<Record />
			<Self />
			<Closing />
		</main>
	);
}
