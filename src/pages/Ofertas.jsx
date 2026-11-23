import { useEffect, useState } from "react";
import { Alert, Badge, Col, Container, Row, Spinner } from "react-bootstrap";
import TarjetaProducto from "../components/TarjetaProducto";
import { useCarrito } from "../context/CarritoContext";
import { listarProductos } from "../services/tiendaService";

export default function Ofertas() {
  const [productos, setProductos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");
  const { agregarAlCarrito } = useCarrito();

  useEffect(() => {
    listarProductos()
      .then((data) => setProductos(data.filter((p) => p.precio <= 250000)))
      .catch((err) => setError(err.message))
      .finally(() => setCargando(false));
  }, []);

  return (
    <Container className="py-4">
      <div className="d-flex align-items-center gap-2 mb-4">
        <h1 className="h2 mb-0">Ofertas de la semana</h1>
        <Badge bg="danger">Precios destacados</Badge>
      </div>

      {cargando && (
        <div className="text-center py-5">
          <Spinner animation="border" />
        </div>
      )}
      {error && <Alert variant="danger">{error}</Alert>}

      <Row className="g-4">
        {productos.map((prod) => (
          <Col xs={12} md={6} lg={4} key={prod.id}>
            <TarjetaProducto producto={prod} onAgregar={agregarAlCarrito} />
          </Col>
        ))}
      </Row>
    </Container>
  );
}