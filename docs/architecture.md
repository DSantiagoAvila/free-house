# Arquitectura del Sistema — Free House

## Visión General

Free House sigue una arquitectura cliente-servidor de dos capas con separación clara entre el frontend (SPA React) y el backend (API REST NestJS). La base de datos MySQL corre de forma independiente y es accedida exclusivamente a través del backend.

```
┌─────────────────────────────────────────────────────────┐
│                      CLIENTE                            │
│                                                         │
│   React SPA (Vite)         :5173                        │
│   ┌─────────────────────────────────────────────┐       │
│   │  React Router  │  React Query  │  Axios     │       │
│   └─────────────────────────────────────────────┘       │
└───────────────────────────┬─────────────────────────────┘
                            │ HTTP/JSON (REST)
                            │ CORS: localhost:5173
                            ▼
┌─────────────────────────────────────────────────────────┐
│                      BACKEND                            │
│                                                         │
│   NestJS API               :3000/api/v1                 │
│   ┌──────────┬─────────────┬───────────┬─────────────┐  │
│   │ Products │  Categories │  Contacts │   Health    │  │
│   └──────────┴─────────────┴───────────┴─────────────┘  │
│   ┌─────────────────────────────────────────────────┐    │
│   │  Helmet │ CORS │ ValidationPipe │ Rate Limiting │    │
│   └─────────────────────────────────────────────────┘    │
│   ┌─────────────────────────────────────────────────┐    │
│   │               TypeORM                           │    │
│   └─────────────────────────────────────────────────┘    │
└───────────────────────────┬─────────────────────────────┘
                            │ TCP :3306
                            ▼
┌─────────────────────────────────────────────────────────┐
│                  BASE DE DATOS                          │
│                                                         │
│   MySQL 8.x                :3306                        │
│   ┌──────────┬──────────┬────────────┬──────────────┐   │
│   │ products │categories│  variants  │   contacts   │   │
│   └──────────┴──────────┴────────────┴──────────────┘   │
└─────────────────────────────────────────────────────────┘
```

---

## Decisiones Tecnológicas

### Frontend: React + Vite

**Decisión:** React 18 con Vite como bundler.

**Justificación:**
- Vite ofrece Hot Module Replacement (HMR) de alta velocidad, reduciendo drásticamente el tiempo de feedback durante el desarrollo.
- React 18 introduce mejoras de concurrencia que preparan la aplicación para features como Suspense y streaming SSR en fases futuras.
- El ecosistema de React garantiza disponibilidad de librerías para cualquier requerimiento futuro (carrito, pagos, auth).

### Backend: NestJS

**Decisión:** NestJS como framework de Node.js.

**Justificación:**
- Arquitectura modular con inyección de dependencias nativa, que facilita escalar el proyecto agregando módulos independientes.
- Integración nativa con TypeORM y class-validator, reduciendo el boilerplate para validación y persistencia.
- Decoradores y estructura opinada que produce código consistente entre diferentes desarrolladores.

### Base de Datos: MySQL 8

**Decisión:** MySQL 8 con TypeORM.

**Justificación:**
- Alta compatibilidad con hosting compartido y proveedores cloud de bajo costo (PlanetScale, Railway, AWS RDS).
- Soporte robusto para transacciones ACID, necesario para gestión de inventario y pedidos en fases futuras.
- TypeORM abstrae el dialecto SQL, permitiendo migrar a PostgreSQL en el futuro con cambios mínimos.

### Gestión de Estado del Cliente: React Query

**Decisión:** TanStack Query (React Query) para el estado del servidor.

**Justificación:**
- Manejo automático de caché, loading, error y refetch, eliminando la necesidad de Redux o Context para datos remotos.
- Stale-while-revalidate por defecto, que mejora la percepción de rendimiento para el usuario final.
- Deduplicación automática de requests concurrentes.

---

## Grafo de Dependencias de Módulos (Backend)

```
AppModule
├── ProductsModule
│   ├── ProductsController
│   ├── ProductsService
│   └── Entities: Product, ProductVariant, ProductImage
├── CategoriesModule
│   ├── CategoriesController
│   ├── CategoriesService
│   └── Entity: Category
├── ContactsModule
│   ├── ContactsController
│   ├── ContactsService
│   └── Entity: Contact
└── DatabaseModule (TypeORM)
    └── MySQL Connection
```

Cada módulo de dominio es autónomo: define sus propias entidades, servicio y controlador. Los módulos no se importan entre sí directamente; las relaciones entre entidades se gestionan a través de TypeORM joins.

---

## Estrategia de Versionado de la API

Todos los endpoints están prefijados con `/api/v1/`. Este prefijo se configura globalmente en `main.ts` mediante `app.setGlobalPrefix('api/v1')`.

**Política de versiones:**
- La versión actual (`v1`) permanece estable mientras no haya breaking changes.
- Cuando un cambio rompa la compatibilidad con clientes existentes, se creará `/api/v2/` en paralelo.
- Las versiones antiguas se mantienen con un período de deprecación mínimo de 3 meses antes de ser eliminadas.

---

## Formato de Respuesta (Envelope)

Todas las respuestas de la API siguen un formato de envelope consistente aplicado a través de un `ResponseInterceptor` global.

### Respuesta exitosa

```json
{
  "success": true,
  "data": { ... },
  "meta": {
    "page": 1,
    "limit": 12,
    "total": 48,
    "totalPages": 4
  }
}
```

El campo `meta` se incluye únicamente en endpoints paginados. Para recursos individuales, `data` contiene el objeto directamente.

### Respuesta de error

```json
{
  "success": false,
  "error": {
    "code": "PRODUCT_NOT_FOUND",
    "message": "No se encontró un producto con el slug proporcionado.",
    "statusCode": 404
  }
}
```

---

## Configuración de CORS

CORS se configura en `main.ts` usando el módulo nativo de NestJS:

```typescript
app.enableCors({
  origin: process.env.CORS_ORIGIN,
  methods: ['GET', 'POST', 'PATCH', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
});
```

En producción, `CORS_ORIGIN` debe establecerse con el dominio exacto del frontend desplegado. No se permite el wildcard `*` en producción.

---

## Rate Limiting

El backend aplica rate limiting global mediante el throttler de NestJS:

| Parámetro | Valor       |
|-----------|-------------|
| Ventana   | 60 segundos |
| Límite    | 100 requests por IP por ventana |
| Respuesta | `HTTP 429 Too Many Requests` |

La configuración se realiza en `AppModule` con `ThrottlerModule.forRoot()`.

---

## Cabeceras de Seguridad (Helmet)

Helmet se aplica globalmente en `main.ts` (`app.use(helmet())`). Las cabeceras configuradas incluyen:

| Cabecera                        | Propósito                                            |
|---------------------------------|------------------------------------------------------|
| `Content-Security-Policy`       | Restringe fuentes de scripts, estilos e imágenes     |
| `X-Content-Type-Options`        | Previene MIME sniffing                               |
| `X-Frame-Options`               | Previene clickjacking                                |
| `Strict-Transport-Security`     | Fuerza HTTPS en producción                           |
| `X-XSS-Protection`              | Activación de protección XSS del navegador           |

---

## Estrategia de Conexión a la Base de Datos

TypeORM se configura con un único pool de conexiones. Los parámetros relevantes son:

```typescript
TypeOrmModule.forRoot({
  type: 'mysql',
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  synchronize: false,        // NUNCA true en producción
  logging: process.env.NODE_ENV === 'development',
  migrations: ['dist/database/migrations/*.js'],
  migrationsRun: false,      // Las migraciones se ejecutan manualmente
})
```

`synchronize: false` es obligatorio en producción. Los cambios de esquema se gestionan exclusivamente a través de migraciones versionadas.

---

## Notas de Escalabilidad Futura

| Escenario                  | Estrategia recomendada                                             |
|----------------------------|--------------------------------------------------------------------|
| Alto tráfico de lectura    | Agregar capa de caché con Redis (NestJS CacheModule)              |
| Almacenamiento de imágenes | Migrar a S3 o Cloudinary en Fase 2                                |
| Autenticación              | Módulo `AuthModule` con Passport.js y JWT en Fase 2               |
| Múltiples entornos         | Docker Compose para desarrollo; ECS o Railway para producción     |
| Colas de trabajo           | BullMQ con Redis para notificaciones y procesamiento asíncrono    |
