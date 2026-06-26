import { Link } from 'react-router-dom';
import { Button } from '../components/ui/Button';

export function NotFoundPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 text-center">
      <p className="text-fh-gold text-xs tracking-[0.4em] uppercase mb-4">404</p>
      <h1 className="font-display text-5xl font-bold text-fh-offwhite mb-4">
        Página no encontrada
      </h1>
      <p className="text-fh-muted text-sm mb-10 max-w-sm">
        La página que buscas no existe o fue movida.
      </p>
      <Link to="/">
        <Button variant="primary">Volver al inicio</Button>
      </Link>
    </div>
  );
}
