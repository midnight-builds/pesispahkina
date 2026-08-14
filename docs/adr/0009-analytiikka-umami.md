# Anonyymi analytiikka itse isännöidyllä Umami v3:lla

## Status

Accepted, supersedes `0008-analytiikka-goatcounter.md`.

## Päätös

PesisPähkinä kerää käyttötilastot itse isännöidyllä Umami v3:lla osoitteessa
`https://analytics.talonpoika.dev`.

- Tuotannossa ladataan Umamin tracker `https://analytics.talonpoika.dev/script.js`
  ja collector on Umamin v3:n mukaisesti `/api/send`.
- Heatmap-keruu otetaan käyttöön lataamalla virallinen
  `https://analytics.talonpoika.dev/recorder.js` tavallisen trackerin rinnalle.
  Umamin asetuksissa `heatmapEnabled` saa olla päällä, mutta `replayEnabled`
  pidetään pois päältä.
- Runtime-loader aktivoi analytiikan vain, jos kaikki ehdot täyttyvät:
  `import.meta.env.PROD`, `VITE_UMAMI_URL`, `VITE_UMAMI_WEBSITE_ID` ja
  `window.location.hostname === 'pesispahkina.talonpoika.dev'`.
- Tavallinen tracker saa lisäksi `data-domains="pesispahkina.talonpoika.dev"`,
  jolloin Umami itsekin kieltäytyy lähettämästä dataa väärästä hostista.
- Buildissa injektoidaan CSP `<meta http-equiv="Content-Security-Policy">`
  -tagina, koska GitHub Pages ei salli omia HTTP-otsakkeita. `script-src` ja
  `connect-src` sallivat analytiikkaoriginin
  `https://analytics.talonpoika.dev`; `img-src` ei tarvitse analytiikkaoriginia,
  koska Umami v3 käyttää tässä asennuksessa `fetch`-pohjaista lähetystä.
- Käyttäjälle kerrotaan Asetukset-näkymässä, että käytössä on anonyymi
  käyttö- ja heatmap-analytiikka ilman evästeitä ja ilman Session Replayta.

## Miksi

Palvelu on lapsille ja vanhemmille suunnattu peli, joten analytiikan pitää
olla mahdollisimman vähäistä, läpinäkyvää ja omassa hallinnassa. Umami v3
mahdollistaa:

- evästeettömän sivulataus- ja SPA-seurannan
- itse isännöidyn datan
- heatmapit ilman erillistä kolmannen osapuolen SDK:ta
- mahdollisuuden pitää Session Replay kokonaan pois käytöstä

## Rajaukset

- `umami.identify()`-kutsuja ei käytetä.
- Distinct ID:tä ei aseteta eikä eventteihin lähetetä henkilötietoja.
- Kehitys- ja preview-hostit eivät lataa analytiikkaskriptejä lainkaan, jotta
  tilastot eivät saastu.

## Vaihtoehdot

- Ei analytiikkaa lainkaan. Yksinkertaisin, mutta ei auta näkemään mitä
  sisältöä käytetään tai miten pitkälle sivuilla edetään.
- GoatCounter. Riitti sivulatauksiin, mutta ei tukenut Umamin kaltaista
  omassa pinossa pysyvää heatmap-keruuta.
- Kolmannen osapuolen analytiikka. Hylättiin lasten palveluun huonosti sopivan
  tietosuoja- ja vendor-riippuvuusriskin vuoksi.
