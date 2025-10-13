# 🚀 GUÍA COMPLETA DE DESPLIEGUE GRATUITO

## 📋 Índice
1. [Base de Datos (Supabase)](#-paso-1-base-de-datos-supabase)
2. [Backend API (Railway)](#-paso-2-backend-api-railway)
3. [Frontend (Vercel)](#-paso-3-frontend-vercel)
4. [Admin Dashboard (Vercel)](#-paso-4-admin-dashboard-vercel)
5. [Verificación Final](#-paso-5-verificación-final)

---

## 🗄️ PASO 1: BASE DE DATOS (Supabase)

### **1.1 Crear cuenta y proyecto**

```bash
# 1. Ir a https://supabase.com
# 2. Click "Start your project" → Sign up con GitHub
# 3. Click "New Project"
```

**Configuración del proyecto:**
- **Organization**: Crear nueva (ej: "Aguamarina")
- **Name**: `aguamarina-ceramicos`
- **Database Password**: Generar contraseña fuerte (¡GUARDAR!)
- **Region**: `South America (São Paulo)` (más cercano a Argentina)
- **Pricing Plan**: Free
- Click **"Create new project"** (tarda 2-3 minutos)

### **1.2 Obtener credenciales de conexión**

1. Ir a **Settings** → **Database**
2. Scroll down hasta **"Connection string"**
3. Copiar el **Connection string** (URI format):

```
postgresql://postgres.xxxxxxxxxxxx:[YOUR-PASSWORD]@aws-0-sa-east-1.pooler.supabase.com:6543/postgres
```

4. También copiar desde **Settings** → **API**:
   - **Project URL**: `https://xxxxxxxxxxxx.supabase.co`
   - **anon public key**: `eyJhb...`

### **1.3 Crear tablas en Supabase**

**Opción A: SQL Editor (Recomendado)**

1. Ir a **SQL Editor** en Supabase
2. Click **"New query"**
3. Pegar este SQL:

```sql
-- Crear tabla de usuarios
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  phone VARCHAR(50),
  role VARCHAR(50) DEFAULT 'user',
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Crear tabla de categorías
CREATE TABLE categories (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  slug VARCHAR(255) UNIQUE NOT NULL,
  description TEXT,
  image VARCHAR(500),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Crear tabla de productos
CREATE TABLE products (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  slug VARCHAR(255) UNIQUE NOT NULL,
  description TEXT NOT NULL,
  price DECIMAL(10, 2) NOT NULL,
  stock INTEGER DEFAULT 0,
  images JSONB DEFAULT '[]',
  specifications JSONB DEFAULT '{}',
  featured BOOLEAN DEFAULT false,
  category_id INTEGER REFERENCES categories(id) ON DELETE SET NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Crear tabla de pedidos
CREATE TABLE orders (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  status VARCHAR(50) DEFAULT 'pending',
  total DECIMAL(10, 2) NOT NULL,
  shipping_address JSONB NOT NULL,
  items JSONB NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Crear tabla de contactos
CREATE TABLE contacts (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  phone VARCHAR(50),
  subject VARCHAR(255) NOT NULL,
  message TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Crear tabla de reviews
CREATE TABLE reviews (
  id SERIAL PRIMARY KEY,
  product_id INTEGER REFERENCES products(id) ON DELETE CASCADE,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Índices para mejor rendimiento
CREATE INDEX idx_products_category ON products(category_id);
CREATE INDEX idx_products_featured ON products(featured);
CREATE INDEX idx_orders_user ON orders(user_id);
CREATE INDEX idx_reviews_product ON reviews(product_id);

-- Datos de ejemplo (opcional)
INSERT INTO categories (name, slug, description) VALUES
('Mosaicos Cerámicos', 'mosaicos-ceramicos', 'Diseños clásicos y modernos para pisos y paredes'),
('Azulejos Decorativos', 'azulejos-decorativos', 'Dale vida a tus espacios con colores únicos'),
('Revestimientos', 'revestimientos', 'Protección y estilo para paredes interiores'),
('Pisos Cerámicos', 'pisos-ceramicos', 'Durabilidad y elegancia para todo tipo de ambientes');
```

4. Click **"Run"** para ejecutar

**Opción B: Usar Prisma Migrate (Avanzado)**

```bash
# En tu máquina local, dentro de la carpeta backend
cd backend
npm install

# Configurar .env con la URL de Supabase
echo "DATABASE_URL=postgresql://postgres.xxx:[PASSWORD]@xxx.supabase.com:6543/postgres" > .env

# Ejecutar migraciones
npx prisma migrate dev --name init
npx prisma generate
```

---

## 🔧 PASO 2: BACKEND API (Railway)

### **2.1 Preparar el Backend**

1. **Crear archivo railway.json** en la carpeta `backend/`:

```json
{
  "$schema": "https://railway.app/railway.schema.json",
  "build": {
    "builder": "NIXPACKS"
  },
  "deploy": {
    "startCommand": "npm run start:prod",
    "restartPolicyType": "ON_FAILURE",
    "restartPolicyMaxRetries": 10
  }
}
```

2. **Actualizar package.json** del backend:

```json
{
  "scripts": {
    "start": "node dist/main.js",
    "start:prod": "node dist/main.js",
    "build": "nest build",
    "prebuild": "prisma generate"
  }
}
```

### **2.2 Deploy en Railway**

```bash
# 1. Ir a https://railway.app
# 2. Sign up con GitHub (gratis)
# 3. Click "New Project" → "Deploy from GitHub repo"
# 4. Conectar tu repositorio: Rene-Kuhm/acuamarina-ceramica
# 5. Seleccionar la carpeta "backend" (Root Directory)
```

**Configuración del proyecto:**

1. Railway detectará NestJS automáticamente
2. Click en **"Add variables"** para configurar:

```env
# Copia estas variables:
NODE_ENV=production
PORT=3000
DATABASE_URL=postgresql://postgres.xxx:[PASSWORD]@xxx.supabase.com:6543/postgres
JWT_SECRET=tu_secret_muy_seguro_cambialo
FRONTEND_URL=https://tu-frontend.vercel.app
ADMIN_URL=https://tu-admin.vercel.app
CORS_ORIGINS=https://tu-frontend.vercel.app,https://tu-admin.vercel.app
```

3. Click **"Deploy"**
4. Esperar que termine el build (3-5 minutos)
5. Railway te dará una URL: `https://backend-production-xxxx.up.railway.app`

### **2.3 Configurar dominio público**

1. En Railway, click en tu servicio backend
2. Click en **"Settings"** → **"Networking"**
3. Click **"Generate Domain"**
4. Copiar la URL: `https://backend-production-xxxx.up.railway.app`

### **2.4 Verificar que funciona**

```bash
# Probar en el navegador o con curl:
curl https://backend-production-xxxx.up.railway.app/health

# Debería responder:
# {"status":"ok"}
```

---

## 🎨 PASO 3: FRONTEND (Vercel)

### **3.1 Preparar variables de entorno**

1. En la carpeta `frontend/`, crear `.env.production`:

```env
NEXT_PUBLIC_API_URL=https://backend-production-xxxx.up.railway.app/api
NEXT_PUBLIC_BASE_URL=https://aguamarina-mosaicos.vercel.app
```

### **3.2 Deploy en Vercel**

```bash
# Opción A: Desde la web (Más fácil)

# 1. Ir a https://vercel.com
# 2. Sign up con GitHub (gratis)
# 3. Click "Add New" → "Project"
# 4. Import tu repositorio: Rene-Kuhm/acuamarina-ceramica
# 5. Configurar:
```

**Framework Preset**: Next.js
**Root Directory**: `frontend`
**Build Command**: `npm run build`
**Output Directory**: `.next`
**Install Command**: `npm install`

**Environment Variables**:
```
NEXT_PUBLIC_API_URL=https://backend-production-xxxx.up.railway.app/api
NEXT_PUBLIC_BASE_URL=https://aguamarina-mosaicos.vercel.app
```

6. Click **"Deploy"**
7. Vercel te dará una URL: `https://aguamarina-mosaicos.vercel.app`

### **3.3 Configurar dominio personalizado (Opcional)**

1. En Vercel, ir a **Settings** → **Domains**
2. Agregar tu dominio: `aguamarina-mosaicos.com`
3. Seguir instrucciones de DNS

---

## 👨‍💼 PASO 4: ADMIN DASHBOARD (Vercel)

### **4.1 Preparar variables de entorno**

1. En la carpeta `admin-dashboard/`, crear `.env.production`:

```env
NEXT_PUBLIC_API_URL=https://backend-production-xxxx.up.railway.app/api
NEXT_PUBLIC_SITE_URL=https://aguamarina-admin.vercel.app
```

### **4.2 Deploy en Vercel**

Igual que el frontend pero con:

**Root Directory**: `admin-dashboard`
**Project Name**: `aguamarina-admin`

**Environment Variables**:
```
NEXT_PUBLIC_API_URL=https://backend-production-xxxx.up.railway.app/api
NEXT_PUBLIC_SITE_URL=https://aguamarina-admin.vercel.app
```

URL resultante: `https://aguamarina-admin.vercel.app`

---

## ✅ PASO 5: VERIFICACIÓN FINAL

### **5.1 Actualizar CORS en Backend**

1. Volver a Railway → Backend → Variables
2. Actualizar `CORS_ORIGINS` con las URLs reales:

```env
CORS_ORIGINS=https://aguamarina-mosaicos.vercel.app,https://aguamarina-admin.vercel.app
FRONTEND_URL=https://aguamarina-mosaicos.vercel.app
ADMIN_URL=https://aguamarina-admin.vercel.app
```

3. Redeploy el backend

### **5.2 Probar cada parte**

**Base de Datos:**
```bash
# Desde Supabase SQL Editor:
SELECT * FROM categories;
# Debería mostrar las 4 categorías
```

**Backend:**
```bash
# Probar endpoints:
curl https://backend-production-xxxx.up.railway.app/api/categories
curl https://backend-production-xxxx.up.railway.app/api/products
```

**Frontend:**
```
https://aguamarina-mosaicos.vercel.app
- Debe cargar la homepage
- Debe mostrar categorías
- Debe funcionar la navegación
```

**Admin Dashboard:**
```
https://aguamarina-admin.vercel.app
- Debe cargar el login
- Puedes crear un usuario admin desde Supabase
```

### **5.3 Crear usuario admin**

En Supabase SQL Editor:

```sql
-- Crear usuario admin (password hasheada con bcrypt)
-- Password por defecto: admin123
INSERT INTO users (name, email, password, role) VALUES
('Admin', 'admin@aguamarina.com', '$2b$10$XYZ...', 'admin');
```

O desde el backend una vez desplegado:

```bash
curl -X POST https://backend-production-xxxx.up.railway.app/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Admin",
    "email": "admin@aguamarina.com",
    "password": "Admin123!",
    "role": "admin"
  }'
```

---

## 🎉 RESUMEN DE URLs

| Componente | URL | Costo |
|------------|-----|-------|
| **Base de Datos** | Supabase Dashboard | 🆓 Gratis |
| **Backend API** | https://backend-production-xxxx.up.railway.app | 🆓 Gratis ($5/mes) |
| **Frontend** | https://aguamarina-mosaicos.vercel.app | 🆓 Gratis |
| **Admin Dashboard** | https://aguamarina-admin.vercel.app | 🆓 Gratis |

**Total mensual: $0** (dentro de los límites gratuitos)

---

## 📊 LÍMITES DE PLANES GRATUITOS

### **Supabase (Free Tier)**
- ✅ 500 MB storage
- ✅ 2 GB data transfer/mes
- ✅ 50,000 monthly active users
- ✅ Backups 7 días
- ⏸️ Pausa después de 1 semana de inactividad

### **Railway (Trial)**
- ✅ $5 crédito mensual (~500 horas)
- ✅ 1 GB RAM
- ✅ 1 vCPU
- ✅ 100 GB bandwidth/mes
- 💳 Requiere tarjeta para trial (no cobra)

### **Vercel (Hobby)**
- ✅ 100 GB bandwidth/mes
- ✅ 100 builds/mes
- ✅ Deploy ilimitados
- ✅ Dominios ilimitados
- ✅ SSL automático

---

## 🔧 ALTERNATIVAS GRATUITAS

Si Railway te pide tarjeta y no tienes:

### **Backend Alternativo: Render**
```bash
# 1. Ir a https://render.com
# 2. Sign up con GitHub
# 3. New → Web Service
# 4. Conectar repo: backend/
# 5. Plan: Free ($0)
```

### **Backend Alternativo: Fly.io**
```bash
# Instalar CLI
curl -L https://fly.io/install.sh | sh

# Deploy
cd backend
fly launch
fly deploy
```

---

## 🐛 TROUBLESHOOTING

### **Error: "Database connection failed"**
- Verifica DATABASE_URL en Railway
- Asegúrate que el pooler de Supabase esté activo
- Usa puerto 6543 (pooler) en vez de 5432

### **Error: "CORS blocked"**
- Verifica CORS_ORIGINS en Railway backend
- Debe incluir las URLs exactas de Vercel
- No incluir trailing slashes

### **Error: "Build failed on Vercel"**
```bash
# Asegúrate que package.json tiene:
"engines": {
  "node": ">=18.17.0"
}
```

### **Backend se duerme en Railway**
- Es normal en plan gratuito
- Primera request puede tardar 5-10 segundos
- Considera usar un "keep-alive" ping

---

## 📱 PRÓXIMOS PASOS

1. **Configurar dominio propio**
   - Comprar dominio en Namecheap/GoDaddy
   - Conectar a Vercel

2. **Añadir productos de prueba**
   - Desde admin dashboard
   - O con SQL en Supabase

3. **Configurar backups**
   - Supabase hace backups automáticos (7 días)
   - Considerar export manual semanal

4. **Monitoreo**
   - Railway tiene logs integrados
   - Vercel Analytics (gratis)
   - Supabase Dashboard para DB

5. **Optimizar costos**
   - Una vez validado, considera plans pagos
   - Railway: $5/mes por servicio
   - Supabase: $25/mes Pro

---

## ✅ CHECKLIST FINAL

- [ ] Supabase proyecto creado
- [ ] Base de datos migrada
- [ ] Backend desplegado en Railway
- [ ] Frontend desplegado en Vercel
- [ ] Admin Dashboard desplegado en Vercel
- [ ] Variables de entorno configuradas
- [ ] CORS actualizado
- [ ] Usuario admin creado
- [ ] Datos de prueba cargados
- [ ] Todas las URLs funcionando

---

**¡Listo! Tu e-commerce está en producción 100% gratis 🎉**

Para soporte: [GitHub Issues](https://github.com/Rene-Kuhm/acuamarina-ceramica/issues)
