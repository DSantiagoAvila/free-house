import { Button } from '../ui/Button';
import { InstagramLink } from './InstagramLink';
import { useContacts } from '../../hooks/useContacts';

export function ContactSection() {
  const { openWhatsApp } = useContacts();

  return (
    <section className="bg-fh-charcoal-light py-16 px-4">
      <div className="max-w-xl mx-auto text-center space-y-6">
        <h2 className="text-fh-offwhite text-2xl font-semibold tracking-tight">
          Tienes alguna pregunta?
        </h2>
        <p className="text-fh-muted text-sm leading-relaxed">
          Contactanos directamente por WhatsApp o siguenos en Instagram para ver las ultimas
          novedades.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Button variant="primary" size="md" onClick={() => openWhatsApp()}>
            Escribinos por WhatsApp
          </Button>
          <InstagramLink showLabel />
        </div>
      </div>
    </section>
  );
}
