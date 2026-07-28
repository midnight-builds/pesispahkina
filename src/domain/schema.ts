// Kysymyssisällön validointi (Zod) + samankaltaisuuden tarkistukset.
// Ks. ADR 0004. Enumit johdetaan config.ts:stä → yksi totuuden lähde.

import { z } from 'zod';
import { AIHEALUEET, IKALUOKAT, NAKOKULMAT, VAIKEUSTASOT } from './config';
import type { Aihealue, Ikaluokka, Nakokulma, Question, Vaikeustaso } from './types';

const nakokulmaValues = NAKOKULMAT.map((n) => n.koodi) as [Nakokulma, ...Nakokulma[]];
const ikaluokkaValues = IKALUOKAT.map((i) => i.koodi) as [Ikaluokka, ...Ikaluokka[]];
const vaikeustasoValues = VAIKEUSTASOT as [Vaikeustaso, ...Vaikeustaso[]];
const aihealueValues = AIHEALUEET as [Aihealue, ...Aihealue[]];

const lahdeSchema = z.object({
  dokumentti: z.string().min(1),
  kohta: z.string().min(1).optional(),
  url: z.string().url().optional(),
});

const questionSchema = z
  .object({
    id: z.string().regex(/^[a-z0-9-]+$/, 'id: vain pienet kirjaimet, numerot ja väliviivat'),
    concept: z.string().min(1),
    nakokulma: z.enum(nakokulmaValues),
    ikaluokat: z.array(z.enum(ikaluokkaValues)).min(1),
    vaikeustaso: z.enum(vaikeustasoValues),
    aihealue: z.enum(aihealueValues),
    kysymys: z.string().min(5),
    vaihtoehdot: z.array(z.string().min(1)).min(2).max(4),
    oikeaIndeksi: z.number().int().min(0),
    selitys: z.string().min(5),
    kuva: z.string().optional(),
    lahde: lahdeSchema.optional(),
    tarkistettu: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'tarkistettu: muotoa VVVV-KK-PP').optional(),
  })
  .refine((q) => q.oikeaIndeksi < q.vaihtoehdot.length, {
    message: 'oikeaIndeksi viittaa vaihtoehtojen ulkopuolelle',
    path: ['oikeaIndeksi'],
  });

const questionsSchema = z.array(questionSchema);

/** Normalisoi kysymystekstin lähes-duplikaattien vertailua varten. */
function normalizeText(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[^\p{L}\p{N}\s]/gu, '')
    .replace(/\s+/g, ' ')
    .trim();
}

interface ContentIssue {
  kind: 'duplicate-id' | 'near-duplicate-text';
  message: string;
}

/** Kovat virheet: duplikaatti-id:t ja lähes identtiset kysymystekstit. */
export function findContentIssues(questions: readonly Question[]): ContentIssue[] {
  const issues: ContentIssue[] = [];

  const seenIds = new Set<string>();
  for (const q of questions) {
    if (seenIds.has(q.id)) {
      issues.push({ kind: 'duplicate-id', message: `Duplikaatti-id: ${q.id}` });
    }
    seenIds.add(q.id);
  }

  const byText = new Map<string, string[]>();
  for (const q of questions) {
    const key = normalizeText(q.kysymys);
    const ids = byText.get(key) ?? [];
    ids.push(q.id);
    byText.set(key, ids);
  }
  for (const [, ids] of byText) {
    if (ids.length > 1) {
      issues.push({
        kind: 'near-duplicate-text',
        message: `Lähes identtinen kysymysteksti: ${ids.join(', ')}`,
      });
    }
  }

  return issues;
}

/** Enintään montako sanamuotovarianttia samasta conceptista sallitaan per lokero. */
const CONCEPT_VARIANTTI_RAJA = 3;

/**
 * Osuus, jonka ylittävä yksittäinen aihealue näkökulman sisällä kertoo, ettei
 * aihealue enää erottele sisältöä. Syitä on kaksi ja ne vaativat eri korjauksen:
 * joko sisältö on luokiteltu väärin (ks. ADR 0006 — aihealue ei saa olla
 * näkökulman kopio) tai näkökulman sisältö itsessään painottuu yhteen aiheeseen,
 * jolloin korjaus on lisätä kysymyksiä muista aiheista.
 */
const AIHEALUE_KASAUTUMISRAJA = 0.5;

/**
 * ADR 0006: `tuomarointi` merkitsee sisältöä, joka koskee itse tuomaristoa, joten
 * se esiintyy vain tuomari-näkökulmassa. Muut aihealueet odotetaan molemmilta.
 */
function odotetutAihealueet(nakokulma: Nakokulma): Aihealue[] {
  if (nakokulma === 'tuomari') return AIHEALUEET;
  return AIHEALUEET.filter((a) => a !== 'tuomarointi');
}

interface ConceptWarning {
  message: string;
}

/**
 * Pehmeä raportti: varoittaa yliedustetusta conceptista lokerossa, liian
 * harvasta conceptikattavuudesta sekä vinoutuneesta aihealuejakaumasta.
 * EI kaada — antaa agentille suunnan.
 */
export function conceptReport(questions: readonly Question[]): ConceptWarning[] {
  const warnings: ConceptWarning[] = [];
  // avain: "nakokulma|ikaluokka|vaikeustaso" -> concept -> count
  const byLokero = new Map<string, Map<string, number>>();
  for (const q of questions) {
    for (const ik of q.ikaluokat) {
      const key = `${q.nakokulma}|${ik}|${q.vaikeustaso}`;
      const concepts = byLokero.get(key) ?? new Map<string, number>();
      concepts.set(q.concept, (concepts.get(q.concept) ?? 0) + 1);
      byLokero.set(key, concepts);
    }
  }
  for (const [lokero, concepts] of byLokero) {
    for (const [concept, count] of concepts) {
      if (count > CONCEPT_VARIANTTI_RAJA) {
        warnings.push({
          message: `Lokero ${lokero}: concept "${concept}" ${count} varianttia (raja ${CONCEPT_VARIANTTI_RAJA}).`,
        });
      }
    }
    if (concepts.size < 2) {
      warnings.push({
        message: `Lokero ${lokero}: vain ${concepts.size} concept — kattavuus kapea.`,
      });
    }
  }

  // Aihealuejakauma per näkökulma. Lokeroraportti ei näe tätä, koska se
  // ryhmittelee jo näkökulmalla: jos aihealue toistaa näkökulman, vinouma
  // näkyy vain tässä.
  const byNakokulma = new Map<Nakokulma, Map<Aihealue, number>>();
  for (const q of questions) {
    const aiheet = byNakokulma.get(q.nakokulma) ?? new Map<Aihealue, number>();
    aiheet.set(q.aihealue, (aiheet.get(q.aihealue) ?? 0) + 1);
    byNakokulma.set(q.nakokulma, aiheet);
  }
  for (const [nakokulma, aiheet] of byNakokulma) {
    const yhteensa = [...aiheet.values()].reduce((a, b) => a + b, 0);
    for (const [aihealue, count] of aiheet) {
      if (count / yhteensa > AIHEALUE_KASAUTUMISRAJA) {
        const osuus = Math.round((100 * count) / yhteensa);
        warnings.push({
          message: `Näkökulma ${nakokulma}: aihealue "${aihealue}" ${count}/${yhteensa} kysymyksestä (${osuus} %) — aihealue ei erottele sisältöä.`,
        });
      }
    }
    const puuttuvat = odotetutAihealueet(nakokulma).filter((a) => !aiheet.has(a));
    if (puuttuvat.length > 0) {
      warnings.push({
        message: `Näkökulma ${nakokulma}: ei yhtään kysymystä aihealueista ${puuttuvat.join(', ')}.`,
      });
    }
  }
  return warnings;
}

/** Parsii ja validoi kysymysdatan. Heittää jos skeema tai kovat säännöt pettävät. */
export function validateQuestions(raw: unknown): Question[] {
  const parsed = questionsSchema.parse(raw) as Question[];
  const issues = findContentIssues(parsed);
  if (issues.length > 0) {
    throw new Error('Sisältövirheitä:\n' + issues.map((i) => '  - ' + i.message).join('\n'));
  }
  return parsed;
}
