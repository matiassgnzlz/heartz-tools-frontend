import { Badge, Button, Card } from "react-bootstrap";
import { Link } from "react-router-dom";
import { resolverImagen } from "../utils/imagenes";
import { formatearPrecio } from "../utils/precio";

export default function TarjetaProducto({ producto, onAgregar }) {
  const sinStock = producto.stock === 0;
  const stockCritico = producto.stock > 0 && producto.stock <= 5;
  const nombreCategoria = producto.categoria?.nombre || "General";

  return (
    <Card className="h-100 shadow-sm">
      <Card.Img
        variant="top"
        src={resolverImagen(producto.imagen, producto.nombre)}
        alt={producto.nombre}
        className="img-fluid"
        style={{ height: "200px", objectFit: "cover" }}
      />
      <Card.Body className="d-flex flex-column">
        <div className="d-flex justify-content-between align-items-start gap-2 mb-2">
          <Badge bg="secondary">{nombreCategoria}</Badge>
          {stockCritico && <Badge bg="danger">¡Últimas unidades!</Badge>}
          {sinStock && <Badge bg="dark">Agotado</Badge>}
        </div>

        <Card.Title className="h5">{producto.nombre}</Card.Title>
        <Card.Text className="text-muted small flex-grow-1">
          {producto.descripcion}
        </Card.Text>

        <div className="mt-2">
          <p className="fs-5 fw-bold text-primary mb-1">
            {formatearPrecio(producto.precio)}
          </p>
          <p className="small text-muted mb-3">Stock disponible: {producto.stock}</p>

          <div className="d-flex gap-2">
            <Button
              as={Link}
              to={`/productos/${producto.id}`}
              variant="outline-secondary"
              size="sm"
              className="flex-fill"
            >
              Ver detalle
            </Button>
            <Button
              variant="primary"
              size="sm"
              className="flex-fill"
              onClick={() => onAgregar(producto)}
              disabled={sinStock}
            >
              {sinStock ? "Sin stock" : "Agregar"}
            </Button>
          </div>
        </div>
      </Card.Body>
    </Card>
  );
}