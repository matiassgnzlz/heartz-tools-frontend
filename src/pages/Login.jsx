import { useState } from "react";
import { Alert, Button, Card, Container, Form } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { login } from "../services/authService";

export default function Login() {
  const [correo, setCorreo] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [cargando, setCargando] = useState(false);
  const { iniciarSesion } = useAuth();
  const navigate = useNavigate();

  async function manejarSubmit(e) {
    e.preventDefault();
    setError("");
    setCargando(true);
    try {
      const sesion = await login({ correo, password });
      iniciarSesion(sesion);
      if (sesion.rol === "ADMIN") navigate("/admin");
      else if (sesion.rol === "VENDEDOR") navigate("/vendedor");
      else navigate("/productos");
    } catch (err) {
      setError(err.message);
    } finally {
      setCargando(false);
    }
  }

  return (
    <Container className="py-5" style={{ maxWidth: "460px" }}>
      <Card className="shadow-sm">
        <Card.Body className="p-4">
          <h1 className="h3 mb-3 text-center">Iniciar Sesión</h1>
          {error && <Alert variant="danger">{error}</Alert>}

          <Form onSubmit={manejarSubmit}>
            <Form.Group className="mb-3" controlId="login-correo">
              <Form.Label>Correo electrónico</Form.Label>
              <Form.Control
                type="email"
                value={correo}
                onChange={(e) => setCorreo(e.target.value)}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="login-password">
              <Form.Label>Contraseña</Form.Label>
              <Form.Control
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </Form.Group>

            <Button type="submit" variant="primary" className="w-100" disabled={cargando}>
              {cargando ? "Ingresando..." : "Ingresar"}
            </Button>
          </Form>

          <p className="text-center small mt-3 mb-0">
            ¿No tienes cuenta? <Link to="/registro">Crear cuenta</Link>
          </p>
        </Card.Body>
      </Card>
    </Container>
  );
}