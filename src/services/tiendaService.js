const TIENDA_URL = import.meta.env.VITE_TIENDA_API_URL;

async function request(ruta, opciones = {}) {
  const token = sessionStorage.getItem("token");
  const headers = { "Content-Type": "application/json", ...opciones.headers };
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(`${TIENDA_URL}${ruta}`, { ...opciones, headers });
  if (response.status === 204) return null;

  const texto = await response.text();
  const data = texto ? JSON.parse(texto) : null;

  if (!response.ok) {
    throw new Error(data?.error || data?.mensaje || `Solicitud rechazada (${response.status})`);
  }
  return data;
}

export const listarProductos = (categoriaId) =>
  request(categoriaId ? `/productos?categoriaId=${categoriaId}` : "/productos");
export const buscarProducto = (id) => request(`/productos/${id}`);
export const crearProducto = (datos) =>
  request("/productos", { method: "POST", body: JSON.stringify(datos) });
export const actualizarProducto = (id, datos) =>
  request(`/productos/${id}`, { method: "PUT", body: JSON.stringify(datos) });
export const eliminarProducto = (id) =>
  request(`/productos/${id}`, { method: "DELETE" });

export const listarCategorias = () => request("/categorias");
export const crearCategoria = (datos) =>
  request("/categorias", { method: "POST", body: JSON.stringify(datos) });
export const actualizarCategoria = (id, datos) =>
  request(`/categorias/${id}`, { method: "PUT", body: JSON.stringify(datos) });
export const eliminarCategoria = (id) =>
  request(`/categorias/${id}`, { method: "DELETE" });

export const crearBoleta = (items) =>
  request("/boletas", { method: "POST", body: JSON.stringify({ items }) });
export const listarMisBoletas = () => request("/boletas/mis-boletas");
export const listarTodasBoletas = () => request("/boletas");
export const buscarBoleta = (id) => request(`/boletas/${id}`);
export const actualizarEstadoBoleta = (id, estado) =>
  request(`/boletas/${id}/estado`, { method: "PUT", body: JSON.stringify({ estado }) });
export const eliminarBoleta = (id) =>
  request(`/boletas/${id}`, { method: "DELETE" });