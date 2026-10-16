import eventData from "../data/eventData";
import useCountdown from "../hooks/useCountdown";
import AnimatedBackground from "./AnimatedBackground";

// Etiquetas de la cuenta regresiva (días/horas/min/seg) — cambia
// aquí el texto si lo quieres en otro idioma o abreviado distinto.
const UNITS = [
  { key: "days", label: "días" },
  { key: "hours", label: "hrs" },
  { key: "minutes", label: "min" },
  { key: "seconds", label: "seg" },
];

/**
 * CUENTA REGRESIVA + fecha/hora del evento + código de vestimenta.
 * La fecha se calcula sola desde eventData.dateISO (se actualiza
 * cada segundo, ver hooks/useCountdown.js).
 */
export default function Countdown() {
  const time = useCountdown(eventData.dateISO);

  return (
    <section
      id="detalles"
      className="relative overflow-hidden px-6 py-20 text-center"
    >
      <AnimatedBackground variant="b" />

      <div className="relative z-10">
        {/* Etiqueta cursiva de sección — MISMO estilo en todas las
            secciones (Countdown, Ubicación, RSVP, Álbum) para que
            se vean parejas. TAMAÑO: text-base sm:text-lg · COLOR: var(--color-clay) */}
        <p className="font-[var(--font-display)] italic text-base sm:text-lg text-[var(--color-clay)]">
          nos vemos en
        </p>

        {time.isPast ? (
          <p className="mt-6 font-[var(--font-script)] text-3xl sm:text-4xl text-[var(--color-sage-dark)]">
            ¡Hoy es el gran día! 🎉
          </p>
        ) : (
          <div className="mt-6 flex justify-center gap-3 sm:gap-5">
            {UNITS.map((u) => (
              <div
                key={u.key}
                className="flex w-16 sm:w-20 flex-col items-center rounded-xl border border-[var(--color-sand)] bg-white/60 py-3 backdrop-blur-sm"
              >
                {/* Número grande de cada unidad (12, 05, etc.)
                    TAMAÑO: text-2xl sm:text-3xl · COLOR: var(--color-cocoa-deep) */}
                <span className="font-[var(--font-display)] text-2xl sm:text-3xl font-semibold text-[var(--color-cocoa-deep)] tabular-nums">
                  {String(time[u.key]).padStart(2, "0")}
                </span>
                {/* Etiqueta chica "días/hrs/min/seg" */}
                <span className="mt-1 text-[10px] uppercase tracking-widest text-[var(--color-cocoa)]/70">
                  {u.label}
                </span>
              </div>
            ))}
          </div>
        )}

        <div className="mt-12 flex items-center justify-center gap-6 sm:gap-10">
          <div className="text-center">
            <p className="text-xs uppercase tracking-widest text-[var(--color-cocoa)]/70">
              {eventData.dateLabelDay}
            </p>
            {/* Número del día — el texto más grande de esta sección.
                TAMAÑO: text-5xl · COLOR: var(--color-clay) */}
            <p className="font-[var(--font-display)] text-5xl font-bold text-[var(--color-clay)]">
              {eventData.dateLabelNumber}
            </p>
            <p className="text-xs uppercase tracking-widest text-[var(--color-cocoa)]/70">
              {eventData.dateLabelMonth}
            </p>
          </div>
          <div className="h-16 w-px bg-[var(--color-sand)]" />
          <div className="text-center">
            <p className="text-xs uppercase tracking-widest text-[var(--color-cocoa)]/70">
              a las
            </p>
            <p className="font-[var(--font-display)] text-3xl font-semibold text-[var(--color-cocoa-deep)]">
              {eventData.timeLabel}
            </p>
          </div>
        </div>

        {/* Código de vestimenta — texto chico en mayúsculas, color
            script secundario (var(--color-sage-dark)) para diferenciarlo */}
        <p className="mt-8 text-xs uppercase tracking-[0.2em] text-[var(--color-sage-dark)]">
          {eventData.dressCode}
        </p>
      </div>
    </section>
  );
}
