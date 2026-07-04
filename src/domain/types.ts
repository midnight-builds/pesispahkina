// Domain-tyypit. Sanasto: ks. CONTEXT.md.

export type Ikaluokka = 'G' | 'F' | 'E' | 'D';

export type Vaikeustaso = 'aloittelija' | 'harjoittelija' | 'osaaja' | 'mestari';

export type Aihealue =
  | 'perusteet'
  | 'kentta'
  | 'roolit'
  | 'lyominen'
  | 'eteneminen'
  | 'ottelu';

export type Tulos = 'right' | 'wrong';

/** Yksi kysymys. Vakaa `id`, johon historia viittaa (ks. ADR 0001). */
export interface Question {
  id: string;
  /** Mitä sääntökohtaa kysymys testaa (samankaltaisuuden hallinta, ks. ADR 0004). */
  concept: string;
  /** 1..n ikäluokkaa — sama kysymys voi kuulua usealle. */
  ikaluokat: Ikaluokka[];
  vaikeustaso: Vaikeustaso;
  aihealue: Aihealue;
  kysymys: string;
  /** 2–4 vaihtoehtoa. */
  vaihtoehdot: string[];
  /** Oikean vaihtoehdon indeksi (0-pohjainen). */
  oikeaIndeksi: number;
  selitys: string;
  /** Valinnainen kuva (polku). v1-sisältö on tekstipohjaista. */
  kuva?: string;
}

/** (ikäluokka × vaikeustaso) -lokero. */
export interface Lokero {
  ikaluokka: Ikaluokka;
  vaikeustaso: Vaikeustaso;
}

export interface TierState {
  unlocked: boolean;
  /** Peräkkäisten onnistuneiden kierrosten putki kohti seuraavan tason avautumista. */
  streak: number;
  best: { stars: number; score: number } | null;
}

export interface AgeGroupState {
  tiers: Record<Vaikeustaso, TierState>;
}

export interface Settings {
  soundEnabled: boolean;
  animationsEnabled: boolean;
}

/** Koko localStorage-möykky (ks. ADR 0002). */
export interface SaveData {
  schemaVersion: 1;
  settings: Settings;
  totalPoints: number;
  roundsPlayed: number;
  achievements: string[];
  ageGroups: Partial<Record<Ikaluokka, AgeGroupState>>;
  questionResults: Record<string, Tulos>;
}

/** Yhden kysymyksen vastaus kierroksella. */
export interface AnsweredQuestion {
  question: Question;
  chosenIndex: number;
  correct: boolean;
  /** Kierroksen aikainen putken pituus tämän vastauksen jälkeen. */
  streakAfter: number;
  pointsEarned: number;
}

/** Valmiin kierroksen tulos. */
export interface RoundResult {
  lokero: Lokero;
  answers: AnsweredQuestion[];
  correctCount: number;
  score: number;
  stars: number;
  maxStreak: number;
  success: boolean;
}
