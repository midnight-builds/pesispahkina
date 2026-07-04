# Paikallinen tallennus: yksi versioitu localStorage-möykky

## Päätös

Kaikki pelaajan edistymä tallennetaan selaimen localStorageen **yhtenä JSON-
möykkynä** yhden avaimen alla (`pesispahkina.save.v1`), ei backendiä eikä
useita erillisiä avaimia. Möykyssä on `schemaVersion`-kenttä.

Rakenteen periaatteet:
- `settings` (ääni, animaatiot), `totalPoints`, `achievements`,
  `ageGroups` (per ikäluokka per vaikeustaso: `unlocked`, `streak`, `best`),
  `questionResults` (per kysymys viimeisin tulos).
- **`streak` on per (ikäluokka × vaikeustaso).** Kun tason streak = 2, seuraava
  vaikeustaso avautuu. Alemman tason uusinta ei sotke etenemistä.
- **Ikäluokka lisätään dataan vasta kun pelaaja aloittaa sen.**
- **Latauksen puolustava käyttäytyminen:** jos JSON on rikki tai `schemaVersion`
  tuntematon, aloitetaan tyhjästä — peli ei koskaan kaadu tallennuksen takia.

## Miksi

v1 tehdään ilman backendiä (suunnitelman vaatimus). Yksi möykky tekee
nollauksesta, atomisesta tallennuksesta ja tulevista migraatioista suoraviivaisia
verrattuna useaan avaimeen. `schemaVersion` mahdollistaa skeeman kehittämisen
myöhemmin (uudet ikäluokat, pelimuodot) rikkomatta vanhoja tallennuksia.
