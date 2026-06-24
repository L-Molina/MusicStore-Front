import guitarBg from '../assets/prs_custom_24.jpg'
import bassBg from '../assets/fender_p_bass.jpg'
import drumsBg from '../assets/pearl_drum_kit.jpg'
import speakersBg from '../assets/studio_speakers.jpg'
import amplifiersBg from '../assets/marshall_amp.jpg'
import audioProBg from '../assets/studio_console.jpg'
import guitarAmpBg from '../assets/guitar-amp-bg.jpg'
import logo from '../assets/logo.png'
import logoText from '../assets/logo-text.png'

export const BRAND_LOGO_URL = logo;
export const BRAND_LOGO_TEXT_URL = logoText;
export const HOME_HERO_IMAGE = guitarAmpBg;

const CATEGORY_IMAGE_MAP = [
  { keywords: ['guitar', 'guitarra'], img: guitarBg },
  { keywords: ['bass', 'bajo'], img: bassBg },
  { keywords: ['drum', 'bater'], img: drumsBg },
  { keywords: ['speaker', 'altavoc', 'monitor', 'parlante'], img: speakersBg },
  { keywords: ['amplif', 'amp'], img: amplifiersBg },
  { keywords: ['audio', 'pro', 'interface', 'console', 'mixer'], img: audioProBg },
]

export function getImageForCategory(name) {
  if (!name) return guitarBg
  const lower = name.toLowerCase()
  const match = CATEGORY_IMAGE_MAP.find(({ keywords }) =>
    keywords.some((kw) => lower.includes(kw))
  )
  return match?.img ?? guitarBg
}

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
