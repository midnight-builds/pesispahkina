# Kevyt kertausmekaniikka ja "viimeisin tulos" -tallennusmalli

## Päätös

PesäPähkinä käyttää kevyttä kertausta: väärin mennyt kysymys nostetaan
todennäköisemmin takaisin peliin, mutta ilman tiukkaa spaced repetition -takuuta.

Säännöt:
- Jokaisesta vastatusta kysymyksestä muistetaan **vain viimeisin tulos**
  (`right` | `wrong`) per kysymys-ID. Tämä korvaa alkuperäisen suunnitelman
  erilliset "oikein"- ja "väärin"-ID-listat.
- Kysymys on **kerrattava**, jos sen viimeisin tulos oli `wrong`.
- Kierrosta (10 kysymystä yhdestä lokerosta = ikäluokka × vaikeustaso) koottaessa
  täytetään enintään **3 paikkaa** kerrattavilla kysymyksillä samasta lokerosta,
  loput arvotaan satunnaisesti. Ei kahta samaa kysymystä peräkkäin.
- Oikein vastattu kerrattava muuttuu ei-kerrattavaksi; väärin vastattu pysyy
  kerrattavana.

## Miksi

Käyttäjä halusi että lapsi törmää uudelleen juuri niihin sääntöihin jotka menivät
pieleen, mutta v1:n paino on perusloopin toimivuudessa — ei monimutkaisessa
oppimisalgoritmissa ("ei tarvitse olla pommin varma"). Yksi "viimeisin tulos"
-kartta antaa suoraan sekä kerrattavat että tilastot, ja on yksinkertaisempi kuin
kaksi päällekkäistä ID-listaa (kysymys voi olla molemmissa eri aikoina).
