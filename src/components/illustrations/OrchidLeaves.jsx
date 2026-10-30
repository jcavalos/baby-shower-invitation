/**
 * HOJAS de orquídea (largas y anchas) que van detrás de las flores para
 * que se vean integradas al sobre. Un solo SVG con 3 hojas.
 * COLOR: verdes en los <stop> del gradiente — cámbialos si las quieres
 * más oscuras o más claras. TAMAÑO/POSICIÓN: desde donde se usa.
 */
export default function OrchidLeaves({ className = "", style, uid = "ol" }) {
  return (
    <svg
      viewBox="0 0 240 160"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      style={style}
      aria-hidden="true"
    >
      <defs>
        <linearGradient id={`${uid}-a`} x1="0" y1="1" x2="1" y2="0">
          <stop offset="0%" stopColor="#3f6b52" />
          <stop offset="100%" stopColor="#7fae86" />
        </linearGradient>
        <linearGradient id={`${uid}-b`} x1="0" y1="1" x2="1" y2="0">
          <stop offset="0%" stopColor="#35604a" />
          <stop offset="100%" stopColor="#6f9f7a" />
        </linearGradient>
      </defs>
      <path d="M6 154 C 30 70, 110 14, 232 8 C 170 40, 96 84, 6 154 Z" fill={`url(#${uid}-a)`} />
      <path d="M6 154 C 70 92, 150 52, 232 8" fill="none" stroke="#e4f1e6" strokeWidth="1.2" opacity="0.45" />
      <path d="M10 156 C 60 112, 120 100, 200 112 C 140 126, 80 134, 10 156 Z" fill={`url(#${uid}-b)`} />
      <path d="M8 152 C 18 96, 52 40, 104 6 C 84 56, 52 104, 8 152 Z" fill={`url(#${uid}-b)`} opacity="0.9" />
    </svg>
  );
}
