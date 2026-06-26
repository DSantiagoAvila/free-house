# Referencia de API — Free House

## Base URL

```
http://localhost:3000/api/v1
```

En producción, reemplazar con el dominio del servidor desplegado.

---

## Formato de Respuesta

Todas las respuestas siguen un envelope consistente.

### Respuesta exitosa (recurso único)

```json
{
  "success": true,
  "data": { }
}
```

### Respuesta exitosa (colección paginada)

```json
{
  "success": true,
  "data": [ ],
  "meta": {
    "page": 1,
    "limit": 12,
    "total": 48,
    "totalPages": 4
  }
}
```

### Respuesta de error

```json
{
  "success": false,
  "error": {
    "code": "RESOURCE_NOT_FOUND",
    "message": "Descripción del error.",
    "statusCode": 404
  }
}
```

---

## Códigos de Error

| Código HTTP | Error Code              | Descripción                                        |
|-------------|-------------------------|----------------------------------------------------|
| 400         | `VALIDATION_ERROR`      | El body o query params no cumplen las validaciones |
| 404         | `PRODUCT_NOT_FOUND`     | Producto no encontrado por slug o ID               |
| 404         | `CATEGORY_NOT_FOUND`    | Categoría no encontrada por slug                   |
| 404         | `VARIANT_NOT_FOUND`     | Variante no encontrada para el producto dado       |
| 409         | `SLUG_ALREADY_EXISTS`   | El slug proporcionado ya está en uso               |
| 429         | `RATE_LIMIT_EXCEEDED`   | Se superó el límite de 100 requests por minuto     |
| 500         | `INTERNAL_SERVER_ERROR` | Error inesperado del servidor                      |

---

## Endpoints

---

### Health Check

#### `GET /health`

Verifica que el servidor y la conexión a la base de datos están operativos.

**Parámetros:** ninguno.

**Respuesta exitosa `200 OK`**

```json
{
  "success": true,
  "data": {
    "status": "ok",
    "database": "connected",
    "timestamp": "2024-11-15T14:30:00.000Z"
  }
}
```

---

### Productos

#### `GET /products`

Retorna una lista paginada de productos activos. Soporta filtrado por categoría y búsqueda por texto.

**Query Parameters**

| Parámetro  | Tipo   | Requerido | Default | Descripción                                   |
|------------|--------|-----------|---------|-----------------------------------------------|
| `page`     | number | No        | `1`     | Número de página (>= 1)                       |
| `limit`    | number | No        | `12`    | Items por página (1–100)                      |
| `category` | string | No        | —       | Slug de la categoría para filtrar             |
| `search`   | string | No        | —       | Texto para búsqueda en nombre y descripción   |

**Respuesta exitosa `200 OK`**

```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "name": "Remera Oversize Essential",
      "slug": "remera-oversize-essential",
      "price": "12500.00",
      "compare_at_price": "15000.00",
      "category": {
        "id": 2,
        "name": "Remeras",
        "slug": "remeras"
      },
      "primaryImage": {
        "url": "https://cdn.example.com/products/remera-essential-01.jpg",
        "alt_text": "Remera Oversize Essential color negro"
      },
      "inventoryStatus": "available"
    }
  ],
  "meta": {
    "page": 1,
    "limit": 12,
    "total": 36,
    "totalPages": 3
  }
}
```

---

#### `GET /products/:slug`

Retorna un producto por su slug, incluyendo todas sus variantes e imágenes.

**Path Parameters**

| Parámetro | Tipo   | Descripción          |
|-----------|--------|----------------------|
| `slug`    | string | Slug único del producto |

**Respuesta exitosa `200 OK`**

```json
{
  "success": true,
  "data": {
    "id": 1,
    "name": "Remera Oversize Essential",
    "slug": "remera-oversize-essential",
    "description": "Remera de algodón 100% peinado con corte oversize...",
    "price": "12500.00",
    "compare_at_price": "15000.00",
    "category": {
      "id": 2,
      "name": "Remeras",
      "slug": "remeras"
    },
    "images": [
      {
        "id": 1,
        "url": "https://cdn.example.com/products/remera-essential-01.jpg",
        "alt_text": "Remera Oversize Essential color negro",
        "sort_order": 0,
        "is_primary": true
      }
    ],
    "variants": [
      {
        "id": 1,
        "size": "M",
        "color": "Negro",
        "sku": "REM-OVR-ESS-M-NEG",
        "stock_quantity": 10,
        "inventory_status": "available"
      },
      {
        "id": 2,
        "size": "L",
        "color": "Negro",
        "sku": "REM-OVR-ESS-L-NEG",
        "stock_quantity": 3,
        "inventory_status": "low_stock"
      }
    ]
  }
}
```

**Respuesta de error `404 Not Found`**

```json
{
  "success": false,
  "error": {
    "code": "PRODUCT_NOT_FOUND",
    "message": "No se encontró un producto con el slug 'remera-inexistente'.",
    "statusCode": 404
  }
}
```

---

#### `POST /products`

Crea un nuevo producto con sus imágenes y variantes iniciales.

**Request Body**

```json
{
  "name": "Jogger Cargo Premium",
  "slug": "jogger-cargo-premium",
  "description": "Pantalón jogger con bolsillos cargo...",
  "price": 28000.00,
  "compare_at_price": 32000.00,
  "category_id": 3,
  "images": [
    {
      "url": "https://cdn.example.com/products/jogger-cargo-01.jpg",
      "alt_text": "Jogger Cargo Premium color gris",
      "sort_order": 0,
      "is_primary": true
    }
  ],
  "variants": [
    {
      "size": "S",
      "color": "Gris",
      "sku": "JOG-CRG-PRM-S-GRI",
      "stock_quantity": 8
    }
  ]
}
```

**Esquema de campos del body**

| Campo              | Tipo     | Requerido | Validación                           |
|--------------------|----------|-----------|--------------------------------------|
| `name`             | string   | Si        | minLength: 2, maxLength: 200         |
| `slug`             | string   | Si        | minLength: 2, maxLength: 220, unique |
| `description`      | string   | No        | maxLength: 5000                      |
| `price`            | number   | Si        | > 0                                  |
| `compare_at_price` | number   | No        | > price si se provee                 |
| `category_id`      | number   | Si        | Debe existir en categories           |
| `images`           | array    | No        | max 10 elementos                     |
| `images[].url`     | string   | Si        | URL válida, maxLength: 500           |
| `images[].alt_text`| string   | No        | maxLength: 200                       |
| `images[].sort_order` | number | No       | >= 0                                 |
| `images[].is_primary` | boolean | No      | Solo una imagen puede ser primary    |
| `variants`         | array    | No        | max 50 elementos                     |
| `variants[].size`  | string   | Si        | maxLength: 20                        |
| `variants[].color` | string   | Si        | maxLength: 50                        |
| `variants[].sku`   | string   | No        | maxLength: 100, unique               |
| `variants[].stock_quantity` | number | No | >= 0, default: 0              |

**Respuesta exitosa `201 Created`**

```json
{
  "success": true,
  "data": {
    "id": 15,
    "name": "Jogger Cargo Premium",
    "slug": "jogger-cargo-premium",
    "...": "..."
  }
}
```

---

#### `PATCH /products/:id/variants/:variantId/stock`

Actualiza el stock de una variante específica de un producto. El campo `inventory_status` se recalcula automáticamente.

**Path Parameters**

| Parámetro   | Tipo   | Descripción               |
|-------------|--------|---------------------------|
| `id`        | number | ID interno del producto   |
| `variantId` | number | ID interno de la variante |

**Request Body**

```json
{
  "stock_quantity": 15
}
```

| Campo            | Tipo   | Requerido | Validación |
|------------------|--------|-----------|------------|
| `stock_quantity` | number | Si        | >= 0, entero |

**Respuesta exitosa `200 OK`**

```json
{
  "success": true,
  "data": {
    "id": 2,
    "size": "L",
    "color": "Negro",
    "sku": "REM-OVR-ESS-L-NEG",
    "stock_quantity": 15,
    "inventory_status": "available"
  }
}
```

---

### Categorías

#### `GET /categories`

Retorna todas las categorías activas.

**Parámetros:** ninguno.

**Respuesta exitosa `200 OK`**

```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "name": "Buzos",
      "slug": "buzos",
      "description": "Buzos y hoodies de temporada",
      "image_url": "https://cdn.example.com/categories/buzos.jpg"
    },
    {
      "id": 2,
      "name": "Remeras",
      "slug": "remeras",
      "description": null,
      "image_url": null
    }
  ]
}
```

---

#### `GET /categories/:slug`

Retorna una categoría por su slug, incluyendo sus productos activos.

**Path Parameters**

| Parámetro | Tipo   | Descripción             |
|-----------|--------|-------------------------|
| `slug`    | string | Slug único de la categoría |

**Respuesta exitosa `200 OK`**

```json
{
  "success": true,
  "data": {
    "id": 2,
    "name": "Remeras",
    "slug": "remeras",
    "description": null,
    "image_url": null,
    "products": [
      {
        "id": 1,
        "name": "Remera Oversize Essential",
        "slug": "remera-oversize-essential",
        "price": "12500.00",
        "primaryImage": {
          "url": "https://cdn.example.com/products/remera-essential-01.jpg",
          "alt_text": "Remera Oversize Essential"
        },
        "inventoryStatus": "available"
      }
    ]
  }
}
```

---

### Contactos

#### `GET /contacts`

Retorna los canales de contacto activos (WhatsApp e Instagram).

**Parámetros:** ninguno.

**Respuesta exitosa `200 OK`**

```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "type": "whatsapp",
      "value": "+5491112345678",
      "label": "Ventas"
    },
    {
      "id": 2,
      "type": "instagram",
      "value": "@freehouse.ar",
      "label": "Free House"
    }
  ]
}
```
