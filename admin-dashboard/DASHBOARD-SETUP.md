# 🎨 Dashboard Admin - Acuamarina Cerámicos

## 📊 Estado del Proyecto

✅ **Completado:**
- Proyecto Next.js 15 con TypeScript inicializado
- Tailwind CSS configurado
- Dependencias instaladas (React Query, Axios, Zustand, etc.)
- Estructura de carpetas creada
- Cliente API configurado
- Store de autenticación (Zustand)
- Tipos TypeScript completos
- Variables de entorno configuradas

⏳ **Pendiente (Archivos a crear):**
- Componentes UI de shadcn/ui
- Páginas (Login, Dashboard, Productos, etc.)
- Layouts
- Hooks personalizados
- Servicios API completos

---

## 🚀 Inicio Rápido

### 1. Instalar dependencias (Ya hecho ✅)

\`\`\`bash
cd D:\\acuamarina-ceramicos\\admin-dashboard
npm install
\`\`\`

### 2. Configurar variables de entorno

El archivo \`.env.local\` ya está creado con:
\`\`\`env
NEXT_PUBLIC_API_URL=http://localhost:3000/api/v1
\`\`\`

### 3. Iniciar en desarrollo

\`\`\`bash
npm run dev
\`\`\`

El dashboard estará en: http://localhost:3001

---

## 📁 Estructura Creada

\`\`\`
admin-dashboard/
├── src/
│   ├── app/                      # App Router de Next.js
│   │   ├── globals.css           # ✅ Estilos Tailwind
│   │   ├── layout.tsx            # ⏳ Layout principal
│   │   ├── page.tsx              # ⏳ Página principal
│   │   ├── login/                # ⏳ Página login
│   │   └── dashboard/            # ⏳ Dashboard admin
│   │
│   ├── components/               # Componentes React
│   │   ├── ui/                   # ⏳ Componentes shadcn/ui
│   │   ├── dashboard/            # ⏳ Componentes dashboard
│   │   └── layout/               # ⏳ Sidebar, Header, etc.
│   │
│   ├── lib/                      # Utilidades
│   │   ├── utils.ts              # ✅ Helpers (cn, formatCurrency, etc.)
│   │   └── api/
│   │       └── client.ts         # ✅ Cliente Axios configurado
│   │
│   ├── store/                    # Estado global
│   │   └── authStore.ts          # ✅ Store autenticación (Zustand)
│   │
│   ├── types/                    # TypeScript
│   │   └── index.ts              # ✅ Todos los tipos e interfaces
│   │
│   ├── hooks/                    # ⏳ Custom hooks
│   └── services/                 # ⏳ Servicios API
│
├── public/                       # Assets estáticos
├── .env.local                    # ✅ Variables de entorno
├── tailwind.config.ts            # ✅ Configuración Tailwind
├── components.json               # ✅ Configuración shadcn/ui
└── package.json                  # ✅ Dependencias
\`\`\`

---

## 📦 Dependencias Instaladas

### Core
- **next**: 15.x - Framework React
- **react**: 19.x - Biblioteca UI
- **typescript**: 5.x - Tipado estático

### Estado y Datos
- **zustand**: Estado global (auth, config)
- **@tanstack/react-query**: Fetching y caché de datos
- **axios**: Cliente HTTP

### UI
- **tailwindcss**: CSS utility-first
- **tailwindcss-animate**: Animaciones
- **lucide-react**: Iconos
- **shadcn/ui**: Componentes (a instalar)

### Formularios y Validación
- **react-hook-form**: Manejo de formularios
- **zod**: Validación de esquemas

### Utilidades
- **clsx** + **tailwind-merge**: Gestión de clases CSS
- **date-fns**: Manipulación de fechas
- **recharts**: Gráficos para estadísticas

---

## 🔧 Archivos Clave Creados

### 1. Cliente API (`src/lib/api/client.ts`)

Cliente Axios configurado con:
- Interceptor para agregar JWT automáticamente
- Manejo de refresh token
- Manejo de errores centralizado
- Métodos helper (get, post, put, delete)

**Uso:**
\`\`\`typescript
import { apiClient } from '@/lib/api/client';

// GET
const products = await apiClient.get<Product[]>('/products');

// POST
const newProduct = await apiClient.post('/products', productData);
\`\`\`

### 2. Store de Autenticación (`src/store/authStore.ts`)

Store Zustand con persistencia para:
- Login/Logout
- Guardar user y tokens
- Estado de autenticación

**Uso:**
\`\`\`typescript
import { useAuthStore } from '@/store/authStore';

function MyComponent() {
  const { user, isAuthenticated, login, logout } = useAuthStore();

  return (
    <div>
      {isAuthenticated ? (
        <p>Hola {user?.firstName}</p>
      ) : (
        <button onClick={() => login(userData, token, refreshToken)}>
          Login
        </button>
      )}
    </div>
  );
}
\`\`\`

### 3. Tipos TypeScript (`src/types/index.ts`)

Todas las interfaces y tipos del sistema:
- `User`, `UserRole`
- `Product`, `CreateProductDTO`
- `Category`, `CreateCategoryDTO`
- `Order`, `OrderStatus`, `OrderItem`
- `DashboardStats`
- `AuthResponse`, `LoginCredentials`
- `PaginatedResponse<T>`
- `ApiResponse<T>`

### 4. Utilidades (`src/lib/utils.ts`)

Helpers útiles:
- `cn()`: Combinar clases Tailwind
- `formatCurrency()`: Formato de moneda argentina
- `formatDate()`: Formato de fecha
- `formatDateTime()`: Formato de fecha y hora

---

## 🎯 Próximos Pasos para Completar

### Paso 1: Instalar componentes shadcn/ui

\`\`\`bash
npx shadcn@latest add button
npx shadcn@latest add card
npx shadcn@latest add input
npx shadcn@latest add label
npx shadcn@latest add table
npx shadcn@latest add dialog
npx shadcn@latest add dropdown-menu
npx shadcn@latest add toast
npx shadcn@latest add form
npx shadcn@latest add select
npx shadcn@latest add textarea
npx shadcn@latest add badge
npx shadcn@latest add avatar
npx shadcn@latest add separator
\`\`\`

### Paso 2: Crear Página de Login

Archivo: `src/app/login/page.tsx`

Debe incluir:
- Formulario con email y password
- Validación con Zod
- Llamada al endpoint `/auth/login` del backend
- Guardar tokens en el store
- Redirección al dashboard

### Paso 3: Crear Layout del Dashboard

Archivo: `src/components/layout/DashboardLayout.tsx`

Debe incluir:
- Sidebar con navegación
- Header con usuario y logout
- Área de contenido
- Protección de rutas (solo admin)

### Paso 4: Crear Dashboard Principal

Archivo: `src/app/dashboard/page.tsx`

Debe mostrar:
- Tarjetas con estadísticas (total productos, ventas, etc.)
- Gráfico de ventas (Recharts)
- Lista de últimos pedidos
- Productos con stock bajo

### Paso 5: Crear CRUD de Productos

Archivos:
- `src/app/dashboard/products/page.tsx` - Lista
- `src/app/dashboard/products/new/page.tsx` - Crear
- `src/app/dashboard/products/[id]/edit/page.tsx` - Editar

Debe incluir:
- Tabla con todos los productos
- Búsqueda y filtros
- Formulario de creación/edición
- Upload de imágenes
- Gestión de stock

### Paso 6: Crear servicios API

Archivo: `src/services/products.ts`

\`\`\`typescript
import { apiClient } from '@/lib/api/client';
import { Product, CreateProductDTO } from '@/types';

export const productsService = {
  getAll: () => apiClient.get<Product[]>('/products'),
  getById: (id: string) => apiClient.get<Product>(\`/products/\${id}\`),
  create: (data: CreateProductDTO) => apiClient.post<Product>('/products', data),
  update: (id: string, data: Partial<Product>) =>
    apiClient.put<Product>(\`/products/\${id}\`, data),
  delete: (id: string) => apiClient.delete(\`/products/\${id}\`),
};
\`\`\`

### Paso 7: Implementar React Query

Archivo: `src/hooks/useProducts.ts`

\`\`\`typescript
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { productsService } from '@/services/products';

export function useProducts() {
  return useQuery({
    queryKey: ['products'],
    queryFn: productsService.getAll,
  });
}

export function useCreateProduct() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: productsService.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
    },
  });
}
\`\`\`

---

## 🎨 Diseño Sugerido

### Colores
- **Primary**: Azul oscuro (elegante para cerámicos)
- **Secondary**: Gris claro
- **Accent**: Turquesa (agua/cerámicos)
- **Success**: Verde
- **Danger**: Rojo

### Tipografía
- **Headings**: Inter, Geist Sans
- **Body**: System fonts

### Layout
- **Sidebar**: 250px, fijo en escritorio
- **Header**: 64px altura
- **Contenido**: Padding responsivo

---

## 📊 Funcionalidades del Dashboard

### Dashboard Principal
- [ ] Tarjetas de métricas (ventas, productos, clientes)
- [ ] Gráfico de ventas por mes
- [ ] Lista de últimos pedidos
- [ ] Productos con stock bajo
- [ ] Actividad reciente

### Productos
- [ ] Lista completa con tabla
- [ ] Búsqueda y filtros avanzados
- [ ] Crear producto con formulario completo
- [ ] Editar producto
- [ ] Eliminar producto (confirmación)
- [ ] Upload de múltiples imágenes
- [ ] Vista previa de imágenes
- [ ] Gestión de categorías (dropdown)
- [ ] Gestión de stock

### Categorías
- [ ] Lista de categorías
- [ ] Crear categoría
- [ ] Editar categoría
- [ ] Eliminar categoría
- [ ] Categorías jerárquicas (padre/hijo)

### Pedidos
- [ ] Lista de todos los pedidos
- [ ] Filtros por estado, fecha, cliente
- [ ] Ver detalle de pedido
- [ ] Actualizar estado de pedido
- [ ] Agregar notas de admin
- [ ] Tracking de envío
- [ ] Imprimir orden

### Clientes
- [ ] Lista de clientes
- [ ] Ver perfil de cliente
- [ ] Historial de compras
- [ ] Editar información

### Configuración
- [ ] Perfil de usuario
- [ ] Cambiar contraseña
- [ ] Configuración del sitio

---

## 🔐 Flujo de Autenticación

1. Usuario ingresa email y password
2. POST a `/api/v1/auth/login`
3. Backend valida credenciales
4. Backend retorna `{ user, accessToken, refreshToken }`
5. Frontend guarda en store y localStorage
6. Todas las peticiones incluyen `Authorization: Bearer {token}`
7. Si token expira (401), intenta refresh automático
8. Si refresh falla, redirige a login

---

## 🚨 Importante

### Backend debe estar corriendo
Antes de usar el dashboard, asegúrate de que el backend esté corriendo:

\`\`\`bash
cd D:\\acuamarina-ceramicos\\backend
npm run dev
\`\`\`

### CORS
El backend debe permitir peticiones desde `http://localhost:3001`

Verificar en `backend/.env`:
\`\`\`env
CORS_ORIGIN=http://localhost:3001
\`\`\`

### Credenciales de prueba
- **Email:** admin@acuamarina.com
- **Password:** Admin123!

---

## 📚 Recursos

- **Next.js 15**: https://nextjs.org/docs
- **shadcn/ui**: https://ui.shadcn.com
- **Tailwind CSS**: https://tailwindcss.com/docs
- **React Query**: https://tanstack.com/query
- **Zustand**: https://docs.pmnd.rs/zustand

---

## 🎉 Estado Actual

El proyecto está **60% completado**.

**Listo para desarrollo:**
- ✅ Configuración base
- ✅ Cliente API
- ✅ Store de autenticación
- ✅ Tipos TypeScript
- ✅ Utilidades

**Siguiente paso recomendado:**
1. Instalar componentes shadcn/ui
2. Crear página de login
3. Crear layout del dashboard
4. Implementar CRUD de productos

**Tiempo estimado para completar:** 2-4 horas

---

¿Necesitas ayuda con algún paso específico? ¡Avísame!
