import { describe, it, expect } from 'vitest';
import { conceptReport } from './schema';
import type { Aihealue, Nakokulma, Question } from './types';

function q(id: string, aihealue: Aihealue, nakokulma: Nakokulma = 'tuomari'): Question {
  return {
    id,
    concept: id,
    nakokulma,
    ikaluokat: ['G'],
    vaikeustaso: 'aloittelija',
    aihealue,
    kysymys: `Kysymys ${id}?`,
    vaihtoehdot: ['a', 'b'],
    oikeaIndeksi: 0,
    selitys: 'Selitys.',
  };
}

/** Kattaa kaikki muut aihealueet paitsi tuomaroinnin — pitää aukkovaroituksen hiljaisena. */
function taysiKattavuus(nakokulma: Nakokulma, etuliite: string): Question[] {
  const aiheet: Aihealue[] = [
    'perusteet',
    'kentta',
    'roolit',
    'lyominen',
    'eteneminen',
    'ottelu',
  ];
  return aiheet.map((a) => q(`${etuliite}-${a}`, a, nakokulma));
}

function messages(questions: Question[]): string[] {
  return conceptReport(questions).map((w) => w.message);
}

describe('conceptReport — aihealuejakauma', () => {
  it('varoittaa kun yksi aihealue kattaa yli puolet näkökulman kysymyksistä', () => {
    const questions = [
      ...taysiKattavuus('tuomari', 'a'),
      ...Array.from({ length: 20 }, (_, i) => q(`tuomarointi-${i}`, 'tuomarointi')),
    ];
    const kasautuma = messages(questions).filter((m) => m.includes('ei erottele sisältöä'));
    expect(kasautuma).toHaveLength(1);
    expect(kasautuma[0]).toContain('tuomarointi');
    expect(kasautuma[0]).toContain('20/26');
  });

  it('ei varoita kasautumisesta kun jakauma on tasainen', () => {
    const questions = taysiKattavuus('tuomari', 'a');
    expect(messages(questions).filter((m) => m.includes('ei erottele sisältöä'))).toEqual([]);
  });

  it('raportoi aihealueet, joista näkökulmalla ei ole yhtään kysymystä', () => {
    const questions = [q('yksi', 'perusteet'), q('kaksi', 'kentta')];
    const aukot = messages(questions).filter((m) => m.includes('ei yhtään kysymystä'));
    expect(aukot).toHaveLength(1);
    expect(aukot[0]).toContain('roolit');
    expect(aukot[0]).toContain('tuomarointi');
  });

  it('ei odota tuomarointi-aihealuetta pelaaja-näkökulmalta (ADR 0006)', () => {
    const questions = taysiKattavuus('pelaaja', 'p');
    expect(messages(questions).filter((m) => m.includes('ei yhtään kysymystä'))).toEqual([]);
  });

  it('laskee näkökulmat erikseen', () => {
    const questions = [
      ...taysiKattavuus('pelaaja', 'p'),
      ...taysiKattavuus('tuomari', 't'),
      ...Array.from({ length: 20 }, (_, i) => q(`tuomarointi-${i}`, 'tuomarointi')),
    ];
    const kasautuma = messages(questions).filter((m) => m.includes('ei erottele sisältöä'));
    expect(kasautuma).toHaveLength(1);
    expect(kasautuma[0]).toContain('Näkökulma tuomari');
  });
});
