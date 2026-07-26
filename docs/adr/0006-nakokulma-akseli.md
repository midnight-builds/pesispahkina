# Näkökulma (pelaaja / tuomari) omana akselinaan ikäluokan yläpuolella

Tuomarointia opetteleva pelaaja tarvitsee eri kysymykset kuin pelaamista
opetteleva, ja tuomarisisältö eroaa ikäluokittain rajusti: pienpesiksessä (G)
tuomareita on minimissään yksi, kun taas D-ikäisten ottelussa tuomaristoon
kuuluu pelituomari, syöttötuomari, kolme muuta tuomaria ja kirjuri. Siksi
lisättiin uusi ylin akseli **näkökulma** (`pelaaja` | `tuomari`), jonka alla
nykyiset ikäluokat ja vaikeustasot pysyvät ennallaan. Lokerosta tuli
kolmiulotteinen: näkökulma × ikäluokka × vaikeustaso.

## Considered Options

**Uusi aihealue `tuomarointi`** (alkuperäinen backlog-ehdotus). Halvin:
kysymykset olisivat menneet nykyisiin lokeroihin uudella aihealue-arvolla.
Hylättiin, koska tuomarisisältö ei olisi näkynyt pelaajalle omana
kokonaisuutena vaan sekoittunut muihin kysymyksiin, eikä ikäluokkakohtaista
eroa olisi saanut hallittua.

**Uusi vaikeustaso mestarin jälkeen.** Hylättiin, koska tuomarointi ei ole
vaikeampaa vaan eri aihe — ja G:lle ei ole olemassa täyssääntösisältöä, jolla
viides porras täytettäisiin.

Aihealue `tuomarointi` lisättiin silti, mutta kapeampana: se merkitsee
sisältöä, joka koskee itse tuomaristoa (kokoonpano, tehtävät, vihellys- ja
laikkamerkit, rangaistukset). Muut tuomarikysymykset saavat aihealueekseen sen
säännön aiheen, jota ratkaisu koskee — jolloin concept-jakaumaraportti
paljastaa kattavuusaukot myös tuomari-puolella.

## Consequences

- **Eteneminen on erillinen per näkökulma.** Pelaaja-puolen edistymä ei avaa
  tuomari-puolen vaikeustasoja eikä päinvastoin. Tästä seurasi save-skeeman
  versionnosto: `schemaVersion` 1 → 2, jossa `ageGroups` korvautui
  `progress`-rakenteella (`Record<Nakokulma, ...>`). Migraatio siirtää koko
  aiemman edistymän pelaaja-näkökulmaan — vanha edistymä ei saa nollautua
  (ks. ADR 0002 ja `src/storage/storage.test.ts`).
- **`Question.nakokulma` on pakollinen ja yksiarvoinen.** Sama sääntökohta saa
  esiintyä molemmissa näkökulmissa eri kysymyksenä, mutta yksi kysymys ei voi
  kuulua molempiin — muuten tuomari-osio täyttyisi kierrätetyillä
  pelaajakysymyksillä. Aiemmat kysymykset merkittiin arvolla `pelaaja`.
- **Sisällön lähdesääntö on ikäluokkakohtainen.** Tuomarikysymys tarkistetaan
  sen ikäluokan omasta sääntöversiosta: G = pienpesis (+ F–G-erityissäännöt),
  F ja E = pelisäännöt + erityissäännöt, D = pelisäännöt. Tämän takia
  tuomari/G on tarkoituksella ohuin lokeroryhmä.
