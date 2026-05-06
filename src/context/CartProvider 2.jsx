import { useCallback, useMemo, useState } from 'react'
import { CartContext } from './cart-context.js'

export function CartProvider({ children }) {
  const [items, setItems] = useState([])

  const addItem = useCallback((product, qty = 1) => {
    setItems((prev) => {
      const i = prev.findIndex((x) => x.id === product.id)
      if (i === -1) return [...prev, { ...product, quantity: qty }]
      const next = [...prev]
      next[i] = { ...next[i], quantity: next[i].quantity + qty }
      return next
    })
  }, [])

  const removeItem = useCallback((id) => {
    setItems((prev) => prev.filter((x) => x.id !== id))
  }, [])

  const setQuantity = useCallback((id, quantity) => {
    setItems((prev) => {
      if (quantity < 1) return prev.filter((x) => x.id !== id)
      return prev.map((x) => (x.id === id ? { ...x, quantity } : x))
    })
  }, [])

  const clear = useCallback(() => setItems([]), [])

  const total = useMemo(
    () => items.reduce((s, x) => s + x.price * x.quantity, 0),
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

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}
