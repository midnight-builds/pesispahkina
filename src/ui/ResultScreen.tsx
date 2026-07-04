import { useMemo } from 'react';
import { useGame } from '../state/GameContext';
import { AVAUTUMISEEN_TARVITAAN, VAIKEUSTASO_NIMI } from '../domain/config';
import { pickComment, type CommentSituation } from '../domain/comments';
import { nextTier } from '../domain/progression';
import { Stars } from './Stars';

export function ResultScreen() {
  const { outcome, save, startRound, goHome } = useGame();

  const comment = useMemo(() => {
    if (!outcome) return '';
    return pickComment(`tulos-${outcome.result.stars}` as CommentSituation);
  }, [outcome]);

  if (!outcome) return null;
  const { result, newlyUnlocked, newAchievements } = outcome;
  const { ikaluokka, vaikeustaso } = result.lokero;
  const total = result.answers.length;

  const tierState = save.ageGroups[ikaluokka]?.tiers[vaikeustaso];
  const almost =
    result.success && !newlyUnlocked && tierState?.streak === AVAUTUMISEEN_TARVITAAN - 1;

  return (
    <div className="screen screen--center">
      <div className="result">
        <Stars count={result.stars} className="stars--big" />
        <p className="result__headline">{comment}</p>

        <div className="result__score">
          <div className="stat">
            <span className="stat__value">
              {result.correctCount}/{total}
            </span>
            <span className="stat__label">oikein</span>
          </div>
          <div className="stat">
            <span className="stat__value">{result.score}</span>
            <span className="stat__label">pistettä</span>
          </div>
        </div>

        {almost && <p className="result__hint">{pickComment('lahella')}</p>}

        {newlyUnlocked && (
          <div className="banner banner--unlock">
            🔓 Uusi taso avautui: <strong>{VAIKEUSTASO_NIMI[newlyUnlocked]}</strong>
          </div>
        )}

        {newAchievements.length > 0 && (
          <div className="achievements">
            {newAchievements.map((a) => (
              <div key={a.id} className="achievement">
                <span className="achievement__emoji">{a.emoji}</span>
                <span className="achievement__text">
                  <strong>{a.nimi}</strong>
                  <span>{a.kuvaus}</span>
                </span>
              </div>
            ))}
          </div>
        )}

        <div className="result__actions">
          {newlyUnlocked && (
            <button
              className="btn btn--primary btn--wide"
              onClick={() => startRound({ ikaluokka, vaikeustaso: nextTier(vaikeustaso)! })}
            >
              Seuraava taso: {VAIKEUSTASO_NIMI[newlyUnlocked]}
            </button>
          )}
          <button
            className="btn btn--secondary btn--wide"
            onClick={() => startRound({ ikaluokka, vaikeustaso })}
          >
            Pelaa uudelleen
          </button>
          <button className="btn btn--ghost btn--wide" onClick={goHome}>
            Takaisin alkuun
          </button>
        </div>
      </div>
    </div>
  );
}
