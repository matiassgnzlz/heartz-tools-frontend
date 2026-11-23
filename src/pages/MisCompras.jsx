import { useEffect, useState } from "react";
import { Alert, Badge, Card, Container, Spinner, Table } from "react-bootstrap";
import { listarMisBoletas } from "../services/tiendaService";
import { formatearPrecio } from "../utils/precio";

export default function MisCompras() {
  const [boletas, setBoletas] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    listarMisBoletas()
      .then(setBoletas)
      .catch((err) => setError(err.message))
      .finally(() => setCargando(false));
  }, []);

  return (
    <Container className="py-4">
      <h1 className="h2 mb-4">Mis Compras</h1>

      {cargando && (
        <div className="text-center py-5">
          <Spinner animation="border" />
        </div>
      )}
      {error && <Alert variant="danger">{error}</Alert>}
      {!cargando && !error && boletas.length === 0 && (
        <Alert variant="info">Aún no has realizado compras.</Alert>
      )}

      {boletas.map((boleta) => (
        <Card key={boleta.id} className="mb-3 shadow-sm">
          <Card.Header className="d-flex flex-wrap justify-content-between align-items-center gap-2">
            <span>
              <strong>Boleta #{boleta.id}</strong> ·{" "}
              {new Date(boleta.fecha).toLocaleString("es-CL")}
            </span>
            <Badge bg="primary">{boleta.estado}</Badge>
          </Card.Header>
          <Card.Body>
            <div className="table-responsive">
              <Table size="sm" className="mb-2">
                <thead>
                  <tr>
                    <th>Producto</th>
                    <th>Cantidad</th>
                    <th>Precio</th>
                    <th>Subtotal</th>
                  </tr>
                </thead>
                <tbody>
                  {boleta.detalles.map((d) => (
                    <tr key={d.id}>
                      <td>{d.productoNombre}</td>
                      <td>{d.cantidad}</td>
                      <td>{formatearPrecio(d.precioUnitario)}</td>
                      <td>{formatearPrecio(d.subtotal)}</td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </div>
            <p className="fw-bold text-end mb-0">
              Total: {formatearPrecio(boleta.total)}
            </p>
          </Card.Body>
        </Card>
      ))}
    </Container>
  );
}