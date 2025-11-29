# Stack Tecnológico - Aguamarina Mosaicos E-commerce

## Descripción General del Sistema

Sistema completo de e-commerce dividido en **tres aplicaciones independientes**:
- **Frontend**: Tienda pública para clientes
- **Admin Dashboard**: Panel de administración
- **Backend**: API REST con arquitectura limpia

---

## 1. FRONTEND (Tienda Pública)

### Framework Principal
- **Next.js 15.5.4** (App Router)
  - Configuración: `next dev --turbopack` (Turbopack para desarrollo ultra-rápido)
  - Renderizado híbrido: SSR + SSG + ISR
  - App Router con layouts y metadata API
  - File-based routing

### Runtime y Lenguaje
- **React 19.1.0** (última versión estable)
- **React DOM 19.1.0**
- **TypeScript 5.x**
  - Target: ES2017
  - Strict mode habilitado
  - Module resolution: bundler
  - Path aliases: `@/*` apunta a raíz del proyecto

### Estilos y UI
- **Tailwind CSS 4.x** (última versión)
  - PostCSS: `@tailwindcss/postcss`
  - Plugins: `tailwindcss-animate`
  - Utilidades: `tailwind-merge` (merge de clases), `clsx`
  - `class-variance-authority` (variantes de componentes)

### Componentes UI
- **Radix UI** (componentes headless accesibles):
  - `@radix-ui/react-accordion`
  - `@radix-ui/react-avatar`
  - `@radix-ui/react-checkbox`
  - `@radix-ui/react-dialog`
  - `@radix-ui/react-dropdown-menu`
  - `@radix-ui/react-icons`
  - `@radix-ui/react-label`
  - `@radix-ui/react-progress`
  - `@radix-ui/react-radio-group`
  - `@radix-ui/react-select`
  - `@radix-ui/react-separator`
  - `@radix-ui/react-slot`

- **Lucide React 0.545.0** (iconografía moderna)

### Animaciones
- **GSAP 3.13.0** (GreenSock Animation Platform)
  - `@gsap/react` 2.1.2
  - `gsap-trial` 3.12.7 (versión trial con plugins premium)
  - `split-type` 0.3.4 (animaciones de texto)

- **Framer Motion 12.23.24** (animaciones declarativas)
- **Lenis 1.3.11** (smooth scrolling)
- **canvas-confetti 1.9.3** (efectos de confetti)

### Estado y Data Fetching
- **Zustand 5.0.8** (state management ligero y moderno)
- **TanStack Query 5.90.2** (React Query para cache y sincronización)
- **Axios 1.12.2** (HTTP client)

### Pagos
- **Mercado Pago**:
  - `@mercadopago/sdk-js` 0.0.3
  - `@mercadopago/sdk-react` 1.0.6
  - Checkout Pro integrado

### Utilidades
- **next-themes 0.4.6** (modo oscuro/claro)
- **sonner 2.0.7** (notificaciones toast elegantes)
- **qrcode.react 4.2.0** (generación de códigos QR)

### Configuración Next.js
```typescript
// next.config.ts
{
  // Optimización de imágenes
  images: {
    remotePatterns: [
      { hostname: "*.cloudinary.com" },
      { hostname: "*.amazonaws.com" },
      { hostname: "images.unsplash.com" }
    ],
    formats: ["image/avif", "image/webp"]
  },

  // Headers de seguridad
  headers: [
    "X-DNS-Prefetch-Control",
    "Strict-Transport-Security",
    "X-Frame-Options: SAMEORIGIN",
    "X-Content-Type-Options: nosniff",
    "X-XSS-Protection",
    "Referrer-Policy",
    "Permissions-Policy",
    "Content-Security-Policy"
  ],

  // Optimizaciones
  compress: true,
  reactStrictMode: true,
  poweredByHeader: false,
  experimental: {
    optimizePackageImports: ['lucide-react', '@radix-ui/react-icons']
  }
}
```

### Testing
- **Test E2E**: `test-e2e.mjs` (custom end-to-end tests)

### Linting
- **ESLint 9.x**
- **eslint-config-next 15.5.4**

---

## 2. ADMIN DASHBOARD (Panel de Administración)

### Framework Principal
- **Next.js 15.5.4** (App Router)
  - Build con Turbopack: `next build --turbopack`
  - Renderizado del lado del cliente (CSR) principalmente

### Runtime y Lenguaje
- **React 19.1.0**
- **React DOM 19.1.0**
- **TypeScript 5.x**
  - Target: ES2017
  - Strict mode habilitado
  - Path aliases: `@/*` apunta a `./src/*`

### Estilos y UI
- **Tailwind CSS 4.x**
  - PostCSS: `@tailwindcss/postcss`
  - Plugin: `tailwindcss-animate`
  - Utilidades: `tailwind-merge`, `clsx`, `class-variance-authority`

### Componentes UI
- **Radix UI** (componentes headless):
  - `@radix-ui/react-alert-dialog`
  - `@radix-ui/react-avatar`
  - `@radix-ui/react-checkbox`
  - `@radix-ui/react-dialog`
  - `@radix-ui/react-dropdown-menu`
  - `@radix-ui/react-icons`
  - `@radix-ui/react-label`
  - `@radix-ui/react-popover`
  - `@radix-ui/react-radio-group`
  - `@radix-ui/react-select`
  - `@radix-ui/react-separator`
  - `@radix-ui/react-slot`
  - `@radix-ui/react-switch`
  - `@radix-ui/react-tabs`

- **Lucide React 0.545.0** (iconos)
- **cmdk 1.1.1** (command menu / command palette)

### Formularios
- **React Hook Form 7.65.0** (gestión de formularios performante)
- **@hookform/resolvers 5.2.2** (integración con validadores)
- **Zod 4.1.12** (validación de esquemas TypeScript-first)

### Gráficos y Visualización
- **Recharts 3.2.1** (gráficos y dashboards)
- **date-fns 4.1.0** (manejo de fechas)
- **react-day-picker 9.11.1** (selector de fechas)

### Estado y Data Fetching
- **Zustand 5.0.8** (state management)
- **TanStack Query 5.90.2** (React Query)
- **@tanstack/react-query-devtools 5.90.2** (herramientas de desarrollo)
- **Axios 1.12.2** (HTTP client)

### Upload de Archivos
- **react-dropzone 14.3.8** (drag & drop de archivos)
  - Integración con Cloudinary para imágenes

### Utilidades
- **sonner 2.0.7** (notificaciones toast)

### Configuración Next.js
```typescript
// next.config.ts
{
  // React Strict Mode deshabilitado temporalmente
  // debido a incompatibilidad entre React 19 y Radix UI Portals
  reactStrictMode: false,

  // Imágenes remotas permitidas
  images: {
    remotePatterns: [
      { hostname: "images.unsplash.com" },
      { hostname: "*.amazonaws.com" },
      { hostname: "*.cloudinary.com" }
    ]
  }
}
```

### Linting
- **ESLint 9.x**
- **eslint-config-next 15.5.4**

---

## 3. BACKEND (API REST)

### Arquitectura
- **Clean Architecture** (Arquitectura Limpia)
  - **Domain**: Entidades y lógica de negocio pura
  - **Application**: Casos de uso y servicios de aplicación
  - **Infrastructure**: Implementaciones concretas (DB, APIs externas)
  - **Shared**: Utilidades compartidas

### Runtime y Lenguaje
- **Node.js >= 18.0.0**
- **npm >= 9.0.0**
- **TypeScript 5.3.3**
  - Target: ES2022
  - Module: CommonJS
  - Strict mode habilitado
  - Source maps para debugging
  - Path aliases:
    - `@domain/*` → `src/domain/*`
    - `@infrastructure/*` → `src/infrastructure/*`
    - `@application/*` → `src/application/*`
    - `@shared/*` → `src/shared/*`
    - `@config/*` → `config/*`

### Framework Web
- **Express 4.18.2**
  - `compression 1.7.4` (compresión gzip)
  - `helmet 7.1.0` (headers de seguridad)
  - `cors 2.8.5` (CORS configurado)
  - `express-rate-limit 7.1.5` (rate limiting)
  - `express-validator 7.0.1` (validación de requests)

### Base de Datos
- **PostgreSQL** (via Supabase)
  - **pg 8.11.3** (cliente PostgreSQL para Node.js)
  - Migrations: Script custom con TypeScript
  - Seeds: Script de datos iniciales

### Cache
- **ioredis 5.8.1** (Redis client para Node.js)
  - Cache de consultas frecuentes
  - Session storage

### Autenticación
- **jsonwebtoken 9.0.2** (JWT tokens)
- **bcryptjs 2.4.3** (hash de passwords)

### Storage de Imágenes
- **Cloudinary 1.41.3**
  - Upload de imágenes de productos y categorías
  - Transformaciones automáticas
  - CDN global

### Procesamiento de Imágenes
- **sharp 0.33.1** (optimización y redimensionamiento)
- **multer 1.4.5-lts.1** (manejo de multipart/form-data)

### Pagos
- **mercadopago 2.9.0** (SDK oficial de Mercado Pago)
  - Checkout Pro
  - Webhooks para notificaciones

### Email
- **Resend 6.3.0** (servicio de email moderno)
- **Nodemailer 7.0.10** (fallback para emails)
  - `@types/nodemailer 7.0.3`

### Validación
- **Zod 3.22.4** (validación de esquemas type-safe)

### Logging
- **Winston 3.11.0** (logger profesional)
  - Logs estructurados
  - Múltiples transportes (console, file)
  - Niveles: error, warn, info, debug

### Documentación API
- **Swagger**:
  - `swagger-jsdoc 6.2.8` (generación de docs desde código)
  - `swagger-ui-express 5.0.0` (UI interactiva)
  - `yamljs 0.3.0` (parseo de YAML)

### Development Tools
- **tsx 4.7.0** (ejecutor de TypeScript para desarrollo)
- **ts-jest 29.1.1** (Jest con soporte TypeScript)
- **jest 29.7.0** (testing framework)

### Deployment
- **@vercel/node 5.3.26** (compatibilidad con Vercel Functions)
- Actualmente desplegado en **Railway**

### Scripts Disponibles
```json
{
  "dev": "tsx watch src/server.ts",           // Desarrollo con hot reload
  "build": "tsc",                              // Compilar TypeScript
  "start": "node dist/server.js",              // Producción
  "db:create": "node scripts/crear-db.js",     // Crear base de datos
  "db:migrate": "tsx src/infrastructure/database/migrate.ts",
  "db:seed": "tsx src/infrastructure/database/seed.ts",
  "db:reset": "tsx src/infrastructure/database/reset.ts",
  "db:setup": "npm run db:create && npm run db:migrate && npm run db:seed",
  "lint": "eslint src --ext .ts",
  "format": "prettier --write \"src/**/*.ts\"",
  "test": "jest"
}
```

### Linting y Formatting
- **ESLint 8.56.0**
  - `@typescript-eslint/eslint-plugin 6.17.0`
  - `@typescript-eslint/parser 6.17.0`
- **Prettier 3.1.1** (code formatting)

---

## Servicios Externos Integrados

### 1. Cloudinary
- **Almacenamiento de imágenes**
- **CDN global**
- **Transformaciones automáticas** (resize, crop, format)
- Cloud Name: `ddztbf1se`

### 2. Mercado Pago
- **Checkout Pro** (pasarela de pagos)
- **Webhooks** para notificaciones de pago
- Configuración para Argentina

### 3. Resend
- **Email transaccional**
- Formularios de contacto
- Notificaciones de pedidos

### 4. Supabase
- **PostgreSQL** gestionado
- Backup automático
- Dashboard de administración

### 5. Vercel
- **Hosting del Frontend**: `https://aguamarinamosaicos.com`
- **Hosting del Admin**: `https://admin.aguamarinamosaicos.com`
- Deploy automático desde GitHub
- Edge Network global
- Analytics y Web Vitals

### 6. Railway
- **Hosting del Backend**: `https://diligent-upliftment-production-54de.up.railway.app`
- Deploy desde GitHub
- Variables de entorno gestionadas
- Logs en tiempo real

### 7. Google Search Console
- SEO monitoring
- Sitemap submission
- Verificación: `googlef19113adbfe98ecb.html`

---

## Características Técnicas Destacadas

### Frontend
✅ **PWA** (Progressive Web App) con manifest.json completo
✅ **SEO optimizado**: Meta tags, Open Graph, Twitter Cards, canonical URLs
✅ **Performance**: Turbopack, optimización de imágenes (AVIF/WebP)
✅ **Animaciones avanzadas**: GSAP + Framer Motion
✅ **Smooth scrolling**: Lenis
✅ **Accesibilidad**: Radix UI (ARIA compliant)
✅ **Seguridad**: CSP, HSTS, X-Frame-Options
✅ **Modo oscuro/claro**: next-themes

### Admin Dashboard
✅ **Gestión completa de productos** con SKU auto-generado
✅ **Categorías jerárquicas** (categorías y subcategorías)
✅ **Upload múltiple de imágenes** (hasta 8 por producto)
✅ **Gráficos y analytics**: Recharts
✅ **Formularios robustos**: React Hook Form + Zod
✅ **Command Palette**: cmdk para navegación rápida
✅ **DevTools**: React Query Devtools

### Backend
✅ **Clean Architecture** (separación de concerns)
✅ **Type-safe**: TypeScript + Zod
✅ **API RESTful** documentada con Swagger
✅ **Autenticación JWT** con refresh tokens
✅ **Rate limiting** para prevenir abuso
✅ **Cache con Redis** para performance
✅ **Logs estructurados**: Winston
✅ **Migrations** y seeds automatizados
✅ **Testing**: Jest con ts-jest

---

## Compatibilidad de Navegadores

### Frontend y Admin Dashboard
- Chrome/Edge: últimas 2 versiones
- Firefox: últimas 2 versiones
- Safari: últimas 2 versiones
- Target: ES2017 (soporte para async/await nativo)

### Backend
- Node.js >= 18.0.0
- npm >= 9.0.0
- Target: ES2022

---

## Estructura de Carpetas

### Frontend
```
frontend/
├── app/                    # App Router (Next.js 15)
│   ├── layout.tsx         # Root layout
│   ├── page.tsx           # Home page
│   ├── productos/         # Productos routes
│   ├── carrito/           # Carrito routes
│   └── contacto/          # Contacto routes
├── components/            # Componentes React
├── public/               # Assets estáticos (favicons, manifest)
├── next.config.ts        # Configuración Next.js
├── tailwind.config.ts    # Configuración Tailwind
└── tsconfig.json         # Configuración TypeScript
```

### Admin Dashboard
```
admin-dashboard/
├── src/
│   ├── app/
│   │   └── dashboard/    # Rutas del dashboard
│   │       ├── categories/
│   │       ├── products/
│   │       ├── orders/
│   │       └── analytics/
│   └── components/       # Componentes React
├── next.config.ts
├── tailwind.config.ts
└── tsconfig.json
```

### Backend
```
backend/
├── src/
│   ├── domain/           # Entidades de negocio
│   ├── application/      # Casos de uso
│   │   ├── routes/      # Rutas Express
│   │   ├── middlewares/ # Middlewares
│   │   └── services/    # Servicios de aplicación
│   ├── infrastructure/   # Implementaciones
│   │   ├── database/    # PostgreSQL
│   │   ├── cache/       # Redis
│   │   └── external/    # APIs externas
│   ├── shared/          # Utilidades compartidas
│   ├── config/          # Configuración
│   ├── app.ts           # Configuración Express
│   └── server.ts        # Entry point
├── api/                 # Vercel Functions (opcional)
├── dist/                # Build output
└── tsconfig.json
```

---

## Variables de Entorno

### Frontend (.env.local)
```env
NEXT_PUBLIC_API_URL=https://diligent-upliftment-production-54de.up.railway.app/api/v1
NEXT_PUBLIC_SITE_URL=https://aguamarinamosaicos.com
NEXT_PUBLIC_SUPABASE_URL=https://umyrvlzhvdsibpzvfnal.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
NEXT_PUBLIC_MERCADOPAGO_PUBLIC_KEY=APP_USR-...
```

### Admin Dashboard (.env.local)
```env
NEXT_PUBLIC_API_URL=https://diligent-upliftment-production-54de.up.railway.app/api/v1
NEXT_PUBLIC_SITE_URL=https://admin.aguamarinamosaicos.com
NEXT_PUBLIC_SUPABASE_URL=https://umyrvlzhvdsibpzvfnal.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### Backend (.env)
```env
# Database
DATABASE_URL=postgresql://postgres.umyrvlzhvdsibpzvfnal:Aguamarina@mosaicos@...
DB_HOST=db.umyrvlzhvdsibpzvfnal.supabase.co
DB_PORT=5432
DB_NAME=postgres
DB_USER=postgres.umyrvlzhvdsibpzvfnal
DB_PASSWORD=Aguamarina@mosaicos

# JWT
JWT_SECRET=aguamarina_jwt_secret_key_production_2024_very_secure...
JWT_EXPIRES_IN=7d

# Cloudinary
CLOUDINARY_CLOUD_NAME=ddztbf1se
CLOUDINARY_API_KEY=128868447893278
CLOUDINARY_API_SECRET=...

# Mercado Pago
MERCADOPAGO_ACCESS_TOKEN=APP_USR-...
MERCADOPAGO_PUBLIC_KEY=APP_USR-...

# Resend
RESEND_API_KEY=re_...

# Redis (opcional)
REDIS_URL=redis://...

# App
NODE_ENV=production
PORT=3000
FRONTEND_URL=https://aguamarinamosaicos.com
```

---

## Comandos de Desarrollo

### Frontend
```bash
npm run dev          # Desarrollo con Turbopack
npm run build        # Build de producción
npm run start        # Servidor de producción
npm run lint         # Linter
npm run test:e2e     # Tests E2E
```

### Admin Dashboard
```bash
npm run dev          # Desarrollo con Turbopack
npm run build        # Build de producción (con Turbopack)
npm run start        # Servidor de producción
npm run lint         # Linter
```

### Backend
```bash
npm run dev          # Desarrollo con hot reload
npm run build        # Compilar TypeScript
npm run start        # Producción
npm run db:setup     # Crear DB + migrations + seeds
npm run db:migrate   # Solo migrations
npm run db:seed      # Solo seeds
npm run db:reset     # Reset completo
npm run lint         # Linter
npm run format       # Prettier
npm run test         # Tests con Jest
```

---

## URLs de Producción

- **Frontend**: https://aguamarinamosaicos.com
- **Admin Dashboard**: https://admin.aguamarinamosaicos.com
- **Backend API**: https://diligent-upliftment-production-54de.up.railway.app/api/v1
- **API Docs (Swagger)**: https://diligent-upliftment-production-54de.up.railway.app/api-docs

---

## Recursos y Documentación

### Framework y Librerías
- [Next.js 15 Documentation](https://nextjs.org/docs)
- [React 19 Documentation](https://react.dev)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Tailwind CSS v4](https://tailwindcss.com/docs)
- [Radix UI Primitives](https://www.radix-ui.com/primitives)
- [TanStack Query](https://tanstack.com/query/latest)
- [Zustand](https://zustand-demo.pmnd.rs/)
- [GSAP](https://gsap.com/docs/)
- [Framer Motion](https://www.framer.com/motion/)

### Backend
- [Express.js](https://expressjs.com/)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
- [Zod](https://zod.dev/)
- [Winston Logger](https://github.com/winstonjs/winston)

### Servicios
- [Cloudinary Docs](https://cloudinary.com/documentation)
- [Mercado Pago Developers](https://www.mercadopago.com.ar/developers)
- [Resend Docs](https://resend.com/docs)
- [Supabase Docs](https://supabase.com/docs)
- [Vercel Docs](https://vercel.com/docs)
- [Railway Docs](https://docs.railway.app/)

---

## Versión del Documento

**Versión**: 1.0.0
**Fecha**: Noviembre 2025
**Autor**: Documentación generada para Aguamarina Mosaicos
