# 🚂 Guía de Deployment en Railway

## 📋 Pre-requisitos

- Cuenta en [Railway.app](https://railway.app)
- Repositorio en GitHub con el backend
- PostgreSQL database (Railway puede proveerlo)

## 🚀 Paso 1: Crear Proyecto en Railway

1. Ve a [railway.app](https://railway.app) y haz login
2. Click en **"New Project"**
3. Selecciona **"Deploy from GitHub repo"**
4. Autoriza Railway a acceder a tu GitHub
5. Selecciona el repositorio `acuamarina-ceramica`
6. Railway detectará automáticamente el backend

## 🗄️ Paso 2: Agregar PostgreSQL Database

1. En tu proyecto de Railway, click en **"+ New"**
2. Selecciona **"Database" → "Add PostgreSQL"**
3. Railway creará automáticamente la database
4. Las variables de entorno se configuran automáticamente

## ⚙️ Paso 3: Configurar Variables de Entorno

En el dashboard de Railway, ve a tu servicio backend → **Variables**:

```env
# Automáticamente configuradas por Railway al agregar PostgreSQL:
DATABASE_URL=postgresql://...

# Agregar manualmente:
NODE_ENV=production
PORT=3000
API_VERSION=v1

# JWT
JWT_SECRET=tu_jwt_secret_muy_seguro_aqui
JWT_EXPIRES_IN=7d
JWT_REFRESH_SECRET=tu_refresh_secret_muy_seguro_aqui
JWT_REFRESH_EXPIRES_IN=30d

# CORS (URLs de tus frontends en Vercel)
CORS_ORIGINS=https://acuamarina-ceramica-rbqj.vercel.app,https://admin-dashboard-url.vercel.app

# Cloudinary (opcional, para imágenes)
CLOUDINARY_CLOUD_NAME=tu_cloud_name
CLOUDINARY_API_KEY=tu_api_key
CLOUDINARY_API_SECRET=tu_api_secret

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100

# Logging
LOG_LEVEL=info
```

## 🔧 Paso 4: Configurar Build Settings

Railway detecta automáticamente `railway.json`, pero puedes verificar:

**Build Command**: `npm ci && npm run build`
**Start Command**: `node dist/server.js`

## 🌐 Paso 5: Obtener URL Pública

1. En el dashboard de Railway, ve a **Settings**
2. En la sección **Networking**, click en **"Generate Domain"**
3. Railway te dará una URL como: `tu-backend.up.railway.app`
4. Copia esta URL

## 📱 Paso 6: Actualizar Frontend

Actualiza la URL del API en tu frontend:

**Admin Dashboard** (`admin-dashboard/.env.local`):
```env
NEXT_PUBLIC_API_URL=https://tu-backend.up.railway.app/api/v1
```

**Frontend Tienda** (`frontend/.env.local`):
```env
NEXT_PUBLIC_API_URL=https://tu-backend.up.railway.app/api/v1
```

## 🔄 Paso 7: Redeploy Frontends en Vercel

1. Ve a Vercel Dashboard
2. Para cada proyecto (admin-dashboard y frontend):
   - Settings → Environment Variables
   - Actualiza `NEXT_PUBLIC_API_URL` con la nueva URL de Railway
   - Deployments → Click en el último → **Redeploy**

## ✅ Paso 8: Verificar Deployment

Prueba los endpoints:

```bash
# Health check
curl https://tu-backend.up.railway.app/health

# API info
curl https://tu-backend.up.railway.app/api/v1/

# Test CORS
curl -I -X OPTIONS \
  -H "Origin: https://acuamarina-ceramica-rbqj.vercel.app" \
  https://tu-backend.up.railway.app/api/v1/auth/login
```

Deberías ver:
- Health check: `{"status":"ok","timestamp":"..."}`
- API info: `{"message":"API Aguamarina Mosaicos",...}`
- CORS headers: `Access-Control-Allow-Origin: *`

## 🔍 Logs y Monitoreo

Ver logs en tiempo real:
1. Dashboard de Railway → Tu servicio backend
2. Tab **"Logs"**
3. Filtra por nivel: `info`, `error`, `warn`

## 🐛 Troubleshooting

### Build falla

```bash
# Ver logs de build en Railway dashboard
# Común: falta de memoria, timeout

# Solución: Aumentar recursos en Settings → Resources
```

### CORS errors

```bash
# Verificar que CORS_ORIGINS incluye la URL correcta
# Railway Dashboard → Variables → CORS_ORIGINS

# Debe incluir:
# https://acuamarina-ceramica-rbqj.vercel.app
# https://tu-admin-dashboard.vercel.app
```

### Database connection errors

```bash
# Verificar que DATABASE_URL está configurada
# Railway la configura automáticamente al agregar PostgreSQL

# Format esperado:
# postgresql://user:password@host:port/database
```

### Función no responde

```bash
# Ver logs en Railway
# Común: Port incorrecto

# El backend usa process.env.PORT automáticamente
# Railway lo configura en runtime
```

## 💰 Costos

Railway ofrece:
- **$5 USD/mes de crédito gratis** (suficiente para testing)
- **Pay-as-you-go** después del crédito
- ~$5-10 USD/mes para backend + PostgreSQL en producción

## 🔐 Seguridad

1. **Nunca commitees** `.env` files
2. **Usa secrets** en Railway Variables
3. **Rota JWT secrets** regularmente
4. **Monitorea logs** por actividad sospechosa
5. **Rate limiting** está habilitado por defecto

## 📊 Métricas

Railway muestra automáticamente:
- CPU usage
- Memory usage
- Network I/O
- Request count

## 🔄 CI/CD Automático

Railway se conecta a GitHub:
- **Push a `main`** → Deploy automático
- **Pull Request** → Preview deployment
- **Rollback** → Un click en dashboard

## 📚 Recursos

- [Railway Docs](https://docs.railway.app/)
- [Railway Status](https://railway.statuspage.io/)
- [Railway Discord](https://discord.gg/railway)

---

✅ **Backend listo para Railway!**
