# 🏗️ Arquitectura del Sistema - Aguamarina Mosaicos

> Documentación completa de la arquitectura del sistema e-commerce empresarial

**Versión:** 2.0  
**Última actualización:** Diciembre 2025  
**Estado:** ✅ Producción

---

## 📑 Tabla de Contenidos

- [Visión General](#-visión-general)
- [Arquitectura de Alto Nivel](#-arquitectura-de-alto-nivel)
- [Arquitectura del Backend](#-arquitectura-del-backend)
- [Arquitectura del Frontend](#-arquitectura-del-frontend)
- [Arquitectura de Base de Datos](#-arquitectura-de-base-de-datos)
- [Arquitectura de Pagos](#-arquitectura-de-pagos)
- [Seguridad y Autenticación](#-seguridad-y-autenticación)
- [Infraestructura y DevOps](#-infraestructura-y-devops)
- [Flujos de Datos Principales](#-flujos-de-datos-principales)

---

## 🎯 Visión General

### Descripción del Sistema

Aguamarina Mosaicos es un **sistema e-commerce empresarial completo** diseñado con arquitectura limpia, escalable y orientada a microservicios. El sistema consta de tres aplicaciones principales interconectadas:

```
┌─────────────────────────────────────────────────────────────────┐
│                    AGUAMARINA MOSAICOS SYSTEM                   │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌──────────────┐    ┌──────────────┐    ┌──────────────┐     │
│  │   Frontend   │    │    Admin     │    │   Backend    │     │
│  │   (Tienda)   │◄───┤  Dashboard   │◄───┤   API REST   │     │
│  │  Next.js 15  │    │  Next.js 15  │    │  Express TS  │     │
│  └──────────────┘    └──────────────┘    └──────────────┘     │
│         │                    │                    │            │
│         └────────────────────┼────────────────────┘            │
│                              │                                 │
│                    ┌─────────▼─────────┐                       │
│                    │   PostgreSQL DB   │                       │
│                    │    (Supabase)     │                       │
│                    └───────────────────┘                       │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### Características Principales

- ✅ **Clean Architecture** - Separación clara de responsabilidades
- ✅ **TypeScript-First** - Type safety completo en todo el stack
- ✅ **API-First Design** - Backend RESTful independiente
- ✅ **Microservices Ready** - Arquitectura preparada para escalar
- ✅ **Security-First** - Autenticación JWT, validación, sanitización
- ✅ **Performance Optimized** - Caché con Valkey, optimización de queries
- ✅ **Cloud Native** - Desplegado en Railway y Vercel

### Métricas del Sistema

```
┌──────────────────────────────────────────────────────────┐
│  📊 MÉTRICAS DEL PROYECTO                                │
├──────────────────────────────────────────────────────────┤
│  Total archivos TS/TSX:        ~250 archivos            │
│  Líneas de código:             ~15,000 LOC              │
│  Controladores API:            17 controladores         │
│  Rutas API:                    50+ endpoints            │
│  Componentes React:            ~60 componentes          │
│  Tablas de Base de Datos:      10 tablas               │
│  Índices de BD:                20+ índices             │
│  Cobertura de Tests:           ~20% (en desarrollo)     │
└──────────────────────────────────────────────────────────┘
```

---

## 🏛️ Arquitectura de Alto Nivel

### Diagrama de Componentes

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                              USUARIO FINAL                                  │
└─────────────────────────────────────────────────────────────────────────────┘
                                    │
                    ┌───────────────┴───────────────┐
                    │                               │
           ┌────────▼────────┐            ┌────────▼────────┐
           │   FRONTEND      │            │  ADMIN PANEL    │
           │  (Tienda)       │            │  (Dashboard)    │
           │                 │            │                 │
           │  aguamarina     │            │  admin.agua     │
           │  mosaicos.com   │            │  marinamosaicos │
           │                 │            │  .com           │
           │  - Next.js 15   │            │  - Next.js 15   │
           │  - React 19     │            │  - React 19     │
           │  - Tailwind 4   │            │  - shadcn/ui    │
           │  - Framer       │            │  - React Query  │
           │  - GSAP         │            │  - Charts       │
           └────────┬────────┘            └────────┬────────┘
                    │                               │
                    └───────────────┬───────────────┘
                                    │
                                    │ HTTPS/REST
                                    │
                    ┌───────────────▼───────────────┐
                    │       BACKEND API             │
                    │    (Express + TypeScript)     │
                    │                               │
                    │  Railway:                     │
                    │  diligent-upliftment-         │
                    │  production-54de              │
                    │                               │
                    │  - Clean Architecture         │
                    │  - JWT Auth                   │
                    │  - Swagger Docs               │
                    │  - Winston Logs               │
                    │  - Rate Limiting              │
                    │  - Helmet Security            │
                    └───────┬───────────────────────┘
                            │
            ┌───────────────┼───────────────┐
            │               │               │
    ┌───────▼──────┐ ┌─────▼──────┐ ┌─────▼──────┐
    │  PostgreSQL  │ │   Valkey   │ │ Cloudinary │
    │  (Supabase)  │ │  (Redis)   │ │  (Images)  │
    │              │ │            │ │            │
    │  - Users     │ │  - Cache   │ │  - Upload  │
    │  - Products  │ │  - Session │ │  - CDN     │
    │  - Orders    │ │  - Queue   │ │  - Resize  │
    │  - Customers │ │            │ │            │
    └──────────────┘ └────────────┘ └────────────┘
            │
            │
    ┌───────▼──────────┐
    │  Servicios       │
    │  Externos        │
    │                  │
    │  - MercadoPago   │
    │  - Resend Email  │
    │  - Nodemailer    │
    └──────────────────┘
```

### Tecnologías por Capa

| Capa | Tecnologías | Responsabilidad |
|------|-------------|-----------------|
| **Presentación** | Next.js 15, React 19, Tailwind CSS 4 | UI/UX, Interacción con usuario |
| **API Gateway** | Express 4.18, TypeScript 5.3 | Routing, Middleware, Validación |
| **Lógica de Negocio** | TypeScript, Clean Architecture | Casos de uso, Reglas de negocio |
| **Datos** | PostgreSQL 16, Valkey | Persistencia, Caché |
| **Servicios Externos** | Cloudinary, MercadoPago, Resend | Storage, Pagos, Email |
| **Infraestructura** | Railway, Vercel, Supabase | Hosting, CI/CD |

---

## 🔧 Arquitectura del Backend

### Clean Architecture - Capas

El backend implementa **Clean Architecture** (Arquitectura Limpia) de Robert C. Martin:

```
backend/
├── src/
│   ├── domain/                 # 🎯 CAPA DE DOMINIO (Núcleo)
│   │   ├── entities/          # Entidades de negocio
│   │   │   ├── User.ts
│   │   │   ├── Product.ts
│   │   │   ├── Order.ts
│   │   │   ├── Customer.ts
│   │   │   ├── Category.ts
│   │   │   ├── Address.ts
│   │   │   └── ProductImage.ts
│   │   │
│   │   └── repositories/      # Interfaces de repositorios
│   │       ├── IUserRepository.ts
│   │       ├── IProductRepository.ts
│   │       ├── IOrderRepository.ts
│   │       └── ICategoryRepository.ts
│   │
│   ├── application/            # 🎬 CAPA DE APLICACIÓN
│   │   ├── controllers/       # 17 Controladores
│   │   │   ├── AuthController.ts
│   │   │   ├── ProductsController.ts
│   │   │   ├── OrdersController.ts
│   │   │   ├── CategoriesController.ts
│   │   │   ├── CustomersController.ts
│   │   │   ├── UsersController.ts
│   │   │   ├── ReviewController.ts
│   │   │   ├── UploadController.ts
│   │   │   ├── ExportController.ts
│   │   │   ├── StatsController.ts
│   │   │   ├── HealthController.ts
│   │   │   ├── MercadoPagoController.ts
│   │   │   ├── AddressController.ts
│   │   │   ├── NewsletterController.ts
│   │   │   └── ContactController.ts
│   │   │
│   │   ├── routes/            # Definición de rutas
│   │   │   ├── auth.routes.ts
│   │   │   ├── products.routes.ts
│   │   │   ├── orders.routes.ts
│   │   │   ├── categories.routes.ts
│   │   │   ├── users.routes.ts
│   │   │   ├── customers.routes.ts
│   │   │   ├── review.routes.ts
│   │   │   ├── upload.routes.ts
│   │   │   ├── stats.routes.ts
│   │   │   ├── mercadopago.routes.ts
│   │   │   ├── addresses.routes.ts
│   │   │   ├── newsletter.routes.ts
│   │   │   ├── contact.routes.ts
│   │   │   └── cache-stats.routes.ts
│   │   │
│   │   ├── middleware/        # Middleware de aplicación
│   │   │   ├── authenticate.ts
│   │   │   ├── errorHandler.ts
│   │   │   ├── requestLogger.ts
│   │   │   ├── rateLimiter.ts
│   │   │   ├── requestId.ts
│   │   │   ├── validateRequest.ts
│   │   │   └── uploadConfig.ts
│   │   │
│   │   └── validators/        # Validación con Zod
│   │       ├── userValidator.ts
│   │       ├── productValidator.ts
│   │       ├── orderValidator.ts
│   │       └── authValidator.ts
│   │
│   ├── infrastructure/         # 🔌 CAPA DE INFRAESTRUCTURA
│   │   ├── database/
│   │   │   ├── db.ts          # Pool de PostgreSQL
│   │   │   ├── migrate.ts     # Sistema de migraciones
│   │   │   ├── seed.ts        # Datos iniciales
│   │   │   └── reset.ts       # Reset de BD
│   │   │
│   │   ├── cache/
│   │   │   ├── valkey.ts      # Cliente Valkey (Redis)
│   │   │   └── cacheService.ts
│   │   │
│   │   ├── email/
│   │   │   ├── emailService.ts
│   │   │   └── nodemailer.ts
│   │   │
│   │   ├── storage/
│   │   │   └── cloudinary.ts  # Upload de imágenes
│   │   │
│   │   └── payments/
│   │       └── mercadopago.ts # Integración MP
│   │
│   ├── shared/                 # 🛠️ UTILIDADES COMPARTIDAS
│   │   ├── logger.ts          # Winston Logger
│   │   ├── errorTypes.ts      # Custom Errors
│   │   └── utils.ts           # Funciones auxiliares
│   │
│   ├── config/                 # ⚙️ CONFIGURACIÓN
│   │   ├── environment.ts     # Variables de entorno
│   │   ├── swagger.ts         # Config Swagger
│   │   └── database.ts        # Config DB
│   │
│   ├── app.ts                  # 🚀 Configuración Express
│   └── server.ts               # 🎯 Entry Point
│
├── api/                        # Vercel Serverless (opcional)
│   └── index.ts
│
├── scripts/                    # Scripts de utilidad
├── migrations.sql              # Migraciones SQL consolidadas
├── database-setup.sql          # Setup completo de BD
├── jest.config.js              # Configuración Jest
├── tsconfig.json               # Configuración TypeScript
└── package.json                # Dependencias
```

### Principios de Clean Architecture

#### 1. Independencia de Frameworks
```typescript
// ✅ BIEN - Lógica de negocio sin dependencias de Express
class CreateOrderUseCase {
  async execute(orderData: CreateOrderDTO): Promise<Order> {
    // Lógica pura de TypeScript
    const order = new Order(orderData);
    await this.orderRepository.save(order);
    return order;
  }
}
```

#### 2. Testeable
```typescript
// ✅ BIEN - Inyección de dependencias para testing
class OrdersController {
  constructor(
    private orderRepository: IOrderRepository,
    private emailService: IEmailService
  ) {}
}
```

#### 3. Independencia de UI
```typescript
// ✅ BIEN - Mismo caso de uso para REST, GraphQL, CLI, etc.
const createOrder = new CreateOrderUseCase(orderRepo, emailService);
```

#### 4. Independencia de Base de Datos
```typescript
// ✅ BIEN - Interfaz define el contrato
interface IOrderRepository {
  findById(id: number): Promise<Order | null>;
  save(order: Order): Promise<Order>;
}

// Implementación PostgreSQL
class PostgreSQLOrderRepository implements IOrderRepository {
  // ...
}

// Fácil cambiar a MongoDB, DynamoDB, etc.
```

---

## 🎨 Arquitectura del Frontend

### Arquitectura de Next.js 15 App Router

```
frontend/
├── app/                        # 📱 APP ROUTER (Next.js 15)
│   ├── layout.tsx             # Layout raíz
│   ├── page.tsx               # Homepage
│   ├── globals.css            # Estilos globales
│   │
│   ├── productos/             # Catálogo de productos
│   │   ├── page.tsx           # Listado
│   │   ├── [id]/page.tsx      # Detalle producto
│   │   └── loading.tsx        # Loading state
│   │
│   ├── carrito/               # Carrito de compras
│   │   └── page.tsx
│   │
│   ├── checkout/              # Proceso de compra
│   │   └── page.tsx
│   │
│   ├── pedidos/               # Historial y estados
│   │   ├── page.tsx
│   │   ├── success/page.tsx
│   │   ├── failure/page.tsx
│   │   └── pending/page.tsx
│   │
│   ├── cuenta/                # Perfil de usuario
│   │   ├── page.tsx
│   │   └── pedidos/page.tsx
│   │
│   └── contacto/              # Formulario de contacto
│       └── page.tsx
│
├── components/                 # 🧩 COMPONENTES REACT
│   ├── ui/                    # Componentes base (shadcn/ui)
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   ├── dialog.tsx
│   │   ├── input.tsx
│   │   └── ...
│   │
│   ├── layout/                # Componentes de layout
│   │   ├── Header.tsx
│   │   ├── Footer.tsx
│   │   ├── Navbar.tsx
│   │   └── Sidebar.tsx
│   │
│   ├── products/              # Componentes de productos
│   │   ├── ProductCard.tsx
│   │   ├── ProductGrid.tsx
│   │   ├── ProductFilters.tsx
│   │   └── ProductDetail.tsx
│   │
│   ├── cart/                  # Componentes del carrito
│   │   ├── CartItem.tsx
│   │   ├── CartSummary.tsx
│   │   └── CartDrawer.tsx
│   │
│   └── animations/            # Componentes con animaciones
│       ├── ParallaxSection.tsx
│       ├── ScrollReveal.tsx
│       └── HeroAnimation.tsx
│
├── lib/                        # 📚 UTILIDADES Y CONFIGURACIÓN
│   ├── api/                   # API clients
│   │   ├── products.ts
│   │   ├── orders.ts
│   │   ├── auth.ts
│   │   └── mercadopago.ts
│   │
│   ├── hooks/                 # Custom hooks
│   │   ├── useProducts.ts
│   │   ├── useCart.ts
│   │   ├── useAuth.ts
│   │   └── useCheckout.ts
│   │
│   ├── store/                 # Estado global (Zustand)
│   │   ├── cartStore.ts
│   │   ├── authStore.ts
│   │   └── uiStore.ts
│   │
│   ├── utils/                 # Funciones auxiliares
│   │   ├── formatters.ts
│   │   ├── validators.ts
│   │   └── helpers.ts
│   │
│   └── types/                 # TypeScript types
│       ├── product.ts
│       ├── order.ts
│       └── user.ts
│
├── public/                     # 🖼️ ARCHIVOS ESTÁTICOS
│   ├── images/
│   ├── icons/
│   ├── favicon.ico
│   └── manifest.json          # PWA manifest
│
├── next.config.ts              # Configuración Next.js
├── tailwind.config.ts          # Configuración Tailwind
├── tsconfig.json               # Configuración TypeScript
└── package.json                # Dependencias
```

### Patrones de Diseño del Frontend

#### 1. Server Components vs Client Components

```typescript
// app/productos/page.tsx - SERVER COMPONENT (por defecto)
export default async function ProductosPage() {
  // Data fetching en el servidor
  const productos = await getProductos();
  
  return <ProductGrid productos={productos} />;
}

// components/cart/CartDrawer.tsx - CLIENT COMPONENT
'use client'

export function CartDrawer() {
  // Interactividad, estado, hooks
  const [isOpen, setIsOpen] = useState(false);
  const { items } = useCart();
  
  return <Drawer open={isOpen}>...</Drawer>;
}
```

#### 2. Data Fetching con TanStack Query

```typescript
// lib/hooks/useProducts.ts
export function useProducts(filters?: ProductFilters) {
  return useQuery({
    queryKey: ['products', filters],
    queryFn: () => productsApi.getAll(filters),
    staleTime: 5 * 60 * 1000, // 5 minutos
    cacheTime: 10 * 60 * 1000, // 10 minutos
  });
}
```

#### 3. Estado Global con Zustand

```typescript
// lib/store/cartStore.ts
interface CartStore {
  items: CartItem[];
  addItem: (product: Product, quantity: number) => void;
  removeItem: (productId: number) => void;
  updateQuantity: (productId: number, quantity: number) => void;
  clearCart: () => void;
  getTotalPrice: () => number;
}

export const useCartStore = create<CartStore>((set, get) => ({
  items: [],
  
  addItem: (product, quantity) => set((state) => ({
    items: [...state.items, { product, quantity }]
  })),
  
  // ... demás acciones
  
  getTotalPrice: () => {
    return get().items.reduce(
      (total, item) => total + item.product.price * item.quantity,
      0
    );
  }
}));
```

#### 4. Animaciones con GSAP + Framer Motion

```typescript
// components/animations/HeroAnimation.tsx
'use client'

import { useGSAP } from '@gsap/react';
import { motion } from 'framer-motion';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';

export function HeroAnimation() {
  useGSAP(() => {
    gsap.registerPlugin(ScrollTrigger);
    
    gsap.from('.hero-title', {
      y: 100,
      opacity: 0,
      duration: 1,
      ease: 'power3.out',
    });
    
    gsap.to('.hero-image', {
      scrollTrigger: {
        trigger: '.hero-image',
        start: 'top center',
        end: 'bottom top',
        scrub: true,
      },
      y: -100,
    });
  });
  
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <h1 className="hero-title">Aguamarina Mosaicos</h1>
      <img className="hero-image" src="/hero.jpg" alt="Hero" />
    </motion.div>
  );
}
```

---

## 🗄️ Arquitectura de Base de Datos

### Modelo de Datos

```sql
┌─────────────────────────────────────────────────────────────────────┐
│                    MODELO DE BASE DE DATOS                          │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  ┌──────────┐         ┌──────────────┐         ┌──────────┐        │
│  │  users   │         │  categories  │         │ products │        │
│  ├──────────┤         ├──────────────┤         ├──────────┤        │
│  │ id (PK)  │         │ id (PK)      │      ┌──│ id (PK)  │        │
│  │ email    │         │ name         │      │  │ name     │        │
│  │ password │         │ slug         │      │  │ sku      │        │
│  │ role     │         │ parent_id ───┼──────┘  │ price    │        │
│  │ ...      │         │ ...          │         │ stock    │        │
│  └────┬─────┘         └──────────────┘         │ cat_id ──┼────┐   │
│       │                                         │ ...      │    │   │
│       │                                         └──────────┘    │   │
│       │                                               │         │   │
│       │                 ┌──────────────┐              │         │   │
│       │                 │ order_items  │              │         │   │
│       │                 ├──────────────┤              │         │   │
│       │                 │ id (PK)      │              │         │   │
│       │              ┌──│ order_id     │              │         │   │
│       │              │  │ product_id ──┼──────────────┘         │   │
│       │              │  │ quantity     │                        │   │
│       │              │  │ price        │                        │   │
│       │              │  └──────────────┘                        │   │
│       │              │                                          │   │
│  ┌────▼──────┐  ┌────┴──────┐         ┌──────────────┐         │   │
│  │  orders   │  │ customers │         │product_images│         │   │
│  ├───────────┤  ├───────────┤         ├──────────────┤         │   │
│  │ id (PK)   │  │ id (PK)   │         │ id (PK)      │         │   │
│  │ user_id ──┼──│ user_id   │         │ product_id ──┼─────────┘   │
│  │ status    │  │ name      │         │ url          │             │
│  │ total     │  │ phone     │         │ public_id    │             │
│  │ ...       │  │ ...       │         │ is_main      │             │
│  └───────────┘  └───────────┘         └──────────────┘             │
│                                                                     │
│  ┌──────────────┐       ┌─────────────────┐    ┌────────────┐     │
│  │ reviews      │       │ refresh_tokens  │    │ audit_logs │     │
│  ├──────────────┤       ├─────────────────┤    ├────────────┤     │
│  │ id (PK)      │       │ id (PK)         │    │ id (PK)    │     │
│  │ product_id   │       │ user_id         │    │ user_id    │     │
│  │ user_id      │       │ token           │    │ action     │     │
│  │ rating       │       │ expires_at      │    │ table_name │     │
│  │ comment      │       │ ...             │    │ ...        │     │
│  └──────────────┘       └─────────────────┘    └────────────┘     │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

### Optimizaciones de Base de Datos

#### Índices Estratégicos

```sql
-- Índices para búsqueda de productos
CREATE INDEX idx_products_category_id ON products(category_id);
CREATE INDEX idx_products_slug ON products(slug);
CREATE INDEX idx_products_sku ON products(sku);
CREATE INDEX idx_products_is_active ON products(is_active);

-- Índices compuestos para filtros
CREATE INDEX idx_products_category_active ON products(category_id, is_active);
CREATE INDEX idx_products_price ON products(price) WHERE is_active = true;

-- Índices para ordenamiento
CREATE INDEX idx_products_created_at ON products(created_at DESC);
CREATE INDEX idx_products_name ON products(name);

-- Índices para relaciones
CREATE INDEX idx_orders_user_id ON orders(user_id);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_order_items_order_id ON order_items(order_id);
CREATE INDEX idx_order_items_product_id ON order_items(product_id);

-- Full-text search
CREATE INDEX idx_products_search ON products USING gin(to_tsvector('spanish', name || ' ' || description));
```

#### Triggers para Auditoría

```sql
-- Trigger para updated_at automático
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
   NEW.updated_at = CURRENT_TIMESTAMP;
   RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_products_updated_at
    BEFORE UPDATE ON products
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Aplicado a: users, products, categories, orders, etc.
```

#### Vistas Optimizadas

```sql
-- Vista de productos con categoría
CREATE OR REPLACE VIEW products_with_category AS
SELECT 
    p.id,
    p.name,
    p.slug,
    p.price,
    p.stock,
    p.is_active,
    c.name as category_name,
    c.slug as category_slug,
    COUNT(pi.id) as images_count
FROM products p
LEFT JOIN categories c ON p.category_id = c.id
LEFT JOIN product_images pi ON p.id = pi.product_id
GROUP BY p.id, c.id;

-- Vista de estadísticas de usuarios
CREATE OR REPLACE VIEW user_order_stats AS
SELECT 
    u.id as user_id,
    u.email,
    COUNT(DISTINCT o.id) as total_orders,
    COALESCE(SUM(o.total), 0) as total_spent,
    MAX(o.created_at) as last_order_date
FROM users u
LEFT JOIN orders o ON u.id = o.user_id
GROUP BY u.id;
```

#### Funciones Almacenadas

```sql
-- Función para obtener productos más vendidos
CREATE OR REPLACE FUNCTION get_top_selling_products(limit_count INT DEFAULT 10)
RETURNS TABLE (
    product_id INT,
    product_name VARCHAR,
    total_sold BIGINT,
    revenue NUMERIC
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        p.id,
        p.name,
        SUM(oi.quantity)::BIGINT as total_sold,
        SUM(oi.quantity * oi.price) as revenue
    FROM products p
    INNER JOIN order_items oi ON p.id = oi.product_id
    INNER JOIN orders o ON oi.order_id = o.id
    WHERE o.status = 'confirmed'
    GROUP BY p.id
    ORDER BY total_sold DESC
    LIMIT limit_count;
END;
$$ LANGUAGE plpgsql;
```

---

## 💳 Arquitectura de Pagos

### Flujo de Pago con MercadoPago

```
┌─────────────────────────────────────────────────────────────────┐
│                    FLUJO DE PAGO COMPLETO                       │
└─────────────────────────────────────────────────────────────────┘

1. USUARIO AGREGA PRODUCTOS AL CARRITO
   └─> Frontend: useCartStore (Zustand)

2. USUARIO VA AL CHECKOUT
   └─> Frontend: app/checkout/page.tsx
       └─> Completa: email, nombre, dirección

3. FRONTEND CREA LA ORDEN
   └─> POST /api/v1/orders
       └─> Backend guarda orden con status="pending"
       └─> Retorna: orderId

4. FRONTEND SOLICITA PREFERENCIA DE PAGO
   └─> POST /api/v1/mercadopago/create-preference
       Body: { orderId: 123 }
       
5. BACKEND CREA PREFERENCIA EN MERCADOPAGO
   └─> MercadoPagoController.createPreference()
       └─> Busca orden en BD
       └─> Crea preferencia en API de MercadoPago
       └─> Retorna: { preferenceId, initPoint }

6. FRONTEND REDIRIGE A MERCADOPAGO
   └─> window.location.href = initPoint
       └─> Usuario sale de nuestra app
       └─> Usuario en checkout de MercadoPago

7. USUARIO COMPLETA EL PAGO
   └─> MercadoPago procesa tarjeta
   
8. MERCADOPAGO NOTIFICA VÍA WEBHOOK
   └─> POST /api/v1/mercadopago/webhook
       Body: { type: "payment", data: { id: "456" } }
       
9. BACKEND ACTUALIZA ESTADO DE LA ORDEN
   └─> MercadoPagoController.handleWebhook()
       └─> Consulta payment_id a MercadoPago
       └─> Actualiza orden: status="confirmed"
       └─> Actualiza orden: payment_status="completed"
       └─> Envía email de confirmación

10. MERCADOPAGO REDIRIGE AL USUARIO
    └─> Success: aguamarinamosaicos.com/pedidos/success?payment_id=456
    └─> Failure: aguamarinamosaicos.com/pedidos/failure
    └─> Pending: aguamarinamosaicos.com/pedidos/pending

11. FRONTEND MUESTRA RESULTADO
    └─> app/pedidos/success/page.tsx
        └─> Obtiene datos del pago
        └─> Muestra mensaje de éxito
        └─> Limpia carrito
```

### Componentes del Sistema de Pagos

#### Backend - MercadoPagoController

```typescript
// backend/src/application/controllers/MercadoPagoController.ts

export class MercadoPagoController {
  /**
   * Crear preferencia de pago
   * POST /api/v1/mercadopago/create-preference
   */
  static async createPreference(req: Request, res: Response) {
    const { orderId } = req.body;
    
    // 1. Obtener orden de la BD
    const order = await db.query('SELECT * FROM orders WHERE id = $1', [orderId]);
    
    // 2. Crear preferencia en MercadoPago
    const preference = await mercadopago.preferences.create({
      items: order.items.map(item => ({
        title: item.product_name,
        quantity: item.quantity,
        unit_price: item.price,
      })),
      payer: {
        email: order.customer_email,
        name: order.customer_name,
      },
      back_urls: {
        success: `${FRONTEND_URL}/pedidos/success`,
        failure: `${FRONTEND_URL}/pedidos/failure`,
        pending: `${FRONTEND_URL}/pedidos/pending`,
      },
      auto_return: 'approved',
      notification_url: `${BACKEND_URL}/api/v1/mercadopago/webhook`,
      external_reference: String(orderId),
    });
    
    // 3. Guardar preference_id en la orden
    await db.query(
      'UPDATE orders SET mercadopago_preference_id = $1 WHERE id = $2',
      [preference.body.id, orderId]
    );
    
    return res.json({
      success: true,
      data: {
        preferenceId: preference.body.id,
        initPoint: preference.body.init_point,
        sandboxInitPoint: preference.body.sandbox_init_point,
      }
    });
  }
  
  /**
   * Webhook de notificaciones de MercadoPago
   * POST /api/v1/mercadopago/webhook
   */
  static async handleWebhook(req: Request, res: Response) {
    const { type, data } = req.body;
    
    // Responder rápido a MercadoPago
    res.status(200).send('OK');
    
    if (type === 'payment') {
      const paymentId = data.id;
      
      // Consultar estado del pago
      const payment = await mercadopago.payment.get(paymentId);
      
      const orderId = payment.body.external_reference;
      const status = payment.body.status;
      
      // Actualizar orden según estado del pago
      if (status === 'approved') {
        await db.query(`
          UPDATE orders 
          SET 
            status = 'confirmed',
            payment_status = 'completed',
            mercadopago_payment_id = $1,
            paid_at = CURRENT_TIMESTAMP
          WHERE id = $2
        `, [paymentId, orderId]);
        
        // Enviar email de confirmación
        await emailService.sendOrderConfirmation(orderId);
      }
      else if (status === 'rejected') {
        await db.query(`
          UPDATE orders 
          SET payment_status = 'failed'
          WHERE id = $1
        `, [orderId]);
      }
      else if (status === 'pending') {
        await db.query(`
          UPDATE orders 
          SET payment_status = 'pending'
          WHERE id = $1
        `, [orderId]);
      }
    }
  }
}
```

### Variables de Entorno para Pagos

```bash
# Backend (Railway)
MERCADOPAGO_ACCESS_TOKEN=APP_USR-8739117242123034-110209-...
MERCADOPAGO_PUBLIC_KEY=APP_USR-c8332e1c-0d62-4cad-...
FRONTEND_URL=https://aguamarinamosaicos.com
```

---

## 🔒 Seguridad y Autenticación

### Sistema de Autenticación JWT

```
┌────────────────────────────────────────────────────────────┐
│           FLUJO DE AUTENTICACIÓN JWT                       │
└────────────────────────────────────────────────────────────┘

1. LOGIN
   POST /api/v1/auth/login
   Body: { email, password }
   
   Backend:
   ├─> Buscar usuario por email
   ├─> Comparar password con bcrypt
   ├─> Generar access_token (JWT, 7 días)
   ├─> Generar refresh_token (JWT, 30 días)
   ├─> Guardar refresh_token en BD
   └─> Retornar: { accessToken, refreshToken, user }

2. PETICIONES AUTENTICADAS
   GET /api/v1/orders
   Headers: { Authorization: "Bearer <accessToken>" }
   
   Backend Middleware:
   ├─> Extraer token del header
   ├─> Verificar firma del JWT
   ├─> Decodificar payload
   ├─> Adjuntar user a req.user
   └─> Continuar a controller

3. TOKEN EXPIRADO
   Backend retorna: 401 Unauthorized
   
   Frontend:
   ├─> Detecta error 401
   ├─> POST /api/v1/auth/refresh
   │   Body: { refreshToken }
   ├─> Backend genera nuevo accessToken
   ├─> Frontend guarda nuevo token
   └─> Reintenta petición original

4. LOGOUT
   POST /api/v1/auth/logout
   
   Backend:
   ├─> Eliminar refresh_token de BD
   └─> Retornar success
   
   Frontend:
   ├─> Eliminar tokens de localStorage
   └─> Redirigir a /login
```

### Implementación de Middleware de Autenticación

```typescript
// backend/src/application/middleware/authenticate.ts

import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';

interface JWTPayload {
  userId: number;
  email: string;
  role: string;
}

/**
 * Middleware de autenticación
 * Verifica el JWT token en el header Authorization
 */
export async function authenticate(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    // 1. Extraer token del header
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        message: 'No se proporcionó token de autenticación'
      });
    }
    
    const token = authHeader.split(' ')[1];
    
    // 2. Verificar y decodificar token
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET!
    ) as JWTPayload;
    
    // 3. Buscar usuario en BD
    const user = await db.query(
      'SELECT id, email, role, name FROM users WHERE id = $1 AND is_active = true',
      [decoded.userId]
    );
    
    if (!user.rows[0]) {
      return res.status(401).json({
        success: false,
        message: 'Usuario no encontrado o inactivo'
      });
    }
    
    // 4. Adjuntar usuario a request
    req.user = user.rows[0];
    
    // 5. Continuar
    next();
    
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      return res.status(401).json({
        success: false,
        message: 'Token expirado',
        code: 'TOKEN_EXPIRED'
      });
    }
    
    if (error instanceof jwt.JsonWebTokenError) {
      return res.status(401).json({
        success: false,
        message: 'Token inválido'
      });
    }
    
    return res.status(500).json({
      success: false,
      message: 'Error de autenticación'
    });
  }
}

/**
 * Middleware de autorización por roles
 */
export function authorize(...allowedRoles: string[]) {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'No autenticado'
      });
    }
    
    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: 'No tienes permisos para realizar esta acción'
      });
    }
    
    next();
  };
}
```

### Uso en Rutas

```typescript
// backend/src/application/routes/products.routes.ts

import { authenticate, authorize } from '../middleware/authenticate';

// Ruta pública
router.get('/products', ProductsController.getAll);

// Ruta protegida (solo autenticados)
router.get('/products/my-favorites', authenticate, ProductsController.getMyFavorites);

// Ruta con autorización (solo admin y manager)
router.post('/products', authenticate, authorize('admin', 'manager'), ProductsController.create);

// Ruta solo admin
router.delete('/products/:id', authenticate, authorize('admin'), ProductsController.delete);
```

### Hash de Passwords con bcrypt

```typescript
// backend/src/application/controllers/AuthController.ts

import bcrypt from 'bcryptjs';

export class AuthController {
  /**
   * Registro de usuario
   */
  static async register(req: Request, res: Response) {
    const { email, password, name } = req.body;
    
    // Hash del password (10 rounds)
    const hashedPassword = await bcrypt.hash(password, 10);
    
    // Guardar usuario
    const user = await db.query(`
      INSERT INTO users (email, password, name, role)
      VALUES ($1, $2, $3, 'customer')
      RETURNING id, email, name, role
    `, [email, hashedPassword, name]);
    
    return res.status(201).json({
      success: true,
      data: user.rows[0]
    });
  }
  
  /**
   * Login de usuario
   */
  static async login(req: Request, res: Response) {
    const { email, password } = req.body;
    
    // Buscar usuario
    const user = await db.query(
      'SELECT * FROM users WHERE email = $1',
      [email]
    );
    
    if (!user.rows[0]) {
      return res.status(401).json({
        success: false,
        message: 'Credenciales inválidas'
      });
    }
    
    // Comparar password
    const isPasswordValid = await bcrypt.compare(
      password,
      user.rows[0].password
    );
    
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'Credenciales inválidas'
      });
    }
    
    // Generar tokens
    const accessToken = jwt.sign(
      {
        userId: user.rows[0].id,
        email: user.rows[0].email,
        role: user.rows[0].role
      },
      process.env.JWT_SECRET!,
      { expiresIn: '7d' }
    );
    
    const refreshToken = jwt.sign(
      { userId: user.rows[0].id },
      process.env.JWT_REFRESH_SECRET!,
      { expiresIn: '30d' }
    );
    
    // Guardar refresh token en BD
    await db.query(`
      INSERT INTO refresh_tokens (user_id, token, expires_at)
      VALUES ($1, $2, NOW() + INTERVAL '30 days')
    `, [user.rows[0].id, refreshToken]);
    
    return res.json({
      success: true,
      data: {
        accessToken,
        refreshToken,
        user: {
          id: user.rows[0].id,
          email: user.rows[0].email,
          name: user.rows[0].name,
          role: user.rows[0].role
        }
      }
    });
  }
}
```

### Medidas de Seguridad Implementadas

```typescript
// backend/src/app.ts

import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import cors from 'cors';

const app = express();

// 1. HELMET - Headers de seguridad HTTP
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https://res.cloudinary.com"],
    },
  },
  hsts: {
    maxAge: 31536000,
    includeSubDomains: true,
    preload: true
  },
  frameguard: { action: 'deny' },
  noSniff: true,
  xssFilter: true,
}));

// 2. CORS - Control de orígenes
app.use(cors({
  origin: process.env.CORS_ORIGINS?.split(',') || ['http://localhost:3000'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

// 3. RATE LIMITING - Prevención de ataques de fuerza bruta
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 100, // 100 requests por ventana
  message: 'Demasiadas peticiones desde esta IP',
  standardHeaders: true,
  legacyHeaders: false,
});

app.use('/api/', limiter);

// Rate limit estricto para login
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5, // 5 intentos por 15 minutos
  message: 'Demasiados intentos de login',
  skipSuccessfulRequests: true,
});

app.use('/api/v1/auth/login', loginLimiter);

// 4. VALIDACIÓN DE INPUT - Sanitización con Zod
import { z } from 'zod';

const loginSchema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(6, 'Password debe tener al menos 6 caracteres'),
});

// 5. SQL INJECTION PROTECTION - Prepared statements
// ✅ BIEN
const user = await db.query('SELECT * FROM users WHERE email = $1', [email]);

// ❌ MAL (vulnerable)
// const user = await db.query(`SELECT * FROM users WHERE email = '${email}'`);

// 6. XSS PROTECTION - Sanitización de output
import validator from 'validator';

const sanitizedComment = validator.escape(req.body.comment);
```

---

## 🚀 Infraestructura y DevOps

### Arquitectura de Deployment

```
┌─────────────────────────────────────────────────────────────────┐
│                    INFRAESTRUCTURA CLOUD                        │
└─────────────────────────────────────────────────────────────────┘

┌──────────────────┐
│  GitHub Repo     │
│  (Código fuente) │
└────────┬─────────┘
         │
         │ git push
         │
         ├────────────────────┬────────────────────┐
         │                    │                    │
         ▼                    ▼                    ▼
┌────────────────┐   ┌────────────────┐   ┌────────────────┐
│ Vercel         │   │ Vercel         │   │ Railway        │
│ (Frontend)     │   │ (Admin)        │   │ (Backend API)  │
│                │   │                │   │                │
│ aguamarina     │   │ admin.agua     │   │ Express +      │
│ mosaicos.com   │   │ marinamosaicos │   │ TypeScript     │
│                │   │ .com           │   │                │
│ Next.js 15     │   │ Next.js 15     │   │ PostgreSQL     │
│ SSR + SSG      │   │ React Admin    │   │ Valkey Cache   │
│ Edge Network   │   │ Dashboard      │   │ Cloudinary     │
└────────────────┘   └────────────────┘   └────────────────┘
         │                    │                    │
         │                    │                    │
         └────────────────────┼────────────────────┘
                              │
                              │ HTTPS/REST
                              │
                    ┌─────────▼──────────┐
                    │  Supabase          │
                    │  (PostgreSQL DB)   │
                    │                    │
                    │  - Auto Backups    │
                    │  - Point-in-time   │
                    │  - Dashboard UI    │
                    └────────────────────┘
```

### Configuración de Vercel (Frontend)

```javascript
// frontend/vercel.json
{
  "buildCommand": "npm run build",
  "outputDirectory": ".next",
  "framework": "nextjs",
  "regions": ["iad1"], // AWS US East (Virginia)
  "env": {
    "NEXT_PUBLIC_API_URL": "https://diligent-upliftment-production-54de.up.railway.app/api/v1",
    "NEXT_PUBLIC_SITE_URL": "https://aguamarinamosaicos.com"
  },
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        {
          "key": "X-Content-Type-Options",
          "value": "nosniff"
        },
        {
          "key": "X-Frame-Options",
          "value": "DENY"
        },
        {
          "key": "X-XSS-Protection",
          "value": "1; mode=block"
        }
      ]
    }
  ],
  "rewrites": [
    {
      "source": "/api/:path*",
      "destination": "https://diligent-upliftment-production-54de.up.railway.app/api/v1/:path*"
    }
  ]
}
```

### Configuración de Railway (Backend)

```toml
# backend/railway.toml
[build]
builder = "nixpacks"
buildCommand = "npm run build"

[deploy]
startCommand = "npm start"
healthcheckPath = "/health"
healthcheckTimeout = 100
restartPolicyType = "on_failure"
restartPolicyMaxRetries = 10

[env]
NODE_ENV = "production"
PORT = "3000"
```

```json
// backend/railway.json
{
  "$schema": "https://railway.app/railway.schema.json",
  "build": {
    "builder": "NIXPACKS"
  },
  "deploy": {
    "numReplicas": 1,
    "sleepApplication": false,
    "restartPolicyType": "ON_FAILURE",
    "restartPolicyMaxRetries": 10
  }
}
```

### Variables de Entorno por Servicio

#### Frontend (Vercel)
```env
NEXT_PUBLIC_API_URL=https://diligent-upliftment-production-54de.up.railway.app/api/v1
NEXT_PUBLIC_SITE_URL=https://aguamarinamosaicos.com
NEXT_PUBLIC_SUPABASE_URL=https://umyrvlzhvdsibpzvfnal.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
NODE_ENV=production
```

#### Admin Dashboard (Vercel)
```env
NEXT_PUBLIC_API_URL=https://diligent-upliftment-production-54de.up.railway.app/api/v1
NEXT_PUBLIC_SITE_URL=https://admin.aguamarinamosaicos.com
NEXT_PUBLIC_SUPABASE_URL=https://umyrvlzhvdsibpzvfnal.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

#### Backend (Railway)
```env
# Database
DATABASE_URL=postgresql://postgres.umyrvlzhvdsibpzvfnal:****@db.umyrvlzhvdsibpzvfnal.supabase.co:5432/postgres
DB_HOST=db.umyrvlzhvdsibpzvfnal.supabase.co
DB_PORT=5432
DB_NAME=postgres
DB_USER=postgres.umyrvlzhvdsibpzvfnal
DB_PASSWORD=****
DB_SSL=true
DB_MAX_CONNECTIONS=20

# JWT
JWT_SECRET=****
JWT_EXPIRES_IN=7d
JWT_REFRESH_SECRET=****
JWT_REFRESH_EXPIRES_IN=30d

# Valkey (Redis)
VALKEY_HOST=${{Valkey.RAILWAY_PRIVATE_NETWORK_HOST}}
VALKEY_PORT=6379
VALKEY_PASSWORD=${{Valkey.REDIS_PASSWORD}}
VALKEY_DB=0

# Cloudinary
CLOUDINARY_CLOUD_NAME=ddztbf1se
CLOUDINARY_API_KEY=128868447893278
CLOUDINARY_API_SECRET=****

# MercadoPago
MERCADOPAGO_ACCESS_TOKEN=APP_USR-****
MERCADOPAGO_PUBLIC_KEY=APP_USR-****

# Email
RESEND_API_KEY=re_****

# CORS
CORS_ORIGINS=https://aguamarinamosaicos.com,https://www.aguamarinamosaicos.com,https://admin.aguamarinamosaicos.com

# App
NODE_ENV=production
PORT=3000
FRONTEND_URL=https://aguamarinamosaicos.com
API_VERSION=v1
```

### CI/CD Pipeline

```
┌─────────────────────────────────────────────────────────────┐
│               CI/CD AUTOMATIZADO                            │
└─────────────────────────────────────────────────────────────┘

1. DEVELOPER PUSH
   git push origin main
   
2. GITHUB ACTIONS (Opcional)
   └─> Run tests
   └─> Run linter
   └─> Build check
   
3. VERCEL AUTO-DEPLOY (Frontend + Admin)
   └─> Detecta push a main
   └─> Build automático
   └─> Deploy a producción
   └─> URL preview para PRs
   └─> Invalidate cache
   
4. RAILWAY AUTO-DEPLOY (Backend)
   └─> Detecta push a main
   └─> npm run build
   └─> Health check
   └─> Rolling deployment (zero downtime)
   └─> Rollback automático si falla
   
5. VERIFICACIÓN
   └─> Health checks pasan
   └─> Logs sin errores
   └─> Monitoreo activo
```

### Monitoreo y Logs

```typescript
// backend/src/shared/logger.ts

import winston from 'winston';

const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.json()
  ),
  defaultMeta: {
    service: 'aguamarina-backend',
    environment: process.env.NODE_ENV
  },
  transports: [
    // Consola (Railway logs)
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.simple()
      )
    }),
    
    // Archivo de errores
    new winston.transports.File({
      filename: 'logs/error.log',
      level: 'error',
      maxsize: 5242880, // 5MB
      maxFiles: 5,
    }),
    
    // Archivo general
    new winston.transports.File({
      filename: 'logs/combined.log',
      maxsize: 5242880,
      maxFiles: 5,
    })
  ]
});

export default logger;
```

---

## 📊 Flujos de Datos Principales

### 1. Flujo de Compra Completa

```
USUARIO → Frontend → Backend → PostgreSQL → MercadoPago → Email → Usuario
  │         │          │           │            │           │         │
  │         │          │           │            │           │         │
  ▼         ▼          ▼           ▼            ▼           ▼         ▼
Browse → Add Cart → Create → Save Order → Create → Update → Send → Confirm
        Products   Order                Preference  Status   Email
```

### 2. Flujo de Autenticación

```
1. POST /auth/login
   └─> Validate credentials
       └─> Generate JWT tokens
           └─> Save refresh token
               └─> Return tokens + user data

2. GET /orders (with token)
   └─> Validate JWT
       └─> Check user permissions
           └─> Fetch user's orders
               └─> Return data

3. POST /auth/refresh (token expired)
   └─> Validate refresh token
       └─> Generate new access token
           └─> Return new token
```

### 3. Flujo de Cache (Valkey)

```
GET /products
  │
  ├─> Check Valkey cache
  │   └─> HIT: Return cached data (fast)
  │   └─> MISS: Query PostgreSQL
  │       └─> Save to cache (TTL: 5min)
  │       └─> Return data
  
POST /products (create/update)
  │
  └─> Save to PostgreSQL
      └─> Invalidate related cache keys
          └─> Return data
```

---

## 🎓 Conclusión

Esta arquitectura de **Aguamarina Mosaicos** representa un sistema **profesional, escalable y mantenible** diseñado con las mejores prácticas de la industria:

### ✅ Fortalezas

- **Clean Architecture** - Separación clara de responsabilidades
- **Type Safety** - TypeScript en todo el stack
- **Security First** - JWT, bcrypt, Helmet, Rate Limiting
- **Performance** - Caché con Valkey, índices optimizados
- **Scalability** - Preparado para escalar horizontalmente
- **Developer Experience** - Documentación completa, código limpio

### 📈 Preparado para el Futuro

- Fácil migración a microservicios
- Compatible con Kubernetes/Docker
- Ready para GraphQL
- Extensible con nuevas features
- Monitoreo y observabilidad integrados

---

**Documentación generada:** Diciembre 2025  
**Versión de Arquitectura:** 2.0  
**Estado:** ✅ Producción Ready
