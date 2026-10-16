import {
  collection, doc, getDoc, setDoc, updateDoc, onSnapshot, serverTimestamp,
} from "firebase/firestore";
import { db, isFirebaseConfigured } from "./config";

// Familia de prueba: abre /?f=demo para ver el formulario sin Firebase.
const DEMO = {
  id: "demo", name: "Tía Carmen", side: "rosa",
  maxGuests: 10, status: "pendiente", confirmedGuests: 0, comment: "",
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

// ── Solo para /admin ─────────────────────────────────────────
const CHARS = "abcdefghjkmnpqrstuvwxyz23456789";
export const makeId = (name) => {
  const slug = name.normalize("NFD").replace(/[\u0300-\u036f]/g, "")
    .toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
  const rand = Array.from(crypto.getRandomValues(new Uint8Array(6)),
    (b) => CHARS[b % CHARS.length]).join("");
  return `${slug}-${rand}`;
};

export const createFamily = ({ name, side, max }) =>
  setDoc(doc(db, "families", makeId(name)), {
    name, side, maxGuests: Number(max),
    status: "pendiente", confirmedGuests: 0, comment: "",
  });

export const subscribeToFamilies = (cb) =>
  onSnapshot(collection(db, "families"), (s) =>
    cb(s.docs.map((d) => ({ id: d.id, ...d.data() })))
  );
