import { useState, useId } from "react";
import { Link, useNavigate } from "react-router-dom";
import { BRAND_LOGO_URL } from "../../constants/stitchAssets.js";
import MaterialSymbol from "../MaterialSymbol/MaterialSymbol";
import { useAuth } from "../../context/AuthContext";
import "./registro.css";

export default function registro() {
  const { register } = useAuth();
  const [role, setRole] = useState("COMPRADOR");

  const emailId = useId();
  const userId = useId();
  const nombreId = useId();
  const apellidoId = useId();
  const passId = useId();
  const remId = useId();

  const [email, setEmail] = useState("");
  const [user, setUser] = useState("");
  const [nombre, setNombre] = useState("");
  const [apellido, setApellido] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(false);
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [shakeKey, setShakeKey] = useState(0);

  const navigate = useNavigate();

  function validate() {
    if (!nombre.trim()) return "Ingresá tu nombre.";
    if (!apellido.trim()) return "Ingresá tu apellido.";
    if (!user.trim()) return "Ingresá un usuario.";
    if (!email.trim()) return "Ingresá tu correo electrónico.";
    if (!/\S+@\S+\.\S+/.test(email)) return "Correo inválido.";
    if (!password) return "Ingresá una contraseña.";
    if (password.length < 6)
      return "La contraseña debe tener al menos 6 caracteres.";
    return "";
  }

  async function handleSubmit(e) {
    e.preventDefault();
  
    const msg = validate();
  
    if (msg) {
      setError(msg);
      setShakeKey((k) => k + 1);
      return;
    }
  
    setLoading(true);
  
    try {
      await register(
        {
          nombre,
          apellido,
          username: user,
          email,
          password,
          role
        },
        remember
      );
  
      navigate("/");
    } catch (err) {
      setError(err.message);
      setShakeKey((k) => k + 1);
    } finally {
      setLoading(false);
    }
  }

  /* ── Render ─────────────────────────────────────────────────────── */
  return (
    <div className="registro-bg flex flex-col items-center justify-center px-6 py-16 relative">
      <div className="registro-noise" aria-hidden="true" />

      <main className="relative z-10 w-full max-w-[420px] registro-fade-in">
        {/* ── Marca ─────────────────────────────────────────────── */}
        <header className="flex flex-col items-center mb-10">
          <Link to="/" aria-label="Volver al inicio">
            <img
              src={BRAND_LOGO_URL}
              alt="MusicStore"
              className="h-20 w-auto object-contain mb-6"
            />
          </Link>
          <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#ba203f]">
            Crea tu cuenta
          </p>
        </header>

        {/* ── Tarjeta ───────────────────────────────────────────── */}
        <section
          className="registro-card rounded-lg p-8"
          key={shakeKey}
          style={shakeKey > 0 ? { animation: "shake 0.4s ease" } : undefined}
        >
          {/* Error banner */}
          {error && (
            <div
              role="alert"
              className="mb-6 flex items-center gap-3 border border-[#ba203f]/40 bg-[#ba203f]/10 rounded px-4 py-3"
            >
              <MaterialSymbol className="text-[#ba203f] text-lg shrink-0">
                error
              </MaterialSymbol>
              <p className="text-[13px] text-[#e2e2e2]">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} noValidate className="space-y-5">
            {/* Nombre y Apellido */}
            <div className="flex flex-col gap-1.5">
              <label
                htmlFor={nombreId}
                className="text-[10px] font-bold uppercase tracking-[0.15em] text-zinc-400"
              >
                Nombre y Apellido
              </label>
              <div className="registro-input-wrapper relative">
                <MaterialSymbol className="registro-input-icon material-symbols-outlined">
                  badge
                </MaterialSymbol>
                <input
                  id={nombreId}
                  type="nombre"
                  autoComplete="nombre"
                  value={nombre}
                  onChange={(e) => {
                    setNombre(e.target.value);
                    setError("");
                  }}
                  placeholder="Nombre"
                  className="registro-input"
                  disabled={loading}
                />
              </div>
              <div className="registro-input-wrapper relative">
                <MaterialSymbol className="registro-input-icon material-symbols-outlined">
                  badge
                </MaterialSymbol>
                <input
                  id={apellidoId}
                  type="apellido"
                  autoComplete="apellido"
                  value={apellido}
                  onChange={(e) => {
                    setApellido(e.target.value);
                    setError("");
                  }}
                  placeholder="Apellido"
                  className="registro-input"
                  disabled={loading}
                />
              </div>
            </div>

            {/* Usuario */}
            <div className="flex flex-col gap-1.5">
              <label
                htmlFor={userId}
                className="text-[10px] font-bold uppercase tracking-[0.15em] text-zinc-400"
              >
                Nombre de Usuario
              </label>
              <div className="registro-input-wrapper relative">
                <MaterialSymbol className="registro-input-icon material-symbols-outlined">
                  person
                </MaterialSymbol>
                <input
                  id={userId}
                  type="user"
                  autoComplete="user"
                  value={user}
                  onChange={(e) => {
                    setUser(e.target.value);
                    setError("");
                  }}
                  placeholder="Usuario"
                  className="registro-input"
                  disabled={loading}
                />
              </div>
            </div>

            {/* Email */}
            <div className="flex flex-col gap-1.5">
              <label
                htmlFor={emailId}
                className="text-[10px] font-bold uppercase tracking-[0.15em] text-zinc-400"
              >
                Correo electrónico
              </label>
              <div className="registro-input-wrapper relative">
                <MaterialSymbol className="registro-input-icon material-symbols-outlined">
                  mail
                </MaterialSymbol>
                <input
                  id={emailId}
                  type="email"
                  autoComplete="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    setError("");
                  }}
                  placeholder="nombre@ejemplo.com"
                  className="registro-input"
                  disabled={loading}
                />
              </div>
            </div>

            {/* Contraseña */}
            <div className="flex flex-col gap-1.5">
              <div className="flex items-center justify-between">
                <label
                  htmlFor={passId}
                  className="text-[10px] font-bold uppercase tracking-[0.15em] text-zinc-400"
                >
                  Contraseña
                </label>
              </div>
              <div className="registro-input-wrapper relative">
                <MaterialSymbol className="registro-input-icon material-symbols-outlined">
                  lock
                </MaterialSymbol>
                <input
                  id={passId}
                  type={showPass ? "text" : "password"}
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setError("");
                  }}
                  placeholder="••••••••"
                  className="registro-input"
                  style={{ paddingRight: "44px" }}
                  disabled={loading}
                />
                <button
                  type="button"
                  aria-label={
                    showPass ? "Ocultar contraseña" : "Mostrar contraseña"
                  }
                  onClick={() => setShowPass((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-300 transition-colors"
                >
                  <MaterialSymbol className="text-[20px]">
                    {showPass ? "visibility_off" : "visibility"}
                  </MaterialSymbol>
                </button>
              </div>
            </div>
            {/* Rol */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-bold uppercase tracking-[0.15em] text-zinc-400">
                Tipo de cuenta
              </label>

              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="registro-input"
                disabled={loading}
              >
                <option value="COMPRADOR">Comprador</option>
                <option value="VENDEDOR">Vendedor</option>
              </select>
            </div>

            {/* Recordarme */}
            <label
              htmlFor={remId}
              className="flex items-center gap-2.5 cursor-pointer select-none"
            >
              <input
                id={remId}
                type="checkbox"
                className="registro-checkbox"
                checked={remember}
                onChange={(e) => setRemember(e.target.checked)}
                disabled={loading}
              />
              <span className="text-[12px] font-medium text-zinc-400">
                Mantener sesión iniciada
              </span>
            </label>

            {/* Botón principal */}
            <button
              type="submit"
              className="registro-btn-primary mt-2 flex items-center justify-center gap-2"
              disabled={loading}
              aria-busy={loading}
            >
              {loading ? (
                <>
                  <span
                    className="inline-block h-4 w-4 rounded-full border-2 border-white/30 border-t-white animate-spin"
                    aria-hidden="true"
                  />
                  Registrando…
                </>
              ) : (
                "Registrarse"
              )}
            </button>
          </form>
        </section>

        {/* Pie */}
        <footer className="mt-8 text-center">
          <p className="mt-6 max-w-xs mx-auto text-[10px] leading-relaxed text-zinc-400">
            Al crear y registrar tu cuenta aceptás nuestros Términos de Servicio
            y Política de Privacidad. MusicStore es una plataforma profesional
            de audio.
          </p>
        </footer>
      </main>

      {/* Barra de estado decorativa */}
      <div
        className="registro-status-bar font-mono text-[9px] uppercase tracking-widest text-zinc-400"
        aria-hidden="true"
      >
        <span>System status: optimal</span>
        <span>Secure encryption v2.4.0</span>
      </div>
    </div>
  );
}
