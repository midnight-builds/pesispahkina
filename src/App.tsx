import { useGame } from './state/GameContext';
import { HomeScreen } from './ui/HomeScreen';
import { TiersScreen } from './ui/TiersScreen';
import { RoundScreen } from './ui/RoundScreen';
import { ResultScreen } from './ui/ResultScreen';
import { SettingsScreen } from './ui/SettingsScreen';
import { FieldBackdrop } from './ui/FieldBackdrop';

export default function App() {
  const { view } = useGame();

  return (
    <div className="app">
      <div className="app__frame">
        <FieldBackdrop />
        {view === 'home' && <HomeScreen />}
        {view === 'tiers' && <TiersScreen />}
        {view === 'round' && <RoundScreen />}
        {view === 'result' && <ResultScreen />}
        {view === 'settings' && <SettingsScreen />}
      </div>
    </div>
  );
}
