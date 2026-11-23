import { useState } from "react";
import { Alert, Button, Card, Container, Form } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { registrar } from "../services/authService";

export default function Registro() {
  const [nombre, setNombre] = useState("");
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
      const sesion = await registrar({ nombre, correo, password });
      iniciarSesion(sesion);
      navigate("/productos");
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
          <h1 className="h3 mb-3 text-center">Crear Cuenta</h1>
          {error && <Alert variant="danger">{error}</Alert>}

          <Form onSubmit={manejarSubmit}>
            <Form.Group className="mb-3" controlId="reg-nombre">
              <Form.Label>Nombre completo</Form.Label>
              <Form.Control
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="reg-correo">
              <Form.Label>Correo electrónico</Form.Label>
              <Form.Control
                type="email"
                value={correo}
                onChange={(e) => setCorreo(e.target.value)}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="reg-password">
              <Form.Label>Contraseña (mínimo 6 caracteres)</Form.Label>
              <Form.Control
                type="password"
                minLength={6}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </Form.Group>

            <Button type="submit" variant="primary" className="w-100" disabled={cargando}>
              {cargando ? "Registrando..." : "Registrarme"}
            </Button>
          </Form>

          <p className="text-center small mt-3 mb-0">
            ¿Ya tienes cuenta? <Link to="/login">Iniciar sesión</Link>
          </p>
        </Card.Body>
      </Card>
    </Container>
  );
}