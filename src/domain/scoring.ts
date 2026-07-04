// Pisteytys ja tähdet. Puhtaita funktioita — testattavissa ilman UI:ta.

import {
  KIERROKSEN_PITUUS,
  ONNISTUMISKYNNYS,
  PISTEET_OIKEASTA,
  PUTKIBONUS,
  PUTKIBONUS_ALKAA,
} from './config';

interface ScoreStep {
  /** Putken pituus tämän vastauksen jälkeen. */
  streakAfter: number;
  /** Tästä vastauksesta ansaitut pisteet. */
  points: number;
}

/**
 * Laskee yhden vastauksen tuloksen. Väärä nollaa putken eikä anna pisteitä
 * (ei rangaista). Kolmannesta peräkkäisestä oikeasta alkaen tulee putkibonus.
 */
export function scoreAnswer(currentStreak: number, correct: boolean): ScoreStep {
  if (!correct) {
    return { streakAfter: 0, points: 0 };
  }
  const streakAfter = currentStreak + 1;
  const bonus = streakAfter >= PUTKIBONUS_ALKAA ? PUTKIBONUS : 0;
  return { streakAfter, points: PISTEET_OIKEASTA + bonus };
}

/** Tähdet kierroksen oikeiden määrästä. 10→3, 8–9→2, 5–7→1, alle 5→0. */
export function starsForCorrect(correctCount: number): number {
  if (correctCount >= KIERROKSEN_PITUUS) return 3;
  if (correctCount >= ONNISTUMISKYNNYS) return 2;
  if (correctCount >= 5) return 1;
  return 0;
}

/** Onnistunut kierros = oikeita vähintään onnistumiskynnys. */
export function isSuccessfulRound(correctCount: number): boolean {
  return correctCount >= ONNISTUMISKYNNYS;
}
