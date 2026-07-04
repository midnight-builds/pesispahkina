# Julkaisu GitHub Pagesiin ilman URL-reititintä

## Päätös

PesäPähkinä julkaistaan staattisena sivuna **GitHub Pagesiin** midnight-builds-
organisaation projektisivuna: `https://midnight-builds.github.io/pesispahkina/`.
Repo: `git@github.com:midnight-builds/pesispahkina.git`.

Seuraukset:
- **Ei URL-reititintä.** Näkymät (koti, kierros, tulos, asetukset) hoidetaan
  Reactin näkymätilalla. Pagesissa ei ole palvelinuudelleenohjauksia, joten
  SPA-reititys hajoaisi deep-linkissä; näkymätila välttää ongelman kokonaan.
- **Base-polku `/pesispahkina/`.** Viten `base` asetetaan tähän, jotta assetit,
  PWA-manifest ja service worker toimivat alipolussa. Jos myöhemmin siirrytään
  omaan domainiin / user-siteen, base muuttuu `/`:ksi.
- **Julkaisu GitHub Actionsilla** (`actions/deploy-pages`), ei manuaalista
  gh-pages-branchia.

## Miksi

Suunnitelma vaatii backendittömän v1:n, ja Pages on ilmainen staattinen isäntä.
Reitittimen poisjättö on tietoinen valinta: se on Pages-yhteensopivin ja riittää,
koska deep-linkkejä ei tarvita. Alipolku "ainakin aluksi" — oma domain on
mahdollinen myöhemmin.
