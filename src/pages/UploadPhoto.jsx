import { useEffect, useRef, useState } from "react";
import { uploadEventPhoto, subscribeToPhotos, thumb } from "../firebase/photos";
import { isFirebaseConfigured } from "../firebase/config";
import eventData from "../data/eventData";
import AnimatedBackground from "../components/AnimatedBackground";

/**
 * PÁGINA DE SUBIDA DE FOTOS — a esta ruta (/subir-foto) apunta el
 * código QR de PhotoAlbum.jsx. Cada invitado la abre desde su propio
 * celular, sin necesidad de instalar nada ni tener cuenta.
 */
export default function UploadPhoto() {
  const [name, setName] = useState("");
  const [progress, setProgress] = useState(null);
  const [status, setStatus] = useState("idle"); // idle | uploading | done | error
  const [photos, setPhotos] = useState([]);
  const galleryRef = useRef(null);
  const cameraRef = useRef(null);

  useEffect(() => {
    if (!isFirebaseConfigured) return;
    const unsubscribe = subscribeToPhotos(setPhotos);
    return unsubscribe;
  }, []);

  const handleFiles = async (e) => {
    const files = Array.from(e.target.files || []);
    e.target.value = ""; // permite volver a elegir la misma foto
    if (files.length === 0) return;

    if (!isFirebaseConfigured) {
      setStatus("error");
      return;
    }

    setStatus("uploading");
    try {
      for (const file of files) {
        await uploadEventPhoto(file, name, setProgress);
      }
      setStatus("done");
      setProgress(null);
      setTimeout(() => setStatus("idle"), 2200);
    } catch (err) {
      console.error(err);
      setStatus("error");
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden px-6 py-16 text-center">
      <AnimatedBackground variant="a" />

      <div className="relative z-10 mx-auto max-w-sm">
        {/* Mismo osito de la portada, chiquito, como sello de identidad
            de la página. Imagen: public/images/oso-globos.webp */}
        <img
          src="/images/oso-globos.webp"
          alt=""
          aria-hidden="true"
          className="bear-bob mx-auto w-24"
        />

        {/* Etiqueta cursiva — mismo estilo que el resto del sitio.
            TAMAÑO: text-base sm:text-lg · COLOR: var(--color-clay) */}
        <p className="mt-4 font-[var(--font-display)] italic text-base sm:text-lg text-[var(--color-clay)]">
          álbum de {eventData.babyName}
        </p>
        <p className="mt-2 text-sm sm:text-base text-[var(--color-cocoa)]/85">
          ¡Gracias por venir! Sube aquí las fotos que tomaste, se van a sumar
          al álbum de todos en tiempo real.
        </p>

        <input
          type="text"
          placeholder="Tu nombre (opcional)"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="mt-6 w-full rounded-lg border border-[var(--color-sand)] bg-white px-3 py-2 text-sm outline-none focus:border-[var(--color-clay)]"
        />

        {/* Galería: SIN capture, así el celular ofrece la galería */}
        <input
          ref={galleryRef}
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          onChange={handleFiles}
        />
        {/* Cámara: CON capture, abre la cámara directo */}
        <input
          ref={cameraRef}
          type="file"
          accept="image/*"
          capture="environment"
          className="hidden"
          onChange={handleFiles}
        />

        <div className="mt-4 flex flex-col gap-2">
          <button
            onClick={() => galleryRef.current?.click()}
            disabled={status === "uploading"}
            className="w-full rounded-full bg-[var(--color-cocoa-deep)] py-3 text-sm tracking-wide text-[var(--color-cream)] transition-opacity hover:opacity-90 disabled:opacity-60"
          >
            {status === "uploading"
              ? `Subiendo... ${progress ?? 0}%`
              : "🖼️ Elegir de la galería"}
          </button>
          <button
            onClick={() => cameraRef.current?.click()}
            disabled={status === "uploading"}
            className="w-full rounded-full border border-[var(--color-cocoa-deep)] py-3 text-sm tracking-wide text-[var(--color-cocoa-deep)] disabled:opacity-60"
          >
            📸 Tomar foto
          </button>
        </div>

        {status === "done" && (
          <p className="mt-3 text-sm text-[var(--color-sage-dark)]">
            ¡Listo! Gracias por compartir tu foto 💛
          </p>
        )}
        {status === "error" && (
          <p className="mt-3 text-sm text-red-700">
            {isFirebaseConfigured
              ? "No se pudo subir la foto, intenta de nuevo."
              : "El álbum todavía no está conectado a Firebase (ver README)."}
          </p>
        )}

        {photos.length > 0 && (
          <div className="mt-10">
            <p className="text-xs uppercase tracking-widest text-[var(--color-cocoa)]/70">
              Fotos del álbum ({photos.length})
            </p>
            <div className="mt-3 grid grid-cols-3 gap-2">
              {photos.map((p) => (
                <img
                  key={p.id}
                  src={thumb(p.url)}
                  alt={`Foto de ${p.uploaderName}`}
                  className="aspect-square w-full rounded-lg object-cover"
                  loading="lazy"
                />
              ))}
            </div>
          </div>
        )}

        <a
          href="/"
          className="mt-10 inline-block text-sm underline text-[var(--color-cocoa)]/60"
        >
          ← Volver a la invitación
        </a>
      </div>
    </div>
  );
}