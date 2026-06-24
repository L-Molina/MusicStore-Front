import {
  AlertTriangle,
  BarChart3,
  Package,
  Plus,
  Search,
  ShoppingCart,
  TrendingUp
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { QUESTION_PLACEHOLDER } from "../../utils/images";

const API_URL = "http://localhost:8080";

function money(value) {
  const number = Number(value || 0);

  return `$${number.toLocaleString("es-AR", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

function formatDate(date) {
  if (!date) return "Sin fecha";

  try {
    return new Date(date).toLocaleDateString("es-AR", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  } catch {
    return date;
  }
}

function getDiscountAmount(product) {
  return Number(product?.descuento || 0);
}

function getDiscountPercent(product) {
  const price = Number(product?.precio || 0);
  const discount = getDiscountAmount(product);

  if (!price || !discount) return 0;

  return Math.round((discount / price) * 100);
}

function getImage(product) {
  const file = product?.foto?.file;

  if (!file) return QUESTION_PLACEHOLDER;

  return `data:image/jpeg;base64,${file}`;
}

function getOrderItems(order) {
  return (
    order.items ||
    order.productos ||
    order.detalles ||
    order.detallePedidos ||
    order.detalleProductos ||
    order.cart ||
    order.lineas ||
    []
  );
}

function getItemProductId(item) {
  const product = item.producto || item.product || item;

  return String(
    product.id || item.productoId || item.productId || item.id || ""
  );
}

function getItemName(item) {
  const product = item.producto || item.product || item;

  return (
    product.nombre || product.name || item.nombre || item.name || "Producto"
  );
}

function getItemQuantity(item) {
  return Number(item.cantidad || item.quantity || 1);
}

function getItemUnitPrice(item) {
  const product = item.producto || item.product || item;

  return Number(
    item.precioUnitario ||
      item.precio ||
      item.price ||
      product.precio ||
      product.price ||
      0
  );
}

function normalizeOrder(order, source = "local") {
  return {
    ...order,
    id: order.id || order.orderId || `LOCAL-${order.fecha || Date.now()}`,
    source,
    fecha: order.fecha || order.date || order.createdAt || order.fechaCompra || "",
    estado: order.estado || order.status || "Procesando",
    total: Number(order.total || order.totalFinal || order.precioTotal || 0),
    usuarioNombre:
      order.usuario?.nombre ||
      order.usuarioNombre ||
      order.nombreUsuario ||
      "Cliente",
    usuarioMail:
      order.usuario?.mail ||
      order.usuario?.email ||
      order.usuarioMail ||
      order.email ||
      order.mail ||
      "",
    items: getOrderItems(order),
  };
}

export default function VendedorPanel() {
  const { user, token } = useSelector((state) => state.auth);

  const [activeTab, setActiveTab] = useState("dashboard");
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [sellerOrders, setSellerOrders] = useState([]);

  const [searchTerm, setSearchTerm] = useState("");
  const [stockFilter, setStockFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  const [showProductModal, setShowProductModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);

  const emptyProduct = {
    nombre: "",
    descripcion: "",
    precio: "",
    stock: "",
    descuento: 0,
    categoriaId: "",
    image: null,
  };

  const [productForm, setProductForm] = useState(emptyProduct);

  const authHeaders = {
    Authorization: `Bearer ${token}`,
  };

  async function fetchPhoto(photoId) {
    try {
      const res = await fetch(`${API_URL}/fotos/${photoId}`);
      if (!res.ok) return null;
      return await res.json();
    } catch {
      return null;
    }
  }

  async function loadProducts() {
    const res = await fetch(`${API_URL}/productos/mios`, {
      headers: authHeaders,
    });

    if (!res.ok) throw new Error("No se pudieron cargar tus productos");

    const data = await res.json();

    const formatted = await Promise.all(
      data.map(async (p) => {
        let foto = null;

        if (p.fotosIds?.length > 0) {
          const lastPhotoId = p.fotosIds[p.fotosIds.length - 1];
          foto = await fetchPhoto(lastPhotoId);
        }

        return {
          ...p,
          foto,
          categoriaId: p.categoria?.id,
          categoriaNombre: p.categoria?.nombre || "Sin categoría",
        };
      })
    );

    setProducts(formatted);
    return formatted;
  }

  async function loadCategories() {
    const res = await fetch(`${API_URL}/categorias`);
    if (!res.ok) throw new Error("No se pudieron cargar las categorías");

    const data = await res.json();
    setCategories(data);
  }

  function loadLocalOrders() {
    const keys = Object.keys(localStorage).filter((key) => {
      return (
        key === "orders" ||
        key === "compras" ||
        key.startsWith("orders_user_")
      );
    });

    let orders = [];

    keys.forEach((key) => {
      try {
        const raw = localStorage.getItem(key);
        if (!raw) return;

        const parsed = JSON.parse(raw);

        if (Array.isArray(parsed)) {
          orders = [
            ...orders,
            ...parsed.map((order) => normalizeOrder(order, "local")),
          ];
        }
      } catch {
        // Ignoramos claves inválidas
      }
    });

    return orders;
  }

  async function loadBackendSellerOrders() {
    try {
      const res = await fetch(`${API_URL}/pedidos/mis-productos`, {
        headers: authHeaders,
      });

      if (!res.ok) return [];

      const data = await res.json();

      if (!Array.isArray(data)) return [];

      return data.map((order) => normalizeOrder(order, "backend"));
    } catch {
      return [];
    }
  }

  async function loadSellerOrders(sellerProducts) {
    const sellerProductIds = new Set(
      sellerProducts.map((product) => String(product.id))
    );

    const localOrders = loadLocalOrders();
    const backendOrders = await loadBackendSellerOrders();

    const allOrders = [...backendOrders, ...localOrders];

    const filtered = allOrders
      .map((order) => {
        const sellerItems = getOrderItems(order).filter((item) => {
          const productId = getItemProductId(item);
          return sellerProductIds.has(productId);
        });

        const sellerTotal = sellerItems.reduce((acc, item) => {
          return acc + getItemUnitPrice(item) * getItemQuantity(item);
        }, 0);

        return {
          ...order,
          sellerItems,
          sellerTotal,
        };
      })
      .filter((order) => order.sellerItems.length > 0);

    const unique = filtered.filter((order, index, self) => {
      const key = `${order.id}-${order.sellerTotal}`;

      return (
        index ===
        self.findIndex((other) => `${other.id}-${other.sellerTotal}` === key)
      );
    });

    unique.sort((a, b) => {
      const dateA = new Date(a.fecha || 0).getTime();
      const dateB = new Date(b.fecha || 0).getTime();
      return dateB - dateA;
    });

    setSellerOrders(unique);
  }

  async function loadAll() {
    try {
      setLoading(true);

      const loadedProducts = await loadProducts();

      await Promise.all([
        loadCategories(),
        loadSellerOrders(loadedProducts || []),
      ]);
    } catch (error) {
      console.error(error);
      setMessage("No se pudieron cargar los datos de gestión de inventario.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (token) loadAll();
  }, [token]);

  const filteredProducts = useMemo(() => {
    const term = searchTerm.toLowerCase();

    return products.filter((p) => {
      const stock = Number(p.stock || 0);

      const matchesSearch =
        p.nombre?.toLowerCase().includes(term) ||
        p.descripcion?.toLowerCase().includes(term) ||
        p.categoriaNombre?.toLowerCase().includes(term);

      let matchesStock = true;

      if (stockFilter === "no-stock") {
        matchesStock = stock === 0;
      }

      if (stockFilter === "low-stock") {
        matchesStock = stock > 0 && stock <= 3;
      }

      if (stockFilter === "normal-stock") {
        matchesStock = stock > 3 && stock <= 20;
      }

      if (stockFilter === "high-stock") {
        matchesStock = stock > 20;
      }

      return matchesSearch && matchesStock;
    });
  }, [products, searchTerm, stockFilter]);

  const stats = {
    totalProducts: products.length,
    activeProducts: products.filter((p) => Number(p.stock) > 0).length,
    lowStock: products.filter(
      (p) => Number(p.stock) > 0 && Number(p.stock) <= 3
    ).length,
    noStock: products.filter((p) => Number(p.stock) === 0).length,
    highStock: products.filter((p) => Number(p.stock) > 20).length,
    discounts: products.filter((p) => Number(p.descuento) > 0).length,
    totalInventoryValue: products.reduce(
      (acc, product) =>
        acc + Number(product.precio || 0) * Number(product.stock || 0),
      0
    ),
    receivedOrders: sellerOrders.length,
    sellerRevenue: sellerOrders.reduce(
      (acc, order) => acc + Number(order.sellerTotal || 0),
      0
    ),
  };

  function openNewProductModal() {
    setEditingProduct(null);
    setProductForm(emptyProduct);
    setShowProductModal(true);
  }

  function openEditProductModal(product) {
    setEditingProduct(product);
    setProductForm({
      nombre: product.nombre || "",
      descripcion: product.descripcion || "",
      precio: product.precio || "",
      stock: product.stock || "",
      descuento: getDiscountPercent(product),
      categoriaId: product.categoriaId || product.categoria?.id || "",
      image: null,
    });
    setShowProductModal(true);
  }

  function closeProductModal() {
    setShowProductModal(false);
    setEditingProduct(null);
    setProductForm(emptyProduct);
  }

  async function uploadProductImage(productId, image) {
    if (!image) return;

    const formData = new FormData();
    formData.append("productoId", productId);
    formData.append("file", image);

    const res = await fetch(`${API_URL}/fotos`, {
      method: "POST",
      headers: authHeaders,
      body: formData,
    });

    if (!res.ok) throw new Error("No se pudo subir la imagen");
  }

  async function saveProduct(e) {
    e.preventDefault();

    try {
      const precio = Number(productForm.precio || 0);
      const descuentoPorcentaje = Number(productForm.descuento || 0);
      const descuentoMonto = (precio * descuentoPorcentaje) / 100;

      const payload = {
        nombre: productForm.nombre,
        descripcion: productForm.descripcion,
        precio,
        stock: Number(productForm.stock),
        descuento: descuentoMonto,
        categoriaId: Number(productForm.categoriaId),
      };

      let productId = editingProduct?.id;

      if (editingProduct) {
        const res = await fetch(`${API_URL}/productos/${editingProduct.id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            ...authHeaders,
          },
          body: JSON.stringify(payload),
        });

        if (!res.ok) throw new Error("No se pudo actualizar el producto");
      } else {
        const res = await fetch(`${API_URL}/productos`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            ...authHeaders,
          },
          body: JSON.stringify(payload),
        });

        if (!res.ok) throw new Error("No se pudo crear el producto");

        const savedProduct = await res.json();
        productId = savedProduct.id;
      }

      if (productForm.image) {
        await uploadProductImage(productId, productForm.image);
      }

      const loadedProducts = await loadProducts();
      await loadSellerOrders(loadedProducts || []);
      closeProductModal();

      setMessage(
        editingProduct
          ? "Producto actualizado correctamente."
          : "Producto creado correctamente."
      );
    } catch (error) {
      console.error(error);
      setMessage(error.message || "Error guardando producto.");
    }
  }

  async function deleteProduct(id) {
    const confirmDelete = window.confirm(
      "¿Seguro que querés eliminar este producto?"
    );

    if (!confirmDelete) return;

    try {
      const res = await fetch(`${API_URL}/productos/${id}`, {
        method: "DELETE",
        headers: authHeaders,
      });

      if (!res.ok) throw new Error("No se pudo eliminar el producto");

      const loadedProducts = await loadProducts();
      await loadSellerOrders(loadedProducts || []);

      setMessage("Producto eliminado correctamente.");
    } catch (error) {
      console.error(error);
      setMessage("Error eliminando producto.");
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-black px-8 py-12 text-white">
        <p>Cargando gestión de inventario...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <section className="border-b border-white/10 bg-gradient-to-b from-zinc-900 to-black px-6 py-8 lg:px-16">
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="text-sm text-zinc-400">Panel de vendedor</p>

              <h1 className="mt-2 text-4xl font-bold">
                Gestión de inventario
              </h1>

              <p className="mt-2 text-sm text-zinc-400">
                Hola, {user?.nombre || "vendedor"}. Gestioná tus productos,
                stock, descuentos, imágenes y pedidos recibidos.
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <button
                onClick={openNewProductModal}
                className="flex items-center gap-2 rounded-md bg-[#ba203f] px-5 py-3 text-sm font-semibold text-white hover:bg-red-700"
              >
                <Plus size={16} />
                Publicar producto
              </button>

              <button
                onClick={() => setActiveTab("inventory")}
                className="flex items-center gap-2 rounded-md border border-white/15 px-5 py-3 text-sm font-semibold hover:bg-white/10"
              >
                <Package size={16} />
                Ver inventario
              </button>
            </div>
          </div>

          {message && (
            <div className="mt-6 rounded-lg border border-[#ba203f]/40 bg-[#ba203f]/10 px-4 py-3 text-sm text-red-100">
              {message}
            </div>
          )}

          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
            <StatCard
              title="Valor del inventario"
              value={money(stats.totalInventoryValue)}
              detail="Según precio y stock actual"
            />

            <StatCard
              title="Productos activos"
              value={stats.activeProducts}
              detail={`${stats.totalProducts} productos propios`}
            />

            <StatCard
              title="Con descuento"
              value={stats.discounts}
              detail="Productos con promoción activa"
            />

            <StatCard
              title="Stock crítico"
              value={stats.lowStock + stats.noStock}
              detail="Sin stock o bajo stock"
              danger
            />

            <StatCard
              title="Pedidos recibidos"
              value={stats.receivedOrders}
              detail={`${money(stats.sellerRevenue)} en productos vendidos`}
            />
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-8 lg:px-16">
        <div className="mb-6 flex flex-wrap gap-2">
          <TabButton
            active={activeTab === "dashboard"}
            onClick={() => setActiveTab("dashboard")}
          >
            <BarChart3 size={16} /> Dashboard
          </TabButton>

          <TabButton
            active={activeTab === "inventory"}
            onClick={() => setActiveTab("inventory")}
          >
            <Package size={16} /> Inventario
          </TabButton>

          <TabButton
            active={activeTab === "orders"}
            onClick={() => setActiveTab("orders")}
          >
            <ShoppingCart size={16} /> Pedidos recibidos
          </TabButton>
        </div>

        {activeTab === "dashboard" && (
          <Dashboard
            products={products}
            onEdit={openEditProductModal}
            onDelete={deleteProduct}
            sellerOrders={sellerOrders}
          />
        )}

        {activeTab === "inventory" && (
          <Inventory
            products={filteredProducts}
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            stockFilter={stockFilter}
            setStockFilter={setStockFilter}
            onEdit={openEditProductModal}
            onDelete={deleteProduct}
          />
        )}

        {activeTab === "orders" && <SellerOrders orders={sellerOrders} />}
      </section>

      {showProductModal && (
        <ProductModal
          editingProduct={editingProduct}
          productForm={productForm}
          setProductForm={setProductForm}
          categories={categories}
          closeProductModal={closeProductModal}
          saveProduct={saveProduct}
        />
      )}
    </div>
  );
}

function StatCard({ title, value, detail, danger }) {
  return (
    <div className="rounded-xl border border-white/10 bg-zinc-900/80 p-5">
      <p className="text-xs font-semibold uppercase tracking-wide text-zinc-500">
        {title}
      </p>

      <p
        className={`mt-2 text-2xl font-bold ${
          danger ? "text-[#ba203f]" : "text-white"
        }`}
      >
        {value}
      </p>

      <p className="mt-1 text-xs text-zinc-500">{detail}</p>
    </div>
  );
}

function TabButton({ active, onClick, children }) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-2 rounded-md px-4 py-2 text-sm font-semibold transition ${
        active
          ? "bg-[#ba203f] text-white"
          : "border border-white/10 bg-zinc-900 text-zinc-300 hover:bg-white/10"
      }`}
    >
      {children}
    </button>
  );
}

function Dashboard({ products, onEdit, onDelete, sellerOrders }) {
  const recentProducts = products.slice(0, 5);
  const lowStock = products.filter(
    (p) => Number(p.stock) > 0 && Number(p.stock) <= 3
  );
  const noStock = products.filter((p) => Number(p.stock) === 0);
  const highStock = products.filter((p) => Number(p.stock) > 20);
  const recentOrders = sellerOrders.slice(0, 3);

  return (
    <div className="grid gap-6 lg:grid-cols-[1.35fr_0.65fr]">
      <div className="space-y-6">
        <div className="rounded-xl border border-white/10 bg-zinc-900/80">
          <div className="border-b border-white/10 px-6 py-5">
            <h2 className="text-xl font-bold">Tus productos recientes</h2>
            <p className="mt-1 text-sm text-zinc-500">
              Vista rápida de tus publicaciones.
            </p>
          </div>

          <div className="overflow-x-auto">
            <ProductTable
              products={recentProducts}
              onEdit={onEdit}
              onDelete={onDelete}
              compact
            />
          </div>
        </div>

        <div className="rounded-xl border border-white/10 bg-zinc-900/80">
          <div className="border-b border-white/10 px-6 py-5">
            <h2 className="text-xl font-bold">Últimos pedidos recibidos</h2>
            <p className="mt-1 text-sm text-zinc-500">
              Pedidos que incluyen productos publicados por vos.
            </p>
          </div>

          <SellerOrdersCompact orders={recentOrders} />
        </div>
      </div>

      <div className="space-y-6">
        <div className="rounded-xl border border-white/10 bg-zinc-900/80 p-6">
          <h2 className="flex items-center gap-2 text-xl font-bold">
            <AlertTriangle size={20} className="text-[#ba203f]" />
            Estado de stock
          </h2>

          <div className="mt-5 grid grid-cols-3 gap-3 text-center">
            <div className="rounded-lg border border-red-500/20 bg-red-500/10 p-3">
              <p className="text-2xl font-bold text-red-300">
                {noStock.length}
              </p>
              <p className="text-xs text-zinc-400">Sin stock</p>
            </div>

            <div className="rounded-lg border border-yellow-500/20 bg-yellow-500/10 p-3">
              <p className="text-2xl font-bold text-yellow-300">
                {lowStock.length}
              </p>
              <p className="text-xs text-zinc-400">Bajo stock</p>
            </div>

            <div className="rounded-lg border border-blue-500/20 bg-blue-500/10 p-3">
              <p className="text-2xl font-bold text-blue-300">
                {highStock.length}
              </p>
              <p className="text-xs text-zinc-400">Mucho stock</p>
            </div>
          </div>

          <div className="mt-5 space-y-4">
            {[...noStock, ...lowStock].slice(0, 5).map((product) => (
              <div key={product.id} className="flex items-start gap-3 text-sm">
                <span className="mt-2 h-2 w-2 rounded-full bg-[#ba203f]" />
                <div>
                  <p className="text-zinc-100">{product.nombre}</p>
                  <p className="text-xs text-zinc-500">
                    Stock: {product.stock} unidades
                  </p>
                </div>
              </div>
            ))}

            {noStock.length === 0 && lowStock.length === 0 && (
              <p className="text-sm text-zinc-500">
                No tenés productos con stock crítico.
              </p>
            )}
          </div>
        </div>

        <div className="rounded-xl border border-[#ba203f]/40 bg-[#ba203f]/10 p-6">
          <h2 className="flex items-center gap-2 text-xl font-bold">
            <TrendingUp size={20} />
            Resumen del vendedor
          </h2>

          <p className="mt-3 text-sm text-zinc-300">
            Este panel permite controlar tus productos publicados, actualizar
            precios, stock, descuentos, imágenes y revisar pedidos asociados a
            tus productos.
          </p>
        </div>
      </div>
    </div>
  );
}

function Inventory({
  products,
  searchTerm,
  setSearchTerm,
  stockFilter,
  setStockFilter,
  onEdit,
  onDelete,
}) {
  return (
    <div className="rounded-xl border border-white/10 bg-zinc-900/80">
      <div className="flex flex-col gap-4 border-b border-white/10 px-6 py-5 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h2 className="text-xl font-bold">Tus productos</h2>
          <p className="mt-1 text-sm text-zinc-500">
            Editá precio, stock, descuento, categoría, descripción e imagen.
          </p>
        </div>

        <div className="flex w-full flex-col gap-3 lg:w-auto lg:flex-row">
          <select
            value={stockFilter}
            onChange={(e) => setStockFilter(e.target.value)}
            className="rounded-md border border-white/10 bg-black px-4 py-2 text-sm text-white outline-none focus:border-[#ba203f]"
          >
            <option value="all">Todos los stocks</option>
            <option value="no-stock">Sin stock</option>
            <option value="low-stock">Bajo stock</option>
            <option value="normal-stock">Stock normal</option>
            <option value="high-stock">Mucho stock</option>
          </select>

          <div className="relative w-full lg:w-80">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500"
              size={16}
            />
            <input
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Buscar tus productos..."
              className="w-full rounded-md border border-white/10 bg-black px-9 py-2 text-sm text-white outline-none focus:border-[#ba203f]"
            />
          </div>
        </div>
      </div>

      <div className="overflow-x-auto">
        <ProductTable products={products} onEdit={onEdit} onDelete={onDelete} />
      </div>
    </div>
  );
  function ProductTable({ products, onEdit, onDelete, compact }) {
    return (
      <table className="w-full min-w-[850px] text-left text-sm">
        <thead className="bg-white/5 text-xs uppercase tracking-wide text-zinc-500">
          <tr>
            <th className="px-6 py-4">Producto</th>
            <th className="px-6 py-4">Categoría</th>
            <th className="px-6 py-4">Stock</th>
            <th className="px-6 py-4">Precio</th>
            <th className="px-6 py-4">Descuento</th>
            <th className="px-6 py-4">Estado</th>
            <th className="px-6 py-4 text-right">Acciones</th>
          </tr>
        </thead>
  
        <tbody>
          {products.map((product) => (
            <tr key={product.id} className="border-t border-white/10">
              <td className="px-6 py-4">
                <div className="flex items-center gap-3">
                  <img
                    src={getImage(product)}
                    alt={product.nombre}
                    className="h-12 w-12 rounded-md object-cover"
                  />
  
                  <div>
                    <p className="font-semibold text-white">{product.nombre}</p>
                    <p className="max-w-xs truncate text-xs text-zinc-500">
                      {product.descripcion}
                    </p>
                  </div>
                </div>
              </td>
  
              <td className="px-6 py-4 text-zinc-300">
                {product.categoriaNombre}
              </td>
  
              <td className="px-6 py-4 text-zinc-300">
                {product.stock} unidades
              </td>
  
              <td className="px-6 py-4 font-semibold text-white">
                {money(product.precio)}
              </td>
  
              <td className="px-6 py-4">
                {Number(product.descuento || 0) > 0 ? (
                  <div>
                    <p className="font-semibold text-[#ba203f]">
                      {getDiscountPercent(product)}%
                    </p>
  
                    <p className="text-xs text-zinc-500">
                      {money(product.descuento)} de descuento
                    </p>
                  </div>
                ) : (
                  <span className="text-zinc-500">Sin descuento</span>
                )}
              </td>
  
              <td className="px-6 py-4">
                {Number(product.stock) === 0 ? (
                  <span className="rounded bg-red-500/15 px-2 py-1 text-xs font-semibold text-red-300">
                    Sin stock
                  </span>
                ) : Number(product.stock) <= 3 ? (
                  <span className="rounded bg-yellow-500/15 px-2 py-1 text-xs font-semibold text-yellow-300">
                    Bajo stock
                  </span>
                ) : Number(product.stock) > 20 ? (
                  <span className="rounded bg-blue-500/15 px-2 py-1 text-xs font-semibold text-blue-300">
                    Mucho stock
                  </span>
                ) : (
                  <span className="rounded bg-green-500/15 px-2 py-1 text-xs font-semibold text-green-300">
                    En venta
                  </span>
                )}
              </td>
  
              <td className="px-6 py-4">
                <div className="flex justify-end gap-2">
                  <button
                    onClick={() => onEdit(product)}
                    className="rounded-md border border-white/10 p-2 text-zinc-300 hover:bg-white/10 hover:text-white"
                    title="Editar"
                  >
                    <Pencil size={16} />
                  </button>
  
                  {!compact && (
                    <button
                      onClick={() => onDelete(product.id)}
                      className="rounded-md border border-red-500/30 p-2 text-red-300 hover:bg-red-500/10"
                      title="Eliminar"
                    >
                      <Trash2 size={16} />
                    </button>
                  )}
                </div>
              </td>
            </tr>
          ))}
  
          {products.length === 0 && (
            <tr>
              <td colSpan="7" className="px-6 py-10 text-center text-zinc-500">
                No tenés productos publicados todavía.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    );
  }
  
  function SellerOrdersCompact({ orders }) {
    if (orders.length === 0) {
      return (
        <p className="px-6 py-8 text-sm text-zinc-500">
          Todavía no hay pedidos asociados a tus productos.
        </p>
      );
    }
  
    return (
      <div className="divide-y divide-white/10">
        {orders.map((order) => (
          <div key={`${order.id}-${order.sellerTotal}`} className="px-6 py-4">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="font-semibold">Pedido #{order.id}</p>
                <p className="text-xs text-zinc-500">
                  {order.usuarioNombre || "Cliente"} · {formatDate(order.fecha)}
                </p>
              </div>
  
              <p className="font-bold text-[#ba203f]">
                {money(order.sellerTotal)}
              </p>
            </div>
          </div>
        ))}
      </div>
    );
  }
  
  function SellerOrders({ orders }) {
    return (
      <div className="rounded-xl border border-white/10 bg-zinc-900/80">
        <div className="border-b border-white/10 px-6 py-5">
          <h2 className="text-xl font-bold">Pedidos recibidos</h2>
          <p className="mt-1 text-sm text-zinc-500">
            Pedidos de compradores que incluyen productos publicados por vos.
          </p>
        </div>
  
        <div className="overflow-x-auto">
          <table className="w-full min-w-[900px] text-left text-sm">
            <thead className="bg-white/5 text-xs uppercase tracking-wide text-zinc-500">
              <tr>
                <th className="px-6 py-4">Pedido</th>
                <th className="px-6 py-4">Cliente</th>
                <th className="px-6 py-4">Fecha</th>
                <th className="px-6 py-4">Productos tuyos</th>
                <th className="px-6 py-4">Total para vos</th>
                <th className="px-6 py-4">Estado</th>
              </tr>
            </thead>
  
            <tbody>
              {orders.map((order) => (
                <tr
                  key={`${order.id}-${order.sellerTotal}`}
                  className="border-t border-white/10"
                >
                  <td className="px-6 py-4 font-semibold text-white">
                    #{order.id}
                  </td>
  
                  <td className="px-6 py-4 text-zinc-300">
                    <p>{order.usuarioNombre || "Cliente"}</p>
                    <p className="text-xs text-zinc-500">
                      {order.usuarioMail || "Sin email"}
                    </p>
                  </td>
  
                  <td className="px-6 py-4 text-zinc-300">
                    {formatDate(order.fecha)}
                  </td>
  
                  <td className="px-6 py-4">
                    <div className="space-y-2">
                      {order.sellerItems.map((item, index) => (
                        <div
                          key={index}
                          className="rounded-md bg-black/40 px-3 py-2"
                        >
                          <p className="font-semibold text-white">
                            {getItemName(item)}
                          </p>
                          <p className="text-xs text-zinc-500">
                            Cantidad: {getItemQuantity(item)} · Precio unitario:{" "}
                            {money(getItemUnitPrice(item))}
                          </p>
                        </div>
                      ))}
                    </div>
                  </td>
  
                  <td className="px-6 py-4 font-bold text-[#ba203f]">
                    {money(order.sellerTotal)}
                  </td>
  
                  <td className="px-6 py-4">
                    <span className="rounded bg-yellow-500/15 px-2 py-1 text-xs font-semibold text-yellow-300">
                      {order.estado || "Procesando"}
                    </span>
                  </td>
                </tr>
              ))}
  
              {orders.length === 0 && (
                <tr>
                  <td colSpan="6" className="px-6 py-10 text-center text-zinc-500">
                    Todavía no hay pedidos asociados a tus productos.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    );
  }
  
  function ProductModal({
    editingProduct,
    productForm,
    setProductForm,
    categories,
    closeProductModal,
    saveProduct,
  }) {
    return (
      <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 px-4">
        <form
          onSubmit={saveProduct}
          className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-xl border border-white/10 bg-zinc-950 p-6 shadow-2xl"
        >
          <div className="mb-6 flex items-start justify-between gap-4">
            <div>
              <h2 className="text-2xl font-bold">
                {editingProduct ? "Editar producto" : "Publicar producto"}
              </h2>
  
              <p className="mt-1 text-sm text-zinc-500">
                Completá la información del producto.
              </p>
            </div>
  
            <button
              type="button"
              onClick={closeProductModal}
              className="rounded-md p-2 text-zinc-400 hover:bg-white/10 hover:text-white"
            >
              <X size={20} />
            </button>
          </div>
  
          <div className="grid gap-4">
            <label className="grid gap-2 text-sm">
              Nombre
              <input
                required
                value={productForm.nombre}
                onChange={(e) =>
                  setProductForm({ ...productForm, nombre: e.target.value })
                }
                className="rounded-md border border-white/10 bg-black px-4 py-3 outline-none focus:border-[#ba203f]"
              />
            </label>
  
            <label className="grid gap-2 text-sm">
              Descripción
              <textarea
                required
                value={productForm.descripcion}
                onChange={(e) =>
                  setProductForm({
                    ...productForm,
                    descripcion: e.target.value,
                  })
                }
                rows="4"
                className="rounded-md border border-white/10 bg-black px-4 py-3 outline-none focus:border-[#ba203f]"
              />
            </label>
  
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="grid gap-2 text-sm">
                Precio
                <input
                  required
                  type="number"
                  min="0"
                  step="0.01"
                  value={productForm.precio}
                  onChange={(e) =>
                    setProductForm({ ...productForm, precio: e.target.value })
                  }
                  className="rounded-md border border-white/10 bg-black px-4 py-3 outline-none focus:border-[#ba203f]"
                />
              </label>
  
              <label className="grid gap-2 text-sm">
                Stock
                <input
                  required
                  type="number"
                  min="0"
                  value={productForm.stock}
                  onChange={(e) =>
                    setProductForm({ ...productForm, stock: e.target.value })
                  }
                  className="rounded-md border border-white/10 bg-black px-4 py-3 outline-none focus:border-[#ba203f]"
                />
              </label>
            </div>
  
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="grid gap-2 text-sm">
                Descuento en %
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={productForm.descuento}
                  onChange={(e) =>
                    setProductForm({
                      ...productForm,
                      descuento: e.target.value,
                    })
                  }
                  className="rounded-md border border-white/10 bg-black px-4 py-3 outline-none focus:border-[#ba203f]"
                />
                <span className="text-xs text-zinc-500">
                  Escribí 10 para aplicar 10% de descuento.
                </span>
              </label>
  
              <label className="grid gap-2 text-sm">
                Categoría
                <select
                  required
                  value={productForm.categoriaId}
                  onChange={(e) =>
                    setProductForm({
                      ...productForm,
                      categoriaId: e.target.value,
                    })
                  }
                  className="rounded-md border border-white/10 bg-black px-4 py-3 outline-none focus:border-[#ba203f]"
                >
                  <option value="">Seleccionar categoría</option>
  
                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.nombre}
                    </option>
                  ))}
                </select>
              </label>
            </div>
  
            <label className="grid gap-2 text-sm">
              Imagen
              <div className="flex items-center gap-3 rounded-md border border-dashed border-white/20 bg-black px-4 py-4">
                <ImagePlus size={20} className="text-zinc-400" />
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) =>
                    setProductForm({
                      ...productForm,
                      image: e.target.files?.[0] || null,
                    })
                  }
                  className="text-sm text-zinc-400"
                />
              </div>
  
              {editingProduct && (
                <span className="text-xs text-zinc-500">
                  Si no elegís una imagen nueva, queda la imagen actual.
                </span>
              )}
            </label>
          </div>
  
          <div className="mt-8 flex justify-end gap-3">
            <button
              type="button"
              onClick={closeProductModal}
              className="rounded-md border border-white/10 px-5 py-3 text-sm font-semibold text-zinc-300 hover:bg-white/10"
            >
              Cancelar
            </button>
  
            <button
              type="submit"
              className="flex items-center gap-2 rounded-md bg-[#ba203f] px-5 py-3 text-sm font-semibold text-white hover:bg-red-700"
            >
              <Save size={16} />
              Guardar
            </button>
          </div>
        </form>
      </div>
    );
  }
}