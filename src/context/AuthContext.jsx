import { createContext, useContext, useState } from "react";

const AuthContext = createContext(null);

function leerUsuarioGuardado() {
  try {
    const raw = sessionStorage.getItem("usuario");
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => sessionStorage.getItem("token"));
  const [usuario, setUsuario] = useState(leerUsuarioGuardado);

  function iniciarSesion(sesion) {
    const datosUsuario = {
      nombre: sesion.nombre,
      correo: sesion.correo,
      rol: sesion.rol,
    };
    sessionStorage.setItem("token", sesion.token);
    sessionStorage.setItem("usuario", JSON.stringify(datosUsuario));
    setToken(sesion.token);
    setUsuario(datosUsuario);
  }

  function cerrarSesion() {
    sessionStorage.removeItem("token");
    sessionStorage.removeItem("usuario");
    setToken(null);
    setUsuario(null);
  }

  return (
    <AuthContext.Provider value={{ token, usuario, iniciarSesion, cerrarSesion }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}