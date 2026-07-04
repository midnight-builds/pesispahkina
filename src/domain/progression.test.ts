import { describe, it, expect } from 'vitest';
import {
  applyRoundResult,
  createAgeGroupState,
  createEmptySave,
  highestUnlockedTier,
  nextTier,
} from './progression';
import type { AnsweredQuestion, RoundResult, Vaikeustaso } from './types';

function roundResult(overrides: Partial<RoundResult> = {}): RoundResult {
  const answers: AnsweredQuestion[] = overrides.answers ?? [];
  return {
    lokero: { ikaluokka: 'G', vaikeustaso: 'aloittelija' },
    answers,
    correctCount: 9,
    score: 100,
    stars: 2,
    maxStreak: 4,
    success: true,
    ...overrides,
  };
}

describe('createAgeGroupState', () => {
  it('avaa aloittelijan, muut lukossa', () => {
    const g = createAgeGroupState();
    expect(g.tiers.aloittelija.unlocked).toBe(true);
    expect(g.tiers.harjoittelija.unlocked).toBe(false);
    expect(g.tiers.mestari.unlocked).toBe(false);
  });
});

describe('nextTier', () => {
  it('palauttaa seuraavan tason tai null', () => {
    expect(nextTier('aloittelija')).toBe('harjoittelija');
    expect(nextTier('mestari')).toBeNull();
  });
});

describe('applyRoundResult', () => {
  it('kasvattaa pisteitä, kierroslaskuria ja streakia onnistuneesta', () => {
    const { save, newlyUnlocked } = applyRoundResult(createEmptySave(), roundResult());
    expect(save.totalPoints).toBe(100);
    expect(save.roundsPlayed).toBe(1);
    expect(save.ageGroups.G!.tiers.aloittelija.streak).toBe(1);
    expect(newlyUnlocked).toBeNull();
  });

  it('avaa seuraavan tason kahdesta peräkkäisestä onnistumisesta', () => {
    let save = createEmptySave();
    save = applyRoundResult(save, roundResult()).save;
    const out = applyRoundResult(save, roundResult());
    expect(out.newlyUnlocked).toBe<Vaikeustaso>('harjoittelija');
    expect(out.save.ageGroups.G!.tiers.harjoittelija.unlocked).toBe(true);
    expect(highestUnlockedTier(out.save.ageGroups.G!)).toBe('harjoittelija');
  });

  it('epäonnistunut kierros nollaa streakin', () => {
    let save = createEmptySave();
    save = applyRoundResult(save, roundResult()).save;
    save = applyRoundResult(save, roundResult({ success: false, correctCount: 4, stars: 0, score: 40 })).save;
    expect(save.ageGroups.G!.tiers.aloittelija.streak).toBe(0);
    expect(save.ageGroups.G!.tiers.harjoittelija.unlocked).toBe(false);
  });

  it('tallentaa kysymysten viimeisimmän tuloksen', () => {
    const answers: AnsweredQuestion[] = [
      {
        question: {
          id: 'q1',
          concept: 'c',
          ikaluokat: ['G'],
          vaikeustaso: 'aloittelija',
          aihealue: 'perusteet',
          kysymys: 'k?',
          vaihtoehdot: ['a', 'b'],
          oikeaIndeksi: 0,
          selitys: 's',
        },
        chosenIndex: 1,
        correct: false,
        streakAfter: 0,
        pointsEarned: 0,
      },
    ];
    const { save } = applyRoundResult(createEmptySave(), roundResult({ answers }));
    expect(save.questionResults.q1).toBe('wrong');
  });

  it('parantaa parhaan tuloksen vain paremmalla', () => {
    let save = createEmptySave();
    save = applyRoundResult(save, roundResult({ stars: 3, score: 130 })).save;
    save = applyRoundResult(save, roundResult({ stars: 2, score: 200 })).save;
    expect(save.ageGroups.G!.tiers.aloittelija.best).toEqual({ stars: 3, score: 130 });
  });
});
