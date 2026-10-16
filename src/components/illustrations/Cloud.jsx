/**
 * Nube recortada de la imagen que compartió el usuario
 * (public/images/nube.png, fondo ya transparente).
 * `flip` la refleja horizontalmente para variar la composición
 * sin necesitar un segundo archivo de imagen.
 *
 * TAMAÑO: se controla desde donde se usa este componente
 *   (AnimatedBackground.jsx), con clases w-XX / sm:w-XX.
 * Para cambiar la nube por otra imagen: reemplaza
 *   public/images/nube.png por otro PNG con fondo transparente.
 */
export default function Cloud({ className = "", flip = false }) {
  return (
    <img
      src="/images/nube.png"
      alt=""
      aria-hidden="true"
      draggable="false"
      className={className}
      style={flip ? { transform: "scaleX(-1)" } : undefined}
    />
  );
}
