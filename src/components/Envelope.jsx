import { useState } from "react";
import eventData from "../data/eventData";
import Star from "./illustrations/Star";

/**
 * Pantalla de bienvenida en forma de sobre. Al tocar el sello,
 * la solapa se abre (animación 3D) y tras una breve pausa se
 * dispara `onOpen`, que el padre usa para revelar la invitación.
 */
export default function Envelope({ onOpen }) {
  const [opening, setOpening] = useState(false);

  const handleOpen = () => {
    if (opening) return;
    setOpening(true);
    // deja que la animación de la solapa se vea antes de pasar de pantalla
    setTimeout(() => onOpen?.(), 1100);
  };

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center bg-[var(--color-cream)] transition-opacity duration-700 ${
        opening ? "opacity-0 pointer-events-none" : "opacity-100"
      }`}
      style={{ perspective: "1200px" }}
    >
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <Star className="twinkle absolute left-[12%] top-[18%] w-4" />
        <Star className="twinkle absolute right-[15%] top-[24%] w-3" style={{ animationDelay: ".6s" }} />
        <Star className="twinkle absolute left-[20%] bottom-[20%] w-3" style={{ animationDelay: "1.2s" }} />
        <Star className="twinkle absolute right-[18%] bottom-[16%] w-4" style={{ animationDelay: ".3s" }} />
      </div>

      <button
        onClick={handleOpen}
        aria-label="Abrir invitación"
        className="group relative w-[82vw] max-w-sm aspect-[3/2] focus:outline-none"
        style={{ transformStyle: "preserve-3d" }}
      >
        {/* cuerpo del sobre */}
        <div className="absolute inset-0 rounded-md bg-[var(--color-cream-dark)] border border-[var(--color-sand)] shadow-[0_18px_40px_-12px_rgba(74,49,34,0.35)]" />

        {/* solapa trasera visible al abrir */}
        <div
          className="absolute inset-x-0 top-0 h-1/2 origin-top rounded-t-md"
          style={{
            background:
              "linear-gradient(160deg, var(--color-sand) 0%, var(--color-sand-dark) 100%)",
            clipPath: "polygon(0 0, 100% 0, 50% 62%)",
          }}
        />

        {/* solapa frontal animada */}
        <div
          className={`absolute inset-x-0 top-0 h-1/2 origin-top rounded-t-md transition-transform duration-1000 ease-in-out ${
            opening ? "[transform:rotateX(-165deg)]" : "group-hover:[transform:rotateX(-8deg)]"
          }`}
          style={{
            background:
              "linear-gradient(200deg, var(--color-sand-dark) 0%, var(--color-clay) 100%)",
            clipPath: "polygon(0 0, 100% 0, 50% 62%)",
            transformStyle: "preserve-3d",
          }}
        />

        {/* sello de cera */}
        <div
          className={`absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center justify-center w-16 h-16 rounded-full shadow-md transition-transform duration-300 ${
            opening ? "scale-0" : "group-hover:scale-105"
          }`}
          style={{ background: "var(--color-clay)" }}
        >
          <span className="text-2xl">🧸</span>
        </div>

        {/* Tarjeta que se asoma al abrir — nombre de la bebé en script.
            TAMAÑO: text-xl sm:text-2xl · COLOR: var(--color-cocoa) */}
        <div
          className={`absolute left-1/2 -translate-x-1/2 bottom-[8%] w-[78%] rounded-sm bg-[var(--color-cream)] border border-[var(--color-sand)] px-4 py-3 text-center shadow-sm transition-all duration-700 ${
            opening ? "translate-y-[-38%] opacity-100" : "opacity-0"
          }`}
        >
          <p className="font-[var(--font-script)] text-xl sm:text-2xl text-[var(--color-cocoa)]">
            {eventData.babyName}
          </p>
        </div>
      </button>

      {/* Instrucción debajo del sobre — texto de cuerpo estándar */}
      <p className="absolute bottom-10 left-0 right-0 text-center text-sm sm:text-base tracking-wide text-[var(--color-cocoa)]/70 float-in">
        Toca el sobre para abrir tu invitación
      </p>
    </div>
  );
}
