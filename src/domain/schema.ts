// Kysymyssisällön validointi (Zod) + samankaltaisuuden tarkistukset.
// Ks. ADR 0004. Enumit johdetaan config.ts:stä → yksi totuuden lähde.

import { z } from 'zod';
import { AIHEALUEET, IKALUOKAT, VAIKEUSTASOT } from './config';
import type { Aihealue, Ikaluokka, Question, Vaikeustaso } from './types';

const ikaluokkaValues = IKALUOKAT.map((i) => i.koodi) as [Ikaluokka, ...Ikaluokka[]];
const vaikeustasoValues = VAIKEUSTASOT as [Vaikeustaso, ...Vaikeustaso[]];
const aihealueValues = AIHEALUEET as [Aihealue, ...Aihealue[]];

const questionSchema = z
  .object({
    id: z.string().regex(/^[a-z0-9-]+$/, 'id: vain pienet kirjaimet, numerot ja väliviivat'),
    concept: z.string().min(1),
    ikaluokat: z.array(z.enum(ikaluokkaValues)).min(1),
    vaikeustaso: z.enum(vaikeustasoValues),
    aihealue: z.enum(aihealueValues),
    kysymys: z.string().min(5),
    vaihtoehdot: z.array(z.string().min(1)).min(2).max(4),
    oikeaIndeksi: z.number().int().min(0),
    selitys: z.string().min(5),
    kuva: z.string().optional(),
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

interface ConceptWarning {
  message: string;
}

/**
 * Pehmeä raportti: varoittaa yliedustetusta conceptista lokerossa tai liian
 * harvasta conceptikattavuudesta. EI kaada — antaa agentille suunnan.
 */
export function conceptReport(questions: readonly Question[]): ConceptWarning[] {
  const warnings: ConceptWarning[] = [];
  // avain: "ikaluokka|vaikeustaso" -> concept -> count
  const byLokero = new Map<string, Map<string, number>>();
  for (const q of questions) {
    for (const ik of q.ikaluokat) {
      const key = `${ik}|${q.vaikeustaso}`;
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
