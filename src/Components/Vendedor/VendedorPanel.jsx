import { Package, Plus, Search } from "lucide-react"
import { useCallback, useEffect, useState } from "react"
import { useAuth } from "../../context/AuthContext"
import NewProductForm from "./NewProductForm"
import SellerProductCard from "./SellerProductCard"

export default function ProductPanel() {
  const [products, setProducts] = useState([])
  const [searchTerm, setSearchTerm] = useState("")
  const [isNewProductOpen, setIsNewProductOpen] = useState(false)

  const { token, user } = useAuth()

  const discountAmountToPercentage = (price, discountAmount) => {
    const numericPrice = Number(price ?? 0)
    const numericDiscount = Number(discountAmount ?? 0)

    if (numericPrice <= 0 || numericDiscount <= 0) return 0

    return Math.round((numericDiscount / numericPrice) * 100)
  }

  const discountPercentageToAmount = (price, discountPercentage) => {
    const numericPrice = Number(price ?? 0)
    const numericDiscountPercentage = Number(discountPercentage ?? 0)

    if (numericPrice <= 0 || numericDiscountPercentage <= 0) return 0

    return (numericPrice * numericDiscountPercentage) / 100
  }

  const fetchProducts = useCallback(async () => {
    if (!token) return

    try {
      const endpoint =
        user?.rol === "ADMIN"
          ? "http://localhost:8080/productos"
          : "http://localhost:8080/productos/mios"

      const res = await fetch(endpoint, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (!res.ok) {
        throw new Error("Error al traer productos")
      }

      const data = await res.json()

      const formatted = await Promise.all(
        data.map(async (p) => {
          let fotos = []

          if (p.fotosIds?.length > 0) {
            const fotoRes = await fetch(
              `http://localhost:8080/fotos/${p.fotosIds[0]}`
            )

            if (fotoRes.ok) {
              const fotoData = await fotoRes.json()
              fotos = [fotoData]
            }
          }

          const price = Number(p.precio ?? 0)
          const discountAmount = Number(p.descuento ?? 0)
          const discountPercentage = discountAmountToPercentage(
            price,
            discountAmount
          )

          return {
            id: p.id,
            name: p.nombre,
            description: p.descripcion,
            price,
            discount: discountPercentage,
            discountAmount,
            stock: p.stock,
            category: p.categoria,
            categoryId: p.categoria?.id,
            categoryName: p.categoria?.nombre,
            fotosIds: p.fotosIds,
            fotos,
          }
        })
      )

      setProducts(formatted)
    } catch (error) {
      console.error("Error al traer productos:", error)
    }
  }, [token, user])

  useEffect(() => {
    fetchProducts()
  }, [fetchProducts])

  const handleUpdate = async (id, updates) => {
    try {
      const productToUpdate = products.find((p) => p.id === id)

      if (!productToUpdate) return

      const finalDiscountPercentage =
        updates.discount !== undefined
          ? Number(updates.discount)
          : Number(productToUpdate.discount ?? 0)

      const discountAmount = discountPercentageToAmount(
        productToUpdate.price,
        finalDiscountPercentage
      )

      const payload = {
        nombre: productToUpdate.name,
        descripcion: productToUpdate.description,
        precio: productToUpdate.price,
        stock: updates.stock ?? productToUpdate.stock,
        descuento: discountAmount,
        categoriaId: productToUpdate.categoryId,
      }

      const res = await fetch(`http://localhost:8080/productos/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      })

      if (!res.ok) {
        throw new Error("Error actualizando producto")
      }

      setProducts((prev) =>
        prev.map((product) =>
          product.id === id
            ? {
                ...product,
                ...updates,
                discount: finalDiscountPercentage,
                discountAmount,
              }
            : product
        )
      )
    } catch (error) {
      console.error("Error actualizando producto:", error)
    }
  }

  const handleDelete = async (id) => {
    try {
      const res = await fetch(`http://localhost:8080/productos/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (!res.ok) {
        throw new Error("Error eliminando producto")
      }

      setProducts((prev) => prev.filter((product) => product.id !== id))
    } catch (error) {
      console.error("Error eliminando producto:", error)
    }
  }

  const handleAddProduct = async (newProduct) => {
    try {
      const price = Number(newProduct.price ?? 0)
      const discountPercentage = Number(newProduct.discount ?? 0)
      const discountAmount = discountPercentageToAmount(
        price,
        discountPercentage
      )

      const payload = {
        nombre: newProduct.name,
        descripcion: newProduct.description,
        precio: price,
        descuento: discountAmount,
        stock: Number(newProduct.stock ?? 0),
        categoriaId: newProduct.categoryId,
      }

      const res = await fetch("http://localhost:8080/productos", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      })

      if (!res.ok) {
        throw new Error("Error creando producto")
      }

      const savedProduct = await res.json()
      const productoId = savedProduct.id

      const formData = new FormData()
      formData.append("productoId", productoId)
      formData.append("file", newProduct.image)

      const resImage = await fetch("http://localhost:8080/fotos", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      })

      if (!resImage.ok) {
        throw new Error("Error subiendo imagen")
      }

      setIsNewProductOpen(false)
      await fetchProducts()
    } catch (error) {
      console.error("Error creando producto:", error)
    }
  }

  const filteredProducts = products.filter((product) => {
    const name = (product.name || "").toLowerCase()
    const description = (product.description || "").toLowerCase()

    return (
      name.includes(searchTerm.toLowerCase()) ||
      description.includes(searchTerm.toLowerCase())
    )
  })

  const stats = {
    total: products.length,
    outOfStock: products.filter((p) => p.stock === 0).length,
    withDiscount: products.filter((p) => p.discount > 0).length,
  }

  return (
    <div className="min-h-screen bg-zinc-50">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-zinc-900">
              Mis Productos
            </h1>

            <p className="mt-2 text-zinc-500">
              Gestiona tus productos publicados, ajusta precios, stock y
              descuentos.
            </p>
          </div>

          <button
            onClick={() => setIsNewProductOpen(true)}
            className="flex items-center gap-2 rounded-md bg-zinc-900 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-zinc-800"
          >
            <Plus className="h-4 w-4" />
            Publicar producto
          </button>
        </div>

        <div className="mb-8 grid grid-cols-2 gap-4 sm:grid-cols-4">
          <div className="rounded-lg border border-zinc-200 bg-white p-4">
            <p className="text-sm font-medium text-zinc-500">Total</p>
            <p className="mt-1 text-2xl font-semibold text-zinc-900">
              {stats.total}
            </p>
          </div>

          <div className="rounded-lg border border-zinc-200 bg-white p-4">
            <p className="text-sm font-medium text-zinc-500">Sin stock</p>
            <p className="mt-1 text-2xl font-semibold text-red-600">
              {stats.outOfStock}
            </p>
          </div>

          <div className="rounded-lg border border-zinc-200 bg-white p-4">
            <p className="text-sm font-medium text-zinc-500">Con descuento</p>
            <p className="mt-1 text-2xl font-semibold text-green-600">
              {stats.withDiscount}
            </p>
          </div>
        </div>

        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative flex-1 sm:max-w-xs">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />

            <input
              type="text"
              placeholder="Buscar productos..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="h-10 w-full rounded-md border border-zinc-200 bg-white pl-9 pr-4 text-sm focus:border-zinc-500 focus:outline-none focus:ring-1 focus:ring-zinc-500"
            />
          </div>
        </div>

        {filteredProducts.length > 0 ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filteredProducts.map((product) => (
              <SellerProductCard
                key={product.id}
                product={product}
                onUpdate={handleUpdate}
                onDelete={handleDelete}
              />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-zinc-300 bg-white py-16">
            <Package className="h-12 w-12 text-zinc-400" />

            <h3 className="mt-4 text-lg font-medium text-zinc-900">
              No hay productos
            </h3>

            <p className="mt-1 text-sm text-zinc-500">
              {searchTerm
                ? "No se encontraron productos."
                : "Aún no has publicado ningún producto."}
            </p>
          </div>
        )}
      </div>

      <NewProductForm
        isOpen={isNewProductOpen}
        onClose={() => setIsNewProductOpen(false)}
        onSubmit={handleAddProduct}
      />
    </div>
  )
}