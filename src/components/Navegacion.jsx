import { Badge, Button, Container, Nav, Navbar } from "react-bootstrap";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useCarrito } from "../context/CarritoContext";
import { formatearPrecio } from "../utils/precio";

export default function Navegacion() {
  const { usuario, cerrarSesion } = useAuth();
  const { totalCantidad, totalPrecio } = useCarrito();
  const navigate = useNavigate();

  function manejarSalida() {
    cerrarSesion();
    navigate("/");
  }

  return (
    <Navbar expand="lg" bg="dark" data-bs-theme="dark" sticky="top" className="shadow-sm">
      <Container>
        <Navbar.Brand as={Link} to="/" className="fw-bold">
          Heartz-Tools
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="menu-principal" />
        <Navbar.Collapse id="menu-principal">
          <Nav className="me-auto">
            <Nav.Link as={NavLink} to="/" end>Inicio</Nav.Link>
            <Nav.Link as={NavLink} to="/productos">Productos</Nav.Link>
            <Nav.Link as={NavLink} to="/categorias">Categorías</Nav.Link>
            <Nav.Link as={NavLink} to="/ofertas">Ofertas</Nav.Link>
            <Nav.Link as={NavLink} to="/nosotros">Nosotros</Nav.Link>
            <Nav.Link as={NavLink} to="/blog">Blog</Nav.Link>
            <Nav.Link as={NavLink} to="/contacto">Contacto</Nav.Link>

            {usuario?.rol === "ADMIN" && (
              <Nav.Link as={NavLink} to="/admin" className="text-warning fw-semibold">
                Admin
              </Nav.Link>
            )}
            {usuario?.rol === "VENDEDOR" && (
              <Nav.Link as={NavLink} to="/vendedor" className="text-info fw-semibold">
                Vendedor
              </Nav.Link>
            )}
            {usuario && (
              <Nav.Link as={NavLink} to="/mis-compras">
                Mis Compras
              </Nav.Link>
            )}
          </Nav>

          <div className="d-flex flex-wrap align-items-center gap-2 mt-2 mt-lg-0">
            <Button as={Link} to="/carrito" variant="success" size="sm">
              Carrito{" "}
              <Badge bg="light" text="dark" className="ms-1">
                {totalCantidad}
              </Badge>
              {totalPrecio > 0 && <span className="ms-1">({formatearPrecio(totalPrecio)})</span>}
            </Button>

            {usuario ? (
              <>
                <span className="text-light small">
                  {usuario.nombre}{" "}
                  <Badge bg="secondary">{usuario.rol}</Badge>
                </span>
                <Button variant="outline-light" size="sm" onClick={manejarSalida}>
                  Cerrar sesión
                </Button>
              </>
            ) : (
              <>
                <Button as={Link} to="/login" variant="outline-light" size="sm">
                  Iniciar sesión
                </Button>
                <Button as={Link} to="/registro" variant="primary" size="sm">
                  Crear cuenta
                </Button>
              </>
            )}
          </div>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}
