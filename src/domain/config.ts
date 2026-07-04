// Keskitetty konfiguraatio. Uuden ikäluokan/aihealueen lisääminen tehdään TÄSTÄ,
// ei kovakoodattuna ympäri UI:ta (ks. ADR 0004 ja docs/agents/adding-content.md).

import type { Aihealue, Ikaluokka, Vaikeustaso } from './types';

interface IkaluokkaInfo {
  koodi: Ikaluokka;
  nimi: string;
  ikakuvaus: string;
}

/** Ikäluokat pelattavuusjärjestyksessä. C/B/A lisätään myöhemmin. */
export const IKALUOKAT: IkaluokkaInfo[] = [
  { koodi: 'G', nimi: 'G-juniorit', ikakuvaus: 'alle 8 v' },
  { koodi: 'F', nimi: 'F-juniorit', ikakuvaus: '9–10 v' },
  { koodi: 'E', nimi: 'E-juniorit', ikakuvaus: '11–12 v' },
  { koodi: 'D', nimi: 'D-juniorit', ikakuvaus: '13–14 v' },
];

/** Vaikeustasot avautumisjärjestyksessä. */
export const VAIKEUSTASOT: Vaikeustaso[] = [
  'aloittelija',
  'harjoittelija',
  'osaaja',
  'mestari',
];

export const VAIKEUSTASO_NIMI: Record<Vaikeustaso, string> = {
  aloittelija: 'Aloittelija',
  harjoittelija: 'Harjoittelija',
  osaaja: 'Osaaja',
  mestari: 'Mestari',
};

const AIHEALUE_NIMI: Record<Aihealue, string> = {
  perusteet: 'Perusteet ja sanasto',
  kentta: 'Kenttä ja pesät',
  roolit: 'Pelipaikat ja roolit',
  lyominen: 'Lyöminen ja syöttö',
  eteneminen: 'Eteneminen, juoksut ja palot',
  ottelu: 'Ottelun kulku',
};

export const AIHEALUEET = Object.keys(AIHEALUE_NIMI) as Aihealue[];

// --- Pelin vakiot (viritettävissä) ---

/** Kysymyksiä yhdellä kierroksella. */
export const KIERROKSEN_PITUUS = 10;

/** Onnistuneen kierroksen kynnys (oikeita vähintään). */
export const ONNISTUMISKYNNYS = 8;

/** Montako peräkkäistä onnistunutta kierrosta avaa seuraavan vaikeustason. */
export const AVAUTUMISEEN_TARVITAAN = 2;

/** Pisteet oikeasta vastauksesta. */
export const PISTEET_OIKEASTA = 10;

/** Monennestako peräkkäisestä oikeasta putkibonus alkaa. */
export const PUTKIBONUS_ALKAA = 3;

/** Putkibonuksen suuruus (lisäpisteet). */
export const PUTKIBONUS = 10;

/** Enintään montako kerrattavaa kysymystä ujutetaan yhteen kierrokseen. */
export const KERRATTAVIA_PER_KIERROS = 3;
