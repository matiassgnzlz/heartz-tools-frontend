const CLAVE_CARRITO = "heartz_carrito";

export function leerCarrito() {
  try {
    const raw = localStorage.getItem(CLAVE_CARRITO);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function guardarCarrito(items) {
  localStorage.setItem(CLAVE_CARRITO, JSON.stringify(items));
}
