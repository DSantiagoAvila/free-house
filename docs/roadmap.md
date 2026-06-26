# Roadmap de Desarrollo — Free House

## Estado Actual

La Fase 1 (MVP) está completada. El catálogo de productos está operativo con gestión de inventario, galería de imágenes, integración con canales de contacto y diseño responsivo.

---

## Fase 1 — MVP (Completado)

**Objetivo:** Lanzar un catálogo online funcional que permita a los clientes explorar productos y contactar a la marca.

### Funcionalidades Incluidas

**Catálogo de Productos**
- Listado de productos con imagen principal, nombre, precio y estado de inventario
- Página de detalle de producto con galería de imágenes, descripción y variantes disponibles
- Filtrado por categoría
- Búsqueda por texto (nombre y descripción)
- Paginación del listado

**Gestión de Inventario**
- Variantes por talla y color con stock individual
- Estado automático: Disponible / Pocas unidades / Sin stock
- Actualización de stock por variante via API

**Diseño y Experiencia**
- Diseño responsivo (mobile-first)
- Sistema de colores y tipografía de marca
- Transiciones y estados de carga

**Canales de Contacto**
- Integración con WhatsApp (link directo con número configurable)
- Integración con Instagram (link al perfil)
- Información de contacto configurable desde base de datos

**Infraestructura**
- API REST versionada (`/api/v1/`)
- Soft delete en productos y categorías
- Rate limiting y cabeceras de seguridad
- Seeds para datos iniciales

---

## Fase 2 — Autenticación y Panel Administrativo (Planificado)

**Objetivo:** Permitir a los administradores gestionar el catálogo sin acceso directo a la base de datos.

### Funcionalidades Previstas

**Autenticación**
- Registro e inicio de sesión con email y contraseña
- JSON Web Tokens (JWT) con refresh tokens
- Roles: `admin` y `customer`
- Recuperación de contraseña por email

**Panel Administrativo**
- CRUD completo de productos (crear, editar, activar/desactivar, eliminar)
- CRUD de categorías
- Gestión de variantes y actualización de stock
- Vista de inventario con alertas de bajo stock

**Carga de Imágenes**
- Upload de imágenes al panel admin
- Almacenamiento en AWS S3 o Cloudinary
- Redimensionamiento automático (thumbnail, medium, original)
- Gestión de galería por producto (reordenar, eliminar)

### Dependencias Técnicas

- Módulo `AuthModule` con Passport.js y estrategia JWT
- Tabla `users` en base de datos
- Guards de autenticación y autorización en endpoints sensibles
- Multer para manejo de archivos en el backend
- SDK de AWS S3 o Cloudinary

---

## Fase 3 — Carrito de Compras y Checkout (Planificado)

**Objetivo:** Habilitar la compra directa desde la plataforma sin redirigir a canales externos.

### Funcionalidades Previstas

**Carrito de Compras**
- Agregar y quitar productos por variante
- Persistencia del carrito (localStorage + sincronización con backend si el usuario está autenticado)
- Actualización de cantidades
- Subtotal y cálculo de totales

**Checkout**
- Formulario de datos de envío
- Selección de método de envío
- Resumen del pedido antes de confirmar
- Validación de stock en tiempo real al confirmar

**Pasarela de Pago**
- Integración con MercadoPago (checkout pro o brick)
- Integración alternativa con Stripe (para pagos internacionales)
- Manejo de estados de pago: pendiente, aprobado, rechazado

### Dependencias Técnicas

- Tablas `orders` y `order_items` en base de datos
- SDK de MercadoPago o Stripe
- Webhooks para recepción de notificaciones de pago
- Transacciones de base de datos para garantizar consistencia de stock

---

## Fase 4 — Gestión de Pedidos y Perfiles (Planificado)

**Objetivo:** Brindar trazabilidad completa de pedidos y personalización de la experiencia del cliente.

### Funcionalidades Previstas

**Gestión de Pedidos**
- Panel admin con listado y filtros de pedidos
- Cambio de estado: pendiente, confirmado, en preparación, enviado, entregado
- Notificaciones por email al cliente en cada cambio de estado
- Historial de pedidos en el perfil del cliente

**Perfiles de Clientes**
- Página de perfil con datos personales editables
- Historial de compras
- Direcciones de envío guardadas

**Promociones y Descuentos**
- Cupones de descuento (porcentaje o monto fijo)
- Descuentos por categoría o producto específico
- Fechas de vigencia de promociones

### Dependencias Técnicas

- Servicio de email transaccional (SendGrid o Resend)
- Tablas de promociones y cupones en base de datos

---

## Fase 5 — Analytics, SEO y Performance (Planificado)

**Objetivo:** Optimizar la visibilidad orgánica y el rendimiento de la plataforma para escalar el tráfico.

### Funcionalidades Previstas

**Analytics**
- Integración con Google Analytics 4
- Dashboard interno con métricas básicas: vistas de producto, conversiones, productos más vistos
- Eventos de seguimiento: add to cart, checkout iniciado, compra completada

**SEO**
- Meta tags dinámicos por producto y categoría
- Sitemap XML generado automáticamente
- Open Graph tags para redes sociales
- URLs canónicas
- Schema.org markup (Product, BreadcrumbList)

**Performance**
- Lazy loading de imágenes con placeholder blur
- Optimización de imágenes con formato WebP
- Code splitting por ruta en el frontend
- Caché de respuestas de API con Redis
- Análisis y optimización de Core Web Vitals (LCP, CLS, FID)

### Dependencias Técnicas

- Redis para caching de API
- Biblioteca de meta tags para React (React Helmet o similar)
- Configuración de CDN para assets estáticos

---

## Resumen de Fases

| Fase   | Nombre                               | Estado      | Prioridad |
|--------|--------------------------------------|-------------|-----------|
| Fase 1 | MVP — Catálogo y Contacto            | Completado  | —         |
| Fase 2 | Autenticación y Panel Admin          | Planificado | Alta      |
| Fase 3 | Carrito, Checkout y Pagos            | Planificado | Alta      |
| Fase 4 | Pedidos, Perfiles y Promociones      | Planificado | Media     |
| Fase 5 | Analytics, SEO y Performance         | Planificado | Media     |
