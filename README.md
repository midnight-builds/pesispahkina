# PesäPähkinä

Mobiili ensin -selainpeli, joka opettaa pesäpallon sääntöjä lapsille ja heidän
vanhemmilleen. Toimii ilman kirjautumista ja ilman backendiä; eteneminen
tallennetaan selaimen localStorageen. Asennettavissa PWA:na.

**▶ Pelaa: https://midnight-builds.github.io/pesispahkina/**

## Kuvakaappaukset

<p>
  <img src="docs/screenshots/home.png" alt="Kotinäkymä: ikäluokat G–D" width="240" />
  <img src="docs/screenshots/reveal.png" alt="Kysymys ja välitön palaute selityksineen" width="240" />
  <img src="docs/screenshots/result.png" alt="Tulosnäkymä: tähdet, pisteet ja saavutus" width="240" />
</p>

<sub>Kotinäkymä · välitön palaute selityksineen · tulosnäkymä juhla-animaatioineen</sub>

## Kehitys

```bash
npm install
npm run dev        # kehityspalvelin
npm run typecheck  # TypeScript
npm test           # Vitest (domain-logiikka + sisältö + smoke)
npm run build      # tuotantobuild (dist/)
npm run preview    # esikatsele tuotantobuildia
```

## Rakenne

```
src/
  domain/     puhdas pelilogiikka (pisteytys, eteneminen, kierros, skeema, saavutukset)
  data/       sisältö: kysymykset ja kannustavat kommentit
  storage/    localStorage-tallennus (yksi versioitu möykky)
  audio/      synteettiset Web Audio -äänet
  state/      React-tila (GameContext) — yksi pelimuoto sauman takana
  ui/         näkymät ja komponentit
```

## Dokumentaatio

- `CONTEXT.md` — sanasto (ubiikki kieli)
- `docs/adr/` — arkkitehtuuripäätökset (ADR:t)
- `docs/pesapallo-lahteet.md` — sääntöjen kanoniset lähteet ja termit
- `docs/pesapallo-ikaluokat.md` — ikäluokat (G–D)
- **`docs/agents/adding-content.md` — näin lisäät kysymyksiä, ikäluokkia ja pelimuotoja**
- `docs/backlog.md` — v2-ideat (mm. tuomarikysymykset, sovelluksen sisäinen palaute)

## Ensimmäisen version rajaus

Ikäluokat G, F, E, D. Vaikeustasot avautuvat kahdesta peräkkäisestä onnistuneesta
kierroksesta (≥ 8/10). v1:n sisältö painottuu aloittelija-tasolle; korkeammat tasot
täydentyvät vaiheittain (ks. `docs/agents/adding-content.md`).
