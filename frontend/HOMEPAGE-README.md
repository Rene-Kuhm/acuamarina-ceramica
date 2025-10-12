# Homepage - Aguamarina Mosaicos

## Resumen

Homepage profesional y atractiva para la tienda e-commerce de Aguamarina Mosaicos, construida con Next.js 15, TypeScript, Tailwind CSS y shadcn/ui.

## Archivos Creados

### Componentes

#### 1. ProductCard Component
**Ubicación:** `D:\acuamarina-ceramicos\frontend\components\productos\ProductCard.tsx`

Componente de tarjeta de producto con las siguientes características:
- Imagen del producto con Next.js Image optimization
- Badge de estado (Destacado, Sin Stock, Ultimas unidades)
- Información del producto (nombre, categoría, precio)
- Botón "Agregar al Carrito" con integración al Zustand store
- Link al detalle del producto
- Hover effects con elevación y borde cyan
- Formato de precio en pesos argentinos
- Manejo de productos sin stock
- TypeScript types completos
- Responsive design

**Props:**
```typescript
interface ProductCardProps {
  product: Producto;
  featured?: boolean;
  className?: string;
}
```

#### 2. ProductGrid Component
**Ubicación:** `D:\acuamarina-ceramicos\frontend\components\productos\ProductGrid.tsx`

Grid responsivo de productos con:
- Grid configurable por breakpoints (sm, md, lg, xl)
- Loading state con Skeleton components
- Empty state cuando no hay productos
- Soporte para productos destacados
- Grid responsive (1 columna mobile, hasta 4 en desktop)

**Props:**
```typescript
interface ProductGridProps {
  products?: Producto[];
  isLoading?: boolean;
  featured?: boolean;
  columns?: {
    sm?: number;
    md?: number;
    lg?: number;
    xl?: number;
  };
  className?: string;
}
```

#### 3. Barrel Export
**Ubicación:** `D:\acuamarina-ceramicos\frontend\components\productos\index.ts`

Archivo de exportación centralizado para facilitar imports.

### Hooks

#### useProducts Hook
**Ubicación:** `D:\acuamarina-ceramicos\frontend\lib\hooks\useProducts.ts`

Hooks de React Query para manejo de productos:
- `useProductsDestacados()` - Fetch productos destacados
- `useProducts(params)` - Fetch productos con filtros
- `useProduct(slug)` - Fetch producto por slug
- `useProductById(id)` - Fetch producto por ID

Características:
- React Query para cache y estado
- Error handling
- TypeScript types completos
- Stale time de 5 minutos

**Actualizado:** `D:\acuamarina-ceramicos\frontend\lib\hooks\index.ts` para exportar los nuevos hooks.

### Homepage

#### app/page.tsx
**Ubicación:** `D:\acuamarina-ceramicos\frontend\app\page.tsx`

Homepage completa con las siguientes secciones:

##### 1. Hero Section
- Título principal "Aguamarina Mosaicos" con gradiente cyan
- Subtítulo "Calidad y elegancia en cada mosaico"
- Descripción del negocio
- 2 botones CTA: "Ver Productos" y "Explorar Categorías"
- Background con gradiente y orbes decorativos animados
- Badge de bienvenida con icono
- Altura mínima 600px, totalmente responsive
- Animación fade-in

##### 2. Categorías Destacadas
- Grid de 4 categorías principales
- Responsive: 4 cols desktop, 2 cols tablet, 1 col mobile
- Cards con:
  - Iconos de lucide-react (Shapes, Palette, Layers, Grid3x3)
  - Título y descripción
  - Hover effects con elevación, escala y borde cyan
  - Transición del icono (fondo y color)
  - Link a cada categoría
- Categorías incluidas:
  - Mosaicos Cerámicos
  - Azulejos Decorativos
  - Revestimientos
  - Pisos Cerámicos

##### 3. Productos Destacados
- Título de sección
- ProductGrid component con productos destacados
- Fetch con React Query (useProductsDestacados)
- Grid: 4 cols desktop, 3 tablet, 2 mobile, 1 small
- Loading state con Skeletons
- Empty state si no hay productos
- Botón "Ver Todos los Productos"
- Badge "Destacado" en cada producto

##### 4. Beneficios
- Grid de 3 beneficios (3 cols desktop, 1 col mobile)
- Cada beneficio con:
  - Icono grande en círculo cyan
  - Título y descripción
- Beneficios:
  - Envío Gratis (en compras >$50.000)
  - Calidad Garantizada
  - Atención Personalizada (24/7)

##### 5. Call-to-Action Final
- Banner con gradiente cyan a blue
- Título "¿Necesitas Asesoramiento?"
- Descripción del servicio
- Botón "Contactar Ahora" (outline white)
- Texto centrado, padding generoso

## Estructura de Carpetas

```
D:\acuamarina-ceramicos\frontend\
├── app/
│   ├── page.tsx                    # Homepage principal
│   ├── layout.tsx                  # Layout principal
│   └── globals.css                 # Estilos globales y animaciones
├── components/
│   ├── productos/
│   │   ├── ProductCard.tsx         # Componente de tarjeta de producto
│   │   ├── ProductGrid.tsx         # Grid de productos
│   │   └── index.ts                # Barrel export
│   ├── ui/                         # shadcn/ui components
│   │   ├── card.tsx
│   │   ├── button.tsx
│   │   ├── badge.tsx
│   │   └── skeleton.tsx
│   └── layout/
│       ├── Header.tsx
│       └── Footer.tsx
├── lib/
│   ├── hooks/
│   │   ├── useProducts.ts          # Hooks de productos
│   │   ├── useCart.ts              # Hook del carrito
│   │   ├── useAuth.ts              # Hook de autenticación
│   │   └── index.ts                # Barrel export
│   ├── api/
│   │   ├── productos.ts            # API de productos
│   │   ├── categorias.ts           # API de categorías
│   │   ├── auth.ts                 # API de autenticación
│   │   └── client.ts               # Cliente API
│   ├── store/
│   │   ├── cart.ts                 # Zustand store del carrito
│   │   └── index.ts
│   └── utils/
│       ├── cn.ts                   # Utility de classnames
│       └── index.ts
└── public/
    └── images/                     # Imágenes del sitio
```

## Tecnologías Utilizadas

- **Next.js 15** - Framework React con App Router
- **TypeScript** - Tipado estático
- **Tailwind CSS** - Utility-first CSS framework
- **shadcn/ui** - Componentes UI accesibles
- **React Query** - Data fetching y cache
- **Zustand** - State management
- **lucide-react** - Iconos
- **Next.js Image** - Optimización de imágenes

## Características Principales

### 1. Mobile-First Responsive Design
- Breakpoints: sm (640px), md (768px), lg (1024px), xl (1280px)
- Grid adaptativo en todas las secciones
- Imágenes optimizadas para cada viewport

### 2. Animaciones y Transiciones
- Fade-in en hero section
- Pulse animation en orbes decorativos
- Hover effects en todos los elementos interactivos
- Transiciones suaves (duration-300)
- Scale y shadow en hover de cards

### 3. Gradientes Acuamarina
- Hero: cyan-50 via white to blue-50
- Título: cyan-600 to blue-600
- CTA final: cyan-600 to blue-600
- Hover borders: cyan-500/50

### 4. Accesibilidad
- Semantic HTML (section, header, nav)
- aria-labels donde corresponde
- Focus visible styles
- Keyboard navigation
- Color contrast ratios adecuados

### 5. Performance
- Next.js Image con lazy loading
- React Query cache (5 min stale time)
- Component code splitting
- Optimized bundle size

### 6. TypeScript
- Types completos en todos los componentes
- Interfaces bien definidas
- Type safety en props y state
- API response types

## Estilos y Diseño

### Paleta de Colores
- **Primary:** #0891b2 (cyan-600)
- **Secondary:** #f0fdfa (cyan-50)
- **Accent:** #14b8a6 (teal-500)
- **Background:** #fafbfc
- **Text:** #0f172a

### Espaciado
- Container padding: px-4
- Section padding: py-16 md:py-24
- Grid gap: gap-6
- Button padding: px-8 py-6

### Typography
- Hero title: text-5xl md:text-6xl lg:text-7xl
- Section titles: text-3xl md:text-4xl
- Body text: text-lg md:text-xl
- Card titles: text-xl
- Font: Geist Sans

### Shadows
- Card hover: shadow-xl
- Button default: shadow-lg
- Button hover: shadow-xl

## Integración con Backend

### API Endpoints Utilizados
- `GET /products/destacados` - Productos destacados

### Types de API
```typescript
interface Producto {
  id: number;
  name: string;
  slug: string;
  description: string;
  price: number;
  stock: number;
  images: string[];
  categoryId: number;
  category?: {
    id: number;
    name: string;
    slug: string;
  };
  specifications: Record<string, string>;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}
```

## Funcionalidad del Carrito

El ProductCard integra el hook `useCart()` de Zustand:
- Agregar productos al carrito
- Validación de stock
- Persistencia en localStorage
- Actualización de cantidad
- Notificaciones visuales

### Datos del Carrito
```typescript
interface CartItem {
  id: number;
  name: string;
  slug: string;
  price: number;
  quantity: number;
  image: string;
  stock: number;
}
```

## Estados de Carga

### Loading States
- ProductGrid muestra Skeletons mientras carga
- Skeleton incluye:
  - Imagen placeholder
  - Líneas de texto placeholder
  - Botón placeholder
  - Animación pulse

### Empty States
- Icono informativo
- Mensaje amigable
- Sugerencia para volver más tarde

### Error Handling
- React Query maneja errores automáticamente
- Retry automático en caso de fallo
- Estados de error claros

## Links de Navegación

La homepage incluye links a:
- `/productos` - Catálogo completo
- `/categorias` - Página de categorías
- `/categorias/[slug]` - Categoría específica
- `/productos/[slug]` - Detalle del producto
- `/contacto` - Página de contacto

## Próximos Pasos

### Mejoras Sugeridas
1. Agregar página de detalle de producto
2. Implementar filtros y búsqueda
3. Agregar página de categorías
4. Implementar página de contacto
5. Agregar newsletter signup
6. Implementar breadcrumbs
7. Agregar reviews de productos
8. Implementar zoom en imágenes
9. Agregar comparación de productos
10. Implementar wishlist

### Optimizaciones
1. Implementar ISR para productos destacados
2. Agregar meta tags dinámicos
3. Implementar sitemap
4. Agregar robots.txt
5. Implementar analytics
6. Optimizar imágenes con WebP
7. Implementar service worker
8. Agregar PWA support

## Testing

### Para Testing Manual
1. Verificar responsive design en diferentes dispositivos
2. Probar hover effects en todos los elementos
3. Validar navegación entre páginas
4. Probar agregar productos al carrito
5. Verificar loading states
6. Probar con productos sin stock
7. Validar accesibilidad con screen reader

### Para Testing Automatizado
```bash
# Unit tests (cuando se implementen)
npm run test

# E2E tests (cuando se implementen)
npm run test:e2e
```

## Comandos

```bash
# Desarrollo
npm run dev

# Build
npm run build

# Production
npm start

# Linting
npm run lint
```

## Estructura de Datos de Ejemplo

```typescript
// Producto Destacado Ejemplo
{
  id: 1,
  name: "Mosaico Cerámico Blanco Brillante 30x30cm",
  slug: "mosaico-ceramico-blanco-brillante-30x30",
  description: "Mosaico cerámico de alta calidad...",
  price: 2500,
  stock: 150,
  images: ["/images/products/mosaico-blanco-1.jpg"],
  categoryId: 1,
  category: {
    id: 1,
    name: "Mosaicos Cerámicos",
    slug: "mosaicos-ceramicos"
  },
  specifications: {
    "Tamaño": "30x30cm",
    "Material": "Cerámica",
    "Acabado": "Brillante"
  },
  isActive: true,
  createdAt: "2025-01-01T00:00:00Z",
  updatedAt: "2025-01-01T00:00:00Z"
}
```

## Notas Importantes

1. **Imágenes**: Actualmente usa placeholder. Agregar imágenes reales en `/public/images/products/`
2. **SEO**: Los meta tags están en `app/layout.tsx`. Considerar meta tags dinámicos por página
3. **Performance**: React Query cache configurado a 5 minutos. Ajustar según necesidad
4. **Responsive**: Probado en Chrome DevTools. Validar en dispositivos reales
5. **Accesibilidad**: Implementado según WCAG 2.1. Validar con herramientas como Lighthouse
6. **Browser Support**: Optimizado para navegadores modernos (Chrome, Firefox, Safari, Edge)

## Soporte

Para preguntas o problemas:
- Revisar documentación de Next.js: https://nextjs.org/docs
- Revisar documentación de shadcn/ui: https://ui.shadcn.com
- Revisar documentación de Tailwind: https://tailwindcss.com/docs

---

Desarrollado con Next.js 15, TypeScript, Tailwind CSS y shadcn/ui.
