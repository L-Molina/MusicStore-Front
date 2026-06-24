import { useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  addItem as addItemAction,
  removeItem as removeItemAction,
  setQuantity as setQuantityAction,
  clearCart,
} from "../../redux/cartSlice.js";

export function useCart() {
  const dispatch = useDispatch();
  const { items, loading, checkoutLoading, error } = useSelector(
    (state) => state.cart,
  );

  const total = useMemo(
    () => items.reduce((sum, item) => sum + item.price * item.quantity, 0),
    [items],
  );

  const count = useMemo(
    () => items.reduce((sum, item) => sum + item.quantity, 0),
    [items],
  );

  return {
    items,
    total,
    count,
    loading,
    checkoutLoading,
    error,
    addItem: (product, qty = 1) =>
      dispatch(addItemAction({ product, qty })),
    removeItem: (id) => dispatch(removeItemAction(id)),
    setQuantity: (id, quantity) =>
      dispatch(setQuantityAction({ id, quantity })),
    clear: () => dispatch(clearCart()),
  };
}
