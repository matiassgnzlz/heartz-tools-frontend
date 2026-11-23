const imagenesLocales = import.meta.glob("../assets/productos/*.{png,jpg,jpeg,webp}", {
  eager: true,
  import: "default",
});

function svgRespaldo(texto) {
  const etiqueta = (texto || "Heartz-Tools").slice(0, 26);
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="600" height="400" viewBox="0 0 600 400">
    <rect width="600" height="400" fill="#212529"/>
    <rect x="24" y="24" width="552" height="352" rx="16" fill="#2b3035" stroke="#495057" stroke-width="2"/>
    <text x="50%" y="48%" fill="#f8f9fa" font-family="Arial, sans-serif" font-size="26" font-weight="bold" text-anchor="middle">Heartz-Tools</text>
    <text x="50%" y="60%" fill="#adb5bd" font-family="Arial, sans-serif" font-size="18" text-anchor="middle">${etiqueta}</text>
  </svg>`;
  return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`;
}

export function resolverImagen(imagen, nombre) {
  if (imagen && (imagen.startsWith("http://") || imagen.startsWith("https://") || imagen.startsWith("/"))) {
    return imagen;
  }

  if (imagen) {
    const claveBuscada = imagen.toLowerCase().trim();
    for (const [ruta, url] of Object.entries(imagenesLocales)) {
      const archivo = ruta.split("/").pop().toLowerCase();
      if (archivo === claveBuscada || archivo.startsWith(`${claveBuscada}.`)) {
        return url;
      }
    }
  }

  return svgRespaldo(nombre || imagen);
}
