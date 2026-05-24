export const getProductImageUrl = (product) => {
  const firstPhoto = product?.fotos?.[0]

  if (!firstPhoto?.file) return "/placeholder.png"

  return `data:image/jpeg;base64,${firstPhoto.file}`
}