  import { useCallback, useEffect, useMemo, useState } from 'react'
  import { CartContext } from './cart-context.js'
  import { useAuth } from '../context/AuthContext'

async function mapCartItems(carrito) {
  const items = carrito?.items ?? []

  return Promise.all(
    items.map(async (item) => {
      let fotos = []

      if (item.producto.fotosIds?.length > 0) {
        const res = await fetch(
          `http://localhost:8080/fotos/${item.producto.fotosIds[0]}`
        )

        const data = await res.json()
        fotos = [data]
      }

      return {
        itemId: item.id,
        id: item.producto.id,
        name: item.producto.nombre,
        description: item.producto.descripcion,
        price: item.producto.precio,
        discountedPrice: item.producto.precioConDescuento,
        discount: item.producto.descuento,
        stock: item.producto.stock,
        category: item.producto.categoria?.nombre,
        fotos,
        quantity: item.cantidad,
      }
    })
  )
}

  export function CartProvider({ children }) {
      const { user } = useAuth()
const usuarioId = user?.id
   
    const [items, setItems] = useState([])

  const loadCart = useCallback(async () => {
    
    try {
      const token = localStorage.getItem('token')
      const res = await fetch(
  `http://localhost:8080/carrito/usuario/${usuarioId}`,
  {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }
)

      if (!res.ok) return

      const carrito = await res.json()

      const mapped = await mapCartItems(carrito)
setItems(mapped)
    } catch (err) {
      console.error('Error cargando carrito:', err)
    }
  }, [usuarioId])

  const addItem = useCallback(async (product, qty = 1) => {
    try {
      const token = localStorage.getItem('token')
      const res = await fetch('http://localhost:8080/carrito/agregar', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`,
  },
  body: JSON.stringify({
    usuarioId,
    productoId: product.id,
    cantidad: qty,
  }),
})

      if (!res.ok) return

      const carrito = await res.json()

      const mapped = await mapCartItems(carrito)
setItems(mapped)
    } catch (err) {
      console.error('Error agregando producto:', err)
    }
  }, [usuarioId])

  const removeItem = useCallback(async (itemId) => {
    try {
      const token = localStorage.getItem('token')
      await fetch(
        `http://localhost:8080/carrito/item/${itemId}`,
        {
          method: 'DELETE',
          headers: {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`,
  }
        }
      )

      setItems((prev) =>
        prev.filter((x) => x.itemId !== itemId)
      )
    } catch (err) {
      console.error('Error eliminando item:', err)
    }
  }, [usuarioId])

  const setQuantity = useCallback(async (itemId, quantity) => {
    try {
      const token = localStorage.getItem('token')
      if (quantity < 1) {
        removeItem(itemId)
        return
      }

      const res = await fetch(
        `http://localhost:8080/carrito/item/${itemId}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            cantidad: quantity,
          }),
        }
      )

      if (!res.ok) return

      const carrito = await res.json()

      const mapped = await mapCartItems(carrito)
setItems(mapped)
    } catch (err) {
      console.error('Error actualizando cantidad:', err)
    }
  }, [removeItem,usuarioId])

    const clear = useCallback(() => setItems([]), [usuarioId])

  const total = useMemo(
    () =>
      items.reduce(
        (s, x) =>
          s +
          (x.discount > 0 ? x.discountedPrice : x.price) * x.quantity,
        0
      ),
    [items],
  )

    const count = useMemo(
      () => items.reduce((s, x) => s + x.quantity, 0),
      [items],
    )

    const value = useMemo(
      () => ({
        items,
        addItem,
        removeItem,
        setQuantity,
        clear,
        total,
        count,
      }),
      [items, addItem, removeItem, setQuantity, clear, total, count],
    )
  useEffect(() => {
  if (!usuarioId) {
    setItems([])
    return
  }

  loadCart()
}, [loadCart, usuarioId])

    return <CartContext.Provider value={value}>{children}</CartContext.Provider>
  }
