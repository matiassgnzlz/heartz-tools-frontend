import { formatearPrecio } from "./precio";

describe("formatearPrecio", () => {
  it("muestra cero como Gratis", () => {
    expect(formatearPrecio(0)).toBe("Gratis");
  });

  it("formatea un valor positivo en formato chileno", () => {
    expect(formatearPrecio(249990)).toContain("249.990");
  });
});