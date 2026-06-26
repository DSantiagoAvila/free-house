# FREE HOUSE

> Plataforma E-commerce de Moda Masculina

Free House es una plataforma de comercio electrónico especializada en moda masculina. Construida con React + Vite en el frontend y NestJS + MySQL en el backend, ofrece un catálogo de productos con gestión de inventario, variantes de talla/color, e integración directa con canales de contacto (WhatsApp e Instagram).

---

## Stack Tecnológico

| Capa          | Tecnología           | Versión |
|---------------|----------------------|---------|
| Frontend      | React                | 18.x    |
| Frontend      | Vite                 | 5.x     |
| Frontend      | TailwindCSS          | 3.x     |
| Frontend      | React Query          | 5.x     |
| Frontend      | React Router DOM     | 6.x     |
| Backend       | NestJS               | 10.x    |
| Backend       | TypeORM              | 0.3.x   |
| Backend       | class-validator      | 0.14.x  |
| Base de datos | MySQL                | 8.x     |
| Runtime       | Node.js              | 20.x    |

---

## Prerequisitos

- **Node.js** 20 o superior
- **npm** 9 o superior
- **MySQL** 8.0 o superior (instancia local o remota)
- Git

---

## Inicio Rápido

### 1. Clonar el repositorio

```bash
git clone https://github.com/your-org/free-house.git
cd free_house
```

### 2. Configurar el backend

```bash
cd backend
cp .env.example .env
```

Editar `backend/.env` con las credenciales de la base de datos (ver sección [Variables de Entorno](#variables-de-entorno)).

```bash
npm install
```

### 3. Configurar el frontend

```bash
cd ../frontend
cp .env.example .env
```

Editar `frontend/.env` si se requiere una URL de API distinta a la predeterminada.

```bash
npm install
```

### 4. Ejecutar migraciones y seeds

```bash
cd ../backend
npm run migration:run
npm run seed:run
```

### 5. Iniciar ambos servidores

En terminales separadas:

```bash
# Terminal 1 — Backend
cd backend
npm run start:dev

# Terminal 2 — Frontend
cd frontend
npm run dev
```

- Backend: `http://localhost:3000`
- Frontend: `http://localhost:5173`

---

## Estructura del Proyecto

```
free_house/
├── backend/
│   ├── src/
│   │   ├── categories/        # Módulo de categorías
│   │   ├── contacts/          # Módulo de contacto (WhatsApp/Instagram)
│   │   ├── products/          # Módulo de productos y variantes
│   │   ├── database/
│   │   │   ├── migrations/    # Migraciones TypeORM
│   │   │   └── seeds/         # Seeds de datos iniciales
│   │   ├── common/            # DTOs, interceptores, filtros globales
│   │   └── main.ts
│   ├── .env.example
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/        # Componentes reutilizables
│   │   ├── pages/             # Páginas de la aplicación
│   │   ├── hooks/             # Custom hooks (React Query)
│   │   ├── services/          # Clientes HTTP (Axios)
│   │   ├── types/             # Tipos TypeScript
│   │   └── main.tsx
│   ├── .env.example
│   └── package.json
└── docs/
    ├── architecture.md
    ├── api.md
    ├── database.md
    ├── frontend.md
    └── roadmap.md
```

---

## Scripts Disponibles

### Backend

| Comando                    | Descripción                              |
|----------------------------|------------------------------------------|
| `npm run start:dev`        | Servidor en modo desarrollo (watch)      |
| `npm run start:prod`       | Servidor en modo producción              |
| `npm run build`            | Compilar TypeScript a JavaScript         |
| `npm run migration:run`    | Ejecutar migraciones pendientes          |
| `npm run migration:revert` | Revertir la última migración             |
| `npm run seed:run`         | Poblar la base de datos con datos base   |
| `npm run lint`             | Ejecutar ESLint                          |
| `npm run test`             | Ejecutar tests unitarios                 |

### Frontend

| Comando            | Descripción                           |
|--------------------|---------------------------------------|
| `npm run dev`      | Servidor de desarrollo con HMR        |
| `npm run build`    | Build de producción en `/dist`        |
| `npm run preview`  | Previsualizar el build de producción  |
| `npm run lint`     | Ejecutar ESLint                       |

---

## Endpoints de la API

Base URL: `http://localhost:3000/api/v1`

| Método | Path                                       | Descripción                      |
|--------|--------------------------------------------|----------------------------------|
| GET    | `/health`                                  | Health check del servidor        |
| GET    | `/products`                                | Listar productos (con filtros)   |
| GET    | `/products/:slug`                          | Obtener producto por slug        |
| POST   | `/products`                                | Crear nuevo producto             |
| PATCH  | `/products/:id/variants/:variantId/stock`  | Actualizar stock de una variante |
| GET    | `/categories`                              | Listar todas las categorías      |
| GET    | `/categories/:slug`                        | Obtener categoría por slug       |
| GET    | `/contacts`                                | Obtener información de contacto  |

Ver documentación completa en [`docs/api.md`](docs/api.md).

---

## Variables de Entorno

### Backend (`backend/.env`)

| Variable      | Descripción                      | Ejemplo                 |
|---------------|----------------------------------|-------------------------|
| `DB_HOST`     | Host de la base de datos MySQL   | `localhost`             |
| `DB_PORT`     | Puerto MySQL                     | `3306`                  |
| `DB_USERNAME` | Usuario MySQL                    | `root`                  |
| `DB_PASSWORD` | Contraseña MySQL                 | `secret`                |
| `DB_NAME`     | Nombre de la base de datos       | `free_house`            |
| `PORT`        | Puerto del servidor NestJS       | `3000`                  |
| `NODE_ENV`    | Entorno de ejecución             | `development`           |
| `CORS_ORIGIN` | Origen permitido para CORS       | `http://localhost:5173` |

### Frontend (`frontend/.env`)

| Variable            | Descripción            | Ejemplo                          |
|---------------------|------------------------|----------------------------------|
| `VITE_API_BASE_URL` | URL base de la API     | `http://localhost:3000/api/v1`   |

---

## Roadmap

| Fase   | Estado      | Descripción                                       |
|--------|-------------|---------------------------------------------------|
| Fase 1 | Completado  | MVP: catálogo, imágenes, inventario, contacto     |
| Fase 2 | Planificado | Autenticación JWT, panel admin, carga de imágenes |
| Fase 3 | Planificado | Carrito de compras, checkout, pasarela de pago    |
| Fase 4 | Planificado | Gestión de pedidos, perfiles, promociones         |
| Fase 5 | Planificado | Analytics, SEO avanzado, optimización             |

Ver detalles completos en [`docs/roadmap.md`](docs/roadmap.md).

---

## Contribución

1. Crear una rama desde `main`: `git checkout -b feature/nombre-feature`
2. Realizar los cambios y escribir tests si corresponde
3. Asegurarse de que `npm run lint` pase sin errores
4. Abrir un Pull Request con descripción clara del cambio

---

## Licencia

UNLICENSED — Todos los derechos reservados. Free House, 2024.
