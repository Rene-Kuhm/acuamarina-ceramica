# 🔌 API Reference - Aguamarina Mosaicos

> Documentación completa de la API REST, Endpoints, Webhooks y Eventos del Sistema

**API Version:** v1  
**Base URL (Producción):** `https://diligent-upliftment-production-54de.up.railway.app/api/v1`  
**Base URL (Local):** `http://localhost:3000/api/v1`  
**Swagger UI:** [https://diligent-upliftment-production-54de.up.railway.app/api-docs](https://diligent-upliftment-production-54de.up.railway.app/api-docs)

---

## 📑 Tabla de Contenidos

- [Autenticación](#-autenticación)
- [Productos](#-productos)
- [Categorías](#-categorías)
- [Pedidos (Orders)](#-pedidos-orders)
- [Clientes (Customers)](#-clientes-customers)
- [Usuarios (Users)](#-usuarios-users)
- [Reviews (Reseñas)](#-reviews-reseñas)
- [Upload (Imágenes)](#-upload-imágenes)
- [MercadoPago (Pagos)](#-mercadopago-pagos)
- [Newsletter](#-newsletter)
- [Contacto](#-contacto)
- [Estadísticas](#-estadísticas)
- [Exportación](#-exportación)
- [Health Checks](#-health-checks)
- [Webhooks](#-webhooks)
- [Eventos del Sistema](#-eventos-del-sistema)
- [Códigos de Error](#-códigos-de-error)

---

## 🔐 Autenticación

La API usa **JWT (JSON Web Tokens)** para autenticación. Todos los endpoints protegidos requieren un token en el header `Authorization`.

### Headers Requeridos

```http
Authorization: Bearer <access_token>
Content-Type: application/json
```

### POST /auth/login

Iniciar sesión y obtener tokens de acceso.

**Request:**
```json
POST /api/v1/auth/login
Content-Type: application/json

{
  "email": "admin@aguamarinamosaicos.com",
  "password": "Admin123!"
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": 1,
      "email": "admin@aguamarinamosaicos.com",
      "name": "Administrador",
      "role": "admin"
    }
  }
}
```

**Errores:**
- `401 Unauthorized` - Credenciales inválidas
- `400 Bad Request` - Email o password faltante

---

### POST /auth/register

Registrar un nuevo usuario (cliente).

**Request:**
```json
POST /api/v1/auth/register
Content-Type: application/json

{
  "email": "cliente@example.com",
  "password": "Password123!",
  "name": "Juan Pérez",
  "phone": "+5491123456789"
}
```

**Response (201 Created):**
```json
{
  "success": true,
  "data": {
    "id": 15,
    "email": "cliente@example.com",
    "name": "Juan Pérez",
    "role": "customer",
    "createdAt": "2025-12-13T10:30:00Z"
  }
}
```

---

### POST /auth/refresh

Refrescar el access token cuando expira.

**Request:**
```json
POST /api/v1/auth/refresh
Content-Type: application/json

{
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "expiresIn": "7d"
  }
}
```

---

### POST /auth/logout

Cerrar sesión e invalidar refresh token.

**Request:**
```json
POST /api/v1/auth/logout
Authorization: Bearer <access_token>

{
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Sesión cerrada exitosamente"
}
```

---

### GET /auth/me

Obtener información del usuario autenticado.

**Request:**
```http
GET /api/v1/auth/me
Authorization: Bearer <access_token>
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "email": "admin@aguamarinamosaicos.com",
    "name": "Administrador",
    "role": "admin",
    "phone": "+5491123456789",
    "createdAt": "2025-01-01T00:00:00Z"
  }
}
```

---

### PUT /auth/profile

Actualizar perfil del usuario autenticado.

**Request:**
```json
PUT /api/v1/auth/profile
Authorization: Bearer <access_token>
Content-Type: application/json

{
  "name": "Juan Pérez Actualizado",
  "phone": "+5491198765432"
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "id": 15,
    "email": "cliente@example.com",
    "name": "Juan Pérez Actualizado",
    "phone": "+5491198765432",
    "updatedAt": "2025-12-13T11:00:00Z"
  }
}
```

---

## 📦 Productos

### GET /products

Obtener listado de productos con paginación y filtros.

**Query Parameters:**
- `page` (number) - Número de página (default: 1)
- `limit` (number) - Items por página (default: 20, max: 100)
- `category` (string) - Filtrar por categoría (slug)
- `search` (string) - Búsqueda por nombre o descripción
- `minPrice` (number) - Precio mínimo
- `maxPrice` (number) - Precio máximo
- `sort` (string) - Ordenamiento: `name`, `price`, `created_at` (default: `created_at`)
- `order` (string) - Orden: `asc` o `desc` (default: `desc`)
- `isActive` (boolean) - Filtrar por activos/inactivos

**Request:**
```http
GET /api/v1/products?page=1&limit=20&category=mosaicos&sort=price&order=asc
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "name": "Mosaico Veneciano Azul",
      "slug": "mosaico-veneciano-azul",
      "sku": "MOS-001",
      "description": "Mosaico de vidrio veneciano color azul turquesa",
      "price": 2500.00,
      "stock": 150,
      "categoryId": 5,
      "categoryName": "Mosaicos",
      "categorySlug": "mosaicos",
      "isActive": true,
      "isFeatured": true,
      "images": [
        {
          "id": 1,
          "url": "https://res.cloudinary.com/ddztbf1se/image/upload/v1/products/mos-001-1.jpg",
          "isMain": true
        }
      ],
      "createdAt": "2025-10-01T10:00:00Z",
      "updatedAt": "2025-12-01T15:30:00Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 145,
    "totalPages": 8,
    "hasNextPage": true,
    "hasPrevPage": false
  }
}
```

---

### GET /products/destacados

Obtener productos destacados (featured).

**Request:**
```http
GET /api/v1/products/destacados
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "name": "Mosaico Veneciano Azul",
      "price": 2500.00,
      "images": [
        {
          "url": "https://res.cloudinary.com/...",
          "isMain": true
        }
      ]
    }
  ]
}
```

---

### GET /products/:id

Obtener un producto por ID.

**Request:**
```http
GET /api/v1/products/1
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "name": "Mosaico Veneciano Azul",
    "slug": "mosaico-veneciano-azul",
    "sku": "MOS-001",
    "description": "Mosaico de vidrio veneciano color azul turquesa. Ideal para baños y piscinas.",
    "price": 2500.00,
    "stock": 150,
    "dimensions": "30x30 cm",
    "material": "Vidrio",
    "categoryId": 5,
    "categoryName": "Mosaicos",
    "isActive": true,
    "isFeatured": true,
    "images": [
      {
        "id": 1,
        "url": "https://res.cloudinary.com/ddztbf1se/image/upload/v1/products/mos-001-1.jpg",
        "publicId": "products/mos-001-1",
        "isMain": true
      },
      {
        "id": 2,
        "url": "https://res.cloudinary.com/ddztbf1se/image/upload/v1/products/mos-001-2.jpg",
        "publicId": "products/mos-001-2",
        "isMain": false
      }
    ],
    "reviews": [
      {
        "id": 1,
        "rating": 5,
        "comment": "Excelente calidad!",
        "userName": "María González",
        "createdAt": "2025-11-15T10:00:00Z"
      }
    ],
    "averageRating": 4.8,
    "reviewsCount": 15,
    "createdAt": "2025-10-01T10:00:00Z",
    "updatedAt": "2025-12-01T15:30:00Z"
  }
}
```

**Errores:**
- `404 Not Found` - Producto no encontrado

---

### POST /products

Crear un nuevo producto.

**Acceso:** 🔒 Admin/Manager

**Request:**
```json
POST /api/v1/products
Authorization: Bearer <access_token>
Content-Type: application/json

{
  "name": "Mosaico Veneciano Verde",
  "description": "Mosaico de vidrio veneciano color verde esmeralda",
  "price": 2800.00,
  "stock": 100,
  "categoryId": 5,
  "dimensions": "30x30 cm",
  "material": "Vidrio",
  "isActive": true,
  "isFeatured": false,
  "images": [
    {
      "url": "https://res.cloudinary.com/ddztbf1se/image/upload/v1/products/mos-002-1.jpg",
      "publicId": "products/mos-002-1",
      "isMain": true
    }
  ]
}
```

**Response (201 Created):**
```json
{
  "success": true,
  "data": {
    "id": 2,
    "name": "Mosaico Veneciano Verde",
    "slug": "mosaico-veneciano-verde",
    "sku": "MOS-002",
    "price": 2800.00,
    "stock": 100,
    "categoryId": 5,
    "isActive": true,
    "createdAt": "2025-12-13T12:00:00Z"
  }
}
```

**Errores:**
- `401 Unauthorized` - No autenticado
- `403 Forbidden` - Sin permisos
- `400 Bad Request` - Datos inválidos
- `404 Not Found` - Categoría no encontrada

---

### PATCH /products/:id

Actualizar un producto existente.

**Acceso:** 🔒 Admin/Manager

**Request:**
```json
PATCH /api/v1/products/2
Authorization: Bearer <access_token>
Content-Type: application/json

{
  "price": 2600.00,
  "stock": 120,
  "isFeatured": true
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "id": 2,
    "name": "Mosaico Veneciano Verde",
    "price": 2600.00,
    "stock": 120,
    "isFeatured": true,
    "updatedAt": "2025-12-13T12:15:00Z"
  }
}
```

---

### DELETE /products/:id

Eliminar un producto (soft delete).

**Acceso:** 🔒 Admin

**Request:**
```http
DELETE /api/v1/products/2
Authorization: Bearer <access_token>
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Producto eliminado exitosamente"
}
```

**Errores:**
- `401 Unauthorized` - No autenticado
- `403 Forbidden` - Solo admin puede eliminar
- `404 Not Found` - Producto no encontrado

---

## 🏷️ Categorías

### GET /categories

Obtener todas las categorías (con jerarquía).

**Request:**
```http
GET /api/v1/categories
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "name": "Mosaicos",
      "slug": "mosaicos",
      "description": "Mosaicos de vidrio y cerámica",
      "parentId": null,
      "level": 0,
      "imageUrl": "https://res.cloudinary.com/.../categories/mosaicos.jpg",
      "isActive": true,
      "productsCount": 45,
      "subcategories": [
        {
          "id": 5,
          "name": "Mosaicos Venecianos",
          "slug": "mosaicos-venecianos",
          "parentId": 1,
          "level": 1,
          "productsCount": 15
        }
      ],
      "createdAt": "2025-01-01T00:00:00Z"
    }
  ]
}
```

---

### GET /categories/:id

Obtener una categoría por ID.

**Request:**
```http
GET /api/v1/categories/1
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "name": "Mosaicos",
    "slug": "mosaicos",
    "description": "Mosaicos de vidrio y cerámica de alta calidad",
    "parentId": null,
    "level": 0,
    "imageUrl": "https://res.cloudinary.com/.../categories/mosaicos.jpg",
    "isActive": true,
    "subcategories": [
      {
        "id": 5,
        "name": "Mosaicos Venecianos",
        "slug": "mosaicos-venecianos"
      }
    ],
    "products": [
      {
        "id": 1,
        "name": "Mosaico Veneciano Azul",
        "price": 2500.00
      }
    ]
  }
}
```

---

### POST /categories

Crear una nueva categoría.

**Acceso:** 🔒 Admin/Manager

**Request:**
```json
POST /api/v1/categories
Authorization: Bearer <access_token>
Content-Type: application/json

{
  "name": "Cerámicos de Piso",
  "description": "Cerámicos para pisos interiores y exteriores",
  "parentId": null,
  "imageUrl": "https://res.cloudinary.com/.../categories/ceramicos-piso.jpg",
  "isActive": true
}
```

**Response (201 Created):**
```json
{
  "success": true,
  "data": {
    "id": 10,
    "name": "Cerámicos de Piso",
    "slug": "ceramicos-de-piso",
    "parentId": null,
    "level": 0,
    "isActive": true,
    "createdAt": "2025-12-13T13:00:00Z"
  }
}
```

---

## 📋 Pedidos (Orders)

### POST /orders

Crear un nuevo pedido (público para clientes).

**Request:**
```json
POST /api/v1/orders
Content-Type: application/json

{
  "customerName": "Juan Pérez",
  "customerEmail": "juan@example.com",
  "customerPhone": "+5491123456789",
  "items": [
    {
      "productId": 1,
      "quantity": 5,
      "price": 2500.00
    },
    {
      "productId": 3,
      "quantity": 2,
      "price": 3200.00
    }
  ],
  "shippingAddress": {
    "street": "Av. Libertador 1234",
    "city": "Buenos Aires",
    "state": "CABA",
    "zipCode": "C1425",
    "country": "Argentina"
  },
  "notes": "Entregar en horario de tarde"
}
```

**Response (201 Created):**
```json
{
  "success": true,
  "data": {
    "id": 123,
    "orderNumber": "ORD-2025-123",
    "status": "pending",
    "paymentStatus": "pending",
    "customerName": "Juan Pérez",
    "customerEmail": "juan@example.com",
    "items": [
      {
        "id": 1,
        "productId": 1,
        "productName": "Mosaico Veneciano Azul",
        "quantity": 5,
        "price": 2500.00,
        "subtotal": 12500.00
      },
      {
        "id": 2,
        "productId": 3,
        "productName": "Cerámico Premium 60x60",
        "quantity": 2,
        "price": 3200.00,
        "subtotal": 6400.00
      }
    ],
    "subtotal": 18900.00,
    "shipping": 1500.00,
    "total": 20400.00,
    "shippingAddress": {
      "street": "Av. Libertador 1234",
      "city": "Buenos Aires",
      "state": "CABA",
      "zipCode": "C1425",
      "country": "Argentina"
    },
    "createdAt": "2025-12-13T14:00:00Z"
  }
}
```

---

### GET /orders

Obtener todos los pedidos (con paginación y filtros).

**Acceso:** 🔒 Admin/Manager

**Query Parameters:**
- `page` (number) - Página (default: 1)
- `limit` (number) - Items por página (default: 20)
- `status` (string) - Filtrar por estado: `pending`, `confirmed`, `shipped`, `delivered`, `cancelled`
- `paymentStatus` (string) - Filtrar por pago: `pending`, `completed`, `failed`, `refunded`
- `startDate` (ISO date) - Fecha inicio
- `endDate` (ISO date) - Fecha fin
- `search` (string) - Buscar por número de orden o email

**Request:**
```http
GET /api/v1/orders?page=1&limit=20&status=confirmed
Authorization: Bearer <access_token>
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": [
    {
      "id": 123,
      "orderNumber": "ORD-2025-123",
      "status": "confirmed",
      "paymentStatus": "completed",
      "customerName": "Juan Pérez",
      "customerEmail": "juan@example.com",
      "total": 20400.00,
      "itemsCount": 2,
      "createdAt": "2025-12-13T14:00:00Z",
      "paidAt": "2025-12-13T14:05:00Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 156,
    "totalPages": 8
  }
}
```

---

### GET /orders/stats

Obtener estadísticas de pedidos.

**Acceso:** 🔒 Admin/Manager

**Query Parameters:**
- `period` (string) - Período: `today`, `week`, `month`, `year` (default: `month`)

**Request:**
```http
GET /api/v1/orders/stats?period=month
Authorization: Bearer <access_token>
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "period": "month",
    "totalOrders": 145,
    "totalRevenue": 2850000.00,
    "averageOrderValue": 19655.17,
    "byStatus": {
      "pending": 12,
      "confirmed": 98,
      "shipped": 25,
      "delivered": 8,
      "cancelled": 2
    },
    "byPaymentStatus": {
      "pending": 12,
      "completed": 128,
      "failed": 3,
      "refunded": 2
    },
    "topProducts": [
      {
        "productId": 1,
        "productName": "Mosaico Veneciano Azul",
        "quantitySold": 450,
        "revenue": 1125000.00
      }
    ],
    "dailySales": [
      {
        "date": "2025-12-01",
        "orders": 5,
        "revenue": 95000.00
      }
    ]
  }
}
```

---

### GET /orders/:id

Obtener un pedido por ID.

**Acceso:** 🔒 Admin/Manager

**Request:**
```http
GET /api/v1/orders/123
Authorization: Bearer <access_token>
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "id": 123,
    "orderNumber": "ORD-2025-123",
    "status": "confirmed",
    "paymentStatus": "completed",
    "customerName": "Juan Pérez",
    "customerEmail": "juan@example.com",
    "customerPhone": "+5491123456789",
    "items": [
      {
        "id": 1,
        "productId": 1,
        "productName": "Mosaico Veneciano Azul",
        "quantity": 5,
        "price": 2500.00,
        "subtotal": 12500.00,
        "product": {
          "id": 1,
          "name": "Mosaico Veneciano Azul",
          "images": [
            {
              "url": "https://res.cloudinary.com/..."
            }
          ]
        }
      }
    ],
    "subtotal": 18900.00,
    "shipping": 1500.00,
    "tax": 0.00,
    "total": 20400.00,
    "shippingAddress": {
      "street": "Av. Libertador 1234",
      "city": "Buenos Aires",
      "state": "CABA",
      "zipCode": "C1425",
      "country": "Argentina"
    },
    "notes": "Entregar en horario de tarde",
    "mercadopagoPaymentId": "12345678",
    "mercadopagoPreferenceId": "987654321",
    "createdAt": "2025-12-13T14:00:00Z",
    "paidAt": "2025-12-13T14:05:00Z",
    "updatedAt": "2025-12-13T14:05:00Z"
  }
}
```

---

### PATCH /orders/:id/status

Actualizar estado de un pedido.

**Acceso:** 🔒 Admin/Manager

**Request:**
```json
PATCH /api/v1/orders/123/status
Authorization: Bearer <access_token>
Content-Type: application/json

{
  "status": "shipped",
  "notes": "Envío realizado por Andreani - Código de tracking: AR123456789"
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "id": 123,
    "orderNumber": "ORD-2025-123",
    "status": "shipped",
    "updatedAt": "2025-12-13T15:00:00Z"
  },
  "message": "Estado del pedido actualizado exitosamente"
}
```

**Estados válidos:**
- `pending` - Pendiente
- `confirmed` - Confirmado (después de pago)
- `processing` - En proceso
- `shipped` - Enviado
- `delivered` - Entregado
- `cancelled` - Cancelado

---

## 👥 Clientes (Customers)

### GET /customers

Obtener listado de clientes.

**Acceso:** 🔒 Admin/Manager

**Request:**
```http
GET /api/v1/customers?page=1&limit=20
Authorization: Bearer <access_token>
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "userId": 15,
      "name": "Juan Pérez",
      "email": "juan@example.com",
      "phone": "+5491123456789",
      "totalOrders": 8,
      "totalSpent": 145000.00,
      "lastOrderDate": "2025-12-10T10:00:00Z",
      "createdAt": "2025-05-01T00:00:00Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 450,
    "totalPages": 23
  }
}
```

---

### GET /customers/stats

Estadísticas de clientes.

**Acceso:** 🔒 Admin/Manager

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "totalCustomers": 450,
    "newCustomersThisMonth": 25,
    "activeCustomers": 380,
    "averageOrdersPerCustomer": 3.2,
    "averageLifetimeValue": 95000.00,
    "topCustomers": [
      {
        "id": 1,
        "name": "Juan Pérez",
        "totalOrders": 15,
        "totalSpent": 350000.00
      }
    ]
  }
}
```

---

### GET /customers/:id

Obtener un cliente por ID.

**Acceso:** 🔒 Admin/Manager

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "userId": 15,
    "name": "Juan Pérez",
    "email": "juan@example.com",
    "phone": "+5491123456789",
    "totalOrders": 8,
    "totalSpent": 145000.00,
    "orders": [
      {
        "id": 123,
        "orderNumber": "ORD-2025-123",
        "total": 20400.00,
        "status": "confirmed",
        "createdAt": "2025-12-13T14:00:00Z"
      }
    ],
    "addresses": [
      {
        "id": 1,
        "street": "Av. Libertador 1234",
        "city": "Buenos Aires",
        "state": "CABA",
        "zipCode": "C1425",
        "country": "Argentina",
        "isDefault": true
      }
    ],
    "createdAt": "2025-05-01T00:00:00Z"
  }
}
```

---

### GET /customers/:id/orders

Obtener historial de pedidos de un cliente.

**Acceso:** 🔒 Admin/Manager

**Response (200 OK):**
```json
{
  "success": true,
  "data": [
    {
      "id": 123,
      "orderNumber": "ORD-2025-123",
      "total": 20400.00,
      "status": "confirmed",
      "paymentStatus": "completed",
      "itemsCount": 2,
      "createdAt": "2025-12-13T14:00:00Z"
    }
  ]
}
```

---

## 👤 Usuarios (Users)

### GET /users

Obtener todos los usuarios (solo admins).

**Acceso:** 🔒 Admin

**Request:**
```http
GET /api/v1/users?page=1&limit=20&role=admin
Authorization: Bearer <access_token>
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "email": "admin@aguamarinamosaicos.com",
      "name": "Administrador",
      "role": "admin",
      "isActive": true,
      "lastLoginAt": "2025-12-13T09:00:00Z",
      "createdAt": "2025-01-01T00:00:00Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 3
  }
}
```

---

## ⭐ Reviews (Reseñas)

### GET /reviews/product/:productId

Obtener reseñas de un producto.

**Request:**
```http
GET /api/v1/reviews/product/1?page=1&limit=10
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "productId": 1,
      "userId": 15,
      "userName": "Juan Pérez",
      "rating": 5,
      "comment": "Excelente calidad! Muy recomendable.",
      "isVerifiedPurchase": true,
      "createdAt": "2025-11-15T10:00:00Z"
    }
  ],
  "stats": {
    "averageRating": 4.8,
    "totalReviews": 15,
    "ratingDistribution": {
      "5": 12,
      "4": 2,
      "3": 1,
      "2": 0,
      "1": 0
    }
  },
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 15
  }
}
```

---

### POST /reviews

Crear una reseña para un producto.

**Acceso:** 🔒 Autenticado

**Request:**
```json
POST /api/v1/reviews
Authorization: Bearer <access_token>
Content-Type: application/json

{
  "productId": 1,
  "rating": 5,
  "comment": "Producto de excelente calidad. Muy satisfecho con la compra."
}
```

**Response (201 Created):**
```json
{
  "success": true,
  "data": {
    "id": 16,
    "productId": 1,
    "userId": 15,
    "rating": 5,
    "comment": "Producto de excelente calidad. Muy satisfecho con la compra.",
    "isVerifiedPurchase": true,
    "createdAt": "2025-12-13T16:00:00Z"
  }
}
```

**Validaciones:**
- Solo se puede hacer una reseña por producto por usuario
- El rating debe ser entre 1 y 5
- El usuario debe haber comprado el producto

---

## 📷 Upload (Imágenes)

### POST /upload/product-image

Subir imagen de producto a Cloudinary.

**Acceso:** 🔒 Admin/Manager

**Request:**
```http
POST /api/v1/upload/product-image
Authorization: Bearer <access_token>
Content-Type: multipart/form-data

file: [binary image data]
productId: 1
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "id": 5,
    "url": "https://res.cloudinary.com/ddztbf1se/image/upload/v1702456789/products/mos-001-5.jpg",
    "publicId": "products/mos-001-5",
    "productId": 1,
    "isMain": false,
    "createdAt": "2025-12-13T16:30:00Z"
  }
}
```

**Restricciones:**
- Tamaño máximo: 5MB
- Formatos permitidos: JPG, PNG, WEBP
- Máximo 8 imágenes por producto

---

### POST /upload/category-image

Subir imagen de categoría.

**Acceso:** 🔒 Admin/Manager

**Request:**
```http
POST /api/v1/upload/category-image
Authorization: Bearer <access_token>
Content-Type: multipart/form-data

file: [binary image data]
categoryId: 1
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "url": "https://res.cloudinary.com/ddztbf1se/image/upload/v1702456789/categories/mosaicos.jpg",
    "publicId": "categories/mosaicos"
  }
}
```

---

### DELETE /upload/:imageId

Eliminar imagen de producto.

**Acceso:** 🔒 Admin/Manager

**Request:**
```http
DELETE /api/v1/upload/5
Authorization: Bearer <access_token>
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Imagen eliminada exitosamente"
}
```

---

## 💳 MercadoPago (Pagos)

### POST /mercadopago/create-preference

Crear preferencia de pago para un pedido.

**Request:**
```json
POST /api/v1/mercadopago/create-preference
Content-Type: application/json

{
  "orderId": 123
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "preferenceId": "987654321-abc123",
    "initPoint": "https://www.mercadopago.com.ar/checkout/v1/redirect?pref_id=987654321-abc123",
    "sandboxInitPoint": "https://sandbox.mercadopago.com.ar/checkout/v1/redirect?pref_id=987654321-abc123"
  }
}
```

**Flujo:**
1. Frontend crea orden → recibe `orderId`
2. Frontend llama a `/mercadopago/create-preference` con `orderId`
3. Backend crea preferencia en MercadoPago
4. Frontend redirige usuario a `initPoint`
5. Usuario completa pago en MercadoPago
6. MercadoPago notifica via webhook
7. Usuario vuelve a `success`, `failure` o `pending` URL

---

### POST /mercadopago/webhook

Recibir notificaciones de pagos desde MercadoPago.

**Nota:** Este endpoint es llamado automáticamente por MercadoPago.

**Request (de MercadoPago):**
```json
POST /api/v1/mercadopago/webhook
Content-Type: application/json

{
  "type": "payment",
  "action": "payment.updated",
  "data": {
    "id": "12345678"
  }
}
```

**Backend procesa:**
1. Consulta estado del pago a MercadoPago API
2. Actualiza orden en BD según estado del pago
3. Envía email de confirmación si pago aprobado

**Estados de pago:**
- `approved` → Orden status: `confirmed`, payment: `completed`
- `pending` → Orden payment: `pending`
- `rejected` → Orden payment: `failed`
- `refunded` → Orden payment: `refunded`

---

### GET /mercadopago/payment/:paymentId

Obtener estado de un pago.

**Request:**
```http
GET /api/v1/mercadopago/payment/12345678
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "id": "12345678",
    "status": "approved",
    "statusDetail": "accredited",
    "orderId": 123,
    "amount": 20400.00,
    "payer": {
      "email": "juan@example.com",
      "identification": {
        "type": "DNI",
        "number": "12345678"
      }
    },
    "paymentMethod": {
      "type": "credit_card",
      "id": "visa"
    },
    "dateApproved": "2025-12-13T14:05:00Z"
  }
}
```

---

### GET /mercadopago/public-key

Obtener public key de MercadoPago para frontend.

**Request:**
```http
GET /api/v1/mercadopago/public-key
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "publicKey": "APP_USR-c8332e1c-0d62-4cad-8ba4-47e7b319e17f"
  }
}
```

---

## 📧 Newsletter

### POST /newsletter/subscribe

Suscribirse al newsletter.

**Request:**
```json
POST /api/v1/newsletter/subscribe
Content-Type: application/json

{
  "email": "cliente@example.com",
  "name": "Juan Pérez"
}
```

**Response (201 Created):**
```json
{
  "success": true,
  "message": "Suscripción exitosa! Recibirás un email de confirmación."
}
```

---

### GET /newsletter/subscribers

Obtener suscriptores del newsletter.

**Acceso:** 🔒 Admin/Manager

**Response (200 OK):**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "email": "cliente@example.com",
      "name": "Juan Pérez",
      "isActive": true,
      "subscribedAt": "2025-10-15T10:00:00Z"
    }
  ]
}
```

---

## 📬 Contacto

### POST /contact

Enviar mensaje de contacto.

**Request:**
```json
POST /api/v1/contact
Content-Type: application/json

{
  "name": "María González",
  "email": "maria@example.com",
  "phone": "+5491198765432",
  "subject": "Consulta sobre mosaicos",
  "message": "Hola, quisiera saber más sobre los mosaicos venecianos..."
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Mensaje enviado exitosamente. Te responderemos a la brevedad."
}
```

**Acciones:**
- Se envía email al equipo de ventas
- Se envía email de confirmación al cliente
- Se guarda el mensaje en BD

---

## 📊 Estadísticas

### GET /stats/dashboard

Obtener estadísticas generales del dashboard.

**Acceso:** 🔒 Admin/Manager

**Request:**
```http
GET /api/v1/stats/dashboard?period=month
Authorization: Bearer <access_token>
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "period": "month",
    "sales": {
      "total": 2850000.00,
      "orders": 145,
      "averageOrderValue": 19655.17,
      "percentChange": 12.5
    },
    "products": {
      "total": 234,
      "active": 220,
      "lowStock": 15,
      "outOfStock": 3
    },
    "customers": {
      "total": 450,
      "new": 25,
      "active": 380
    },
    "topProducts": [
      {
        "id": 1,
        "name": "Mosaico Veneciano Azul",
        "sold": 450,
        "revenue": 1125000.00
      }
    ],
    "recentOrders": [
      {
        "id": 123,
        "orderNumber": "ORD-2025-123",
        "customerName": "Juan Pérez",
        "total": 20400.00,
        "status": "confirmed",
        "createdAt": "2025-12-13T14:00:00Z"
      }
    ],
    "salesChart": [
      {
        "date": "2025-12-01",
        "sales": 95000.00,
        "orders": 5
      }
    ]
  }
}
```

---

## 📥 Exportación

### GET /export/products

Exportar productos a CSV.

**Acceso:** 🔒 Admin/Manager

**Request:**
```http
GET /api/v1/export/products?format=csv
Authorization: Bearer <access_token>
```

**Response (200 OK):**
```csv
Content-Type: text/csv
Content-Disposition: attachment; filename="products-2025-12-13.csv"

ID,Name,SKU,Price,Stock,Category,Status
1,Mosaico Veneciano Azul,MOS-001,2500.00,150,Mosaicos,Active
2,Mosaico Veneciano Verde,MOS-002,2800.00,120,Mosaicos,Active
```

---

### GET /export/orders

Exportar pedidos a CSV.

**Acceso:** 🔒 Admin/Manager

**Request:**
```http
GET /api/v1/export/orders?startDate=2025-12-01&endDate=2025-12-13
Authorization: Bearer <access_token>
```

**Response (200 OK):**
```csv
Order Number,Customer,Email,Total,Status,Payment Status,Date
ORD-2025-123,Juan Pérez,juan@example.com,20400.00,confirmed,completed,2025-12-13
```

---

### GET /export/customers

Exportar clientes a CSV.

**Acceso:** 🔒 Admin/Manager

**Response (200 OK):**
```csv
ID,Name,Email,Phone,Total Orders,Total Spent,Last Order
1,Juan Pérez,juan@example.com,+5491123456789,8,145000.00,2025-12-10
```

---

## 🏥 Health Checks

### GET /health

Health check básico.

**Request:**
```http
GET /health
```

**Response (200 OK):**
```json
{
  "status": "ok",
  "timestamp": "2025-12-13T16:00:00Z"
}
```

---

### GET /health/ready

Readiness check (para Kubernetes).

**Response (200 OK):**
```json
{
  "status": "ready",
  "checks": {
    "database": "up",
    "cache": "up"
  }
}
```

---

### GET /health/live

Liveness check (para Kubernetes).

**Response (200 OK):**
```json
{
  "status": "alive"
}
```

---

### GET /health/detailed

Health check detallado con métricas.

**Response (200 OK):**
```json
{
  "status": "ok",
  "timestamp": "2025-12-13T16:00:00Z",
  "uptime": 3456789,
  "checks": {
    "database": {
      "status": "up",
      "message": "Database connection is healthy",
      "responseTime": "12ms"
    },
    "valkey": {
      "status": "up",
      "message": "Valkey connection is healthy",
      "responseTime": "5ms",
      "details": {
        "dbSize": 1250,
        "usedMemory": "2.5MB"
      }
    }
  },
  "system": {
    "nodeVersion": "20.10.0",
    "platform": "linux",
    "memory": {
      "total": "512MB",
      "used": "234MB",
      "free": "278MB"
    },
    "cpu": {
      "cores": 2,
      "usage": 12.5
    }
  }
}
```

---

## 🔔 Webhooks

### MercadoPago Webhook

**URL:** `https://diligent-upliftment-production-54de.up.railway.app/api/v1/mercadopago/webhook`

**Eventos que envía MercadoPago:**
- `payment.created` - Pago creado
- `payment.updated` - Pago actualizado
- `payment.approved` - Pago aprobado
- `payment.rejected` - Pago rechazado
- `payment.refunded` - Pago reembolsado

**Payload de ejemplo:**
```json
{
  "id": 12345,
  "live_mode": true,
  "type": "payment",
  "date_created": "2025-12-13T14:05:00Z",
  "user_id": "123456",
  "api_version": "v1",
  "action": "payment.updated",
  "data": {
    "id": "12345678"
  }
}
```

**Procesamiento:**
1. Backend recibe notificación
2. Responde `200 OK` inmediatamente
3. Procesa la notificación de forma asíncrona
4. Consulta estado del pago a MercadoPago API
5. Actualiza orden en BD
6. Envía email de confirmación (si aplica)

---

## 📡 Eventos del Sistema

### Eventos de Orden

| Evento | Disparador | Payload |
|--------|-----------|---------|
| `order.created` | Se crea un pedido | `{ orderId, orderNumber, total, customerEmail }` |
| `order.confirmed` | Pago confirmado | `{ orderId, orderNumber, paymentId }` |
| `order.status_changed` | Cambio de estado | `{ orderId, oldStatus, newStatus }` |
| `order.shipped` | Pedido enviado | `{ orderId, trackingNumber }` |
| `order.delivered` | Pedido entregado | `{ orderId, deliveredAt }` |
| `order.cancelled` | Pedido cancelado | `{ orderId, reason }` |

### Eventos de Pago

| Evento | Disparador | Payload |
|--------|-----------|---------|
| `payment.pending` | Pago pendiente | `{ orderId, paymentId }` |
| `payment.completed` | Pago completado | `{ orderId, paymentId, amount }` |
| `payment.failed` | Pago fallido | `{ orderId, paymentId, reason }` |
| `payment.refunded` | Pago reembolsado | `{ orderId, paymentId, amount }` |

### Eventos de Stock

| Evento | Disparador | Payload |
|--------|-----------|---------|
| `product.low_stock` | Stock bajo (< 10) | `{ productId, stock }` |
| `product.out_of_stock` | Sin stock | `{ productId }` |
| `product.restocked` | Stock repuesto | `{ productId, newStock }` |

### Eventos de Usuario

| Evento | Disparador | Payload |
|--------|-----------|---------|
| `user.registered` | Nuevo registro | `{ userId, email, role }` |
| `user.logged_in` | Login exitoso | `{ userId, email, timestamp }` |
| `user.password_reset` | Reset de password | `{ userId, email }` |

---

## ❌ Códigos de Error

### Códigos HTTP Estándar

| Código | Significado | Uso |
|--------|-------------|-----|
| `200` | OK | Petición exitosa |
| `201` | Created | Recurso creado |
| `400` | Bad Request | Datos inválidos |
| `401` | Unauthorized | No autenticado |
| `403` | Forbidden | Sin permisos |
| `404` | Not Found | Recurso no encontrado |
| `409` | Conflict | Conflicto (ej: email duplicado) |
| `422` | Unprocessable Entity | Validación fallida |
| `429` | Too Many Requests | Rate limit excedido |
| `500` | Internal Server Error | Error del servidor |
| `503` | Service Unavailable | Servicio no disponible |

### Formato de Error

Todas las respuestas de error siguen este formato:

```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "Mensaje descriptivo del error",
    "details": {
      "field": "email",
      "reason": "Email ya registrado"
    }
  },
  "timestamp": "2025-12-13T16:00:00Z",
  "requestId": "req_abc123xyz"
}
```

### Códigos de Error Personalizados

| Código | Descripción |
|--------|-------------|
| `AUTH_FAILED` | Credenciales inválidas |
| `TOKEN_EXPIRED` | Token JWT expirado |
| `TOKEN_INVALID` | Token JWT inválido |
| `INSUFFICIENT_PERMISSIONS` | Sin permisos para esta acción |
| `RESOURCE_NOT_FOUND` | Recurso no encontrado |
| `VALIDATION_ERROR` | Error de validación de datos |
| `DUPLICATE_ENTRY` | Entrada duplicada (email, SKU, etc) |
| `INSUFFICIENT_STOCK` | Stock insuficiente |
| `PAYMENT_FAILED` | Pago fallido |
| `RATE_LIMIT_EXCEEDED` | Rate limit excedido |
| `DATABASE_ERROR` | Error de base de datos |
| `EXTERNAL_SERVICE_ERROR` | Error en servicio externo |

### Ejemplos de Errores

#### Error de Autenticación (401)
```json
{
  "success": false,
  "error": {
    "code": "TOKEN_EXPIRED",
    "message": "El token de acceso ha expirado"
  },
  "timestamp": "2025-12-13T16:00:00Z"
}
```

#### Error de Validación (400)
```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Datos de entrada inválidos",
    "details": {
      "email": "Email inválido",
      "password": "Password debe tener al menos 6 caracteres"
    }
  }
}
```

#### Error de Permisos (403)
```json
{
  "success": false,
  "error": {
    "code": "INSUFFICIENT_PERMISSIONS",
    "message": "No tienes permisos para realizar esta acción"
  }
}
```

#### Error de Recurso No Encontrado (404)
```json
{
  "success": false,
  "error": {
    "code": "RESOURCE_NOT_FOUND",
    "message": "Producto no encontrado",
    "details": {
      "productId": 999
    }
  }
}
```

---

## 📚 Recursos Adicionales

### Swagger UI (Documentación Interactiva)

**Producción:** [https://diligent-upliftment-production-54de.up.railway.app/api-docs](https://diligent-upliftment-production-54de.up.railway.app/api-docs)

**Local:** [http://localhost:3000/api-docs](http://localhost:3000/api-docs)

### Postman Collection

Puedes importar la colección de Postman desde Swagger UI:

1. Ir a Swagger UI
2. Click en "Export" → "OpenAPI 3.0 JSON"
3. Importar en Postman

### Rate Limits

| Endpoint | Límite | Ventana |
|----------|--------|---------|
| Global | 100 requests | 15 minutos |
| `/auth/login` | 5 requests | 15 minutos |
| `/auth/register` | 3 requests | 1 hora |
| `/upload/*` | 10 uploads | 15 minutos |

### Paginación Estándar

Todos los endpoints que retornan listas usan esta estructura de paginación:

```json
{
  "success": true,
  "data": [...],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 145,
    "totalPages": 8,
    "hasNextPage": true,
    "hasPrevPage": false
  }
}
```

### Ordenamiento

Parámetros de ordenamiento disponibles:
- `sort`: Campo por el cual ordenar
- `order`: `asc` (ascendente) o `desc` (descendente)

Ejemplo:
```http
GET /api/v1/products?sort=price&order=asc
```

---

**Última actualización:** Diciembre 2025  
**Versión de la API:** v1  
**Estado:** ✅ Producción Ready

Para más información, consulta:
- [Documentación de Arquitectura](./ARQUITECTURA.md)
- [Guía de Troubleshooting](./TROUBLESHOOTING.md)
- [README Principal](./README.md)
