import {
  collection, addDoc, onSnapshot, query, orderBy, serverTimestamp,
} from "firebase/firestore";
import { db } from "./config";
import eventData from "../data/eventData";

// Fotos: se suben a Cloudinary (gratis, sin tarjeta) y la URL se guarda en
// Firestore para que el álbum se actualice en vivo. UN solo álbum para todos.
const CLOUD = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
const PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

const photosCollection = () =>
  collection(db, "events", eventData.eventId, "photos");

/** Miniatura ligera (cuadrada, WebP/AVIF automático) para la galería. */
export const thumb = (url, size = 400) =>
  url?.includes("/upload/")
    ? url.replace("/upload/", `/upload/w_${size},h_${size},c_fill,q_auto,f_auto/`)
    : url;

/** Reduce fotos de celular (5-10 MB) a ~1800 px antes de subirlas. */
async function compress(file, max = 1800) {
  try {
    const bmp = await createImageBitmap(file, { imageOrientation: "from-image" });
    const k = Math.min(1, max / Math.max(bmp.width, bmp.height));
    const canvas = document.createElement("canvas");
    canvas.width = Math.round(bmp.width * k);
    canvas.height = Math.round(bmp.height * k);
    canvas.getContext("2d").drawImage(bmp, 0, 0, canvas.width, canvas.height);
    const blob = await new Promise((r) => canvas.toBlob(r, "image/jpeg", 0.82));
    return blob || file;
  } catch {
    return file; // si el navegador no puede, sube el original
  }
}

export async function uploadEventPhoto(file, uploaderName = "", onProgress) {
  if (!CLOUD || !PRESET) throw new Error("cloudinary-not-configured");
  const body = new FormData();
  body.append("file", await compress(file));
  body.append("upload_preset", PRESET);

  const url = await new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open("POST", `https://api.cloudinary.com/v1_1/${CLOUD}/image/upload`);
    xhr.upload.onprogress = (e) =>
      e.lengthComputable && onProgress?.(Math.round((e.loaded / e.total) * 100));
    xhr.onload = () => {
      try {
        const res = JSON.parse(xhr.responseText);
        xhr.status < 300 && res.secure_url ? resolve(res.secure_url) : reject(new Error(res.error?.message || "upload-failed"));
      } catch (e) { reject(e); }
    };
    xhr.onerror = () => reject(new Error("network"));
    xhr.send(body);
  });

  await addDoc(photosCollection(), {
    url,
    uploaderName: uploaderName.trim().slice(0, 60) || "Invitado",
    createdAt: serverTimestamp(),
  });
  return url;
}

export function subscribeToPhotos(callback) {
  const q = query(photosCollection(), orderBy("createdAt", "desc"));
  return onSnapshot(q, (s) => callback(s.docs.map((d) => ({ id: d.id, ...d.data() }))));
}
