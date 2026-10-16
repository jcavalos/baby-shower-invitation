import Cloud from "./illustrations/Cloud";
import Star from "./illustrations/Star";
import RisingBalloons from "./RisingBalloons";

/**
 * Fondo decorativo de nubes a la deriva + estrellas titilando +
 * globos subiendo (RisingBalloons). Se coloca en `absolute inset-0`
 * dentro de una sección con `relative`. `variant` cambia ligeramente
 * la composición para que no se vea idéntico sección tras sección.
 *
 * TAMAÑO de las nubes: clases w-XX / sm:w-XX en cada <Cloud>.
 * POSICIÓN: clases left-/right-/top-/bottom- en cada <Cloud>/<Star>.
 * Imagen de la nube: public/images/nube.png (ver Cloud.jsx).
 */
export default function AnimatedBackground({ variant = "a" }) {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      <RisingBalloons count={variant === "a" ? 5 : 4} />

      <Cloud className="cloud-drift-slow cloud-shadow absolute -left-10 top-4 w-40 sm:w-52 opacity-100" />
      <Cloud
        flip
        className="cloud-drift-mid cloud-shadow absolute right-[-2.5rem] top-20 w-48 sm:w-64 opacity-100"
      />
      {variant === "a" && (
        <Cloud className="cloud-drift-fast cloud-shadow absolute left-1/4 bottom-0 w-36 sm:w-44 opacity-95" />
      )}
      {variant === "b" && (
        <Cloud
          flip
          className="cloud-drift-slow cloud-shadow absolute right-1/4 bottom-2 w-32 sm:w-40 opacity-95"
        />
      )}

      <Star className="twinkle absolute left-[8%] top-[14%] w-4" />
      <Star className="twinkle absolute right-[14%] top-[10%] w-3" style={{ animationDelay: "1.1s" }} />
      <Star className="twinkle absolute left-[20%] bottom-[18%] w-3" style={{ animationDelay: "0.5s" }} />
      <Star className="twinkle absolute right-[22%] bottom-[24%] w-4" style={{ animationDelay: "1.8s" }} />
    </div>
  );
}
