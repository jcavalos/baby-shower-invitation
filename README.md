# Invitación digital — Baby Shower de Arya Sofia 🧸

Invitación web con sobre animado, cuenta regresiva, mapa, **confirmación por familia**
(cada familia tiene su link y su número de lugares), **álbum de fotos con QR** y música.
Funciona en cualquier celular abriendo un link, sin instalar nada.

## Cómo funciona (resumen)

- **Confirmaciones:** cada familia recibe su link personal (`https://tusitio/?f=codigo`).
  Al abrirlo ve su nombre y solo puede elegir hasta sus lugares reservados.
  Tú ves todo en `https://tusitio/admin` (confirmados vs. 100, rosa vs. azul, pendientes).
- **Álbum + QR:** el QR es **uno solo** y apunta a `/subir-foto`. Todos los que lo escaneen
  suben a **el mismo álbum**; las fotos se guardan en Cloudinary y aparecen en vivo
  en la invitación y en esa página.
- **Sin tarjeta:** Firebase solo usa Firestore + Authentication (gratis). Las fotos van a Cloudinary (gratis).

## 1. Requisitos
Node.js 18+ · cuenta de Firebase · cuenta de Cloudinary · cuenta de GitHub y de Vercel (todas gratis).

## 2. Probar el diseño YA (sin conectar nada)
```bash
npm install
npm run dev
```
- `http://localhost:5173/?f=demo` → ve y prueba el formulario de confirmación (familia de ejemplo, no guarda nada).
- `http://localhost:5173/subir-foto` → página a la que apunta el QR.

## 3. Firebase (confirmaciones)
1. https://console.firebase.google.com → **Agregar proyecto** (sin Analytics).
2. **Compilación → Firestore Database → Crear base de datos** → modo **producción**.
3. **Compilación → Authentication → Comenzar → Correo/contraseña → activar**.
   Luego pestaña **Usuarios → Agregar usuario**: tu correo y una contraseña. Ese es tu acceso a `/admin`.
4. **⚙️ Configuración del proyecto → Tus apps → `</>` (Web)** → registra la app y copia `apiKey`, `authDomain`, `projectId`, `appId`.
5. **Firestore → Reglas**: pega el contenido de `firestore.rules`, **cambia `TU_CORREO@gmail.com`** por el correo del paso 3 y publica.
   (Importante: sin ese cambio nadie podrá entrar al panel.)

> No actives Storage: no se usa.

## 4. Cloudinary (fotos)
1. https://cloudinary.com → crea cuenta gratis. En el Dashboard copia tu **Cloud name**.
2. **Settings → Upload → Upload presets → Add upload preset**:
   - *Signing mode*: **Unsigned**
   - *Folder*: `baby-shower`
   - *Allowed formats*: `jpg,png,webp,heic`
   - Guarda y copia el **nombre del preset**.

## 5. Variables de entorno
Copia `.env.example` a `.env` y llena los valores (sin comillas). `VITE_SITE_URL` es tu link final
de Vercel (déjalo para el paso 7; mientras tanto puede ir `http://localhost:5173`).

## 6. Cargar las familias
Con `npm run dev` abre `http://localhost:5173/admin`, entra con tu correo y pulsa
**“Cargar las 18 familias”**. Verás cada familia con botones **Copiar link** y **WhatsApp**
(abre WhatsApp con el mensaje y el link personal ya escritos). Las familias salen de `src/data/guests.js`
(edítalo *antes* de cargar). Puedes agregar más con el formulario de abajo.

## 7. Publicar en Vercel
1. Sube la carpeta a GitHub (**no subas el `.env`**; ya está en `.gitignore`).
2. https://vercel.com → **Add New → Project** → importa el repo.
3. En **Environment Variables** agrega las 7 variables del `.env.example`.
4. **Deploy.** Te da `https://algo.vercel.app`.
5. Pon ese link en `VITE_SITE_URL` (Vercel → Settings → Environment Variables), y en `index.html`
   reemplaza `TU-DOMINIO` (vista previa de WhatsApp). Haz **Redeploy**.
6. **Entonces** abre `/admin` en el sitio publicado y copia los links (así llevan el dominio correcto).

## 8. El QR
Está en la sección “álbum del día” con botón **Descargar QR para imprimir**. Apunta a
`VITE_SITE_URL/subir-foto`, por eso descárgalo **desde el sitio publicado** (si lo bajas en localhost,
el QR apuntaría a tu computadora).

## 9. Música
Reemplaza `public/music/hotel-lobby-placeholder.mp3` con tu copia legal de la canción
(mismo nombre), o usa pistas libres (YouTube Audio Library, pixabay.com/music).

## Qué cambió en el rendimiento
- Osito: de 1 MB (PNG) a ~160 KB (WebP). Fotos del álbum: se reducen a 1800 px antes de subir y se muestran como miniaturas.
- RSVP, álbum, música, `/admin` y `/subir-foto` se cargan aparte → la portada abre más rápido.
- Imágenes y música con caché larga (`vercel.json`).

## Estructura
```
src/data/eventData.js   textos, fecha, lugar, capacidad (100)
src/data/guests.js      familias y lugares
src/firebase/           config, auth, rsvp (familias), photos (Cloudinary)
src/components/RSVPForm.jsx   confirmación por familia
src/pages/Admin.jsx           panel /admin
src/pages/UploadPhoto.jsx     destino del QR
firestore.rules         reglas de seguridad
```
