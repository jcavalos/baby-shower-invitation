import { useEffect, useState } from "react";
import { QRCodeCanvas } from "qrcode.react";
import { subscribeToPhotos, thumb } from "../firebase/photos";
import { isFirebaseConfigured } from "../firebase/config";
import eventData, { siteUrl } from "../data/eventData";
import AnimatedBackground from "./AnimatedBackground";

/**
 * ÁLBUM CON CÓDIGO QR — el QR apunta a /subir-foto (ver
 * src/pages/UploadPhoto.jsx). Cualquier invitado que lo escanee
 * puede subir sus fotos ahí, y aquí se muestran en vivo.
 */
export default function PhotoAlbum() {
  const [photos, setPhotos] = useState([]);
  const uploadUrl = `${siteUrl}${eventData.uploadPath}`;

  useEffect(() => {
    if (!isFirebaseConfigured) return;
    const unsubscribe = subscribeToPhotos(setPhotos);
    return unsubscribe;
  }, []);

  const downloadQR = () => {
    const canvas = document.getElementById("album-qr-canvas");
    if (!canvas) return;
    const link = document.createElement("a");
    link.download = `qr-album-${eventData.babyName.toLowerCase()}.png`;
    link.href = canvas.toDataURL("image/png");
    link.click();
  };

  return (
    <section className="relative overflow-hidden px-6 py-20 text-center">
      <AnimatedBackground variant="a" />

      <div className="relative z-10 mx-auto max-w-sm">
        {/* Etiqueta cursiva — mismo estilo que las demás secciones.
            TAMAÑO: text-base sm:text-lg · COLOR: var(--color-clay) */}
        <p className="font-[var(--font-display)] italic text-base sm:text-lg text-[var(--color-clay)]">
          álbum del día
        </p>
        <p className="mt-2 text-sm sm:text-base text-[var(--color-cocoa)]/85">
          Escanea el código con tu celular y sube las fotos que tomes en el
          evento. Todas se juntan aquí, en un solo álbum.
        </p>

        {/* Código QR — fgColor usa el mismo tono que var(--color-cocoa-deep)
            (#642f4a). Si cambias esa variable en index.css, actualiza
            también este valor a mano (las libs de QR no leen variables CSS). */}
        <div className="mt-6 inline-block rounded-2xl border border-[var(--color-sand)] bg-white p-4">
          <QRCodeCanvas
            id="album-qr-canvas"
            value={uploadUrl}
            size={168}
            bgColor="#ffffff"
            fgColor="#642f4a"
            level="M"
            includeMargin
          />
        </div>

        <div className="mt-3 flex flex-col items-center gap-2">
          <button
            onClick={downloadQR}
            className="text-sm underline text-[var(--color-cocoa)]/70"
          >
            Descargar QR para imprimir
          </button>
          <a
            href={eventData.uploadPath}
            className="text-sm text-[var(--color-sage-dark)] underline"
          >
            O abre el álbum directamente desde aquí →
          </a>
        </div>

        {photos.length > 0 && (
          <div className="mt-8 grid grid-cols-3 gap-2">
            {photos.slice(0, 12).map((p) => (
              <img
                key={p.id}
                src={thumb(p.url)}
                alt={`Foto de ${p.uploaderName}`}
                className="aspect-square w-full rounded-lg object-cover"
                loading="lazy"
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
