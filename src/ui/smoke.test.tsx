import { describe, it, expect } from 'vitest';
import { renderToString } from 'react-dom/server';
import { GameProvider } from '../state/GameContext';
import App from '../App';

// Renderöi koko komponenttipuun (node-ympäristö, ei DOM:ia). Varmistaa, ettei
// import-/render-ketjussa ole ajonaikaisia virheitä ja että kotinäkymä piirtyy.
describe('App-smoke', () => {
  it('renderöityy ja näyttää kotinäkymän', () => {
    const html = renderToString(
      <GameProvider>
        <App />
      </GameProvider>,
    );
    expect(html).toContain('Pähkinä');
    expect(html).toContain('Valitse ikäluokka');
  });
});
