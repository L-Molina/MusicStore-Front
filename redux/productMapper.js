import { API_URL } from "./api.js";

export function mapProductoDTO(dto) {
  const discountPercent = dto.descuento ? Number(dto.descuento) : 0;
  const price = Number(dto.precio);
  const finalPrice = dto.precioConDescuento
    ? Number(dto.precioConDescuento)
    : price;

  const image =
    dto.fotosIds?.length > 0
      ? `${API_URL}/fotos/${dto.fotosIds[0]}`
      : null;

  return {
    id: String(dto.id),
    name: dto.nombre,
    category: dto.categoria?.nombre ?? "Sin categoría",
    price,
    discountPercent,
    finalPrice,
    stock: dto.stock,
    image,
    description: dto.descripcion,
    featured: discountPercent > 0,
    badge: discountPercent > 0 ? "Oferta" : null,
  };
}

export function mapCarritoItem(item) {
  const product = mapProductoDTO(item.producto);

  return {
    ...product,
    quantity: item.cantidad,
    price: Number(item.precioUnitario),
    backendItemId: item.id,
  };
}
