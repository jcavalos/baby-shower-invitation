/**
 * Globo simple (cuerpo + nudo + cuerda) usado en RisingBalloons
 * (fondo animado) y BalloonBurst (ráfaga al confirmar asistencia).
 * COLOR por defecto: var(--color-balloon-1) — ver la lista completa
 * de 5 tonos pastel en src/index.css (--color-balloon-1..5).
 */
export default function Balloon({ className = "", color = "var(--color-balloon-1)", style }) {
  return (
    <svg
      viewBox="0 0 60 80"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      style={style}
      aria-hidden="true"
    >
      <ellipse cx="30" cy="32" rx="26" ry="30" fill={color} />
      <ellipse cx="21" cy="20" rx="7" ry="10" fill="#ffffff" opacity="0.4" />
      <path d="M27 61 L30 68 L33 61 Z" fill={color} />
      <line x1="30" y1="68" x2="30" y2="80" stroke="#E8CBD8" strokeWidth="1.5" />
    </svg>
  );
}
