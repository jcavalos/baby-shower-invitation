/**
 * Estrellita de 8 puntas usada como acento decorativo (con la
 * animación "twinkle" de index.css). COLOR por defecto: var(--color-sage).
 * TAMAÑO: se define donde se usa (clases w-3, w-4, etc).
 */
export default function Star({ className = "", color = "var(--color-sage)" }) {
  return (
    <svg
      viewBox="0 0 40 40"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      <path
        d="M20 0 L24 15 L40 20 L24 25 L20 40 L16 25 L0 20 L16 15 Z"
        fill={color}
      />
    </svg>
  );
}
