import { useRef, useState } from "react";

/**
 * Botón flotante que activa/pausa una pista en loop.
 * Por política de los navegadores, el audio no puede autoreproducirse
 * sin interacción — por eso arranca en pausa y el invitado lo activa.
 *
 * El archivo de música NO puede incluir la canción real por derechos
 * de autor. Reemplaza /public/music/hotel-lobby-placeholder.mp3 por tu
 * copia legalmente adquirida de "Hotel Lobby" (Quavo & Takeoff), con
 * el mismo nombre — o cambia el nombre aquí abajo.
 */
export default function MusicPlayer({ src = "/music/hotel-lobby-placeholder.mp3" }) {
  const audioRef = useRef(null);
  const [playing, setPlaying] = useState(false);

  const toggle = () => {
    const audio = audioRef.current;
    if (!audio) return;
    if (playing) {
      audio.pause();
    } else {
      audio.play().catch(() => {
        // si el archivo placeholder aún no existe, evitamos romper la UI
      });
    }
    setPlaying(!playing);
  };

  return (
    <div className="fixed bottom-5 right-5 z-40">
      <audio ref={audioRef} src={src} loop preload="none" />
      <button
        onClick={toggle}
        aria-label={playing ? "Pausar música" : "Reproducir música"}
        // TAMAÑO del botón: h-12 w-12 · COLOR: var(--color-cocoa-deep)
        className="flex h-12 w-12 items-center justify-center rounded-full bg-[var(--color-cocoa-deep)] text-[var(--color-cream)] shadow-lg transition-transform hover:scale-105"
      >
        <span className={playing ? "sway inline-block" : ""}>
          {playing ? "🔊" : "🔈"}
        </span>
      </button>
    </div>
  );
}
