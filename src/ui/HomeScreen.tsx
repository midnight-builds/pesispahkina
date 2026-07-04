import { useGame } from '../state/GameContext';
import { IKALUOKAT, VAIKEUSTASO_NIMI } from '../domain/config';
import { highestUnlockedTier } from '../domain/progression';
import { Stars } from './Stars';

export function HomeScreen() {
  const { save, openTiers, openSettings } = useGame();

  return (
    <div className="screen">
      <header className="hero">
        <h1 className="hero__title">
          Pesä<span className="hero__accent">Pähkinä</span>
        </h1>
        <p className="hero__subtitle">Opi pesäpallon säännöt pelaamalla.</p>
      </header>

      <p className="section-label">Valitse ikäluokka</p>
      <div className="cards">
        {IKALUOKAT.map((info) => {
          const started = save.ageGroups[info.koodi];
          const tier = started ? highestUnlockedTier(started) : null;
          const bestStars = started
            ? Math.max(0, ...Object.values(started.tiers).map((t) => t.best?.stars ?? 0))
            : 0;
          return (
            <button
              key={info.koodi}
              className="card card--age"
              onClick={() => openTiers(info.koodi)}
            >
              <span className="card__badge">{info.koodi}</span>
              <span className="card__body">
                <span className="card__title">{info.nimi}</span>
                <span className="card__meta">{info.ikakuvaus}</span>
              </span>
              <span className="card__status">
                {tier ? (
                  <>
                    <span className="chip">{VAIKEUSTASO_NIMI[tier]}</span>
                    {bestStars > 0 && <Stars count={bestStars} />}
                  </>
                ) : (
                  <span className="chip chip--muted">Aloita</span>
                )}
              </span>
            </button>
          );
        })}
      </div>

      <footer className="home-footer">
        <div className="stat">
          <span className="stat__value">{save.totalPoints}</span>
          <span className="stat__label">pistettä</span>
        </div>
        <div className="stat">
          <span className="stat__value">{save.achievements.length}</span>
          <span className="stat__label">saavutusta</span>
        </div>
        <button className="btn btn--ghost" onClick={openSettings}>
          ⚙ Asetukset
        </button>
      </footer>
    </div>
  );
}
