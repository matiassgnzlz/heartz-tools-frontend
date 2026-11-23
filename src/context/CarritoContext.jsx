import { createContext, useContext, useEffect, useState } from "react";
import { guardarCarrito, leerCarrito } from "../utils/persistencia";

const CarritoContext = createContext(null);

export function CarritoProvider({ children }) {
  const [items, setItems] = useState(leerCarrito);

  useEffect(() => {
    guardarCarrito(items);
  }, [items]);

  function agregarAlCarrito(producto, cantidad = 1) {
    if (!producto || producto.stock <= 0) return;

    setItems((prev) => {
      const existente = prev.find((item) => item.id === producto.id);
      if (existente) {
        const nuevaCantidad = Math.min(existente.cantidad + cantidad, producto.stock);
        return prev.map((item) =>
          item.id === producto.id
            ? { ...item, cantidad: nuevaCantidad, stock: producto.stock, precio: producto.precio }
            : item
        );
      }
      return [
        ...prev,
        {
          id: producto.id,
          nombre: producto.nombre,
          precio: producto.precio,
          stock: producto.stock,
          imagen: producto.imagen,
          cantidad: Math.min(cantidad, producto.stock),
        },
      ];
    });
  }

  function actualizarCantidad(id, nuevaCantidad) {
    if (nuevaCantidad <= 0) {
      eliminarDelCarrito(id);
      return;
    }
    setItems((prev) =>
      prev.map((item) =>
        item.id === id
          ? { ...item, cantidad: Math.min(nuevaCantidad, item.stock) }
          : item
      )
    );
  }

  function eliminarDelCarrito(id) {
    setItems((prev) => prev.filter((item) => item.id !== id));
  }

  function vaciarCarrito() {
    setItems([]);
  }

  const totalCantidad = items.reduce((acc, item) => acc + item.cantidad, 0);
  const totalPrecio = items.reduce((acc, item) => acc + item.precio * item.cantidad, 0);

  return (
    <CarritoContext.Provider
      value={{
        items,
        totalCantidad,
        totalPrecio,
        agregarAlCarrito,
        actualizarCantidad,
        eliminarDelCarrito,
        vaciarCarrito,
      }}
    >
      {children}
    </CarritoContext.Provider>
  );
}

export function useCarrito() {
  return useContext(CarritoContext);
}
