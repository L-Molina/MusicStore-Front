import {
  AlertTriangle,
  BarChart3,
  Boxes,
  ChevronRight,
  DollarSign,
  Layers,
  Package,
  Pencil,
  Save,
  Search,
  Settings,
  ShoppingCart,
  Tags,
  Trash2,
  TrendingUp,
  UserRound,
  Users,
  X,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { QUESTION_PLACEHOLDER } from "../../utils/images";

const API_URL = "http://localhost:8080";

function money(value) {
  const number = Number(value || 0);
  return `$${number.toLocaleString("es-AR", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
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

export default function AdminPanel() {
  const { token, user } = useAuth();

  const [activeTab, setActiveTab] = useState("dashboard");
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [orders, setOrders] = useState([]);

  const [searchTerm, setSearchTerm] = useState("");
  const [inventoryFilter, setInventoryFilter] = useState("top");
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  const [editingProduct, setEditingProduct] = useState(null);
  const [showProductModal, setShowProductModal] = useState(false);

  const [newCategoryName, setNewCategoryName] = useState("");

  const [productForm, setProductForm] = useState({
    nombre: "",
    descripcion: "",
    precio: "",
    stock: "",
    descuento: "",
    categoriaId: "",
  });

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
    const res = await fetch(`${API_URL}/productos`);
    if (!res.ok) throw new Error("No se pudieron cargar los productos");

    const data = await res.json();

    const formatted = await Promise.all(
      data.map(async (product) => {
        let foto = null;

        if (product.fotosIds?.length > 0) {
          const lastPhotoId = product.fotosIds[product.fotosIds.length - 1];
          foto = await fetchPhoto(lastPhotoId);
        }

        return {
          ...product,
          foto,
          categoriaNombre: product.categoria?.nombre || "Sin categoría",
          categoriaId: product.categoria?.id || "",
        };
      })
    );

    setProducts(formatted);
  }

  async function loadCategories() {
    const res = await fetch(`${API_URL}/categorias`);
    if (!res.ok) throw new Error("No se pudieron cargar las categorías");

    const data = await res.json();
    setCategories(data);
  }

  async function loadOrders() {
    try {
      const res = await fetch(`${API_URL}/pedidos`, {
        headers: authHeaders,
      });

      if (!res.ok) {
        setOrders([]);
        return;
      }

      const data = await res.json();
      setOrders(data);
    } catch {
      setOrders([]);
    }
  }

  async function loadAll() {
    try {
      setLoading(true);
      await Promise.all([loadProducts(), loadCategories(), loadOrders()]);
    } catch (error) {
      console.error(error);
      setMessage("No se pudieron cargar todos los datos del panel.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (token) loadAll();
  }, [token]);

  const filteredProducts = useMemo(() => {
    const term = searchTerm.toLowerCase();

    return products.filter((product) => {
      return (
        product.nombre?.toLowerCase().includes(term) ||
        product.descripcion?.toLowerCase().includes(term) ||
        product.categoriaNombre?.toLowerCase().includes(term)
      );
    });
  }, [products, searchTerm]);

  const criticalProducts = useMemo(() => {
    return products.filter((product) => Number(product.stock || 0) <= 3);
  }, [products]);

  const outOfStockProducts = useMemo(() => {
    return products.filter((product) => Number(product.stock || 0) === 0);
  }, [products]);

  const highStockProducts = useMemo(() => {
    return products.filter((product) => Number(product.stock || 0) > 20);
  }, [products]);

  const topSellingProducts = useMemo(() => {
    const salesMap = {};

    orders.forEach((order) => {
      const details =
        order.detalles ||
        order.detallePedidos ||
        order.productos ||
        order.items ||
        order.lineas ||
        [];

      details.forEach((item) => {
        const product = item.producto || item.product || item;
        const productId = product.id || item.productoId || item.productId;

        if (!productId) return;

        const productName =
          product.nombre || item.nombre || `Producto #${productId}`;

        const quantity = Number(item.cantidad || item.quantity || 1);

        if (!salesMap[productId]) {
          salesMap[productId] = {
            id: productId,
            nombre: productName,
            cantidad: 0,
          };
        }

        salesMap[productId].cantidad += quantity;
      });
    });

    const calculated = Object.values(salesMap)
      .sort((a, b) => b.cantidad - a.cantidad)
      .slice(0, 5);

    if (calculated.length > 0) return calculated;

    return products
      .slice()
      .sort((a, b) => Number(b.stock || 0) - Number(a.stock || 0))
      .slice(0, 5)
      .map((product) => ({
        id: product.id,
        nombre: product.nombre,
        cantidad: 0,
        fallback: true,
      }));
  }, [orders, products]);

  const uniqueClients = useMemo(() => {
    const ids = new Set();

    orders.forEach((order) => {
      if (order.usuario?.id) ids.add(order.usuario.id);
      if (order.usuarioId) ids.add(order.usuarioId);
    });

    return ids.size;
  }, [orders]);

  const stats = {
    totalRevenue: orders.reduce((acc, order) => acc + Number(order.total || 0), 0),
    products: products.length,
    activeProducts: products.filter((p) => Number(p.stock || 0) > 0).length,
    criticalInventory: criticalProducts.length,
    outOfStock: outOfStockProducts.length,
    categories: categories.length,
    orders: orders.length,
    users: uniqueClients,
  };

  function openEditProduct(product) {
    setEditingProduct(product);
    setProductForm({
      nombre: product.nombre || "",
      descripcion: product.descripcion || "",
      precio: product.precio || "",
      stock: product.stock || "",
      descuento: getDiscountPercent(product),
      categoriaId: product.categoriaId || product.categoria?.id || "",
    });
    setShowProductModal(true);
  }

  function closeProductModal() {
    setEditingProduct(null);
    setShowProductModal(false);
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

      const res = await fetch(`${API_URL}/productos/${editingProduct.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          ...authHeaders,
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error("No se pudo actualizar el producto");

      await loadProducts();
      closeProductModal();
      setMessage("Producto actualizado correctamente.");
    } catch (error) {
      console.error(error);
      setMessage("No se pudo actualizar el producto.");
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

      await loadProducts();
      setMessage("Producto eliminado correctamente.");
    } catch (error) {
      console.error(error);
      setMessage("No se pudo eliminar el producto.");
    }
  }

  async function createCategory(e) {
    e.preventDefault();

    if (!newCategoryName.trim()) return;

    try {
      const res = await fetch(`${API_URL}/categorias`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...authHeaders,
        },
        body: JSON.stringify({
          nombre: newCategoryName.trim(),
        }),
      });

      if (!res.ok) throw new Error("No se pudo crear la categoría");

      setNewCategoryName("");
      await loadCategories();
      setMessage("Categoría creada correctamente.");
    } catch (error) {
      console.error(error);
      setMessage("No se pudo crear la categoría.");
    }
  }

  async function editCategory(category) {
    const newName = window.prompt(
      "Nuevo nombre de la categoría:",
      category.nombre
    );

    if (!newName || !newName.trim()) return;

    try {
      const res = await fetch(`${API_URL}/categorias/${category.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          ...authHeaders,
        },
        body: JSON.stringify({
          nombre: newName.trim(),
        }),
      });

      if (!res.ok) throw new Error("No se pudo actualizar la categoría");

      await loadCategories();
      await loadProducts();
      setMessage("Categoría actualizada correctamente.");
    } catch (error) {
      console.error(error);
      setMessage("No se pudo actualizar la categoría.");
    }
  }

  async function deleteCategory(id) {
    const confirmDelete = window.confirm(
      "¿Seguro que querés eliminar esta categoría? Si tiene productos asociados puede fallar."
    );

    if (!confirmDelete) return;

    try {
      const res = await fetch(`${API_URL}/categorias/${id}`, {
        method: "DELETE",
        headers: authHeaders,
      });

      if (!res.ok) throw new Error("No se pudo eliminar la categoría");

      await loadCategories();
      setMessage("Categoría eliminada correctamente.");
    } catch (error) {
      console.error(error);
      setMessage("No se pudo eliminar. Puede tener productos asociados.");
    }
  }

  async function deleteOrder(id) {
    const confirmDelete = window.confirm("¿Seguro que querés eliminar este pedido?");

    if (!confirmDelete) return;

    try {
      const res = await fetch(`${API_URL}/pedidos/${id}`, {
        method: "DELETE",
        headers: authHeaders,
      });

      if (!res.ok) throw new Error("No se pudo eliminar el pedido");

      await loadOrders();
      setMessage("Pedido eliminado correctamente.");
    } catch (error) {
      console.error(error);
      setMessage("No se pudo eliminar el pedido.");
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-black px-8 py-12 text-white">
        Cargando panel administrativo...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="grid min-h-screen lg:grid-cols-[260px_1fr]">
        <aside className="border-r border-white/10 bg-[#060606] px-5 py-6">
          <div className="mb-10 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#ba203f]/20 text-[#ba203f]">
              <Layers size={22} />
            </div>
            <div>
              <h2 className="text-lg font-bold">MusicStore</h2>
              <p className="text-xs text-zinc-500">Admin Center</p>
            </div>
          </div>

          <nav className="space-y-2">
            <SidebarButton
              active={activeTab === "dashboard"}
              onClick={() => setActiveTab("dashboard")}
              icon={<BarChart3 size={18} />}
              label="Dashboard"
            />
            <SidebarButton
              active={activeTab === "inventory"}
              onClick={() => setActiveTab("inventory")}
              icon={<Package size={18} />}
              label="Inventario"
            />
            <SidebarButton
              active={activeTab === "orders"}
              onClick={() => setActiveTab("orders")}
              icon={<ShoppingCart size={18} />}
              label="Pedidos"
            />
            <SidebarButton
              active={activeTab === "categories"}
              onClick={() => setActiveTab("categories")}
              icon={<Tags size={18} />}
              label="Categorías"
            />
            <SidebarButton
              active={activeTab === "users"}
              onClick={() => setActiveTab("users")}
              icon={<Users size={18} />}
              label="Usuarios"
            />
            <SidebarButton
              active={activeTab === "settings"}
              onClick={() => setActiveTab("settings")}
              icon={<Settings size={18} />}
              label="Sistema"
            />
          </nav>

          <div className="mt-12 border-t border-white/10 pt-6">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-zinc-800">
                <UserRound size={18} />
              </div>
              <div>
                <p className="text-sm font-semibold">
                  {user?.nombre || "Admin"}
                </p>
                <p className="text-xs text-zinc-500">Administrador</p>
              </div>
            </div>
          </div>
        </aside>

        <main className="overflow-hidden">
          <header className="border-b border-white/10 bg-[#080808] px-6 py-5 lg:px-8">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <h1 className="text-3xl font-bold">Dashboard administrativo</h1>
                <p className="mt-1 text-sm text-zinc-500">
                  Vista general del sistema, inventario, pedidos y categorías.
                </p>
              </div>

              <div className="relative w-full lg:w-80">
                <Search
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500"
                  size={16}
                />
                <input
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Buscar en productos..."
                  className="w-full rounded-lg border border-white/10 bg-zinc-950 px-9 py-3 text-sm text-white outline-none focus:border-[#ba203f]"
                />
              </div>
            </div>

            {message && (
              <div className="mt-5 rounded-lg border border-[#ba203f]/40 bg-[#ba203f]/10 px-4 py-3 text-sm text-red-100">
                {message}
              </div>
            )}
          </header>

          <section className="px-6 py-7 lg:px-8">
            {activeTab === "dashboard" && (
              <DashboardView
                stats={stats}
                products={products}
                criticalProducts={criticalProducts}
                outOfStockProducts={outOfStockProducts}
                highStockProducts={highStockProducts}
                orders={orders}
                topSellingProducts={topSellingProducts}
                inventoryFilter={inventoryFilter}
                setInventoryFilter={setInventoryFilter}
              />
            )}

            {activeTab === "inventory" && (
              <InventoryView
                products={filteredProducts}
                onEdit={openEditProduct}
                onDelete={deleteProduct}
              />
            )}

            {activeTab === "orders" && (
              <OrdersView orders={orders} onDelete={deleteOrder} />
            )}

            {activeTab === "categories" && (
              <CategoriesView
                categories={categories}
                newCategoryName={newCategoryName}
                setNewCategoryName={setNewCategoryName}
                createCategory={createCategory}
                editCategory={editCategory}
                deleteCategory={deleteCategory}
              />
            )}

            {activeTab === "users" && (
              <UsersView orders={orders} usersCount={stats.users} />
            )}

            {activeTab === "settings" && <SettingsView />}
          </section>
        </main>
      </div>

      {showProductModal && (
        <ProductModal
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

function SidebarButton({ active, icon, label, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`flex w-full items-center gap-3 rounded-lg px-4 py-3 text-sm font-semibold transition ${
        active
          ? "bg-[#ba203f] text-white"
          : "text-zinc-400 hover:bg-white/10 hover:text-white"
      }`}
    >
      {icon}
      {label}
    </button>
  );
}

function MetricCard({ title, value, detail, icon, danger }) {
  return (
    <div className="rounded-xl border border-white/10 bg-zinc-900/80 p-6">
      <div className="mb-5 flex items-center justify-between">
        <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-black text-[#ba203f]">
          {icon}
        </div>

        {danger ? (
          <span className="rounded bg-red-500/15 px-2 py-1 text-xs font-semibold text-red-300">
            Crítico
          </span>
        ) : (
          <span className="rounded bg-green-500/15 px-2 py-1 text-xs font-semibold text-green-300">
            Activo
          </span>
        )}
      </div>

      <p className="text-xs font-semibold uppercase tracking-widest text-zinc-500">
        {title}
      </p>
      <p className="mt-2 text-2xl font-bold">{value}</p>
      <p className="mt-1 text-xs text-zinc-500">{detail}</p>
    </div>
  );
}

function DashboardView({
  stats,
  products,
  criticalProducts,
  outOfStockProducts,
  highStockProducts,
  orders,
  topSellingProducts,
  inventoryFilter,
  setInventoryFilter,
}) {
  const inventorySummary =
    inventoryFilter === "out"
      ? outOfStockProducts
      : inventoryFilter === "high"
      ? highStockProducts
      : criticalProducts;

  return (
    <div className="space-y-7">
      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
        <MetricCard
          title="Ingresos registrados"
          value={money(stats.totalRevenue)}
          detail={`${stats.orders} pedidos cargados`}
          icon={<DollarSign size={20} />}
        />

        <MetricCard
          title="Productos activos"
          value={stats.activeProducts}
          detail={`${stats.products} productos totales`}
          icon={<Package size={20} />}
        />

        <MetricCard
          title="Categorías"
          value={stats.categories}
          detail="Organización del catálogo"
          icon={<Boxes size={20} />}
        />

        <MetricCard
          title="Alertas de inventario"
          value={`${stats.criticalInventory} productos`}
          detail={`${stats.outOfStock} sin stock`}
          icon={<AlertTriangle size={20} />}
          danger
        />
      </div>

      <div className="rounded-xl border border-white/10 bg-zinc-900/80 p-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <h2 className="text-2xl font-bold">Rendimiento general</h2>
            <p className="mt-1 text-sm text-zinc-500">
              Vista visual para presentar el movimiento del sistema.
            </p>
          </div>

          <div className="flex gap-2">
            <button className="rounded-md border border-white/10 px-4 py-2 text-xs font-semibold text-zinc-300 hover:bg-white/10">
              Últimos pedidos
            </button>
            <button className="rounded-md bg-black px-4 py-2 text-xs font-semibold text-white">
              Resumen
            </button>
          </div>
        </div>

        <RevenueChart />
      </div>

      <div className="grid gap-7 xl:grid-cols-[0.9fr_1.4fr]">
        <div className="rounded-xl border border-white/10 bg-zinc-900/80">
          <div className="flex items-center justify-between border-b border-white/10 px-6 py-5">
            <div>
              <h2 className="text-xl font-bold">Actividad reciente</h2>
              <p className="mt-1 text-sm text-zinc-500">
                Últimos pedidos registrados.
              </p>
            </div>
          </div>

          <div className="divide-y divide-white/10">
            {orders.slice(0, 5).map((order) => (
              <div key={order.id} className="flex items-center gap-4 px-6 py-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-500/15 text-green-300">
                  <ShoppingCart size={17} />
                </div>

                <div className="flex-1">
                  <p className="text-sm font-semibold">Pedido #{order.id}</p>
                  <p className="text-xs text-zinc-500">
                    {order.fecha || "Sin fecha"}
                  </p>
                </div>

                <p className="text-sm font-bold">{money(order.total)}</p>
              </div>
            ))}

            {orders.length === 0 && (
              <p className="px-6 py-8 text-sm text-zinc-500">
                Todavía no hay pedidos registrados.
              </p>
            )}
          </div>
        </div>

        <div className="rounded-xl border border-white/10 bg-zinc-900/80">
          <div className="flex flex-col gap-4 border-b border-white/10 px-6 py-5 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h2 className="text-xl font-bold">Resumen de inventario</h2>
              <p className="mt-1 text-sm text-zinc-500">
                Productos importantes para supervisar.
              </p>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => setInventoryFilter("top")}
                className={`rounded-md px-3 py-2 text-xs font-semibold ${
                  inventoryFilter === "top"
                    ? "bg-[#ba203f] text-white"
                    : "bg-black text-zinc-400"
                }`}
              >
                Críticos
              </button>

              <button
                onClick={() => setInventoryFilter("out")}
                className={`rounded-md px-3 py-2 text-xs font-semibold ${
                  inventoryFilter === "out"
                    ? "bg-[#ba203f] text-white"
                    : "bg-black text-zinc-400"
                }`}
              >
                Sin stock
              </button>

              <button
                onClick={() => setInventoryFilter("high")}
                className={`rounded-md px-3 py-2 text-xs font-semibold ${
                  inventoryFilter === "high"
                    ? "bg-[#ba203f] text-white"
                    : "bg-black text-zinc-400"
                }`}
              >
                Mucho stock
              </button>
            </div>
          </div>

          <InventoryMiniTable products={inventorySummary.slice(0, 6)} />
        </div>
      </div>

      <div className="rounded-xl border border-white/10 bg-zinc-900/80 p-6">
        <h2 className="flex items-center gap-2 text-xl font-bold">
          <TrendingUp size={20} className="text-[#ba203f]" />
          Top 5 productos más vendidos
        </h2>
        <p className="mt-1 text-sm text-zinc-500">
          Si no hay detalle de ventas en el backend, se muestra una vista sugerida
          para presentación.
        </p>

        <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-5">
          {topSellingProducts.map((product, index) => (
            <div
              key={product.id}
              className="rounded-xl border border-white/10 bg-black/40 p-4"
            >
              <div className="mb-4 flex h-9 w-9 items-center justify-center rounded-full bg-[#ba203f] text-sm font-bold">
                {index + 1}
              </div>
              <p className="font-semibold">{product.nombre}</p>
              <p className="mt-2 text-xs text-zinc-500">
                {product.fallback
                  ? "Pendiente de ventas reales"
                  : `${product.cantidad} unidades vendidas`}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function RevenueChart() {
  const points = [
    "0,230",
    "60,210",
    "120,220",
    "180,185",
    "240,195",
    "300,150",
    "360,165",
    "420,105",
    "480,125",
    "540,80",
    "600,95",
    "660,55",
    "720,70",
    "780,40",
    "840,50",
  ].join(" ");

  return (
    <div className="mt-8 h-80 rounded-xl bg-black/25 p-4">
      <svg viewBox="0 0 860 280" className="h-full w-full">
        <defs>
          <linearGradient id="adminGradient" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor="#ba203f" stopOpacity="0.55" />
            <stop offset="100%" stopColor="#ba203f" stopOpacity="0.05" />
          </linearGradient>
        </defs>

        {[40, 100, 160, 220].map((y) => (
          <line
            key={y}
            x1="0"
            x2="860"
            y1={y}
            y2={y}
            stroke="rgba(255,255,255,0.08)"
          />
        ))}

        <polygon
          points={`0,260 ${points} 840,260`}
          fill="url(#adminGradient)"
        />

        <polyline
          points={points}
          fill="none"
          stroke="#e00014"
          strokeWidth="5"
          strokeLinejoin="round"
          strokeLinecap="round"
        />

        <text x="0" y="275" fill="#71717a" fontSize="12">
          Semana 1
        </text>
        <text x="370" y="275" fill="#71717a" fontSize="12">
          Semana 2
        </text>
        <text x="740" y="275" fill="#71717a" fontSize="12">
          Semana 4
        </text>
      </svg>
    </div>
  );
}

function InventoryMiniTable({ products }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[620px] text-left text-sm">
        <thead className="bg-black/40 text-xs uppercase tracking-widest text-zinc-500">
          <tr>
            <th className="px-6 py-4">Producto</th>
            <th className="px-6 py-4">Stock</th>
            <th className="px-6 py-4">Precio</th>
            <th className="px-6 py-4">Estado</th>
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
                    className="h-10 w-10 rounded-md object-cover"
                  />
                  <div>
                    <p className="font-semibold">{product.nombre}</p>
                    <p className="text-xs text-zinc-500">
                      {product.categoriaNombre}
                    </p>
                  </div>
                </div>
              </td>

              <td className="px-6 py-4">{product.stock}</td>
              <td className="px-6 py-4">{money(product.precio)}</td>
              <td className="px-6 py-4">
                <StockBadge stock={product.stock} />
              </td>
            </tr>
          ))}

          {products.length === 0 && (
            <tr>
              <td colSpan="4" className="px-6 py-8 text-center text-zinc-500">
                No hay productos para mostrar.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

function InventoryView({ products, onEdit, onDelete }) {
  return (
    <div className="rounded-xl border border-white/10 bg-zinc-900/80">
      <div className="border-b border-white/10 px-6 py-5">
        <h2 className="text-2xl font-bold">Inventario general</h2>
        <p className="mt-1 text-sm text-zinc-500">
          El administrador puede revisar y editar cualquier producto del sistema.
        </p>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[950px] text-left text-sm">
          <thead className="bg-black/40 text-xs uppercase tracking-widest text-zinc-500">
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
                      <p className="font-semibold">{product.nombre}</p>
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

                <td className="px-6 py-4 font-semibold">
                  {money(product.precio)}
                </td>

                <td className="px-6 py-4">
                  {Number(product.descuento || 0) > 0 ? (
                    <div>
                      <p className="font-semibold text-[#ba203f]">
                        {getDiscountPercent(product)}%
                      </p>
                      <p className="text-xs text-zinc-500">
                        {money(product.descuento)}
                      </p>
                    </div>
                  ) : (
                    <span className="text-zinc-500">Sin descuento</span>
                  )}
                </td>

                <td className="px-6 py-4">
                  <StockBadge stock={product.stock} />
                </td>

                <td className="px-6 py-4">
                  <div className="flex justify-end gap-2">
                    <button
                      onClick={() => onEdit(product)}
                      className="rounded-md border border-white/10 p-2 text-zinc-300 hover:bg-white/10"
                    >
                      <Pencil size={16} />
                    </button>

                    <button
                      onClick={() => onDelete(product.id)}
                      className="rounded-md border border-red-500/30 p-2 text-red-300 hover:bg-red-500/10"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}

            {products.length === 0 && (
              <tr>
                <td colSpan="7" className="px-6 py-10 text-center text-zinc-500">
                  No hay productos para mostrar.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function StockBadge({ stock }) {
  const value = Number(stock || 0);

  if (value === 0) {
    return (
      <span className="rounded bg-red-500/15 px-2 py-1 text-xs font-semibold text-red-300">
        Sin stock
      </span>
    );
  }

  if (value <= 3) {
    return (
      <span className="rounded bg-yellow-500/15 px-2 py-1 text-xs font-semibold text-yellow-300">
        Bajo stock
      </span>
    );
  }

  if (value > 20) {
    return (
      <span className="rounded bg-blue-500/15 px-2 py-1 text-xs font-semibold text-blue-300">
        Mucho stock
      </span>
    );
  }

  return (
    <span className="rounded bg-green-500/15 px-2 py-1 text-xs font-semibold text-green-300">
      En venta
    </span>
  );
}

function OrdersView({ orders, onDelete }) {
  return (
    <div className="rounded-xl border border-white/10 bg-zinc-900/80">
      <div className="border-b border-white/10 px-6 py-5">
        <h2 className="text-2xl font-bold">Pedidos</h2>
        <p className="mt-1 text-sm text-zinc-500">
          Vista administrativa de los pedidos registrados.
        </p>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[760px] text-left text-sm">
          <thead className="bg-black/40 text-xs uppercase tracking-widest text-zinc-500">
            <tr>
              <th className="px-6 py-4">Pedido</th>
              <th className="px-6 py-4">Cliente</th>
              <th className="px-6 py-4">Fecha</th>
              <th className="px-6 py-4">Total</th>
              <th className="px-6 py-4 text-right">Acciones</th>
            </tr>
          </thead>

          <tbody>
            {orders.map((order) => (
              <tr key={order.id} className="border-t border-white/10">
                <td className="px-6 py-4 font-semibold">#{order.id}</td>
                <td className="px-6 py-4 text-zinc-300">
                  {order.usuario?.nombre
                    ? `${order.usuario.nombre} ${order.usuario.apellido || ""}`
                    : order.usuario?.mail || "Sin datos"}
                </td>
                <td className="px-6 py-4 text-zinc-300">{order.fecha || "-"}</td>
                <td className="px-6 py-4 font-semibold">{money(order.total)}</td>
                <td className="px-6 py-4">
                  <div className="flex justify-end">
                    <button
                      onClick={() => onDelete(order.id)}
                      className="rounded-md border border-red-500/30 p-2 text-red-300 hover:bg-red-500/10"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}

            {orders.length === 0 && (
              <tr>
                <td colSpan="5" className="px-6 py-10 text-center text-zinc-500">
                  No hay pedidos cargados.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function CategoriesView({
  categories,
  newCategoryName,
  setNewCategoryName,
  createCategory,
  editCategory,
  deleteCategory,
}) {
  return (
    <div className="grid gap-7 xl:grid-cols-[0.7fr_1.3fr]">
      <form
        onSubmit={createCategory}
        className="rounded-xl border border-white/10 bg-zinc-900/80 p-6"
      >
        <h2 className="text-2xl font-bold">Nueva categoría</h2>
        <p className="mt-1 text-sm text-zinc-500">
          El admin puede crear categorías para organizar el catálogo.
        </p>

        <input
          value={newCategoryName}
          onChange={(e) => setNewCategoryName(e.target.value)}
          placeholder="Ej: Guitarras"
          className="mt-6 w-full rounded-lg border border-white/10 bg-black px-4 py-3 text-sm text-white outline-none focus:border-[#ba203f]"
        />

        <button className="mt-4 flex w-full items-center justify-center gap-2 rounded-lg bg-[#ba203f] px-4 py-3 text-sm font-semibold text-white hover:bg-red-700">
          <Tags size={16} />
          Crear categoría
        </button>
      </form>

      <div className="rounded-xl border border-white/10 bg-zinc-900/80">
        <div className="border-b border-white/10 px-6 py-5">
          <h2 className="text-2xl font-bold">Categorías actuales</h2>
        </div>

        <div className="divide-y divide-white/10">
          {categories.map((category) => (
            <div
              key={category.id}
              className="flex items-center justify-between px-6 py-4"
            >
              <div>
                <p className="font-semibold">{category.nombre}</p>
                <p className="text-xs text-zinc-500">ID #{category.id}</p>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => editCategory(category)}
                  className="rounded-md border border-white/10 p-2 text-zinc-300 hover:bg-white/10"
                >
                  <Pencil size={16} />
                </button>

                <button
                  onClick={() => deleteCategory(category.id)}
                  className="rounded-md border border-red-500/30 p-2 text-red-300 hover:bg-red-500/10"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))}

          {categories.length === 0 && (
            <p className="px-6 py-8 text-center text-sm text-zinc-500">
              No hay categorías cargadas.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

function UsersView({ orders, usersCount }) {
  return (
    <div className="rounded-xl border border-white/10 bg-zinc-900/80 p-6">
      <h2 className="text-2xl font-bold">Usuarios</h2>
      <p className="mt-1 text-sm text-zinc-500">
        Vista resumida basada en los clientes que aparecen en pedidos.
      </p>

      <div className="mt-6 grid gap-5 md:grid-cols-3">
        <MetricCard
          title="Clientes detectados"
          value={usersCount}
          detail="Calculado desde pedidos"
          icon={<Users size={20} />}
        />

        <MetricCard
          title="Pedidos registrados"
          value={orders.length}
          detail="Historial disponible"
          icon={<ShoppingCart size={20} />}
        />

        <MetricCard
          title="Estado"
          value="Activo"
          detail="Módulo preparado para ampliación"
          icon={<ChevronRight size={20} />}
        />
      </div>
    </div>
  );
}

function SettingsView() {
  return (
    <div className="rounded-xl border border-white/10 bg-zinc-900/80 p-6">
      <h2 className="text-2xl font-bold">Sistema</h2>
      <p className="mt-1 text-sm text-zinc-500">
        Configuración general y resumen de permisos.
      </p>

      <div className="mt-6 grid gap-4 md:grid-cols-2">
        <div className="rounded-xl border border-white/10 bg-black/40 p-5">
          <h3 className="font-bold">Rol administrador</h3>
          <p className="mt-2 text-sm text-zinc-400">
            Puede gestionar productos, categorías y pedidos del sistema.
          </p>
        </div>

        <div className="rounded-xl border border-white/10 bg-black/40 p-5">
          <h3 className="font-bold">Rol vendedor</h3>
          <p className="mt-2 text-sm text-zinc-400">
            Accede a Gestión de inventario para administrar sus productos.
          </p>
        </div>
      </div>
    </div>
  );
}

function ProductModal({
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
            <h2 className="text-2xl font-bold">Editar producto</h2>
            <p className="mt-1 text-sm text-zinc-500">
              Modificá la información del producto seleccionado.
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
              rows="4"
              value={productForm.descripcion}
              onChange={(e) =>
                setProductForm({
                  ...productForm,
                  descripcion: e.target.value,
                })
              }
              className="rounded-md border border-white/10 bg-black px-4 py-3 outline-none focus:border-[#ba203f]"
            />
          </label>

          <div className="grid gap-4 md:grid-cols-2">
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

          <div className="grid gap-4 md:grid-cols-2">
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