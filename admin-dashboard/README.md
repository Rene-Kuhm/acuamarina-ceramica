# 🎨 Dashboard Admin - Acuamarina Cerámicos

Dashboard administrativo profesional construido con Next.js 15, TypeScript, Tailwind CSS y shadcn/ui.

## ✅ Estado del Proyecto: COMPLETADO Y FUNCIONAL

### Funcionalidades Implementadas

✅ **Autenticación**
- Sistema de login con JWT
- Store de autenticación con Zustand
- Protección de rutas
- Persistencia de sesión

✅ **Dashboard Principal**
- Estadísticas generales
- Tarjetas de métricas
- Vista general del negocio

✅ **Gestión de Productos**
- Lista completa de productos con tabla
- Búsqueda en tiempo real
- Crear nuevo producto (formulario completo)
- Eliminar producto
- Indicadores de stock bajo

✅ **UI Components**
- Button, Card, Input, Label
- Sidebar con navegación
- Layout responsivo

✅ **Arquitectura**
- Cliente API con interceptores
- React Query para gestión de estado
- Hooks personalizados
- Servicios API organizados
- TypeScript con tipos completos

---

## 🚀 Inicio Rápido

### 1. Instalar dependencias

\`\`\`bash
cd D:\\acuamarina-ceramicos\\admin-dashboard
npm install
\`\`\`

### 2. Asegurarse de que el backend esté corriendo

\`\`\`bash
# En otra terminal
cd D:\\acuamarina-ceramicos\\backend
npm run dev
\`\`\`

El backend debe estar en: http://localhost:3000

### 3. Iniciar el dashboard

\`\`\`bash
npm run dev
\`\`\`

El dashboard estará en: **http://localhost:3000** (o 3001 si el 3000 está ocupado)

---

## 🔐 Credenciales de Acceso

- **Email:** admin@acuamarina.com
- **Password:** Admin123!

---

## 📁 Archivos Clave Creados

\`\`\`
✅ src/app/login/page.tsx                  - Página de login
✅ src/app/dashboard/layout.tsx            - Layout con sidebar
✅ src/app/dashboard/page.tsx              - Dashboard principal
✅ src/app/dashboard/products/page.tsx     - Lista de productos
✅ src/app/dashboard/products/new/page.tsx - Crear producto

✅ src/components/layout/Sidebar.tsx       - Navegación
✅ src/components/ui/*                     - Componentes base

✅ src/services/auth.service.ts            - API autenticación
✅ src/services/products.service.ts        - API productos
✅ src/services/categories.service.ts      - API categorías

✅ src/hooks/useProducts.ts                - Hooks productos
✅ src/hooks/useCategories.ts              - Hooks categorías

✅ src/store/authStore.ts                  - Estado auth (Zustand)
✅ src/lib/api/client.ts                   - Cliente HTTP
✅ src/lib/utils.ts                        - Utilidades
✅ src/types/index.ts                      - Tipos TypeScript
\`\`\`

---

## 🎯 Rutas Disponibles

### Públicas
- `/` - Redirección automática
- `/login` - Página de login

### Protegidas (requieren autenticación)
- `/dashboard` - Dashboard principal
- `/dashboard/products` - Lista de productos
- `/dashboard/products/new` - Crear producto

---

## 🛠️ Stack Tecnológico

- **Next.js 15** - Framework React
- **TypeScript** - Tipado estático
- **Tailwind CSS v4** - Estilos
- **React Query** - Gestión de datos
- **Zustand** - Estado global
- **Axios** - Cliente HTTP

---

## 📊 Funcionalidades Detalladas

### 1. Login
- Formulario con validación
- Conexión a backend `/auth/login`
- Tokens almacenados de forma segura
- Redirección automática al dashboard

### 2. Dashboard
- Métricas: productos, ventas, pedidos, clientes
- Indicadores de crecimiento
- Diseño con cards

### 3. Productos
**Lista:**
- Tabla con todos los productos
- Búsqueda en tiempo real
- Stock bajo en rojo
- Botones editar/eliminar

**Crear:**
- Formulario completo multi-sección
- SKU, nombre, slug (auto-generado)
- Descripciones
- Características (dimensiones, material, etc.)
- Precios
- Categoría
- Inventario
- Validación de campos

---

## 🔄 Flujo de Autenticación

1. Usuario ingresa credenciales
2. POST a `/api/v1/auth/login`
3. Backend retorna `{ user, accessToken, refreshToken }`
4. Store guarda datos
5. Token se agrega automáticamente a todas las requests
6. Si 401, intenta refresh automático

---

## 🚧 Próximas Funcionalidades

- [ ] Editar producto
- [ ] Upload de imágenes
- [ ] Gestión de categorías
- [ ] Gestión de pedidos
- [ ] Dashboard con gráficos
- [ ] Exportar datos

---

## 🐛 Solución de Problemas

**El login no funciona:**
- Verifica que backend esté en `localhost:3000`
- Usa credenciales: admin@acuamarina.com / Admin123!

**Error de CORS:**
- Backend debe tener: `CORS_ORIGIN=http://localhost:3000` (o el puerto del dashboard)

**Productos no cargan:**
- Verifica backend: `npm run db:seed`
- Revisa `.env.local`: `NEXT_PUBLIC_API_URL=http://localhost:3000/api/v1`

---

## 🎉 ¡Dashboard 100% Funcional!

Puedes:
- ✅ Login/Logout
- ✅ Ver dashboard con métricas
- ✅ Listar productos
- ✅ Crear productos
- ✅ Buscar productos
- ✅ Eliminar productos

**Siguiente:** Implementar edición de productos y upload de imágenes

---

**Documentación adicional:** `DASHBOARD-SETUP.md`

¡Éxito con Acuamarina Cerámicos! 🏺✨
