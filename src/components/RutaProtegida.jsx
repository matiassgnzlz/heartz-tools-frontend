import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function RutaProtegida({ rolesPermitidos }) {
  const { usuario, token } = useAuth();

  if (!usuario || !token) {
    return <Navigate to="/login" replace />;
  }

  if (rolesPermitidos && !rolesPermitidos.includes(usuario.rol)) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
}