const QUESTION_PLACEHOLDER =
  "data:image/svg+xml;utf8," +
  encodeURIComponent(`
    <svg xmlns="http://www.w3.org/2000/svg" width="600" height="600" viewBox="0 0 600 600">
      <rect width="600" height="600" fill="#111111"/>
      <rect x="12" y="12" width="576" height="576" fill="none" stroke="#333333" stroke-width="8"/>
      <circle cx="300" cy="270" r="105" fill="#1A1A1A" stroke="#ba203f" stroke-width="8"/>
      <text x="300" y="318" text-anchor="middle" font-family="Arial, Helvetica, sans-serif" font-size="150" font-weight="700" fill="#ba203f">?</text>
      <text x="300" y="440" text-anchor="middle" font-family="Arial, Helvetica, sans-serif" font-size="30" font-weight="700" fill="#c8c6c5">Sin imagen</text>
    </svg>
  `);

export const getProductImageUrl = (product) => {
  const firstPhoto = product?.foto || product?.fotos?.[0];

  if (firstPhoto?.file) {
    return `data:image/jpeg;base64,${firstPhoto.file}`;
  }

  if (firstPhoto?.url) {
    return firstPhoto.url;
  }

  if (product?.imagen) {
    return product.imagen;
  }

  if (product?.image && typeof product.image === "string") {
    return product.image;
  }

  return QUESTION_PLACEHOLDER;
};

export { QUESTION_PLACEHOLDER };
