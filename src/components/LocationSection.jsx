import eventData from "../data/eventData";
import AnimatedBackground from "./AnimatedBackground";

/**
 * UBICACIÓN — nombre y dirección del lugar (eventData.location) +
 * botón que abre Google Maps directo en las coordenadas exactas.
 */
export default function LocationSection() {
  const { name, address, lat, lng } = eventData.location;

  // api=1 + query con lat,lng abre la app de Google Maps directo en móvil,
  // y Google Maps web en escritorio — sin pasos intermedios.
  const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`;

  return (
    <section className="relative overflow-hidden px-6 py-20 text-center">
      <AnimatedBackground variant="a" />

      <div className="relative z-10 mx-auto max-w-sm">
        {/* Etiqueta cursiva — mismo estilo que las demás secciones.
            TAMAÑO: text-base sm:text-lg · COLOR: var(--color-clay) */}
        <p className="font-[var(--font-display)] italic text-base sm:text-lg text-[var(--color-clay)]">
          nos encontramos en
        </p>

        {/* Nombre del salón, en letra script.
            TAMAÑO: text-3xl sm:text-4xl · COLOR: var(--color-sage-dark) */}
        <p className="mt-3 font-[var(--font-script)] text-3xl sm:text-4xl text-[var(--color-sage-dark)]">
          {name}
        </p>

        {/* Dirección — texto de cuerpo normal */}
        <p className="mt-2 text-sm sm:text-base text-[var(--color-cocoa)]/85">
          {address}
        </p>

        {/* Botón a Google Maps — texto de botón estándar (text-sm) */}
        <a
          href={mapsUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-8 inline-flex items-center gap-2 rounded-full border border-[var(--color-cocoa)] px-7 py-3 text-sm tracking-wide text-[var(--color-cocoa-deep)] transition-colors hover:bg-[var(--color-cocoa-deep)] hover:text-[var(--color-cream)]"
        >
          📍 Ver mapa y cómo llegar
        </a>
      </div>
    </section>
  );
}
