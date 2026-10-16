// ─────────────────────────────────────────────────────────────
//  DATOS DEL EVENTO — este es el ÚNICO archivo que necesitas
//  editar para cambiar textos, fecha, lugar, etc. Ningún
//  componente tiene textos "quemados"; todos leen de aquí.
// ─────────────────────────────────────────────────────────────

const eventData = {
  babyName: "Arya Sofía", // nombre corto, se muestra grande en la portada
  babyFullName: "Arya Sofía Avalos Ortiz", // nombre completo (por si lo usas en algún texto formal)
  parents: ["Juan Carlos", "Brenda Yuritzi"],
  hosts: "Juan Carlos y Brenda Yuritzi", // quién invita, se muestra en el hero

  // Mensaje que se muestra en el hero
  message:
    "Con todo nuestro amor, queremos compartir contigo la alegría de esperar a nuestra pequeña.",

  // Fecha y hora en formato ISO — se usa para la cuenta regresiva
  // Ciudad de México es UTC-06:00
  dateISO: "2026-11-28T16:00:00-06:00",

  // Textos de fecha ya formateados, para mostrarse en pantalla
  dateLabelDay: "SÁBADO",
  dateLabelNumber: "28",
  dateLabelMonth: "noviembre",
  timeLabel: "4:00 P.M.",

  location: {
    name: "Salón Chatillon Bombón",
    address:
      "Añil 119, Granjas México, Iztacalco, 08400 Ciudad de México, CDMX",
    // Coordenadas exactas del salón (sacadas del enlace de Google Maps)
    lat: 19.4048354,
    lng: -99.1127548,
  },

  dressCode: "Casual elegante · tonos rosa pastel",

  // Identificador único del evento — separa los datos en Firebase
  // si algún día usas el mismo proyecto de Firebase para varios eventos.
  eventId: "arya-sofia-baby-shower-2027",

  // Ruta pública a la que apunta el código QR del álbum de fotos
  uploadPath: "/subir-foto",

  // Lugares totales de la invitación (se usa en el panel /admin)
  capacity: 100,
};

// URL pública del sitio. Se usa para el QR y los links por familia.
// Defínela en VITE_SITE_URL (ej. https://arya-baby-shower.vercel.app)
export const siteUrl = (
  import.meta.env.VITE_SITE_URL ||
  (typeof window !== "undefined" ? window.location.origin : "")
).replace(/\/$/, "");

export default eventData;