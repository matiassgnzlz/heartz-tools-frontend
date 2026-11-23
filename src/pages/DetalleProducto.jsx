import { useEffect, useState } from "react";
import { Alert, Badge, Button, Col, Container, Form, Row, Spinner } from "react-bootstrap";
import { Link, useParams } from "react-router-dom";
import { useCarrito } from "../context/CarritoContext";
import { buscarProducto } from "../services/tiendaService";
import { resolverImagen } from "../utils/imagenes";
import { formatearPrecio } from "../utils/precio";

export default function DetalleProducto() {
  const { id } = useParams();
  const [producto, setProducto] = useState(null);
  const [cantidad, setCantidad] = useState(1);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");
  const [agregado, setAgregado] = useState(false);
  const { agregarAlCarrito } = useCarrito();

  useEffect(() => {
    buscarProducto(id)
      .then(setProducto)
      .catch((err) => setError(err.message))
      .finally(() => setCargando(false));
  }, [id]);

  if (cargando) {
    return (
      <Container className="py-5 text-center">
        <Spinner animation="border" />
      </Container>
    );
  }

  if (error || !producto) {
    return (
      <Container className="py-5">
        <Alert variant="warning">{error || "El producto solicitado no existe."}</Alert>
        <Button as={Link} to="/productos" variant="secondary">
          Volver al catálogo
        </Button>
      </Container>
    );
  }

  function manejarAgregar() {
    agregarAlCarrito(producto, Number(cantidad));
    setAgregado(true);
    setTimeout(() => setAgregado(false), 2000);
  }

  return (
    <Container className="py-4">
      <Link to="/productos" className="btn btn-link ps-0 mb-3">
        ← Volver a productos
      </Link>

      <Row className="g-4 align-items-center">
        <Col xs={12} md={6}>
          <img
            src={resolverImagen(producto.imagen, producto.nombre)}
            alt={producto.nombre}
            className="img-fluid rounded shadow-sm w-100"
            style={{ maxHeight: "420px", objectFit: "cover" }}
          />
        </Col>
        <Col xs={12} md={6}>
          <Badge bg="secondary" className="mb-2">
            {producto.categoria?.nombre || "General"}
          </Badge>
          <h1 className="h2">{producto.nombre}</h1>
          <p className="text-muted">{producto.descripcion}</p>
          <p className="fs-3 fw-bold text-primary">{formatearPrecio(producto.precio)}</p>
          <p className="mb-3">
            Stock disponible: <strong>{producto.stock}</strong>
          </p>

          {agregado && <Alert variant="success">Producto agregado al carrito.</Alert>}

          <div className="d-flex align-items-center gap-3 mb-3">
            <Form.Label htmlFor="cantidad" className="mb-0">
              Cantidad:
            </Form.Label>
            <Form.Control
              id="cantidad"
              type="number"
              min={1}
              max={Math.max(producto.stock, 1)}
              value={cantidad}
              onChange={(e) => setCantidad(Math.max(1, Math.min(Number(e.target.value), producto.stock)))}
              style={{ width: "90px" }}
              disabled={producto.stock === 0}
            />
          </div>

          <Button
            variant="primary"
            size="lg"
            onClick={manejarAgregar}
            disabled={producto.stock === 0}
          >
            {producto.stock === 0 ? "Agotado" : "Agregar al carrito"}
          </Button>
        </Col>
      </Row>
    </Container>
  );
}