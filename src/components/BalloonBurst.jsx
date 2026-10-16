import Balloon from "./illustrations/Balloon";

const COLORS = [
  "var(--color-balloon-1)",
  "var(--color-balloon-2)",
  "var(--color-balloon-3)",
  "var(--color-balloon-4)",
  "var(--color-balloon-5)",
];

// ángulos y distancias fijos (no random) para que el resultado sea
// consistente y no dependa de Math.random en cada render
// bx/by = a dónde vuela cada globito (en píxeles) desde el centro
const BURSTS = [
  { bx: -70, by: -130 },
  { bx: -30, by: -160 },
  { bx: 15, by: -170 },
  { bx: 55, by: -150 },
  { bx: 80, by: -110 },
  { bx: -55, by: -95 },
];

/**
 * Ráfaga de globitos que se dispara al confirmar asistencia (ver
 * RSVPForm.jsx). COLOR: mismos 5 tonos --color-balloon-1..5 de
 * index.css. TAMAÑO de cada globito: clase "w-8" más abajo.
 */
export default function BalloonBurst() {
  return (
    <div className="pointer-events-none absolute inset-0 flex items-start justify-center overflow-visible">
      {BURSTS.map((b, i) => (
        <Balloon
          key={i}
          color={COLORS[i % COLORS.length]}
          className="burst-balloon absolute top-1/2 w-8"
          style={{
            "--bx": `${b.bx}px`,
            "--by": `${b.by}px`,
            animationDelay: `${i * 60}ms`,
          }}
        />
      ))}
    </div>
  );
}
