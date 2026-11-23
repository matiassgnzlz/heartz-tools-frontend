import { useEffect, useState } from "react";
import { Alert, Badge, Container, Spinner, Tab, Table, Tabs } from "react-bootstrap";
import { listarProductos, listarTodasBoletas } from "../../services/tiendaService";
import { formatearPrecio } from "../../utils/precio";

export default function PanelVendedor() {
  const [boletas, setBoletas] = useState([]);
  const [productos, setProductos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    Promise.all([listarTodasBoletas(), listarProductos()])
      .then(([bols, prods]) => {
        setBoletas(bols);
        setProductos(prods);
      })
      .catch((err) => setError(err.message))
      .finally(() => setCargando(false));
  }, []);

  return (
    <Container className="py-4">
      <div className="d-flex align-items-center gap-2 mb-4">
        <h1 className="h2 mb-0">Panel de Vendedor</h1>
        <Badge bg="info">Solo lectura</Badge>
      </div>

      {cargando && (
        <div className="text-center py-5">
          <Spinner animation="border" />
        </div>
      )}
      {error && <Alert variant="danger">{error}</Alert>}

      {!cargando && !error && (
        <Tabs defaultActiveKey="ordenes" className="mb-4">
          <Tab eventKey="ordenes" title={`Órdenes (${boletas.length})`}>
            {boletas.length === 0 ? (
              <Alert variant="info">No existen órdenes registradas.</Alert>
            ) : (
              <div className="table-responsive">
                <Table striped bordered hover className="align-middle">
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>Fecha</th>
                      <th>Cliente</th>
                      <th>Productos</th>
                      <th>Total</th>
                      <th>Estado</th>
                    </tr>
                  </thead>
                  <tbody>
                    {boletas.map((b) => (
                      <tr key={b.id}>
                        <td>{b.id}</td>
                        <td>{new Date(b.fecha).toLocaleString("es-CL")}</td>
                        <td>
                          {b.clienteNombre}
                          <br />
                          <small className="text-muted">{b.clienteCorreo}</small>
                        </td>
                        <td>
                          <ul className="mb-0 ps-3 small">
                            {b.detalles.map((d) => (
                              <li key={d.id}>
                                {d.productoNombre} × {d.cantidad}
                              </li>
                            ))}
                          </ul>
                        </td>
                        <td className="fw-bold">{formatearPrecio(b.total)}</td>
                        <td>
                          <Badge bg="primary">{b.estado}</Badge>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </div>
            )}
          </Tab>

          <Tab eventKey="inventario" title={`Inventario (${productos.length})`}>
            <div className="table-responsive">
              <Table striped bordered hover className="align-middle">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Producto</th>
                    <th>Categoría</th>
                    <th>Precio</th>
                    <th>Stock</th>
                  </tr>
                </thead>
                <tbody>
                  {productos.map((p) => (
                    <tr key={p.id}>
                      <td>{p.id}</td>
                      <td>{p.nombre}</td>
                      <td>{p.categoria?.nombre}</td>
                      <td>{formatearPrecio(p.precio)}</td>
                      <td>
                        <Badge bg={p.stock <= 5 ? "danger" : "success"}>
                          {p.stock} {p.stock <= 5 ? "(Crítico)" : ""}
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </div>
          </Tab>
        </Tabs>
      )}
    </Container>
  );
}