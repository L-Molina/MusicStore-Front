import { Link } from 'react-router-dom'
import guitarAmpBg from '../../assets/guitar-amp-bg.jpg'
import './Home.css'

export default function Home() {
  return (
    <>
      <header className="relative flex h-[min(870px,90vh)] w-full items-center overflow-hidden bg-black">
        <div className="absolute inset-0 z-0">
          <img alt="" className="size-full object-cover opacity-60" src={guitarAmpBg} />
          <div className="absolute inset-0 bg-gradient-to-r from-black via-black/40 to-transparent" />
        </div>
        <div className="relative z-10 mx-auto w-full max-w-screen-2xl px-8">
          <div className="max-w-2xl">
            <span className="mb-4 block font-sans text-sm font-semibold uppercase tracking-[0.15em] text-[#ba203f]">
              EQUIPAMIENTO DE ÉLITE
            </span>
            <h1 className="home-hero-title mb-6 font-sans font-extrabold uppercase tracking-tighter text-white">
              La Precisión del Sonido Puro.
            </h1>
            <p className="mb-8 max-w-lg font-sans text-lg font-normal leading-relaxed text-[#c8c6c5]">
              Explora nuestra colección curada de instrumentos y herramientas de audio para el músico
              profesional contemporáneo.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link
                to="/catalogo"
                className="bg-[#ba203f] px-8 py-4 font-sans text-sm font-semibold uppercase tracking-wide text-white transition-colors hover:bg-[#8f1a35] active:scale-95 active:opacity-80"
              >
                EXPLORAR CATÁLOGO
              </Link>
            </div>
          </div>
        </div>
      </header>

      
    </>
  )
}
