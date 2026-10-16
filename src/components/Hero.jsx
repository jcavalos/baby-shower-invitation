import eventData from "../data/eventData";
import AnimatedBackground from "./AnimatedBackground";
import BalloonBear from "./BalloonBear";

/**
 * HERO — primera sección después de abrir el sobre.
 * Los textos salen de eventData.js:
 *   eventData.babyName -> "Arya Sofía"
 *   eventData.message  -> "Con todo nuestro amor, queremos compartir contigo la alegría de esperar a nuestra pequeña."
 *   eventData.hosts    -> "Juan Carlos y Brenda Yuritzi"
 */
export default function Hero() {
  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden px-4 sm:px-6 pt-14 pb-10 text-center">
      <AnimatedBackground variant="a" />

      <div className="relative z-10 mt-6 sm:mt-8 mb-2 flex justify-center">
        <BalloonBear />
      </div>

      {/* Texto pequeño superior (mayúsculas) */}
      <p className="float-in relative z-10 mt-2 text-sm sm:text-base uppercase text-[#b085c9]">
        Una pequeña está en camino
      </p>

      {/* Título grande, color morado, sin negritas */}
      <h1 className="float-in relative z-10 mt-3 font-normal leading-tight text-[#a070c4] text-[40px] sm:text-[44px]">
        Baby Shower
      </h1>

      {/* Nombre de la bebé en cursiva */}
      <p className="float-in relative z-10 mt-2 italic font-normal leading-tight text-[#a070c4] text-[36px] sm:text-[40px]">
        {eventData.babyName}
      </p>

      {/* Mensaje */}
      <p className="float-in relative z-10 mt-5 max-w-xs sm:max-w-3xl text-base sm:text-[17px] leading-relaxed text-[#b07fae]">
        {eventData.message}
      </p>

      {/* Firma */}
      <p className="float-in relative z-10 mt-4 text-[14px] sm:text-[15px] text-[#a77ba6]">
        Con cariño, {eventData.hosts}
      </p>

      {/* Llamado a bajar */}
      <a
        href="#detalles"
        className="float-in relative z-10 mt-10 inline-flex items-center gap-1 text-[13px] uppercase text-[#b07fae]"
      >
        Desliza para descubrir más
        <span className="inline-block animate-bounce">↓</span>
      </a>
    </section>
  );
}