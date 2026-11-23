import { Container } from "react-bootstrap";

export default function PiePagina() {
  return (
    <footer className="bg-dark text-light py-4 mt-auto">
      <Container className="d-flex flex-column flex-md-row justify-content-between align-items-center gap-2">
        <span className="fw-semibold">Heartz-Tools — Tienda de Instrumentos y Audio</span>
        <small className="text-secondary">
          Desarrollo FullStack II · Duoc UC · {new Date().getFullYear()}
        </small>
      </Container>
    </footer>
  );
}