import { Link } from 'react-router-dom';
import type { Product } from '../../types/product.types';
import { formatPrice } from '../../utils/format.utils';
import { InventoryBadge } from './InventoryBadge';
import { getProductInventoryStatus } from '../../utils/inventory.utils';

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const primaryImage = product.images?.find((img) => img.isPrimary ?? (img as any).is_primary) ?? product.images?.[0];
  const inventoryStatus = getProductInventoryStatus(product.variants ?? []);

  return (
    <Link
      to={`/productos/${product.slug}`}
      className="group block bg-fh-charcoal-light overflow-hidden rounded-sm"
    >
      <div className="relative aspect-[3/4] overflow-hidden bg-fh-charcoal-light">
        {primaryImage ? (
          <img
            src={primaryImage.url}
            alt={primaryImage.alt || product.name}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <span className="font-display text-2xl font-bold tracking-[0.2em] text-fh-charcoal uppercase opacity-40 select-none">
              FH
            </span>
          </div>
        )}
      </div>

      <div className="p-4 space-y-2">
        <h3 className="text-sm font-medium text-fh-offwhite truncate leading-snug">
          {product.name}
        </h3>

        <div className="flex items-center gap-2">
          <span className="text-fh-gold font-semibold text-sm">
            {formatPrice(product.price)}
          </span>
          {product.compare_price && product.compare_price > product.price && (
            <span className="text-fh-muted text-xs line-through">
              {formatPrice(product.compare_price)}
            </span>
          )}
        </div>

        <InventoryBadge inventoryStatus={inventoryStatus} />
      </div>
    </Link>
  );
}
