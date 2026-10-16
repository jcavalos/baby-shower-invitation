import eventData from "../data/eventData";
import Star from "./illustrations/Star";

/**
 * PIE DE PÁGINA — cierre de la invitación.
 */
export default function Footer() {
  return (
    <footer className="relative overflow-hidden px-6 py-16 text-center">
      <div className="pointer-events-none absolute inset-0">
        <Star className="twinkle absolute left-[15%] top-[20%] w-3" />
        <Star className="twinkle absolute right-[18%] top-[30%] w-4" style={{ animationDelay: ".7s" }} />
      </div>

      {/* Frase de cierre en script — mismo tamaño que el nombre del
          salón en LocationSection, para que ambos textos script
          secundarios se vean parejos.
          TAMAÑO: text-3xl sm:text-4xl · COLOR: var(--color-sage-dark) */}
      <p className="relative z-10 font-[var(--font-script)] text-3xl sm:text-4xl text-[var(--color-sage-dark)]">
        ¡Te esperamos!
      </p>

      {/* Firma de los papás (eventData.hosts) */}
      <p className="relative z-10 mt-3 text-sm sm:text-base text-[var(--color-cocoa)]/70">
        Con cariño, {eventData.hosts}
      </p>
    </footer>
  );
}
