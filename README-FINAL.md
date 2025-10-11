# 🏺 ACUAMARINA CERÁMICOS - Sistema Completo

Dashboard administrativo profesional + API Backend construido con las mejores prácticas.

---

## ✅ ESTADO ACTUAL: 70% COMPLETADO Y FUNCIONAL

### 🎉 LO QUE FUNCIONA (Completamente implementado):

#### **Backend API** (Node.js + PostgreSQL)
- ✅ **Autenticación JWT completa**
  - Login, registro, refresh tokens, logout
  - Protección de rutas con middleware
  - Roles: admin, manager, customer

- ✅ **CRUD de Productos**
  - Listar con paginación y filtros (búsqueda, categoría, estado)
  - Crear producto
  - Editar producto
  - Eliminar producto
  - Soporte para stock, precios, características

- ✅ **CRUD de Categorías**
  - Listar categorías (con/sin inactivas)
  - Crear categoría
  - Editar categoría
  - Eliminar categoría
  - Soporte para subcategorías (parent_id)

- ✅ **Estadísticas del Dashboard**
  - Total de productos activos
  - Pedidos y ventas del mes
  - Total de clientes
  - Productos con stock bajo
  - Últimos pedidos
  - Ventas por mes

- ✅ **Arquitectura Backend**
  - Clean Architecture (Controllers, Routes, Middleware)
  - Validación con Zod
  - Audit logs para todas las operaciones
  - Error handling centralizado
  - Rate limiting
  - CORS configurado
  - Logging con Winston

#### **Frontend Dashboard** (Next.js 15 + TypeScript)
- ✅ **Autenticación**
  - Página de login
  - Logout
  - Persistencia de sesión
  - Protección de rutas

- ✅ **Dashboard Principal**
  - Métricas en tiempo real (productos, ventas, pedidos, clientes)
  - Lista de productos con stock bajo
  - Últimos pedidos
  - Gráficos de ventas

- ✅ **Gestión de Productos**
  - Lista con tabla, búsqueda y filtros
  - Crear producto (formulario completo)
  - Editar producto
  - Eliminar producto
  - Indicadores de stock bajo

- ✅ **Gestión de Categorías**
  - Lista en cards
  - Crear categoría
  - Editar categoría
  - Eliminar categoría
  - Soporte para subcategorías

- ✅ **Arquitectura Frontend**
  - React Query para data fetching
  - Zustand para estado global
  - Cliente API con interceptores JWT
  - Hooks personalizados
  - Componentes reutilizables (shadcn/ui)
  - TypeScript con tipos completos

---

## 🚀 INICIO RÁPIDO

### 1. Backend

```bash
cd D:\acuamarina-ceramicos\backend

# Instalar dependencias
npm install

# Configurar base de datos
npm run db:setup  # Crea DB, ejecuta migraciones y seeds

# Iniciar servidor
npm run dev
```

**Backend corriendo en:** `http://localhost:3000/api/v1`

### 2. Frontend

```bash
cd D:\acuamarina-ceramicos\admin-dashboard

# Instalar dependencias
npm install

# Iniciar dashboard
npm run dev
```

**Dashboard corriendo en:** `http://localhost:3002` (o el puerto disponible)

### 3. Credenciales

- **Email:** `admin@acuamarina.com`
- **Password:** `Admin123!`

---

## 📊 ENDPOINTS DISPONIBLES

### Autenticación
- `POST /api/v1/auth/login` - Iniciar sesión
- `POST /api/v1/auth/register` - Registrar usuario
- `POST /api/v1/auth/refresh` - Refrescar token
- `POST /api/v1/auth/logout` - Cerrar sesión
- `GET /api/v1/auth/me` - Usuario actual

### Productos
- `GET /api/v1/products` - Listar productos (con filtros)
- `GET /api/v1/products/:id` - Obtener producto
- `POST /api/v1/products` - Crear producto 🔒
- `PATCH /api/v1/products/:id` - Actualizar producto 🔒
- `DELETE /api/v1/products/:id` - Eliminar producto 🔒

### Categorías
- `GET /api/v1/categories` - Listar categorías
- `GET /api/v1/categories/:id` - Obtener categoría
- `POST /api/v1/categories` - Crear categoría 🔒
- `PATCH /api/v1/categories/:id` - Actualizar categoría 🔒
- `DELETE /api/v1/categories/:id` - Eliminar categoría 🔒

### Estadísticas
- `GET /api/v1/stats/dashboard` - Estadísticas del dashboard 🔒

🔒 = Requiere autenticación (Admin/Manager)

---

## 📁 ESTRUCTURA DEL PROYECTO

```
acuamarina-ceramicos/
├── backend/
│   ├── src/
│   │   ├── application/
│   │   │   ├── controllers/      # AuthController, ProductsController, CategoriesController, StatsController
│   │   │   ├── routes/            # auth, products, categories, stats
│   │   │   └── middleware/        # authenticate, errorHandler
│   │   ├── config/                # environment.ts
│   │   ├── infrastructure/
│   │   │   └── database/          # connection, schema, seed
│   │   ├── shared/
│   │   │   └── utils/             # logger
│   │   └── server.ts
│   └── package.json
│
└── admin-dashboard/
    ├── src/
    │   ├── app/
    │   │   ├── login/             # Página de login
    │   │   └── dashboard/
    │   │       ├── page.tsx       # Dashboard principal con estadísticas
    │   │       ├── products/      # CRUD productos
    │   │       └── categories/    # CRUD categorías
    │   ├── components/
    │   │   ├── layout/            # Sidebar
    │   │   └── ui/                # Button, Card, Input, Label
    │   ├── services/              # API services (auth, products, categories, stats)
    │   ├── hooks/                 # useProducts, useCategories
    │   ├── store/                 # authStore (Zustand)
    │   ├── lib/
    │   │   └── api/               # cliente HTTP con interceptores
    │   └── types/                 # TypeScript types
    └── package.json
```

---

## 🛠️ STACK TECNOLÓGICO

### Backend
- **Node.js** con **TypeScript**
- **Express.js** - Framework web
- **PostgreSQL** - Base de datos
- **JWT** - Autenticación
- **Bcrypt** - Hash de contraseñas
- **Zod** - Validación
- **Winston** - Logging
- **Helmet** - Seguridad
- **CORS** - Cross-Origin

### Frontend
- **Next.js 15** - Framework React
- **TypeScript** - Tipado estático
- **Tailwind CSS v4** - Estilos
- **React Query** - Data fetching
- **Zustand** - Estado global
- **Axios** - Cliente HTTP
- **shadcn/ui** - Componentes UI

---

## 🎯 FUNCIONALIDADES LISTAS PARA USAR

### Dashboard Administrativo
1. **Login seguro** con JWT
2. **Dashboard principal**  con métricas en tiempo real
3. **Gestión de productos** completa (CRUD)
4. **Gestión de categorías** completa (CRUD)
5. **Alertas de stock bajo**
6. **Últimos pedidos** (cuando se creen)
7. **Búsqueda** en productos y categorías
8. **Responsive design** para móvil y desktop

### API Backend
1. **Autenticación JWT** completa
2. **CRUD completo** de productos y categorías
3. **Paginación** y filtros
4. **Audit logs** de todas las operaciones
5. **Validación** de datos con Zod
6. **Error handling** robusto
7. **Rate limiting** para prevenir abuso
8. **CORS** configurado

---

## 📋 LO QUE FALTA (30%)

He creado el archivo `GENERAR_CODIGO_FALTANTE.md` con todo el código para:

1. **Gestión de Pedidos** (Backend + Frontend)
   - Listar, ver detalle, cambiar estado

2. **Gestión de Clientes** (Backend + Frontend)
   - Listar, ver perfil, historial de pedidos

3. **Upload de Imágenes** (Cloudinary)
   - Subir imágenes de productos y categorías

4. **Configuración**
   - Gestión de usuarios administradores
   - Cambiar contraseña

5. **Exportación de datos**
   - Exportar productos/pedidos a CSV

**Consulta el archivo `GENERAR_CODIGO_FALTANTE.md` para implementar estas funcionalidades.**

---

## 🐛 SOLUCIÓN DE PROBLEMAS

### Backend no inicia
```bash
# Verificar que PostgreSQL esté corriendo
# Verificar credenciales en .env
# Ejecutar: npm run db:setup
```

### Login no funciona
- Verificar que backend esté en `localhost:3000`
- Usar credenciales: `admin@acuamarina.com` / `Admin123!`
- Ejecutar `npm run db:seed` si el usuario no existe

### Error de CORS
- Verificar que `CORS_ORIGIN` en `.env` incluya el puerto del dashboard
- Reiniciar el backend después de cambiar `.env`

### Productos/Categorías no cargan
- Verificar que backend esté corriendo
- Revisar consola del navegador para errores
- Verificar `NEXT_PUBLIC_API_URL` en `.env.local` del frontend

---

## 📚 DOCUMENTACIÓN ADICIONAL

- `PENDIENTES.md` - Lista detallada de lo que falta
- `GENERAR_CODIGO_FALTANTE.md` - Código completo para features pendientes
- `DASHBOARD-SETUP.md` - Documentación técnica del dashboard

---

## 🎉 RESUMEN

**¡El proyecto está 70% completo y totalmente funcional!**

### Lo que puedes hacer AHORA:
✅ Login/Logout
✅ Ver dashboard con datos reales
✅ Gestionar productos (crear, editar, eliminar, buscar)
✅ Gestionar categorías (crear, editar, eliminar)
✅ Ver alertas de stock bajo
✅ Ver últimos pedidos
✅ Sistema completo de autenticación
✅ API REST profesional

### Próximos pasos:
1. Implementar gestión de pedidos
2. Agregar gestión de clientes
3. Sistema de upload de imágenes
4. Exportación de datos

**¡Éxito con Acuamarina Cerámicos!** 🏺✨
