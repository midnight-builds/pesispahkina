// Saavutukset (v1: 6 kpl, kertaluontoisia). Lisääminen: uusi rivi ACHIEVEMENTS-
// listaan + ehto evaluateAchievements-funktioon (ks. docs/agents/adding-content.md).

import type { RoundResult, SaveData, Vaikeustaso } from './types';

export interface AchievementDef {
  id: string;
  nimi: string;
  kuvaus: string;
  emoji: string;
}

export const ACHIEVEMENTS: AchievementDef[] = [
  { id: 'ensimmainen-kierros', nimi: 'Ensimmäinen kierros', kuvaus: 'Pelasit ensimmäisen kierroksen loppuun.', emoji: '🎉' },
  { id: 'taydellinen-kierros', nimi: 'Täydellinen kierros', kuvaus: 'Kaikki 10 oikein yhdellä kierroksella.', emoji: '⭐' },
  { id: 'putkisankari', nimi: 'Putkisankari', kuvaus: 'Viisi oikeaa peräkkäin.', emoji: '🔥' },
  { id: 'uusi-taso', nimi: 'Uusi taso auki', kuvaus: 'Avasit uuden vaikeustason.', emoji: '🔓' },
  { id: 'sinnikas', nimi: 'Sinnikäs', kuvaus: 'Pelasit kymmenen kierrosta.', emoji: '💪' },
  { id: 'ikaluokan-mestari', nimi: 'Ikäluokan mestari', kuvaus: 'Avasit ikäluokan mestaritason.', emoji: '🏆' },
];

export const ACHIEVEMENT_BY_ID: Record<string, AchievementDef> = Object.fromEntries(
  ACHIEVEMENTS.map((a) => [a.id, a]),
);

function anyMestariUnlocked(save: SaveData): boolean {
  return Object.values(save.ageGroups).some((g) => g?.tiers.mestari.unlocked);
}

/**
 * Palauttaa tällä kierroksella ANSAITUT uudet saavutus-id:t (ei jo aiemmin
 * ansaittuja). Arvioidaan tilasta kierroksen soveltamisen JÄLKEEN.
 */
export function evaluateAchievements(
  saveAfter: SaveData,
  result: RoundResult,
  newlyUnlocked: Vaikeustaso | null,
): string[] {
  const earned = new Set<string>();

  if (saveAfter.roundsPlayed >= 1) earned.add('ensimmainen-kierros');
  if (result.correctCount >= 10) earned.add('taydellinen-kierros');
  if (result.maxStreak >= 5) earned.add('putkisankari');
  if (newlyUnlocked !== null) earned.add('uusi-taso');
  if (saveAfter.roundsPlayed >= 10) earned.add('sinnikas');
  if (anyMestariUnlocked(saveAfter)) earned.add('ikaluokan-mestari');

  const already = new Set(saveAfter.achievements);
  return [...earned].filter((id) => !already.has(id));
}
