// Migraation ainoa hyväksymiskriteeri: kenenkään aiempi edistymä ei nollaudu
// näkökulma-akselin myötä (ks. ADR 0006 ja ADR 0002).

import { describe, it, expect } from 'vitest';
import { migrateV1toV2 } from './storage';

const v1 = {
  settings: { soundEnabled: false, animationsEnabled: true },
  totalPoints: 340,
  roundsPlayed: 12,
  achievements: ['ensimmainen-kierros', 'putkisankari'],
  ageGroups: {
    G: {
      tiers: {
        aloittelija: { unlocked: true, streak: 2, best: { stars: 3, score: 130 } },
        harjoittelija: { unlocked: true, streak: 0, best: null },
        osaaja: { unlocked: false, streak: 0, best: null },
        mestari: { unlocked: false, streak: 0, best: null },
      },
    },
  },
  questionResults: { 'perusteet-tuomari': 'wrong' as const },
};

describe('save-migraatio v1 → v2', () => {
  it('siirtää vanhan edistymän pelaaja-näkökulmaan koskemattomana', () => {
    const migrated = migrateV1toV2(v1);

    expect(migrated.schemaVersion).toBe(2);
    expect(migrated.progress.pelaaja).toEqual(v1.ageGroups);
    expect(migrated.progress.pelaaja.G!.tiers.aloittelija.best).toEqual({ stars: 3, score: 130 });
    expect(migrated.progress.pelaaja.G!.tiers.harjoittelija.unlocked).toBe(true);
  });

  it('aloittaa tuomari-näkökulman tyhjänä', () => {
    expect(migrateV1toV2(v1).progress.tuomari).toEqual({});
  });

  it('säilyttää pisteet, kierrokset, saavutukset, asetukset ja kysymyshistorian', () => {
    const migrated = migrateV1toV2(v1);

    expect(migrated.totalPoints).toBe(340);
    expect(migrated.roundsPlayed).toBe(12);
    expect(migrated.achievements).toEqual(['ensimmainen-kierros', 'putkisankari']);
    expect(migrated.settings).toEqual({ soundEnabled: false, animationsEnabled: true });
    expect(migrated.questionResults).toEqual({ 'perusteet-tuomari': 'wrong' });
  });
});
