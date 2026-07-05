import { PixelSprite } from './pixel';
import { starSprite } from './sprites';

export function Stars({
  count,
  max = 3,
  className,
  scale = 2,
}: {
  count: number;
  max?: number;
  className?: string;
  scale?: number;
}) {
  return (
    <span className={'stars ' + (className ?? '')} aria-label={`${count}/${max} tähteä`}>
      {Array.from({ length: max }, (_, i) => (
        <PixelSprite key={i} sprite={starSprite(i < count)} scale={scale} />
      ))}
    </span>
  );
}
