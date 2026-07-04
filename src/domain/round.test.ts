import { describe, it, expect } from 'vitest';
import { buildRound, questionsForLokero, finalizeRound } from './round';
import { seededRng } from './testutil';
import type { AnsweredQuestion, Question, Tulos } from './types';

function q(id: string, extra: Partial<Question> = {}): Question {
  return {
    id,
    concept: id,
    ikaluokat: ['G'],
    vaikeustaso: 'aloittelija',
    aihealue: 'perusteet',
    kysymys: `Kysymys ${id}?`,
    vaihtoehdot: ['a', 'b'],
    oikeaIndeksi: 0,
    selitys: 'Selitys.',
    ...extra,
  };
}

const bigPool: Question[] = Array.from({ length: 15 }, (_, i) => q(`k${i}`));

function noAdjacentDuplicates(ids: string[]): boolean {
  return ids.every((id, i) => i === 0 || id !== ids[i - 1]);
}

describe('questionsForLokero', () => {
  it('suodattaa ikäluokan ja vaikeustason mukaan', () => {
    const pool = [
      q('a', { ikaluokat: ['G'], vaikeustaso: 'aloittelija' }),
      q('b', { ikaluokat: ['D'], vaikeustaso: 'aloittelija' }),
      q('c', { ikaluokat: ['G'], vaikeustaso: 'harjoittelija' }),
    ];
    const res = questionsForLokero(pool, { ikaluokka: 'G', vaikeustaso: 'aloittelija' });
    expect(res.map((x) => x.id)).toEqual(['a']);
  });
});

describe('buildRound', () => {
  it('palauttaa täyden kierroksen ilman peräkkäisiä duplikaatteja', () => {
    const round = buildRound(bigPool, {}, seededRng(1));
    expect(round).toHaveLength(10);
    expect(noAdjacentDuplicates(round.map((r) => r.id))).toBe(true);
  });

  it('sallii toiston pienessä poolissa muttei kahta samaa peräkkäin', () => {
    const smallPool = [q('x'), q('y')];
    const round = buildRound(smallPool, {}, seededRng(2));
    expect(round).toHaveLength(10);
    expect(noAdjacentDuplicates(round.map((r) => r.id))).toBe(true);
  });

  it('ujuttaa kerrattavat (viimeisin väärin) mukaan', () => {
    const results: Record<string, Tulos> = { k3: 'wrong', k7: 'wrong' };
    const round = buildRound(bigPool, results, seededRng(3));
    const ids = new Set(round.map((r) => r.id));
    expect(ids.has('k3')).toBe(true);
    expect(ids.has('k7')).toBe(true);
  });

  it('palauttaa tyhjän jos pooli on tyhjä', () => {
    expect(buildRound([], {}, seededRng(4))).toEqual([]);
  });
});

describe('finalizeRound', () => {
  it('laskee oikeiden määrän, pisteet, tähdet ja putken', () => {
    const answers: AnsweredQuestion[] = [
      { question: q('a'), chosenIndex: 0, correct: true, streakAfter: 1, pointsEarned: 10 },
      { question: q('b'), chosenIndex: 1, correct: false, streakAfter: 0, pointsEarned: 0 },
      { question: q('c'), chosenIndex: 0, correct: true, streakAfter: 1, pointsEarned: 10 },
    ];
    const res = finalizeRound({ ikaluokka: 'G', vaikeustaso: 'aloittelija' }, answers);
    expect(res.correctCount).toBe(2);
    expect(res.score).toBe(20);
    expect(res.maxStreak).toBe(1);
    expect(res.success).toBe(false);
  });
});
