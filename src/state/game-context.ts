// Pelitilan konteksti, tyypit ja useGame-hook. Erillään GameProviderista
// (GameContext.tsx), jotta komponenttitiedosto exporttaa vain komponentin
// (Fast Refresh -vaatimus, react-refresh/only-export-components).

import { createContext, useContext } from 'react';
import type { AchievementDef } from '../domain/achievements';
import type {
  AgeGroupState,
  AnsweredQuestion,
  Ikaluokka,
  Lokero,
  Nakokulma,
  Question,
  RoundResult,
  SaveData,
  Settings,
  Vaikeustaso,
} from '../domain/types';

export type View = 'home' | 'tiers' | 'round' | 'result' | 'settings';

export interface PresentedQuestion {
  question: Question;
  /** Näyttöpaikka → alkuperäinen vaihtoehtoindeksi (vaihtoehdot sekoitetaan). */
  optionOrder: number[];
}

export interface RoundState {
  lokero: Lokero;
  questions: PresentedQuestion[];
  index: number;
  answers: AnsweredQuestion[];
  streak: number;
  phase: 'question' | 'revealed';
  chosenDisplayIndex: number | null;
}

export interface RoundOutcome {
  result: RoundResult;
  newlyUnlocked: Vaikeustaso | null;
  newAchievements: AchievementDef[];
  celebrate: boolean;
}

export interface GameContextValue {
  save: SaveData;
  view: View;
  /** Ylin valinta: kummalta kannalta pelataan (ks. ADR 0006). */
  nakokulma: Nakokulma;
  selectedIkaluokka: Ikaluokka | null;
  round: RoundState | null;
  outcome: RoundOutcome | null;
  ageGroupState: (ik: Ikaluokka) => AgeGroupState;
  poolSize: (lokero: Lokero) => number;
  chooseNakokulma: (nk: Nakokulma) => void;
  goHome: () => void;
  openTiers: (ik: Ikaluokka) => void;
  openSettings: () => void;
  startRound: (lokero: Lokero) => void;
  chooseAnswer: (displayIndex: number) => void;
  advance: () => void;
  updateSettings: (partial: Partial<Settings>) => void;
  doResetProgress: () => void;
}

export const GameContext = createContext<GameContextValue | null>(null);

export function useGame(): GameContextValue {
  const ctx = useContext(GameContext);
  if (!ctx) throw new Error('useGame must be used within GameProvider');
  return ctx;
}
