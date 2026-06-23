import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import guitarAmpBg from "../../assets/guitar-amp-bg.jpg";
import "./Home.css";

const featuredProducts = [
  { name: "Fender Stratocaster", price: "$1200", tag: "Guitarras" },
  { name: "Gibson Les Paul", price: "$1800", tag: "Guitarras" },
  { name: "Ibanez RG", price: "$950", tag: "Guitarras" },
  { name: "Marshall MG30", price: "$600", tag: "Amplificadores" },
  { name: "Boss DS-1", price: "$120", tag: "Pedales" },
  { name: "Yamaha TRBX", price: "$850", tag: "Bajos" },
];

export default function Home() {
  const [logoutMessage, setLogoutMessage] = useState("");

  useEffect(() => {
    const message = localStorage.getItem("logoutMessage");

    if (message) {
      setLogoutMessage(message);
      localStorage.removeItem("logoutMessage");

      setTimeout(() => {
        setLogoutMessage("");
      }, 3000);
    }
  }, []);

  return (
    <>
    <div className="promo-bar">
  <div className="promo-track">
    🚚 ENVÍOS A TODO EL PAÍS • 🎸 GUITARRAS PREMIUM • 🔥 HASTA 20% OFF • 🎧 AUDIO PROFESIONAL • 💿 VINILOS EXCLUSIVOS •
    🚚 ENVÍOS A TODO EL PAÍS • 🎸 GUITARRAS PREMIUM • 🔥 HASTA 20% OFF • 🎧 AUDIO PROFESIONAL • 💿 VINILOS EXCLUSIVOS •
  </div>
</div>
      <header className="relative flex h-[min(870px,90vh)] w-full items-center overflow-hidden bg-black">
        <div className="absolute inset-0 z-0">
          <img alt="" className="size-full object-cover opacity-60" src={guitarAmpBg} />
          <div className="absolute inset-0 bg-gradient-to-r from-black via-black/40 to-transparent" />
        </div>

        <div className="relative z-10 mx-auto w-full max-w-screen-2xl px-8">
          {logoutMessage && (
            <div className="mb-6 max-w-md rounded-lg border border-green-600 bg-green-900/40 px-4 py-3 text-green-300 shadow-lg">
              {logoutMessage}
            </div>
          )}

          <div className="max-w-4xl home-enter">
            <span className="mb-6 block font-sans text-lg font-semibold uppercase tracking-[0.25em] text-[#ba203f]">
              EQUIPAMIENTO DE ÉLITE
            </span>

            <h1 className="mb-8 font-sans font-extrabold uppercase tracking-tight text-white text-6xl md:text-8xl lg:text-9xl leading-none">
              LA PRECISIÓN
              <br />
              DEL SONIDO
              <br />
              PURO.
            </h1>

            <p className="mb-10 max-w-2xl font-sans text-xl leading-relaxed text-[#c8c6c5]">
              Explora nuestra colección curada de instrumentos y herramientas de audio para el músico profesional contemporáneo.
            </p>

            <div className="flex flex-wrap gap-4">
              <Link
                to="/catalogo"
                className="home-enter-delay bg-[#ba203f] px-10 py-5 font-sans text-base font-bold uppercase tracking-wider text-white transition-all hover:bg-[#8f1a35] hover:scale-105"
              >
                EXPLORAR CATÁLOGO
              </Link>
            </div>
          </div>
        </div>
      </header>

      <section className="bg-black py-14 text-white">
        <div className="mx-auto mb-8 max-w-screen-2xl px-8">
          <p className="text-sm font-bold uppercase tracking-[0.25em] text-[#ba203f]">
            Selección destacada
          </p>
          <h2 className="mt-2 text-4xl font-extrabold uppercase">
            Productos que marcan el ritmo
          </h2>
        </div>

        <div className="marquee-container">
          <div className="marquee-track">
            {[...featuredProducts, ...featuredProducts].map((product, index) => (
              <Link to="/catalogo" className="product-card" key={`${product.name}-${index}`}>
                <span className="mb-3 block text-xs font-bold uppercase tracking-[0.2em] text-[#ba203f]">
                  {product.tag}
                </span>
                <h3>{product.name}</h3>
                <p>{product.price}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}