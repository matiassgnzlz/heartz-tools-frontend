export function formatearPrecio(valor) {
  const numero = Number(valor || 0);
  if (numero === 0) return "Gratis";
  return `$${numero.toLocaleString("es-CL")}`;
}
