/**
 * Pixel-art spritet merkkiruudukkoina. Sprite = rivit + paletti, jotta se on
 * luettavissa/muokattavissa suoraan koodista (ei binäärikuvana).
 * Piirto: ks. PixelSprite ({@link ./pixel}).
 */
export interface Sprite {
  w: number;
  h: number;
  rows: string[];
  palette: Record<string, string>;
}

// Jaetut värit (sama kynä kaikissa spriteissä → yhtenäinen paletti).
const INK = '#1a0f38';
const RED = '#e23b3b';
const REDD = '#a5252b';
const WHITE = '#ffffff';
const SKIN = '#ffc79b';
const SKIND = '#e0956a';
const PANTS = '#2b3a77';
const PANTSD = '#1d2a5e';
const BAT = '#f4c542';
const GOLD = '#ffcf4a';
const GOLDD = '#d99f24';

/** Lyöjä (pesäpallon lyöjä maila olalla). */
export const BATTER: Sprite = {
  w: 16,
  h: 18,
  palette: { O: INK, C: RED, c: REDD, K: SKIN, k: SKIND, W: WHITE, P: PANTS, p: PANTSD, B: BAT, H: INK },
  rows: [
    '................',
    '.....OOOO.......B',
    '....OCCCCO.....BB',
    '....CccccC....BB.',
    '...OKKKKKO...BB..',
    '...OKkKKkO..BB...',
    '...OKKKKKO.BB....',
    '....OKKKO.BB.....',
    '.....OOO.BB......',
    '...OWWWWBB.......',
    '..OWWWWWWO.......',
    '..OWWWWWWO.......',
    '..OWWWWWWO.......',
    '...OPPPPO........',
    '...OPPPPO........',
    '...PP..PP........',
    '..OPP..PPO.......',
    '..HHH..HHH.......',
  ],
};

function circleField(size: number, fn: (dx: number, dy: number, r: number) => string): string[] {
  const rows: string[] = [];
  const c = (size - 1) / 2;
  const r = size / 2;
  for (let y = 0; y < size; y++) {
    let row = '';
    for (let x = 0; x < size; x++) {
      row += fn(x - c, y - c, r);
    }
    rows.push(row);
  }
  return rows;
}

/** Pesäpallo (valkoinen pallo, punaiset saumat) — generoitu ympyrä. */
export const BALL: Sprite = (() => {
  const size = 13;
  const rows = circleField(size, (dx, dy, r) => {
    const d = Math.sqrt(dx * dx + dy * dy);
    if (d > r) return '.';
    if (d > r - 1) return 'O'; // ääriviiva
    // saumat: kaksi kaarta pallon reunoja myötäillen (baseball-tikkaus)
    const ring = Math.abs(d - (r - 2.1)) < 0.85;
    const seam = ring && Math.abs(dx) > 1.5 && Math.abs(dy) < r - 2.2;
    if (seam) return 'R';
    return 'W';
  });
  return { w: size, h: size, rows, palette: { O: INK, W: WHITE, R: RED } };
})();

/** Tähti (arvostelutähdet). */
export function starSprite(on: boolean): Sprite {
  const fill = on ? GOLD : '#3a2f66';
  const edge = on ? GOLDD : INK;
  return {
    w: 13,
    h: 13,
    palette: { O: edge, S: fill },
    rows: [
      '......O......',
      '......O......',
      '.....OSO.....',
      '.....OSO.....',
      'OOOOOSSSOOOOO',
      '.OSSSSSSSSSO.',
      '..OSSSSSSSO..',
      '...OSSSSSO...',
      '..OSSSSSSSO..',
      '..OSSO.OSSO..',
      '.OSSO...OSSO.',
      '.OO.......OO.',
      '.............',
    ],
  };
}
