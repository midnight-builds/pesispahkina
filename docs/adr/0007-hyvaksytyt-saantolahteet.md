# Hyväksytyt sääntölähteet: myös PPL:n tuomarikoulutusmateriaali

Käsimerkit ovat olennainen osa tuomarointia, mutta **pelisäännöt eivät kuvaa
niiden muotoa** — ne nimeävät vain tilanteet, joissa käsimerkkejä käytetään
(44 §, 38 §, 46 §). Merkkien muoto on määritelty Pesäpalloliiton omassa
tuomarikoulutusmateriaalissa ("Pesäpallotuomarin perusnäytöt",
https://www.pesis.fi/kilpailu/tuomarikoulutus). Siksi hyväksyttyjen
`lahde`-dokumenttien joukkoa laajennettiin kattamaan myös se.

## Considered Options

**Vain pelisäännöt, pienpesis ja erityissäännöt** (alkuperäinen linja).
Hylättiin, koska se olisi jättänyt käsimerkit kokonaan pois — ne ovat
tuomaroinnin näkyvin osa, eikä kysymyksiä olisi voinut tehdä lainkaan.

**Mikä tahansa verkkolähde, joka kuvaa merkit.** Hylättiin: seurasivustoilla
liikkuu "tuomarin käsimerkit" -PDF:iä, jotka ovat tosiasiassa **softballin tai
baseballin** merkkejä (tunnistaa sanoista *päätuomari*, *sääntö 61*,
*käsisyöttö*). Ne eivät ole pesäpalloa, eivätkä kolmannen osapuolen
lyhennelmät ole auditoitavissa.

## Consequences

- Hyväksytty lähde on **Pesäpalloliiton oma dokumentti**: pelisäännöt,
  pienpesiksen pelisäännöt, erityissäännöt tai tuomarikoulutusmateriaali.
  Kolmannen osapuolen lyhennelmistä saa hakea vain ideoita siitä, mitä
  kannattaa kysyä — ne eivät kelpaa `lahde`-arvoksi.
- **Ristiriitatilanteessa pelisäännöt voittaa.** Koulutusmateriaali on
  opetuskäyttöön tehty ja yksinkertaistaa paikoin sääntöjä; jos se ja
  sääntöteksti ovat eri mieltä ratkaisusta, sääntö ratkaisee.
  Verifiointirituaalissa tällainen kysymys saa verdiktin VIRHE.
- Materiaali on `.pptx`-muodossa ja **kuvavetoista**. Ground-truth-cacheen
  puretaan diojen tekstit; merkkien sanalliset kuvaukset ovat niissä
  täydelliset, joten verifiointi on toistettavissa ilman kuvia.
- Materiaali on vuosiversioitu kuten säännötkin, joten se tarkistetaan samassa
  vuosirytmissä (ks. `.claude/verify/ground-truth/LAHTEET.md`).

## Terminologia

Sääntökirjan sana on **käsimerkki** (44 §, hakemisto). Tuomarikoulutus käyttää
samoista merkeistä nimitystä **näyttö** / **perusnäyttö**. Kysymysteksteissä
käytetään sanaa *käsimerkki*, koska se on sääntötermi ja lapselle
ymmärrettävämpi; *näyttö* mainitaan selityksessä, jotta oikeaan
tuomarikoulutukseen menevä tunnistaa sanan.
