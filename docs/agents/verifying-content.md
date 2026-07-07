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

### 1. Tarkista ensin cache — älä hae verkosta turhaan

Puretut sääntötekstit **säilyvät istuntojen yli** kansiossa
`.claude/verify/ground-truth/` (EI `/tmp`, joka tyhjenee istuntojen välillä).
Kansio on `.gitignore`:ssa, koska sisältö on PPL:n tekijänoikeudellista
sääntötekstiä — **sitä ei koskaan committoida repoon**, mutta se pysyy
levyllä ja on siksi käytettävissä myös uusissa istunnoissa ilman uutta
latausta.

Manifest `.claude/verify/ground-truth/LAHTEET.md` listaa mitä on jo
tallessa: dokumentti, lähde-URL, hakupäivä, sääntövuosi. **Lue tämä
ensin.**

1. Jos manifestissa oleva dokumentti kattaa tarvitsemasi sääntöversion ja
   vuoden → käytä olemassa olevaa `.txt`-tiedostoa sellaisenaan. ÄLÄ hae
   PDF:ää uudelleen.
2. Jos olet epävarma onko cache ajantasainen, tee **kevyt** tarkistus:
   hae vain sivun https://www.pesis.fi/kilpailu/saannot-maaraykset listaus
   (WebFetch riittää tähän, koska ei tarvitse lukea itse PDF:ää) ja vertaa
   sääntövuotta manifestiin. Älä lataa PDF:ää pelkän vuosivertailun takia.
3. Hae ja pura PDF uudelleen VAIN jos: (a) tarvittua dokumenttia ei ole
   cachessa, (b) sivulla on uudempi sääntövuosi kuin manifestissa, tai
   (c) käyttäjä nimenomaan pyytää tuoreen tarkistuksen.

Kun haet (tai päivität) dokumentin:

```bash
mkdir -p .claude/verify/ground-truth
# Hae ajantasaiset PDF-linkit sivulta, sitten esim.:
curl -sL <pelisaannot-url> -o /tmp/pelisaannot.pdf
pdftotext -layout /tmp/pelisaannot.pdf \
  .claude/verify/ground-truth/pesapallon-pelisaannot-<vuosi>.txt
```

ja **päivitä `LAHTEET.md`** samalla (dokumentti, URL, hakupäivä, vuosi) —
muuten seuraava istunto ei tiedä että cache on jo tuore.

Tarvittavat dokumentit: **Pesäpallon pelisäännöt**, **Pienpesiksen
pelisäännöt**, **Erityissäännöt E-pelisarja ja F–G**. `pdftotext` kuuluu
poppler-utils-pakettiin. HUOM: WebFetch ei osaa lukea näitä PDF:iä suoraan —
käytä aina pdftotextiä itse sääntötekstin purkuun.

### 2. Jaa kysymykset osiin

```bash
grep -n "id: '" src/data/questions.ts
```

Jaa id:t ~10 kysymyksen osiin ja laske kunkin osan rivialue
`questions.ts`:ssä. Osia tulee tyypillisesti ~10 sadalle kysymykselle.

### 3. Käynnistä verifiointiagentit rinnakkain

Kirjoita jaettu ohje tiedostoon `/tmp/pesispahkina-verify/ohje.md` (mallipohja
alla) ja käynnistä yksi ali-agentti per osa. Jokainen agentti saa: osan
numeron, rivialueen, id-listan ja raporttipolun
`/tmp/pesispahkina-verify/reports/osa-NN.md`. Nämä ovat kertakäyttöistä
scratchia — ei ground truth eikä pysyvää dokumentaatiota — joten `/tmp` on
oikea paikka niille (ks. `docs/agents/session-artifacts.md`). Jos
työ jää kesken istunnon lopussa, kirjaa tila `.claude/handoff-verifiointi.md`:ään
(tiivistelmänä, ei kopioimalla raakaraportteja) — älä jätä osa-NN.md-
raportteja lojumaan repoon "seuraavaa istuntoa varten".

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
