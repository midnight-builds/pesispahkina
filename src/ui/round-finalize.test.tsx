// @vitest-environment jsdom
import { StrictMode } from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { GameProvider } from '../state/GameContext';
import App from '../App';

// Confetti käyttäisi <canvas>-APIa, jota jsdom ei tue → mockataan pois.
const confettiMock = vi.fn();
vi.mock('canvas-confetti', () => ({ default: (...args: unknown[]) => confettiMock(...args) }));

const STORAGE_KEY = 'pesispahkina.save.v1';

beforeEach(() => {
  localStorage.clear();
  confettiMock.mockClear();
});

/** Pelaa yhden kierroksen loppuun klikkaamalla aina ensimmäistä vaihtoehtoa. */
async function playRoundToResult() {
  fireEvent.click(screen.getByRole('button', { name: /G-juniorit/i }));
  fireEvent.click(screen.getAllByRole('button', { name: /^Pelaa$/i })[0]);

  for (let i = 0; i < 10; i++) {
    const options = document.querySelectorAll<HTMLButtonElement>('.options .option');
    expect(options.length).toBeGreaterThan(0);
    fireEvent.click(options[0]);
    const advance = await screen.findByRole('button', { name: /Jatka|Näytä tulokset/i });
    fireEvent.click(advance);
  }

  await waitFor(() =>
    expect(screen.getByRole('button', { name: /Takaisin alkuun/i })).toBeTruthy(),
  );
}

describe('Kierroksen viimeistely tapahtuu täsmälleen kerran', () => {
  it('yksi pelattu kierros persistoi tuloksen tasan kerran (ei kaksoisviimeistelyä)', async () => {
    // `advance` ajoittaa viimeistelyn setterin sisällä; StrictMode kutsuu setterin
    // kahdesti. Ilman idempotenssivartiota tulos kirjattaisiin kahteen kertaan
    // (tupla-confetti, tupla-fanfaari, tupla-persist). Tämä vartioi täsmälleen yhden.
    const setItem = vi.spyOn(Storage.prototype, 'setItem');
    render(
      <StrictMode>
        <GameProvider>
          <App />
        </GameProvider>
      </StrictMode>,
    );

    await playRoundToResult();

    const persistWrites = setItem.mock.calls.filter((c) => c[0] === STORAGE_KEY).length;
    expect(persistWrites).toBe(1);

    const raw = localStorage.getItem(STORAGE_KEY);
    expect(raw).toBeTruthy();
    expect(JSON.parse(raw!).roundsPlayed).toBe(1);

    setItem.mockRestore();
  });
});
