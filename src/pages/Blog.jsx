import { Button, Card, Col, Container, Row } from "react-bootstrap";
import { Link, useParams } from "react-router-dom";

const ARTICULOS = [
  {
    id: 1,
    titulo: "Cómo elegir tu primer micrófono de condensador",
    fecha: "Noviembre 2026",
    resumen: "Guía práctica sobre patrón cardioide, alimentación phantom 48V y acondicionamiento básico.",
    contenido:
      "Un micrófono de condensador de diafragma grande captura gran detalle en voces e instrumentos acústicos. Asegúrate de contar con una interfaz con alimentación phantom de 48V, filtro antipop y un espacio con baja reverberación.",
  },
  {
    id: 2,
    titulo: "Cuidados esenciales para tu guitarra eléctrica",
    fecha: "Octubre 2026",
    resumen: "Limpieza de diapasón, cambio de cuerdas y calibración para mantener la afinación estable.",
    contenido:
      "Limpia las cuerdas después de cada ensayo con un paño seco, guarda el instrumento lejos de cambios bruscos de temperatura y revisa la octavación cada vez que cambies el calibre de cuerdas.",
  },
];

export default function Blog() {
  const { id } = useParams();

  if (id) {
    const articulo = ARTICULOS.find((a) => a.id === Number(id));
    if (!articulo) {
      return (
        <Container className="py-4">
          <p>Artículo no encontrado.</p>
          <Button as={Link} to="/blog" variant="secondary">
            Volver al blog
          </Button>
        </Container>
      );
    }

    return (
      <Container className="py-4">
        <Link to="/blog" className="btn btn-link ps-0 mb-3">
          ← Volver al blog
        </Link>
        <h1 className="h2">{articulo.titulo}</h1>
        <p className="text-muted small">{articulo.fecha}</p>
        <p className="mt-3">{articulo.contenido}</p>
      </Container>
    );
  }

  return (
    <Container className="py-4">
      <h1 className="h2 mb-4">Blog Heartz-Tools</h1>
      <Row className="g-4">
        {ARTICULOS.map((art) => (
          <Col xs={12} md={6} key={art.id}>
            <Card className="h-100 shadow-sm">
              <Card.Body className="d-flex flex-column">
                <small className="text-muted">{art.fecha}</small>
                <Card.Title className="h5 mt-1">{art.titulo}</Card.Title>
                <Card.Text className="text-muted flex-grow-1">{art.resumen}</Card.Text>
                <Button as={Link} to={`/blog/${art.id}`} variant="outline-primary" size="sm">
                  Leer artículo
                </Button>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </Container>
  );
}