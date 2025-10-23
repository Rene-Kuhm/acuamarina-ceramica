# 🔍 Guía para Verificar y Resolver Errores 500

## Error Actual
```
Failed to load resource: the server responded with a status of 500
```

## Causas Posibles

### 1. Railway no se desplegó automáticamente ⚠️ (MÁS PROBABLE)

**Verificar:**
1. Ve a https://railway.app
2. Abre el proyecto del backend
3. Revisa la pestaña "Deployments"
4. Verifica que el último commit (`1d3b9ed`) esté desplegado

**Solución:**
- Si no está desplegado, haz clic en "Deploy" manualmente
- Espera 2-3 minutos hasta que el deployment esté "Active"

### 2. Variables de Entorno Faltantes en Railway

**Verificar:**
1. En Railway, ve a la pestaña "Variables"
2. Asegúrate de que estas variables existan:
   ```
   DATABASE_URL=postgresql://postgres.umyrvlzhvdsibpzvfnal:...
   JWT_SECRET=74b9dc7350a5b584accb76d7d3ccf263f1d05485b5f95faa4bda4d4599aa08b8342439cdfe215e0b3fe81e7bcf0a7dda0169feca7c24f841948876870759852e
   CORS_ORIGINS=http://localhost:3000,http://localhost:5173,https://acuamarina-ceramica.vercel.app,https://acuamarina-ceramica-rbqj.vercel.app
   NODE_ENV=production
   PORT=3000
   ```

**Solución:**
- Agrega cualquier variable faltante
- Redeploy después de agregar variables

### 3. Error en la Base de Datos

**Verificar:**
El error podría ser que la tabla `customers` no existe (ya lo arreglamos en el código).

**Solución:**
- Ya está arreglado en el commit `1d3b9ed`
- Solo necesita que Railway se redespliegue

## 🎯 Solución Recomendada (Paso a Paso)

### Paso 1: Forzar Redeploy en Railway
1. Ve a https://railway.app
2. Selecciona el proyecto del backend
3. Pestaña "Deployments"
4. Si el último deployment no es del commit `1d3b9ed`, haz clic en "Redeploy"
5. O ve a "Settings" → "Triggers" → Click "Trigger Deploy"

### Paso 2: Esperar el Despliegue
- Espera 3-5 minutos
- El status debe cambiar de "Building" → "Deploying" → "Active"

### Paso 3: Verificar que Funcionó
Abre esta URL en tu navegador:
```
https://diligent-upliftment-production-54de.up.railway.app/api/v1/categories
```

Debería devolver:
```json
{
  "success": true,
  "data": []
}
```

### Paso 4: Probar el Dashboard
1. Limpia el caché del navegador (Ctrl+Shift+Delete)
2. Recarga el dashboard (Ctrl+Shift+R)
3. Intenta crear una categoría

## 📝 Verificación de Estado

### ✅ Backend Funcionando
```bash
curl https://diligent-upliftment-production-54de.up.railway.app/api/v1/categories
```
Debe devolver: `{"success":true,"data":[]}`

### ✅ Vercel Admin Dashboard Actualizado
- Último deploy debe incluir commit `52ad3eb`
- Verifica en: https://vercel.com/dashboard

### ✅ Vercel Frontend Actualizado
- Último deploy debe incluir commit `39da9cc`
- Verifica en: https://vercel.com/dashboard

## 🚨 Si Nada Funciona

### Plan B: Correr Backend Localmente
```bash
cd backend
npm install
npm run dev
```

Luego actualiza el `.env.local` del admin-dashboard:
```
NEXT_PUBLIC_API_URL=http://localhost:3000/api/v1
```

## 📞 Contacto
Si después de todos estos pasos el error persiste, revisa los logs en:
- Railway: Pestaña "Logs" en el proyecto
- Vercel: Pestaña "Logs" en cada deployment
