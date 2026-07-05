import { useState } from 'react';

const RULES_URL = 'https://www.pesis.fi/kilpailu/saannot-maaraykset';

export function RulesInfoButton() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button type="button" className="btn btn--ghost" onClick={() => setOpen(true)}>
        📖 Opi lisää
      </button>
      {open && (
        <div className="modal-backdrop" role="presentation" onClick={() => setOpen(false)}>
          <div
            className="modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="rules-modal-title"
            onClick={(e) => e.stopPropagation()}
          >
            <header className="modal__header">
              <h2 id="rules-modal-title" className="modal__title">
                Pesäpallon säännöt
              </h2>
              <button
                type="button"
                className="btn btn--ghost btn--icon"
                onClick={() => setOpen(false)}
                aria-label="Sulje"
              >
                ✕
              </button>
            </header>
            <p className="modal__text">
              PesisPähkinän kysymykset perustuvat Suomen Pesäpalloliiton virallisiin
              pelisääntöihin ja ikäluokkien erityissääntöihin.
            </p>
            <a
              className="btn btn--primary btn--wide"
              href={RULES_URL}
              target="_blank"
              rel="noopener noreferrer"
            >
              Pesäpalloliiton säännöt ↗
            </a>
          </div>
        </div>
      )}
    </>
  );
}
