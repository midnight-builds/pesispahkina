// localStorage-tallennus: yksi versioitu möykky (ks. ADR 0002).
// Puolustava lataus: rikkinäinen/tuntematon data → tyhjä tila, ei kaatumista.

import { createEmptySave } from '../domain/progression';
import type { SaveData, Settings } from '../domain/types';

export const STORAGE_KEY = 'pesispahkina.save.v1';

function isValidSave(value: unknown): value is SaveData {
  if (typeof value !== 'object' || value === null) return false;
  const v = value as Record<string, unknown>;
  return (
    v.schemaVersion === 1 &&
    typeof v.settings === 'object' &&
    v.settings !== null &&
    typeof v.totalPoints === 'number' &&
    typeof v.roundsPlayed === 'number' &&
    Array.isArray(v.achievements) &&
    typeof v.ageGroups === 'object' &&
    v.ageGroups !== null &&
    typeof v.questionResults === 'object' &&
    v.questionResults !== null
  );
}

export function loadSave(): SaveData {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return createEmptySave();
    const parsed = JSON.parse(raw);
    if (!isValidSave(parsed)) return createEmptySave();
    return parsed;
  } catch {
    return createEmptySave();
  }
}

export function persistSave(save: SaveData): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(save));
  } catch {
    // Tallennus voi epäonnistua (esim. yksityistila) — peli jatkaa muistissa.
  }
}

/** Nollaa edistymän mutta SÄILYTTÄÄ asetukset (ks. grill-päätös). */
export function resetProgress(settings: Settings): SaveData {
  const fresh = createEmptySave();
  fresh.settings = { ...settings };
  persistSave(fresh);
  return fresh;
}
