import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useProducts } from '../hooks/useProducts';
import { ProductGrid } from '../components/product/ProductGrid';
import { Button } from '../components/ui/Button';

export function HomePage() {
  const [gender, setGender] = useState<'todos' | 'hombre' | 'mujer'>('todos');
  const { data, isLoading, isError, error } = useProducts({ limit: 8, gender: gender === 'todos' ? undefined : gender });

  return (
    <>
      <section className="relative min-h-screen flex items-center justify-center bg-fh-charcoal overflow-hidden">
        <div
          className="absolute inset-0 bg-gradient-to-b from-transparent via-fh-charcoal/60 to-fh-charcoal"
          aria-hidden="true"
        />
        <div className="relative z-10 text-center px-6 max-w-3xl mx-auto">
          <p className="text-fh-gold text-xs tracking-[0.4em] uppercase mb-4 font-medium">
            Moda & Estilo
          </p>
          <h1 className="font-display text-6xl md:text-8xl font-bold tracking-[0.15em] text-fh-offwhite uppercase leading-none mb-6">
            Free<br />House
          </h1>
          <p className="text-fh-muted text-base md:text-lg leading-relaxed mb-10 max-w-md mx-auto">
            Prendas de calidad premium para el hombre y la mujer contemporáneos.
          </p>
          <Link to="/catalogo">
            <Button variant="primary" className="px-10 py-4 text-sm tracking-widest uppercase">
              Ver Catálogo
            </Button>
          </Link>
        </div>
      </section>

      {/* Gender tabs */}
      <section className="py-8 px-6 max-w-7xl mx-auto">
        <div className="flex gap-4 justify-center border-b border-white/10 pb-0">
          {(['todos', 'hombre', 'mujer'] as const).map((g) => (
            <button
              key={g}
              onClick={() => setGender(g)}
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
      </section>

      <section className="py-20 px-6 max-w-7xl mx-auto">
        <div className="flex items-end justify-between mb-10">
          <div>
            <p className="text-fh-gold text-xs tracking-[0.3em] uppercase mb-2">Selección</p>
            <h2 className="font-display text-3xl font-bold text-fh-offwhite">
              Destacados
            </h2>
          </div>
          <Link
            to="/catalogo"
            className="text-fh-muted text-sm hover:text-fh-gold transition-colors duration-200 tracking-wide hidden md:block"
          >
            Ver todo &rarr;
          </Link>
        </div>

        <ProductGrid
          products={data?.items}
          isLoading={isLoading}
          isError={isError}
          errorMessage={(error as Error)?.message}
        />

        <div className="mt-10 text-center md:hidden">
          <Link to="/catalogo">
            <Button variant="secondary">Ver catálogo completo</Button>
          </Link>
        </div>
      </section>
    </>
  );
}
