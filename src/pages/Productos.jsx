import { useEffect, useState } from "react";
import { Alert, Col, Container, Form, Row, Spinner } from "react-bootstrap";
import TarjetaProducto from "../components/TarjetaProducto";
import { useCarrito } from "../context/CarritoContext";
import { listarCategorias, listarProductos } from "../services/tiendaService";

export default function Productos() {
  const [productos, setProductos] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [categoriaId, setCategoriaId] = useState("");
  const [busqueda, setBusqueda] = useState("");
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");
  const { agregarAlCarrito } = useCarrito();

  useEffect(() => {
    Promise.all([listarProductos(), listarCategorias()])
      .then(([prods, cats]) => {
        setProductos(prods);
        setCategorias(cats);
      })
      .catch((err) => setError(err.message))
      .finally(() => setCargando(false));
  }, []);

  const visibles = productos.filter((p) => {
    const coincideCat = !categoriaId || String(p.categoria?.id) === categoriaId;
    const coincideTexto =
      !busqueda.trim() ||
      p.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
      p.descripcion.toLowerCase().includes(busqueda.toLowerCase());
    return coincideCat && coincideTexto;
  });

  return (
    <Container className="py-4">
      <h1 className="h2 mb-4">Catálogo de Productos</h1>

      <Row className="g-3 mb-4">
        <Col xs={12} md={6}>
          <Form.Control
            type="search"
            placeholder="Buscar instrumento o equipo..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            aria-label="Buscar productos"
          />
        </Col>
        <Col xs={12} md={6}>
          <Form.Select
            value={categoriaId}
            onChange={(e) => setCategoriaId(e.target.value)}
            aria-label="Filtrar por categoría"
          >
            <option value="">Todas las categorías</option>
            {categorias.map((c) => (
              <option key={c.id} value={c.id}>
                {c.nombre}
              </option>
            ))}
          </Form.Select>
        </Col>
      </Row>

      {cargando && (
        <div className="text-center py-5">
          <Spinner animation="border" />
        </div>
      )}
      {error && <Alert variant="danger">{error}</Alert>}
      {!cargando && !error && visibles.length === 0 && (
        <Alert variant="info">No se encontraron productos con esos filtros.</Alert>
      )}

      <Row className="g-4">
        {visibles.map((producto) => (
          <Col xs={12} md={6} lg={4} key={producto.id}>
            <TarjetaProducto producto={producto} onAgregar={agregarAlCarrito} />
          </Col>
        ))}
      </Row>
    </Container>
  );
}