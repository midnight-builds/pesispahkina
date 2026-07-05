// @vitest-environment jsdom
import { describe, it, expect, vi, afterEach } from 'vitest';
import { render, screen, cleanup } from '@testing-library/react';
import { ResultScreen } from './ResultScreen';
import type { GameContextValue } from '../state/GameContext';
import type { RoundResult, SaveData, Vaikeustaso } from '../domain/types';
import { createEmptySave } from '../domain/progression';

// useGame mockataan, jotta ResultScreen voidaan renderöidä hallitulla tuloksella
// ilman koko kierroksen pelaamista.
const useGameMock = vi.fn();
vi.mock('../state/GameContext', () => ({
  useGame: () => useGameMock(),
}));

afterEach(() => {
  cleanup();
  vi.clearAllMocks();
});

function result(vaikeustaso: Vaikeustaso, overrides: Partial<RoundResult> = {}): RoundResult {
  return {
    lokero: { ikaluokka: 'G', vaikeustaso },
    answers: Array.from({ length: 10 }, () => ({
      question: {
        id: 'x',
        concept: 'c',
        ikaluokat: ['G'],
        vaikeustaso,
        aihealue: 'perusteet',
        kysymys: 'k?',
        vaihtoehdot: ['a', 'b'],
        oikeaIndeksi: 0,
        selitys: 's',
      },
      chosenIndex: 0,
      correct: true,
      streakAfter: 1,
      pointsEarned: 10,
    })),
    correctCount: 10,
    score: 100,
    stars: 3,
    maxStreak: 5,
    success: true,
    ...overrides,
  };
}

function mountWith(opts: {
  unlocked: Vaikeustaso | null;
  poolSize: number;
  from?: Vaikeustaso;
}) {
  const save: SaveData = createEmptySave();
  const startRound = vi.fn();
  const value: Partial<GameContextValue> = {
    save,
    outcome: {
      result: result(opts.from ?? 'harjoittelija'),
      newlyUnlocked: opts.unlocked,
      newAchievements: [],
      celebrate: true,
    },
    startRound,
    goHome: vi.fn(),
    poolSize: () => opts.poolSize,
  };
  useGameMock.mockReturnValue(value);
  render(<ResultScreen />);
  return { startRound };
}

describe('ResultScreen — seuraavan tason CTA', () => {
  it('EI tarjoa "Seuraava taso" -nappia, jos avautunut taso on tyhjä (ei kysymyksiä)', () => {
    mountWith({ unlocked: 'osaaja', poolSize: 0, from: 'harjoittelija' });
    // Dead-CTA -regressio: nappia ei saa renderöidä, koska klikkaus ei tekisi mitään.
    expect(screen.queryByRole('button', { name: /Seuraava taso/i })).toBeNull();
  });

  it('tarjoaa "Seuraava taso" -napin, kun avautuneessa tasossa on kysymyksiä', () => {
    mountWith({ unlocked: 'harjoittelija', poolSize: 10, from: 'aloittelija' });
    expect(screen.queryByRole('button', { name: /Seuraava taso/i })).not.toBeNull();
  });
});
