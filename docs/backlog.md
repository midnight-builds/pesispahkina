# Backlog / tulevat versiot

Kevyt lista ideoista, joita ei toteuteta v1:ssä. Ei sitova.

## v2

- **Tuomarikysymykset.** Oma aihealue (tai laajennus `roolit`/uuteen `tuomarointi`-
  aihealueeseen): tuomarin merkit, ratkaisut ja tuomarointiin liittyvät säännöt.
  Tarkista termit ja merkit virallisista säännöistä (ks. `docs/pesapallo-lahteet.md`).
- **Sovelluksen sisäinen palaute kysymyksestä.** Pelaajan pitää voida ilmoittaa
  helposti, jos kysymys on väärin tai muuten palautteen arvoinen (esim. pieni
  "Ilmoita kysymyksestä" -painike vastauksen paljastuksen yhteydessä).
  - Tavoite: **mahdollisimman helppo ja sovelluksen sisäinen** — ei erillistä
    sähköpostia tai ulkoista lomaketta pelaajalle.
  - Avoin kysymys: mihin palaute päätyy ilman backendiä? Vaihtoehtoja: valmiiksi
    täytetty GitHub-issue -linkki (avaa selaimen), `mailto:`-linkki, tai kevyt
    ulkoinen lomakepalvelu. Palautteessa mukaan kysymyksen `id` automaattisesti.
  - Muista: v1 on backendittömästi GitHub Pagesissa (ks. ADR 0003).

## Myöhemmin (ei aikataulua)

- Adaptiivisempi kertaus (nykyinen on kevyt, ks. ADR 0001).
- Kuvitetut/animoidut kysymykset (kuvakenttä on jo skeemassa).
- Ikäluokat C, B, A ja lisää vaikeustasosisältöä (~160 kysymystä, vaiheittain).
- Vaihtoehtoiset pelimuodot (aikahaaste, tosi/epätosi).
