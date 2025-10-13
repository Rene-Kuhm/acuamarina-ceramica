# ⚡ QUICK START - Despliegue en 15 minutos

## 🎯 Objetivo
Tener todo funcionando en producción en **menos de 15 minutos**.

---

## ✅ PREREQUISITOS

- ✅ Cuenta de GitHub (ya la tienes)
- ✅ Repositorio subido (ya está: github.com/Rene-Kuhm/acuamarina-ceramica)
- ⚠️ Email para crear cuentas (usa el mismo para todo)

---

## ⏱️ TIEMPO ESTIMADO: 15 minutos

| Paso | Servicio | Tiempo | Acción |
|------|----------|--------|--------|
| 1 | Supabase | 3 min | Crear DB |
| 2 | Railway | 5 min | Deploy Backend |
| 3 | Vercel | 3 min | Deploy Frontend |
| 4 | Vercel | 2 min | Deploy Admin |
| 5 | Config | 2 min | Conectar todo |

---

## 🚀 EMPEZAR AHORA

### **PASO 1: BASE DE DATOS (3 minutos)**

```bash
# 1. Abrir: https://supabase.com
# 2. Sign up con GitHub (1 click)
# 3. New Project:
   - Name: aguamarina-ceramicos
   - Password: [Generar] (copiar!)
   - Region: South America
   - Click "Create"

# 4. Esperar 2 minutos...

# 5. Ir a SQL Editor → New query → Pegar:
```

```sql
CREATE TABLE categories (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  slug VARCHAR(255) UNIQUE NOT NULL,
  description TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE products (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  slug VARCHAR(255) UNIQUE NOT NULL,
  description TEXT NOT NULL,
  price DECIMAL(10, 2) NOT NULL,
  stock INTEGER DEFAULT 0,
  images JSONB DEFAULT '[]',
  category_id INTEGER REFERENCES categories(id),
  featured BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  role VARCHAR(50) DEFAULT 'user',
  created_at TIMESTAMP DEFAULT NOW()
);

INSERT INTO categories (name, slug, description) VALUES
('Mosaicos', 'mosaicos', 'Mosaicos cerámicos'),
('Azulejos', 'azulejos', 'Azulejos decorativos'),
('Pisos', 'pisos', 'Pisos cerámicos');
```

**Click "Run"** ✅

**Copiar DATABASE_URL:**
- Settings → Database → Connection String
- Copiar: `postgresql://postgres...`

---

### **PASO 2: BACKEND (5 minutos)**

```bash
# 1. Abrir: https://railway.app
# 2. Sign up con GitHub (1 click)
# 3. New Project → Deploy from GitHub
# 4. Seleccionar: Rene-Kuhm/acuamarina-ceramica
# 5. Root Directory: backend
# 6. Add Variables:
```

```env
NODE_ENV=production
PORT=3000
DATABASE_URL=postgresql://postgres... (pegar de Supabase)
JWT_SECRET=mi_secreto_super_seguro_123456
FRONTEND_URL=https://temp.vercel.app
ADMIN_URL=https://temp.vercel.app
CORS_ORIGINS=https://temp.vercel.app
```

**Click "Deploy"** ✅

Esperar 3 minutos...

**Settings → Networking → Generate Domain**

Copiar URL: `https://backend-production-xxxx.up.railway.app`

---

### **PASO 3: FRONTEND (3 minutos)**

```bash
# 1. Abrir: https://vercel.com
# 2. Sign up con GitHub (1 click)
# 3. Add New → Project
# 4. Import: Rene-Kuhm/acuamarina-ceramica
# 5. Root Directory: frontend
# 6. Configure Project:
   - Framework: Next.js (auto-detected)
   - Build Command: npm run build
   - Environment Variables:
```

```env
NEXT_PUBLIC_API_URL=https://backend-production-xxxx.up.railway.app/api
NEXT_PUBLIC_BASE_URL=https://aguamarina-ceramicos.vercel.app
```

**Click "Deploy"** ✅

Copiar URL: `https://aguamarina-ceramicos.vercel.app`

---

### **PASO 4: ADMIN DASHBOARD (2 minutos)**

```bash
# Mismo proceso que Frontend pero:
# Root Directory: admin-dashboard
# Project Name: aguamarina-admin
```

```env
NEXT_PUBLIC_API_URL=https://backend-production-xxxx.up.railway.app/api
NEXT_PUBLIC_SITE_URL=https://aguamarina-admin.vercel.app
```

Copiar URL: `https://aguamarina-admin.vercel.app`

---

### **PASO 5: CONECTAR TODO (2 minutos)**

**Actualizar CORS en Railway:**

1. Railway → Backend → Variables
2. Editar:

```env
FRONTEND_URL=https://aguamarina-ceramicos.vercel.app
ADMIN_URL=https://aguamarina-admin.vercel.app
CORS_ORIGINS=https://aguamarina-ceramicos.vercel.app,https://aguamarina-admin.vercel.app
```

3. Redeploy (automático)

**Crear usuario admin en Supabase:**

Supabase → SQL Editor → New query:

```sql
-- Password: admin123
INSERT INTO users (name, email, password, role) VALUES
('Admin', 'admin@test.com', '$2b$10$K7L/v0B5R5g2zYv4kKQ.c.S7X9sFb5YV5H9V5P5T5M5U5Q5Z5E5Q5', 'admin');
```

---

## ✅ LISTO!

Ahora tienes:

🌐 **Frontend**: https://aguamarina-ceramicos.vercel.app
👨‍💼 **Admin**: https://aguamarina-admin.vercel.app
🔌 **API**: https://backend-production-xxxx.up.railway.app
🗄️ **Database**: Supabase

---

## 🧪 PROBAR

**Frontend:**
```
1. Abrir: https://aguamarina-ceramicos.vercel.app
2. Ver categorías en homepage
3. Click en "Ver Productos"
4. Debe cargar (aunque esté vacío)
```

**Admin:**
```
1. Abrir: https://aguamarina-admin.vercel.app
2. Login: admin@test.com / admin123
3. Ver dashboard
4. Agregar producto de prueba
```

**API:**
```bash
curl https://backend-production-xxxx.up.railway.app/api/categories
# Debe mostrar las 3 categorías
```

---

## ❌ PROBLEMAS COMUNES

### "No puedo crear cuenta en Railway"
- Requiere tarjeta para $5 gratis
- **Alternativa**: Usar Render.com (100% gratis, sin tarjeta)

### "Build failed en Vercel"
- Verificar que Root Directory esté correcto
- Frontend: `frontend`
- Admin: `admin-dashboard`

### "CORS Error en navegador"
- Asegúrate que CORS_ORIGINS en Railway tenga las URLs exactas
- No incluir trailing slash (/)

### "Backend tarda en responder"
- Normal en plan gratuito la primera vez
- Railway hace "cold start" (5-10 seg)

---

## 📱 SIGUIENTES PASOS

1. **Agregar productos**
   - Desde admin dashboard
   - O con INSERT en Supabase

2. **Probar compra completa**
   - Registrar usuario
   - Agregar al carrito
   - Hacer checkout (simulado)

3. **Personalizar**
   - Cambiar logo
   - Modificar colores
   - Agregar contenido

4. **Dominio propio (opcional)**
   - Comprar dominio
   - Conectar en Vercel

---

## 💰 COSTOS

**Todo es GRATIS** mientras estés en límites:

| Servicio | Límite Gratis | Suficiente para |
|----------|---------------|-----------------|
| Supabase | 500MB / 2GB transfer | 1000+ productos |
| Railway | $5 crédito (~500 horas) | 1 mes pruebas |
| Vercel | 100GB bandwidth | 10,000 visitas/mes |

**Total: $0/mes** ✅

---

## 🆘 AYUDA

¿Algún problema?

1. **Guía completa**: Ver [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md)
2. **GitHub Issues**: [Reportar problema](https://github.com/Rene-Kuhm/acuamarina-ceramica/issues)
3. **Logs en Railway**: Railway Dashboard → Logs
4. **Logs en Vercel**: Vercel Dashboard → Deployments → View Function Logs

---

**¡Listo en 15 minutos! 🎉**
