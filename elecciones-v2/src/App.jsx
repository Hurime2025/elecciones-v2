import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AppProvider } from "./context/AppContext";
import PrivateRoute from "./components/PrivateRoute";
import Login from "./apps/auth/Login";
import VotoControl from "./apps/web/VotoControl";
import LiderMovil from "./apps/mobile/LiderMovil";

export default function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <Routes>
          {/* Pública */}
          <Route path="/login" element={<Login />} />

          {/* Panel web: gobernador y candidatos */}
          <Route
            path="/control"
            element={
              <PrivateRoute allowedRoles={["gobernador", "candidato"]}>
                <VotoControl />
              </PrivateRoute>
            }
          />

          {/* App móvil: líderes */}
          <Route
            path="/lider"
            element={
              <PrivateRoute allowedRoles={["lider"]}>
                <LiderMovil />
              </PrivateRoute>
            }
          />

          {/* Raíz → login */}
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </BrowserRouter>
    </AppProvider>
  );
}
