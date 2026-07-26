# PesisPähkinä

Selainpeli, joka opettaa pesäpallon sääntöjä lapsille ja heidän vanhemmilleen.
Tämä tiedosto on projektin sanasto (ubiikki kieli) — ei toteutusyksityiskohtia.

## Language

**Näkökulma**:
Kummalta kannalta sääntöä kysytään: `pelaaja` (miten toimin pelaajana) vai
`tuomari` (mikä on oikea ratkaisu, kuka sen tekee ja miten se ilmoitetaan).
Ylin valinta, jonka pelaaja tekee; ikäluokka ja vaikeustaso ovat sen alla.
Sama sääntökohta voi esiintyä molemmissa näkökulmissa eri kysymyksenä.
_Avoid_: rooli (se on Aihealueen `roolit` = pelipaikat), polku, osio, mode

**Ikäluokka**:
Pesäpallon virallinen junio-ikäluokka (G, F, E, D, …), joka pelaaja valitsee.
Kuvaa *kuka pelaaja on*, ei kysymyksen vaikeutta. Pelaajalla voi olla useita
ikäluokkia kesken samanaikaisesti.
_Avoid_: ikätaso, level (sekoittuu vaikeustasoon)

**Vaikeustaso**:
Etenemisporras yhden ikäluokan sisällä: aloittelija → harjoittelija → osaaja →
mestari. Avautuu etenemisen myötä. Kohtisuora akseli ikäluokan kanssa.
_Avoid_: taso, difficulty level (ilman tarkennusta)

**Lokero**:
Yksi (näkökulma × ikäluokka × vaikeustaso) -yhdistelmä, josta yhden kierroksen
kysymykset poimitaan. Esim. "tuomari / E / aloittelija".
_Avoid_: bucket, kori

**Kierros**:
Yksi pelikerta = 10 kysymystä yhdestä lokerosta. Päättyy tulosnäkymään.
_Avoid_: peli, sessio

**Kerrattava**:
Kysymys, jonka pelaajan viimeisin vastaus meni väärin. Nostetaan
todennäköisemmin takaisin tuleviin kierroksiin. Ks. [[0001-kevyt-kertausmekaniikka]].
_Avoid_: virhe, väärä kysymys

**Concept** (sääntökohta):
Lyhyt slug siitä, mitä yksittäistä sääntökohtaa kysymys testaa (esim.
`kolme-paloa-vuoronvaihto`). Sama concept saa esiintyä usealla eri sanamuodolla,
mutta rajatusti. Käytetään samankaltaisuuden hallintaan.
Ks. [[0004-datavetoinen-sisalto-agenttilaajennukselle]].
_Avoid_: aihe (se on Aihealue), tagi

**Pelimuoto**:
Tapa pelata (v1: yksi tietovisakierros). Kierroslogiikka on ohuen pelimuoto-
sauman takana, jotta muita muotoja voi lisätä myöhemmin.
_Avoid_: mode, peli

**Aihealue**:
Kysymyksen sisältöluokka. Yksi per kysymys. Laajennettava lista; nykyiset arvot:
`perusteet` (Perusteet ja sanasto), `kentta` (Kenttä ja pesät), `roolit`
(Pelipaikat ja roolit), `lyominen` (Lyöminen ja syöttö), `eteneminen`
(Eteneminen, juoksut ja palot), `ottelu` (Ottelun kulku). Termit tarkistetaan
virallisista säännöistä (ks. `docs/pesapallo-lahteet.md`).
_Avoid_: kategoria, teema, aihe
