export function Stars({ count, max = 3, className }: { count: number; max?: number; className?: string }) {
  return (
    <span className={'stars ' + (className ?? '')} aria-label={`${count}/${max} tähteä`}>
      {Array.from({ length: max }, (_, i) => (
        <span key={i} className={'stars__star' + (i < count ? ' stars__star--on' : '')}>
          ★
        </span>
      ))}
    </span>
  );
}
