import { useState } from "react";
import { Alert, Button, Card, Col, Container, Form, Row, Table } from "react-bootstrap";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useCarrito } from "../context/CarritoContext";
import { crearBoleta } from "../services/tiendaService";
import { formatearPrecio } from "../utils/precio";

export default function Carrito() {
  const { items, totalPrecio, actualizarCantidad, eliminarDelCarrito, vaciarCarrito } = useCarrito();
  const { usuario } = useAuth();

  const [direccion, setDireccion] = useState({ calle: "", comuna: "", region: "Región Metropolitana" });
  const [procesando, setProcesando] = useState(false);
  const [boletaExitosa, setBoletaExitosa] = useState(null);
  const [errorPago, setErrorPago] = useState("");

  async function manejarPago(e) {
    e.preventDefault();
    setErrorPago("");
    if (!direccion.calle.trim() || !direccion.comuna.trim()) {
      setErrorPago("Completa la calle y comuna de entrega antes de pagar.");
      return;
    }

    setProcesando(true);
    try {
      const payload = items.map((i) => ({ productoId: i.id, cantidad: i.cantidad }));
      const boleta = await crearBoleta(payload);
      setBoletaExitosa(boleta);
      vaciarCarrito();
    } catch (err) {
      setErrorPago(err.message);
    } finally {
      setProcesando(false);
    }
  }

  if (boletaExitosa) {
    return (
      <Container className="py-4">
        <Alert variant="success">
          <Alert.Heading>¡Compra realizada con éxito! Boleta #{boletaExitosa.id}</Alert.Heading>
          <p className="mb-0">
            Cliente: <strong>{boletaExitosa.clienteNombre}</strong> ({boletaExitosa.clienteCorreo}) ·
            Estado: <strong>{boletaExitosa.estado}</strong>
          </p>
        </Alert>

        <Card className="shadow-sm mb-3">
          <Card.Body>
            <h2 className="h5 mb-3">Resumen de la compra</h2>
            <div className="table-responsive">
              <Table bordered size="sm">
                <thead>
                  <tr>
                    <th>Producto</th>
                    <th>Cantidad</th>
                    <th>Precio unitario</th>
                    <th>Subtotal</th>
                  </tr>
                </thead>
                <tbody>
                  {boletaExitosa.detalles.map((d) => (
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
            <p className="fs-5 fw-bold text-end mb-0">
              Total pagado: {formatearPrecio(boletaExitosa.total)}
            </p>
          </Card.Body>
        </Card>

        <div className="d-flex gap-2">
          <Button as={Link} to="/mis-compras" variant="primary">
            Ver Mis Compras
          </Button>
          <Button as={Link} to="/productos" variant="outline-secondary">
            Seguir comprando
          </Button>
        </div>
      </Container>
    );
  }

  return (
    <Container className="py-4">
      <h1 className="h2 mb-4">Carrito de Compras</h1>

      {errorPago && (
        <Alert variant="danger">
          <strong>No se pudo realizar el pago:</strong> {errorPago}
        </Alert>
      )}

      {items.length === 0 ? (
        <Alert variant="info">
          Tu carrito está vacío. <Link to="/productos">Explora el catálogo</Link>.
        </Alert>
      ) : (
        <Row className="g-4">
          <Col xs={12} lg={7}>
            <div className="table-responsive">
              <Table striped bordered hover className="align-middle">
                <thead>
                  <tr>
                    <th>Producto</th>
                    <th>Precio</th>
                    <th>Cantidad</th>
                    <th>Subtotal</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((item) => (
                    <tr key={item.id}>
                      <td>{item.nombre}</td>
                      <td>{formatearPrecio(item.precio)}</td>
                      <td>
                        <div className="d-flex align-items-center gap-1">
                          <Button
                            size="sm"
                            variant="outline-secondary"
                            onClick={() => actualizarCantidad(item.id, item.cantidad - 1)}
                          >
                            -
                          </Button>
                          <span className="px-2">{item.cantidad}</span>
                          <Button
                            size="sm"
                            variant="outline-secondary"
                            onClick={() => actualizarCantidad(item.id, item.cantidad + 1)}
                          >
                            +
                          </Button>
                        </div>
                      </td>
                      <td>{formatearPrecio(item.precio * item.cantidad)}</td>
                      <td>
                        <Button
                          size="sm"
                          variant="outline-danger"
                          onClick={() => eliminarDelCarrito(item.id)}
                        >
                          Quitar
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </div>
            <div className="d-flex justify-content-between align-items-center">
              <Button variant="outline-secondary" size="sm" onClick={vaciarCarrito}>
                Vaciar carrito
              </Button>
              <span className="fs-5 fw-bold">Total: {formatearPrecio(totalPrecio)}</span>
            </div>
          </Col>

          <Col xs={12} lg={5}>
            <Card className="shadow-sm">
              <Card.Body>
                <Card.Title className="h5 mb-3">Finalizar compra (Checkout)</Card.Title>

                {!usuario ? (
                  <Alert variant="warning">
                    Debes iniciar sesión para emitir tu boleta.{" "}
                    <Link to="/login">Iniciar sesión</Link>
                  </Alert>
                ) : (
                  <Form onSubmit={manejarPago}>
                    <p className="small text-muted mb-3">
                      Comprando como <strong>{usuario.nombre}</strong> ({usuario.correo})
                    </p>

                    <Form.Group className="mb-3" controlId="checkout-calle">
                      <Form.Label>Calle y número</Form.Label>
                      <Form.Control
                        value={direccion.calle}
                        onChange={(e) => setDireccion({ ...direccion, calle: e.target.value })}
                        placeholder="Ej: Av. Providencia 1234"
                        required
                      />
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="checkout-comuna">
                      <Form.Label>Comuna</Form.Label>
                      <Form.Control
                        value={direccion.comuna}
                        onChange={(e) => setDireccion({ ...direccion, comuna: e.target.value })}
                        placeholder="Ej: Santiago"
                        required
                      />
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="checkout-region">
                      <Form.Label>Región</Form.Label>
                      <Form.Select
                        value={direccion.region}
                        onChange={(e) => setDireccion({ ...direccion, region: e.target.value })}
                      >
                        <option>Región Metropolitana</option>
                        <option>Valparaíso</option>
                        <option>Biobío</option>
                        <option>Coquimbo</option>
                      </Form.Select>
                    </Form.Group>

                    <Button type="submit" variant="success" className="w-100" disabled={procesando}>
                      {procesando ? "Procesando..." : `Pagar ahora (${formatearPrecio(totalPrecio)})`}
                    </Button>
                  </Form>
                )}
              </Card.Body>
            </Card>
          </Col>
        </Row>
      )}
    </Container>
  );
}