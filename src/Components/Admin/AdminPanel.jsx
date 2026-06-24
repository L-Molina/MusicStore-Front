import {
  BarChart3,
  DollarSign,
  Layers,
  Package,
  Pencil,
  Save,
  Settings,
  ShoppingCart,
  Tags,
  Trash2,
  TrendingUp,
  UserRound,
  Users,
  X
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

function normalizeRole(value) {
  if (!value) return "";

  if (Array.isArray(value)) {
    return value
      .map((item) => normalizeRole(item))
      .join(" ")
      .toUpperCase();
  }

  if (typeof value === "object") {
    return String(
      value.nombre ||
        value.name ||
        value.authority ||
        value.rol ||
        value.role ||
        ""
    ).toUpperCase();
  }

  return String(value).toUpperCase();
}

function normalizeUser(rawUser, source = "backend") {
  const role = normalizeRole(
    rawUser.rol ||
      rawUser.role ||
      rawUser.roles ||
      rawUser.authorities ||
      rawUser.tipoUsuario
  );
  return {
    ...rawUser,
    id: rawUser.id || rawUser.usuarioId || rawUser.userId || rawUser.mail,
    nombre: rawUser.nombre || rawUser.name || "Sin nombre",
    apellido: rawUser.apellido || rawUser.lastName || "",
    mail: rawUser.mail || rawUser.email || rawUser.usuarioMail || "",
    telefono: rawUser.telefono || rawUser.phone || "",
    direccion: rawUser.direccion || rawUser.address || "",
    rol: role || "SIN_ROL",
    source,
  };
}

function normalizeOrder(order, source = "backend") {
  const id =
    order.id ||
    order.orderId ||
    order.numero ||
    `LOCAL-${order.fecha || order.date || Date.now()}`;

  return {
    ...order,
    id,
    source,
    fecha: order.fecha || order.date || order.createdAt || order.fechaCompra || "",
    total: Number(order.total || order.totalFinal || order.precioTotal || 0),
    estado: order.estado || order.status || "Procesando",
    usuarioId: order.usuario?.id || order.usuarioId || order.userId || null,
    usuarioMail:
      order.usuario?.mail ||
      order.usuario?.email ||
      order.usuarioMail ||
      order.email ||
      order.mail ||
      "",
    usuarioNombre:
      order.usuario?.nombre ||
      order.usuarioNombre ||
      order.nombreUsuario ||
      "",
    items:
      order.items ||
      order.productos ||
      order.detalles ||
      order.detallePedidos ||
      order.detalleProductos ||
      order.cart ||
      order.lineas ||
      [],
  };
}

function formatOrderClient(order) {
  if (order.usuarioNombre && order.usuarioMail) {
    return `${order.usuarioNombre} (${order.usuarioMail})`;
  }

  if (order.usuarioNombre) return order.usuarioNombre;
  if (order.usuarioMail) return order.usuarioMail;

  if (order.usuario?.nombre) {
    return `${order.usuario.nombre} ${order.usuario.apellido || ""}`;
  }

  if (order.usuario?.mail) return order.usuario.mail;
  if (order.usuario?.email) return order.usuario.email;

  return "Cliente sin datos";
}

function OrderStatusBadge({ status }) {
  const normalized = String(status || "").toLowerCase();

  if (
    normalized.includes("entregado") ||
    normalized.includes("completado") ||
    normalized.includes("finalizado")
  ) {
    return (
      <span className="rounded bg-green-500/15 px-2 py-1 text-xs font-semibold text-green-300">
        Finalizado
      </span>
    );
  }

  if (normalized.includes("cancelado") || normalized.includes("rechazado")) {
    return (
      <span className="rounded bg-red-500/15 px-2 py-1 text-xs font-semibold text-red-300">
        Cancelado
      </span>
    );
  }

  if (normalized.includes("camino") || normalized.includes("enviado")) {
    return (
      <span className="rounded bg-blue-500/15 px-2 py-1 text-xs font-semibold text-blue-300">
        En camino
      </span>
    );
  }

  return (
    <span className="rounded bg-yellow-500/15 px-2 py-1 text-xs font-semibold text-yellow-300">
      Procesando
    </span>
  );
}

export default function AdminPanel() {
  const { token, user } = useAuth();

  const [activeTab, setActiveTab] = useState("dashboard");
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [orders, setOrders] = useState([]);
  const [users, setUsers] = useState([]);

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

    let localOrders = [];

    keys.forEach((key) => {
      try {
        const raw = localStorage.getItem(key);
        if (!raw) return;

        const parsed = JSON.parse(raw);

        if (Array.isArray(parsed)) {
          localOrders = [
            ...localOrders,
            ...parsed.map((order) => normalizeOrder(order, "local")),
          ];
        }
      } catch {
        // Ignoramos datos inválidos
      }
    });

    return localOrders;
  }

  function mergeOrders(backendOrders, localOrders) {
    const map = new Map();

    [...backendOrders, ...localOrders].forEach((order) => {
      const key =
        order.id ||
        `${order.usuarioMail || "sin-mail"}-${order.fecha || ""}-${order.total}`;

      if (!map.has(key)) {
        map.set(key, order);
      }
    });

    return Array.from(map.values()).sort((a, b) => {
      const dateA = new Date(a.fecha || 0).getTime();
      const dateB = new Date(b.fecha || 0).getTime();
      return dateB - dateA;
    });
  }

  async function loadOrders() {
    try {
      let backendOrders = [];

      const res = await fetch(`${API_URL}/pedidos`, {
        headers: authHeaders,
      });

      if (res.ok) {
        const data = await res.json();

        if (Array.isArray(data)) {
          backendOrders = data.map((order) => normalizeOrder(order, "backend"));
        }
      }

      const localOrders = loadLocalOrders();
      const merged = mergeOrders(backendOrders, localOrders);

      setOrders(merged);
      return merged;
    } catch (error) {
      console.error("Error cargando pedidos:", error);

      const localOrders = loadLocalOrders();
      setOrders(localOrders);
      return localOrders;
    }
  }

  async function loadUsers(productsFromLoad = [], ordersFromLoad = []) {
    try {
      const possibleEndpoints = [`${API_URL}/usuarios`, `${API_URL}/users`];

      for (const endpoint of possibleEndpoints) {
        const res = await fetch(endpoint, {
          headers: authHeaders,
        });

        if (res.ok) {
          const data = await res.json();

          if (Array.isArray(data)) {
            const normalized = data.map((u) => normalizeUser(u, "backend"));
            setUsers(normalized);
            return normalized;
          }
        }
      }

      throw new Error("No hay endpoint de usuarios disponible");
    } catch {
      const derivedUsers = deriveUsersFromOrdersAndProducts(
        ordersFromLoad,
        productsFromLoad
      );
      setUsers(derivedUsers);
      return derivedUsers;
    }
  }

  function deriveUsersFromOrdersAndProducts(ordersList, productsList) {
    const map = new Map();

    ordersList.forEach((order) => {
      const key =
        order.usuarioId ||
        order.usuarioMail ||
        order.usuarioNombre ||
        `comprador-${order.id}`;

      if (!map.has(key)) {
        map.set(key, {
          id: key,
          nombre: order.usuarioNombre || "Comprador",
          apellido: "",
          mail: order.usuarioMail || "",
          telefono: "",
          direccion: "",
          rol: "COMPRADOR",
          source: "derived",
        });
      }
    });

    productsList.forEach((product) => {
      const seller =
        product.vendedor ||
        product.usuario ||
        product.seller ||
        product.user ||
        product.empleado;

      const sellerId =
        seller?.id ||
        product.vendedorId ||
        product.usuarioId ||
        product.sellerId;

      if (!seller && !sellerId) return;

      const key = sellerId || seller?.mail || seller?.email;

      if (!map.has(key)) {
        map.set(key, {
          id: key,
          nombre: seller?.nombre || seller?.name || "Vendedor",
          apellido: seller?.apellido || "",
          mail: seller?.mail || seller?.email || "",
          telefono: seller?.telefono || "",
          direccion: seller?.direccion || "",
          rol: "VENDEDOR",
          source: "derived",
        });
      }
    });

    return Array.from(map.values());
  }

  async function loadAll() {
    try {
      setLoading(true);

      const [productsLoaded, ordersLoaded] = await Promise.all([
        loadProducts(),
        loadOrders(),
        loadCategories(),
      ]).then(([p, o]) => [p, o]);

      await loadUsers(productsLoaded || [], ordersLoaded || []);
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
      const details = order.items || [];

      details.forEach((item) => {
        const product = item.producto || item.product || item;

        const productId =
          product.id || item.productoId || item.productId || item.id;

        if (!productId) return;

        const productName =
          product.nombre ||
          product.name ||
          item.nombre ||
          item.name ||
          `Producto #${productId}`;

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

    return Object.values(salesMap)
      .sort((a, b) => b.cantidad - a.cantidad)
      .slice(0, 5);
  }, [orders]);

  const buyers = useMemo(() => {
    const map = new Map();

    users
      .filter((u) => normalizeRole(u.rol).includes("COMPRADOR"))
      .forEach((u) => {
        map.set(u.id || u.mail, {
          ...u,
          pedidos: 0,
          totalGastado: 0,
        });
      });

    orders.forEach((order) => {
      const key =
        order.usuarioId ||
        order.usuarioMail ||
        order.usuarioNombre ||
        `comprador-${order.id}`;

      if (!map.has(key)) {
        map.set(key, {
          id: key,
          nombre: order.usuarioNombre || "Comprador",
          apellido: "",
          mail: order.usuarioMail || "",
          telefono: "",
          direccion: "",
          rol: "COMPRADOR",
          source: "derived",
          pedidos: 0,
          totalGastado: 0,
        });
      }

      const buyer = map.get(key);
      buyer.pedidos += 1;
      buyer.totalGastado += Number(order.total || 0);
    });

    return Array.from(map.values());
  }, [users, orders]);

  const sellers = useMemo(() => {
    const map = new Map();
  
    users.forEach((u) => {
      const role = normalizeRole(u.rol || u.role || u.roles || u.authorities);
  
      if (!role.includes("VENDEDOR")) return;
  
      const key = u.id || u.mail || `${u.nombre}-${u.apellido}`;
  
      if (!map.has(key)) {
        map.set(key, {
          ...u,
          productos: 0,
        });
      }
    });
  
    products.forEach((product) => {
      const seller =
        product.vendedor ||
        product.usuario ||
        product.seller ||
        product.user ||
        product.empleado;
  
      const sellerId =
        seller?.id ||
        product.vendedorId ||
        product.usuarioId ||
        product.sellerId;
  
      if (!seller && !sellerId) return;
  
      const key = sellerId || seller?.mail || seller?.email;
  
      if (!map.has(key)) {
        map.set(key, {
          id: key,
          nombre: seller?.nombre || seller?.name || "Vendedor",
          apellido: seller?.apellido || "",
          mail: seller?.mail || seller?.email || "",
          telefono: seller?.telefono || "",
          direccion: seller?.direccion || "",
          rol: "VENDEDOR",
          source: "derived",
          productos: 0,
        });
      }
  
      const current = map.get(key);
      current.productos += 1;
    });
  
    return Array.from(map.values());
  }, [users, products]);

  const uniqueClients = buyers.length;

  const stats = {
    totalRevenue: orders.reduce(
      (acc, order) => acc + Number(order.total || 0),
      0
    ),
    products: products.length,
    activeProducts: products.filter((p) => Number(p.stock || 0) > 0).length,
    criticalInventory: criticalProducts.length,
    outOfStock: outOfStockProducts.length,
    categories: categories.length,
    orders: orders.length,
    users: uniqueClients,
    sellers: sellers.length,
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
    const confirmDelete = window.confirm(
      "¿Seguro que querés eliminar este pedido?"
    );

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
                <p className="text-sm font-semibold">{user?.nombre || "Admin"}</p>
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
                  Datos reales del sistema: inventario, pedidos, usuarios y
                  categorías.
                </p>
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
                products={products}
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
              <UsersView
                buyers={buyers}
                sellers={sellers}
              />
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
            Real
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

  const recentOrders = orders.slice(0, 5);

  return (
    <div className="space-y-7">
      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
        <MetricCard
          title="Ingresos registrados"
          value={money(stats.totalRevenue)}
          detail={
            stats.orders > 0
              ? `${stats.orders} pedidos cargados`
              : "Sin pedidos registrados"
          }
          icon={<DollarSign size={20} />}
        />

        <MetricCard
          title="Productos activos"
          value={stats.activeProducts}
          detail={`${stats.products} productos totales`}
          icon={<Package size={20} />}
        />

        <MetricCard
          title="Compradores"
          value={stats.users}
          detail={
            stats.users > 0
              ? "Detectados desde usuarios o pedidos"
              : "Sin compradores detectados"
          }
          icon={<Users size={20} />}
        />

        <MetricCard
          title="Vendedores"
          value={stats.sellers}
          detail={
            stats.sellers > 0
              ? "Detectados desde usuarios o productos"
              : "Sin vendedores detectados"
          }
          icon={<UserRound size={20} />}
        />
      </div>

      <div className="grid gap-7 xl:grid-cols-[0.9fr_1.4fr]">
        <div className="rounded-xl border border-white/10 bg-zinc-900/80">
          <div className="border-b border-white/10 px-6 py-5">
            <h2 className="text-xl font-bold">Actividad reciente</h2>
            <p className="mt-1 text-sm text-zinc-500">
              Últimos pedidos registrados.
            </p>
          </div>

          <div className="divide-y divide-white/10">
            {recentOrders.map((order) => (
              <div key={order.id} className="flex items-center gap-4 px-6 py-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-500/15 text-green-300">
                  <ShoppingCart size={17} />
                </div>

                <div className="flex-1">
                  <p className="text-sm font-semibold">Pedido #{order.id}</p>
                  <p className="text-xs text-zinc-500">
                    {formatOrderClient(order)} · {formatDate(order.fecha)}
                  </p>
                </div>

                <div className="text-right">
                  <p className="text-sm font-bold">{money(order.total)}</p>
                  <p className="text-xs text-zinc-500">{order.estado}</p>
                </div>
              </div>
            ))}

            {recentOrders.length === 0 && (
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
                Productos que necesitan seguimiento.
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
          Productos más vendidos
        </h2>

        <p className="mt-1 text-sm text-zinc-500">
          Calculado únicamente desde pedidos con detalle de productos.
        </p>

        {topSellingProducts.length > 0 ? (
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
                  {product.cantidad} unidades vendidas
                </p>
              </div>
            ))}
          </div>
        ) : (
          <div className="mt-5 rounded-lg border border-white/10 bg-black/30 px-5 py-8 text-sm text-zinc-500">
            Todavía no hay ventas con detalle suficiente para calcular productos
            más vendidos.
          </div>
        )}
      </div>
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
          Pedidos registrados desde el backend y compras guardadas localmente.
        </p>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[880px] text-left text-sm">
          <thead className="bg-black/40 text-xs uppercase tracking-widest text-zinc-500">
            <tr>
              <th className="px-6 py-4">Pedido</th>
              <th className="px-6 py-4">Cliente</th>
              <th className="px-6 py-4">Fecha</th>
              <th className="px-6 py-4">Estado</th>
              <th className="px-6 py-4">Total</th>
              <th className="px-6 py-4">Origen</th>
              <th className="px-6 py-4 text-right">Acciones</th>
            </tr>
          </thead>

          <tbody>
            {orders.map((order) => (
              <tr key={order.id} className="border-t border-white/10">
                <td className="px-6 py-4 font-semibold">#{order.id}</td>

                <td className="px-6 py-4 text-zinc-300">
                  {formatOrderClient(order)}
                </td>

                <td className="px-6 py-4 text-zinc-300">
                  {formatDate(order.fecha)}
                </td>

                <td className="px-6 py-4">
                  <OrderStatusBadge status={order.estado} />
                </td>

                <td className="px-6 py-4 font-semibold">
                  {money(order.total)}
                </td>

                <td className="px-6 py-4 text-zinc-400">
                  {order.source === "local" ? "Checkout local" : "Backend"}
                </td>

                <td className="px-6 py-4">
                  <div className="flex justify-end">
                    {order.source === "backend" ? (
                      <button
                        onClick={() => onDelete(order.id)}
                        className="rounded-md border border-red-500/30 p-2 text-red-300 hover:bg-red-500/10"
                      >
                        <Trash2 size={16} />
                      </button>
                    ) : (
                      <span className="text-xs text-zinc-500">Sin acción</span>
                    )}
                  </div>
                </td>
              </tr>
            ))}

            {orders.length === 0 && (
              <tr>
                <td colSpan="7" className="px-6 py-10 text-center text-zinc-500">
                  No hay pedidos registrados.
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

function UsersView({ buyers, sellers }) {
  return (
    <div className="space-y-7">
      <div>
        <h2 className="text-2xl font-bold">Usuarios</h2>
        <p className="mt-1 text-sm text-zinc-500">
          Separación de compradores y vendedores detectados en el sistema.
        </p>
      </div>

      <div className="grid gap-7 xl:grid-cols-2">
        <UserColumn
          title="Compradores"
          subtitle="Usuarios con rol comprador o detectados desde pedidos."
          users={buyers}
          emptyText="No hay compradores para mostrar."
          type="buyer"
        />

        <UserColumn
          title="Vendedores"
          subtitle="Usuarios con rol vendedor o detectados desde productos."
          users={sellers}
          emptyText="No hay vendedores para mostrar."
          type="seller"
        />
      </div>
    </div>
  );
}

function UserColumn({ title, subtitle, users, emptyText, type }) {
  return (
    <div className="rounded-xl border border-white/10 bg-zinc-900/80">
      <div className="border-b border-white/10 px-6 py-5">
        <h3 className="text-xl font-bold">{title}</h3>
        <p className="mt-1 text-sm text-zinc-500">{subtitle}</p>
      </div>

      <div className="divide-y divide-white/10">
        {users.map((user) => (
          <div key={user.id || user.mail} className="px-6 py-5">
            <div>
              <p className="text-lg font-semibold">
                {user.nombre} {user.apellido}
              </p>

              <p className="mt-1 text-sm text-zinc-500">
                {user.mail || "Sin email registrado"}
              </p>

              <div className="mt-3 flex flex-wrap gap-2">
                <span className="rounded bg-[#ba203f]/15 px-2 py-1 text-xs font-semibold text-[#f0b3b3]">
                  {normalizeRole(user.rol) || "SIN_ROL"}
                </span>

                {user.source === "backend" ? (
                  <span className="rounded bg-green-500/15 px-2 py-1 text-xs font-semibold text-green-300">
                    Registrado
                  </span>
                ) : (
                  <span className="rounded bg-yellow-500/15 px-2 py-1 text-xs font-semibold text-yellow-300">
                    Detectado
                  </span>
                )}
              </div>

              {type === "buyer" && (
                <p className="mt-3 text-sm text-zinc-400">
                  Pedidos: {user.pedidos || 0} · Total comprado:{" "}
                  {money(user.totalGastado || 0)}
                </p>
              )}

              {type === "seller" && (
                <p className="mt-3 text-sm text-zinc-400">
                  Productos publicados: {user.productos || 0}
                </p>
              )}
            </div>
          </div>
        ))}

        {users.length === 0 && (
          <p className="px-6 py-10 text-center text-sm text-zinc-500">
            {emptyText}
          </p>
        )}
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
            Puede gestionar productos, categorías, pedidos y usuarios si el
            backend lo permite.
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