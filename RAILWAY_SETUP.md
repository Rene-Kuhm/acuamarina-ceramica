# 🚂 RAILWAY SETUP - Backend Deployment

## ⚠️ ERROR COMÚN: "tsconfig.json not found"

Si ves este error al desplegar en Railway, sigue estos pasos:

---

## ✅ SOLUCIÓN PASO A PASO

### **Paso 1: Configurar Root Directory en Railway**

1. Ve a tu proyecto en Railway: https://railway.app/project/[tu-proyecto]
2. Click en el servicio **Backend** (o como lo hayas llamado)
3. Click en **"Settings"** (⚙️)
4. Scroll down hasta **"Build & Deploy"**
5. En **"Root Directory"**, ingresa: `backend`
6. Click **"Save"** o presiona Enter

### **Paso 2: Verificar que los archivos estén listos**

Asegúrate que estos archivos existan en `backend/`:

- ✅ `railway.json` (ya creado)
- ✅ `Dockerfile` (ya existe)
- ✅ `.dockerignore` (corregido para NO ignorar tsconfig.json)
- ✅ `tsconfig.json` (debe existir)
- ✅ `package.json` (debe existir)

### **Paso 3: Redeploy**

1. En Railway, click en **"Deployments"** (en el menú lateral)
2. Click en el botón **"Redeploy"** del último deployment fallido
3. O simplemente haz un `git push` al repositorio conectado

---

## 🔧 CONFIGURACIÓN COMPLETA DE RAILWAY

### **Variables de Entorno** (Settings → Variables)

Agrega estas variables:

```env
NODE_ENV=production
PORT=3000
DATABASE_URL=postgresql://postgres.umyrvlzhvdsibpzvfnal:Aguamarina@mosaicos@aws-1-us-east-1.pooler.supabase.com:5432/postgres
JWT_SECRET=aguamarina_super_secret_jwt_key_2025_change_in_production
JWT_EXPIRES_IN=7d
FRONTEND_URL=https://tu-frontend.vercel.app
ADMIN_URL=https://tu-admin.vercel.app
CORS_ORIGINS=https://tu-frontend.vercel.app,https://tu-admin.vercel.app
```

**IMPORTANTE**: Cambia `FRONTEND_URL` y `ADMIN_URL` con las URLs reales de Vercel cuando las tengas.

### **Build Configuration**

Railway debería detectar automáticamente el `Dockerfile`. Si no:

- **Builder**: DOCKERFILE
- **Dockerfile Path**: `Dockerfile`
- **Root Directory**: `backend`

### **Deploy Configuration**

- **Start Command**: `node dist/server.js` (definido en railway.json)
- **Restart Policy**: ON_FAILURE
- **Max Retries**: 10

---

## 📊 VERIFICACIÓN

Una vez desplegado exitosamente:

1. Railway te dará una URL: `https://backend-production-xxxx.up.railway.app`
2. Prueba el health check:

```bash
curl https://backend-production-xxxx.up.railway.app/health
```

Deberías ver:
```json
{"status":"ok"}
```

3. Prueba los endpoints de API:

```bash
# Categorías
curl https://backend-production-xxxx.up.railway.app/api/categories

# Productos
curl https://backend-production-xxxx.up.railway.app/api/products
```

---

## 🐛 TROUBLESHOOTING

### Error: "tsconfig.json not found"
✅ **SOLUCIONADO**: El `.dockerignore` ya fue corregido para NO ignorar `tsconfig.json`.

### Error: "Cannot find module"
- Asegúrate que `package.json` tenga todas las dependencias
- Verifica que `npm ci` se ejecute correctamente en el Dockerfile

### Error: "Database connection failed"
- Verifica que `DATABASE_URL` esté configurado correctamente en Variables
- Asegúrate que la contraseña no tenga caracteres especiales sin escapar
- Usa el **Pooler URL** de Supabase (puerto 6543 o 5432)

### Error: "Port already in use"
- Railway automáticamente asigna un puerto
- No cambies `PORT=3000` en las variables

### Build muy lento
- Normal en plan gratuito
- La primera vez puede tardar 5-10 minutos
- Deployments subsiguientes son más rápidos (usa cache)

### Backend se duerme (cold start)
- Es normal en plan gratuito de Railway
- La primera request después de inactividad tarda 5-10 segundos
- Considera usar un "keep-alive" ping si es crítico

---

## 💰 COSTOS

**Railway Free Tier**:
- $5 de crédito mensual (~500 horas)
- 1 GB RAM
- 1 vCPU
- 100 GB bandwidth/mes
- Requiere tarjeta para activar trial (NO cobra)

**Alternativas gratuitas sin tarjeta**:
- **Render.com**: 750 horas/mes gratis (pero más lento)
- **Fly.io**: 3 VMs gratis (requiere CLI)

---

## 📱 PRÓXIMOS PASOS

1. ✅ Desplegar backend en Railway
2. ⏳ Obtener la URL del backend: `https://backend-production-xxxx.up.railway.app`
3. ⏳ Actualizar `.env.local` en frontend con la URL del backend
4. ⏳ Actualizar `.env.local` en admin-dashboard con la URL del backend
5. ⏳ Desplegar frontend en Vercel
6. ⏳ Desplegar admin-dashboard en Vercel
7. ⏳ Actualizar `CORS_ORIGINS` en Railway con las URLs de Vercel
8. ⏳ Redeploy backend con las nuevas URLs

---

## ✅ CHECKLIST

- [ ] Root Directory configurado en Railway (`backend`)
- [ ] railway.json creado
- [ ] .dockerignore corregido (NO ignora tsconfig.json)
- [ ] Variables de entorno configuradas
- [ ] DATABASE_URL apunta a Supabase
- [ ] Build exitoso (sin errores)
- [ ] Health check responde `/health`
- [ ] API endpoints funcionan `/api/categories`
- [ ] CORS configurado con URLs de frontend/admin

---

**¿Problemas?** Revisa los **Logs** en Railway:
- Click en tu servicio Backend
- Click en **"Deployments"**
- Click en el deployment que falló
- Lee los **Build Logs** y **Deploy Logs**

---

**Última actualización**: 2025-10-12
