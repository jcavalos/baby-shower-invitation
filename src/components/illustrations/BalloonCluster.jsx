import { PALETTES } from "./balloonPalettes";

/**
 * RAMO DE GLOBOS con brillo, nudo y listón — se usa en la pantalla del
 * sobre (Envelope.jsx). Es un solo SVG: los globos y las cuerdas que se
 * juntan en un moño.
 *
 * COLORES: la prop "palette" recibe 3 globos { light, base, dark }:
 *   light = brillo, base = color principal, dark = sombra del borde.
 *   Los colores listos están en balloonPalettes.js (rosa, pastel) o pasa tu propia lista.
 * TAMAÑO: se controla desde donde se usa (className con w-XX o width en %).
 * ID: "uid" evita que dos ramos en la misma pantalla compartan gradientes.
 */

// posición de cada globo dentro del viewBox 220 x 300
const SHAPES = [
  { cx: 66, cy: 92, rx: 50, ry: 58, rot: -8 },
  { cx: 146, cy: 74, rx: 46, ry: 54, rot: 7 },
  { cx: 108, cy: 150, rx: 44, ry: 52, rot: -2 },
];
const TIE = { x: 110, y: 284 }; // donde se juntan las cuerdas

export default function BalloonCluster({
  className = "",
  style,
  palette = PALETTES.rosa,
  uid = "bc",
}) {
  return (
    <svg
      viewBox="0 0 220 300"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      style={style}
      aria-hidden="true"
    >
      <defs>
        {palette.map((p, i) => (
          <radialGradient key={i} id={`${uid}-g${i}`} cx="34%" cy="28%" r="78%">
            <stop offset="0%" stopColor={p.light} />
            <stop offset="45%" stopColor={p.base} />
            <stop offset="100%" stopColor={p.dark} />
          </radialGradient>
        ))}
      </defs>

      {/* cuerdas (van primero para quedar detrás de los nudos) */}
      {SHAPES.map((s, i) => {
        const kx = s.cx;
        const ky = s.cy + s.ry + 6;
        return (
          <path
            key={i}
            d={`M${kx} ${ky} C ${kx} ${ky + 50}, ${TIE.x + (kx - TIE.x) * 0.3} ${TIE.y - 60}, ${TIE.x} ${TIE.y}`}
            fill="none"
            stroke="#d98aa9"
            strokeWidth="1.4"
            strokeLinecap="round"
            opacity="0.85"
          />
        );
      })}

      {/* globos */}
      {SHAPES.map((s, i) => {
        const p = palette[i % palette.length];
        return (
          <g key={i} transform={`rotate(${s.rot} ${s.cx} ${s.cy})`}>
            <ellipse cx={s.cx} cy={s.cy} rx={s.rx} ry={s.ry} fill={`url(#${uid}-g${i})`} />
            {/* nudo */}
            <path
              d={`M${s.cx - 5} ${s.cy + s.ry + 7} L${s.cx} ${s.cy + s.ry - 2} L${s.cx + 5} ${s.cy + s.ry + 7} Z`}
              fill={p.dark}
            />
            {/* brillo principal + reflejo pequeño */}
            <ellipse
              cx={s.cx - s.rx * 0.38}
              cy={s.cy - s.ry * 0.42}
              rx={s.rx * 0.16}
              ry={s.ry * 0.26}
              fill="#ffffff"
              opacity="0.65"
              transform={`rotate(-24 ${s.cx - s.rx * 0.38} ${s.cy - s.ry * 0.42})`}
            />
            <circle cx={s.cx - s.rx * 0.12} cy={s.cy - s.ry * 0.7} r={s.rx * 0.05} fill="#ffffff" opacity="0.6" />
          </g>
        );
      })}

      {/* moño */}
      <g transform={`translate(${TIE.x} ${TIE.y})`}>
        <path d="M0 0 C -16 -12, -26 -4, -22 6 C -18 14, -6 6, 0 0 Z" fill="#ee6a97" />
        <path d="M0 0 C 16 -12, 26 -4, 22 6 C 18 14, 6 6, 0 0 Z" fill="#e0578a" />
        <circle cx="0" cy="0" r="3.4" fill="#c24477" />
        <path d="M-2 3 C -6 12, -10 18, -8 26" fill="none" stroke="#ee6a97" strokeWidth="2.4" strokeLinecap="round" />
        <path d="M2 3 C 6 12, 10 18, 8 26" fill="none" stroke="#e0578a" strokeWidth="2.4" strokeLinecap="round" />
      </g>
    </svg>
  );
}
