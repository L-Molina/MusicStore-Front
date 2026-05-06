import guitarBg from '../assets/prs_custom_24.jpg'
import bassBg from '../assets/fender_p_bass.jpg'
import drumsBg from '../assets/pearl_drum_kit.jpg'
import speakersBg from '../assets/studio_speakers.jpg'
import amplifiersBg from '../assets/marshall_amp.jpg'
import audioProBg from '../assets/studio_console.jpg'
import guitarAmpBg from '../assets/guitar-amp-bg.jpg'
import logo from '../assets/logo.png'

/**
 * URLs y texto extraídos de los mocks Stitch (home_musicstore_v6, cat_logo_musicstore_v6).
 * HTML original: design-mocks/stitch_musicstore_e_commerce_platform/…/code.html
 */

export const BRAND_LOGO_URL = logo;
export const HOME_HERO_IMAGE = guitarAmpBg;

/** Categorías principales → `cat` coincide con filtros del catálogo */
export const STITCH_CATEGORY_TILES = [
  {
    cat: 'Guitarras',
    label: 'GUITARRAS',
    img: guitarBg,
  },
  {
    cat: 'Bajos',
    label: 'BAJOS',
    img: bassBg,
  },
  {
    cat: 'Baterías',
    label: 'BATERÍAS',
    img: drumsBg,
  },
  {
    cat: 'Altavoces',
    label: 'ALTAVOCES',
    img: speakersBg,
  },
  {
    cat: 'Amplificadores',
    label: 'AMPLIFICADORES',
    img: amplifiersBg,
  },
  {
    cat: 'Audio Pro',
    label: 'AUDIO PRO',
    img: audioProBg,
  },
]
