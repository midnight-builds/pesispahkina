/**
 * Taustakuva: pesäpallokenttä ylhäältä päin (EI baseball-timantti, EI
 * "stadion-taivas"). Muoto virallisen juniorikenttäkaavion (2023) mukaan:
 * suorakaide-ulkokenttä ylhäällä, joka kapenee alas kotiin.
 *
 * Pesät oikeilla paikoillaan:
 *  - koti alhaalla keskellä (lyöjän alue)
 *  - 1. ja 2. pesä VASEMMALLA laidalla (1. alempana, 2. takana)
 *  - 3. pesä OIKEALLA, samalla pystytasolla kuin 2.
 *  - juoksijan reitti: koti → 1 → 2 → 3 → koti
 *
 * Vaimennettu niin että paneelit lukevat päällä. Kenttä on aseteltu ruudun
 * alaosaan, jotta pesät näkyvät tyhjässä tilassa paneelien alla.
 */
const GRASS_A = '#122e1b';
const GRASS_B = '#15351f';
const SAND = '#4a3319';
const LINE = 'rgba(233, 245, 233, 0.16)';
const PESA = 'rgba(226, 59, 59, 0.4)';
const PATH = 'rgba(255, 207, 74, 0.26)';
const INK = 'rgba(12, 8, 28, 0.5)';

const W = 120;
const H = 210;
const KOTI = { x: 60, y: 200 };
// Pesätaso: 2. ja 3. samalla korkeudella; 1. tämän ja kodin välissä vasemmalla.
const PESAT = [
  { x: 36, y: 166, n: '1' }, // 1. pesä — vasen laita, keskivaihe
  { x: 24, y: 126, n: '2' }, // 2. pesä — vasen laita, takaosa
  { x: 96, y: 126, n: '3' }, // 3. pesä — oikea laita, samalla tasolla kuin 2.
];
// Kentän ulkoraja: suorat sivut ylhäältä pesätasolle, siitä viistoon kotiin.
const FIELD = `M 14 -6 L 14 126 L ${KOTI.x} ${KOTI.y} L 106 126 L 106 -6 Z`;

export function FieldBackdrop() {
  const stripes = [];
  for (let y = 0; y < H; y += 13) {
    stripes.push(
      <rect key={y} x={0} y={y} width={W} height={13} fill={(y / 13) % 2 === 0 ? GRASS_A : GRASS_B} />,
    );
  }
  // Juoksijan reitti kiertää takaisin kotiin (koti → 1 → 2 → 3 → koti).
  const runPath = [KOTI, ...PESAT, KOTI].map((p) => `${p.x},${p.y}`).join(' ');

  return (
    <svg
      className="field-backdrop"
      viewBox={`0 0 ${W} ${H}`}
      preserveAspectRatio="xMidYMax slice"
      shapeRendering="geometricPrecision"
      aria-hidden
    >
      {stripes}
      {/* kentän sisäpuoli hieman vaaleampi */}
      <path d={FIELD} fill="rgba(255,255,255,0.04)" />
      {/* sisäkenttä / hiekka-alue kodin edessä */}
      <path d={`M ${KOTI.x} ${KOTI.y} L 40 164 L 80 164 Z`} fill={SAND} opacity={0.32} />
      {/* kentän rajat */}
      <path d={FIELD} fill="none" stroke={LINE} strokeWidth={1.2} />
      {/* etenemispolku pesältä pesälle */}
      <polyline points={runPath} fill="none" stroke={PATH} strokeWidth={1.4} strokeDasharray="4 3" />
      {/* pesät */}
      {PESAT.map((p, i) => (
        <g key={i}>
          <circle cx={p.x} cy={p.y} r={4} fill={PESA} stroke={INK} strokeWidth={1} />
          <circle cx={p.x} cy={p.y} r={1.5} fill="rgba(255,255,255,0.45)" />
        </g>
      ))}
      {/* koti (lyöjän alue): puoliympyrä */}
      <path
        d={`M ${KOTI.x - 8} ${KOTI.y} a 8 8 0 0 0 16 0`}
        fill="none"
        stroke="rgba(255,255,255,0.42)"
        strokeWidth={1.2}
      />
      <rect x={KOTI.x - 4} y={KOTI.y - 3} width={8} height={6} fill="rgba(255,255,255,0.4)" stroke={INK} strokeWidth={0.8} />
      {/* kauttaaltaan tummennus, ettei tausta vie huomiota paneeleilta */}
      <rect x={0} y={0} width={W} height={H} fill="url(#fbFade)" />
      <defs>
        <linearGradient id="fbFade" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#0b0420" stopOpacity="0.66" />
          <stop offset="0.4" stopColor="#0b0420" stopOpacity="0.42" />
          <stop offset="1" stopColor="#0b0420" stopOpacity="0.4" />
        </linearGradient>
      </defs>
    </svg>
  );
}
