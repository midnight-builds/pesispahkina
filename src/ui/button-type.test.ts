import { describe, it, expect } from 'vitest';

// Vartioi: <button> ilman type-attribuuttia on submit oletuksena, mikä voi
// lähettää lomakkeen vahingossa. Tarkistetaan lähdekoodista (ei DOM:ia).
const screenSources = import.meta.glob('./*.tsx', {
  query: '?raw',
  import: 'default',
  eager: true,
}) as Record<string, string>;

describe('button type -attribuutti', () => {
  it('jokaisella <button>-elementillä on eksplisiittinen type', () => {
    const offenders: string[] = [];
    for (const [file, src] of Object.entries(screenSources)) {
      const openTags = src.match(/<button\b[^>]*>/gs) ?? [];
      for (const tag of openTags) {
        if (!/\btype\s*=/.test(tag)) {
          offenders.push(`${file}: ${tag.replace(/\s+/g, ' ')}`);
        }
      }
    }
    expect(offenders).toEqual([]);
  });

  it('löysi ainakin yhden tarkistettavan tiedoston', () => {
    expect(Object.keys(screenSources).length).toBeGreaterThan(0);
  });
});
