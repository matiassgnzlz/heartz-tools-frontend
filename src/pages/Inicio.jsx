import { useEffect, useState } from "react";
import { Alert, Button, Col, Container, Row, Spinner } from "react-bootstrap";
import { Link } from "react-router-dom";
import TarjetaProducto from "../components/TarjetaProducto";
import { useCarrito } from "../context/CarritoContext";
import { listarProductos } from "../services/tiendaService";

export default function Inicio() {
  const [productos, setProductos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");
  const { agregarAlCarrito } = useCarrito();

  useEffect(() => {
    listarProductos()
      .then((data) => setProductos(data.slice(0, 4)))
      .catch((err) => setError(err.message))
      .finally(() => setCargando(false));
  }, []);

  return (
    <main>
      <section className="bg-dark text-white py-5">
        <Container className="py-3 text-center text-md-start">
          <h1 className="display-5 fw-bold">Heartz-Tools</h1>
          <p className="lead text-light mb-4">
            Instrumentos musicales, audio profesional y equipamiento de estudio con despacho a todo Chile.
          </p>
          <div className="d-flex flex-wrap gap-2 justify-content-center justify-content-md-start">
            <Button as={Link} to="/productos" variant="primary" size="lg">
              Ver catálogo
            </Button>
            <Button as={Link} to="/categorias" variant="outline-light" size="lg">
              Explorar categorías
            </Button>
          </div>
        </Container>
      </section>

      <Container className="py-5">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h2 className="h3 mb-0">Productos destacados</h2>
          <Link to="/productos" className="btn btn-sm btn-outline-primary">
            Ver todos
          </Link>
        </div>

        {cargando && (
          <div className="text-center py-4">
            <Spinner animation="border" />
          </div>
        )}
        {error && <Alert variant="danger">{error}</Alert>}

        <Row className="g-4">
          {productos.map((prod) => (
            <Col xs={12} md={6} lg={3} key={prod.id}>
              <TarjetaProducto producto={prod} onAgregar={agregarAlCarrito} />
            </Col>
          ))}
        </Row>
      </Container>
    </main>
  );
}