// Kannustavien kommenttien valinta. Poolit datassa (src/data/comments.ts),
// valinta täällä. Tilannepohjainen, satunnainen valinta ryhmän sisältä.

import { COMMENTS } from '../data/comments';

export type CommentSituation =
  | 'oikein'
  | 'vaarin'
  | 'putki' // 3+ oikeaa peräkkäin
  | 'lahella' // yksi onnistunut kierros tehty, yksi puuttuu avautumiseen
  | 'tulos-3'
  | 'tulos-2'
  | 'tulos-1'
  | 'tulos-0';

export function pickComment(situation: CommentSituation, rng: () => number = Math.random): string {
  const pool = COMMENTS[situation];
  if (!pool || pool.length === 0) return '';
  return pool[Math.floor(rng() * pool.length)];
}
