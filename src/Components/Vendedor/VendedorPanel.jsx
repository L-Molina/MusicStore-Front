import { useState, useEffect } from "react"
import { Package, Search, Plus } from "lucide-react"
import SellerProductCard from "./SellerProductCard"
import NewProductForm from "./NewProductForm"
import { useDispatch, useSelector } from "react-redux";
import {
    fetchMyProducts,
    addMyProduct,
    updateMyProduct,
    deleteMyProduct
} from "../../redux/myProductsSlice";

export default function ProductPanel() {
  const [searchTerm, setSearchTerm] = useState("")
  const [isNewProductOpen, setIsNewProductOpen] = useState(false)
  const dispatch = useDispatch()
  const { myProducts, error, loading } = useSelector((state) => state.myProducts)

  // traer los productos
    useEffect(() => {
    dispatch(fetchMyProducts())
  }, [dispatch])

  if (loading) {
    return <p>Cargando productos...</p>
  }

  if (error) {
    return <p>Error: {error}</p>
  }

  // crear una lista filtrada de productos segun el texto de busqueda
  const filteredProducts = myProducts.filter((product) => {
    const name = (product.name || "").toLowerCase()
    const description = (product.description || "").toLowerCase()

    return (
      name.includes(searchTerm.toLowerCase()) ||
      description.includes(searchTerm.toLowerCase())
    )
  })

  // calcular estadisticas sobre los productos
  const stats = {
    total: myProducts.length,
    outOfStock: myProducts.filter((p) => p.stock === 0).length,
    withDiscount: myProducts.filter((p) => p.discount > 0).length,
  }

  return (
    <div className="min-h-screen bg-zinc-50">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-zinc-900">
              Mis Productos
            </h1>
          <p className="mt-2 text-zinc-500">
            Gestiona tus productos publicados, ajusta precios, stock y descuentos.
          </p>
          </div>
        {/* Add Product Button */}
        <button
          onClick={() => setIsNewProductOpen(true)}
          className="flex items-center gap-2 rounded-md bg-zinc-900 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-zinc-800"
        >
          <Plus className="h-4 w-4" />
          Publicar producto
        </button>
        </div>

        {/* Stats */}
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

        {/* Filters */}
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
        {/* Products Grid */}
        {filteredProducts.length > 0 ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filteredProducts.map((product) => (
              <SellerProductCard
                key={product.id}
                product={product}
                
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
  : "Aun no has publicado ningun producto."}
            </p>
          </div>
        )}
      </div>

      {/* New Product Form Modal */}
      <NewProductForm
        isOpen={isNewProductOpen}
        onClose={() => setIsNewProductOpen(false)}
      />
    </div>
  )
}