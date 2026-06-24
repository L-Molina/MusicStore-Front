import { Link } from 'react-router-dom'
import './TarjetaProducto.css'
import { getProductImageUrl } from "../../utils/images"
import { useDispatch } from "react-redux";
import { addCartItem } from "../../redux/cartSlice";

export default function TarjetaProducto({ product }) {
  const dispatch = useDispatch();

  const price = Number(product.price ?? 0)
  const discount = Number(product.discount ?? 0)
  const discountedPrice =
    discount > 0
      ? price * (1 - discount / 100)
      : price

  function handleAddCart(){
    dispatch(addCartItem({
      product,
      quantity:1
    }))
  }

  return (
    <div
      className="group flex flex-col overflow-hidden border border-[#333333] bg-[#1A1A1A] p-2"
    >

      <Link to={`/producto/${product.id}`}>

        <div className="relative mb-4 h-64 overflow-hidden bg-black">
          <img
            src={getProductImageUrl(product)}
            alt={product.name}
            className="h-full w-full object-cover"
          />
        </div>

        <h3 className="text-white">
          {product.name}
        </h3>

      </Link>


      <div className="mt-auto border-t border-[#222] pt-3">

        <span className="font-bold text-white">
          $
          {(discount > 0 ? discountedPrice : price).toFixed(2)}
        </span>


        <button
          onClick={handleAddCart}
          className="mt-3 w-full bg-[#ba203f] py-2 text-white"
        >
          Agregar al carrito
        </button>

      </div>

    </div>
  )
}