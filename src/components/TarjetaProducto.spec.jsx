import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import { vi } from "vitest";
import TarjetaProducto from "./TarjetaProducto";

describe("TarjetaProducto", () => {
  const productoCritico = {
    id: 1,
    nombre: "Guitarra Eléctrica Negra",
    descripcion: "Guitarra eléctrica de cuerpo sólido",
    precio: 249990,
    stock: 3,
    imagen: "guitarra",
    categoria: { id: 1, nombre: "Cuerdas" },
  };

  it("muestra el nombre, categoría y aviso de últimas unidades", () => {
    render(
      <MemoryRouter>
        <TarjetaProducto producto={productoCritico} onAgregar={vi.fn()} />
      </MemoryRouter>
    );

    expect(screen.getByText("Guitarra Eléctrica Negra")).toBeInTheDocument();
    expect(screen.getByText("Cuerdas")).toBeInTheDocument();
    expect(screen.getByText(/últimas unidades/i)).toBeInTheDocument();
  });

  it("ejecuta onAgregar al hacer clic en Agregar", async () => {
    const usuario = userEvent.setup();
    const onAgregar = vi.fn();

    render(
      <MemoryRouter>
        <TarjetaProducto producto={productoCritico} onAgregar={onAgregar} />
      </MemoryRouter>
    );

    await usuario.click(screen.getByRole("button", { name: /agregar/i }));
    expect(onAgregar).toHaveBeenCalledWith(productoCritico);
  });

  it("deshabilita el botón cuando el stock es cero", () => {
    render(
      <MemoryRouter>
        <TarjetaProducto
          producto={{ ...productoCritico, stock: 0 }}
          onAgregar={vi.fn()}
        />
      </MemoryRouter>
    );

    expect(screen.getByRole("button", { name: /sin stock/i })).toBeDisabled();
  });
});