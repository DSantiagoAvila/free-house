import { useState } from 'react';
import { InventoryBadge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { useContacts } from '../../hooks/useContacts';
import { formatPrice } from '../../utils/format.utils';
import { isAvailableToPurchase } from '../../utils/inventory.utils';
import type { Product } from '../../types/product.types';

interface ProductDetailProps {
  product: Product;
}

export function ProductDetail({ product }: ProductDetailProps) {
  const { name, price, description, images, variants, totalQuantity, category } = product;
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const { openWhatsApp } = useContacts();

  const activeImage = images[activeImageIndex] ?? null;
  const canPurchase = isAvailableToPurchase(totalQuantity);

  const handleContact = () => {
    openWhatsApp({ productName: name });
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
      <div className="space-y-3">
        <div className="aspect-[3/4] bg-fh-charcoal rounded overflow-hidden">
          {activeImage ? (
            <img
              src={activeImage.url}
              alt={activeImage.alt || name}
              className="w-full h-full object-cover object-center"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <span className="text-fh-muted text-sm">Sin imagen</span>
            </div>
          )}
        </div>

        {images.length > 1 && (
          <div className="flex gap-2 overflow-x-auto pb-1">
            {images.map((img, idx) => (
              <button
                key={img.id}
                onClick={() => setActiveImageIndex(idx)}
                className={`flex-shrink-0 w-16 h-20 rounded overflow-hidden border-2 transition-colors duration-200 ${
                  idx === activeImageIndex ? 'border-fh-gold' : 'border-transparent'
                }`}
                aria-label={`Ver imagen ${idx + 1}`}
              >
                <img
                  src={img.url}
                  alt={img.alt || `${name} ${idx + 1}`}
                  className="w-full h-full object-cover"
                />
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="space-y-6">
        <div className="space-y-2">
          <p className="text-fh-muted text-xs uppercase tracking-widest">{category.name}</p>
          <h1 className="text-fh-offwhite text-2xl lg:text-3xl font-semibold leading-tight">
            {name}
          </h1>
          <p className="text-fh-gold text-2xl font-bold">{formatPrice(price)}</p>
        </div>

        <InventoryBadge quantity={totalQuantity} />

        {variants.length > 0 && (
          <div className="space-y-2">
            <p className="text-fh-muted text-xs uppercase tracking-widest">Tallas disponibles</p>
            <div className="flex flex-wrap gap-2">
              {variants.map((variant) => (
                <span
                  key={variant.id}
                  className={`px-3 py-1.5 text-sm rounded border ${
                    variant.quantity > 0
                      ? 'border-fh-charcoal-light text-fh-offwhite'
                      : 'border-fh-charcoal-light/30 text-fh-muted line-through cursor-not-allowed'
                  }`}
                >
                  {variant.size}
                </span>
              ))}
            </div>
          </div>
        )}

        {description && (
          <div className="space-y-2">
            <p className="text-fh-muted text-xs uppercase tracking-widest">Descripcion</p>
            <p className="text-fh-offwhite/80 text-sm leading-relaxed">{description}</p>
          </div>
        )}

        <Button
          variant="primary"
          size="lg"
          fullWidth
          onClick={handleContact}
          disabled={!canPurchase}
          aria-disabled={!canPurchase}
        >
          {canPurchase ? 'Consultar por WhatsApp' : 'Producto agotado'}
        </Button>
      </div>
    </div>
  );
}
