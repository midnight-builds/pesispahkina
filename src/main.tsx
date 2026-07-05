import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { GameProvider } from './state/GameContext';
import App from './App';
import '@fontsource/press-start-2p/latin.css';
import '@fontsource/press-start-2p/latin-ext.css';
import '@fontsource/vt323/latin.css';
import '@fontsource/vt323/latin-ext.css';
import './styles.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <GameProvider>
      <App />
    </GameProvider>
  </StrictMode>,
);
