import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
  deleteDoc,
  onSnapshot,
  serverTimestamp,
} from "firebase/firestore";
import { db, isFirebaseConfigured } from "./config";

// Familia de prueba
const DEMO = {
  id: "demo",
  name: "Tía Carmen",
  side: "rosa",
  maxGuests: 10,
  status: "pendiente",
  confirmedGuests: 0,
  comment: "",
};

export async function getFamily(id) {
  if (id === "demo") return DEMO;
  if (!isFirebaseConfigured) throw new Error("firebase-not-configured");

  const snap = await getDoc(doc(db, "families", id));
  return snap.exists() ? { id: snap.id, ...snap.data() } : null;
}

export async function saveRSVP(id, { status, guests, comment }) {
  if (id === "demo") return;

  await updateDoc(doc(db, "families", id), {
    status,
    confirmedGuests: status === "si" ? Number(guests) : 0,
    comment: (comment || "").trim().slice(0, 500),
    respondedAt: serverTimestamp(),
  });
}

// Generador de IDs para familias nuevas
const slug = (name) =>
  name
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

const normalize = (name) => slug(name);

export const makeId = (name) =>
  `${slug(name)}-${crypto.randomUUID().slice(0, 8)}`;

// Agregar una familia manualmente
export const createFamily = ({ name, side, max }) =>
  setDoc(doc(db, "families", makeId(name)), {
    name,
    side,
    maxGuests: Number(max),
    status: "pendiente",
    confirmedGuests: 0,
    comment: "",
  });

// Borrar una familia
export const deleteFamily = (id) => deleteDoc(doc(db, "families", id));

// Sincronizar guests.js con Firebase
export async function syncFamiliesFromGuests(guests) {
  if (!isFirebaseConfigured) {
    throw new Error("Firebase no está configurado.");
  }

  const snapshot = await getDocs(collection(db, "families"));
  const existing = snapshot.docs.map((d) => ({
    id: d.id,
    ...d.data(),
  }));

  const used = new Set();
  let created = 0;
  let updated = 0;

  const nameKey = (name, side) => `${side}:${normalize(name)}`;

  for (const guest of guests) {
    const name = guest.name.trim();
    const side = guest.side;
    const maxGuests = Number(guest.max);
    const sourceId = guest.id || null;

    if (
      !name ||
      !["rosa", "azul"].includes(side) ||
      !Number.isInteger(maxGuests) ||
      maxGuests < 1
    ) {
      throw new Error(`Datos inválidos para la familia: ${guest.name}`);
    }

    const matches = existing.filter(
      (f) =>
        !used.has(f.id) &&
        ((sourceId && f.sourceId === sourceId) ||
          (!sourceId && nameKey(f.name, f.side) === nameKey(name, side)) ||
          (sourceId && nameKey(f.name, f.side) === nameKey(name, side)))
    );

    if (matches.length > 1) {
      throw new Error(
        `Hay familias duplicadas en Firebase: ${name}. Revisa antes de sincronizar.`
      );
    }

    const found = matches[0];

    // Si existe, conserva ID y confirmaciones.
    if (found) {
      used.add(found.id);

      await setDoc(
        doc(db, "families", found.id),
        {
          name,
          side,
          maxGuests,
          ...(sourceId ? { sourceId } : {}),
        },
        { merge: true }
      );

      updated++;
    } else {
      // Una familia nueva recibe un ID estable.
      const id = sourceId || `${side}-${slug(name)}`;

      if (existing.some((f) => f.id === id)) {
        throw new Error(`El identificador ${id} ya existe.`);
      }

      await setDoc(doc(db, "families", id), {
        name,
        side,
        maxGuests,
        sourceId: id,
        status: "pendiente",
        confirmedGuests: 0,
        comment: "",
      });

      used.add(id);
      created++;
    }
  }

  return { created, updated, total: guests.length };
}

export const subscribeToFamilies = (cb) =>
  onSnapshot(collection(db, "families"), (s) =>
    cb(s.docs.map((d) => ({ id: d.id, ...d.data() })))
  );