import { useEffect, useState } from "react";
import { Alert, Button, Card, Col, Container, Row, Spinner } from "react-bootstrap";
import TarjetaProducto from "../components/TarjetaProducto";
import { useCarrito } from "../context/CarritoContext";
import { listarCategorias, listarProductos } from "../services/tiendaService";

export default function Categorias() {
  const [categorias, setCategorias] = useState([]);
  const [productos, setProductos] = useState([]);
  const [seleccionada, setSeleccionada] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");
  const { agregarAlCarrito } = useCarrito();

  useEffect(() => {
    Promise.all([listarCategorias(), listarProductos()])
      .then(([cats, prods]) => {
        setCategorias(cats);
        setProductos(prods);
        if (cats.length > 0) setSeleccionada(cats[0]);
      })
      .catch((err) => setError(err.message))
      .finally(() => setCargando(false));
  }, []);

  const filtrados = seleccionada
    ? productos.filter((p) => p.categoria?.id === seleccionada.id)
    : productos;

  return (
    <Container className="py-4">
      <h1 className="h2 mb-4">Categorías</h1>

      {cargando && (
        <div className="text-center py-5">
          <Spinner animation="border" />
        </div>
      )}
      {error && <Alert variant="danger">{error}</Alert>}

      <Row className="g-3 mb-4">
        {categorias.map((cat) => (
          <Col xs={6} md={3} key={cat.id}>
            <Card
              className={`h-100 text-center ${
                seleccionada?.id === cat.id ? "border-primary bg-light" : ""
              }`}
            >
              <Card.Body className="d-flex flex-column justify-content-between">
                <div>
                  <Card.Title className="h6">{cat.nombre}</Card.Title>
                  <Card.Text className="small text-muted">{cat.descripcion}</Card.Text>
                </div>
                <Button
                  size="sm"
                  variant={seleccionada?.id === cat.id ? "primary" : "outline-primary"}
                  onClick={() => setSeleccionada(cat)}
                >
                  Ver productos
                </Button>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>

      {seleccionada && (
        <>
          <h2 className="h4 mb-3">{seleccionada.nombre}</h2>
          {filtrados.length === 0 ? (
            <Alert variant="info">No hay productos en esta categoría.</Alert>
          ) : (
            <Row className="g-4">
              {filtrados.map((prod) => (
                <Col xs={12} md={6} lg={4} key={prod.id}>
                  <TarjetaProducto producto={prod} onAgregar={agregarAlCarrito} />
                </Col>
              ))}
            </Row>
          )}
        </>
      )}
    </Container>
  );
}