import { describe, it, expect } from 'vitest';
import { QUESTIONS } from '../data/questions';
import { IKALUOKAT, NAKOKULMAT } from './config';
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

  it('jokaisella (näkökulma × ikäluokka) -parilla on pelattava aloittelija-lokero', () => {
    for (const { koodi: nakokulma } of NAKOKULMAT) {
      for (const { koodi } of IKALUOKAT) {
        const pool = questionsForLokero(QUESTIONS, {
          nakokulma,
          ikaluokka: koodi,
          vaikeustaso: 'aloittelija',
        });
        expect(pool.length, `${nakokulma} / ${koodi} / aloittelija`).toBeGreaterThan(0);
      }
    }
  });

  it('tuomarikysymykset käyttävät sääntöjen termiä pelituomari, ei "päätuomari"', () => {
    const paatuomari = QUESTIONS.filter((q) =>
      [q.kysymys, q.selitys, ...q.vaihtoehdot].some((t) => /päätuomari/i.test(t)),
    );
    expect(paatuomari.map((q) => q.id)).toEqual([]);
  });

  // "Pelaaja palaa" on säännöissä sama ratkaisu kuin "pelaaja poltetaan" — sisä- ja
  // ulkopelin muodot samasta palosta (ks. docs/pesapallo-lahteet.md). Jos ne ovat
  // saman kysymyksen eri vaihtoehtoina, toinen niistä on merkitty vääräksi vaikka
  // se on oikea vastaus.
  it('ei tarjoa palon kahta sanamuotoa saman kysymyksen eri vaihtoehtoina', () => {
    const paloSanat = /\b(palaa|palanut|palavat|poltetaan|poltettava)\b|\bpalo\b/i;
    const paallekkaiset = QUESTIONS.filter(
      (q) => q.vaihtoehdot.filter((v) => paloSanat.test(v)).length > 1,
    );
    expect(paallekkaiset.map((q) => q.id)).toEqual([]);
  });

  it('pehmeä concept-raportti (ei kaada) — tulostaa varoitukset', () => {
    const warnings = conceptReport(QUESTIONS);
    if (warnings.length > 0) {
      console.warn('Concept-raportti:\n' + warnings.map((w) => '  - ' + w.message).join('\n'));
    }
    expect(Array.isArray(warnings)).toBe(true);
  });
});
