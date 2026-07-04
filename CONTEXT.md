# PesäPähkinä

Selainpeli, joka opettaa pesäpallon sääntöjä lapsille ja heidän vanhemmilleen.
Tämä tiedosto on projektin sanasto (ubiikki kieli) — ei toteutusyksityiskohtia.

## Language

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
Yksi (ikäluokka × vaikeustaso) -yhdistelmä, josta yhden kierroksen kysymykset
poimitaan. Esim. "G / aloittelija".
_Avoid_: bucket, kori

**Kierros**:
Yksi pelikerta = 10 kysymystä yhdestä lokerosta. Päättyy tulosnäkymään.
_Avoid_: peli, sessio

**Kerrattava**:
Kysymys, jonka pelaajan viimeisin vastaus meni väärin. Nostetaan
todennäköisemmin takaisin tuleviin kierroksiin. Ks. [[0001-kevyt-kertausmekaniikka]].
_Avoid_: virhe, väärä kysymys

**Aihealue**:
Kysymyksen sisältöluokka. Yksi per kysymys. Laajennettava lista; nykyiset arvot:
`perusteet` (Perusteet ja sanasto), `kentta` (Kenttä ja pesät), `roolit`
(Pelipaikat ja roolit), `lyominen` (Lyöminen ja syöttö), `eteneminen`
(Eteneminen, juoksut ja palot), `ottelu` (Ottelun kulku). Termit tarkistetaan
virallisista säännöistä (ks. `docs/pesapallo-lahteet.md`).
_Avoid_: kategoria, teema, aihe
