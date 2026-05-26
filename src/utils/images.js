import bossBD2 from '../assets/boss_bd2.jpg'
import ernieBallStrap from '../assets/ernie_ball_strap.jpg'
import fenderStrat from '../assets/fender_strat.jpg'
import guitarAmpBg from '../assets/guitar-amp-bg.jpg'
import logo from '../assets/logo.png'
import marshallAmp from '../assets/marshall_amp.jpg'
import studioConsole from '../assets/studio_console.jpg'
import studioSpeakers from '../assets/studio_speakers.jpg'

const fallbackImagesByName = {
  'vinilo soda stereo': studioConsole,
  'remera queen': guitarAmpBg,
}

const fallbackImagesByCategory = {
  rock: guitarAmpBg,
  guitarras: fenderStrat,
  amplificadores: marshallAmp,
  efectos: bossBD2,
  accesorios: ernieBallStrap,
  'audio pro': studioSpeakers,
  altavoces: studioSpeakers,
}

export const getProductImageUrl = (product) => {
  const firstPhoto = product?.fotos?.[0]

  if (firstPhoto?.file) {
    return `data:image/jpeg;base64,${firstPhoto.file}`
  }

  const productName = product?.name?.toLowerCase()
  const productCategory = product?.category?.toLowerCase()

  if (productName && fallbackImagesByName[productName]) {
    return fallbackImagesByName[productName]
  }

  if (productCategory && fallbackImagesByCategory[productCategory]) {
    return fallbackImagesByCategory[productCategory]
  }

  return logo
}