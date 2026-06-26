# Diseño de Base de Datos — Free House

## Descripción General

La base de datos `free_house` en MySQL 8 almacena el catálogo de productos, categorías, variantes de inventario e información de contacto. El diseño prioriza integridad referencial y extensibilidad para las fases de carrito y pedidos previstas en el roadmap.

---

## Diagrama Entidad-Relación (ERD)

```
┌───────────────────┐       ┌─────────────────────────┐
│    categories     │       │        products          │
├───────────────────┤       ├─────────────────────────┤
│ id (PK)           │◄──────│ category_id (FK)         │
│ name              │       │ id (PK)                  │
│ slug (UNIQUE)     │       │ name                     │
│ description       │       │ slug (UNIQUE)            │
│ image_url         │       │ description              │
│ is_active         │       │ price                    │
│ created_at        │       │ compare_at_price         │
│ updated_at        │       │ is_active                │
│ deleted_at        │       │ created_at               │
└───────────────────┘       │ updated_at               │
                            │ deleted_at               │
                            └────────────┬────────────┘
                                         │
              ┌──────────────────────────┼───────────────────────────┐
              │                          │                           │
              ▼                          ▼                           │
┌──────────────────────────┐  ┌──────────────────────────┐          │
│    product_variants      │  │     product_images       │          │
├──────────────────────────┤  ├──────────────────────────┤          │
│ id (PK)                  │  │ id (PK)                  │          │
│ product_id (FK)          │  │ product_id (FK)          │          │
│ size                     │  │ url                      │          │
│ color                    │  │ alt_text                 │          │
│ sku (UNIQUE)             │  │ sort_order               │          │
│ stock_quantity           │  │ is_primary               │          │
│ inventory_status         │  │ created_at               │          │
│ created_at               │  └──────────────────────────┘          │
│ updated_at               │                                         │
└──────────────────────────┘                                         │
                                                                     │
┌──────────────────────────┐                                         │
│        contacts          │                                         │
├──────────────────────────┤                                         │
│ id (PK)                  │                                         │
│ type (whatsapp/instagram) │                                        │
│ value                    │                                         │
│ label                    │                                         │
│ is_active                │                                         │
│ created_at               │                                         │
│ updated_at               │                                         │
└──────────────────────────┘                                         │
                                                                     │
[Fase 3 — stub]                                                      │
┌───────────────┐  ┌───────────────┐  ┌─────────────────┐           │
│    orders     │  │  order_items  │  │      users      │           │
│  (pendiente)  │  │  (pendiente)  │  │   (pendiente)   │           │
└───────────────┘  └───────────────┘  └─────────────────┘           │
```

---

## Definición de Tablas

### `categories`

Almacena las categorías de productos del catálogo.

| Columna       | Tipo           | Constraints               | Descripción                        |
|---------------|----------------|---------------------------|------------------------------------|
| `id`          | INT UNSIGNED   | PK, AUTO_INCREMENT        | Identificador interno              |
| `name`        | VARCHAR(100)   | NOT NULL                  | Nombre visible de la categoría     |
| `slug`        | VARCHAR(120)   | NOT NULL, UNIQUE          | URL-friendly identifier            |
| `description` | TEXT           | NULL                      | Descripción opcional               |
| `image_url`   | VARCHAR(500)   | NULL                      | URL de imagen representativa       |
| `is_active`   | TINYINT(1)     | NOT NULL, DEFAULT 1       | Visibilidad en el catálogo         |
| `created_at`  | DATETIME       | NOT NULL, DEFAULT NOW()   | Fecha de creación                  |
| `updated_at`  | DATETIME       | NOT NULL, ON UPDATE NOW() | Fecha de última modificación       |
| `deleted_at`  | DATETIME       | NULL                      | Soft delete (NULL = activo)        |

### `products`

Almacena el catálogo principal de productos.

| Columna            | Tipo           | Constraints               | Descripción                          |
|--------------------|----------------|---------------------------|--------------------------------------|
| `id`               | INT UNSIGNED   | PK, AUTO_INCREMENT        | Identificador interno                |
| `category_id`      | INT UNSIGNED   | FK -> categories.id       | Categoría a la que pertenece         |
| `name`             | VARCHAR(200)   | NOT NULL                  | Nombre del producto                  |
| `slug`             | VARCHAR(220)   | NOT NULL, UNIQUE          | URL-friendly identifier              |
| `description`      | TEXT           | NULL                      | Descripción larga del producto       |
| `price`            | DECIMAL(10,2)  | NOT NULL                  | Precio de venta (ARS)                |
| `compare_at_price` | DECIMAL(10,2)  | NULL                      | Precio tachado (antes de descuento)  |
| `is_active`        | TINYINT(1)     | NOT NULL, DEFAULT 1       | Visibilidad en el catálogo           |
| `created_at`       | DATETIME       | NOT NULL, DEFAULT NOW()   | Fecha de creación                    |
| `updated_at`       | DATETIME       | NOT NULL, ON UPDATE NOW() | Fecha de última modificación         |
| `deleted_at`       | DATETIME       | NULL                      | Soft delete (NULL = activo)          |

### `product_variants`

Almacena las combinaciones de talla y color con su stock individual.

| Columna            | Tipo                                           | Constraints               | Descripción                        |
|--------------------|------------------------------------------------|---------------------------|------------------------------------|
| `id`               | INT UNSIGNED                                   | PK, AUTO_INCREMENT        | Identificador interno              |
| `product_id`       | INT UNSIGNED                                   | FK -> products.id         | Producto al que pertenece          |
| `size`             | VARCHAR(20)                                    | NOT NULL                  | Talla (S, M, L, XL, XXL, etc.)    |
| `color`            | VARCHAR(50)                                    | NOT NULL                  | Nombre del color                   |
| `sku`              | VARCHAR(100)                                   | UNIQUE, NULL              | Stock Keeping Unit                 |
| `stock_quantity`   | INT UNSIGNED                                   | NOT NULL, DEFAULT 0       | Unidades disponibles               |
| `inventory_status` | ENUM('available','low_stock','out_of_stock')   | NOT NULL                  | Estado calculado del inventario    |
| `created_at`       | DATETIME                                       | NOT NULL, DEFAULT NOW()   | Fecha de creación                  |
| `updated_at`       | DATETIME                                       | NOT NULL, ON UPDATE NOW() | Fecha de última modificación       |

### `product_images`

Almacena las imágenes asociadas a un producto.

| Columna      | Tipo         | Constraints               | Descripción                              |
|--------------|--------------|---------------------------|------------------------------------------|
| `id`         | INT UNSIGNED | PK, AUTO_INCREMENT        | Identificador interno                    |
| `product_id` | INT UNSIGNED | FK -> products.id         | Producto al que pertenece                |
| `url`        | VARCHAR(500) | NOT NULL                  | URL completa de la imagen                |
| `alt_text`   | VARCHAR(200) | NULL                      | Texto alternativo para accesibilidad     |
| `sort_order` | INT UNSIGNED | NOT NULL, DEFAULT 0       | Orden de aparición en la galería         |
| `is_primary` | TINYINT(1)   | NOT NULL, DEFAULT 0       | Imagen principal del producto (1 por prod)|
| `created_at` | DATETIME     | NOT NULL, DEFAULT NOW()   | Fecha de creación                        |

### `contacts`

Almacena los canales de contacto configurables (WhatsApp, Instagram).

| Columna      | Tipo                           | Constraints               | Descripción                         |
|--------------|--------------------------------|---------------------------|-------------------------------------|
| `id`         | INT UNSIGNED                   | PK, AUTO_INCREMENT        | Identificador interno               |
| `type`       | ENUM('whatsapp','instagram')   | NOT NULL                  | Tipo de canal                       |
| `value`      | VARCHAR(200)                   | NOT NULL                  | Número o handle del canal           |
| `label`      | VARCHAR(100)                   | NULL                      | Etiqueta visible (ej. "Ventas")     |
| `is_active`  | TINYINT(1)                     | NOT NULL, DEFAULT 1       | Visibilidad del contacto            |
| `created_at` | DATETIME                       | NOT NULL, DEFAULT NOW()   | Fecha de creación                   |
| `updated_at` | DATETIME                       | NOT NULL, ON UPDATE NOW() | Fecha de última modificación        |

---

## Estrategia de Índices

Los índices están diseñados para cubrir los patrones de consulta más frecuentes del catálogo.

| Tabla               | Índice                               | Tipo    | Justificación                               |
|---------------------|--------------------------------------|---------|---------------------------------------------|
| `categories`        | `slug`                               | UNIQUE  | Lookup por slug en rutas de categoría       |
| `categories`        | `is_active`                          | INDEX   | Filtro de categorías activas                |
| `categories`        | `deleted_at`                         | INDEX   | Filtro de soft delete en listados           |
| `products`          | `slug`                               | UNIQUE  | Lookup por slug en rutas de producto        |
| `products`          | `category_id`                        | INDEX   | Join frecuente con categorías               |
| `products`          | `is_active, deleted_at`              | INDEX   | Filtro compuesto en listado público         |
| `product_variants`  | `product_id`                         | INDEX   | Join frecuente al cargar variantes          |
| `product_variants`  | `sku`                                | UNIQUE  | Búsqueda por SKU en gestión de inventario   |
| `product_variants`  | `inventory_status`                   | INDEX   | Filtro por disponibilidad                   |
| `product_images`    | `product_id, sort_order`             | INDEX   | Carga ordenada de imágenes por producto     |
| `product_images`    | `is_primary`                         | INDEX   | Selección rápida de imagen principal        |

---

## Estrategia de Soft Delete

Las tablas `categories` y `products` implementan soft delete mediante la columna `deleted_at` de tipo DATETIME (NULL por defecto).

**Comportamiento:**
- Un registro con `deleted_at = NULL` está activo.
- Un registro con `deleted_at = <timestamp>` está eliminado lógicamente y no aparece en consultas públicas.
- TypeORM gestiona el soft delete automáticamente a través del decorador `@DeleteDateColumn()`.
- Las consultas deben incluir siempre `WHERE deleted_at IS NULL` en el WHERE o usar el método `softDelete()` de TypeORM.

Las tablas `product_variants` y `product_images` no implementan soft delete: se eliminan físicamente al eliminar el producto padre.

---

## Lógica de Estado de Inventario

La columna `inventory_status` en `product_variants` se actualiza automáticamente mediante un hook `@BeforeInsert` / `@BeforeUpdate` en la entidad TypeORM.

| Estado           | Condición                         | Label visible      |
|------------------|-----------------------------------|--------------------|
| `available`      | `stock_quantity > 5`              | Disponible         |
| `low_stock`      | `1 <= stock_quantity <= 5`        | Pocas unidades     |
| `out_of_stock`   | `stock_quantity === 0`            | Sin stock          |

Los umbrales (5 unidades para `low_stock`) son constantes definidas en el servicio de productos y pueden ajustarse sin modificar el esquema de base de datos.

```typescript
// Ejemplo de lógica de cálculo
function calculateInventoryStatus(quantity: number): InventoryStatus {
  if (quantity === 0) return InventoryStatus.OUT_OF_STOCK;
  if (quantity <= 5)  return InventoryStatus.LOW_STOCK;
  return InventoryStatus.AVAILABLE;
}
```

---

## Tablas Stub para Fases Futuras

Las siguientes tablas están previstas en el roadmap pero aún no implementadas. Se documentan aquí para preservar las decisiones de diseño tomadas anticipadamente.

### `users` (Fase 2)

| Columna        | Tipo         | Descripción                        |
|----------------|--------------|------------------------------------|
| `id`           | INT UNSIGNED | PK                                 |
| `email`        | VARCHAR(200) | UNIQUE, credencial de acceso       |
| `password_hash`| VARCHAR(255) | Hash bcrypt                        |
| `role`         | ENUM         | `admin`, `customer`                |
| `created_at`   | DATETIME     |                                    |

### `orders` (Fase 3)

| Columna        | Tipo           | Descripción                        |
|----------------|----------------|------------------------------------|
| `id`           | INT UNSIGNED   | PK                                 |
| `user_id`      | INT UNSIGNED   | FK -> users.id                     |
| `status`       | ENUM           | `pending`, `confirmed`, `shipped`  |
| `total_amount` | DECIMAL(10,2)  | Total de la orden                  |
| `created_at`   | DATETIME       |                                    |

### `order_items` (Fase 3)

| Columna      | Tipo           | Descripción                         |
|--------------|----------------|-------------------------------------|
| `id`         | INT UNSIGNED   | PK                                  |
| `order_id`   | INT UNSIGNED   | FK -> orders.id                     |
| `variant_id` | INT UNSIGNED   | FK -> product_variants.id           |
| `quantity`   | INT UNSIGNED   | Cantidad solicitada                 |
| `unit_price` | DECIMAL(10,2)  | Precio al momento de la compra      |

---

## Estrategia de Migraciones

Las migraciones se gestionan con TypeORM CLI y se almacenan en `backend/src/database/migrations/`.

**Convenciones:**
- Nombre de archivo: `<timestamp>-<descripcion-kebab-case>.ts`  
  Ejemplo: `1700000000000-create-products-table.ts`
- Nunca modificar una migración ya ejecutada en producción. Crear una nueva migración correctiva.
- Las migraciones se ejecutan manualmente con `npm run migration:run` antes de cada despliegue.
- `synchronize: false` en TypeORM es obligatorio en todos los entornos para prevenir sincronizaciones automáticas destructivas.

**Flujo de trabajo para cambios de esquema:**

```bash
# 1. Generar migración desde cambios en entidades
npm run migration:generate -- src/database/migrations/nombre-cambio

# 2. Revisar el archivo generado antes de ejecutar
# 3. Ejecutar en desarrollo
npm run migration:run

# 4. Revertir si hay errores
npm run migration:revert
```
