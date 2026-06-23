import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";

import Carrito from "./Components/Carrito/Carrito";
import Catalogo from "./Components/Catalogo/Catalogo";
import Checkout from "./Components/Checkout/Checkout";
import DetalleProducto from "./Components/DetalleProducto/DetalleProducto";
import Home from "./Components/Home/Home";
import Layout from "./Components/Layout/Layout";
import Login from "./Components/Login/Login";
import Registro from "./Components/Registro/Registro";

import AdminPanel from "./Components/Admin/AdminPanel";
import Perfil from "./Components/Perfil/Perfil";
import VendedorPanel from "./Components/Vendedor/VendedorPanel";

import ProtectedRoute from "./Components/ProtectedRoute/ProtectedRoute";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route index element={<Home />} />

          <Route path="catalogo" element={<Catalogo />} />

          <Route path="producto/:id" element={<DetalleProducto />} />

          <Route path="carrito" element={<Carrito />} />

          <Route
            path="checkout"
            element={
              <ProtectedRoute>
                <Checkout />
              </ProtectedRoute>
            }
          />

          <Route
            path="perfil"
            element={
              <ProtectedRoute>
                <Perfil />
              </ProtectedRoute>
            }
          />

          <Route path="login" element={<Login />} />

          <Route path="registro" element={<Registro />} />

          {/* VENDEDOR: gestión de inventario propio */}
          <Route
            path="vendedor"
            element={
              <ProtectedRoute allowedRoles={["VENDEDOR"]}>
                <VendedorPanel />
              </ProtectedRoute>
            }
          />

          {/* ADMIN: dashboard administrativo general */}
          <Route
            path="admin"
            element={
              <ProtectedRoute allowedRoles={["ADMIN"]}>
                <AdminPanel />
              </ProtectedRoute>
            }
          />

          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}