import { lazy, Suspense, useState } from "react";
import Envelope from "../components/Envelope";
import Hero from "../components/Hero";
import Countdown from "../components/Countdown";
import LocationSection from "../components/LocationSection";
import Footer from "../components/Footer";
import Reveal from "../components/Reveal";
import { isFirebaseConfigured } from "../firebase/config";

// Secciones de más abajo: se cargan aparte para que la portada salga rápido.
const RSVPForm = lazy(() => import("../components/RSVPForm"));
const PhotoAlbum = lazy(() => import("../components/PhotoAlbum"));
const MusicPlayer = lazy(() => import("../components/MusicPlayer"));

/**
 * PÁGINA PRINCIPAL — arma el orden de toda la invitación.
 * Para reordenar secciones (por ejemplo, poner el álbum antes que
 * el RSVP), solo cambia el orden de las líneas <Reveal>...</Reveal>
 * aquí abajo. "Reveal" hace que cada sección aparezca con un fade
 * suave al hacer scroll — el Hero no lo usa porque ya tiene su
 * propia animación de entrada (float-in) al abrir el sobre.
 */
export default function InvitationPage() {
  const [opened, setOpened] = useState(false);

  return (
    <div className="min-h-screen bg-[var(--color-cream)]">
      {!opened && <Envelope onOpen={() => setOpened(true)} />}

      {!isFirebaseConfigured && opened && (
        <div className="sticky top-0 z-40 bg-[var(--color-clay)] px-4 py-2 text-center text-xs text-white">
          Modo vista previa: Firebase aún no está conectado (ver README.md). Prueba el formulario en /?f=demo
        </div>
      )}

      <div
        className={`transition-opacity duration-700 ${
          opened ? "opacity-100" : "opacity-0"
        }`}
      >
        <Hero />
        <Reveal><Countdown /></Reveal>
        <Reveal><LocationSection /></Reveal>
        <Suspense fallback={null}>
          <Reveal><RSVPForm /></Reveal>
          <Reveal><PhotoAlbum /></Reveal>
        </Suspense>
        <Reveal><Footer /></Reveal>
      </div>

      {opened && <Suspense fallback={null}><MusicPlayer /></Suspense>}
    </div>
  );
}
