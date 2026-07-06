# Kysymysten lähdemetadata: `lahde` + `tarkistettu`, ei numeerista vaikeuspistettä

## Päätös

`Question`-tyyppiin lisätään kaksi **valinnaista** kenttää:

- `lahde?: { dokumentti: string; kohta?: string; url?: string }` — mistä
  virallisesta säännöstä väite on peräisin. `kohta` viittaa luvun/aiheen
  nimeen (esim. "Kenttä ja pelipaikat"), **ei sivu- tai pykälänumeroon**,
  koska Pesäpalloliiton sääntö-PDF päivittyy vuosittain ja numerointi voi
  muuttua.
- `tarkistettu?: string` (muotoa `VVVV-KK-PP`) — milloin kysymys on viimeksi
  verrattu ajantasaisiin virallisiin sääntöihin.

Kentät ovat valinnaisia, jotta olemassa olevaa ~1300 rivin kysymyspankkia ei
tarvitse migratoida kertarysäyksellä. Uusille kysymyksille täyttö on
suositeltavaa (ks. `docs/agents/adding-content.md`).

Käyttöliittymään lisätään kysymyskohtainen "Lähde"-nappi (reveal-näkymä),
joka näyttää `lahde`- ja `tarkistettu`-tiedot silloin kun ne on annettu.
Ilman `lahde`-kenttää nappia ei näytetä.

**Ei** lisätä 0–100-vaikeuspistettä. `vaikeustaso`-enum on jo sidottu
pelimekaniikkaan (lokerot, ADR 0001). Käsin arvattu jatkuva luku olisi
epäluotettava ilman oikeaa pelidataa; jos hienojakoisempi vaikeus joskus
tarvitaan, se kannattaa **johtaa** vastausdatasta eikä arvata etukäteen.

## Miksi

Pelaaja kyseenalaisti kysymyksen termin ("onko sisäkenttä oikea termi") eikä
sovellus pystynyt osoittamaan väitettä todeksi tai vääräksi mitenkään muuta
kuin viittaamalla yleiseen sääntösivuun. Kysymyskohtainen lähde ja
tarkistuspäivä tekevät jokaisesta väitteestä auditoitavan, ja
tarkistuspäivä paljastaa kysymykset jotka pitää käydä läpi uudestaan kun
seuraavan vuoden pelisäännöt julkaistaan.

Numeerinen vaikeuspiste jätettiin pois, koska sille ei ole tässä vaiheessa
konkreettista käyttötarkoitusta pelimekaniikassa, ja käsin kirjoitettuna se
olisi vain arvaus — spekulatiivista koodia, jota ADR 0004 nimenomaan
pyrkii välttämään.
