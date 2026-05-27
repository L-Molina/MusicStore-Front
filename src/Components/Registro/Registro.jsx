import { useId, useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import logoText from "../../assets/logo-text.png"
import registerHero from "../../assets/register-hero.jpg"
import MaterialSymbol from "../MaterialSymbol/MaterialSymbol"
import "./Registro.css"

export default function Registro() {
  const navigate = useNavigate()

  const nombreId = useId()
  const apellidoId = useId()
  const usernameId = useId()
  const emailId = useId()
  const passwordId = useId()
  const confirmPasswordId = useId()
  const roleId = useId()

  const [form, setForm] = useState({
    nombre: "",
    apellido: "",
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "COMPRADOR",
  })

  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [acceptTerms, setAcceptTerms] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const handleChange = (e) => {
    const { name, value } = e.target

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }))

    setError("")
  }

  const validate = () => {
    if (!form.nombre.trim()) return "Ingresá tu nombre."
    if (!form.apellido.trim()) return "Ingresá tu apellido."
    if (!form.username.trim()) return "Ingresá un nombre de usuario."
    if (!form.email.trim()) return "Ingresá tu correo electrónico."

    if (!/\S+@\S+\.\S+/.test(form.email)) {
      return "El correo electrónico no tiene un formato válido."
    }

    if (!form.password) return "Ingresá una contraseña."

    if (form.password.length < 4) {
      return "La contraseña debe tener al menos 4 caracteres."
    }

    if (form.password !== form.confirmPassword) {
      return "Las contraseñas no coinciden."
    }

    if (!acceptTerms) {
      return "Debés aceptar los términos y condiciones."
    }

    return ""
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    const validationError = validate()

    if (validationError) {
      setError(validationError)
      return
    }

    try {
      setLoading(true)
      setError("")

      const res = await fetch("http://localhost:8080/api/auth/registrar", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          nombre: form.nombre,
          apellido: form.apellido,
          username: form.username,
          email: form.email,
          password: form.password,
          role: form.role,
        }),
      })

      if (!res.ok) {
        const text = await res.text()
        throw new Error(text || "No se pudo registrar el usuario.")
      }

      alert("Cuenta creada correctamente. Ya podés iniciar sesión.")
      navigate("/login")
    } catch (err) {
      console.error("Error registrando usuario:", err)
      setError("No se pudo crear la cuenta. Revisá los datos ingresados.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="registro-page">
      <section className="registro-left">
        <div className="registro-left-bg">
          <img src={registerHero} alt="" />
          <div className="registro-left-overlay" />
        </div>

        <Link to="/login" className="registro-back">
          <MaterialSymbol>arrow_back</MaterialSymbol>
          Volver
        </Link>

        <div className="registro-left-content">
          <h1>Eleva tu sonido.</h1>

          <p>
            Unite a la comunidad más grande de músicos y productores. Accedé a
            instrumentos premium y soporte técnico especializado.
          </p>
        </div>
      </section>

      <section className="registro-right">
        <div className="registro-form-shell">
          <header className="registro-header">
            <img
              src={logoText}
              alt="MusicStore"
              className="registro-logo"
            />

            <h2>Crea tu cuenta</h2>

            <p>Comienza tu viaje musical con nosotros hoy mismo.</p>
          </header>

          {error && (
            <div className="registro-error">
              <MaterialSymbol>error</MaterialSymbol>
              <span>{error}</span>
            </div>
          )}

          <form className="registro-form" onSubmit={handleSubmit}>
            <div className="registro-two-cols">
              <label>
                Nombre
                <input
                  id={nombreId}
                  type="text"
                  name="nombre"
                  value={form.nombre}
                  onChange={handleChange}
                  placeholder="Ej. Juan"
                  disabled={loading}
                />
              </label>

              <label>
                Apellido
                <input
                  id={apellidoId}
                  type="text"
                  name="apellido"
                  value={form.apellido}
                  onChange={handleChange}
                  placeholder="Ej. Pérez"
                  disabled={loading}
                />
              </label>
            </div>

            <label>
              Nombre de usuario
              <div className="registro-input-icon">
                <MaterialSymbol>person</MaterialSymbol>

                <input
                  id={usernameId}
                  type="text"
                  name="username"
                  value={form.username}
                  onChange={handleChange}
                  placeholder="tu_usuario"
                  disabled={loading}
                />
              </div>
            </label>

            <label>
              Correo electrónico
              <div className="registro-input-icon">
                <MaterialSymbol>mail</MaterialSymbol>

                <input
                  id={emailId}
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="nombre@ejemplo.com"
                  disabled={loading}
                />
              </div>
            </label>

            <div className="registro-two-cols">
              <label>
                Contraseña
                <div className="registro-input-icon">
                  <MaterialSymbol>lock</MaterialSymbol>

                  <input
                    id={passwordId}
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={form.password}
                    onChange={handleChange}
                    placeholder="••••••••"
                    disabled={loading}
                  />

                  <button
                    type="button"
                    className="registro-eye"
                    onClick={() => setShowPassword((prev) => !prev)}
                  >
                    <MaterialSymbol>
                      {showPassword ? "visibility_off" : "visibility"}
                    </MaterialSymbol>
                  </button>
                </div>
              </label>

              <label>
                Confirmar
                <div className="registro-input-icon">
                  <MaterialSymbol>lock</MaterialSymbol>

                  <input
                    id={confirmPasswordId}
                    type={showConfirmPassword ? "text" : "password"}
                    name="confirmPassword"
                    value={form.confirmPassword}
                    onChange={handleChange}
                    placeholder="••••••••"
                    disabled={loading}
                  />

                  <button
                    type="button"
                    className="registro-eye"
                    onClick={() => setShowConfirmPassword((prev) => !prev)}
                  >
                    <MaterialSymbol>
                      {showConfirmPassword ? "visibility_off" : "visibility"}
                    </MaterialSymbol>
                  </button>
                </div>
              </label>
            </div>

            <label>
              Tipo de cuenta
              <select
                id={roleId}
                name="role"
                value={form.role}
                onChange={handleChange}
                disabled={loading}
              >
                <option value="COMPRADOR">Comprador</option>
                <option value="VENDEDOR">Vendedor</option>
              </select>
            </label>

            <label className="registro-terms">
              <input
                type="checkbox"
                checked={acceptTerms}
                onChange={(e) => setAcceptTerms(e.target.checked)}
                disabled={loading}
              />

              <span>
                Acepto los <strong>Términos de Servicio</strong> y{" "}
                <strong>Política de Privacidad</strong> de MusicStore.
              </span>
            </label>

            <button type="submit" className="registro-submit" disabled={loading}>
              {loading ? "Creando cuenta..." : "Crear cuenta"}
            </button>
          </form>

          <div className="registro-divider">
            <span />
            <p>O registrate con</p>
            <span />
          </div>

          <div className="registro-socials">
            <button type="button">
              <span>G</span>
              Google
            </button>

            <button type="button">
              <span></span>
              Apple
            </button>
          </div>

          <p className="registro-login-link">
            ¿Ya tenés una cuenta?{" "}
            <Link to="/login">Inicia sesión aquí</Link>
          </p>
        </div>
      </section>

      <footer className="registro-footer">
        <strong>MusicStore</strong>

        <nav>
          <span>Soporte técnico</span>
          <span>Envíos y devoluciones</span>
          <span>Garantía</span>
          <span>Localizador de tiendas</span>
          <span>Contacto</span>
        </nav>

        <p>© 2026 MusicStore. Todos los derechos reservados.</p>
      </footer>
    </main>
  )
}