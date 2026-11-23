import { Card, Col, Container, Row } from "react-bootstrap";

export default function Nosotros() {
  return (
    <Container className="py-4">
      <h1 className="h2 mb-3">Sobre Heartz-Tools</h1>
      <p className="lead text-muted mb-4">
        Somos una tienda chilena especializada en instrumentos musicales y equipamiento de estudio para músicos independientes, bandas y productores.
      </p>

      <Row className="g-4">
        <Col xs={12} md={4}>
          <Card className="h-100 shadow-sm">
            <Card.Body>
              <Card.Title className="h5">Calidad garantizada</Card.Title>
              <Card.Text className="text-muted">
                Trabajamos con equipamiento revisado y listo para escenario o home studio.
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>
        <Col xs={12} md={4}>
          <Card className="h-100 shadow-sm">
            <Card.Body>
              <Card.Title className="h5">Asesoría técnica</Card.Title>
              <Card.Text className="text-muted">
                Te ayudamos a elegir guitarras, baterías, micrófonos y monitoreo según tu proyecto.
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>
        <Col xs={12} md={4}>
          <Card className="h-100 shadow-sm">
            <Card.Body>
              <Card.Title className="h5">Compra segura</Card.Title>
              <Card.Text className="text-muted">
                Gestión de stock en tiempo real y seguimiento de tus boletas desde tu cuenta.
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}