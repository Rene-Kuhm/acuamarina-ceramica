# Guía: Configurar Admin Dashboard en Vercel para conectar con Backend en Railway

## 🎯 URLs del Proyecto

- **Backend (Railway)**: https://diligent-upliftment-production-54de.up.railway.app
- **Admin Dashboard (Vercel)**:
  - Production: https://acuamarina-ceramica-rbqj.vercel.app
  - Git Main: https://acuamarina-ceramica-rbqj-git-main-rene-kuhms-projects.vercel.app
  - Preview: https://acuamarina-ceramica-rbqj-nti3upu1s-rene-kuhms-projects.vercel.app

---

## 📋 Pasos de Configuración

### 1. Configurar Variables de Entorno en Vercel

Ve a tu proyecto en Vercel: https://vercel.com/rene-kuhms-projects/acuamarina-ceramica-rbqj

1. **Settings → Environment Variables**
2. **Agrega las siguientes variables** (aplicar a Production, Preview y Development):

```env
NEXT_PUBLIC_API_URL=https://diligent-upliftment-production-54de.up.railway.app/api/v1
NEXT_PUBLIC_SITE_URL=https://acuamarina-ceramica-rbqj.vercel.app
NEXT_PUBLIC_SUPABASE_URL=https://umyrvlzhvdsibpzvfnal.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVteXJ2bHpodmRzaWJwenZmbmFsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjAyOTUwMzIsImV4cCI6MjA3NTg3MTAzMn0.2BbeYqIrwlN3kp0lU_XULYkfMAFZb3HTlxYUnAT6mIw
```

3. **Guarda los cambios**
4. **Redesplega**: Ve a Deployments → Latest → ⋯ → Redeploy

---

### 2. Configurar Variables de Entorno en Railway

Ve a tu proyecto en Railway: https://railway.app/

1. **Selecciona el servicio backend**
2. **Variables → Raw Editor**
3. **Agrega/actualiza `CORS_ORIGINS`**:

```env
CORS_ORIGINS=https://acuamarina-ceramica-rbqj.vercel.app,https://acuamarina-ceramica-rbqj-git-main-rene-kuhms-projects.vercel.app,https://acuamarina-ceramica-rbqj-nti3upu1s-rene-kuhms-projects.vercel.app
```

4. **Guarda** → Railway redesplegará automáticamente

**Nota**: Tu backend ya acepta dominios `*.vercel.app` por defecto, pero agregar las URLs específicas mejora la seguridad.

---

### 3. Verificar la Conexión

#### A) Verificar el Backend

Abre en tu navegador:
```
https://diligent-upliftment-production-54de.up.railway.app/api/v1
```

Deberías ver:
```json
{
  "message": "API Aguamarina Mosaicos",
  "version": "v1",
  "endpoints": {...}
}
```

#### B) Verificar Health Check

```
https://diligent-upliftment-production-54de.up.railway.app/health
```

Deberías ver:
```json
{
  "success": true,
  "message": "API Aguamarina Mosaicos - Servidor activo",
  ...
}
```

#### C) Probar CORS desde el Admin Dashboard

1. Abre tu admin dashboard: https://acuamarina-ceramica-rbqj.vercel.app
2. Abre la consola del navegador (F12)
3. Ejecuta:

```javascript
fetch('https://diligent-upliftment-production-54de.up.railway.app/api/v1/health', {
  method: 'GET',
  headers: {
    'Content-Type': 'application/json',
  },
})
.then(res => res.json())
.then(data => console.log('✅ CORS funcionando:', data))
.catch(err => console.error('❌ Error CORS:', err));
```

Si ves `✅ CORS funcionando:` con datos, ¡la conexión está funcionando!

---

### 4. Actualizar el Código Local y Desplegar

Los archivos `.env.local` y `.env.production` en tu proyecto local ya fueron actualizados con las URLs correctas.

**Para desplegar los cambios a Vercel:**

```bash
cd D:\acuamarina-ceramicos\admin-dashboard
git add .env.production
git commit -m "Update API URL to Railway backend"
git push
```

Vercel detectará el push y redesplegará automáticamente.

---

## 🔍 Troubleshooting

### Error: "Failed to fetch" o "Network Error"

**Posibles causas:**
1. El backend de Railway está apagado
2. La URL de la API está mal escrita
3. Problema de CORS

**Soluciones:**
1. Verifica que el backend responda en: https://diligent-upliftment-production-54de.up.railway.app/health
2. Revisa que `NEXT_PUBLIC_API_URL` esté correctamente configurado en Vercel
3. Verifica los logs de Railway: Dashboard → Logs

### Error: "CORS policy: No 'Access-Control-Allow-Origin' header"

**Causa**: CORS no está configurado correctamente

**Solución:**
1. Verifica que `CORS_ORIGINS` en Railway incluya las 3 URLs de Vercel
2. Asegúrate de no tener espacios en la lista de URLs
3. Redesplega Railway después de cambiar las variables
4. Revisa los logs de Railway para ver: `⚠️ CORS blocked origin: ...`

### El admin dashboard sigue apuntando a la URL antigua

**Causa**: Las variables de entorno en Vercel no están actualizadas o el despliegue no se ha completado

**Solución:**
1. Ve a Vercel → Settings → Environment Variables
2. Verifica que `NEXT_PUBLIC_API_URL` sea la URL de Railway
3. Si las variables están correctas, fuerza un redespliegue: Deployments → Latest → Redeploy

---

## 📝 Endpoints Disponibles

Una vez configurado, tu admin dashboard podrá acceder a:

| Recurso | Endpoint |
|---------|----------|
| API Info | `GET /api/v1` |
| Login | `POST /api/v1/auth/login` |
| Register | `POST /api/v1/auth/register` |
| Products | `GET/POST/PUT/DELETE /api/v1/products` |
| Categories | `GET/POST/PUT/DELETE /api/v1/categories` |
| Orders | `GET/POST/PUT/DELETE /api/v1/orders` |
| Customers | `GET/POST/PUT/DELETE /api/v1/customers` |
| Stats | `GET /api/v1/stats` |
| Upload | `POST /api/v1/upload` |
| Export | `GET /api/v1/export` |
| Docs | `GET /api-docs` |

---

## 🚀 Resultado Final

Después de seguir estos pasos:

✅ Admin dashboard en Vercel conectado con backend en Railway
✅ CORS configurado correctamente
✅ Todas las peticiones API funcionando
✅ Login, productos, categorías, etc. accesibles desde el dashboard

---

## 📚 Referencias

- **Guía CORS completa**: Ver `RAILWAY_CORS_SETUP.md`
- **Variables de Railway**: Ver `backend/.env.railway`
- **Backend API**: https://diligent-upliftment-production-54de.up.railway.app/api-docs
