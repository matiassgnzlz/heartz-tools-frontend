import { vi } from "vitest";

async function obtenerNombresProductos(servicio) {
  const productos = await servicio.listarProductos();
  return productos.map((p) => p.nombre);
}

describe("obtenerNombresProductos con mock", () => {
  it("retorna los nombres entregados por el servicio simulado", async () => {
    const servicioMock = {
      listarProductos: vi.fn().mockResolvedValue([
        { id: 1, nombre: "Guitarra Eléctrica Negra" },
        { id: 2, nombre: "Micrófono Condensador" },
      ]),
    };

    const nombres = await obtenerNombresProductos(servicioMock);

    expect(servicioMock.listarProductos).toHaveBeenCalledTimes(1);
    expect(nombres).toEqual(["Guitarra Eléctrica Negra", "Micrófono Condensador"]);
  });
});