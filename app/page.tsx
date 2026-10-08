import Awakening from './components/Awakening';
import Dungeon from './components/Dungeon';
import ClearedGates from './components/ClearedGates';
import QuestLog from './components/QuestLog';
import Titles from './components/Titles';
import SystemMessage from './components/SystemMessage';
import GateDivider from './components/GateDivider';

export default function Page() {
	return (
		<main id="main" className="relative">
			<Awakening />
			<GateDivider caption="Gate 01 // S-Rank" />
			<Dungeon />
			<GateDivider caption="Gate 02 // Cleared" />
			<ClearedGates />
			<GateDivider caption="Gate 03 // Quest log" />
			<QuestLog />
			<GateDivider caption="Gate 04 // Titles" />
			<Titles />
			<GateDivider caption="Gate 05 // Message" />
			<SystemMessage />
		</main>
	);
}
