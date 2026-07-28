# Pesäpallon termien ja sääntöjen kanoniset lähteet

**Periaate:** kaikki pesäpallon termit ja säännöt tarkistetaan ja kirjoitetaan
virallisten sääntöjen mukaan. Ei arvata eikä käytetä puhekielisiä/vääriä muotoja.

## Ensisijainen lähde
- Pesäpalloliiton säännöt ja määräykset:
  https://www.pesis.fi/kilpailu/saannot-maaraykset
  - Pesäpallon pelisäännöt 2026 (pää-PDF)
  - Pienpesiksen pelisäännöt
  - Erityissäännöt E-pelisarja ja F–G (nuorimmat ikäluokat)

## Toissijainen lähde: tuomarikoulutusmateriaali

- Pesäpalloliiton tuomarikoulutus: https://www.pesis.fi/kilpailu/tuomarikoulutus
  - **Pesäpallotuomarin perusnäytöt 2026** — kaksi diasarjaa: peli- ja
    syöttötuomarille sekä pesätuomareille ja takarajatuomareille.

Tämä on liiton **omaa** materiaalia (samalla CDN:llä kuin sääntö-PDF:t), ei
kolmannen osapuolen lyhennelmä, ja se kelpaa `lahde`-arvoksi. Se on ainoa
virallinen lähde, joka kuvaa **käsimerkkien muodon** — pelisäännöt nimeävät
vain tilanteet, joissa käsimerkkejä käytetään.

**Ristiriitatilanteessa pelisäännöt voittaa.** Koulutusmateriaali
yksinkertaistaa paikoin sääntöjä opetustarkoituksessa; jos merkin kuvaus ja
sääntöteksti ovat eri mieltä ratkaisusta, sääntö ratkaisee.

⚠️ **Varo softball-materiaalia.** Verkossa on seurasivustoilla PDF:iä nimellä
"tuomarin käsimerkit", jotka ovat softballin tai baseballin merkkejä (tunnistat
niistä sanat *päätuomari*, *sääntö 61*, *käsisyöttö*). Ne EIVÄT ole pesäpalloa
— ks. myös huomio mailasta ja kentän muodosta alempana.

Nämä on jo purettu tekstiksi ja tallessa levyllä (ei uutta latausta joka
istunnossa): `.claude/verify/ground-truth/*.txt`, manifest
`.claude/verify/ground-truth/LAHTEET.md` kertoo mitä on tallessa ja koska
haettu. Ks. `docs/agents/verifying-content.md` kohta 1 ennen kuin haet
mitään verkosta.

## Mikä sääntöversio koskee mitäkin ikäluokkaa ja pelimuotoa

Nuorimmat eivät pelaa aikuisten täyssääntöjä. Kysymyksen sisältö on tarkistettava
oikeasta sääntöversiosta.

**Sääntöversio seuraa PELIMUOTOA JA SARJAA, ei pelkkää ikäluokkaa.** Tämä on
helppo mennä vikaan: sama ikäluokka voi pelata eri sääntöversioilla eri
sarjoissa. Erityissääntöjen oma teksti: *"E-junioreiden pelisarjassa ja
F-junioreiden otteluissa noudatetaan pesäpallon pelisääntöjä alla olevin
poikkeuksin. Pienpesiksessä ovat voimassa Pienpesiksen pelisäännöt sekä alla
olevat poikkeukset soveltuvin osin."*

- **G:** käytännössä pienpesis (kaikki G:n aluesarjat pelataan nimikkeellä
  Junnusuper, ks. alla) + F–G-erityissäännöt soveltuvin osin. Älä käytä
  täyssääntöjä G:n kysymyksissä ilman rajausta.
- **F:** F-junioreiden aluesarjaotteluissa varsinaiset pelisäännöt +
  F–G-erityissäännöt. **F ei kuitenkaan ole pienpesiksen ulkopuolella:**
  pienpesiksen 2 § puhuu itse *"F- ja G-ikäluokista"*, ja F-ikäisiä pelaa
  pienpesistä mm. leireillä. Älä siis oleta, ettei pienpesissääntö koskisi
  F-ikäistä koskaan.
- **E:** varsinaiset pelisäännöt + E-pelisarjan erityissäännöt.
- **D ja ylöspäin:** pääosin varsinaiset pelisäännöt.

**Käytännön sääntö kysymyksiä kirjoittaessa:** jos väite tulee pienpesiksestä,
sano se **kysymystekstissä** ("pienpesiksessä", "F-G-junioreiden otteluissa"),
älä pelkässä selityksessä. Silloin ikäluokkalistan ei tarvitse ratkaista asiaa.

### Pelimuodot ja sarjanimikkeet — älä sekoita näitä

- **Pienpesis** on pelimuoto, jolla on oma sääntödokumenttinsa (6 v 6).
- **Junnusuper** on sarjanimike. Liiton tiedote 2.12.2024: kaudesta 2025 alkaen
  kaikki G-ikäisten aluesarjat pelataan nimikkeellä Junnusuper. Kilpailu-
  määräykset 2026 listaavat Junnusuperin ja Pienpesiksen **erillisinä sarjoina**
  (omat otteluajat ja ottelumäärävaatimukset). Liiton sivuilta ei löytynyt
  dokumenttia, joka määrittelisi Junnusuperin säännöt — **älä siis oleta
  Junnusuperia ja pienpesistä samaksi asiaksi** (tarkistettu 2026-07-27).
- **Naperopesis** on kolmas kokonaisuus: pelisäännöt sanovat *"F- ja G-poikien
  ja -tyttöjen peleissä käytettävät naperopesissäännöt ovat pelisääntöjen
  liitteenä"*. Tätä liitettä EI ole ground-truth-cachessa — jos kysymys
  nojaisi naperopesikseen, liite on haettava ensin.
- Perinteinen 9 v 9 -pesäpallo on G-ikäiselle mahdollista ilmoittautumalla
  F-junioreiden aluesarjaan tai leirille (sama tiedote).

Kun kysymys kuuluu usealle ikäluokalle, varmista ettei väite ole ristiriidassa
minkään mukaan otetun ikäluokan sääntöversion kanssa.

## Käytettäviä termejä (tarkistettu virallisista/lähteistä)
- Merkinanto: **käsimerkki** on sääntökirjan sana (44 §; hakemistossa
  "Käsimerkit"). Tuomarikoulutuksessa samoista merkeistä käytetään nimitystä
  **näyttö** / **perusnäyttö** (esim. "laitonnäyttö" esiintyy myös säännöissä).
  Kysymyksissä käytetään sanaa *käsimerkki*, ja *näyttö* mainitaan selityksessä.
- Tuomaristo: **pelituomari** (ylin päätösvalta), **syöttötuomari**,
  **kakkostuomari**, **kolmostuomari**, **takarajatuomari** (kolme viimeistä =
  **pesätuomarit**, säännöissä otsikolla "Muut tuomarit"), **kirjuri**.
  Sana **"päätuomari" ei esiinny säännöissä** — se on puhekieltä; oikea termi
  on pelituomari (tarkistettu 2026 pelisäännöistä 2026-07-26, 43–44 §).
  Välineet: **merkkilaikka** (valkoinen levy, toisella puolella musta ruksi),
  **vihellysmerkit** (48 §). Käsimerkkien muoto on tuomarikoulutusmateriaalissa
  (ks. yllä), ei säännöissä.
- Pelipaikat/ulkopeli: **lukkari, koppari (sieppari), pesävahti, polttaja**
- Sisäpeli: **lyöjä, etenijä**
- Pesät: **kotipesä, ykköspesä, kakkospesä, kolmospesä**
- Pelivuorot: **sisävuoro / ulkovuoro**, **sisäpeli / ulkopeli**,
  **sisäjoukkue / ulkojoukkue** (EI "lähi-/kaukapelaaja"). Huom: yhdyssanoja
  **"sisäpelivuoro", "ulkopelivuoro", "sisäpelijoukkue" ja "ulkopelijoukkue"
  ei esiinny säännöissä lainkaan** — ne ovat luontevan kuuloisia mutta keksittyjä
  (tarkistettu 2026-07-27, korjattu 13 esiintymää kysymyspankista). Huom: **"sisäkenttä"
  ei esiinny säännöissä lainkaan** (tarkistettu 2026 pelisäännöistä,
  pienpesiksestä ja E/F–G-erityissäännöistä 2026-07-05); puhekielessä kuulee
  joskus sanan "ulkokenttä", mutta sekään ei ole sääntötermi. Kenttä jakautuu
  sääntöjen 6 §:n mukaan **varsinaiseen pelialueeseen** ja sitä ympäröivään
  **välialueeseen**.
- Palot: **palo** (pallo pesällä ennen etenijää), **haava/haavoittuminen**
- Lyönnit: **kärkilyönti, näpy/näppi, kunnari**

Huom: lähteet käyttävät paikoin toisistaan poikkeavia muotoja (esim. koppari vs.
sieppari). Kysymyksiä kirjoitettaessa tarkka termi varmistetaan aina 2026
pelisäännöt-PDF:stä ennen julkaisua.

### "Palaa" = palo — ei koskaan liikkumista

**"Pelaaja palaa" tarkoittaa paloa.** Se on palaa-verbin sisäpelin puolen muoto;
ulkopelin puolen muoto samasta tapahtumasta on **polttaa**. Ne eivät ole kaksi
eri ratkaisua, vaan sama ratkaisu kahdesta näkökulmasta:

- Tuomarikoulutus 2026, Palo-näyttö: *"**Palo.** Juoksija tai lyöjä **palaa**.
  Vihellyksen yhteydessä osoitetaan **palanutta** pelaajaa."* Pesätuomarin
  Palo-näyttö: *"Pallo ehtii pesälle ennen etenijää. **Etenijä palaa.**"*
- Johdanto: *"kiertää kaikki kolme kenttäpesää haavoittumatta tai **palamatta**"*
  ja *"ulkopelaajat pyrkivät haavoittamaan tai **polttamaan** etenijän"*.
- 12 §: vuoro vaihtuu, kun *"kolme sisäpelaajaa on **palanut**"*. 19 §:
  saapuminen ei ole säännönmukainen, jos etenijä on *"**palanut**"*.
- 21 §: lopulliseen ratkaisuun päästään, kun pelaaja 1) tuo juoksun
  2) haavoittuu 3) **palaa** tai 4) hänen etenemisensä on mitätöity. Kohta 3 on
  palo — listasta puuttuisi muuten yleisin ratkaisu kokonaan.
- 42 §: *"ei myöskään **pala**, vaan hän siirtyy kotipuolelle"* = häntä ei polteta.

**Haavoittuminen ei ole palo.** 36 §: *"Haavoittuneiden on **siirryttävä**
välittömästi kotipuolelle."* Älä kirjoita haavasta "joutuu palaamaan".

⚠️ **Säännöt käyttävät samaa sanaa myös fyysisestä paluusta pesälle** — 14 §
*"Sisäpelaaja saapuu tai **palaa takaisin pesään**, kun hän koskettaa pesää"*,
20 § *"voi lähteä kärkkymään pesältä ja **palata sille** rajoituksetta takaisin"*.
Tämä on homonymia, ei toinen ratkaisu.

**Pelin sääntö: PesisPähkinän kysymyksissä ja vaihtoehdoissa "palaa" ei
koskaan tarkoita liikkumista** (päätös 2026-07-28, ks. issue #14). Lyhyt
vastausvaihtoehto ei kerro lukijalle kumpi merkitys on kyseessä, ja lapsi lukee
sen väärin.

- Palo-merkityksessä kirjoita se auki: *"Etenijä palaa eli syntyy palo"*.
- **Samassa kysymyksessä ei saa olla sekä "palaa" että "poltetaan" eri
  vastauksina** — ne ovat sama vastaus, ja toisen merkitseminen vääräksi on
  pisteytysvirhe.
- Tuomarin määräämä paluu = **palauttaminen / palautetaan** (22 § "Rangaistukset
  sisäpelaajan estäessä: 1) **etenijän palauttaminen**"; 49 § "2) **sisäpelaajan
  palauttaminen lähtöpesälleen**"). Eri vartalo kuin palaa/palo → yksiselitteinen.
- "Siirtyä" kelpaa säännöissä vain **eteenpäin** liikkumiseen (22 § tulkinta:
  *"etenijät eivät voi **siirtyä seuraavalle pesälle**"*) ja kotipuolelle
  poistumiseen (36 §, 42 §). Muotoa "siirtyy takaisin edelliselle pesälle" ei
  säännöissä ole — älä keksi sitä.

## Maila (peliväline)

Suomalainen pesäpallon maila on **pyöreä, kartiomaisesti kapeneva** maila —
EI litteä lapamaila (kuten esim. krikettimailassa). Säännöt (2 §) eivät kuvaa
mailan muotoa tarkemmin kuin että sen on oltava PPL:n hyväksymä (F–G:ssä lisäksi
enintään 90 cm pitkä); mailan osista säännöt mainitsevat vain **"grippiosan"**
(29 §, kohta 9 — D–G-junioreiden otteluissa grippiosalla lyöty lyönti on laiton).

Sana **"lapa"/"lavan kärki" ei esiinny säännöissä lainkaan** eikä vastaa mailan
muotoa — vältä sitä kysymyksissä ja vaihtoehdoissa (tarkistettu 2026 pelisäännöistä
2026-07-07, ks. `osaaja-laiton-lyonti-grippi`-kysymyksen korjaus).

Nykyään mailat ovat käytännössä lähes aina **komposiittimailoja**; perinteisiä
puumailoja näkee otteluissa enää harvoin. Tämä on yleistä välinetietoa, ei
sääntöviittaus — säännöt eivät ota kantaa materiaaliin.
