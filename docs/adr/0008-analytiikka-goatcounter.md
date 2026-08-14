# SUPERSEDED: Anonyymi analytiikka itse isännöidyllä GoatCounterilla

Tämä ADR on korvattu dokumentilla `0009-analytiikka-umami.md`.

## Päätös

PesisPähkinä kerää käyttötilastot **itse isännöidyllä GoatCounterilla**
osoitteessa `https://analytics.talonpoika.dev/count`. Seurantaskripti
injektoidaan käännettyyn `index.html`:ään Vite-pluginilla
(`analyticsAndCsp`, `vite.config.ts`), kun ympäristömuuttuja
`PUBLIC_GOATCOUNTER_URL` on asetettu.

- **Muuttuja tulee `.env.production`-tiedostosta**, joka on versionhallinnassa.
  URL ei ole salaisuus — se näkyy joka tapauksessa sivun lähdekoodissa. Sama
  tiedosto kattaa sekä tuotanto- (`npm run build`, deploy-workflow) että
  preview-buildin (`npm run preview`), joten CI:hin ei tarvita erillistä
  salaisuutta. Kehityspalvelimessa (`npm run dev`) analytiikkaa ei ladata.
- **Vain sivulataus, ei SPA-näkymävaihtoja.** Sovellus on yhden sivun näkymä-
  tilakone (ks. ADR-0003), eikä näkymävaihdoista lähetetä erillisiä osumia.
- **Sama plugin asettaa CSP:n** `<meta http-equiv="Content-Security-Policy">`
  -tagina, koska GitHub Pages ei salli omia HTTP-otsakkeita. `script-src`,
  `connect-src` ja `img-src` sallivat analytiikkaorigin
  `https://analytics.talonpoika.dev`; `img-src` ja `connect-src` kumpikin siksi,
  että GoatCounter lähettää osuman joko kuvapyyntönä tai `sendBeacon`illa.
  `style-src` sallii `'unsafe-inline'`, koska React kirjoittaa muutaman
  inline-tyyliattribuutin. CSP asetetaan vain buildissa, jotta Viten
  dev-palvelimen HMR ei hajoa.
- **Käyttäjälle kerrotaan asiasta** Asetukset-näkymän Tietosuoja-osiossa.

## Miksi

Palvelu on lapsille ja vanhemmille suunnattu peli, joten kolmannen osapuolen
mainosrahoitteinen analytiikka ei tule kyseeseen. GoatCounter ei käytä evästeitä
eikä tunnista yksittäisiä käyttäjiä, ja itse isännöitynä data pysyy omassa
hallinnassa. Ilman evästeitä ei tarvita evästebanneria; riittää selkeä maininta
asetuksissa.

## Vaihtoehdot

- **Ei analytiikkaa lainkaan.** Yksinkertaisin, mutta ei kerro mitkä ikäluokat
  tai näkökulmat ovat käytössä eikä siten ohjaa sisällön kehitystä.
- **Google Analytics.** Evästeet, suostumusbanneri ja lasten dataa
  mainosekosysteemiin — hylättiin.
- **Skripti suoraan `index.html`:ään ilman env-muuttujaa.** Silloin analytiikka
  osuisi myös kehityspalvelimeen ja saastuttaisi tilastot.
