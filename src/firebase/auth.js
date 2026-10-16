import { getAuth } from "firebase/auth";
import app from "./config";

// Solo lo importa la página /admin (así no pesa en la invitación).
export const auth = app ? getAuth(app) : null;
