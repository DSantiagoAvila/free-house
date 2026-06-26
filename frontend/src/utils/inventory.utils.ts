import type { InventoryStatus } from '../types/product.types';

interface InventoryInfo {
  label: string;
  colorClass: string;
  dotClass: string;
}

export function getInventoryInfo(status: InventoryStatus | string | undefined): InventoryInfo {
  switch (status) {
    case 'available':
      return { label: 'Disponible', colorClass: 'text-green-400', dotClass: 'bg-green-400' };
    case 'low_stock':
      return { label: 'Poco stock', colorClass: 'text-amber-400', dotClass: 'bg-amber-400' };
    case 'out_of_stock':
      return { label: 'Agotado', colorClass: 'text-red-400', dotClass: 'bg-red-400' };
    default:
      return { label: 'Sin stock', colorClass: 'text-red-400', dotClass: 'bg-red-400' };
  }
}

export function getProductInventoryStatus(variants: { inventoryStatus?: string; inventory_status?: string }[]): InventoryStatus {
  if (!variants || variants.length === 0) return 'out_of_stock';
  const statuses = variants.map((v) => v.inventoryStatus ?? v.inventory_status ?? 'out_of_stock');
  if (statuses.includes('available')) return 'available';
  if (statuses.includes('low_stock')) return 'low_stock';
  return 'out_of_stock';
}
