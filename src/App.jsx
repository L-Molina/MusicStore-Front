import { BrowserRouter, Route, Routes } from "react-router-dom"

import Carrito from "./Components/Carrito/Carrito"
import Catalogo from "./Components/Catalogo/Catalogo"
import Checkout from "./Components/Checkout/Checkout"
import DetalleProducto from "./Components/DetalleProducto/DetalleProducto"
import Home from "./Components/Home/Home"
import Login from "./Components/Login/Login"
import Perfil from "./Components/Perfil/Perfil"
import Registro from "./Components/Registro/Registro"
import VendedorPanel from "./Components/Vendedor/VendedorPanel"

import NavBar from "./Components/NavBar/NavBar"
import ProtectedRoute from "./Components/ProtectedRoute/ProtectedRoute"

export default function App() {
  return (
    <BrowserRouter>
      <NavBar />

      <Routes>
        <Route path="/" element={<Home />} />

        <Route path="/catalogo" element={<Catalogo />} />

        <Route path="/producto/:id" element={<DetalleProducto />} />

        <Route path="/login" element={<Login />} />

        <Route path="/registro" element={<Registro />} />

        <Route
          path="/carrito"
          element={
            <ProtectedRoute>
              <Carrito />
            </ProtectedRoute>
          }
        />

        <Route
          path="/checkout"
          element={
            <ProtectedRoute>
              <Checkout />
            </ProtectedRoute>
          }
        />

        <Route
          path="/perfil"
          element={
            <ProtectedRoute>
              <Perfil />
            </ProtectedRoute>
          }
        />

        <Route
          path="/vendedor"
          element={
            <ProtectedRoute allowedRoles={["VENDEDOR", "ADMIN"]}>
              <VendedorPanel />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  )
}