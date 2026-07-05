/**
 * Piirtää {@link Sprite}-merkkiruudukon SVG:nä. crispEdges + pixelated →
 * terävät "8-bit" pikselit missä tahansa skaalassa. Vaakasuorat samanväriset
 * jaksot yhdistetään yhdeksi <rect>:ksi (vähemmän solmuja).
 */
import type { CSSProperties, ReactElement } from 'react';
import type { Sprite } from './sprites';

export function PixelSprite({
  sprite,
  scale = 4,
  className,
  style,
  title,
}: {
  sprite: Sprite;
  scale?: number;
  className?: string;
  style?: CSSProperties;
  title?: string;
}) {
  const { w, h, rows, palette } = sprite;
  const rects: ReactElement[] = [];
  rows.forEach((row, y) => {
    let x = 0;
    while (x < row.length) {
      const ch = row[x];
      const color = palette[ch];
      if (!color) {
        x++;
        continue;
      }
      let run = 1;
      while (x + run < row.length && row[x + run] === ch) run++;
      rects.push(<rect key={`${x}-${y}`} x={x} y={y} width={run} height={1} fill={color} />);
      x += run;
    }
  });
  return (
    <svg
      className={className}
      width={w * scale}
      height={h * scale}
      viewBox={`0 0 ${w} ${h}`}
      shapeRendering="crispEdges"
      style={{ imageRendering: 'pixelated', display: 'block', ...style }}
      role={title ? 'img' : 'presentation'}
      aria-label={title}
      aria-hidden={title ? undefined : true}
    >
      {rects}
    </svg>
  );
}
