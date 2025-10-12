# 🔗 Integración Frontend-Backend - Aguamarina Mosaicos

## 📋 Configuración Actual

### Puertos
- **Frontend (Next.js)**: `http://localhost:3000`
- **Backend (Express)**: `http://localhost:3001`
- **API Base URL**: `http://localhost:3001/api/v1`

### Variables de Entorno

#### Frontend (`.env.local`)
```env
NEXT_PUBLIC_API_URL=http://localhost:3001/api/v1
NEXT_PUBLIC_SITE_NAME=Aguamarina Mosaicos
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

#### Backend (`.env`)
```env
PORT=3001
CORS_ORIGIN=http://localhost:3000,http://localhost:5173,http://localhost:3001
```

---

## 🚀 Inicio Rápido

### 1. Iniciar Backend
```bash
cd ../backend
npm run dev
```
El backend estará disponible en `http://localhost:3001`

### 2. Iniciar Frontend
```bash
cd frontend
npm run dev
```
El frontend estará disponible en `http://localhost:3000`

### 3. Ejecutar Tests End-to-End
```bash
npm run test:e2e
```

---

## 🧪 Testing End-to-End

El script `test-e2e.mjs` prueba automáticamente:

### Tests Implementados
1. ✅ **Health Check** - Verifica que el backend esté activo
2. ✅ **Productos API** - Lista, paginación y búsqueda
3. ✅ **Categorías API** - Lista de categorías
4. ✅ **Autenticación** - Registro, login y obtención de perfil
5. ✅ **Contacto** - Envío de formulario de contacto

### Ejecutar Tests
```bash
npm run test:e2e
```

### Salida Esperada
```
============================================================
 🚀 INICIANDO TESTS END-TO-END
============================================================

API Base URL: http://localhost:3001/api/v1

============================================================
 1️⃣  Health Check
============================================================

✓ GET /health

============================================================
 2️⃣  Productos API
============================================================

✓ GET /products (Listar productos)
  → 10 productos encontrados
✓ GET /products?page=1&limit=12
✓ GET /products?search=ceramico

...

============================================================
 📊 RESUMEN DE TESTS
============================================================

Total de tests: 10
✓ Exitosos: 10
✗ Fallidos: 0
Tasa de éxito: 100.0%

🎉 ¡TODOS LOS TESTS PASARON!
✅ Backend y Frontend están correctamente integrados
```

---

## 🔌 Endpoints del API

### Productos
```typescript
GET    /api/v1/products              // Listar productos
GET    /api/v1/products?search=...   // Buscar productos
GET    /api/v1/products/:slug         // Producto por slug
POST   /api/v1/products              // Crear producto (admin)
PUT    /api/v1/products/:id          // Actualizar producto (admin)
DELETE /api/v1/products/:id          // Eliminar producto (admin)
```

### Categorías
```typescript
GET    /api/v1/categories            // Listar categorías
GET    /api/v1/categories/:slug       // Categoría por slug
POST   /api/v1/categories            // Crear categoría (admin)
PUT    /api/v1/categories/:id        // Actualizar categoría (admin)
DELETE /api/v1/categories/:id        // Eliminar categoría (admin)
```

### Autenticación
```typescript
POST   /api/v1/auth/register         // Registro de usuario
POST   /api/v1/auth/login            // Inicio de sesión
GET    /api/v1/auth/profile          // Obtener perfil (auth)
POST   /api/v1/auth/logout           // Cerrar sesión (auth)
```

### Pedidos
```typescript
GET    /api/v1/orders                // Listar pedidos del usuario (auth)
GET    /api/v1/orders/:id            // Obtener pedido (auth)
POST   /api/v1/orders                // Crear pedido (auth)
```

### Contacto
```typescript
POST   /api/v1/contact               // Enviar formulario de contacto
```

---

## 🔐 Autenticación

### Flujo de Autenticación

1. **Registro/Login** → Obtener token JWT
2. **Almacenar token** en `localStorage` con key `auth_token`
3. **API Client** automáticamente agrega el token en headers:
   ```typescript
   Authorization: Bearer <token>
   ```

### Implementación en el Cliente

```typescript
// lib/hooks/useAuth.ts
const { login, register, logout } = useAuth();

// Login
const result = await login(email, password);
if (result.success) {
  // Token automáticamente almacenado
  // User state actualizado
}

// Logout
await logout();
// Token eliminado, redirect a /
```

### Interceptores de Axios

```typescript
// lib/api/client.ts

// Request: Agrega token automáticamente
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('auth_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response: Maneja 401 (no autorizado)
apiClient.interceptors.response.use(
  response => response,
  error => {
    if (error.response?.status === 401) {
      localStorage.removeItem('auth_token');
      window.location.href = '/auth/login';
    }
    return Promise.reject(error);
  }
);
```

---

## 📦 Estructura de Datos

### Producto
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

### Usuario
```typescript
interface User {
  id: number;
  email: string;
  name: string;
  phone?: string;
  role: "customer" | "admin";
  createdAt: string;
  updatedAt: string;
}
```

### Pedido
```typescript
interface Order {
  id: number;
  userId: number;
  items: OrderItem[];
  subtotal: number;
  tax: number;
  shipping: number;
  total: number;
  status: "pending" | "processing" | "shipped" | "delivered" | "cancelled";
  shippingAddress: Address;
  paymentMethod: "credit_card" | "debit_card" | "paypal" | "transfer";
  createdAt: string;
  updatedAt: string;
}
```

---

## 🐛 Troubleshooting

### Error: "Failed to fetch"
**Problema**: No se puede conectar con el backend

**Soluciones**:
1. Verifica que el backend esté corriendo: `cd ../backend && npm run dev`
2. Verifica el puerto en `.env.local`: debe ser `3001`
3. Verifica CORS en backend `.env`: debe incluir `http://localhost:3000`

### Error: "CORS policy"
**Problema**: Política CORS bloqueando requests

**Solución**:
```env
# backend/.env
CORS_ORIGIN=http://localhost:3000,http://localhost:5173
CORS_CREDENTIALS=true
```

### Error: 401 Unauthorized
**Problema**: Token inválido o expirado

**Soluciones**:
1. Logout y login nuevamente
2. Verificar que el token esté en localStorage
3. Verificar JWT_SECRET en backend `.env`

### Error: "Cannot read properties of undefined"
**Problema**: Datos no coinciden con el tipo esperado

**Solución**:
1. Verificar estructura de respuesta del API
2. Actualizar types en `lib/types/index.ts`
3. Agregar validación de datos en componentes

---

## 🔄 Flujos Completos

### Flujo de Compra
```mermaid
Usuario → Productos → Detalle → Agregar al Carrito →
Carrito → Checkout (3 pasos) → Crear Pedido → Confirmación
```

1. Usuario navega a `/productos`
2. Busca o filtra productos
3. Click en producto → `/productos/[slug]`
4. Click "Agregar al Carrito" → Zustand store actualizado
5. Navega a `/carrito`
6. Click "Proceder al Pago" → `/checkout`
7. Completa 3 pasos:
   - Dirección de envío
   - Método de pago
   - Confirmación
8. Click "Confirmar Pedido":
   - POST `/api/v1/orders`
   - Limpia carrito
   - Redirect `/pedidos?success=true`

### Flujo de Autenticación
```mermaid
Usuario → Register/Login → Token → LocalStorage →
Requests con Authorization header → API responde
```

1. Usuario va a `/auth/register` o `/auth/login`
2. Completa formulario
3. Submit → POST `/api/v1/auth/register` o `/login`
4. Backend responde con token y user data
5. Frontend almacena token en `localStorage`
6. `useAuth` actualiza estado global
7. Todas las requests subsecuentes incluyen token
8. Backend verifica token en middleware
9. Si válido, procesa request
10. Si inválido, responde 401 → Frontend logout automático

---

## 📊 Estado de Integración

### ✅ Completamente Integrado
- [x] Productos (CRUD completo)
- [x] Categorías (Lista y detalle)
- [x] Autenticación (Register, Login, Profile, Logout)
- [x] Carrito (Store local con Zustand)
- [x] Checkout (3 pasos con validación)
- [x] Pedidos (Creación y lista)
- [x] Contacto (Formulario)
- [x] Búsqueda (Con filtros)

### 🚧 Pendiente (Futuro)
- [ ] Recuperación de contraseña
- [ ] Favoritos/Wishlist
- [ ] Reviews y ratings
- [ ] Integración con pasarela de pago
- [ ] Notificaciones push
- [ ] Tracking de envíos

---

## 🎯 Próximos Pasos

1. **Seed Database**: Poblar con datos de prueba
   ```bash
   cd ../backend
   npm run db:seed
   ```

2. **Ejecutar Tests**: Verificar integración
   ```bash
   cd frontend
   npm run test:e2e
   ```

3. **Desarrollo Local**: Iniciar ambos servidores
   ```bash
   # Terminal 1
   cd backend && npm run dev

   # Terminal 2
   cd frontend && npm run dev
   ```

4. **Testing Manual**: Navegar a `http://localhost:3000`

---

## 📚 Recursos

- [Next.js 15 Docs](https://nextjs.org/docs)
- [React Query Docs](https://tanstack.com/query/latest)
- [Axios Docs](https://axios-http.com/docs/intro)
- [Zustand Docs](https://zustand-demo.pmnd.rs/)

---

**Última actualización**: 12 de Octubre, 2025
