import {
    Clock,
    LogOut,
    MapPin,
    Package,
    Save,
    ShoppingBag,
    User,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useAuth } from "../../context/AuthContext";

const API_URL = "http://localhost:8080";

function money(value) {
  const number = Number(value || 0);
  return `$${number.toLocaleString("es-AR", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

function normalizeUserId(user) {
  return user?.id || user?.usuarioId || user?.userId || user?.idUsuario;
}

function normalizeOrderDate(date) {
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

export default function Perfil() {
  const { user, token, logout } = useAuth();

  const [activeTab, setActiveTab] = useState("perfil");
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  const [profile, setProfile] = useState({
    nombre: "",
    apellido: "",
    mail: "",
    telefono: "",
    direccion: "",
  });

  const [orders, setOrders] = useState([]);

  const userId = normalizeUserId(user);

  useEffect(() => {
    loadProfile();
    loadLocalOrders();
  }, [userId]);

  async function loadProfile() {
    try {
      setLoading(true);

      const res = await fetch(`${API_URL}/usuarios/me`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.ok) {
        const data = await res.json();

        setProfile({
          nombre: data.nombre || user?.nombre || "",
          apellido: data.apellido || user?.apellido || "",
          mail: data.mail || data.email || user?.mail || user?.email || "",
          telefono: data.telefono || "",
          direccion: data.direccion || "",
        });

        return;
      }

      setProfile({
        nombre: user?.nombre || "",
        apellido: user?.apellido || "",
        mail: user?.mail || user?.email || "",
        telefono: "",
        direccion: "",
      });
    } catch (error) {
      console.error(error);

      setProfile({
        nombre: user?.nombre || "",
        apellido: user?.apellido || "",
        mail: user?.mail || user?.email || "",
        telefono: "",
        direccion: "",
      });
    } finally {
      setLoading(false);
    }
  }

  function loadLocalOrders() {
    const possibleKeys = [
      `orders_user_${userId}`,
      `orders_user_${user?.mail}`,
      `orders_user_${user?.email}`,
      "orders",
      "compras",
    ];

    let savedOrders = [];

    possibleKeys.forEach((key) => {
      if (!key) return;

      try {
        const raw = localStorage.getItem(key);
        if (!raw) return;

        const parsed = JSON.parse(raw);

        if (Array.isArray(parsed)) {
          savedOrders = [...savedOrders, ...parsed];
        }
      } catch {
        // Ignoramos claves que no sean JSON válido
      }
    });

    const uniqueOrders = savedOrders.filter((order, index, self) => {
      const id = order.id || order.orderId || order.fecha || index;
      return (
        index ===
        self.findIndex((other, otherIndex) => {
          const otherId = other.id || other.orderId || other.fecha || otherIndex;
          return otherId === id;
        })
      );
    });

    setOrders(uniqueOrders.reverse());
  }

  async function saveProfile(e) {
    e.preventDefault();

    try {
      const payload = {
        nombre: profile.nombre,
        apellido: profile.apellido,
        mail: profile.mail,
        telefono: profile.telefono,
        direccion: profile.direccion,
      };

      const res = await fetch(`${API_URL}/usuarios/me`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        throw new Error("No se pudieron guardar los cambios.");
      }

      setMessage("Datos actualizados correctamente.");
    } catch (error) {
      console.error(error);
      setMessage(
        "No se pudieron guardar los cambios en el backend. Podés seguir viendo el perfil localmente."
      );
    }
  }

  const activeOrders = useMemo(() => {
    return orders.filter((order) => {
      const estado = String(order.estado || order.status || "").toLowerCase();

      return (
        estado.includes("pendiente") ||
        estado.includes("procesando") ||
        estado.includes("en camino") ||
        estado.includes("activo") ||
        !estado
      );
    });
  }, [orders]);

  const completedOrders = useMemo(() => {
    return orders.filter((order) => {
      const estado = String(order.estado || order.status || "").toLowerCase();

      return (
        estado.includes("entregado") ||
        estado.includes("finalizado") ||
        estado.includes("completado")
      );
    });
  }, [orders]);

  if (loading) {
    return (
      <div className="min-h-screen bg-black px-8 py-12 text-white">
        Cargando perfil...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="grid min-h-screen lg:grid-cols-[260px_1fr]">
        <aside className="border-r border-white/10 bg-[#090909]">
          <div className="border-b border-white/10 px-6 py-7">
            <p className="text-xs uppercase tracking-widest text-[#ba203f]">
              Mi cuenta
            </p>

            <h1 className="mt-2 text-2xl font-bold">
              {profile.nombre || "Usuario"}
            </h1>

            <p className="mt-1 text-sm text-zinc-500">
              Gestioná tus datos y pedidos
            </p>
          </div>

          <nav className="space-y-1 px-4 py-5">
            <SidebarButton
              active={activeTab === "perfil"}
              onClick={() => setActiveTab("perfil")}
              icon={<User size={18} />}
              label="Mi perfil"
            />

            <SidebarButton
              active={activeTab === "pedidos"}
              onClick={() => setActiveTab("pedidos")}
              icon={<ShoppingBag size={18} />}
              label="Mis pedidos"
            />

            <SidebarButton
              active={activeTab === "direcciones"}
              onClick={() => setActiveTab("direcciones")}
              icon={<MapPin size={18} />}
              label="Direcciones"
            />

            <SidebarButton
              active={activeTab === "proximamente"}
              onClick={() => setActiveTab("proximamente")}
              icon={<Clock size={18} />}
              label="Próximamente"
            />
          </nav>

          <div className="mt-auto border-t border-white/10 px-4 py-5">
            <button
              onClick={logout}
              className="flex w-full items-center gap-3 rounded-lg px-4 py-3 text-sm font-semibold text-zinc-400 transition hover:bg-white/10 hover:text-white"
            >
              <LogOut size={18} />
              Cerrar sesión
            </button>
          </div>
        </aside>

        <main className="px-6 py-8 lg:px-10">
          {message && (
            <div className="mb-6 rounded-lg border border-[#ba203f]/40 bg-[#ba203f]/10 px-4 py-3 text-sm text-red-100">
              {message}
            </div>
          )}

          {activeTab === "perfil" && (
            <ProfileSection
              profile={profile}
              setProfile={setProfile}
              saveProfile={saveProfile}
            />
          )}

          {activeTab === "pedidos" && (
            <OrdersSection
              activeOrders={activeOrders}
              completedOrders={completedOrders}
              allOrders={orders}
            />
          )}

          {activeTab === "direcciones" && (
            <AddressSection
              profile={profile}
              setProfile={setProfile}
              saveProfile={saveProfile}
            />
          )}

          {activeTab === "proximamente" && <ComingSoonSection />}
        </main>
      </div>
    </div>
  );
}

function SidebarButton({ active, icon, label, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`flex w-full items-center gap-3 rounded-lg px-4 py-3 text-sm font-semibold transition ${
        active
          ? "border-l-4 border-[#ba203f] bg-[#ba203f]/15 text-white"
          : "text-zinc-400 hover:bg-white/10 hover:text-white"
      }`}
    >
      {icon}
      {label}
    </button>
  );
}

function SectionTitle({ title, subtitle }) {
  return (
    <div className="mb-5">
      <h2 className="text-3xl font-bold">{title}</h2>
      <div className="mt-2 h-1 w-20 rounded bg-[#ba203f]" />
      {subtitle && <p className="mt-3 text-sm text-zinc-500">{subtitle}</p>}
    </div>
  );
}

function ProfileSection({ profile, setProfile, saveProfile }) {
  return (
    <section>
      <SectionTitle
        title="Información personal"
        subtitle="Actualizá tus datos básicos de cuenta."
      />

      <form
        onSubmit={saveProfile}
        className="rounded-xl border border-white/10 bg-zinc-900/80 p-6"
      >
        <div className="grid gap-5 md:grid-cols-2">
          <label className="grid gap-2 text-sm">
            Nombre
            <input
              value={profile.nombre}
              onChange={(e) =>
                setProfile({ ...profile, nombre: e.target.value })
              }
              className="rounded-md border border-white/10 bg-black px-4 py-3 text-white outline-none focus:border-[#ba203f]"
            />
          </label>

          <label className="grid gap-2 text-sm">
            Apellido
            <input
              value={profile.apellido}
              onChange={(e) =>
                setProfile({ ...profile, apellido: e.target.value })
              }
              className="rounded-md border border-white/10 bg-black px-4 py-3 text-white outline-none focus:border-[#ba203f]"
            />
          </label>

          <label className="grid gap-2 text-sm">
            Correo electrónico
            <input
              value={profile.mail}
              onChange={(e) =>
                setProfile({ ...profile, mail: e.target.value })
              }
              className="rounded-md border border-white/10 bg-black px-4 py-3 text-white outline-none focus:border-[#ba203f]"
            />
          </label>

          <label className="grid gap-2 text-sm">
            Teléfono
            <input
              value={profile.telefono}
              onChange={(e) =>
                setProfile({ ...profile, telefono: e.target.value })
              }
              placeholder="+54 11 0000 0000"
              className="rounded-md border border-white/10 bg-black px-4 py-3 text-white outline-none focus:border-[#ba203f]"
            />
          </label>

          <label className="grid gap-2 text-sm md:col-span-2">
            Dirección de envío
            <input
              value={profile.direccion}
              onChange={(e) =>
                setProfile({ ...profile, direccion: e.target.value })
              }
              placeholder="Calle, número, ciudad"
              className="rounded-md border border-white/10 bg-black px-4 py-3 text-white outline-none focus:border-[#ba203f]"
            />
          </label>
        </div>

        <div className="mt-6 flex justify-end">
          <button className="flex items-center gap-2 rounded-md bg-[#ba203f] px-5 py-3 text-sm font-semibold text-white hover:bg-red-700">
            <Save size={16} />
            Guardar cambios
          </button>
        </div>
      </form>
    </section>
  );
}

function OrdersSection({ activeOrders, completedOrders, allOrders }) {
  return (
    <section className="space-y-8">
      <div>
        <SectionTitle
          title="Mis pedidos"
          subtitle="Revisá tus compras, estado del pedido e historial."
        />

        <div className="grid gap-4 md:grid-cols-3">
          <ProfileMetric
            title="Pedidos totales"
            value={allOrders.length}
            detail="Compras registradas"
          />

          <ProfileMetric
            title="Pedidos activos"
            value={activeOrders.length}
            detail="Pendientes o en proceso"
          />

          <ProfileMetric
            title="Finalizados"
            value={completedOrders.length}
            detail="Entregados o completados"
          />
        </div>
      </div>

      <OrderTable title="Pedidos activos" orders={activeOrders} />

      <OrderTable title="Historial de pedidos" orders={completedOrders} />
    </section>
  );
}

function ProfileMetric({ title, value, detail }) {
  return (
    <div className="rounded-xl border border-white/10 bg-zinc-900/80 p-5">
      <p className="text-xs uppercase tracking-widest text-zinc-500">{title}</p>
      <p className="mt-2 text-2xl font-bold text-white">{value}</p>
      <p className="mt-1 text-xs text-zinc-500">{detail}</p>
    </div>
  );
}

function OrderTable({ title, orders }) {
  return (
    <div>
      <SectionTitle title={title} />

      <div className="overflow-x-auto rounded-xl border border-white/10 bg-zinc-900/80">
        <table className="w-full min-w-[720px] text-left text-sm">
          <thead className="bg-white/5 text-xs uppercase tracking-widest text-zinc-500">
            <tr>
              <th className="px-6 py-4">Pedido</th>
              <th className="px-6 py-4">Fecha</th>
              <th className="px-6 py-4">Total</th>
              <th className="px-6 py-4">Estado</th>
              <th className="px-6 py-4">Detalle</th>
            </tr>
          </thead>

          <tbody>
            {orders.map((order, index) => (
              <OrderRow
                key={order.id || order.orderId || index}
                order={order}
                index={index}
              />
            ))}

            {orders.length === 0 && (
              <tr>
                <td colSpan="5" className="px-6 py-10 text-center text-zinc-500">
                  No hay pedidos para mostrar.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function OrderRow({ order, index }) {
  const [open, setOpen] = useState(false);

  const id =
    order.id || order.orderId || `MS-${String(index + 1).padStart(4, "0")}`;

  const date = order.fecha || order.date || order.createdAt;
  const total = order.total || order.totalFinal || order.precioTotal || 0;
  const status = order.estado || order.status || "Procesando";

  const items =
    order.items ||
    order.productos ||
    order.detalles ||
    order.detalleProductos ||
    order.cart ||
    [];

  return (
    <>
      <tr className="border-t border-white/10">
        <td className="px-6 py-4 font-semibold">#{id}</td>

        <td className="px-6 py-4 text-zinc-300">{normalizeOrderDate(date)}</td>

        <td className="px-6 py-4 font-semibold text-[#f0b3b3]">
          {money(total)}
        </td>

        <td className="px-6 py-4">
          <StatusBadge status={status} />
        </td>

        <td className="px-6 py-4">
          <button
            onClick={() => setOpen(!open)}
            className="text-sm font-semibold text-[#f0b3b3] hover:text-white"
          >
            {open ? "Ocultar" : "Ver detalle"}
          </button>
        </td>
      </tr>

      {open && (
        <tr className="border-t border-white/10 bg-black/40">
          <td colSpan="5" className="px-6 py-5">
            {items.length > 0 ? (
              <div className="grid gap-3">
                {items.map((item, itemIndex) => {
                  const product = item.producto || item.product || item;
                  const name = product.nombre || item.nombre || "Producto";
                  const quantity = item.cantidad || item.quantity || 1;

                  const price =
                    item.precioUnitario ||
                    item.precio ||
                    product.precio ||
                    item.price ||
                    0;

                  return (
                    <div
                      key={itemIndex}
                      className="flex items-center justify-between rounded-lg border border-white/10 bg-zinc-950 px-4 py-3"
                    >
                      <div>
                        <p className="font-semibold">{name}</p>
                        <p className="text-xs text-zinc-500">
                          Cantidad: {quantity}
                        </p>
                      </div>

                      <p className="font-semibold">{money(price)}</p>
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className="text-sm text-zinc-500">
                Este pedido no tiene detalle de productos guardado.
              </p>
            )}
          </td>
        </tr>
      )}
    </>
  );
}

function StatusBadge({ status }) {
  const normalized = String(status || "").toLowerCase();

  if (normalized.includes("entregado") || normalized.includes("completado")) {
    return (
      <span className="rounded bg-green-500/15 px-2 py-1 text-xs font-semibold uppercase text-green-300">
        Entregado
      </span>
    );
  }

  if (normalized.includes("camino") || normalized.includes("enviado")) {
    return (
      <span className="rounded bg-blue-500/15 px-2 py-1 text-xs font-semibold uppercase text-blue-300">
        En camino
      </span>
    );
  }

  if (normalized.includes("pendiente")) {
    return (
      <span className="rounded bg-yellow-500/15 px-2 py-1 text-xs font-semibold uppercase text-yellow-300">
        Pendiente
      </span>
    );
  }

  return (
    <span className="rounded bg-[#ba203f]/15 px-2 py-1 text-xs font-semibold uppercase text-[#f0b3b3]">
      Procesando
    </span>
  );
}

function AddressSection({ profile, setProfile, saveProfile }) {
  return (
    <section>
      <SectionTitle
        title="Direcciones"
        subtitle="Configurá tu dirección principal de envío."
      />

      <form
        onSubmit={saveProfile}
        className="rounded-xl border border-white/10 bg-zinc-900/80 p-6"
      >
        <label className="grid gap-2 text-sm">
          Dirección principal
          <input
            value={profile.direccion}
            onChange={(e) =>
              setProfile({ ...profile, direccion: e.target.value })
            }
            placeholder="Calle, número, ciudad"
            className="rounded-md border border-white/10 bg-black px-4 py-3 text-white outline-none focus:border-[#ba203f]"
          />
        </label>

        <button className="mt-6 flex items-center gap-2 rounded-md bg-[#ba203f] px-5 py-3 text-sm font-semibold text-white hover:bg-red-700">
          <Save size={16} />
          Guardar dirección
        </button>
      </form>
    </section>
  );
}

function ComingSoonSection() {
  return (
    <section>
      <SectionTitle
        title="Próximamente"
        subtitle="Funcionalidades pensadas para futuras versiones de MusicStore."
      />

      <div className="grid gap-5 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="rounded-xl border border-white/10 bg-zinc-900/80 p-8">
          <span className="rounded bg-[#ba203f] px-3 py-1 text-xs font-bold uppercase">
            Próximamente
          </span>

          <h3 className="mt-4 text-2xl font-bold">
            Nuevas funciones para usuarios
          </h3>

          <p className="mt-2 text-sm text-zinc-400">
            En futuras versiones se podrán sumar funcionalidades como favoritos,
            seguimiento avanzado de pedidos, beneficios para clientes frecuentes
            y recomendaciones personalizadas.
          </p>
        </div>

        <div className="rounded-xl border border-white/10 bg-zinc-900/80 p-8 text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-xl bg-[#ba203f]/15 text-[#f0b3b3]">
            <Package size={28} />
          </div>

          <h3 className="mt-4 text-xl font-bold">Función en desarrollo</h3>

          <p className="mt-2 text-sm text-zinc-400">
            Esta sección queda preparada para ampliar el perfil del usuario en
            una próxima etapa.
          </p>
        </div>
      </div>
    </section>
  );
}