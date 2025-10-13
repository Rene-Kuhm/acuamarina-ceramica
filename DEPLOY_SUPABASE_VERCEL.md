# 🚀 Guía Completa: Deploy con Supabase + Vercel

## ✅ Arquitectura Final

```
┌─────────────────┐     ┌──────────────┐     ┌─────────────────┐
│   Frontend      │────▶│   Backend    │────▶│   Supabase DB   │
│   (Vercel)      │     │   (Vercel)   │     │   (PostgreSQL)  │
└─────────────────┘     └──────────────┘     └─────────────────┘
```

## 📋 Parte 1: Configuración de Supabase

### Paso 1: Obtener Credenciales

1. Ve a [Supabase Dashboard](https://supabase.com/dashboard)
2. Selecciona proyecto: **umyrvlzhvdsibpzvfnal**
3. Ve a **Settings** → **Database**
4. Copia estos datos:

```bash
Host: db.umyrvlzhvdsibpzvfnal.supabase.co
Port: 5432
Database: postgres
User: postgres
Password: [TU-PASSWORD]
```

O copia la **Connection String completa**:
```
postgresql://postgres:[PASSWORD]@db.umyrvlzhvdsibpzvfnal.supabase.co:5432/postgres
```

### Paso 2: Verificar Base de Datos

En Supabase, ve a **SQL Editor** y ejecuta:

\`\`\`sql
SELECT
  'categories' as table_name, COUNT(*) as count FROM categories
UNION ALL
SELECT 'products', COUNT(*) FROM products
UNION ALL
SELECT 'users', COUNT(*) FROM users;
\`\`\`

Deberías ver:
- categories: 4
- products: 6
- users: 1 (admin@aguamarina.com)

---

## 📋 Parte 2: Deploy Backend en Vercel

### Paso 1: Instalar Vercel CLI

\`\`\`bash
npm install -g vercel
\`\`\`

### Paso 2: Login en Vercel

\`\`\`bash
vercel login
\`\`\`

### Paso 3: Configurar Variables de Entorno

Crea un archivo `.env.production` en `/backend`:

\`\`\`bash
# Base de datos Supabase
DB_HOST=db.umyrvlzhvdsibpzvfnal.supabase.co
DB_PORT=5432
DB_NAME=postgres
DB_USER=postgres
DB_PASSWORD=Aguamarina@mosaicos
DB_SSL=true
DB_MAX_CONNECTIONS=5

# Aplicación
NODE_ENV=production
PORT=3000
API_VERSION=v1

# JWT
JWT_SECRET=tu_jwt_secret_super_seguro_cambiar_en_produccion
JWT_EXPIRES_IN=7d
JWT_REFRESH_SECRET=tu_refresh_secret_super_seguro
JWT_REFRESH_EXPIRES_IN=30d

# CORS (actualizar con tus dominios)
CORS_ORIGIN=https://tu-frontend.vercel.app,https://tu-admin.vercel.app
CORS_CREDENTIALS=true

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100

# Logging
LOG_LEVEL=info
LOG_FILE=logs/app.log

# Cloudinary (opcional)
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=

# Upload
MAX_FILE_SIZE=5242880
ALLOWED_IMAGE_TYPES=image/jpeg,image/png,image/webp
\`\`\`

### Paso 4: Deploy desde el directorio backend

\`\`\`bash
cd /mnt/d/acuamarina-ceramicos/backend
vercel
\`\`\`

Sigue las instrucciones:
1. **Set up and deploy?** → Yes
2. **Which scope?** → Tu cuenta
3. **Link to existing project?** → No
4. **Project name?** → acuamarina-backend (o el que prefieras)
5. **In which directory is your code located?** → ./
6. **Override settings?** → No

### Paso 5: Añadir Variables de Entorno en Vercel

**Opción A - Por CLI:**

\`\`\`bash
# Base de datos
vercel env add DB_HOST production
# Pega: db.umyrvlzhvdsibpzvfnal.supabase.co

vercel env add DB_PORT production
# Pega: 5432

vercel env add DB_NAME production
# Pega: backend

vercel env add DB_USER production
# Pega: backend

vercel env add DB_PASSWORD production
# Pega: Aguamarina@mosaicos


vercel env add DB_SSL production
# Pega: true

vercel env add DB_MAX_CONNECTIONS production
# Pega: 5

# JWT
vercel env add JWT_SECRET production
# Pega tu JWT secret

vercel env add JWT_EXPIRES_IN production
# Pega: 7d

vercel env add JWT_REFRESH_SECRET production
# Pega tu refresh secret

vercel env add JWT_REFRESH_EXPIRES_IN production
# Pega: 30d

# CORS
vercel env add CORS_ORIGIN production
# Pega: https://tu-frontend.vercel.app,https://tu-admin.vercel.app

vercel env add CORS_CREDENTIALS production
# Pega: true

# Otros
vercel env add NODE_ENV production
# Pega: production

vercel env add API_VERSION production
# Pega: v1

vercel env add RATE_LIMIT_WINDOW_MS production
# Pega: 900000

vercel env add RATE_LIMIT_MAX_REQUESTS production
# Pega: 100

vercel env add LOG_LEVEL production
# Pega: info
\`\`\`

**Opción B - Por Dashboard:**

1. Ve a [Vercel Dashboard](https://vercel.com/dashboard)
2. Selecciona tu proyecto
3. Ve a **Settings** → **Environment Variables**
4. Añade todas las variables una por una

### Paso 6: Deploy a Producción

\`\`\`bash
vercel --prod
\`\`\`

### Paso 7: Verificar Deploy

Una vez deployado, verifica:

1. **Health Check:**
   \`\`\`bash
   curl https://tu-backend.vercel.app/health
   \`\`\`

   Deberías ver:
   \`\`\`json
   {
     "status": "ok",
     "timestamp": "2025-10-13T..."
   }
   \`\`\`

2. **API Info:**
   \`\`\`bash
   curl https://tu-backend.vercel.app/api/v1
   \`\`\`

3. **Test Products:**
   \`\`\`bash
   curl https://tu-backend.vercel.app/api/v1/products
   \`\`\`

4. **Swagger Docs:**
   Abre en navegador: `https://tu-backend.vercel.app/api-docs`

---

## 📋 Parte 3: Actualizar Frontend y Admin

### Frontend (`/frontend/lib/api/client.ts`)

\`\`\`typescript
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://tu-backend.vercel.app/api/v1';
\`\`\`

### Admin Dashboard (`/admin-dashboard/src/lib/api/client.ts`)

\`\`\`typescript
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://tu-backend.vercel.app/api/v1';
\`\`\`

### Deploy Frontend y Admin en Vercel

\`\`\`bash
# Frontend
cd /mnt/d/acuamarina-ceramicos/frontend
vercel --prod

# Admin Dashboard
cd /mnt/d/acuamarina-ceramicos/admin-dashboard
vercel --prod
\`\`\`

En ambos, añade variable de entorno:
\`\`\`bash
NEXT_PUBLIC_API_URL=https://tu-backend.vercel.app/api/v1
\`\`\`

---

## 🔧 Troubleshooting

### Error: "Database connection failed"

**Solución:**
1. Verifica que `DB_SSL=true` esté configurado
2. Revisa que el password sea correcto
3. Verifica conexión desde Supabase Dashboard

### Error: "Too many connections"

**Solución:**
Reduce `DB_MAX_CONNECTIONS=3` en Vercel

### Error: "CORS policy"

**Solución:**
Actualiza `CORS_ORIGIN` con tus dominios exactos de Vercel

### Error: "Build failed"

**Solución:**
Verifica que `vercel.json` y `api/index.ts` existan en `/backend`

---

## 📊 Monitoreo

### Logs en Vercel

\`\`\`bash
vercel logs
\`\`\`

### Métricas de Supabase

1. Ve a Supabase Dashboard
2. **Database** → **Replication**
3. Verifica conexiones activas

---

## 💰 Costos

### Supabase Free Tier:
- ✅ 500 MB Database
- ✅ Unlimited API requests
- ✅ 50,000 Monthly Active Users
- ✅ 1 GB File Storage
- ✅ 2 GB Bandwidth

### Vercel Free Tier (Hobby):
- ✅ 100 GB Bandwidth
- ✅ Unlimited Deployments
- ✅ Serverless Functions
- ✅ Custom Domains

**Costo Total: $0/mes** (dentro de los límites)

---

## 🎯 URLs Finales

Después del deploy tendrás:

\`\`\`
Backend API:     https://acuamarina-backend.vercel.app
Frontend:        https://acuamarina-ceramicos.vercel.app
Admin Dashboard: https://acuamarina-admin.vercel.app
Base de Datos:   Supabase (umyrvlzhvdsibpzvfnal)
\`\`\`

---

## ✅ Checklist Final

- [ ] Base de datos configurada en Supabase
- [ ] Variables de entorno añadidas en Vercel
- [ ] Backend deployado en Vercel
- [ ] Health check funcionando
- [ ] APIs respondiendo correctamente
- [ ] Frontend actualizado con URL del backend
- [ ] Admin actualizado con URL del backend
- [ ] Frontend deployado en Vercel
- [ ] Admin deployado en Vercel
- [ ] CORS configurado correctamente
- [ ] Login funcionando
- [ ] Productos listándose correctamente

---

## 🆘 ¿Necesitas Ayuda?

Si tienes problemas:

1. **Revisa los logs:**
   \`\`\`bash
   vercel logs --follow
   \`\`\`

2. **Verifica variables:**
   \`\`\`bash
   vercel env ls
   \`\`\`

3. **Test local antes de deploy:**
   \`\`\`bash
   cd backend
   npm run build
   npm start
   \`\`\`

4. **Verifica conexión a Supabase:**
   En Supabase Dashboard → Database → Connection pooler
