# Guía de Despliegue - Aguamarina Mosaicos

## Arquitectura del Proyecto

### Servicios Desplegados

1. **Frontend Principal**: `https://aguamarinamosaicos.com`
   - Plataforma: Vercel
   - Framework: Next.js 15
   - Directorio: `/frontend`

2. **Dashboard Administrativo**: `https://acuamarina-ceramica-rbqj.vercel.app`
   - Plataforma: Vercel
   - Framework: Next.js 15
   - Directorio: `/admin-dashboard`

3. **Backend API**: `https://diligent-upliftment-production-54de.up.railway.app`
   - Plataforma: Railway
   - Framework: Express + TypeScript
   - Directorio: `/backend`

4. **Base de Datos**: Supabase PostgreSQL
   - Host: `db.umyrvlzhvdsibpzvfnal.supabase.co`

---

## Configuración de Variables de Entorno

### 🚀 Railway (Backend)

**Variables Críticas a Configurar:**

```bash
# API Configuration
NODE_ENV=production
PORT=3000
API_VERSION=v1

# CORS - IMPORTANTE: Incluir todos los dominios
CORS_ORIGINS=https://aguamarinamosaicos.com,https://www.aguamarinamosaicos.com,https://acuamarina-ceramica-rbqj.vercel.app,https://acuamarina-ceramica-rbqj-git-main-rene-kuhms-projects.vercel.app,https://acuamarina-ceramica-rbqj-nti3upu1s-rene-kuhms-projects.vercel.app

# Database (Supabase)
DB_HOST=db.umyrvlzhvdsibpzvfnal.supabase.co
DB_PORT=5432
DB_NAME=postgres
DB_USER=postgres
DB_PASSWORD=<tu-password-de-supabase>
DB_SSL=true
DB_MAX_CONNECTIONS=20

# JWT (Generar secretos seguros)
JWT_SECRET=<genera-un-secret-seguro>
JWT_EXPIRES_IN=7d
JWT_REFRESH_SECRET=<genera-otro-secret-seguro>
JWT_REFRESH_EXPIRES_IN=30d

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100

# Logging
LOG_LEVEL=info
LOG_FILE=logs/app.log

# Upload
MAX_FILE_SIZE=5242880
ALLOWED_IMAGE_TYPES=image/jpeg,image/png,image/webp
```

**Cómo actualizar en Railway:**
1. Ve a tu proyecto en Railway
2. Click en "Variables"
3. Actualiza `CORS_ORIGINS` con el valor completo de arriba
4. Railway redesplegará automáticamente

---

### 🌐 Vercel - Frontend Principal (aguamarinamosaicos.com)

**Settings → Environment Variables:**

```bash
# API Backend
NEXT_PUBLIC_API_URL=https://diligent-upliftment-production-54de.up.railway.app/api/v1

# Site URL
NEXT_PUBLIC_SITE_URL=https://aguamarinamosaicos.com

# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://umyrvlzhvdsibpzvfnal.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=<tu-supabase-anon-key>

# Environment
NODE_ENV=production
```

**Después de actualizar:**
- Deployments → Latest → "Redeploy"

---

### 🎛️ Vercel - Admin Dashboard (acuamarina-ceramica-rbqj.vercel.app)

**Settings → Environment Variables:**

```bash
# Backend API
NEXT_PUBLIC_API_URL=https://diligent-upliftment-production-54de.up.railway.app/api/v1

# Dashboard URL
NEXT_PUBLIC_SITE_URL=https://acuamarina-ceramica-rbqj.vercel.app

# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://umyrvlzhvdsibpzvfnal.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=<tu-supabase-anon-key>
```

---

## Verificación de Conectividad

### 1. Verificar CORS en Railway

```bash
curl -I -X OPTIONS https://diligent-upliftment-production-54de.up.railway.app/api/v1/health \
  -H "Origin: https://aguamarinamosaicos.com" \
  -H "Access-Control-Request-Method: GET"
```

**Respuesta esperada:**
```
HTTP/2 204
access-control-allow-origin: https://aguamarinamosaicos.com
access-control-allow-credentials: true
```

### 2. Verificar Health Check del Backend

```bash
curl https://diligent-upliftment-production-54de.up.railway.app/health
```

**Respuesta esperada:**
```json
{
  "status": "ok",
  "timestamp": "..."
}
```

### 3. Verificar Frontend

Abre `https://aguamarinamosaicos.com` y verifica:
- ✅ La página carga correctamente
- ✅ No hay errores CORS en la consola del navegador
- ✅ Las llamadas a la API funcionan

### 4. Verificar Dashboard

Abre `https://acuamarina-ceramica-rbqj.vercel.app` y verifica:
- ✅ Login funciona correctamente
- ✅ Puede cargar datos desde la API
- ✅ No hay errores CORS

---

## Solución de Problemas Comunes

### Error: "Not allowed by CORS"

**Causa:** El dominio no está en la lista de `CORS_ORIGINS` en Railway.

**Solución:**
1. Ve a Railway → Variables
2. Verifica que `CORS_ORIGINS` incluya tu dominio
3. Formato correcto: URLs completas separadas por comas (sin espacios)
4. Redespliega si es necesario

### Error: "Failed to fetch" o "Network Error"

**Causa:** URL del backend incorrecta o backend no disponible.

**Solución:**
1. Verifica que `NEXT_PUBLIC_API_URL` sea correcta en Vercel
2. Verifica que Railway esté corriendo: `curl https://diligent-upliftment-production-54de.up.railway.app/health`
3. Revisa los logs en Railway

### Frontend no se conecta al backend después de cambiar dominio

**Causa:** Variables de entorno desactualizadas en Vercel.

**Solución:**
1. Actualiza las variables en Vercel
2. **IMPORTANTE:** Redespliega manualmente (Deployments → Redeploy)
3. Las variables no se actualizan hasta el próximo deploy

---

## Cambios Recientes

### 2025-01-27: Configuración de dominio personalizado

**Archivos de referencia actualizados:**
- `frontend/.env.production` - URL actualizada a aguamarinamosaicos.com
- `backend/.env.railway` - CORS actualizado para incluir el dominio personalizado

**Nota:** Los archivos `.env.*` están en `.gitignore` por seguridad. Usa este documento como referencia para configurar las variables en las plataformas de deployment.

---

## Comandos Útiles

### Desplegar manualmente desde local

**Frontend:**
```bash
cd frontend
npm run build
vercel --prod
```

**Dashboard:**
```bash
cd admin-dashboard
npm run build
vercel --prod
```

**Backend:** Railway se despliega automáticamente desde GitHub.

### Ver logs

**Railway:**
- Web UI: Railway Dashboard → Project → View Logs

**Vercel:**
- Web UI: Vercel Dashboard → Project → Deployments → View Function Logs

---

## Contacto y Soporte

Para problemas o dudas sobre el despliegue, consulta:
- [Documentación de Vercel](https://vercel.com/docs)
- [Documentación de Railway](https://docs.railway.app)
- [Documentación de Supabase](https://supabase.com/docs)
