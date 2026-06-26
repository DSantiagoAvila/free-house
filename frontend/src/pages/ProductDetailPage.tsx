import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useProduct } from '../hooks/useProduct';
import { formatPrice } from '../utils/format.utils';
import { InventoryBadge } from '../components/product/InventoryBadge';
import { Button } from '../components/ui/Button';
import { Spinner } from '../components/ui/Spinner';
import { env } from '../config/env';
import { contactsService } from '../services/contacts.service';
import { getProductInventoryStatus } from '../utils/inventory.utils';
import { getColorHex } from '../utils/format.utils';
import type { ProductVariant } from '../types/product.types';

export function ProductDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const { data: product, isLoading, isError } = useProduct(slug ?? '');

  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(null);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-16">
        <Spinner size="lg" />
      </div>
    );
  }

  if (isError || !product) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center pt-16 gap-4">
        <p className="text-fh-muted">No se encontró el producto.</p>
        <Link to="/catalogo" className="text-fh-gold text-sm hover:underline">
          Volver al catálogo
        </Link>
      </div>
    );
  }

  const primaryImage = product.images.find((img) => img.isPrimary) ?? product.images[0];
  const displayImage = product.images[selectedImage] ?? primaryImage;

  const sizes = [...new Set(product.variants.map((v) => v.size).filter(Boolean))];
  const colors = [...new Set(product.variants.map((v) => v.color).filter(Boolean))];

  const activeInventoryStatus = selectedVariant
    ? selectedVariant.inventoryStatus
    : getProductInventoryStatus(product.variants ?? []);

  const activePrice = selectedVariant?.priceOverride ?? product.price;
  const activeComparePrice = product.comparePrice;

  const waMessage = `Hola, estoy interesado en el producto: *${product.name}*${selectedVariant ? ` (${selectedVariant.size ?? ''} ${selectedVariant.color ?? ''})`.trim() : ''}. ¿Está disponible?`;
  const waUrl = contactsService.buildWhatsAppUrl(env.whatsappNumber, waMessage);

  return (
    <div className="pt-24 pb-20 px-6 max-w-7xl mx-auto">
      <nav className="flex items-center gap-2 text-xs text-fh-muted mb-8">
        <Link to="/" className="hover:text-fh-offwhite transition-colors">Inicio</Link>
        <span>/</span>
        <Link to="/catalogo" className="hover:text-fh-offwhite transition-colors">Catálogo</Link>
        <span>/</span>
        <span className="text-fh-offwhite truncate max-w-[200px]">{product.name}</span>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        <div className="space-y-4">
          <div className="aspect-[3/4] rounded-sm overflow-hidden bg-fh-charcoal-light">
            {displayImage ? (
              <img
                src={displayImage.url}
                alt={displayImage.altText || product.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <span className="font-display text-4xl text-fh-charcoal font-bold tracking-widest opacity-30">
                  FH
                </span>
              </div>
            )}
          </div>

          {product.images.length > 1 && (
            <div className="flex gap-3 overflow-x-auto pb-1">
              {product.images.map((img, idx) => (
                <button
                  key={img.id}
                  onClick={() => setSelectedImage(idx)}
                  className={`flex-shrink-0 w-16 h-20 rounded-sm overflow-hidden border-2 transition-colors ${
                    selectedImage === idx ? 'border-fh-gold' : 'border-transparent'
                  }`}
                >
                  <img
                    src={img.url}
                    alt={img.altText || product.name}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="space-y-6">
          {product.category && (
            <p className="text-fh-gold text-xs tracking-[0.3em] uppercase">
              {product.category.name}
            </p>
          )}

          <h1 className="font-display text-3xl md:text-4xl font-bold text-fh-offwhite leading-snug">
            {product.name}
          </h1>

          <div className="flex items-center gap-3">
            <span className="text-fh-gold text-2xl font-semibold">
              {formatPrice(activePrice)}
            </span>
            {activeComparePrice && activeComparePrice > activePrice && (
              <span className="text-fh-muted text-lg line-through">
                {formatPrice(activeComparePrice)}
              </span>
            )}
          </div>

          <InventoryBadge inventoryStatus={activeInventoryStatus} />

          {sizes.length > 0 && (
            <div className="space-y-3">
              <p className="text-fh-offwhite text-sm font-medium">Talla</p>
              <div className="flex flex-wrap gap-2">
                {sizes.map((size) => {
                  const variant = product.variants.find((v) => v.size === size);
                  const isSelected = selectedVariant?.size === size;
                  return (
                    <button
                      key={size}
                      onClick={() => setSelectedVariant(variant ?? null)}
                      className={`w-12 h-12 rounded-sm text-sm font-medium border transition-colors duration-200 ${
                        isSelected
                          ? 'bg-fh-gold text-fh-charcoal border-fh-gold'
                          : 'border-white/20 text-fh-muted hover:border-fh-gold hover:text-fh-offwhite'
                      }`}
                    >
                      {size}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {colors.length > 0 && (
            <div className="space-y-3">
              <p className="text-fh-offwhite text-sm font-medium">Color</p>
              <div className="flex flex-wrap gap-2">
                {colors.map((color) => {
                  const variant = product.variants.find((v) => v.color === color);
                  const isSelected = selectedVariant?.color === color;
                  return (
                    <button
                      key={color}
                      onClick={() => setSelectedVariant(variant ?? null)}
                      title={color ?? undefined}
                      className={`w-10 h-10 rounded-full border-2 transition-all duration-200 ${
                        isSelected ? 'border-fh-gold scale-110' : 'border-transparent hover:border-white/40'
                      }`}
                      style={{ backgroundColor: getColorHex(color ?? '') }}
                    />
                  );
                })}
              </div>
            </div>
          )}

          {product.description && (
            <div className="border-t border-white/10 pt-6">
              <p className="text-fh-muted text-sm leading-relaxed whitespace-pre-line">
                {product.description}
              </p>
            </div>
          )}

          <a href={waUrl} target="_blank" rel="noopener noreferrer" className="block">
            <Button
              variant="primary"
              fullWidth
              className="py-4 text-sm tracking-widest uppercase gap-3"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
              </svg>
              Consultar por WhatsApp
            </Button>
          </a>
        </div>
      </div>
    </div>
  );
}
