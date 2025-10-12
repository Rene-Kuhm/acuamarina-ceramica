# Arquitectura del Proyecto - Aguamarina Mosaicos Frontend

## Descripción General

Frontend de e-commerce para Aguamarina Mosaicos, construido con **Next.js 15**, **TypeScript**, **Tailwind CSS**, y **shadcn/ui**.

## Tecnologías Principales

- **Next.js 15.5.4** - Framework de React con App Router
- **React 19** - Biblioteca de interfaz de usuario
- **TypeScript 5** - Tipado estático
- **Tailwind CSS 4** - Framework de estilos utility-first
- **shadcn/ui** - Componentes de UI basados en Radix UI
- **Zustand** - Gestión de estado global
- **TanStack Query** - Gestión de estado del servidor y caché
- **Axios** - Cliente HTTP
- **Lucide React** - Iconos

## Estructura de Carpetas

```
frontend/
├── app/                          # App Router de Next.js
│   ├── layout.tsx               # Layout principal con Header/Footer
│   ├── page.tsx                 # Página de inicio
│   └── globals.css              # Estilos globales
│
├── components/                   # Componentes de React
│   ├── layout/                  # Componentes de layout
│   │   ├── Header.tsx          # Header con navegación y carrito
│   │   ├── Footer.tsx          # Footer con información
│   │   └── index.ts            # Barrel export
│   │
│   ├── providers/               # Context Providers
│   │   ├── theme-provider.tsx  # Tema claro/oscuro
│   │   ├── query-provider.tsx  # React Query provider
│   │   └── index.tsx           # Providers combinados
│   │
│   └── ui/                      # Componentes UI de shadcn
│       ├── button.tsx
│       ├── input.tsx
│       ├── badge.tsx
│       ├── sheet.tsx
│       ├── dropdown-menu.tsx
│       ├── avatar.tsx
│       ├── separator.tsx
│       ├── card.tsx
│       ├── select.tsx
│       ├── skeleton.tsx
│       └── dialog.tsx
│
├── lib/                         # Utilidades y configuración
│   ├── api/                     # Configuración de API
│   ├── hooks/                   # Custom React Hooks
│   │   ├── useCart.ts          # Hook del carrito
│   │   ├── useAuth.ts          # Hook de autenticación
│   │   └── index.ts
│   │
│   ├── store/                   # Zustand stores
│   │   ├── cart.ts             # Store del carrito
│   │   └── index.ts
│   │
│   └── utils/                   # Funciones utilitarias
│       └── index.ts            # cn() para clsx + tailwind-merge
│
└── public/                      # Assets estáticos

```

## Arquitectura por Capas

### 1. Capa de Presentación (UI Layer)

**Ubicación**: `app/`, `components/`

**Responsabilidad**: Renderizar la interfaz de usuario y manejar la interacción del usuario.

**Componentes Clave**:
- **app/layout.tsx**: Layout raíz con Header, Footer y Providers
- **components/layout/Header.tsx**: Navegación, búsqueda, carrito, menú móvil
- **components/layout/Footer.tsx**: Información de contacto, enlaces, redes sociales
- **components/ui/**: Componentes reutilizables de shadcn/ui

**Características**:
- Server Components por defecto para mejor rendimiento
- Client Components ("use client") solo cuando se necesita interactividad
- Responsive design mobile-first
- Sticky header con backdrop blur
- Menu hamburguesa en móvil con Sheet de shadcn/ui

### 2. Capa de Lógica de Aplicación (Application Layer)

**Ubicación**: `lib/hooks/`

**Responsabilidad**: Lógica de negocio y orquestación de datos.

**Hooks Personalizados**:

- **useCart()**:
  - Wrapper del store de Zustand del carrito
  - Expone: items, addItem, removeItem, updateQuantity, clearCart
  - Calcula totales: totalItems, totalPrice

- **useAuth()**:
  - Gestión de estado de autenticación
  - Placeholder para futura implementación real
  - Expone: isAuthenticated, user, login, logout

### 3. Capa de Gestión de Estado (State Layer)

**Ubicación**: `lib/store/`

**Responsabilidad**: Gestión de estado global de la aplicación.

**Stores de Zustand**:

- **cart.ts**:
  - Store persistente (localStorage) del carrito
  - Interface CartItem con: id, name, slug, price, quantity, image, stock
  - Métodos: addItem, removeItem, updateQuantity, clearCart
  - Calculadores: getTotalItems, getTotalPrice

### 4. Capa de Datos (Data Layer)

**Ubicación**: `lib/api/`

**Responsabilidad**: Comunicación con APIs backend.

**Estado**: En desarrollo
- Configuración de Axios
- React Query para caché y sincronización
- Endpoints para productos, categorías, usuarios, pedidos

### 5. Capa de Utilidades (Utils Layer)

**Ubicación**: `lib/utils/`

**Responsabilidad**: Funciones auxiliares reutilizables.

**Funciones**:
- `cn()`: Combina clases de Tailwind con clsx y tailwind-merge

## Patrones de Diseño

### 1. Component Composition

Los componentes se construyen mediante composición, no herencia:

```typescript
<Header />
  <nav>
    <Link />
    <Link />
  </nav>
  <DropdownMenu>
    <DropdownMenuTrigger />
    <DropdownMenuContent>
      <DropdownMenuItem />
    </DropdownMenuContent>
  </DropdownMenu>
</Header>
```

### 2. Custom Hooks Pattern

Encapsulación de lógica reutilizable:

```typescript
const { items, addItem, totalItems } = useCart();
const { isAuthenticated, user, logout } = useAuth();
```

### 3. Provider Pattern

Context providers para funcionalidad global:

```typescript
<Providers>
  <ThemeProvider>
    <QueryProvider>
      {children}
    </QueryProvider>
  </ThemeProvider>
</Providers>
```

### 4. Atomic Design

Componentes organizados por complejidad:
- **Atoms**: Button, Input, Badge
- **Molecules**: DropdownMenu, Sheet
- **Organisms**: Header, Footer
- **Templates**: Layout
- **Pages**: app/page.tsx

## Características del Header

### Navegación Principal
- Links: Inicio, Productos, Categorías, Nosotros, Contacto
- Responsive: Desktop navbar, Mobile sheet menu
- Active states con hover effects (cyan-600)

### Funcionalidades
- **Búsqueda**: Input con icono, formulario funcional
- **Usuario**: Dropdown con login/logout, mi cuenta, mis pedidos
- **Carrito**: Badge con cantidad de items del store de Zustand
- **Mobile**: Sheet menu con navegación completa

### Diseño
- Sticky header con backdrop blur
- Logo con gradiente cyan
- Colores del tema Acuamarina (cyan)
- Iconos de lucide-react

## Características del Footer

### Estructura (4 Columnas)
1. **Acerca de**: Logo, descripción, eslogan
2. **Enlaces Rápidos**: Productos, Categorías, Nosotros, Contacto
3. **Información**: Envíos, Devoluciones, Términos, Privacidad
4. **Contacto**: Email, Teléfono, Dirección, Redes Sociales

### Responsive
- Desktop: 4 columnas
- Tablet: 2 columnas
- Mobile: 1 columna (stack)

### Redes Sociales
- Facebook, Instagram, Twitter
- Iconos con hover states (cyan-600)

## Gestión del Carrito

### Store de Zustand (cart.ts)

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

// Métodos
addItem(item)          // Agregar producto
removeItem(id)         // Eliminar producto
updateQuantity(id, qty) // Actualizar cantidad
clearCart()            // Vaciar carrito
getTotalItems()        // Total de items
getTotalPrice()        // Precio total
```

### Persistencia
- Almacenamiento en localStorage
- Key: "cart-storage"
- Sincronización automática entre pestañas

### Uso en Componentes

```typescript
const { items, addItem, totalItems, totalPrice } = useCart();

// Badge del carrito en Header
<Badge>{totalItems}</Badge>
```

## Sistema de Temas

### Theme Provider
- next-themes para gestión de tema
- Soporte para light/dark mode
- Sistema de colores personalizado

### Colores Principales
- **Primary**: Cyan (500-800)
- **Background**: Blanco / Gris oscuro
- **Foreground**: Negro / Blanco
- **Muted**: Gris claro / Gris medio

## Optimizaciones de Rendimiento

### Next.js 15 con Turbopack
- Build extremadamente rápido
- HMR (Hot Module Replacement) instantáneo

### Server Components
- Renderizado en servidor por defecto
- Reducción del JavaScript del cliente
- Mejor SEO y performance

### Static Generation
- Páginas estáticas pre-renderizadas
- ISR (Incremental Static Regeneration) para datos dinámicos

### Lazy Loading
- Code splitting automático
- Carga diferida de componentes pesados

## SEO y Accesibilidad

### Metadata
- Título: "Aguamarina Mosaicos - Tu tienda de cerámicos de calidad"
- Descripción optimizada para búsqueda
- Keywords relevantes

### Accesibilidad
- Semantic HTML (header, main, footer, nav)
- ARIA labels en iconos y botones
- Keyboard navigation
- Screen reader support
- Focus states visibles

## Comandos Disponibles

```bash
# Desarrollo
npm run dev        # Inicia servidor de desarrollo (Turbopack)

# Producción
npm run build      # Build optimizado (Turbopack)
npm start          # Inicia servidor de producción

# Código
npm run lint       # Ejecuta ESLint
```

## Variables de Entorno

Crear archivo `.env.local`:

```env
NEXT_PUBLIC_API_URL=http://localhost:8000/api
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

## Próximas Implementaciones

### Corto Plazo
- [ ] Página de listado de productos
- [ ] Página de detalle de producto
- [ ] Página del carrito
- [ ] Sistema de filtros y búsqueda
- [ ] Autenticación real (JWT)

### Mediano Plazo
- [ ] Checkout y proceso de compra
- [ ] Integración con pasarela de pago
- [ ] Panel de usuario (pedidos, dirección)
- [ ] Sistema de reseñas y ratings
- [ ] Wishlist / Favoritos

### Largo Plazo
- [ ] Chat en vivo
- [ ] Notificaciones push
- [ ] PWA (Progressive Web App)
- [ ] Internacionalización (i18n)
- [ ] Recomendaciones personalizadas

## Guía de Contribución

### Estructura de Componentes

```typescript
// 1. Imports
import { ... } from "...";

// 2. Types/Interfaces
interface MyComponentProps { ... }

// 3. Component
export function MyComponent({ ... }: MyComponentProps) {
  // 3.1 Hooks
  const [state, setState] = useState();

  // 3.2 Handlers
  const handleClick = () => { ... };

  // 3.3 Render
  return (...);
}
```

### Convenciones de Código

- **Componentes**: PascalCase (Header, Footer)
- **Hooks**: camelCase con prefijo "use" (useCart, useAuth)
- **Archivos**: kebab-case para utilities, PascalCase para componentes
- **Props**: Destructuring en los parámetros
- **Types**: Interface sobre Type cuando sea posible

### Estilos con Tailwind

- Mobile-first: `class="text-sm md:text-base lg:text-lg"`
- Utility classes sobre custom CSS
- Usar `cn()` para clases condicionales
- Seguir el sistema de diseño establecido

## Solución de Problemas

### Error: Module not found
```bash
npm install
```

### Puerto en uso
El servidor usa automáticamente un puerto disponible si 3000 está ocupado.

### Build errors
```bash
rm -rf .next
npm run build
```

### Types errors
```bash
npm install --save-dev @types/node @types/react @types/react-dom
```

## Recursos

- [Next.js Docs](https://nextjs.org/docs)
- [shadcn/ui](https://ui.shadcn.com/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Zustand](https://zustand-demo.pmnd.rs/)
- [TanStack Query](https://tanstack.com/query)
- [Lucide Icons](https://lucide.dev/)

## Contacto y Soporte

Para preguntas o problemas, contactar al equipo de desarrollo.

---

**Última actualización**: 12 de Octubre, 2025
