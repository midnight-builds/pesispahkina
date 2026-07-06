import { useMemo } from 'react';
import { useGame } from '../state/GameContext';
import { VAIKEUSTASO_NIMI } from '../domain/config';
import { pickComment, type CommentSituation } from '../domain/comments';
import { QuestionSourceButton } from './QuestionSourceButton';

export function RoundScreen() {
  const { round, chooseAnswer, advance, goHome } = useGame();

  const revealed = round?.phase === 'revealed';
  const current = round?.questions[round.index];

  // Kommentti vakautetaan kysymys+vaihe-kohtaisesti (ei vaihdu uudelleenpiirrossa).
  const comment = useMemo(() => {
    if (!round || round.phase !== 'revealed') return '';
    const last = round.answers[round.answers.length - 1];
    if (!last) return '';
    let situation: CommentSituation;
    if (!last.correct) situation = 'vaarin';
    else if (last.streakAfter >= 3) situation = 'putki';
    else situation = 'oikein';
    return pickComment(situation);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [round?.index, round?.phase]);

  if (!round || !current) return null;

  const total = round.questions.length;
  const pointsSoFar = round.answers.reduce((s, a) => s + a.pointsEarned, 0);
  const q = current.question;
  const lastAnswer = round.answers[round.answers.length - 1];
  const isLast = round.index + 1 >= total;

  return (
    <div className="screen">
      <header className="topbar">
        <button type="button" className="btn btn--ghost btn--icon" onClick={goHome} aria-label="Keskeytä">
          ✕
        </button>
        <div className="round-meta">
          <span className="chip">
            {round.lokero.ikaluokka} · {VAIKEUSTASO_NIMI[round.lokero.vaikeustaso]}
          </span>
          {round.streak >= 2 && <span className="chip chip--fire">🔥 {round.streak}</span>}
        </div>
      </header>

      <div className="progress" aria-label={`Kysymys ${round.index + 1}/${total}`}>
        <div className="progress__bar" style={{ width: `${((round.index + 1) / total) * 100}%` }} />
      </div>
      <div className="round-status">
        <span>
          Kysymys {round.index + 1}/{total}
        </span>
        <span>{pointsSoFar} p</span>
      </div>

      <div className="question">
        <p className="question__text">{q.kysymys}</p>
      </div>

      <div className="options">
        {current.optionOrder.map((originalIndex, displayIndex) => {
          const isCorrect = originalIndex === q.oikeaIndeksi;
          const isChosen = round.chosenDisplayIndex === displayIndex;
          let cls = 'option';
          if (revealed) {
            if (isCorrect) cls += ' option--correct';
            else if (isChosen) cls += ' option--wrong';
            else cls += ' option--dim';
          }
          return (
            <button
              key={displayIndex}
              type="button"
              className={cls}
              disabled={revealed}
              onClick={() => chooseAnswer(displayIndex)}
            >
              <span className="option__key" aria-hidden>
                {String.fromCharCode(65 + displayIndex)}
              </span>
              <span>{q.vaihtoehdot[originalIndex]}</span>
            </button>
          );
        })}
      </div>

      {revealed && lastAnswer && (
        <div className={'reveal' + (lastAnswer.correct ? ' reveal--ok' : ' reveal--no')}>
          <p className="reveal__headline">{comment}</p>
          <p className="reveal__explanation">{q.selitys}</p>
          <QuestionSourceButton lahde={q.lahde} tarkistettu={q.tarkistettu} />
          <button type="button" className="btn btn--primary btn--wide" onClick={advance}>
            {isLast ? 'Näytä tulokset' : 'Jatka'}
          </button>
        </div>
      )}
    </div>
  );
}
