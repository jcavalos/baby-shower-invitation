import { useState } from "react";

/**
 * OSITO EN SU CANASTA DE GLOBOS — imagen provista por el usuario
 * (public/images/oso-globos.webp), flotando por la escena.
 *
 * TAMAÑO: cambia la prop "size" (o el valor por defecto aquí abajo).
 *   Formato Tailwind: "w-[ancho-en-móvil] sm:w-[ancho-tablet] md:w-[ancho-desktop]"
 * COLOR de los globos/manta: ya viene pintado en el archivo de
 *   imagen — para volver a cambiarlo hay que reprocesar la imagen
 *   original (no se puede recolorear desde CSS al ser un PNG).
 * MOVIMIENTO: la animación "fly-around" está definida en
 *   src/index.css (@keyframes fly) — ahí se ajusta qué tanto se mueve.
 */
export default function BalloonBear({
  className = "",
  size = "w-[22rem] sm:w-[30rem] md:w-[34rem]", // <- TAMAÑO del osito+globos
}) {
  const [bouncing, setBouncing] = useState(false);

  const handleTap = () => {
    if (bouncing) return;
    setBouncing(true);
    setTimeout(() => setBouncing(false), 650); // debe coincidir con la duración de .pop-bounce en index.css
  };

  return (
    <button
      type="button"
      onClick={handleTap}
      aria-label="Osito volando en su canasta de globos"
      className={`fly-around ${size} ${className} block cursor-pointer select-none focus:outline-none`}
    >
      <img
        src="/images/oso-globos.webp"
        alt="Osito de peluche flotando en una canasta con globos"
        className={`w-full h-auto drop-shadow-lg ${bouncing ? "pop-bounce" : ""}`}
        draggable="false"
      />
    </button>
  );
}
