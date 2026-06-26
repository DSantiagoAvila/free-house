import { useState } from 'react';
import { useProducts } from '../hooks/useProducts';
import { useCategories } from '../hooks/useCategories';
import { ProductGrid } from '../components/product/ProductGrid';
import { Button } from '../components/ui/Button';

const PAGE_SIZE = 12;

export function CatalogPage() {
  const [selectedCategory, setSelectedCategory] = useState<string | undefined>(undefined);
  const [page, setPage] = useState(1);
  const [gender, setGender] = useState<'todos' | 'hombre' | 'mujer'>('todos');

  const { data: products, isLoading: productsLoading, isError, error } = useProducts({
    category: selectedCategory,
    page,
    limit: PAGE_SIZE,
    gender: gender === 'todos' ? undefined : gender,
  });

  const { data: categories } = useCategories();

  const totalPages = products?.meta?.totalPages ?? 1;

  function handleCategoryChange(slug: string | undefined) {
    setSelectedCategory(slug);
    setPage(1);
  }

  function handleGenderChange(g: 'todos' | 'hombre' | 'mujer') {
    setGender(g);
    setPage(1);
  }

  return (
    <div className="pt-24 pb-20 px-6 max-w-7xl mx-auto">
      <div className="mb-10">
        <p className="text-fh-gold text-xs tracking-[0.3em] uppercase mb-2">Colección</p>
        <h1 className="font-display text-4xl font-bold text-fh-offwhite">Catálogo</h1>
      </div>

      {/* Gender tabs */}
      <div className="flex gap-4 justify-center border-b border-white/10 pb-0 mb-10">
        {(['todos', 'hombre', 'mujer'] as const).map((g) => (
          <button
            key={g}
            onClick={() => handleGenderChange(g)}
            className={`pb-4 px-6 text-sm tracking-widest uppercase transition-colors duration-200 border-b-2 -mb-px ${
              gender === g
                ? 'border-fh-gold text-fh-offwhite font-semibold'
                : 'border-transparent text-fh-muted hover:text-fh-offwhite'
            }`}
          >
            {g === 'todos' ? 'Todos' : g.charAt(0).toUpperCase() + g.slice(1)}
          </button>
        ))}
      </div>

      <div className="flex flex-wrap gap-2 mb-10">
        <button
          onClick={() => handleCategoryChange(undefined)}
          className={`px-4 py-1.5 rounded-sm text-xs tracking-wide uppercase transition-colors duration-200 border ${
            !selectedCategory
              ? 'bg-fh-gold text-fh-charcoal border-fh-gold font-semibold'
              : 'border-white/20 text-fh-muted hover:border-fh-gold hover:text-fh-offwhite'
          }`}
        >
          Todos
        </button>
        {categories?.map((cat) => (
          <button
            key={cat.id}
            onClick={() => handleCategoryChange(cat.slug)}
            className={`px-4 py-1.5 rounded-sm text-xs tracking-wide uppercase transition-colors duration-200 border ${
              selectedCategory === cat.slug
                ? 'bg-fh-gold text-fh-charcoal border-fh-gold font-semibold'
                : 'border-white/20 text-fh-muted hover:border-fh-gold hover:text-fh-offwhite'
            }`}
          >
            {cat.name}
          </button>
        ))}
      </div>

      <ProductGrid
        products={products?.items}
        isLoading={productsLoading}
        isError={isError}
        errorMessage={(error as Error)?.message}
      />

      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-4 mt-12">
          <Button
            variant="secondary"
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className="px-6 py-2 text-xs tracking-widest uppercase"
          >
            Anterior
          </Button>
          <span className="text-fh-muted text-sm">
            {page} / {totalPages}
          </span>
          <Button
            variant="secondary"
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            className="px-6 py-2 text-xs tracking-widest uppercase"
          >
            Siguiente
          </Button>
        </div>
      )}
    </div>
  );
}
