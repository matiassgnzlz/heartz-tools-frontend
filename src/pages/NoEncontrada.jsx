import { Button, Container } from "react-bootstrap";
import { Link } from "react-router-dom";

export default function NoEncontrada() {
  return (
    <Container className="py-5 text-center">
      <h1 className="display-5 fw-bold">404</h1>
      <p className="lead text-muted">La página que buscas no existe.</p>
      <Button as={Link} to="/" variant="primary">
        Volver al inicio
      </Button>
    </Container>
  );
}