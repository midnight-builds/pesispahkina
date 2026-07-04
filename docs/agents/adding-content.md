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
   - `ikaluokat` — 1..n arvoa (`G`,`F`,`E`,`D`). Sama kysymys voi kuulua usealle.
   - `vaikeustaso` — `aloittelija` | `harjoittelija` | `osaaja` | `mestari`.
   - `aihealue` — yksi arvo (ks. `src/domain/config.ts`).
   - `kysymys`, `vaihtoehdot` (2–4), `oikeaIndeksi` (0-pohjainen), `selitys`.
3. **Tarkkuus:** jokainen väite on tarkistettava virallisista säännöistä
   (ks. `docs/pesapallo-lahteet.md`). G/F noudattavat **pienpesistä** — älä käytä
   niissä täyssääntöjä.
4. **Vältä toistoa:** katso ensin, mitä `concept`-arvoja lokerossa jo on. Lisää
   mieluummin **uusi sääntökohta** kuin sama uudelleen. `npm test` tulostaa
   pehmeän concept-jakaumaraportin (ei kaada) — se paljastaa kattavuusaukot.

Vaihtoehtojen järjestys sekoitetaan käyttöliittymässä ajossa, joten `oikeaIndeksi`
saa olla mikä tahansa — sitä ei tarvitse arpoa käsin.

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
