const AUTH_URL = import.meta.env.VITE_AUTH_API_URL;

async function procesarRespuesta(response) {
  const texto = await response.text();
  const data = texto ? JSON.parse(texto) : null;

  if (!response.ok) {
    throw new Error(data?.mensaje || data?.error || `Error ${response.status}`);
  }
  return data;
}

export async function login(credenciales) {
  const response = await fetch(`${AUTH_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(credenciales),
  });
  return procesarRespuesta(response);
}

export async function registrar(datos) {
  const response = await fetch(`${AUTH_URL}/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(datos),
  });
  return procesarRespuesta(response);
}