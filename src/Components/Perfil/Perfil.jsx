import { useEffect, useState } from "react"
import { useAuth } from "../../context/AuthContext"
import { formatPriceEUR } from "../../utils/formatPrice"
import "./Perfil.css"

export default function Perfil() {
  const { token, user, logout } = useAuth()

  const [profile, setProfile] = useState(null)
  const [form, setForm] = useState({
    nombreUsuario: "",
    mail: "",
  })
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState("")

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true)

        const res = await fetch("http://localhost:8080/usuarios/me", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })

        if (!res.ok) {
          throw new Error("No se pudo cargar el perfil")
        }

        const data = await res.json()

        setProfile(data)
        setForm({
          nombreUsuario: data.nombreUsuario ?? "",
          mail: data.mail ?? "",
        })

        const storedOrders = JSON.parse(
          localStorage.getItem(`orders_user_${data.id}`) || "[]"
        )

        setOrders(storedOrders)
      } catch (err) {
        console.error("Error cargando perfil:", err)
      } finally {
        setLoading(false)
      }
    }

    if (token) {
      fetchProfile()
    }
  }, [token])

  const handleChange = (e) => {
    const { name, value } = e.target

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    try {
      setSaving(true)
      setMessage("")

      const res = await fetch("http://localhost:8080/usuarios/me", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          nombreUsuario: form.nombreUsuario,
          mail: form.mail,
        }),
      })

      if (!res.ok) {
        throw new Error("No se pudo actualizar el perfil")
      }

      const updated = await res.json()

      setProfile(updated)
      localStorage.setItem("user", JSON.stringify(updated))

      setMessage("Perfil actualizado correctamente.")
    } catch (err) {
      console.error("Error actualizando perfil:", err)
      setMessage("No se pudo actualizar el perfil.")
    } finally {
      setSaving(false)
    }
  }

  const handleDeleteAccount = async () => {
    const confirmDelete = window.confirm(
      "¿Seguro que querés eliminar tu cuenta? Esta acción no se puede deshacer."
    )

    if (!confirmDelete) return

    try {
      const res = await fetch("http://localhost:8080/usuarios/me", {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (!res.ok) {
        throw new Error("No se pudo eliminar la cuenta")
      }

      logout()
      window.location.href = "/"
    } catch (err) {
      console.error("Error eliminando cuenta:", err)
      setMessage("No se pudo eliminar la cuenta.")
    }
  }

  if (loading) {
    return (
      <main className="perfil-page">
        <p className="perfil-loading">Cargando perfil...</p>
      </main>
    )
  }

  if (!profile) {
    return (
      <main className="perfil-page">
        <p className="perfil-loading">No se pudo cargar el perfil.</p>
      </main>
    )
  }

  return (
    <main className="perfil-page">
      <section className="perfil-hero">
        <div>
          <span className="perfil-kicker">Mi cuenta</span>

          <h1>Hola, {profile.nombre || profile.nombreUsuario}</h1>

          <p>
            Gestioná tus datos personales, revisá tu información de cuenta y
            consultá tus compras realizadas.
          </p>
        </div>

        <div className="perfil-role-card">
          <span>Rol</span>
          <strong>{profile.rol}</strong>
        </div>
      </section>

      <section className="perfil-grid">
        <article className="perfil-card">
          <div className="perfil-card-header">
            <h2>Datos personales</h2>
            <p>Información registrada en MusicStore.</p>
          </div>

          <div className="perfil-info-list">
            <div>
              <span>Nombre</span>
              <strong>{profile.nombre || "-"}</strong>
            </div>

            <div>
              <span>Apellido</span>
              <strong>{profile.apellido || "-"}</strong>
            </div>

            <div>
              <span>Usuario</span>
              <strong>{profile.nombreUsuario || "-"}</strong>
            </div>

            <div>
              <span>Email</span>
              <strong>{profile.mail || "-"}</strong>
            </div>
          </div>
        </article>

        <article className="perfil-card">
          <div className="perfil-card-header">
            <h2>Editar perfil</h2>
            <p>Podés cambiar tu nombre de usuario y correo.</p>
          </div>

          <form className="perfil-form" onSubmit={handleSubmit}>
            <label>
              Nombre de usuario
              <input
                type="text"
                name="nombreUsuario"
                value={form.nombreUsuario}
                onChange={handleChange}
                placeholder="Tu usuario"
              />
            </label>

            <label>
              Correo electrónico
              <input
                type="email"
                name="mail"
                value={form.mail}
                onChange={handleChange}
                placeholder="tu@email.com"
              />
            </label>

            {message && <p className="perfil-message">{message}</p>}

            <button type="submit" disabled={saving}>
              {saving ? "Guardando..." : "Guardar cambios"}
            </button>
          </form>
        </article>
      </section>

      <section className="perfil-card perfil-orders">
        <div className="perfil-card-header">
          <h2>Compras realizadas</h2>
          <p>Historial de compras hechas desde este navegador.</p>
        </div>

        {orders.length > 0 ? (
          <div className="perfil-orders-list">
            {orders.map((order) => (
              <article key={order.id} className="perfil-order">
                <div>
                  <span>Pedido #{order.id}</span>
                  <strong>{order.fecha || "Fecha no disponible"}</strong>
                </div>

                <div>
                  <span>Total</span>
                  <strong>{formatPriceEUR(order.total)}</strong>
                </div>

                <div>
                  <span>Productos</span>
                  <strong>
                    {order.detallesPedido?.length
                      ? `${order.detallesPedido.length} ítem/s`
                      : "Compra registrada"}
                  </strong>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="perfil-empty-orders">
            Todavía no hay compras registradas para mostrar.
          </div>
        )}
      </section>

      <section className="perfil-danger">
        <div>
          <h2>Zona de cuenta</h2>
          <p>También podés eliminar tu cuenta desde el endpoint existente.</p>
        </div>

        <button type="button" onClick={handleDeleteAccount}>
          Eliminar cuenta
        </button>
      </section>
    </main>
  )
}