import { ImagePlus, Pencil, Trash2 } from "lucide-react"
import { useRef, useState } from "react"
import { getProductImageUrl } from "../../utils/images"

export default function SellerProductCard({
  product,
  onUpdate,
  onDelete,
  onUpdateImage,
}) {
  const fileInputRef = useRef(null)

  const [stock, setStock] = useState(product.stock ?? 0)
  const [discount, setDiscount] = useState(product.discount ?? 0)
  const [updatingImage, setUpdatingImage] = useState(false)

  const price = Number(product.price ?? 0)
  const discountPercentage = Number(product.discount ?? 0)
  const discountedPrice = price - (price * discountPercentage) / 100

  const handleStockSave = () => {
    onUpdate(product.id, {
      stock: Number(stock),
    })
  }

  const handleDiscountSave = () => {
    onUpdate(product.id, {
      discount: Number(discount),
    })
  }

  const handleImageChange = async (e) => {
    const file = e.target.files?.[0]

    if (!file) return

    try {
      setUpdatingImage(true)
      await onUpdateImage(product.id, file)
    } finally {
      setUpdatingImage(false)
      e.target.value = ""
    }
  }

  return (
    <article className="overflow-hidden rounded-xl border border-zinc-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-md">
      <div className="relative aspect-square bg-zinc-100">
        <img
          src={getProductImageUrl(product)}
          alt={product.name}
          className="h-full w-full object-cover"
        />

        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="absolute bottom-3 right-3 flex items-center gap-2 rounded-md bg-black/80 px-3 py-2 text-xs font-bold uppercase tracking-wide text-white transition hover:bg-[#ba203f]"
        >
          <ImagePlus className="h-4 w-4" />
          {updatingImage ? "Subiendo..." : "Cambiar foto"}
        </button>

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleImageChange}
          disabled={updatingImage}
        />
      </div>

      <div className="space-y-4 p-5">
        <div>
          <h3 className="line-clamp-2 text-lg font-bold text-zinc-900">
            {product.name}
          </h3>

          <p className="mt-1 line-clamp-2 text-sm text-zinc-500">
            {product.description}
          </p>
        </div>

        <div>
          <p className="text-xs font-bold uppercase tracking-widest text-zinc-400">
            Categoría
          </p>

          <p className="mt-1 text-sm font-semibold text-zinc-800">
            {product.categoryName || product.category?.nombre || "Sin categoría"}
          </p>
        </div>

        <div>
          <div className="flex items-end gap-2">
            <span className="text-2xl font-black text-zinc-900">
              ${discountedPrice.toFixed(2)}
            </span>

            {discountPercentage > 0 && (
              <span className="pb-1 text-sm text-zinc-400 line-through">
                ${price.toFixed(2)}
              </span>
            )}
          </div>

          {discountPercentage > 0 && (
            <span className="mt-1 inline-flex rounded bg-[#ba203f] px-2 py-1 text-xs font-bold text-white">
              {discountPercentage}% OFF
            </span>
          )}
        </div>

        <div className="grid grid-cols-2 gap-3">
          <label className="grid gap-1 text-sm font-semibold text-zinc-600">
            Descuento
            <div className="flex overflow-hidden rounded border border-zinc-200">
              <input
                type="number"
                min="0"
                max="100"
                value={discount}
                onChange={(e) => setDiscount(e.target.value)}
                className="w-full px-3 py-2 text-zinc-900 outline-none"
              />

              <button
                type="button"
                onClick={handleDiscountSave}
                className="border-l border-zinc-200 px-3 text-zinc-500 hover:text-[#ba203f]"
                title="Guardar descuento"
              >
                <Pencil className="h-4 w-4" />
              </button>
            </div>
          </label>

          <label className="grid gap-1 text-sm font-semibold text-zinc-600">
            Stock
            <div className="flex overflow-hidden rounded border border-zinc-200">
              <input
                type="number"
                min="0"
                value={stock}
                onChange={(e) => setStock(e.target.value)}
                className="w-full px-3 py-2 text-zinc-900 outline-none"
              />

              <button
                type="button"
                onClick={handleStockSave}
                className="border-l border-zinc-200 px-3 text-zinc-500 hover:text-[#ba203f]"
                title="Guardar stock"
              >
                <Pencil className="h-4 w-4" />
              </button>
            </div>
          </label>
        </div>

        <button
          type="button"
          onClick={() => onDelete(product.id)}
          className="flex h-11 w-11 items-center justify-center rounded-md bg-red-500 text-white transition hover:bg-red-600"
          title="Eliminar producto"
        >
          <Trash2 className="h-5 w-5" />
        </button>
      </div>
    </article>
  )
}