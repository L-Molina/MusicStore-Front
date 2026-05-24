import { useState } from "react"
import { Trash2, Pencil, Check, X } from "lucide-react"
import { getProductImageUrl } from "../../utils/images"

export default function SellerProductCard({ product, onUpdate, onDelete }) {
  const price = product.price ?? 0
  const [editingDiscount, setEditingDiscount] = useState(false)
  const [editingStock, setEditingStock] = useState(false)
const [tempDiscount, setTempDiscount] = useState(
  String(product.discount ?? 0)
)
const [tempStock, setTempStock] = useState(
  String(product.stock ?? 0)
)
  const [showDeleteModal, setShowDeleteModal] = useState(false)

  const discountedPrice = product.price * (1 - product.discount / 100)

  const handleDiscountSave = () => {
    const newDiscount = Math.min(100, Math.max(0, parseInt(tempDiscount) || 0))
    onUpdate(product.id, { discount: newDiscount })
    setEditingDiscount(false)
  }

  const handleStockSave = () => {
    const newStock = Math.max(0, parseInt(tempStock) || 0)
    onUpdate(product.id, { stock: newStock })
    setEditingStock(false)
  }

  const handleDiscountCancel = () => {
    setTempDiscount(product.discount.toString())
    setEditingDiscount(false)
  }

  const handleStockCancel = () => {
    setTempStock(product.stock.toString())
    setEditingStock(false)
  }

  const handleKeyDown = (e, saveHandler, cancelHandler) => {
    if (e.key === "Enter") saveHandler()
    if (e.key === "Escape") cancelHandler()
  }

  return (
    <>
      <div className="group relative overflow-hidden rounded-xl border border-zinc-200 bg-white shadow-sm transition-all hover:shadow-md">
        {/* Image Section */}
        <div className="relative aspect-square overflow-hidden bg-zinc-100">
          <img
            src={getProductImageUrl(product)}
            alt={product.name}
            className="h-full w-full object-cover transition-transform group-hover:scale-105"
          />
        </div>

        {/* Content Section */}
        <div className="space-y-4 p-4">
          {/* Name & Description */}
          <div>
            <h3 className="line-clamp-1 text-lg font-semibold text-zinc-900">
              {product.name}
            </h3>
            <p className="mt-1 line-clamp-2 text-sm text-zinc-500">
              {product.description}
            </p>
          </div>

          {/* Price Section */}
          <div className="flex items-baseline gap-2">
            {product.discount > 0 ? (
              <>
                <span className="text-xl font-bold text-zinc-900">
                  ${discountedPrice.toFixed(2)}
                </span>
                <span className="text-sm text-zinc-400 line-through">
                  ${price.toFixed(2)}
                </span>
              </>
            ) : (
              <span className="text-xl font-bold text-zinc-900">
                ${price.toFixed(2)}
              </span>
            )}
          </div>

          {/* Editable Fields */}
          <div className="grid grid-cols-2 gap-3">
            {/* Discount Field */}
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-zinc-500">
                Descuento
              </label>
              {editingDiscount ? (
                <div className="flex items-center gap-1">
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={tempDiscount}
                    onChange={(e) => setTempDiscount(e.target.value)}
                    onKeyDown={(e) => handleKeyDown(e, handleDiscountSave, handleDiscountCancel)}
                    className="h-8 w-full rounded-md border border-zinc-300 bg-white px-2 text-sm focus:border-zinc-500 focus:outline-none focus:ring-1 focus:ring-zinc-500"
                    autoFocus
                  />
                  <button
                    onClick={handleDiscountSave}
                    className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md hover:bg-zinc-100"
                  >
                    <Check className="h-4 w-4 text-green-600" />
                  </button>
                  <button
                    onClick={handleDiscountCancel}
                    className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md hover:bg-zinc-100"
                  >
                    <X className="h-4 w-4 text-red-600" />
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setEditingDiscount(true)}
                  className="flex h-8 w-full items-center justify-between rounded-md border border-zinc-200 bg-white px-3 text-sm transition-colors hover:bg-zinc-50"
                >
                  <span>{product.discount}%</span>
                  <Pencil className="h-3 w-3 text-zinc-400" />
                </button>
              )}
            </div>

            {/* Stock Field */}
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-zinc-500">
                Stock
              </label>
              {editingStock ? (
                <div className="flex items-center gap-1">
                  <input
                    type="number"
                    min="0"
                    value={tempStock}
                    onChange={(e) => setTempStock(e.target.value)}
                    onKeyDown={(e) => handleKeyDown(e, handleStockSave, handleStockCancel)}
                    className="h-8 w-full rounded-md border border-zinc-300 bg-white px-2 text-sm focus:border-zinc-500 focus:outline-none focus:ring-1 focus:ring-zinc-500"
                    autoFocus
                  />
                  <button
                    onClick={handleStockSave}
                    className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md hover:bg-zinc-100"
                  >
                    <Check className="h-4 w-4 text-green-600" />
                  </button>
                  <button
                    onClick={handleStockCancel}
                    className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md hover:bg-zinc-100"
                  >
                    <X className="h-4 w-4 text-red-600" />
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setEditingStock(true)}
                  className={`flex h-8 w-full items-center justify-between rounded-md border border-zinc-200 bg-white px-3 text-sm transition-colors hover:bg-zinc-50 ${
                    product.stock === 0 ? "text-red-500" : ""
                  }`}
                >
                  <span>
                    {product.stock} {product.stock === 0 && "(Agotado)"}
                  </span>
                  <Pencil className="h-3 w-3 text-zinc-400" />
                </button>
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-2 pt-2">
            <button
              onClick={() => setShowDeleteModal(true)}
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-red-500 text-white transition-colors hover:bg-red-600"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => setShowDeleteModal(false)}
          />
          <div className="relative z-10 w-full max-w-md rounded-xl bg-white p-6 shadow-xl">
            <h3 className="text-lg font-semibold text-zinc-900">
              ¿Eliminar producto?
            </h3>
            <p className="mt-2 text-sm text-zinc-500">
              Esta accion no se puede deshacer. El producto &quot;{product.name}&quot; sera eliminado permanentemente.
            </p>
            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="rounded-md border border-zinc-200 bg-white px-4 py-2 text-sm font-medium text-zinc-700 transition-colors hover:bg-zinc-50"
              >
                Cancelar
              </button>
              <button
                onClick={() => {
                  onDelete(product.id)
                  setShowDeleteModal(false)
                }}
                className="rounded-md bg-red-500 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-red-600"
              >
                Eliminar
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
