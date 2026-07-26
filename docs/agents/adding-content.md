# Sisällön lisääminen (kysymykset, ikäluokat, pelimuodot)

Tämä ohje on tarkoitettu ensisijaisesti **Claude Code -agentille**. Sisältö on
datavetoista ja validoitua (ks. `docs/adr/0004-datavetoinen-sisalto-agenttilaajennukselle.md`).

Aja aina lopuksi:

```bash
npm run typecheck && npm test
```

Sisältötesti `src/domain/content.test.ts` kaatuu, jos lisäys on virheellinen.

## Kysymyksen lisääminen

1. Avaa **`src/data/questions.ts`** ja lisää uusi olio `QUESTIONS`-taulukkoon.
2. Kentät (skeema: `src/domain/schema.ts`):
   - `id` — **vakaa**, uniikki, muotoa `pienet-kirjaimet-ja-viivat`. Älä muuta
     vanhaa id:tä (historia viittaa siihen).
   - `concept` — mitä **sääntökohtaa** kysymys testaa (slug). Sama concept saa
     esiintyä eri sanamuodoilla, mutta **enintään 3 varianttia per lokero**.
   - `nakokulma` — `pelaaja` | `tuomari`, **yksi arvo** (ks. ADR 0006). Sama
     sääntökohta saa esiintyä molemmissa näkökulmissa **eri kysymyksenä**,
     mutta yksi kysymys ei kuulu molempiin.
   - `ikaluokat` — 1..n arvoa (`G`,`F`,`E`,`D`). Sama kysymys voi kuulua usealle.
   - `vaikeustaso` — `aloittelija` | `harjoittelija` | `osaaja` | `mestari`.
   - `aihealue` — yksi arvo (ks. `src/domain/config.ts`).
   - `kysymys`, `vaihtoehdot` (2–4), `oikeaIndeksi` (0-pohjainen), `selitys`.
   - `lahde` (valinnainen, mutta **suositeltu uusille kysymyksille**, ks. ADR
     0005) — `{ dokumentti, kohta?, url? }`. `kohta` on luvun/aiheen nimi
     ("Kenttä ja pelipaikat"), **ei sivu- tai pykälänumero** — numerointi
     muuttuu vuosittain kun uusi sääntö-PDF julkaistaan.
   - `tarkistettu` (valinnainen, muotoa `VVVV-KK-PP`) — milloin väite on
     viimeksi verrattu ajantasaisiin sääntöihin. Täytä aina kun täytät
     `lahde`-kentän.
3. **Tarkkuus:** jokainen väite on tarkistettava virallisista säännöistä
   (ks. `docs/pesapallo-lahteet.md`). **G** noudattaa pienpesistä — älä käytä
   sen kysymyksissä täyssääntöjä. **F ja E** noudattavat pelisääntöjä
   erityissääntöjen poikkeuksin, **D** pelisääntöjä. Koko kysymyspankin
   järjestelmällinen tarkistus: ks. `docs/agents/verifying-content.md`.

## Tuomarikysymyksen lisääminen

Tuomarikysymys kysyy **tuomitsemista**: mikä on oikea ratkaisu, kuka sen tekee
ja miten se ilmoitetaan. Lähteenä on koko ikäluokan säännöstö — ei vain
sääntöjen tuomariluku.

- Sääntöjen termi on **pelituomari**, ei "päätuomari". Muut: syöttötuomari,
  kakkostuomari, kolmostuomari, takarajatuomari, kirjuri. `content.test.ts`
  kaatuu, jos jossain kysymyksessä esiintyy sana "päätuomari".
- **Takarajatuomari** mainitaan tuomariston kokoonpanossa ja "Muut tuomarit"
  -tehtävälistassa (jotta vastaukset ovat täydellisiä), mutta sille ei
  kirjoiteta omia conceptejä.
- Aihealue `tuomarointi` on varattu sisällölle, joka koskee **itse tuomaristoa**
  (kokoonpano, tehtävät, vihellys- ja laikkamerkit, rangaistukset). Jos kysymys
  koskee jonkin muun säännön ratkaisua, käytä sen säännön omaa aihealuetta
  (esim. pesäkilpa → `eteneminen`, syötön tuomitseminen → `lyominen`).
- **Sävy:** tuomari-näkökulma kirjoitetaan n. 10–11-vuotiaan lukutasolle ja
  siitä ylöspäin kaikissa ikäluokissa — myös G:ssä ja F:ssä, koska tuomarina
  toimivat lähtökohtaisesti sen ikäiset ja vanhemmat.
- Verkosta (esim. Pesäpalloliiton lyhennelmät) saa hakea **ideoita** siihen,
  mitä kannattaa kysyä. Väite verifioidaan silti aina cachetuista
  sääntöteksteistä, ja `lahde` osoittaa viralliseen sääntöön. Jos
  sääntökatetta ei löydy, kysymystä ei lisätä.
4. **Vältä toistoa:** katso ensin, mitä `concept`-arvoja lokerossa jo on. Lisää
   mieluummin **uusi sääntökohta** kuin sama uudelleen. `npm test` tulostaa
   pehmeän concept-jakaumaraportin (ei kaada) — se paljastaa kattavuusaukot.

Vaihtoehtojen järjestys sekoitetaan käyttöliittymässä ajossa, joten `oikeaIndeksi`
saa olla mikä tahansa — sitä ei tarvitse arpoa käsin.

## Näkökulman lisääminen

Ylin akseli on `NAKOKULMAT` (`src/domain/config.ts`) ja `Nakokulma`-tyyppi
(`types.ts`). Uusi arvo vaatii myös `SaveData.progress`-rakenteen laajennuksen
ja save-migraation (ks. ADR 0006 ja `src/storage/storage.ts`) — älä lisää
näkökulmaa kevyesti.

## Ikäluokan lisääminen (esim. C, B, A)

1. Lisää rivi `IKALUOKAT`-listaan tiedostossa **`src/domain/config.ts`**.
2. Lisää `Ikaluokka`-tyyppiin uusi koodi tiedostossa `src/domain/types.ts`.
3. Lisää kysymyksiä uudelle ikäluokalle (yllä). `content.test.ts` vaatii, että
   jokaisella ikäluokalla on pelattava aloittelija-lokero.

Muu (UI, tallennus, eteneminen) toimii automaattisesti konfiguraation kautta.

## Vaikeustason lisääminen

Muokkaa `VAIKEUSTASOT` ja `VAIKEUSTASO_NIMI` (`config.ts`) sekä `Vaikeustaso`-tyyppi
ja `SaveData.ageGroups`-tierit (`types.ts`, `progression.ts` `createAgeGroupState`).

## Pelimuodon lisääminen

v1:ssä on yksi pelimuoto (tietovisakierros). Kierroslogiikka on `src/domain/round.ts`
ja tila `src/state/GameContext.tsx`. Uusi muoto: lisää oma kierroksen kokoaja /
tila-osa saman sauman taakse. Älä riko olemassa olevaa tietovisakierrosta.

## Saavutuksen lisääminen

Lisää määrittely `ACHIEVEMENTS`-listaan ja ehto `evaluateAchievements`-funktioon
tiedostossa `src/domain/achievements.ts`.
