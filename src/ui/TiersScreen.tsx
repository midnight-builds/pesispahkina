import { useGame } from '../state/GameContext';
import {
  AVAUTUMISEEN_TARVITAAN,
  IKALUOKAT,
  VAIKEUSTASOT,
  VAIKEUSTASO_NIMI,
} from '../domain/config';
import { Stars } from './Stars';

export function TiersScreen() {
  const { selectedIkaluokka, ageGroupState, poolSize, startRound, goHome } = useGame();
  if (!selectedIkaluokka) return null;

  const info = IKALUOKAT.find((i) => i.koodi === selectedIkaluokka)!;
  const group = ageGroupState(selectedIkaluokka);

  return (
    <div className="screen">
      <header className="topbar">
        <button className="btn btn--ghost btn--icon" onClick={goHome} aria-label="Takaisin">
          ←
        </button>
        <h2 className="topbar__title">
          {info.nimi} <span className="topbar__meta">{info.ikakuvaus}</span>
        </h2>
      </header>

      <p className="section-label">Valitse vaikeustaso</p>
      <div className="cards">
        {VAIKEUSTASOT.map((tier) => {
          const state = group.tiers[tier];
          const count = poolSize({ ikaluokka: selectedIkaluokka, vaikeustaso: tier });
          const playable = state.unlocked && count > 0;
          const comingSoon = state.unlocked && count === 0;

          return (
            <div key={tier} className={'card card--tier' + (state.unlocked ? '' : ' card--locked')}>
              <span className="card__body">
                <span className="card__title">
                  {!state.unlocked && <span aria-hidden>🔒 </span>}
                  {VAIKEUSTASO_NIMI[tier]}
                </span>
                <span className="card__meta">
                  {state.best ? (
                    <>
                      Paras: <Stars count={state.best.stars} /> · {state.best.score} p
                    </>
                  ) : state.unlocked ? (
                    'Ei vielä pelattu'
                  ) : (
                    `Avautuu ${AVAUTUMISEEN_TARVITAAN} onnistuneesta kierroksesta`
                  )}
                </span>
                {state.unlocked && state.streak > 0 && (
                  <span className="card__progress">
                    Putki avautumiseen: {Math.min(state.streak, AVAUTUMISEEN_TARVITAAN)}/
                    {AVAUTUMISEEN_TARVITAAN}
                  </span>
                )}
              </span>
              <span className="card__status">
                {playable && (
                  <button
                    className="btn btn--primary"
                    onClick={() => startRound({ ikaluokka: selectedIkaluokka, vaikeustaso: tier })}
                  >
                    Pelaa
                  </button>
                )}
                {comingSoon && <span className="chip chip--muted">Tulossa</span>}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
