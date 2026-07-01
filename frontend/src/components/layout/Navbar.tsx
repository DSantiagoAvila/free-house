import { useState, useEffect } from 'react';
import { Link, NavLink } from 'react-router-dom';

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const navLinkClass = ({ isActive }: { isActive: boolean }) =>
    `text-sm tracking-widest uppercase transition-colors duration-200 ${
      isActive ? 'text-fh-gold' : 'text-fh-muted hover:text-fh-offwhite'
    }`;

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? 'bg-fh-charcoal shadow-lg shadow-black/30' : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 group">
          <img
            src="/logo-free-house.jpeg"
            alt="Free House"
            className="h-10 w-auto object-contain"
          />
          <span className="font-display text-xl font-bold tracking-[0.2em] text-fh-offwhite uppercase">
            Free House
          </span>
          <span className="w-1.5 h-1.5 rounded-full bg-fh-gold mt-0.5" />
        </Link>

        <nav className="hidden md:flex items-center gap-8">
          <NavLink to="/" end className={navLinkClass}>
            Inicio
          </NavLink>
          <NavLink to="/catalogo" className={navLinkClass}>
            Catálogo
          </NavLink>
        </nav>

        <button
          className="md:hidden p-2 text-fh-muted hover:text-fh-offwhite transition-colors"
          onClick={() => setMenuOpen((v) => !v)}
          aria-label="Abrir menú"
        >
          {menuOpen ? (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 6 6 18M6 6l12 12" />
            </svg>
          ) : (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          )}
        </button>
      </div>

      {menuOpen && (
        <div className="md:hidden bg-fh-charcoal border-t border-white/10 px-6 py-4 flex flex-col gap-4">
          <NavLink to="/" end className={navLinkClass} onClick={() => setMenuOpen(false)}>
            Inicio
          </NavLink>
          <NavLink to="/catalogo" className={navLinkClass} onClick={() => setMenuOpen(false)}>
            Catálogo
          </NavLink>
        </div>
      )}
    </header>
  );
}
