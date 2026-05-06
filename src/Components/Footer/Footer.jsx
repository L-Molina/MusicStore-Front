import MaterialSymbol from '../MaterialSymbol/MaterialSymbol'
import { BRAND_LOGO_TEXT_URL } from '../../constants/stitchAssets.js'
import './Footer.css'

/** Pie de página de `home_musicstore_v6/code.html` */
export default function Footer() {
  return (
    <footer className="footer-stitch mt-auto w-full border-t border-[#333333] bg-[#1A1A1A] font-sans text-xs uppercase tracking-widest text-[#ba203f] opacity-90">
      <div className="mx-auto flex w-full max-w-screen-2xl flex-col items-center justify-between gap-6 px-8 py-12 md:flex-row">
        <div className="flex flex-col gap-4">
          <div className="text-lg font-bold text-white"><img src={BRAND_LOGO_TEXT_URL} alt="MusicStore Logo" className="h-8 w-auto object-contain" /></div>
          <p className="footer-stitch-tag max-w-xs normal-case lowercase tracking-normal text-gray-500">
            © {new Date().getFullYear()} MusicStore. Precision utilitaria para músicos.
          </p>
        </div>
        <div className="flex gap-8">
          <a href="#" className="text-gray-500 transition-colors hover:text-[#ba203f]">
            Privacidad
          </a>
          <a href="#" className="text-gray-500 transition-colors hover:text-[#ba203f]">
            Términos
          </a>
          <a href="#" className="text-gray-500 transition-colors hover:text-[#ba203f]">
            Soporte
          </a>
          <a href="#" className="text-gray-500 transition-colors hover:text-[#ba203f]">
            Envíos
          </a>
        </div>
        <div className="flex gap-4">
          <button
            type="button"
            className="flex size-10 items-center justify-center rounded-full border border-[#333333] transition-colors hover:border-white"
            aria-label="Compartir"
          >
            <MaterialSymbol className="text-sm">share</MaterialSymbol>
          </button>
          <button
            type="button"
            className="flex size-10 items-center justify-center rounded-full border border-[#333333] transition-colors hover:border-white"
            aria-label="Contacto correo"
          >
            <MaterialSymbol className="text-sm">mail</MaterialSymbol>
          </button>
        </div>
      </div>
    </footer>
  )
}
