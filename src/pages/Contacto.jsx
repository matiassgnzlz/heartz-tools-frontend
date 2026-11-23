import { useState } from "react";
import { Alert, Button, Container, Form } from "react-bootstrap";

const inicial = { nombre: "", correo: "", mensaje: "" };

export default function Contacto() {
  const [datos, setDatos] = useState(inicial);
  const [errores, setErrores] = useState({});
  const [enviado, setEnviado] = useState(false);

  function cambiar(e) {
    setDatos({ ...datos, [e.target.name]: e.target.value });
  }

  function enviar(e) {
    e.preventDefault();
    const nuevos = {};
    if (!datos.nombre.trim()) nuevos.nombre = "Ingresa tu nombre";
    if (!datos.correo.includes("@")) nuevos.correo = "Ingresa un correo válido";
    if (datos.mensaje.trim().length < 10) nuevos.mensaje = "Escribe al menos 10 caracteres";

    setErrores(nuevos);
    if (Object.keys(nuevos).length > 0) return;

    setEnviado(true);
    setDatos(inicial);
  }

  return (
    <Container className="py-4" style={{ maxWidth: "640px" }}>
      <h1 className="h2 mb-3">Contacto</h1>
      <p className="text-muted">¿Dudas sobre algún producto o pedido? Escríbenos.</p>

      {enviado && (
        <Alert variant="success">Mensaje enviado correctamente. Te responderemos pronto.</Alert>
      )}

      <Form onSubmit={enviar} noValidate>
        <Form.Group className="mb-3" controlId="contacto-nombre">
          <Form.Label>Nombre</Form.Label>
          <Form.Control
            name="nombre"
            value={datos.nombre}
            onChange={cambiar}
            isInvalid={Boolean(errores.nombre)}
          />
          <Form.Control.Feedback type="invalid">{errores.nombre}</Form.Control.Feedback>
        </Form.Group>

        <Form.Group className="mb-3" controlId="contacto-correo">
          <Form.Label>Correo electrónico</Form.Label>
          <Form.Control
            type="email"
            name="correo"
            value={datos.correo}
            onChange={cambiar}
            isInvalid={Boolean(errores.correo)}
          />
          <Form.Control.Feedback type="invalid">{errores.correo}</Form.Control.Feedback>
        </Form.Group>

        <Form.Group className="mb-3" controlId="contacto-mensaje">
          <Form.Label>Mensaje</Form.Label>
          <Form.Control
            as="textarea"
            rows={4}
            name="mensaje"
            value={datos.mensaje}
            onChange={cambiar}
            isInvalid={Boolean(errores.mensaje)}
          />
          <Form.Control.Feedback type="invalid">{errores.mensaje}</Form.Control.Feedback>
        </Form.Group>

        <Button type="submit" variant="primary">
          Enviar mensaje
        </Button>
      </Form>
    </Container>
  );
}