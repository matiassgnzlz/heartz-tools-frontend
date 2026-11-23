import { useEffect, useState } from "react";
import {
  Alert,
  Badge,
  Button,
  Card,
  Col,
  Container,
  Form,
  Row,
  Spinner,
  Tab,
  Table,
  Tabs,
} from "react-bootstrap";
import {
  actualizarCategoria,
  actualizarEstadoBoleta,
  actualizarProducto,
  crearCategoria,
  crearProducto,
  eliminarBoleta,
  eliminarCategoria,
  eliminarProducto,
  listarCategorias,
  listarProductos,
  listarTodasBoletas,
} from "../../services/tiendaService";
import { formatearPrecio } from "../../utils/precio";

const FORM_PROD_INICIAL = {
  nombre: "",
  descripcion: "",
  precio: "",
  stock: "",
  imagen: "",
  categoriaId: "",
};

const FORM_CAT_INICIAL = { nombre: "", descripcion: "" };

export default function PanelAdmin() {
  const [productos, setProductos] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [boletas, setBoletas] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");
  const [mensaje, setMensaje] = useState("");

  // Estado formulario producto (crear y editar)
  const [formProd, setFormProd] = useState(FORM_PROD_INICIAL);
  const [editandoProdId, setEditandoProdId] = useState(null);

  // Estado formulario categoría (crear y editar)
  const [formCat, setFormCat] = useState(FORM_CAT_INICIAL);
  const [editandoCatId, setEditandoCatId] = useState(null);

  async function cargarTodo() {
    setCargando(true);
    setError("");
    try {
      const [prods, cats, bols] = await Promise.all([
        listarProductos(),
        listarCategorias(),
        listarTodasBoletas(),
      ]);
      setProductos(prods);
      setCategorias(cats);
      setBoletas(bols);
    } catch (err) {
      setError(err.message);
    } finally {
      setCargando(false);
    }
  }

  useEffect(() => {
    cargarTodo();
  }, []);

  function mostrarAviso(texto) {
    setMensaje(texto);
    setError("");
    setTimeout(() => setMensaje(""), 3000);
  }

  // --- CRUD PRODUCTOS ---
  async function guardarProducto(e) {
    e.preventDefault();
    setError("");
    const payload = {
      nombre: formProd.nombre.trim(),
      descripcion: formProd.descripcion.trim(),
      precio: Number(formProd.precio),
      stock: Number(formProd.stock),
      imagen: formProd.imagen.trim(),
      categoriaId: Number(formProd.categoriaId),
    };

    try {
      if (editandoProdId) {
        await actualizarProducto(editandoProdId, payload);
        mostrarAviso("Producto actualizado correctamente.");
      } else {
        await crearProducto(payload);
        mostrarAviso("Producto creado correctamente.");
      }
      setFormProd(FORM_PROD_INICIAL);
      setEditandoProdId(null);
      await cargarTodo();
    } catch (err) {
      setError(err.message);
    }
  }

  function seleccionarProductoEditar(prod) {
    setEditandoProdId(prod.id);
    setFormProd({
      nombre: prod.nombre,
      descripcion: prod.descripcion,
      precio: String(prod.precio),
      stock: String(prod.stock),
      imagen: prod.imagen || "",
      categoriaId: String(prod.categoria?.id || ""),
    });
  }

  async function borrarProducto(id) {
    if (!window.confirm("¿Seguro que deseas eliminar este producto?")) return;
    try {
      await eliminarProducto(id);
      mostrarAviso("Producto eliminado.");
      await cargarTodo();
    } catch (err) {
      setError(err.message);
    }
  }

  // --- CRUD CATEGORÍAS ---
  async function guardarCategoria(e) {
    e.preventDefault();
    setError("");
    const payload = {
      nombre: formCat.nombre.trim(),
      descripcion: formCat.descripcion.trim(),
    };

    try {
      if (editandoCatId) {
        await actualizarCategoria(editandoCatId, payload);
        mostrarAviso("Categoría actualizada.");
      } else {
        await crearCategoria(payload);
        mostrarAviso("Categoría creada.");
      }
      setFormCat(FORM_CAT_INICIAL);
      setEditandoCatId(null);
      await cargarTodo();
    } catch (err) {
      setError(err.message);
    }
  }

  function seleccionarCategoriaEditar(cat) {
    setEditandoCatId(cat.id);
    setFormCat({ nombre: cat.nombre, descripcion: cat.descripcion || "" });
  }

  async function borrarCategoria(id) {
    if (!window.confirm("¿Seguro que deseas eliminar esta categoría?")) return;
    try {
      await eliminarCategoria(id);
      mostrarAviso("Categoría eliminada.");
      await cargarTodo();
    } catch (err) {
      setError(err.message);
    }
  }

  // --- GESTIÓN BOLETAS ---
  async function cambiarEstadoBoleta(id, nuevoEstado) {
    try {
      await actualizarEstadoBoleta(id, nuevoEstado);
      mostrarAviso(`Estado de boleta #${id} actualizado a ${nuevoEstado}.`);
      await cargarTodo();
    } catch (err) {
      setError(err.message);
    }
  }

  async function borrarBoleta(id) {
    if (!window.confirm(`¿Eliminar boleta #${id}?`)) return;
    try {
      await eliminarBoleta(id);
      mostrarAviso(`Boleta #${id} eliminada.`);
      await cargarTodo();
    } catch (err) {
      setError(err.message);
    }
  }

  const stockCritico = productos.filter((p) => p.stock <= 5);

  return (
    <Container className="py-4">
      <h1 className="h2 mb-4">Panel de Administración</h1>

      {mensaje && <Alert variant="success">{mensaje}</Alert>}
      {error && <Alert variant="danger">{error}</Alert>}

      {/* Resumen Dashboard */}
      <Row className="g-3 mb-4">
        <Col xs={6} md={3}>
          <Card bg="primary" text="white" className="h-100 shadow-sm">
            <Card.Body>
              <Card.Title className="h6">Órdenes / Boletas</Card.Title>
              <p className="display-6 fw-bold mb-0">{boletas.length}</p>
            </Card.Body>
          </Card>
        </Col>
        <Col xs={6} md={3}>
          <Card bg="success" text="white" className="h-100 shadow-sm">
            <Card.Body>
              <Card.Title className="h6">Productos</Card.Title>
              <p className="display-6 fw-bold mb-0">{productos.length}</p>
            </Card.Body>
          </Card>
        </Col>
        <Col xs={6} md={3}>
          <Card bg="warning" text="dark" className="h-100 shadow-sm">
            <Card.Body>
              <Card.Title className="h6">Categorías</Card.Title>
              <p className="display-6 fw-bold mb-0">{categorias.length}</p>
            </Card.Body>
          </Card>
        </Col>
        <Col xs={6} md={3}>
          <Card bg="danger" text="white" className="h-100 shadow-sm">
            <Card.Body>
              <Card.Title className="h6">Stock Crítico (≤ 5)</Card.Title>
              <p className="display-6 fw-bold mb-0">{stockCritico.length}</p>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {cargando ? (
        <div className="text-center py-5">
          <Spinner animation="border" />
        </div>
      ) : (
        <Tabs defaultActiveKey="productos" className="mb-4">
          {/* TAB PRODUCTOS */}
          <Tab eventKey="productos" title="Productos">
            <Card className="shadow-sm mb-4">
              <Card.Body>
                <Card.Title className="h5 mb-3">
                  {editandoProdId ? `Editar Producto #${editandoProdId}` : "Nuevo Producto"}
                </Card.Title>
                <Form onSubmit={guardarProducto}>
                  <Row className="g-3">
                    <Col xs={12} md={4}>
                      <Form.Group controlId="prod-nombre">
                        <Form.Label>Nombre</Form.Label>
                        <Form.Control
                          value={formProd.nombre}
                          onChange={(e) => setFormProd({ ...formProd, nombre: e.target.value })}
                          required
                        />
                      </Form.Group>
                    </Col>
                    <Col xs={6} md={2}>
                      <Form.Group controlId="prod-precio">
                        <Form.Label>Precio</Form.Label>
                        <Form.Control
                          type="number"
                          min={0}
                          value={formProd.precio}
                          onChange={(e) => setFormProd({ ...formProd, precio: e.target.value })}
                          required
                        />
                      </Form.Group>
                    </Col>
                    <Col xs={6} md={2}>
                      <Form.Group controlId="prod-stock">
                        <Form.Label>Stock</Form.Label>
                        <Form.Control
                          type="number"
                          min={0}
                          value={formProd.stock}
                          onChange={(e) => setFormProd({ ...formProd, stock: e.target.value })}
                          required
                        />
                      </Form.Group>
                    </Col>
                    <Col xs={12} md={4}>
                      <Form.Group controlId="prod-categoria">
                        <Form.Label>Categoría</Form.Label>
                        <Form.Select
                          value={formProd.categoriaId}
                          onChange={(e) => setFormProd({ ...formProd, categoriaId: e.target.value })}
                          required
                        >
                          <option value="">Selecciona una categoría</option>
                          {categorias.map((c) => (
                            <option key={c.id} value={c.id}>
                              {c.nombre}
                            </option>
                          ))}
                        </Form.Select>
                      </Form.Group>
                    </Col>
                    <Col xs={12} md={6}>
                      <Form.Group controlId="prod-descripcion">
                        <Form.Label>Descripción</Form.Label>
                        <Form.Control
                          value={formProd.descripcion}
                          onChange={(e) => setFormProd({ ...formProd, descripcion: e.target.value })}
                          required
                        />
                      </Form.Group>
                    </Col>
                    <Col xs={12} md={6}>
                      <Form.Group controlId="prod-imagen">
                        <Form.Label>Imagen (nombre local o URL)</Form.Label>
                        <Form.Control
                          placeholder="Ej: guitarra o https://..."
                          value={formProd.imagen}
                          onChange={(e) => setFormProd({ ...formProd, imagen: e.target.value })}
                        />
                      </Form.Group>
                    </Col>
                  </Row>

                  <div className="d-flex gap-2 mt-3">
                    <Button type="submit" variant="primary">
                      {editandoProdId ? "Guardar cambios" : "Crear producto"}
                    </Button>
                    {editandoProdId && (
                      <Button
                        variant="outline-secondary"
                        onClick={() => {
                          setEditandoProdId(null);
                          setFormProd(FORM_PROD_INICIAL);
                        }}
                      >
                        Cancelar edición
                      </Button>
                    )}
                  </div>
                </Form>
              </Card.Body>
            </Card>

            <div className="table-responsive">
              <Table striped bordered hover className="align-middle">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Nombre</th>
                    <th>Categoría</th>
                    <th>Precio</th>
                    <th>Stock</th>
                    <th>Acciones</th>
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
                        <Badge bg={p.stock <= 5 ? "danger" : "success"}>{p.stock}</Badge>
                      </td>
                      <td>
                        <div className="d-flex gap-2">
                          <Button
                            size="sm"
                            variant="outline-primary"
                            onClick={() => seleccionarProductoEditar(p)}
                          >
                            Editar
                          </Button>
                          <Button
                            size="sm"
                            variant="outline-danger"
                            onClick={() => borrarProducto(p.id)}
                          >
                            Eliminar
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </div>
          </Tab>

          {/* TAB CATEGORÍAS */}
          <Tab eventKey="categorias" title="Categorías">
            <Card className="shadow-sm mb-4">
              <Card.Body>
                <Card.Title className="h5 mb-3">
                  {editandoCatId ? `Editar Categoría #${editandoCatId}` : "Nueva Categoría"}
                </Card.Title>
                <Form onSubmit={guardarCategoria}>
                  <Row className="g-3">
                    <Col xs={12} md={4}>
                      <Form.Group controlId="cat-nombre">
                        <Form.Label>Nombre</Form.Label>
                        <Form.Control
                          value={formCat.nombre}
                          onChange={(e) => setFormCat({ ...formCat, nombre: e.target.value })}
                          required
                        />
                      </Form.Group>
                    </Col>
                    <Col xs={12} md={8}>
                      <Form.Group controlId="cat-descripcion">
                        <Form.Label>Descripción</Form.Label>
                        <Form.Control
                          value={formCat.descripcion}
                          onChange={(e) => setFormCat({ ...formCat, descripcion: e.target.value })}
                        />
                      </Form.Group>
                    </Col>
                  </Row>
                  <div className="d-flex gap-2 mt-3">
                    <Button type="submit" variant="primary">
                      {editandoCatId ? "Guardar cambios" : "Crear categoría"}
                    </Button>
                    {editandoCatId && (
                      <Button
                        variant="outline-secondary"
                        onClick={() => {
                          setEditandoCatId(null);
                          setFormCat(FORM_CAT_INICIAL);
                        }}
                      >
                        Cancelar
                      </Button>
                    )}
                  </div>
                </Form>
              </Card.Body>
            </Card>

            <div className="table-responsive">
              <Table striped bordered hover className="align-middle">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Nombre</th>
                    <th>Descripción</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {categorias.map((c) => (
                    <tr key={c.id}>
                      <td>{c.id}</td>
                      <td>{c.nombre}</td>
                      <td>{c.descripcion}</td>
                      <td>
                        <div className="d-flex gap-2">
                          <Button
                            size="sm"
                            variant="outline-primary"
                            onClick={() => seleccionarCategoriaEditar(c)}
                          >
                            Editar
                          </Button>
                          <Button
                            size="sm"
                            variant="outline-danger"
                            onClick={() => borrarCategoria(c.id)}
                          >
                            Eliminar
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </div>
          </Tab>

          {/* TAB ÓRDENES / BOLETAS */}
          <Tab eventKey="boletas" title="Órdenes / Boletas">
            {boletas.length === 0 ? (
              <Alert variant="info">No hay boletas registradas aún.</Alert>
            ) : (
              <div className="table-responsive">
                <Table striped bordered hover className="align-middle">
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>Fecha</th>
                      <th>Cliente</th>
                      <th>Detalle</th>
                      <th>Total</th>
                      <th>Estado</th>
                      <th>Acciones</th>
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
                          <Form.Select
                            size="sm"
                            value={b.estado}
                            onChange={(e) => cambiarEstadoBoleta(b.id, e.target.value)}
                            aria-label={`Estado boleta ${b.id}`}
                          >
                            <option value="PAGADA">PAGADA</option>
                            <option value="EN_PREPARACION">EN_PREPARACION</option>
                            <option value="ENTREGADA">ENTREGADA</option>
                            <option value="ANULADA">ANULADA</option>
                          </Form.Select>
                        </td>
                        <td>
                          <Button
                            size="sm"
                            variant="outline-danger"
                            onClick={() => borrarBoleta(b.id)}
                          >
                            Eliminar
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </div>
            )}
          </Tab>
        </Tabs>
      )}
    </Container>
  );
}