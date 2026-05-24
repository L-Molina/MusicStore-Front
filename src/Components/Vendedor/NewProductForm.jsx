import { useState, useRef, useEffect } from "react"
import { X, ImagePlus } from "lucide-react"

export default function NewProductForm({ isOpen, onClose, onSubmit }) {
  const [categories, setCategories] = useState([])
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    discount: "0",
    stock: "0",
    categoryId:""
  })
const [imageFile, setImageFile] = useState(null)
const [imagePreview, setImagePreview] = useState(null)
  const [errors, setErrors] = useState({})
  const fileInputRef = useRef(null)

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }))
    }
  }

  const handleImageChange = (e) => {
    const file = e.target.files?.[0]
    if (file) {
      // Create preview URL
      setImageFile(file)
    setImagePreview(URL.createObjectURL(file))
      setFormData((prev) => ({ ...prev, image: file }))
      if (errors.image) {
        setErrors((prev) => ({ ...prev, image: null }))
      }
    }
  }

  const removeImage = () => {
    setImagePreview(null)
    setFormData((prev) => ({ ...prev, image: "" }))
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  const validate = () => {
    const newErrors = {}
    if (!formData.name.trim()) newErrors.name = "El nombre es requerido"
    if (!formData.description.trim()) newErrors.description = "La descripcion es requerida"
    if (!formData.price || parseFloat(formData.price) <= 0) newErrors.price = "El precio debe ser mayor a 0"
    if (parseInt(formData.stock || 0) < 0)
  newErrors.stock = "El stock no puede ser negativo"
if (!imageFile) newErrors.image = "La imagen es requerida"
    if (!formData.categoryId) newErrors.categoryId = "La categoria es requerida"
    
    const discount = parseInt(formData.discount) || 0
    if (discount < 0 || discount > 100) newErrors.discount = "El descuento debe estar entre 0 y 100"
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (validate()) {
      const newProduct = {
        id: Date.now().toString(),
        name: formData.name.trim(),
        description: formData.description.trim(),
        price: parseFloat(formData.price),
        discount: parseInt(formData.discount) || 0,
        stock: parseInt(formData.stock || 0),
        image: imageFile,
        categoryId: formData.categoryId,
      }
      onSubmit(newProduct)
      handleClose()
    }
  }

const handleClose = () => {
  setFormData({
    name: "",
    description: "",
    price: "",
    discount: "",
    stock: "",
    image: "",
    categoryId:""
  })

  setImageFile(null)
  setImagePreview(null)
  setErrors({})

  if (fileInputRef.current) {
    fileInputRef.current.value = ""
  }

  onClose()
}

  useEffect(() => {
  const fetchCategories = async () => {
    try {
      const res = await fetch("http://localhost:8080/categorias")
      const data = await res.json()
      setCategories(data)
    } catch (error) {
      console.error("Error al traer categorias:", error)
    }
  }

  fetchCategories()
}, [])

  if (!isOpen) return null
  
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50"
        onClick={handleClose}
      />
      
      {/* Modal */}
      <div className="relative z-10 w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-xl bg-white shadow-xl">
        {/* Header */}
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-zinc-200 bg-white px-6 py-4">
          <h2 className="text-xl font-semibold text-zinc-900">
            Publicar nuevo producto
          </h2>
          <button
            onClick={handleClose}
            className="flex h-8 w-8 items-center justify-center rounded-md text-zinc-500 transition-colors hover:bg-zinc-100 hover:text-zinc-700"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6">
          <div className="space-y-6">
            {/* Image Upload Section */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-zinc-700">
                Imagen del producto *
              </label>
              
              {imagePreview ? (
                <div className="relative w-full max-w-xs">
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="h-48 w-full rounded-lg object-cover"
                    onError={() => {
                      setImagePreview(null)
                      setErrors((prev) => ({ ...prev, image: "URL de imagen invalida" }))
                    }}
                  />
                  <button
                    type="button"
                    onClick={removeImage}
                    className="absolute -right-2 -top-2 flex h-6 w-6 items-center justify-center rounded-full bg-red-500 text-white shadow-md transition-colors hover:bg-red-600"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ) : (
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="flex h-48 w-full max-w-xs cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-zinc-300 bg-zinc-50 transition-colors hover:border-zinc-400 hover:bg-zinc-100"
                >
                  <ImagePlus className="h-10 w-10 text-zinc-400" />
                  <p className="mt-2 text-sm text-zinc-500">
                    Haz clic para subir una imagen
                  </p>
                  <p className="text-xs text-zinc-400">
                    PNG, JPG hasta 5MB
                  </p>
                </div>
              )}
              
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
              />
              
              {/* URL Option */}
              
              {errors.image && (
                <p className="text-sm text-red-500">{errors.image}</p>
              )}
            </div>

            {/* Name */}
            <div className="space-y-2">
              <label htmlFor="name" className="text-sm font-medium text-zinc-700">
                Nombre del producto *
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Ej: Auriculares Bluetooth Premium"
                className={`h-10 w-full rounded-md border bg-white px-4 text-sm focus:outline-none focus:ring-1 ${
                  errors.name
                    ? "border-red-300 focus:border-red-500 focus:ring-red-500"
                    : "border-zinc-200 focus:border-zinc-500 focus:ring-zinc-500"
                }`}
              />
              {errors.name && (
                <p className="text-sm text-red-500">{errors.name}</p>
              )}
            </div>

            {/* Description */}
            <div className="space-y-2">
              <label htmlFor="description" className="text-sm font-medium text-zinc-700">
                Descripcion *
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Describe tu producto..."
                rows={3}
                className={`w-full resize-none rounded-md border bg-white px-4 py-3 text-sm focus:outline-none focus:ring-1 ${
                  errors.description
                    ? "border-red-300 focus:border-red-500 focus:ring-red-500"
                    : "border-zinc-200 focus:border-zinc-500 focus:ring-zinc-500"
                }`}
              />
              {errors.description && (
                <p className="text-sm text-red-500">{errors.description}</p>
              )}
            </div>

            {/* Price and Discount */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label htmlFor="price" className="text-sm font-medium text-zinc-700">
                  Precio ($) *
                </label>
                <input
                  type="number"
                  id="price"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  placeholder="0.00"
                  min="0"
                  step="0.01"
                  className={`h-10 w-full rounded-md border bg-white px-4 text-sm focus:outline-none focus:ring-1 ${
                    errors.price
                      ? "border-red-300 focus:border-red-500 focus:ring-red-500"
                      : "border-zinc-200 focus:border-zinc-500 focus:ring-zinc-500"
                  }`}
                />
                {errors.price && (
                  <p className="text-sm text-red-500">{errors.price}</p>
                )}
              </div>

              <div className="space-y-2">
                <label htmlFor="discount" className="text-sm font-medium text-zinc-700">
                  Descuento (%)
                </label>
                <input
                  type="number"
                  id="discount"
                  name="discount"
                  value={formData.discount}
                  onChange={handleChange}
                  placeholder="0"
                  min="0"
                  max="100"
                  className={`h-10 w-full rounded-md border bg-white px-4 text-sm focus:outline-none focus:ring-1 ${
                    errors.discount
                      ? "border-red-300 focus:border-red-500 focus:ring-red-500"
                      : "border-zinc-200 focus:border-zinc-500 focus:ring-zinc-500"
                  }`}
                />
                {errors.discount && (
                  <p className="text-sm text-red-500">{errors.discount}</p>
                )}
              </div>
            </div>

            {/* Stock */}
            <div className="space-y-2">
              <label htmlFor="stock" className="text-sm font-medium text-zinc-700">
                Stock disponible
              </label>
              <input
                type="number"
                id="stock"
                name="stock"
                value={formData.stock}
                onChange={handleChange}
                placeholder="0"
                min="0"
                className={`h-10 w-full max-w-xs rounded-md border bg-white px-4 text-sm focus:outline-none focus:ring-1 ${
                  errors.stock
                    ? "border-red-300 focus:border-red-500 focus:ring-red-500"
                    : "border-zinc-200 focus:border-zinc-500 focus:ring-zinc-500"
                }`}
              />
              {errors.stock && (
                <p className="text-sm text-red-500">{errors.stock}</p>
              )}
            </div>
            <div className="space-y-2">
  <label className="text-sm font-medium text-zinc-700">
    Categoría *
  </label>

  <select
    name="categoryId"
    value={formData.categoryId}
    onChange={(e) =>
    setFormData((prev) => ({
      ...prev,
      categoryId: Number(e.target.value),
    }))
  }
    className="h-10 w-full rounded-md border border-zinc-200 bg-white px-4 text-sm focus:border-zinc-500 focus:outline-none focus:ring-1 focus:ring-zinc-500"
  >
    <option value="">Seleccionar categoría</option>

    {categories.map((cat) => (
      <option key={cat.id} value={cat.id}>
        {cat.nombre}
      </option>
    ))}
  </select>

  {errors.categoryId && (
    <p className="text-sm text-red-500">{errors.categoryId}</p>
  )}
</div>
            
          </div>

          {/* Actions */}
          <div className="mt-8 flex items-center justify-end gap-3 border-t border-zinc-200 pt-6">
            <button
              type="button"
              onClick={handleClose}
              className="rounded-md border border-zinc-200 bg-white px-4 py-2 text-sm font-medium text-zinc-700 transition-colors hover:bg-zinc-50"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="rounded-md bg-zinc-900 px-6 py-2 text-sm font-medium text-white transition-colors hover:bg-zinc-800"
            >
              Publicar producto
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}