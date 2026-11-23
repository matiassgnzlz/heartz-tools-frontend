import { Route, Routes } from "react-router-dom";
import Navegacion from "./components/Navegacion";
import PiePagina from "./components/PiePagina";
import RutaProtegida from "./components/RutaProtegida";
import Blog from "./pages/Blog";
import Carrito from "./pages/Carrito";
import Categorias from "./pages/Categorias";
import Contacto from "./pages/Contacto";
import DetalleProducto from "./pages/DetalleProducto";
import Inicio from "./pages/Inicio";
import Login from "./pages/Login";
import MisCompras from "./pages/MisCompras";
import NoEncontrada from "./pages/NoEncontrada";
import Nosotros from "./pages/Nosotros";
import Ofertas from "./pages/Ofertas";
import Productos from "./pages/Productos";
import Registro from "./pages/Registro";
import PanelAdmin from "./pages/admin/PanelAdmin";
import PanelVendedor from "./pages/vendedor/PanelVendedor";

export default function App() {
  return (
    <div className="d-flex flex-column min-vh-100">
      <Navegacion />
      <div className="flex-grow-1">
        <Routes>
          <Route path="/" element={<Inicio />} />
          <Route path="/productos" element={<Productos />} />
          <Route path="/productos/:id" element={<DetalleProducto />} />
          <Route path="/categorias" element={<Categorias />} />
          <Route path="/ofertas" element={<Ofertas />} />
          <Route path="/nosotros" element={<Nosotros />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/blog/:id" element={<Blog />} />
          <Route path="/contacto" element={<Contacto />} />
          <Route path="/carrito" element={<Carrito />} />
          <Route path="/login" element={<Login />} />
          <Route path="/registro" element={<Registro />} />

          {/* Rutas protegidas por sesión y rol */}
          <Route element={<RutaProtegida />}>
            <Route path="/mis-compras" element={<MisCompras />} />
          </Route>

          <Route element={<RutaProtegida rolesPermitidos={["ADMIN"]} />}>
            <Route path="/admin" element={<PanelAdmin />} />
          </Route>

          <Route element={<RutaProtegida rolesPermitidos={["VENDEDOR", "ADMIN"]} />}>
            <Route path="/vendedor" element={<PanelVendedor />} />
          </Route>

          <Route path="*" element={<NoEncontrada />} />
        </Routes>
      </div>
      <PiePagina />
    </div>
  );
}