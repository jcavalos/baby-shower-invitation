import Balloon from "./illustrations/Balloon";

const COLORS = [
  "var(--color-balloon-1)",
  "var(--color-balloon-2)",
  "var(--color-balloon-3)",
  "var(--color-balloon-4)",
  "var(--color-balloon-5)",
];

// posiciones (left %), tamaño, duración y retraso — variados a mano
// para que no se vea repetitivo ni sincronizado
const CONFIG = [
  { left: "6%", w: 34, dur: 16, delay: 0 },
  { left: "18%", w: 24, dur: 20, delay: 4 },
  { left: "32%", w: 40, dur: 14, delay: 2 },
  { left: "48%", w: 22, dur: 22, delay: 7 },
  { left: "62%", w: 30, dur: 17, delay: 1 },
  { left: "76%", w: 26, dur: 19, delay: 5.5 },
  { left: "88%", w: 36, dur: 15, delay: 3 },
];

/**
 * Globos pastel subiendo lentamente de abajo hacia arriba, de forma
 * continua, dentro de la sección donde se coloque (necesita `relative`
 * y `overflow-hidden` en el contenedor padre).
 *
 * COLOR: usa los 5 tonos --color-balloon-1..5 definidos en index.css.
 * TAMAÑO de cada globo: campo "w" en CONFIG (en píxeles).
 * VELOCIDAD: campo "dur" en CONFIG (segundos que tarda en subir).
 */
export default function RisingBalloons({ count = 7, className = "" }) {
  const items = CONFIG.slice(0, count);
  return (
    <div className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`}>
      {items.map((c, i) => (
        <Balloon
          key={i}
          color={COLORS[i % COLORS.length]}
          className="balloon-rise absolute bottom-0"
          style={{
            left: c.left,
            width: c.w,
            animationDuration: `${c.dur}s`,
            animationDelay: `${c.delay}s`,
          }}
        />
      ))}
    </div>
  );
}
