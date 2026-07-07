# Kysymyssisällön oikeellisuustarkistus (verifiointirituaali)

Tämä ohje on tarkoitettu **Claude Code -agentille**. Se kuvaa toistettavan
prosessin, jolla koko kysymyspankki tarkistetaan virallisia sääntöjä vasten.
Tausta: ADR 0005 (`docs/adr/0005-kysymysten-lahdemetadata.md`) ja
`docs/pesapallo-lahteet.md`.

## Milloin ajetaan

- Kun Pesäpalloliitto julkaisee uuden vuoden sääntö-PDF:t (vuosittain).
  Kysymykset, joiden `tarkistettu`-päivä on ennen uutta julkaisua, on
  tarkistettava uudelleen.
- Kun pelaaja tai käyttäjä kyseenalaistaa kysymyksen (tarkista silloin
  vähintään kyseinen kysymys ja sen concept-sisarukset).
- Ennen ison kysymyserän julkaisua.

## Prosessi

### 1. Hanki ground truth

Lataa viralliset PDF:t sivulta
https://www.pesis.fi/kilpailu/saannot-maaraykset ja pura tekstiksi:

```bash
mkdir -p /tmp/verify/ground-truth /tmp/verify/reports
# Hae ajantasaiset PDF-linkit sivulta, sitten esim.:
curl -sL <pelisaannot-url> -o /tmp/verify/pelisaannot.pdf
pdftotext -layout /tmp/verify/pelisaannot.pdf \
  /tmp/verify/ground-truth/pesapallon-pelisaannot-<vuosi>.txt
```

Tarvittavat dokumentit: **Pesäpallon pelisäännöt**, **Pienpesiksen
pelisäännöt**, **Erityissäännöt E-pelisarja ja F–G**. `pdftotext` kuuluu
poppler-utils-pakettiin. HUOM: WebFetch ei osaa lukea näitä PDF:iä suoraan —
käytä aina pdftotextiä.

**Sääntötekstejä ei commitoida repoon** (PPL:n tekijänoikeus). Ne elävät
vain /tmp:ssä tarkistuksen ajan.

### 2. Jaa kysymykset osiin

```bash
grep -n "id: '" src/data/questions.ts
```

Jaa id:t ~10 kysymyksen osiin ja laske kunkin osan rivialue
`questions.ts`:ssä. Osia tulee tyypillisesti ~10 sadalle kysymykselle.

### 3. Käynnistä verifiointiagentit rinnakkain

Kirjoita jaettu ohje tiedostoon `/tmp/verify/OHJE.md` (mallipohja alla) ja
käynnistä yksi ali-agentti per osa. Jokainen agentti saa: osan numeron,
rivialueen, id-listan ja raporttipolun `/tmp/verify/reports/osa-NN.md`.

**Tärkeät säännöt agenteille:**
- Ali-agentit EIVÄT muokkaa `questions.ts`:ää — rinnakkaiset editoinnit
  samaan tiedostoon korruptoituvat. Ne vain raportoivat; pääagentti tekee
  korjaukset keskitetysti.
- Ground truthina VAIN puretut sääntötekstit — ei agentin omaa yleistietoa.
- Kysymyksen oma `selitys` on tarkistettavaa sisältöä, ei todiste.

### 4. Kokoa tulokset ja korjaa

Kun raportit ovat valmiit: kokoa verdiktit, korjaa VIRHE- ja
EPÄTARKKA-löydökset `questions.ts`:ään ja päivitä samalla `lahde` +
`tarkistettu` -metadata agenttien lahde-ehdotuksista. Jos kysymyksen sisältö
muuttuu olennaisesti, anna sille uusi `id` (ADR 0001: vakaa id = vakaa
sisältö). Aja lopuksi `npm run typecheck && npm run lint && npm test`.

## Verdiktit

- **OIKEIN** — väite vahvistuu ground truthista (sitaatti + kohta talteen).
- **VIRHE** — oikea vastaus ristiriidassa sääntöjen kanssa, TAI jokin
  harhautusvaihtoehto on myös tosi, TAI selitys väittää väärää.
- **EPÄTARKKA** — pääväite ok, mutta termi/muotoilu epätarkka tai
  soveltamisala puuttuu kysymystekstistä.
- **EI SÄÄNTÖLÄHDETTÄ** — väite voi olla totta (yleistieto/historia), mutta
  ei todennettavissa sääntödokumenteista. Ei virhe; ei saa sääntöihin
  osoittavaa `lahde`-metadataa.

## Mitä jokaisesta kysymyksestä tarkistetaan

1. Onko `oikeaIndeksi`-vastaus tosi sääntöjen mukaan?
2. Ovatko KAIKKI harhautusvaihtoehdot varmasti vääriä? (Yleisin piilovirhe:
   harhautus onkin myös tosi.)
3. Onko `selitys` totuudenmukainen?
4. Ovatko termit sääntöjen termejä? (Tunnettu ansa: "sisäkenttä" ei esiinny
   säännöissä; vuorot ovat sisävuoro/ulkovuoro.)
5. Päteekö väite KAIKILLE kysymyksen `ikaluokat`-arvoille oikean
   sääntöversion mukaan? (G: pienpesis + F–G-erityissäännöt; F: pelisäännöt +
   F–G-erityissäännöt; E: pelisäännöt + E-erityissäännöt; D: pelisäännöt.)

## OHJE.md-mallipohja agenteille

Raportin muoto per kysymys:

```
### <id>
- Verdikti: OIKEIN | VIRHE | EPÄTARKKA | EI SÄÄNTÖLÄHDETTÄ
- Perustelu: <1–3 lausetta>
- Sitaatti: "<suora lainaus>" (<tiedosto>, <pykälä/luku>)
- Lahde-ehdotus: dokumentti: "<nimi>", kohta: "<pykälä tai luvun nimi>"
```

Loppuun yhteenveto (määrät per verdikti) ja paluuviestiin tiivis
id → verdikti -lista.
