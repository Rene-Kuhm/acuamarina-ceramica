# 📋 FUNCIONALIDADES PENDIENTES - Dashboard Acuamarina

## ✅ COMPLETADO (Lo que ya funciona):

### Backend:
- ✅ AuthController (login, register, refresh, logout)
- ✅ ProductsController (CRUD completo)
- ✅ CategoriesController (CRUD completo)
- ✅ Middleware de autenticación y autorización
- ✅ Rutas: /auth, /products, /categories

### Frontend:
- ✅ Login/Logout
- ✅ Dashboard principal (métricas estáticas)
- ✅ Productos: Listar, crear, editar, eliminar, buscar
- ✅ Categorías: Listar

---

## 🚧 PENDIENTE DE IMPLEMENTAR:

### 1. CATEGORÍAS (Frontend - Falta poco)
**Archivos a crear:**
- `src/app/dashboard/categories/new/page.tsx` - Crear categoría
- `src/app/dashboard/categories/[id]/edit/page.tsx` - Editar categoría
- `src/hooks/useCategories.ts` - Agregar hooks de create, update, delete

**Estructura del formulario de categoría:**
```typescript
{
  name: string;
  slug?: string;
  description?: string;
  parentId?: string; // Para subcategorías
  displayOrder?: number;
  isActive?: boolean;
}
```

---

### 2. PEDIDOS (Completo)

**Backend - Archivos a crear:**
- `src/application/controllers/OrdersController.ts`
- `src/application/routes/orders.routes.ts`

**Endpoints necesarios:**
- GET /api/v1/orders - Listar pedidos con filtros
- GET /api/v1/orders/:id - Ver detalle de pedido
- PATCH /api/v1/orders/:id/status - Cambiar estado
- GET /api/v1/orders/stats - Estadísticas de pedidos

**Frontend - Archivos a crear:**
- `src/services/orders.service.ts`
- `src/hooks/useOrders.ts`
- `src/app/dashboard/orders/page.tsx` - Lista de pedidos
- `src/app/dashboard/orders/[id]/page.tsx` - Detalle de pedido

**Campos del pedido:**
```typescript
{
  order_number: string;
  user_id: string;
  status: 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  payment_status: 'pending' | 'completed' | 'failed' | 'refunded';
  total_amount: number;
  items: OrderItem[];
  shipping_address: Address;
}
```

---

### 3. CLIENTES (Completo)

**Backend - Archivos a crear:**
- `src/application/controllers/CustomersController.ts`
- `src/application/routes/customers.routes.ts`

**Endpoints:**
- GET /api/v1/customers - Listar clientes
- GET /api/v1/customers/:id - Ver cliente
- GET /api/v1/customers/:id/orders - Pedidos del cliente
- PATCH /api/v1/customers/:id - Actualizar cliente

**Frontend:**
- `src/services/customers.service.ts`
- `src/hooks/useCustomers.ts`
- `src/app/dashboard/customers/page.tsx`
- `src/app/dashboard/customers/[id]/page.tsx`

---

### 4. ESTADÍSTICAS (Dashboard con datos reales)

**Backend - Archivo a crear:**
- `src/application/controllers/StatsController.ts`
- `src/application/routes/stats.routes.ts`

**Endpoints:**
```
GET /api/v1/stats/dashboard
Respuesta:
{
  totalProducts: number;
  totalOrders: number;
  totalRevenue: number;
  totalCustomers: number;
  recentOrders: Order[];
  lowStockProducts: Product[];
  salesByMonth: { month: string, sales: number }[];
}
```

**Frontend:**
- Actualizar `src/app/dashboard/page.tsx` para mostrar datos reales
- Agregar gráficos con librería (ej: recharts)

**Instalar recharts:**
```bash
npm install recharts
```

---

### 5. UPLOAD DE IMÁGENES CON CLOUDINARY

**Backend:**
1. Instalar cloudinary:
```bash
npm install cloudinary multer
npm install --save-dev @types/multer
```

2. Crear `src/application/controllers/UploadController.ts`:
```typescript
import cloudinary from 'cloudinary';
import multer from 'multer';

cloudinary.v2.config({
  cloud_name: config.cloudinary.cloudName,
  api_key: config.cloudinary.apiKey,
  api_secret: config.cloudinary.apiSecret,
});

export class UploadController {
  static uploadImage(req, res) {
    // Upload a Cloudinary
  }
}
```

3. Crear ruta POST /api/v1/upload/image

**Frontend:**
1. Crear componente `src/components/ImageUpload.tsx`
2. Integrar en formularios de productos y categorías

---

### 6. CONFIGURACIÓN

**Páginas a crear:**
- `src/app/dashboard/settings/page.tsx` - Configuración general
- `src/app/dashboard/settings/users/page.tsx` - Gestión de usuarios admin

**Backend:**
- Endpoints para crear/editar usuarios admin
- Endpoint para cambiar contraseña

---

### 7. EXPORTACIÓN DE DATOS

**Backend:**
Instalar:
```bash
npm install json2csv
```

Crear endpoints:
- GET /api/v1/products/export - Exportar productos a CSV
- GET /api/v1/orders/export - Exportar pedidos a CSV

**Frontend:**
Agregar botón "Exportar" en las listas que descargue el CSV

---

## 📦 INSTALACIONES PENDIENTES:

### Frontend:
```bash
cd D:\acuamarina-ceramicos\admin-dashboard
npm install recharts  # Para gráficos
```

### Backend:
```bash
cd D:\acuamarina-ceramicos\backend
npm install cloudinary multer json2csv
npm install --save-dev @types/multer
```

---

## 🎯 ORDEN RECOMENDADO DE IMPLEMENTACIÓN:

1. ✅ Edición de productos (COMPLETADO)
2. ✅ Backend de categorías (COMPLETADO)
3. 🔄 Frontend de categorías (crear/editar)
4. 📊 Estadísticas y dashboard con datos reales
5. 📦 Gestión de pedidos
6. 👥 Gestión de clientes
7. 🖼️ Upload de imágenes
8. ⚙️ Configuración
9. 📤 Exportación de datos

---

## 🚀 SIGUIENTE PASO INMEDIATO:

**Completar Categorías (Frontend):**
Crear los archivos:
1. `src/app/dashboard/categories/new/page.tsx`
2. `src/app/dashboard/categories/[id]/edit/page.tsx`
3. Actualizar `src/hooks/useCategories.ts` con los hooks de mutación

Puedes basarte en los archivos de productos como template.

---

**¡El proyecto está un 40% completado y todo lo implementado funciona correctamente!** 🎉
