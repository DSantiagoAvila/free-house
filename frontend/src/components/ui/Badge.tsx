import type { InventoryStatus } from '../../types/product.types';
import { getInventoryInfo } from '../../utils/inventory.utils';

interface InventoryBadgeProps {
  inventoryStatus: InventoryStatus;
}

export function InventoryBadge({ inventoryStatus }: InventoryBadgeProps) {
  const { label, colorClass, dotClass } = getInventoryInfo(inventoryStatus);

  return (
    <span className={`inline-flex items-center gap-1.5 text-xs font-medium ${colorClass}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${dotClass}`} />
      {label}
    </span>
  );
}
