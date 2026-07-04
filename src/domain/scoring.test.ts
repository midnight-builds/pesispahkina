import { describe, it, expect } from 'vitest';
import { scoreAnswer, starsForCorrect, isSuccessfulRound } from './scoring';

describe('scoreAnswer', () => {
  it('antaa 10 pistettä oikeasta ilman bonusta putken alussa', () => {
    expect(scoreAnswer(0, true)).toEqual({ streakAfter: 1, points: 10 });
    expect(scoreAnswer(1, true)).toEqual({ streakAfter: 2, points: 10 });
  });

  it('antaa putkibonuksen kolmannesta peräkkäisestä oikeasta', () => {
    expect(scoreAnswer(2, true)).toEqual({ streakAfter: 3, points: 20 });
    expect(scoreAnswer(3, true)).toEqual({ streakAfter: 4, points: 20 });
  });

  it('väärä nollaa putken eikä anna pisteitä', () => {
    expect(scoreAnswer(5, false)).toEqual({ streakAfter: 0, points: 0 });
  });
});

describe('starsForCorrect', () => {
  it('mappaa oikeiden määrän tähtiin', () => {
    expect(starsForCorrect(10)).toBe(3);
    expect(starsForCorrect(9)).toBe(2);
    expect(starsForCorrect(8)).toBe(2);
    expect(starsForCorrect(7)).toBe(1);
    expect(starsForCorrect(5)).toBe(1);
    expect(starsForCorrect(4)).toBe(0);
    expect(starsForCorrect(0)).toBe(0);
  });
});

describe('isSuccessfulRound', () => {
  it('onnistuu kun oikeita vähintään 8', () => {
    expect(isSuccessfulRound(8)).toBe(true);
    expect(isSuccessfulRound(7)).toBe(false);
  });
});
