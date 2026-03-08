import { Navigate } from "react-router-dom";
import { useApp } from "../context/AppContext";

/**
 * allowedRoles: array de roles permitidos, ej. ["gobernador","candidato"]
 * Si está vacío/undefined → cualquier usuario autenticado puede acceder.
 */
export default function PrivateRoute({ children, allowedRoles }) {
  const { currentUser } = useApp();

  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles?.length && !allowedRoles.includes(currentUser.rol)) {
    // Redirigir al área correcta según rol
    const fallback = currentUser.rol === "lider" ? "/lider" : "/control";
    return <Navigate to={fallback} replace />;
  }

  return children;
}
