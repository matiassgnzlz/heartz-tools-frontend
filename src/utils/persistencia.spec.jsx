import { vi } from "vitest";
import { guardarCarrito } from "./persistencia";

describe("guardarCarrito", () => {
  it("guarda el arreglo serializado en localStorage", () => {
    const espia = vi.spyOn(Storage.prototype, "setItem");
    const items = [{ id: 1, nombre: "Guitarra Eléctrica Negra", cantidad: 1 }];

    guardarCarrito(items);

    expect(espia).toHaveBeenCalledWith("heartz_carrito", JSON.stringify(items));
    espia.mockRestore();
  });
});