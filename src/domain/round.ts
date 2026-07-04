// Kierroksen kokoaminen lokerosta: kevyt kertaus + toisto pienessä poolissa,
// ei kahta samaa kysymystä peräkkäin (ks. ADR 0001).

import {
  KERRATTAVIA_PER_KIERROS,
  KIERROKSEN_PITUUS,
} from './config';
import { starsForCorrect, isSuccessfulRound } from './scoring';
import type {
  AnsweredQuestion,
  Lokero,
  Question,
  RoundResult,
  Tulos,
} from './types';

export type Rng = () => number;

function shuffle<T>(arr: readonly T[], rng: Rng): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/** Kysymykset, jotka kuuluvat annettuun lokeroon. */
export function questionsForLokero(all: readonly Question[], lokero: Lokero): Question[] {
  return all.filter(
    (q) => q.vaikeustaso === lokero.vaikeustaso && q.ikaluokat.includes(lokero.ikaluokka),
  );
}

/**
 * Järjestää kysymykset niin, ettei sama id ole kahdesti peräkkäin (jos mahdollista).
 * Greedy: valitse aina eniten jäljellä oleva id, joka ei ole edellinen.
 */
function arrangeNoAdjacent(items: readonly Question[], rng: Rng): Question[] {
  const byId = new Map<string, { q: Question; count: number }>();
  for (const q of items) {
    const entry = byId.get(q.id);
    if (entry) entry.count += 1;
    else byId.set(q.id, { q, count: 1 });
  }

  const result: Question[] = [];
  let lastId: string | null = null;
  const total = items.length;

  for (let i = 0; i < total; i++) {
    const candidates = shuffle(
      [...byId.values()].filter((e) => e.count > 0),
      rng,
    );
    // Suosi id:tä joka ei ole edellinen ja jolla on eniten jäljellä.
    candidates.sort((a, b) => {
      const aBlocked = a.q.id === lastId ? 1 : 0;
      const bBlocked = b.q.id === lastId ? 1 : 0;
      if (aBlocked !== bBlocked) return aBlocked - bBlocked;
      return b.count - a.count;
    });
    const chosen = candidates[0];
    if (!chosen) break;
    result.push(chosen.q);
    chosen.count -= 1;
    lastId = chosen.q.id;
  }
  return result;
}

/**
 * Kokoaa yhden kierroksen kysymykset. Täyttää enintään `KERRATTAVIA_PER_KIERROS`
 * paikkaa kerrattavilla (viimeisin tulos väärin), loput satunnaisesti. Jos poolissa
 * on alle `length` kysymystä, toisto sallitaan.
 */
export function buildRound(
  pool: readonly Question[],
  questionResults: Readonly<Record<string, Tulos>>,
  rng: Rng = Math.random,
  length: number = KIERROKSEN_PITUUS,
): Question[] {
  if (pool.length === 0) return [];

  const selected: Question[] = [];

  // 1) Kerrattavat tästä lokerosta.
  const review = shuffle(
    pool.filter((q) => questionResults[q.id] === 'wrong'),
    rng,
  ).slice(0, Math.min(KERRATTAVIA_PER_KIERROS, length));
  selected.push(...review);

  // 2) Loput satunnaisesti; suositaan käyttämättömiä ennen toistoa.
  const reviewIds = new Set(review.map((q) => q.id));
  let fillCandidates = shuffle(
    pool.filter((q) => !reviewIds.has(q.id)),
    rng,
  );
  let ci = 0;
  while (selected.length < length) {
    if (fillCandidates.length === 0) {
      // Pooli tyhjeni (pieni pooli) → sallitaan toisto koko poolista.
      fillCandidates = shuffle(pool, rng);
      ci = 0;
    }
    selected.push(fillCandidates[ci]);
    ci += 1;
    if (ci >= fillCandidates.length) {
      fillCandidates = [];
    }
  }

  // 3) Järjestä ilman peräkkäisiä duplikaatteja.
  return arrangeNoAdjacent(selected, rng);
}

/** Laskee valmiin kierroksen tuloksen vastauksista. */
export function finalizeRound(lokero: Lokero, answers: readonly AnsweredQuestion[]): RoundResult {
  const correctCount = answers.filter((a) => a.correct).length;
  const score = answers.reduce((sum, a) => sum + a.pointsEarned, 0);
  const maxStreak = answers.reduce((m, a) => Math.max(m, a.streakAfter), 0);
  return {
    lokero,
    answers: [...answers],
    correctCount,
    score,
    stars: starsForCorrect(correctCount),
    maxStreak,
    success: isSuccessfulRound(correctCount),
  };
}
