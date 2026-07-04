// Kannustavat kommentit tilanteittain. Lisääminen: uusi rivi sopivaan ryhmään.
// Sävy: lämmin muttei lapsellinen — sopii myös vanhemmille. Lyhyet tekstit.

import type { CommentSituation } from '../domain/comments';

export const COMMENTS: Record<CommentSituation, string[]> = {
  oikein: [
    'Hieno vastaus!',
    'Juuri noin!',
    'Osaat tämän!',
    'Nappiin meni.',
    'Hyvä — oikein!',
  ],
  vaarin: [
    'Ei haittaa, tästä opit uuden säännön.',
    'Hyvä yritys — nyt tiedät oikean vastauksen.',
    'Näin se menee. Jatketaan!',
    'Virheistä oppii parhaiten.',
  ],
  putki: [
    'Mahtavaa, kolme oikein peräkkäin!',
    'Putki päällä — hienoa!',
    'Vauhti kiihtyy, upeaa!',
  ],
  lahella: [
    'Olet jo melkein seuraavalla tasolla!',
    'Yksi hyvä kierros vielä, niin uusi taso aukeaa!',
    'Aivan lähellä uutta tasoa!',
  ],
  'tulos-3': [
    'Täydellistä! Kaikki oikein!',
    'Loistava kierros — kolme tähteä!',
  ],
  'tulos-2': [
    'Hyvin pelattu!',
    'Vahva kierros — jatka samaan malliin!',
  ],
  'tulos-1': [
    'Hyvä alku! Ensi kierroksella vielä parempi.',
    'Opit koko ajan lisää.',
  ],
  'tulos-0': [
    'Ei hätää — jokainen kierros opettaa.',
    'Kokeillaan uudelleen, kyllä tämä tästä!',
  ],
};
