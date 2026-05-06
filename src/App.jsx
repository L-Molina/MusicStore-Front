import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import Carrito from './Components/Carrito/Carrito'
import Catalogo from './Components/Catalogo/Catalogo'
import DetalleProducto from './Components/DetalleProducto/DetalleProducto'
import Home from './Components/Home/Home'
import Layout from './Components/Layout/Layout'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="catalogo" element={<Catalogo />} />
          <Route path="producto/:id" element={<DetalleProducto />} />
          <Route path="carrito" element={<Carrito />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
