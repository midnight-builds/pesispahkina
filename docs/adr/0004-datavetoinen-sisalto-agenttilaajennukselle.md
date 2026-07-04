# Datavetoinen, validoitu sisältö suunniteltu agenttilaajennukselle

## Päätös

Sisältö (kysymykset, ikäluokat, aihealueet, kommentit, saavutukset) on
datavetoista ja suunniteltu niin, että tuleva **Claude Code -sessio** voi lisätä
sitä turvallisesti kylmästä käynnistyksestä. Uudet kysymykset, ikäluokat ja
pelimuodot lisää käytännössä agentti, joten navigoitavuus ja virhepalaute
priorisoidaan.

Tukirakenteet:
- **Yksi ilmeinen paikka per sisältötyyppi**, selkeästi nimetty (kysymysdata,
  ikäluokka-konfiguraatio, kommentit, saavutukset). Ei ripoteltua kovakoodausta.
- **Zod-skeema + testi**, joka hajoaa virheellisestä sisällöstä: duplikaatti-ID,
  lähes identtinen kysymysteksti, tuntematon aihealue/ikäluokka/vaikeustaso,
  ei täsmälleen yhtä oikeaa vastausta.
- **`concept`-tunniste per kysymys** (mitä sääntökohtaa testataan). Sama sääntö
  saa esiintyä eri sanamuodoilla = sama `concept`, eri teksti — mutta rajatusti.
- **Pehmeä concept-jakaumaraportti** per lokero: varoittaa yliedustetusta
  conceptista (~> 3 varianttia) tai liian harvasta kattavuudesta. Ei kaada.
- **Lisäysohje** `docs/agents/`-kansiossa: rituaali kysymyksen, ikäluokan ja
  pelimuodon lisäämiseen (tarkista olemassa olevat conceptit ennen lisäystä).
- **Ohut pelimuoto-sauma**: v1:ssä yksi pelimuoto, mutta kierroslogiikka on
  sauman takana. Ei rakenneta toista muotoa nyt (YAGNI).

## Miksi

Suunnitelma vaatii laajennettavuutta ilman suuria muutoksia, ja käyttäjä vahvisti
että laajennukset tekee agentti. Kova validointi antaa agentille välittömän
palautteen virheistä; concept-tunniste ja pehmeä raportti estävät kysymysten
liiallisen samankaltaisuuden pakottamatta jäykkyyttä; lisäysohje antaa kylmälle
agentille konvention. Spekulatiivista koodia (valmiita lisämuotoja) ei rakenneta.
