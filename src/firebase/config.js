import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// Estas variables viven en tu .env (ver .env.example). Solo Firestore:
// las fotos van a Cloudinary, así no se necesita tarjeta en Firebase.
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

export const isFirebaseConfigured = Boolean(
  firebaseConfig.apiKey && firebaseConfig.projectId
);

const app = isFirebaseConfigured
  ? getApps().length ? getApp() : initializeApp(firebaseConfig)
  : null;

export const db = app ? getFirestore(app) : null;
export default app;
