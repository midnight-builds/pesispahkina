import { useState } from 'react';
import { useGame } from '../state/GameContext';
import { ACHIEVEMENTS } from '../domain/achievements';

export function SettingsScreen() {
  const { save, updateSettings, doResetProgress, goHome } = useGame();
  const [confirming, setConfirming] = useState(false);
  const earned = new Set(save.achievements);

  return (
    <div className="screen">
      <header className="topbar">
        <button className="btn btn--ghost btn--icon" onClick={goHome} aria-label="Takaisin">
          ←
        </button>
        <h2 className="topbar__title">Asetukset</h2>
      </header>

      <div className="settings">
        <label className="toggle">
          <span>
            <span className="toggle__title">Äänet</span>
            <span className="toggle__meta">Onnistumisäänet ja fanfaarit</span>
          </span>
          <input
            type="checkbox"
            checked={save.settings.soundEnabled}
            onChange={(e) => updateSettings({ soundEnabled: e.target.checked })}
          />
        </label>

        <label className="toggle">
          <span>
            <span className="toggle__title">Animaatiot</span>
            <span className="toggle__meta">Juhla-animaatiot ja liikkeet</span>
          </span>
          <input
            type="checkbox"
            checked={save.settings.animationsEnabled}
            onChange={(e) => updateSettings({ animationsEnabled: e.target.checked })}
          />
        </label>
      </div>

      <p className="section-label">Saavutukset ({earned.size}/{ACHIEVEMENTS.length})</p>
      <div className="achievements achievements--grid">
        {ACHIEVEMENTS.map((a) => (
          <div key={a.id} className={'achievement' + (earned.has(a.id) ? '' : ' achievement--locked')}>
            <span className="achievement__emoji">{earned.has(a.id) ? a.emoji : '🔒'}</span>
            <span className="achievement__text">
              <strong>{a.nimi}</strong>
              <span>{a.kuvaus}</span>
            </span>
          </div>
        ))}
      </div>

      <div className="danger">
        <p className="section-label">Etenemisen nollaus</p>
        {!confirming ? (
          <button className="btn btn--danger btn--wide" onClick={() => setConfirming(true)}>
            Nollaa kaikki edistyminen
          </button>
        ) : (
          <div className="danger__confirm">
            <p>Tämä poistaa kaikki pisteet, tasot ja saavutukset. Asetukset säilyvät. Tätä ei voi perua.</p>
            <div className="danger__buttons">
              <button
                className="btn btn--danger"
                onClick={() => {
                  doResetProgress();
                }}
              >
                Kyllä, nollaa
              </button>
              <button className="btn btn--ghost" onClick={() => setConfirming(false)}>
                Peruuta
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
