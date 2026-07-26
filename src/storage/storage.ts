// localStorage-tallennus: yksi versioitu möykky (ks. ADR 0002).
// Puolustava lataus: rikkinäinen/tuntematon data → tyhjä tila, ei kaatumista.
// v1 → v2: eteneminen jaettiin näkökulmittain (ks. ADR 0006). Vanha `ageGroups`
// on pelaaja-näkökulman edistymä — se migratoidaan, ei heitetä pois.

import { createEmptySave } from '../domain/progression';
import type { SaveData, Settings } from '../domain/types';

const STORAGE_KEY = 'pesispahkina.save.v1';

/** v1- ja v2-möykyille yhteiset kentät. */
function hasCommonFields(v: Record<string, unknown>): boolean {
  return (
    typeof v.settings === 'object' &&
    v.settings !== null &&
    typeof v.totalPoints === 'number' &&
    typeof v.roundsPlayed === 'number' &&
    Array.isArray(v.achievements) &&
    typeof v.questionResults === 'object' &&
    v.questionResults !== null
  );
}

function isValidSaveV2(value: unknown): value is SaveData {
  if (typeof value !== 'object' || value === null) return false;
  const v = value as Record<string, unknown>;
  if (v.schemaVersion !== 2 || !hasCommonFields(v)) return false;
  const p = v.progress;
  if (typeof p !== 'object' || p === null) return false;
  const prog = p as Record<string, unknown>;
  return (
    typeof prog.pelaaja === 'object' &&
    prog.pelaaja !== null &&
    typeof prog.tuomari === 'object' &&
    prog.tuomari !== null
  );
}

interface SaveV1Shape {
  settings: SaveData['settings'];
  totalPoints: number;
  roundsPlayed: number;
  achievements: string[];
  ageGroups: SaveData['progress']['pelaaja'];
  questionResults: SaveData['questionResults'];
}

function isValidSaveV1(value: unknown): value is SaveV1Shape {
  if (typeof value !== 'object' || value === null) return false;
  const v = value as Record<string, unknown>;
  return (
    v.schemaVersion === 1 &&
    hasCommonFields(v) &&
    typeof v.ageGroups === 'object' &&
    v.ageGroups !== null
  );
}

/**
 * v1 → v2: koko aiempi edistymä on pelaaja-näkökulman edistymää.
 * Pisteet, kierrosmäärä, saavutukset ja kysymyshistoria säilyvät sellaisenaan.
 */
export function migrateV1toV2(old: SaveV1Shape): SaveData {
  return {
    schemaVersion: 2,
    settings: { ...old.settings },
    totalPoints: old.totalPoints,
    roundsPlayed: old.roundsPlayed,
    achievements: [...old.achievements],
    progress: { pelaaja: old.ageGroups, tuomari: {} },
    questionResults: { ...old.questionResults },
  };
}

export function loadSave(): SaveData {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return createEmptySave();
    const parsed = JSON.parse(raw);
    if (isValidSaveV2(parsed)) return parsed;
    if (isValidSaveV1(parsed)) {
      const migrated = migrateV1toV2(parsed);
      persistSave(migrated);
      return migrated;
    }
    return createEmptySave();
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
