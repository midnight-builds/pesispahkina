/**
 * Geneerinen retro-tausta (ei esitä mitään pesäpalloon liittyvää): tumma
 * gradientti + himmeä arcade-ruudukko + tähtikenttä ja muutama kelluva
 * pikselivinoneliö. Vaimennettu niin että paneelit lukevat päällä.
 *
 * Täyttää kehyksen (preserveAspectRatio slice).
 */
const W = 120;
const H = 210;

// Deterministinen PRNG → tähtien paikat pysyvät samana joka renderissä.
function mulberry32(seed: number) {
  let a = seed;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function RetroBackdrop() {
  const rnd = mulberry32(20240705);

  const stars = Array.from({ length: 54 }, (_, i) => {
    const x = rnd() * W;
    const y = rnd() * H;
    const size = rnd() < 0.18 ? 1.2 : 0.7;
    const opacity = (0.22 + rnd() * 0.5).toFixed(2);
    return <rect key={i} x={x} y={y} width={size} height={size} fill={`rgba(255,255,255,${opacity})`} />;
  });

  const diamonds = Array.from({ length: 6 }, (_, i) => {
    const s = 2 + rnd() * 2.5;
    const x = rnd() * W;
    const y = rnd() * H;
    return (
      <rect
        key={i}
        x={x}
        y={y}
        width={s}
        height={s}
        transform={`rotate(45 ${x + s / 2} ${y + s / 2})`}
        fill="rgba(120,150,255,0.1)"
      />
    );
  });

  return (
    <svg
      className="app__backdrop"
      viewBox={`0 0 ${W} ${H}`}
      preserveAspectRatio="xMidYMid slice"
      shapeRendering="geometricPrecision"
      aria-hidden
    >
      <defs>
        <linearGradient id="rbBg" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#1b1446" />
          <stop offset="0.55" stopColor="#140b32" />
          <stop offset="1" stopColor="#0d0524" />
        </linearGradient>
        <radialGradient id="rbGlow" cx="0.5" cy="0.12" r="0.7">
          <stop offset="0" stopColor="#3a2f7a" stopOpacity="0.5" />
          <stop offset="1" stopColor="#3a2f7a" stopOpacity="0" />
        </radialGradient>
        <pattern id="rbGrid" width="12" height="12" patternUnits="userSpaceOnUse">
          <path d="M12 0H0V12" fill="none" stroke="rgba(130,150,255,0.055)" strokeWidth="0.5" />
        </pattern>
      </defs>
      <rect x="0" y="0" width={W} height={H} fill="url(#rbBg)" />
      <rect x="0" y="0" width={W} height={H} fill="url(#rbGlow)" />
      <rect x="0" y="0" width={W} height={H} fill="url(#rbGrid)" />
      {diamonds}
      {stars}
    </svg>
  );
}
