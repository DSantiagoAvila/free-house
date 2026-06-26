const COLOR_MAP: Record<string, string> = {
  negro: '#1a1a1a',
  blanco: '#f0ece4',
  gris: '#6b7280',
  azul: '#1d4ed8',
  rojo: '#dc2626',
  verde: '#16a34a',
  cafe: '#92400e',
  beige: '#d4b483',
  navy: '#1e3a5f',
  camel: '#c19a6b',
  marron: '#78350f',
};

export function getColorHex(colorName: string): string {
  return COLOR_MAP[colorName.toLowerCase()] ?? '#888888';
}

export function formatPrice(price: number | string | undefined | null): string {
  if (price == null) return '$ 0';
  const num = typeof price === 'string' ? parseFloat(price) : price;
  if (isNaN(num)) return '$ 0';
  return `$ ${num.toLocaleString('es-CO', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;
}
