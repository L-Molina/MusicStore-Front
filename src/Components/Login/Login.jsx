import { useState, useId } from "react";
import { Link, useNavigate } from "react-router-dom";
import { BRAND_LOGO_URL } from "../../constants/stitchAssets.js";
import MaterialSymbol from "../MaterialSymbol/MaterialSymbol";
import { useAuth } from "../../context/AuthContext";

import "./Login.css";

export default function Login() {
  const { login} = useAuth();

  const emailId = useId();
  const passId = useId();
  const remId = useId();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(false);
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [shakeKey, setShakeKey] = useState(0);

  const navigate = useNavigate();

  function validate() {
    if (!email.trim()) return "Ingresá tu correo electrónico.";
    if (!/\S+@\S+\.\S+/.test(email))
      return "El correo no tiene un formato válido.";
    if (!password) return "Ingresá tu contraseña.";
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

    try {
      setLoading(true);

      const data = await login(email, password, remember);

      if (data.user.rol === "VENDEDOR") {
        navigate("/vendedor");
      }else if(data.user.rol === "ADMIN"){
        navigate("/admin");
      }else {
        navigate("/");
      }
      
    } catch (err) {
      setError(err.message);
      setShakeKey((k) => k + 1);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="login-bg flex flex-col items-center justify-center px-6 py-16 relative">
      <div className="login-noise" aria-hidden="true" />

      <main className="relative z-10 w-full max-w-[420px] login-fade-in">
        <header className="flex flex-col items-center mb-10">
          <img
            src={BRAND_LOGO_URL}
            alt="MusicStore"
            className="h-20 w-auto object-contain mb-6"
          />
          <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#ba203f]">
            Iniciar Sesión
          </p>
        </header>
        <section
          className="login-card rounded-lg p-8"
          key={shakeKey}
          style={shakeKey > 0 ? { animation: "shake 0.4s ease" } : undefined}
        >
          {" "}
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
            <div className="flex flex-col gap-1.5">
              <label
                htmlFor={emailId}
                className="text-[10px] font-bold uppercase tracking-[0.15em] text-zinc-400"
              >
                Correo electrónico
              </label>
              <div className="login-input-wrapper relative">
                <MaterialSymbol className="login-input-icon material-symbols-outlined">
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
                  className="login-input"
                  disabled={loading}
                />
              </div>
            </div>
            <div className="flex flex-col gap-1.5">
              <div className="flex items-center justify-between">
                <label
                  htmlFor={passId}
                  className="text-[10px] font-bold uppercase tracking-[0.15em] text-zinc-400"
                >
                  Contraseña
                </label>
                <a href="#" className="login-forgot">
                  ¿Olvidaste tu contraseña?
                </a>
              </div>
              <div className="login-input-wrapper relative">
                <MaterialSymbol className="login-input-icon material-symbols-outlined">
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
                  className="login-input"
                  style={{ paddingRight: "44px" }}
                  disabled={loading}
                />
                <button
                  type="button"
                  aria-label={
                    showPass ? "Ocultar contraseña" : "Mostrar contraseña"
                  }
                  onClick={() => setShowPass((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-600 hover:text-zinc-300 transition-colors"
                >
                  <MaterialSymbol className="text-[20px]">
                    {showPass ? "visibility_off" : "visibility"}
                  </MaterialSymbol>
                </button>
              </div>
            </div>

            <label
              htmlFor={remId}
              className="flex items-center gap-2.5 cursor-pointer select-none"
            >
              <input
                id={remId}
                type="checkbox"
                className="login-checkbox"
                checked={remember}
                onChange={(e) => setRemember(e.target.checked)}
                disabled={loading}
              />
              <span className="text-[12px] font-medium text-zinc-400">
                Mantener sesión iniciada
              </span>
            </label>

            <button
              type="submit"
              className="login-btn-primary mt-2 flex items-center justify-center gap-2"
              disabled={loading}
              aria-busy={loading}
            >
              {loading ? (
                <>
                  <span
                    className="inline-block h-4 w-4 rounded-full border-2 border-white/30 border-t-white animate-spin"
                    aria-hidden="true"
                  />
                  Iniciando…
                </>
              ) : (
                "Iniciar sesión"
              )}
            </button>
          </form>
          <div className="relative my-7">
            <div className="login-divider-line" />
            <span className="absolute left-1/2 -translate-x-1/2 -translate-y-1/2 bg-[#141616] px-4 text-[10px] font-semibold uppercase tracking-[0.15em] text-zinc-400">
              O continúa con
            </span>
          </div>
          <div className="grid grid-cols-1 gap-3">
            <button type="button" className="login-btn-social">
              <svg
                width="18"
                height="18"
                viewBox="0 0 18 18"
                aria-hidden="true"
              >
                <path
                  fill="#4285F4"
                  d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844a4.14 4.14 0 0 1-1.796 2.716v2.259h2.908c1.702-1.567 2.684-3.875 2.684-6.615Z"
                />
                <path
                  fill="#34A853"
                  d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18Z"
                />
                <path
                  fill="#FBBC05"
                  d="M3.964 10.71A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.042l3.007-2.332Z"
                />
                <path
                  fill="#EA4335"
                  d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58Z"
                />
              </svg>
              Google
            </button>
          </div>
        </section>

        <footer className="mt-8 text-center">
          <p className="text-[13px] text-zinc-400">
            ¿No tenés cuenta?{" "}
            <Link to="/Registro">
              <span className="registro-link">Registrate gratis</span>
            </Link>
          </p>
          <p className="mt-6 max-w-xs mx-auto text-[10px] leading-relaxed text-zinc-500">
            Al iniciar sesión aceptás nuestros Términos de Servicio y Política
            de Privacidad. MusicStore es una plataforma profesional de audio.
          </p>
        </footer>
      </main>

      <div
        className="login-status-bar font-mono text-[9px] uppercase tracking-widest text-zinc-400"
        aria-hidden="true"
      >
        <span>System status: optimal</span>
        <span>Secure encryption v2.4.0</span>
      </div>
    </div>
  );
}
