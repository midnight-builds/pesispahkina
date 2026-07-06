import { useState } from 'react';
import type { Lahde } from '../domain/types';

interface QuestionSourceButtonProps {
  lahde?: Lahde;
  tarkistettu?: string;
}

/** Näyttää kysymyskohtaisen sääntölähteen, jos se on annettu (ks. ADR 0005). */
export function QuestionSourceButton({ lahde, tarkistettu }: QuestionSourceButtonProps) {
  const [open, setOpen] = useState(false);

  if (!lahde) return null;

  return (
    <>
      <button type="button" className="btn btn--ghost btn--small" onClick={() => setOpen(true)}>
        🔍 Lähde
      </button>
      {open && (
        <div className="modal-backdrop" role="presentation" onClick={() => setOpen(false)}>
          <div
            className="modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="source-modal-title"
            onClick={(e) => e.stopPropagation()}
          >
            <header className="modal__header">
              <h2 id="source-modal-title" className="modal__title">
                Kysymyksen lähde
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
              {lahde.dokumentti}
              {lahde.kohta ? ` — ${lahde.kohta}` : ''}
            </p>
            {tarkistettu && <p className="modal__text">Tarkistettu: {tarkistettu}</p>}
            {lahde.url && (
              <a
                className="btn btn--primary btn--wide"
                href={lahde.url}
                target="_blank"
                rel="noopener noreferrer"
              >
                Avaa lähde ↗
              </a>
            )}
          </div>
        </div>
      )}
    </>
  );
}
