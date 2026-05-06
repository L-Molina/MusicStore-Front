/** Formato alineado a mocks Stitch (EUR, locale es-ES) */
export function formatPriceEUR(amount) {
  return new Intl.NumberFormat('es-ES', {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: 2,
  }).format(Number(amount))
}
