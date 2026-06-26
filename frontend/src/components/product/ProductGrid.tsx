import type { Product } from '../../types/product.types';
import { ProductCard } from './ProductCard';
import { Spinner } from '../ui/Spinner';

interface ProductGridProps {
  products?: Product[];
  isLoading: boolean;
  isError: boolean;
  errorMessage?: string;
}

function SkeletonCard() {
  return (
    <div className="bg-fh-charcoal-light rounded-sm overflow-hidden animate-pulse">
      <div className="aspect-[3/4] bg-white/5" />
      <div className="p-4 space-y-3">
        <div className="h-4 bg-white/5 rounded w-3/4" />
        <div className="h-4 bg-white/5 rounded w-1/3" />
        <div className="h-3 bg-white/5 rounded w-1/4" />
      </div>
    </div>
  );
}

export function ProductGrid({ products, isLoading, isError, errorMessage }: ProductGridProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
        {Array.from({ length: 8 }).map((_, i) => (
          <SkeletonCard key={i} />
        ))}
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-4">
        <p className="text-fh-muted text-sm">
          {errorMessage ?? 'Ocurrió un error al cargar los productos.'}
        </p>
      </div>
    );
  }

  if (!products || products.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <p className="text-fh-muted text-sm">No hay productos disponibles.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
