import { useState } from "react";
import eventData from "../data/eventData";
import RisingBalloons from "./RisingBalloons";
import BalloonCluster from "./illustrations/BalloonCluster";
import { PALETTES } from "./illustrations/balloonPalettes";
import OrchidLeaves from "./illustrations/OrchidLeaves";
import "./Envelope.css";

/**
 * Pantalla de bienvenida en forma de sobre rosa con sello "A | S",
 * orquídeas y globos. Al tocarlo, la solapa se abre (animación 3D) y
 * tras una breve pausa se dispara `onOpen`, que el padre usa para
 * revelar la invitación.
 *
 * ── DÓNDE CAMBIAR CADA COSA ──────────────────────────────────────
 *  Iniciales del sello ........ constante MONOGRAM (aquí abajo)
 *  Textos (título / botón) .... constantes TITLE y CTA (aquí abajo)
 *  Colores y textura del sobre . Envelope.css (.env-back, .env-flap-*, …)
 *  Tamaño del sobre ........... Envelope.css (.env-stage)
 *  Fotos de orquídeas ......... public/images/orquidea-a|b|c.webp
 *  Posición/tamaño de adornos . bloque "ADORNOS" más abajo (en % del sobre)
 *  Globos (colores) ........... illustrations/balloonPalettes.js
 */
const MONOGRAM = ["A", "S"];
const TITLE = "¡Estan invitados!";
const CTA = "TOCA PARA ABRIR";

/** Orquídea (imagen) con posición, giro y un balanceo muy suave. */
function Orchid({ src, rot = 0, sway = "env-sway", style }) {
  return (
    <div className="absolute" style={{ ...style, transform: `rotate(${rot}deg)` }}>
      <img
        src={src}
        alt=""
        draggable="false"
        decoding="async"
        className={`${sway} block w-full select-none`}
        style={{ filter: "drop-shadow(0 7px 7px rgba(100, 47, 74, 0.32))" }}
      />
    </div>
  );
}

/** Sello de cera con las iniciales. */
function WaxSeal({ className = "" }) {
  return (
    <svg viewBox="0 0 100 100" className={className} aria-hidden="true">
      <defs>
        <radialGradient id="seal-wax" cx="36%" cy="30%" r="75%">
          <stop offset="0%" stopColor="#f08db4" />
          <stop offset="55%" stopColor="#d44f82" />
          <stop offset="100%" stopColor="#9c2c5d" />
        </radialGradient>
      </defs>
      <path
        d="M50 3 C 63 1 75 7 83 16 C 93 24 99 38 96 52 C 99 67 90 81 80 89 C 70 97 56 99 46 97 C 32 99 18 91 10 79 C 1 67 1 50 5 38 C 8 24 18 11 31 7 C 37 5 43 4 50 3 Z"
        fill="url(#seal-wax)"
      />
      <circle cx="50" cy="50" r="33" fill="none" stroke="#ffffff" strokeOpacity="0.4" strokeWidth="1.5" />
      <circle cx="50" cy="50" r="29.5" fill="none" stroke="#7a1f48" strokeOpacity="0.25" strokeWidth="1" />
      <text
        x="37"
        y="59"
        textAnchor="middle"
        fontFamily="'Cormorant Garamond', Georgia, serif"
        fontWeight="600"
        fontSize="30"
        fill="#fff"
      >
        {MONOGRAM[0]}
      </text>
      <line x1="50" y1="34" x2="50" y2="66" stroke="#fff" strokeWidth="1.6" strokeOpacity="0.9" />
      <text
        x="63"
        y="59"
        textAnchor="middle"
        fontFamily="'Cormorant Garamond', Georgia, serif"
        fontWeight="600"
        fontSize="30"
        fill="#fff"
      >
        {MONOGRAM[1]}
      </text>
    </svg>
  );
}

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
      className={`env-screen fixed inset-0 z-50 flex flex-col items-center justify-center overflow-hidden transition-opacity duration-500 ${
        opening ? "pointer-events-none opacity-0 delay-[650ms]" : "opacity-100"
      }`}
      style={{ perspective: "1400px" }}
    >
      {/* ───────── Fondo: burbujas + globos subiendo ───────── */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
        <div className="env-bubble" style={{ width: "26vmin", height: "26vmin", left: "-6vmin", top: "8%" }} />
        <div className="env-bubble" style={{ width: "34vmin", height: "34vmin", right: "-9vmin", top: "-8vmin" }} />
        <div className="env-bubble" style={{ width: "18vmin", height: "18vmin", left: "9%", bottom: "6%" }} />
        <div className="env-bubble" style={{ width: "30vmin", height: "30vmin", right: "-7vmin", bottom: "-6vmin" }} />
        <div className="env-bubble" style={{ width: "9vmin", height: "9vmin", left: "30%", top: "6%" }} />
        <div className="env-bubble" style={{ width: "7vmin", height: "7vmin", right: "28%", bottom: "9%" }} />
        <RisingBalloons count={5} />
      </div>

      {/* ───────── Título ───────── */}
      <h1
        className="env-intro relative z-10 mb-[clamp(2rem,6vh,3.6rem)] text-center font-[var(--font-script)] font-bold leading-none text-[var(--color-cocoa-deep)]"
        style={{
          fontSize: "clamp(2.5rem, 9vw, 4.6rem)",
          textShadow: "0 2px 0 rgba(255,255,255,0.85), 0 6px 18px rgba(238,106,151,0.35)",
        }}
      >
        {TITLE}
      </h1>

      {/* ───────── Sobre + adornos ───────── */}
      <div className="env-stage">
        <button
          onClick={handleOpen}
          aria-label="Abrir invitación"
          className="group absolute inset-0 cursor-pointer rounded-lg focus:outline-none focus-visible:ring-4 focus-visible:ring-[var(--color-clay)] focus-visible:ring-offset-4"
          style={{ transformStyle: "preserve-3d" }}
        >
          {/* cuerpo */}
          <div className="env-paper env-back absolute inset-0" />

          {/* tarjeta que se asoma al abrir (queda detrás de los bolsillos) */}
          <div
            className={`absolute left-1/2 bottom-[6%] z-10 h-[74%] w-[80%] -translate-x-1/2 rounded-md border border-[var(--color-sand)] bg-[var(--color-cream)] px-4 pt-[5%] text-center shadow-md transition-all duration-700 ease-out ${
              opening ? "translate-y-[-46%] opacity-100" : "opacity-0"
            }`}
          >
            <p
              className="font-[Cormorant_Garamond,Georgia,serif] italic text-[var(--color-cocoa)]"
              style={{ fontSize: "clamp(0.9rem, 2.6vw, 1.25rem)" }}
            >
              Baby Shower
            </p>
            <p
              className="font-[var(--font-script)] font-bold leading-tight text-[var(--color-cocoa-deep)]"
              style={{ fontSize: "clamp(1.6rem, 6vw, 2.8rem)" }}
            >
              {eventData.babyName}
            </p>
          </div>

          {/* bolsillos frontales (los triángulos de abajo) */}
          <div className="pointer-events-none absolute inset-0 z-[12] overflow-hidden rounded-lg">
            <div className="env-paper env-pocket-side-l absolute inset-0" />
            <div className="env-paper env-pocket-side-r absolute inset-0" />
          </div>
          <div
            className="pointer-events-none absolute inset-0 z-[13] rounded-lg"
            style={{ filter: "drop-shadow(0 -2px 3px rgba(120,30,70,0.28))" }}
          >
            <div className="env-paper env-pocket-bottom absolute inset-0 rounded-b-lg" />
          </div>

          {/* solapa: cara de afuera (rosa) y cara de adentro (rosa claro) */}
          <div
            className={`absolute inset-x-0 top-0 h-[54%] origin-top transition-transform duration-1000 ease-in-out ${
              opening
                ? "z-[5] [transform:rotateX(-172deg)] [transition-property:transform,z-index] [transition-delay:0s,0.35s]"
                : "z-[20] group-hover:[transform:rotateX(-9deg)]"
            }`}
            style={{ transformStyle: "preserve-3d" }}
          >
            <div
              className="absolute inset-0"
              style={{
                backfaceVisibility: "hidden",
                filter: "drop-shadow(0 7px 6px rgba(120,30,70,0.30))",
              }}
            >
              <div className="env-paper env-flap-front absolute inset-0" />
            </div>
            <div
              className="absolute inset-0"
              style={{ backfaceVisibility: "hidden", transform: "rotateX(180deg)" }}
            >
              <div className="env-paper env-flap-inside absolute inset-0" />
            </div>
          </div>

          {/* sello en la punta de la solapa */}
          <div
            className={`absolute left-1/2 top-[54%] z-30 -translate-x-1/2 -translate-y-1/2 transition-all duration-300 ${
              opening ? "scale-0 opacity-0" : "opacity-100"
            }`}
            style={{ width: "clamp(4.4rem, 19%, 8rem)" }}
          >
            <div className="env-seal-pulse">
              <WaxSeal className="block w-full drop-shadow-[0_6px_6px_rgba(100,30,60,0.45)]" />
            </div>
          </div>
        </button>

        {/* ═════════════ ADORNOS (no reciben clics) ═════════════
            Todas las medidas son % del tamaño del sobre, así se
            acomodan solas en celular y computadora.
            · width  = qué tan grande se ve
            · left / right / top / bottom = dónde está (negativo = sale del sobre)
            · rot    = giro en grados */}
        <div className="pointer-events-none absolute inset-0 z-40" aria-hidden="true">
          {/* esquina superior derecha: orquídeas */}
          <OrchidLeaves
            className="absolute"
            uid="ol1"
            style={{ width: "34%", right: "-7%", top: "-8%", transform: "rotate(14deg)" }}
          />
          <Orchid src="/images/orquidea-a.webp" rot={38} style={{ width: "17%", right: "14%", top: "-9%" }} />
          <Orchid src="/images/orquidea-c.webp" rot={10} sway="env-sway-slow" style={{ width: "23%", right: "-5%", top: "-4%" }} />

          {/* esquina inferior izquierda: orquídeas */}
          <OrchidLeaves
            className="absolute"
            uid="ol2"
            style={{ width: "30%", left: "-6%", bottom: "-4%", transform: "scaleX(-1) rotate(-12deg)" }}
          />
          <Orchid src="/images/orquidea-b.webp" rot={-58} style={{ width: "27%", left: "-4%", bottom: "-1%" }} />
          <Orchid src="/images/orquidea-c.webp" rot={-24} sway="env-sway-slow" style={{ width: "17%", left: "15%", bottom: "-7%" }} />

          {/* esquina inferior derecha: ramo grande de globos */}
          <BalloonCluster
            uid="bcA"
            palette={PALETTES.rosa}
            className="env-sway absolute"
            style={{ width: "27%", right: "1%", bottom: "1%" }}
          />

          {/* esquina superior izquierda: dos globos atados al sobre */}
          <BalloonCluster
            uid="bcB"
            palette={PALETTES.pastel}
            className="env-sway-slow absolute"
            style={{ width: "13%", left: "2%", top: "-1%", transform: "scaleX(-1)" }}
          />
        </div>
      </div>

      {/* ───────── Instrucción ───────── */}
      <p
        className="env-intro relative z-10 mt-[clamp(1.6rem,5vh,3rem)] text-center font-[Cormorant_Garamond,Georgia,serif] font-semibold text-[var(--color-cocoa-deep)]"
        style={{
          fontSize: "clamp(1.15rem, 4.6vw, 1.9rem)",
          letterSpacing: "0.28em",
          animationDelay: ".15s",
        }}
      >
        {CTA}
      </p>
    </div>
  );
}
