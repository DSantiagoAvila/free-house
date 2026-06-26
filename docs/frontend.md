# Guía de Frontend — Free House

## Tecnologías

| Librería         | Versión | Propósito                                    |
|------------------|---------|----------------------------------------------|
| React            | 18.x    | UI declarativa con hooks                     |
| Vite             | 5.x     | Bundler y servidor de desarrollo             |
| TypeScript       | 5.x     | Tipado estático                              |
| TailwindCSS      | 3.x     | Estilos utilitarios                          |
| React Router DOM | 6.x     | Enrutamiento SPA                             |
| TanStack Query   | 5.x     | Gestión de estado del servidor y caché       |
| Axios            | 1.x     | Cliente HTTP                                 |

---

## Jerarquía de Componentes

```
App
├── Router
│   ├── Layout
│   │   ├── Navbar
│   │   │   ├── Logo
│   │   │   └── NavLinks
│   │   ├── <Outlet />        ← páginas renderizadas aquí
│   │   └── Footer
│   │       ├── SocialLinks
│   │       └── ContactButtons
│   │
│   └── Pages
│       ├── HomePage
│       │   ├── HeroBanner
│       │   ├── CategoryGrid
│       │   └── FeaturedProducts
│       │       └── ProductCard (x N)
│       ├── CatalogPage
│       │   ├── CategoryFilter
│       │   ├── SearchBar
│       │   ├── ProductGrid
│       │   │   └── ProductCard (x N)
│       │   └── Pagination
│       ├── ProductDetailPage
│       │   ├── ImageGallery
│       │   ├── ProductInfo
│       │   │   ├── ProductTitle
│       │   │   ├── PriceDisplay
│       │   │   ├── InventoryBadge
│       │   │   └── VariantSelector
│       │   └── ContactCTA
│       │       ├── WhatsAppButton
│       │       └── InstagramButton
│       └── NotFoundPage
│
└── QueryClientProvider
```

---

## Sistema de Diseño

### Paleta de Colores

Los colores de marca se definen como variables CSS en `src/index.css` y se extienden en `tailwind.config.ts`.

| Token         | Valor hexadecimal | Uso principal                                    |
|---------------|-------------------|--------------------------------------------------|
| `fh-charcoal` | `#1a1a1a`         | Fondo principal, texto sobre fondos claros       |
| `fh-gold`     | `#c9a96e`         | Acento de marca, CTAs, highlights                |
| `fh-offwhite` | `#f0ece4`         | Fondo de secciones alternas, tarjetas            |
| `fh-muted`    | `#8a8480`         | Textos secundarios, labels, placeholders         |

**Uso en Tailwind:**

```tsx
// Fondo charcoal con texto en gold
<div className="bg-fh-charcoal text-fh-gold">...</div>

// Sección con fondo off-white
<section className="bg-fh-offwhite">...</section>

// Texto secundario
<span className="text-fh-muted">Pocas unidades disponibles</span>
```

**Variables CSS (definidas en `index.css`):**

```css
:root {
  --color-fh-charcoal: #1a1a1a;
  --color-fh-gold:     #c9a96e;
  --color-fh-offwhite: #f0ece4;
  --color-fh-muted:    #8a8480;
}
```

### Tipografía

| Variable             | Fuente           | Uso                                      |
|----------------------|------------------|------------------------------------------|
| `font-body`          | Inter            | Cuerpo de texto, párrafos, labels        |
| `font-display`       | Playfair Display | Títulos, headings de sección, hero text  |

Las fuentes se cargan desde Google Fonts en `index.html`:

```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=Playfair+Display:wght@400;600;700&display=swap" rel="stylesheet">
```

Configuración en `tailwind.config.ts`:

```ts
fontFamily: {
  body:    ['Inter', 'sans-serif'],
  display: ['Playfair Display', 'serif'],
}
```

---

## Lógica de Display de Estado de Inventario

El componente `InventoryBadge` muestra el estado de disponibilidad de una variante usando el campo `inventory_status` devuelto por la API.

```tsx
type InventoryStatus = 'available' | 'low_stock' | 'out_of_stock';

const statusConfig: Record<InventoryStatus, { label: string; className: string }> = {
  available:     { label: 'Disponible',        className: 'bg-green-100 text-green-800' },
  low_stock:     { label: 'Pocas unidades',    className: 'bg-amber-100 text-amber-800' },
  out_of_stock:  { label: 'Sin stock',         className: 'bg-red-100 text-red-800'     },
};

function InventoryBadge({ status }: { status: InventoryStatus }) {
  const { label, className } = statusConfig[status];
  return (
    <span className={`inline-block rounded-full px-3 py-1 text-xs font-medium ${className}`}>
      {label}
    </span>
  );
}
```

**Regla adicional:** Si todos los `variants` de un producto tienen `inventory_status === 'out_of_stock'`, el botón de contacto se reemplaza por un mensaje de "Próximamente disponible".

---

## Integración con WhatsApp e Instagram

Los links de contacto se construyen dinámicamente con los datos devueltos por `GET /contacts`.

### WhatsApp

```tsx
function buildWhatsAppUrl(phoneNumber: string, productName: string): string {
  const message = encodeURIComponent(
    `Hola! Me interesa el producto: ${productName}. ¿Está disponible?`
  );
  // Remover caracteres no numéricos del número
  const cleanNumber = phoneNumber.replace(/\D/g, '');
  return `https://wa.me/${cleanNumber}?text=${message}`;
}

// Uso en componente
<a
  href={buildWhatsAppUrl(contact.value, product.name)}
  target="_blank"
  rel="noopener noreferrer"
  className="btn-primary bg-green-600 hover:bg-green-700"
>
  Consultar por WhatsApp
</a>
```

### Instagram

```tsx
function buildInstagramUrl(handle: string): string {
  // Remover @ si el value lo incluye
  const cleanHandle = handle.replace('@', '');
  return `https://instagram.com/${cleanHandle}`;
}
```

---

## Configuración de React Query

El `QueryClient` se configura en `src/main.tsx` con las opciones globales de la aplicación:

```tsx
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime:        1000 * 60 * 5,  // 5 minutos
      gcTime:           1000 * 60 * 10, // 10 minutos (ex cacheTime)
      retry:            2,
      refetchOnWindowFocus: false,
    },
  },
});
```

### Hooks de datos disponibles

Los hooks de React Query se ubican en `src/hooks/`:

```
src/hooks/
├── useProducts.ts        # GET /products con filtros y paginación
├── useProduct.ts         # GET /products/:slug
├── useCategories.ts      # GET /categories
├── useCategory.ts        # GET /categories/:slug
└── useContacts.ts        # GET /contacts
```

**Ejemplo de implementación:**

```ts
// src/hooks/useProducts.ts
import { useQuery } from '@tanstack/react-query';
import { getProducts } from '@/services/products.service';
import type { ProductFilters } from '@/types';

export function useProducts(filters: ProductFilters) {
  return useQuery({
    queryKey: ['products', filters],
    queryFn:  () => getProducts(filters),
  });
}
```

---

## Estructura de Enrutamiento

Las rutas se definen en `src/router.tsx` con React Router DOM v6:

```tsx
import { createBrowserRouter } from 'react-router-dom';
import Layout        from '@/components/Layout';
import HomePage      from '@/pages/HomePage';
import CatalogPage   from '@/pages/CatalogPage';
import ProductDetail from '@/pages/ProductDetailPage';
import NotFound      from '@/pages/NotFoundPage';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      { index: true,              element: <HomePage /> },
      { path: 'catalogo',         element: <CatalogPage /> },
      { path: 'productos/:slug',  element: <ProductDetail /> },
      { path: '*',                element: <NotFound /> },
    ],
  },
]);
```

| Ruta                    | Página              | Descripción                             |
|-------------------------|---------------------|-----------------------------------------|
| `/`                     | `HomePage`          | Hero, categorías destacadas y productos |
| `/catalogo`             | `CatalogPage`       | Catálogo completo con filtros           |
| `/catalogo?category=X`  | `CatalogPage`       | Catálogo filtrado por categoría         |
| `/productos/:slug`      | `ProductDetailPage` | Detalle de producto por slug            |

---

## Agregar una Nueva Página

1. Crear el archivo en `src/pages/NombrePagina.tsx`:

```tsx
export default function NombrePagina() {
  return (
    <main>
      <h1 className="font-display text-3xl text-fh-charcoal">Título</h1>
    </main>
  );
}
```

2. Agregar la ruta en `src/router.tsx`:

```tsx
{ path: 'mi-nueva-ruta', element: <NombrePagina /> },
```

3. Si requiere datos del servidor, crear el hook correspondiente en `src/hooks/`.

---

## Agregar un Nuevo Componente

1. Crear el archivo en `src/components/NombreComponente.tsx`.
2. Si el componente tiene variantes o estados complejos, definir los tipos en `src/types/`.
3. Exportar el componente con `export default` o `export` nombrado.
4. Importar con el alias `@/components/NombreComponente`.

El alias `@/` está configurado en `vite.config.ts` y `tsconfig.json`:

```ts
// vite.config.ts
resolve: {
  alias: {
    '@': path.resolve(__dirname, './src'),
  },
},
```

---

## Variables de Entorno

| Variable            | Descripción          | Valor por defecto               |
|---------------------|----------------------|---------------------------------|
| `VITE_API_BASE_URL` | URL base de la API   | `http://localhost:3000/api/v1`  |

Acceso en código:

```ts
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
```

Solo las variables prefijadas con `VITE_` son accesibles en el código del cliente. No incluir secrets en el `.env` del frontend.
