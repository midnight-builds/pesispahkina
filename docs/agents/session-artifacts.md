# Istuntokohtaiset työtiedostot (handoff, ali-agenttien scratch)

Tämä ohje koskee tiedostoja, jotka agentti kirjoittaa TYÖN AIKANA mutta jotka
eivät ole tuotetta (ei koodia, ei kysymyssisältöä, ei pysyvää dokumentaatiota).
Näitä on kaksi lajia, ja niillä on eri elinikä — siksi ne kuuluvat eri paikkoihin.

## 1. Ali-agenttien scratch (ohje + raakaraportit) → `/tmp`

Kun pääagentti käynnistää rinnakkaisia ali-agentteja saman istunnon sisällä
(esim. verifiointirituaali, ks. `docs/agents/verifying-content.md`), niiden
väli-instruktiot ja raakaraportit tarvitaan vain siihen asti kun pääagentti on
lukenut raportit ja tehnyt korjaukset `questions.ts`:ään. Ne eivät tarvitse
selvitä istunnon ylitse.

→ Kirjoita `/tmp/<projekti>-<tehtava>/` alle, esim.
`/tmp/pesispahkina-verify/ohje.md`, `/tmp/pesispahkina-verify/reports/osa-01.md`.
Ei tarvitse gitignoreta erikseen — `/tmp` ei ole osa repoa lainkaan.

**Miksi ei `.claude/`:** kokeiltiin, ja seurauksena `.claude/verify/`-kansioon
jäi lojumaan "jäljellä"-seurantatiedosto ja 10 raakaraporttia senkin jälkeen
kun työ oli valmis ja löydökset viety `questions.ts`:ään — ne eivät enää
palvelleet mitään tarkoitusta, mutta kukaan ei huomannut siivota niitä.
`/tmp` häviää istuntojen välillä itsestään, joten sama ei voi enää käydä.

**Poikkeus:** `.claude/verify/ground-truth/*.txt` + `LAHTEET.md` EIVÄT ole
scratchia — ne ovat uudelleenkäytettävä cache, joka nimenomaan halutaan
säilyttää istuntojen yli jotta PDF:iä ei ladata verkosta joka istunnossa
(ks. `docs/agents/verifying-content.md` kohta 1). Ne pysyvät `.claude/`:ssa.

## 2. Handoff (konteksti seuraavalle istunnolle) → `.claude/handoff-<aihe>.md`

Jos työ jää kesken ja seuraava istunto tarvitsee kontekstin (mitä on tehty,
mitä on kesken, mitä ei pidä koskea), kirjoita tiedosto repon juureen:
`.claude/handoff-<aihe>.md`. `.claude/` on jo `.gitignore`:ssa, joten handoff
ei mene committiin, mutta pysyy levyllä yli istuntojen — toisin kuin `/tmp`,
joka juuri siksi ei kelpaa handoffille.

**Ei yhtä kanonista tiedostoa.** Rinnakkaisia työketjuja voi olla useita
yhtä aikaa (eri branchit, eri agentit, eri aiheet) — jokainen rakentaa omaa
handoffiaan riippumatta muista. Siksi tiedoston **nimen on kerrottava mitä
ollaan rakentamassa**, ei geneeristä "handoff.md":ää, joka ylikirjoittuisi
tai sekoittuisi toisen työketjun kanssa. Esim. `.claude/handoff-lahdemetadata.md`
ja `.claude/handoff-d-e-aloittelija.md` voivat elää rinnakkain.

Säännöt:
- **Nimeä aiheen mukaan**, ei istunnon tai päivän mukaan (`kebab-case`,
  sama aihe → sama tiedosto — päivitä olemassa olevaa, älä kasaa
  `handoff-lahdemetadata-2.md`, `handoff-lahdemetadata-uusi.md` tms.).
- **Poista kun konteksti on kulutettu.** Kun kyseisen aiheen jatkoistunto on
  lukenut handoffin ja työ on valmis (tai tieto on siirretty pysyvään
  paikkaan: commit-viesti, ADR, dokumentti, muisti) — poista se tiedosto.
  Muut aiheen handoffit eivät vaikuta tähän. Älä jätä lojumaan "varmuuden
  vuoksi".
- Sisältö: mitä tehtiin, mitä on kesken, mitä EI pidä koskea, ja mistä löytyy
  lisätietoa (viittaa dokumentteihin, älä toista niiden sisältöä).

## Nimeämiskäytäntö

- **Scratch (`/tmp`):** `<projekti>-<tehtava>/`, esim. `pesispahkina-verify/`.
  Alikansiot vapaasti (`reports/` yms.) — mutta ei koskaan `ground-truth/`,
  joka on aina `.claude/verify/ground-truth/` (pysyvä cache, ei scratch).
- **Handoff:** `.claude/handoff-<aihe>.md`, aihe = mitä rakennetaan/korjataan
  (esim. `handoff-lahdemetadata.md`), ei istunnon numeroa tai aikaleimaa
  tiedostonimessä. Git ei seuraa sitä, joten versiohistoriaa ei muutenkaan
  säily; päivämäärä mainitaan tarvittaessa sisällössä.
- **Pysyvät (committoitavat) dokumentit:** `docs/agents/<aihe>.md`,
  kebab-case, kuvaileva nimi (ei `notes.md`, `misc.md`, `wip.md`).
