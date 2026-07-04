// Eteneminen ja avautuminen. Streak on per (ikäluokka × vaikeustaso):
// kaksi peräkkäistä onnistunutta kierrosta avaa seuraavan tason (ks. ADR 0002).

import { AVAUTUMISEEN_TARVITAAN, VAIKEUSTASOT } from './config';
import type {
  AgeGroupState,
  Ikaluokka,
  RoundResult,
  SaveData,
  Settings,
  TierState,
  Vaikeustaso,
} from './types';

export const DEFAULT_SETTINGS: Settings = {
  soundEnabled: true,
  animationsEnabled: true,
};

export function createEmptySave(): SaveData {
  return {
    schemaVersion: 1,
    settings: { ...DEFAULT_SETTINGS },
    totalPoints: 0,
    roundsPlayed: 0,
    achievements: [],
    ageGroups: {},
    questionResults: {},
  };
}

function emptyTier(unlocked: boolean): TierState {
  return { unlocked, streak: 0, best: null };
}

/** Uusi ikäluokka: aloittelija auki, muut lukossa. */
export function createAgeGroupState(): AgeGroupState {
  return {
    tiers: {
      aloittelija: emptyTier(true),
      harjoittelija: emptyTier(false),
      osaaja: emptyTier(false),
      mestari: emptyTier(false),
    },
  };
}

export function nextTier(tier: Vaikeustaso): Vaikeustaso | null {
  const i = VAIKEUSTASOT.indexOf(tier);
  return i >= 0 && i < VAIKEUSTASOT.length - 1 ? VAIKEUSTASOT[i + 1] : null;
}

/** Korkein avattu vaikeustaso — tänne "Jatka" vie. */
export function highestUnlockedTier(ageGroup: AgeGroupState): Vaikeustaso {
  let highest: Vaikeustaso = 'aloittelija';
  for (const t of VAIKEUSTASOT) {
    if (ageGroup.tiers[t].unlocked) highest = t;
  }
  return highest;
}

/** Palauttaa uuden save-tilan, jossa ikäluokka on varmasti alustettu. */
export function ensureAgeGroup(save: SaveData, ik: Ikaluokka): SaveData {
  if (save.ageGroups[ik]) return save;
  return {
    ...save,
    ageGroups: { ...save.ageGroups, [ik]: createAgeGroupState() },
  };
}

export interface ApplyRoundOutcome {
  save: SaveData;
  /** Tässä kierroksessa avautunut uusi vaikeustaso, jos avautui. */
  newlyUnlocked: Vaikeustaso | null;
}

function betterBest(
  prev: TierState['best'],
  next: { stars: number; score: number },
): TierState['best'] {
  if (!prev) return next;
  if (next.stars > prev.stars) return next;
  if (next.stars === prev.stars && next.score > prev.score) return next;
  return prev;
}

/**
 * Soveltaa valmiin kierroksen tuloksen save-tilaan: pisteet, kierroslaskuri,
 * kysymyshistoria, tason streak/best ja mahdollinen seuraavan tason avautuminen.
 */
export function applyRoundResult(save: SaveData, result: RoundResult): ApplyRoundOutcome {
  const { ikaluokka, vaikeustaso } = result.lokero;
  const withGroup = ensureAgeGroup(save, ikaluokka);
  const draft: SaveData = structuredClone(withGroup);

  draft.totalPoints += result.score;
  draft.roundsPlayed += 1;

  // Kysymyshistoria: viimeisin tulos voittaa (toistot huomioiden).
  for (const a of result.answers) {
    draft.questionResults[a.question.id] = a.correct ? 'right' : 'wrong';
  }

  const group = draft.ageGroups[ikaluokka]!;
  const tier = group.tiers[vaikeustaso];
  tier.streak = result.success ? tier.streak + 1 : 0;
  tier.best = betterBest(tier.best, { stars: result.stars, score: result.score });

  let newlyUnlocked: Vaikeustaso | null = null;
  if (tier.streak >= AVAUTUMISEEN_TARVITAAN) {
    const next = nextTier(vaikeustaso);
    if (next && !group.tiers[next].unlocked) {
      group.tiers[next].unlocked = true;
      newlyUnlocked = next;
    }
  }

  return { save: draft, newlyUnlocked };
}
