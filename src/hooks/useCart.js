import { useDispatch, useSelector } from "react-redux";
import {
  addCartItem,
  clearCart,
  removeCartItem,
  updateQuantity,
} from "../redux/cartSlice";

export function useCart() {
  const dispatch = useDispatch();
  const { items = [], loading, error } = useSelector((state) => state.cart);

  const count = items.reduce((acc, item) => {
    return acc + Number(item.quantity || 0);
  }, 0);

  function addItem(product, quantity = 1) {
    dispatch(
      addCartItem({
        product,
        quantity,
      })
    );
  }

  function removeItem(itemId) {
    dispatch(removeCartItem(itemId));
  }

  function setQuantity(itemId, quantity) {
    if (Number(quantity) <= 0) {
      dispatch(removeCartItem(itemId));
      return;
    }

    dispatch(
      updateQuantity({
        itemId,
        quantity,
      })
    );
  }

  function clear() {
    dispatch(clearCart());
  }

  return {
    items,
    loading,
    error,
    count,
    addItem,
    removeItem,
    setQuantity,
    clear,
  };
}