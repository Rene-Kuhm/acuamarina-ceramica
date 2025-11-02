# 🔐 GUÍA DE ACCESO AL SISTEMA
## Aguamarina Mosaicos - E-Commerce Platform

**Versión**: 1.0
**Fecha**: Noviembre 2025
**Última Actualización**: 2 de Noviembre 2025
**Documento Confidencial** ⚠️

---

## ⚡ ACCESO RÁPIDO - PRODUCCIÓN

### 🌍 URLs Principales (EN VIVO)
```
Cliente:          https://aguamarinamosaicos.com
Admin Dashboard:  https://admin.aguamarinamosaicos.com
Backend API:      https://diligent-upliftment-production-54de.up.railway.app/api/v1
```

### 🔑 Credenciales Principales
```
Base de Datos:
  Host: db.umyrvlzhvdsibpzvfnal.supabase.co
  Usuario: postgres
  Contraseña: Aguamarina@mosaicos

Admin Dashboard:
  URL: https://admin.aguamarinamosaicos.com/login
  Usuario: admin@aguamarinamosaicos.com
  Contraseña: [CONFIGURAR EN BD]
```

### 📊 Estado del Sistema
```
✅ Frontend:    ONLINE y funcionando
✅ Admin:       ONLINE y funcionando
✅ Backend API: ONLINE y funcionando
✅ Base Datos:  ONLINE y funcionando
✅ SSL/HTTPS:   Habilitado en todos
```

---

## 📋 ÍNDICE

1. [URLs de Producción](#urls-de-producción)
2. [URLs de Desarrollo](#urls-de-desarrollo)
3. [Backend API](#backend-api)
4. [Frontend (Cliente)](#frontend-cliente)
5. [Admin Dashboard](#admin-dashboard)
6. [Base de Datos](#base-de-datos)
7. [Servicios Externos](#servicios-externos)
8. [Credenciales de Acceso](#credenciales-de-acceso)
9. [Arquitectura del Sistema](#arquitectura-del-sistema)
10. [Comandos Útiles](#comandos-útiles)

---

## 🌐 URLs DE PRODUCCIÓN (ACTIVAS)

### Frontend (Cliente) ✅ EN LÍNEA
```
URL Principal: https://aguamarinamosaicos.com
Estado: ✅ Activo y funcionando

Hosting: Vercel
Framework: Next.js 15 (App Router)
Deploy: Automático desde GitHub (branch: main)
SSL: ✅ Habilitado
```

**Verificar**: https://aguamarinamosaicos.com

### Admin Dashboard ✅ EN LÍNEA
```
URL: https://admin.aguamarinamosaicos.com
Estado: ✅ Activo y funcionando

Hosting: Vercel
Framework: Next.js 15 (App Router)
Deploy: Automático desde GitHub (branch: main)
SSL: ✅ Habilitado
Protección: Requiere autenticación
```

**Acceso**: https://admin.aguamarinamosaicos.com/login

### Backend API ✅ EN LÍNEA
```
URL Base: https://diligent-upliftment-production-54de.up.railway.app
API Endpoint: https://diligent-upliftment-production-54de.up.railway.app/api/v1
Estado: ✅ Activo y funcionando

Hosting: Railway
Framework: Node.js + Express
Deploy: Automático desde GitHub (branch: main)
Base de Datos: PostgreSQL (Supabase)
```

**Verificar API**: https://diligent-upliftment-production-54de.up.railway.app/api/v1
**Documentación**: https://diligent-upliftment-production-54de.up.railway.app/api-docs

---

## 💻 URLs DE DESARROLLO

### Frontend (Cliente)
```
URL: http://localhost:3001
Puerto: 3001

Comando para iniciar:
cd frontend
npm run dev
```

### Admin Dashboard
```
URL: http://localhost:3002
Puerto: 3002

Comando para iniciar:
cd admin-dashboard
npm run dev
```

### Backend API
```
URL: http://localhost:3000
API Endpoint: http://localhost:3000/api/v1
Puerto: 3000

Comando para iniciar:
cd backend
npm run dev
```

---

## 🚀 BACKEND API

### Información General
```
Hosting: Railway
URL Base: https://diligent-upliftment-production-54de.up.railway.app
API Version: v1
Framework: Express.js (Node.js)
Base de Datos: PostgreSQL (Supabase)
```

### Endpoints Principales

#### Autenticación
```
POST   /api/v1/auth/register        - Registrar usuario
POST   /api/v1/auth/login           - Iniciar sesión
POST   /api/v1/auth/refresh         - Refrescar token
GET    /api/v1/auth/me              - Obtener usuario actual
```

#### Productos
```
GET    /api/v1/products             - Listar productos
GET    /api/v1/products/:id         - Obtener producto
POST   /api/v1/products             - Crear producto (Admin)
PUT    /api/v1/products/:id         - Actualizar producto (Admin)
DELETE /api/v1/products/:id         - Eliminar producto (Admin)
```

#### Categorías
```
GET    /api/v1/categories           - Listar categorías
GET    /api/v1/categories/:id       - Obtener categoría
POST   /api/v1/categories           - Crear categoría (Admin)
PUT    /api/v1/categories/:id       - Actualizar categoría (Admin)
DELETE /api/v1/categories/:id       - Eliminar categoría (Admin)
```

#### Órdenes
```
GET    /api/v1/orders               - Listar órdenes (Usuario)
GET    /api/v1/orders/:id           - Obtener orden
POST   /api/v1/orders               - Crear orden
PUT    /api/v1/orders/:id/status    - Actualizar estado (Admin)
```

#### Mercado Pago
```
POST   /api/v1/mercadopago/create-preference  - Crear preferencia de pago
POST   /api/v1/mercadopago/webhook            - Webhook de notificaciones
GET    /api/v1/mercadopago/payment/:id        - Obtener estado de pago
```

#### Contacto
```
POST   /api/v1/contact              - Enviar mensaje de contacto
```

#### Newsletter
```
POST   /api/v1/newsletter/subscribe   - Suscribirse
GET    /api/v1/newsletter/verify      - Verificar suscripción
POST   /api/v1/newsletter/unsubscribe - Cancelar suscripción
```

### Documentación API (Swagger)
```
URL: https://diligent-upliftment-production-54de.up.railway.app/api-docs

Usuario: (No requiere autenticación para ver docs)
```

### Variables de Entorno Backend

```env
# Environment
NODE_ENV=production
PORT=3000
API_VERSION=v1

# Database (Supabase PostgreSQL)
DATABASE_URL=postgresql://postgres.umyrvlzhvdsibpzvfnal:sxaG348qPUac48SR@aws-1-us-east-1.pooler.supabase.com:5432/postgres
DB_HOST=db.umyrvlzhvdsibpzvfnal.supabase.co
DB_PORT=5432
DB_NAME=postgres
DB_USER=postgres
DB_PASSWORD=Aguamarina@mosaicos

# JWT Authentication
JWT_SECRET=74b9dc7350a5b584accb76d7d3ccf263f1d05485b5f95faa4bda4d4599aa08b8342439cdfe215e0b3fe81e7bcf0a7dda0169feca7c24f841948876870759852e
JWT_EXPIRES_IN=7d

# Cloudinary
CLOUDINARY_CLOUD_NAME=ddztbf1se
CLOUDINARY_API_KEY=128868447893278
CLOUDINARY_API_SECRET=F18PTLCgiZsw5_9oKnzckKcs2XY

# Mercado Pago (Producción)
MERCADOPAGO_ACCESS_TOKEN=APP_USR-8739117242123034-110209-3ac7dd69464f34205d80a02a691fefb0-2951480547
MERCADOPAGO_PUBLIC_KEY=APP_USR-c8332e1c-0d62-4cad-8ba4-47e7b319e17f

# CORS
FRONTEND_URL=https://aguamarinamosaicos.com
ADMIN_URL=https://acuamarina-ceramica-rbqj.vercel.app
```

---

## 🎨 FRONTEND (CLIENTE)

### Información General
```
Hosting: Vercel
URL: https://aguamarinamosaicos.com
Framework: Next.js 15 (App Router)
Lenguaje: TypeScript
Estilos: Tailwind CSS + shadcn/ui
```

### Rutas Principales

#### Públicas
```
/                    - Homepage
/productos           - Catálogo de productos
/productos/[slug]    - Detalle de producto
/categorias          - Lista de categorías
/categorias/[slug]   - Productos por categoría
/buscar              - Búsqueda de productos
/contacto            - Formulario de contacto
/nosotros            - Acerca de nosotros
```

#### Usuario
```
/auth/login          - Iniciar sesión
/auth/register       - Registrarse
/auth/forgot-password - Recuperar contraseña
/carrito             - Carrito de compras
/checkout            - Proceso de compra
/favoritos           - Productos favoritos
/comparar            - Comparador de productos
/cuenta              - Panel de usuario
/pedidos             - Historial de pedidos
```

### Variables de Entorno Frontend

```env
# API Backend
NEXT_PUBLIC_API_URL=https://diligent-upliftment-production-54de.up.railway.app/api/v1

# Site Configuration
NEXT_PUBLIC_BASE_URL=https://aguamarinamosaicos.com
NEXT_PUBLIC_SITE_URL=https://aguamarinamosaicos.com

# Supabase (si se usa directamente)
NEXT_PUBLIC_SUPABASE_URL=https://umyrvlzhvdsibpzvfnal.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVteXJ2bHpodmRzaWJwenZmbmFsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjAyOTUwMzIsImV4cCI6MjA3NTg3MTAzMn0.2BbeYqIrwlN3kp0lU_XULYkfMAFZb3HTlxYUnAT6mIw
```

### Características
- ✅ SEO optimizado (metadata, sitemap, robots.txt)
- ✅ PWA (Progressive Web App)
- ✅ Responsive design
- ✅ Dark mode
- ✅ Animaciones GSAP
- ✅ Cursor personalizado
- ✅ Smooth scroll
- ✅ Carrito persistente
- ✅ Favoritos y comparador
- ✅ Newsletter con verificación
- ✅ Integración Mercado Pago

---

## 🔧 ADMIN DASHBOARD

### Información General
```
Hosting: Vercel
URL: https://acuamarina-ceramica-rbqj.vercel.app
Framework: Next.js 15 (App Router)
Lenguaje: TypeScript
Estilos: Tailwind CSS + shadcn/ui
```

### Acceso

#### Credenciales de Administrador
```
Email: admin@aguamarinamosaicos.com
Contraseña: [Configurar en la base de datos]

Nota: El usuario admin debe ser creado en la base de datos
con el rol 'admin' en la tabla 'users'
```

### Rutas del Dashboard

#### Autenticación
```
/login               - Iniciar sesión admin
```

#### Panel Principal
```
/dashboard           - Dashboard principal
/dashboard/analytics - Analíticas y estadísticas
```

#### Gestión de Productos
```
/dashboard/productos              - Lista de productos
/dashboard/productos/nuevo        - Crear producto
/dashboard/productos/[id]/editar  - Editar producto
```

#### Gestión de Categorías
```
/dashboard/categorias             - Lista de categorías
/dashboard/categorias/nueva       - Crear categoría
/dashboard/categorias/[id]/editar - Editar categoría
```

#### Gestión de Órdenes
```
/dashboard/ordenes                - Lista de órdenes
/dashboard/ordenes/[id]           - Detalle de orden
```

#### Gestión de Usuarios
```
/dashboard/usuarios               - Lista de usuarios
/dashboard/usuarios/[id]          - Detalle de usuario
```

#### Newsletter
```
/dashboard/newsletter             - Suscriptores
```

#### Configuración
```
/dashboard/configuracion          - Ajustes del sistema
```

### Variables de Entorno Admin Dashboard

```env
# API Backend
NEXT_PUBLIC_API_URL=https://diligent-upliftment-production-54de.up.railway.app/api/v1

# Dashboard Configuration
NEXT_PUBLIC_SITE_URL=https://admin.aguamarinamosaicos.com

# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://umyrvlzhvdsibpzvfnal.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVteXJ2bHpodmRzaWJwenZmbmFsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjAyOTUwMzIsImV4cCI6MjA3NTg3MTAzMn0.2BbeYqIrwlN3kp0lU_XULYkfMAFZb3HTlxYUnAT6mIw
```

### Funcionalidades
- ✅ CRUD completo de productos
- ✅ CRUD completo de categorías
- ✅ Gestión de órdenes y estados
- ✅ Gestión de usuarios
- ✅ Upload de imágenes a Cloudinary
- ✅ Dashboard con estadísticas
- ✅ Gestión de newsletter
- ✅ Autenticación con JWT
- ✅ Roles y permisos

---

## 🗄️ BASE DE DATOS

### Supabase PostgreSQL

#### Información de Conexión
```
Host: db.umyrvlzhvdsibpzvfnal.supabase.co
Puerto: 5432
Base de Datos: postgres
Usuario: postgres
Contraseña: Aguamarina@mosaicos

Connection String:
postgresql://postgres.umyrvlzhvdsibpzvfnal:sxaG348qPUac48SR@aws-1-us-east-1.pooler.supabase.com:5432/postgres
```

#### Panel de Supabase
```
URL: https://supabase.com/dashboard
Project: umyrvlzhvdsibpzvfnal
URL del Proyecto: https://umyrvlzhvdsibpzvfnal.supabase.co
```

#### Credenciales de Acceso a Supabase Dashboard
```
Email: [Tu email de Supabase]
Contraseña: [Tu contraseña de Supabase]

Nota: Usa las credenciales con las que creaste el proyecto en Supabase
```

### Tablas Principales

```sql
- users              # Usuarios del sistema
- products           # Productos
- categories         # Categorías
- orders             # Órdenes/Pedidos
- order_items        # Items de cada orden
- newsletter         # Suscriptores newsletter
- contact_messages   # Mensajes de contacto
```

### Conectarse a la Base de Datos

#### Usando psql
```bash
psql "postgresql://postgres:Aguamarina@mosaicos@db.umyrvlzhvdsibpzvfnal.supabase.co:5432/postgres"
```

#### Usando DBeaver / TablePlus / pgAdmin
```
Host: db.umyrvlzhvdsibpzvfnal.supabase.co
Port: 5432
Database: postgres
Username: postgres
Password: Aguamarina@mosaicos
SSL Mode: Require
```

---

## 🔌 SERVICIOS EXTERNOS

### 1. Cloudinary (Almacenamiento de Imágenes)

```
Panel: https://console.cloudinary.com
Cloud Name: ddztbf1se

API Key: 128868447893278
API Secret: F18PTLCgiZsw5_9oKnzckKcs2XY

URL de Imágenes: https://res.cloudinary.com/ddztbf1se/image/upload/
```

**Uso:**
- Upload de imágenes de productos
- Transformaciones automáticas
- Optimización de imágenes
- CDN global

### 2. Mercado Pago (Pagos)

```
Panel: https://www.mercadopago.com.ar/developers
Modo: Producción
```

**Credenciales de Producción:**
```
Public Key: APP_USR-c8332e1c-0d62-4cad-8ba4-47e7b319e17f
Access Token: APP_USR-8739117242123034-110209-3ac7dd69464f34205d80a02a691fefb0-2951480547
Client ID: 8739117242123034
Client Secret: 5X5RPtH3uwV9YZxk8iPzdPCUuvUimD4X
```

**Webhook URL:**
```
https://diligent-upliftment-production-54de.up.railway.app/api/v1/mercadopago/webhook
```

**Configuración:**
- Tipo: Checkout Pro (redirección)
- Eventos: Pagos
- Modo: Productivo

### 3. Vercel (Hosting Frontend)

```
Panel: https://vercel.com/dashboard
Proyectos:
  - Frontend Cliente (aguamarinamosaicos.com)
  - Admin Dashboard (admin.aguamarinamosaicos.com)
```

**Acceso:**
```
Email: [Tu email de Vercel]
Contraseña: [Tu contraseña de Vercel]

GitHub: Conectado al repositorio
Repo: https://github.com/Rene-Kuhm/acuamarina-ceramica.git
```

**Configuración:**
- Auto-deploy desde main branch
- Variables de entorno configuradas en cada proyecto
- Dominios personalizados:
  * Frontend: aguamarinamosaicos.com (dominio principal)
  * Admin: admin.aguamarinamosaicos.com (subdominio)

**Subdominios configurados:**
```
1. Frontend (Producción):
   - Dominio: aguamarinamosaicos.com
   - Branch: main
   - Directorio: frontend/

2. Admin Dashboard (Producción):
   - Dominio: admin.aguamarinamosaicos.com
   - Branch: main
   - Directorio: admin-dashboard/
```

### 4. Railway (Hosting Backend)

```
Panel: https://railway.app/dashboard
Proyecto: diligent-upliftment-production-54de
```

**Acceso:**
```
Email: [Tu email de Railway]
Contraseña: [Tu contraseña de Railway]

GitHub: Conectado al repositorio
Branch: main
```

**Configuración:**
- Auto-deploy desde GitHub
- Variables de entorno configuradas
- Puerto: 3000

### 5. Google Search Console

```
URL: https://search.google.com/search-console
Propiedad: aguamarinamosaicos.com

Archivo de verificación:
https://aguamarinamosaicos.com/googlef19113adbfe98ecb.html
```

### 6. Bing Webmaster Tools

```
URL: https://www.bing.com/webmasters
Sitio: aguamarinamosaicos.com
```

---

## 🔐 CREDENCIALES DE ACCESO

### Resumen de Credenciales

#### Base de Datos (Supabase)
```
Host: db.umyrvlzhvdsibpzvfnal.supabase.co
Usuario: postgres
Contraseña: Aguamarina@mosaicos
Base de Datos: postgres
Puerto: 5432
```

#### Cloudinary
```
Cloud Name: ddztbf1se
API Key: 128868447893278
API Secret: F18PTLCgiZsw5_9oKnzckKcs2XY
```

#### Mercado Pago (Producción)
```
Public Key: APP_USR-c8332e1c-0d62-4cad-8ba4-47e7b319e17f
Access Token: APP_USR-8739117242123034-110209-3ac7dd69464f34205d80a02a691fefb0-2951480547
```

#### JWT Secret
```
JWT_SECRET: 74b9dc7350a5b584accb76d7d3ccf263f1d05485b5f95faa4bda4d4599aa08b8342439cdfe215e0b3fe81e7bcf0a7dda0169feca7c24f841948876870759852e
```

#### Admin Dashboard
```
URL: https://acuamarina-ceramica-rbqj.vercel.app
Email: admin@aguamarinamosaicos.com
Contraseña: [Definir en la base de datos]
```

---

## 🏗️ ARQUITECTURA DEL SISTEMA

### Diagrama de Arquitectura

```
┌─────────────────────────────────────────────────────────────┐
│                     CLIENTES / USUARIOS                      │
└──────────────────┬──────────────────────┬───────────────────┘
                   │                      │
                   ▼                      ▼
    ┌──────────────────────┐  ┌──────────────────────┐
    │   FRONTEND CLIENT    │  │   ADMIN DASHBOARD    │
    │   (Next.js 15)       │  │   (Next.js 15)       │
    │   Vercel             │  │   Vercel             │
    │   aguamarinamosaicos │  │   acuamarina-...     │
    └──────────┬───────────┘  └──────────┬───────────┘
               │                         │
               └────────────┬────────────┘
                            │
                            ▼
                ┌──────────────────────┐
                │   BACKEND API        │
                │   (Express.js)       │
                │   Railway            │
                │   /api/v1            │
                └──────────┬───────────┘
                           │
          ┌────────────────┼────────────────┐
          │                │                │
          ▼                ▼                ▼
  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐
  │  PostgreSQL  │  │  Cloudinary  │  │ Mercado Pago │
  │  (Supabase)  │  │  (Imágenes)  │  │   (Pagos)    │
  └──────────────┘  └──────────────┘  └──────────────┘
```

### Flujo de Datos

#### 1. Compra de Producto
```
Cliente → Frontend → Backend API → PostgreSQL
                  ↓
                  → Mercado Pago → Webhook → Backend → Actualiza Orden
```

#### 2. Gestión de Productos (Admin)
```
Admin → Admin Dashboard → Backend API → PostgreSQL
                        ↓
                        → Cloudinary (Imágenes)
```

#### 3. Visualización de Productos
```
Cliente → Frontend → Backend API → PostgreSQL → Cloudinary (URLs)
```

---

## 💻 COMANDOS ÚTILES

### Backend

#### Desarrollo
```bash
cd backend
npm install              # Instalar dependencias
npm run dev              # Modo desarrollo (nodemon)
npm start                # Modo producción
npm run build            # Compilar TypeScript
```

#### Base de Datos
```bash
npm run db:migrate       # Ejecutar migraciones
npm run db:seed          # Seed de datos iniciales
npm run db:reset         # Reset completo
```

### Frontend

#### Desarrollo
```bash
cd frontend
npm install              # Instalar dependencias
npm run dev              # Modo desarrollo (localhost:3001)
npm run build            # Build de producción
npm start                # Servir build
npm run lint             # Ejecutar linter
```

### Admin Dashboard

#### Desarrollo
```bash
cd admin-dashboard
npm install              # Instalar dependencias
npm run dev              # Modo desarrollo (localhost:3002)
npm run build            # Build de producción
npm start                # Servir build
npm run lint             # Ejecutar linter
```

### Git / Deployment

#### Git
```bash
git status               # Ver cambios
git add .                # Agregar todos los cambios
git commit -m "mensaje"  # Commit
git push origin main     # Push a GitHub
git pull origin main     # Pull cambios
```

#### Deploy Automático
```
Git Push → GitHub → Vercel/Railway Auto-Deploy
```

---

## 📊 MONITOREO Y LOGS

### Backend (Railway)
```
URL: https://railway.app/project/[project-id]/service/[service-id]
Logs: Ver en tiempo real desde el dashboard
Métricas: CPU, RAM, Network
```

### Frontend/Admin (Vercel)
```
URL: https://vercel.com/dashboard
Logs: Ver deployments y logs
Analytics: Vercel Analytics
```

### Base de Datos (Supabase)
```
URL: https://supabase.com/dashboard/project/umyrvlzhvdsibpzvfnal
SQL Editor: Ejecutar queries
Logs: Ver actividad de la base de datos
```

---

## 🆘 SOPORTE Y TROUBLESHOOTING

### Problemas Comunes

#### 1. Backend no responde
```
✅ Verificar que Railway esté activo
✅ Revisar logs en Railway dashboard
✅ Verificar variables de entorno
✅ Verificar conexión a base de datos
```

#### 2. Frontend con errores
```
✅ Verificar deploy en Vercel
✅ Revisar logs de build
✅ Verificar variables de entorno
✅ Limpiar cache (.next) y rebuil rebuild
```

#### 3. Base de datos no conecta
```
✅ Verificar credenciales
✅ Verificar SSL habilitado
✅ Verificar IP whitelist en Supabase
✅ Probar connection string directamente
```

#### 4. Imágenes no cargan
```
✅ Verificar credenciales de Cloudinary
✅ Verificar URLs de imágenes
✅ Revisar CORS en Cloudinary
```

#### 5. Pagos no funcionan
```
✅ Verificar credenciales de Mercado Pago
✅ Verificar webhook configurado
✅ Revisar logs del webhook
✅ Verificar modo producción/test
```

### Contactos de Emergencia
```
Desarrollador: [Tu nombre/email]
Hosting Backend: Railway Support
Hosting Frontend: Vercel Support
Base de Datos: Supabase Support
```

---

## 📝 NOTAS IMPORTANTES

### Seguridad
```
⚠️ NUNCA subir archivos .env a GitHub
⚠️ NUNCA compartir credenciales públicamente
⚠️ Rotar claves cada 6 meses
⚠️ Usar variables de entorno en producción
⚠️ Habilitar 2FA en todos los servicios
```

### Backups
```
✅ Supabase: Backups automáticos diarios
✅ Cloudinary: Almacenamiento permanente
✅ GitHub: Control de versiones del código
✅ Recomendación: Export manual mensual de DB
```

### Actualizaciones
```
✅ Revisar dependencias npm mensualmente
✅ Actualizar Next.js y React con cuidado
✅ Probar en desarrollo antes de producción
✅ Mantener documentación actualizada
```

---

## 📞 INFORMACIÓN DE CONTACTO

### Aguamarina Mosaicos

#### Local Comercial - Playas Doradas
```
Dirección: Avenida Buccino y Piquillines
Localidad: Playas Doradas - Sierra Grande
Provincia: Río Negro
País: Argentina
```

#### Showroom - Eduardo Castex
```
Dirección: Palacios 254
Localidad: Eduardo Castex
Provincia: La Pampa
País: Argentina
```

#### Contacto
```
Teléfonos:
  +54 9 2334 404670
  +54 9 2334 404331

Email: contacto@aguamarinamosaicos.com
Sitio Web: https://aguamarinamosaicos.com
```

#### Redes Sociales
```
Facebook: https://www.facebook.com/aguamarinamosaicos
Instagram: https://www.instagram.com/aguamarinamosaicos
```

---

## 📄 LICENCIA Y PROPIEDAD

```
© 2025 Aguamarina Mosaicos
Todos los derechos reservados

Este documento contiene información confidencial y propietaria.
No distribuir sin autorización expresa.
```

---

**Documento generado el:** Noviembre 2025
**Última actualización:** Noviembre 2025
**Versión:** 1.0

---

## ✅ CHECKLIST DE VERIFICACIÓN

### Deploy Inicial
- [ ] Backend deployado en Railway
- [ ] Frontend deployado en Vercel
- [ ] Admin Dashboard deployado en Vercel
- [ ] Base de datos configurada en Supabase
- [ ] Dominio configurado (aguamarinamosaicos.com)
- [ ] SSL/HTTPS habilitado
- [ ] Variables de entorno configuradas
- [ ] Cloudinary configurado
- [ ] Mercado Pago configurado
- [ ] Webhook de Mercado Pago funcionando

### Verificación de Funcionalidad
- [ ] Registro de usuarios funciona
- [ ] Login funciona
- [ ] Productos se muestran correctamente
- [ ] Búsqueda funciona
- [ ] Carrito funciona
- [ ] Proceso de checkout completo
- [ ] Pagos con Mercado Pago funcionan
- [ ] Admin dashboard accesible
- [ ] CRUD de productos funciona
- [ ] Newsletter funciona

### SEO y Performance
- [ ] Google Search Console verificado
- [ ] Sitemap enviado
- [ ] Robots.txt configurado
- [ ] Favicons implementados
- [ ] Meta tags completos
- [ ] Open Graph configurado
- [ ] Performance optimizado

---

**FIN DEL DOCUMENTO**
