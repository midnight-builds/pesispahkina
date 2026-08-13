# CLAUDE.md

## Project
This project is **PesisPähkinä**.

## Naming
- Human-facing project name: **PesisPähkinä**
- Directory name: `pesispahkina`

## Context
This repository is newly scaffolded. Keep the setup lightweight until the first real feature lands.

## Portti

Aja järjestyksessä; kaikkien on oltava vihreitä ennen mergeä:

1. `npm run lint`
2. `npm run typecheck`
3. `npm test`
4. `npm run build`
5. `npm run test:e2e` (ajaa buildattua `dist`:iä vasten; selainasennus kerran: `npx playwright install --with-deps chromium`)

tuotantokriittinen: ei

Deploy: push mainiin → `.github/workflows/deploy.yml` julkaisee GitHub Pagesiin
(https://pesispahkina.talonpoika.dev/); katko korjaantuu seuraavalla pushilla.

Ennen kuin ehdotat PR:n tekemistä, tarjoa käyttäjälle adversariaalista
katselmusta: ali-agentti, joka yrittää kaataa muutoksen ja antaa jokaisesta
löydöksestä konkreettisen skenaarion + tiedosto:rivi-ankkurin.

## Etäkäyttö

When starting Claude remotely for this repository on codexsrv, prefer the
standard remote-control server mode and the canonical tmux/service naming model.

## Agent skills

### Issue tracker

Issues live in this repo's GitHub Issues (via the `gh` CLI). External PRs are not pulled into triage. See `docs/agents/issue-tracker.md`.

### Triage labels

Default label vocabulary (`needs-triage`, `needs-info`, `ready-for-agent`, `ready-for-human`, `wontfix`). See `docs/agents/triage-labels.md`.

### Domain docs

Single-context layout: `CONTEXT.md` + `docs/adr/` at the repo root. See `docs/agents/domain.md`.

### Content verification

Kysymyssisältö tarkistetaan virallisia sääntöjä vasten toistettavalla
rituaalilla (rinnakkaiset ali-agentit + pdftotext-ground-truth). See
`docs/agents/verifying-content.md`. Lisääminen: `docs/agents/adding-content.md`.

### Istuntokohtaiset työtiedostot (handoff, ali-agenttien scratch)

Handoff-tiedostot ja ali-agenttien väliohjeet/raportit eivät kuulu samaan
paikkaan kuin pysyvä ground-truth-cache. See `docs/agents/session-artifacts.md`.
