import { lazy, Suspense } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import InvitationPage from "./pages/InvitationPage";

// Estas páginas se cargan solo cuando se visitan → la invitación abre más rápido.
const UploadPhoto = lazy(() => import("./pages/UploadPhoto"));
const Admin = lazy(() => import("./pages/Admin"));

/**
 * RUTAS:  "/" invitación · "/subir-foto" (QR) · "/admin" (solo tú)
 */
export default function App() {
  return (
    <BrowserRouter>
      <Suspense fallback={null}>
        <Routes>
          <Route path="/" element={<InvitationPage />} />
          <Route path="/subir-foto" element={<UploadPhoto />} />
          <Route path="/admin" element={<Admin />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}
