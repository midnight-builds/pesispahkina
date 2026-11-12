import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { GameProvider } from './state/GameContext';
import App from './App';
import '@fontsource/press-start-2p/latin.css';
import '@fontsource/press-start-2p/latin-ext.css';
import '@fontsource/atkinson-hyperlegible/latin-400.css';
import '@fontsource/atkinson-hyperlegible/latin-ext-400.css';
import '@fontsource/atkinson-hyperlegible/latin-700.css';
import '@fontsource/atkinson-hyperlegible/latin-ext-700.css';
import './styles.css';
import { installUmami } from './analytics/umami';

installUmami();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <GameProvider>
      <App />
    </GameProvider>
  </StrictMode>,
);
