// Pelin keskitetty tila: save-data, näkymä ja käynnissä oleva kierros.
// Yksi pelimuoto (tietovisakierros) — kierroslogiikka on tämän sauman takana.

import { createContext, useContext, useMemo, useState, type ReactNode } from 'react';
import confetti from 'canvas-confetti';
import { QUESTIONS } from '../data/questions';
import { ACHIEVEMENT_BY_ID, evaluateAchievements, type AchievementDef } from '../domain/achievements';
import { buildRound, finalizeRound, questionsForLokero } from '../domain/round';
import { scoreAnswer } from '../domain/scoring';
import { applyRoundResult, createAgeGroupState } from '../domain/progression';
import { playCelebrate, playCorrect, playReveal } from '../audio/sounds';
import { loadSave, persistSave, resetProgress } from '../storage/storage';
import type {
  AgeGroupState,
  AnsweredQuestion,
  Ikaluokka,
  Lokero,
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

interface RoundState {
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

interface GameContextValue {
  save: SaveData;
  view: View;
  selectedIkaluokka: Ikaluokka | null;
  round: RoundState | null;
  outcome: RoundOutcome | null;
  ageGroupState: (ik: Ikaluokka) => AgeGroupState;
  poolSize: (lokero: Lokero) => number;
  goHome: () => void;
  openTiers: (ik: Ikaluokka) => void;
  openSettings: () => void;
  startRound: (lokero: Lokero) => void;
  chooseAnswer: (displayIndex: number) => void;
  advance: () => void;
  updateSettings: (partial: Partial<Settings>) => void;
  doResetProgress: () => void;
}

const GameContext = createContext<GameContextValue | null>(null);

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function present(questions: Question[]): PresentedQuestion[] {
  return questions.map((q) => ({
    question: q,
    optionOrder: shuffle(q.vaihtoehdot.map((_, i) => i)),
  }));
}

export function GameProvider({ children }: { children: ReactNode }) {
  const [save, setSave] = useState<SaveData>(() => loadSave());
  const [view, setView] = useState<View>('home');
  const [selectedIkaluokka, setSelectedIkaluokka] = useState<Ikaluokka | null>(null);
  const [round, setRound] = useState<RoundState | null>(null);
  const [outcome, setOutcome] = useState<RoundOutcome | null>(null);

  function commitSave(next: SaveData) {
    persistSave(next);
    setSave(next);
  }

  const value = useMemo<GameContextValue>(() => {
    function ageGroupState(ik: Ikaluokka): AgeGroupState {
      return save.ageGroups[ik] ?? createAgeGroupState();
    }

    function poolSize(lokero: Lokero): number {
      return questionsForLokero(QUESTIONS, lokero).length;
    }

    function goHome() {
      setView('home');
      setRound(null);
      setOutcome(null);
    }

    function openTiers(ik: Ikaluokka) {
      setSelectedIkaluokka(ik);
      setView('tiers');
    }

    function openSettings() {
      setView('settings');
    }

    function startRound(lokero: Lokero) {
      const pool = questionsForLokero(QUESTIONS, lokero);
      if (pool.length === 0) return;
      const questions = present(buildRound(pool, save.questionResults));
      setSelectedIkaluokka(lokero.ikaluokka);
      setRound({
        lokero,
        questions,
        index: 0,
        answers: [],
        streak: 0,
        phase: 'question',
        chosenDisplayIndex: null,
      });
      setView('round');
    }

    function chooseAnswer(displayIndex: number) {
      setRound((prev) => {
        if (!prev || prev.phase !== 'question') return prev;
        const presented = prev.questions[prev.index];
        const originalIndex = presented.optionOrder[displayIndex];
        const correct = originalIndex === presented.question.oikeaIndeksi;
        const step = scoreAnswer(prev.streak, correct);
        const answered: AnsweredQuestion = {
          question: presented.question,
          chosenIndex: originalIndex,
          correct,
          streakAfter: step.streakAfter,
          pointsEarned: step.points,
        };
        if (save.settings.soundEnabled) {
          if (correct) playCorrect();
          else playReveal();
        }
        return {
          ...prev,
          answers: [...prev.answers, answered],
          streak: step.streakAfter,
          phase: 'revealed',
          chosenDisplayIndex: displayIndex,
        };
      });
    }

    function finishRound(state: RoundState) {
      const result = finalizeRound(state.lokero, state.answers);
      const { save: applied, newlyUnlocked } = applyRoundResult(save, result);
      const earnedIds = evaluateAchievements(applied, result, newlyUnlocked);
      const withAchievements: SaveData = {
        ...applied,
        achievements: [...applied.achievements, ...earnedIds],
      };
      commitSave(withAchievements);

      const celebrate = result.stars === 3 || newlyUnlocked !== null;
      setOutcome({
        result,
        newlyUnlocked,
        newAchievements: earnedIds.map((id) => ACHIEVEMENT_BY_ID[id]).filter(Boolean),
        celebrate,
      });
      setRound(null);
      setView('result');

      if (celebrate) {
        if (save.settings.soundEnabled) playCelebrate();
        if (save.settings.animationsEnabled) {
          void confetti({ particleCount: 120, spread: 70, origin: { y: 0.6 } });
        }
      }
    }

    function advance() {
      setRound((prev) => {
        if (!prev || prev.phase !== 'revealed') return prev;
        if (prev.index + 1 < prev.questions.length) {
          return { ...prev, index: prev.index + 1, phase: 'question', chosenDisplayIndex: null };
        }
        // Viimeinen kysymys → viimeistely (tehdään erikseen, ei setterin sisällä).
        queueMicrotask(() => finishRound(prev));
        return prev;
      });
    }

    function updateSettings(partial: Partial<Settings>) {
      commitSave({ ...save, settings: { ...save.settings, ...partial } });
    }

    function doResetProgress() {
      const fresh = resetProgress(save.settings);
      setSave(fresh);
      setSelectedIkaluokka(null);
      setOutcome(null);
      setRound(null);
      setView('home');
    }

    return {
      save,
      view,
      selectedIkaluokka,
      round,
      outcome,
      ageGroupState,
      poolSize,
      goHome,
      openTiers,
      openSettings,
      startRound,
      chooseAnswer,
      advance,
      updateSettings,
      doResetProgress,
    };
  }, [save, view, selectedIkaluokka, round, outcome]);

  return <GameContext.Provider value={value}>{children}</GameContext.Provider>;
}

export function useGame(): GameContextValue {
  const ctx = useContext(GameContext);
  if (!ctx) throw new Error('useGame must be used within GameProvider');
  return ctx;
}
