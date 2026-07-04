import { describe, it, expect } from 'vitest';
import { QUESTIONS } from '../data/questions';
import { IKALUOKAT } from './config';
import {
  conceptReport,
  findContentIssues,
  validateQuestions,
} from './schema';
import { questionsForLokero } from './round';

describe('kysymyssisältö', () => {
  it('läpäisee skeemavalidoinnin', () => {
    expect(() => validateQuestions(QUESTIONS)).not.toThrow();
  });

  it('ei sisällä duplikaatti-id:itä eikä lähes identtisiä kysymystekstejä', () => {
    const issues = findContentIssues(QUESTIONS);
    if (issues.length > 0) {
      console.error(issues.map((i) => i.message).join('\n'));
    }
    expect(issues).toEqual([]);
  });

  it('jokaisella ikäluokalla on pelattava aloittelija-lokero', () => {
    for (const { koodi } of IKALUOKAT) {
      const pool = questionsForLokero(QUESTIONS, { ikaluokka: koodi, vaikeustaso: 'aloittelija' });
      expect(pool.length, `Ikäluokka ${koodi} aloittelija`).toBeGreaterThan(0);
    }
  });

  it('pehmeä concept-raportti (ei kaada) — tulostaa varoitukset', () => {
    const warnings = conceptReport(QUESTIONS);
    if (warnings.length > 0) {
      console.warn('Concept-raportti:\n' + warnings.map((w) => '  - ' + w.message).join('\n'));
    }
    expect(Array.isArray(warnings)).toBe(true);
  });
});
