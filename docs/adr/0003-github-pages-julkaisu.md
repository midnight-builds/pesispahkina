# Julkaisu GitHub Pagesiin ilman URL-reititintä

## Päätös

PesisPähkinä julkaistaan staattisena sivuna **GitHub Pagesiin**. Hosting säilyy
GitHub Pagesissa, mutta canonical-osoite on custom domain
`https://pesispahkina.talonpoika.dev/` (myös `https://pesispähkinä.talonpoika.dev/`
IDN-muotona). Sivusto julkaistaan domainin **juuressa**, ei enää repoalipolussa
`midnight-builds.github.io/pesispahkina`. Repo:
`git@github.com:midnight-builds/pesispahkina.git`.

Seuraukset:
- **Ei URL-reititintä.** Näkymät (koti, kierros, tulos, asetukset) hoidetaan
  Reactin näkymätilalla. Pagesissa ei ole palvelinuudelleenohjauksia, joten
  SPA-reititys hajoaisi deep-linkissä; näkymätila välttää ongelman kokonaan.
- **Base-polku `/`.** Viten `base` sekä PWA-manifestin `scope` ja `start_url`
  ovat `/`, koska sivusto elää custom domainin juuressa.
- **Julkaisu GitHub Actionsilla** (`actions/deploy-pages`), ei manuaalista
  gh-pages-branchia. GitHub Actions säilyy deploy-polkuna myös custom
  domainilla.
- **Custom domain, DNS ja TLS tehdään erillisessä infra-vaiheessa** GitHub
  Pagesin asetuksissa/API:ssa. Julkaisuun ei lisätä CNAME-tiedostoa; merge,
  Pages-asetus ja DNS koordinoidaan yhdeksi käyttöönotoksi.
- **Domainin vaihto vaihtaa selaimen originin.** Nykyinen
  localStorage-edistyminen ei siirry automaattisesti uuteen osoitteeseen, ja
  vanha PWA-asennus pitää asentaa uudelleen. Kertaluonteinen resetointi on
  hyväksytty; storage-migraatiota ei toteuteta.

## Miksi

Suunnitelma vaatii backendittömän v1:n, ja Pages on ilmainen staattinen isäntä.
Reitittimen poisjättö on tietoinen valinta: se on Pages-yhteensopivin ja riittää,
koska deep-linkkejä ei tarvita. Oma domain antaa pysyvän, siistin osoitteen;
alipolusta luopuminen yksinkertaistaa asset- ja PWA-polut juureen.
