# Configuración CORS para conectar Admin Dashboard (Vercel) con Backend (Railway)

## 🎯 Problema
El admin dashboard en Vercel no puede conectarse con el backend en Railway debido a restricciones CORS.

## ✅ Solución

### 1. Configurar Variables de Entorno en Railway

1. **Accede a Railway Dashboard**: https://railway.app/
2. **Selecciona tu proyecto backend**: `acuamarina-ceramicos-backend`
3. **Ve a Variables → Raw Editor**
4. **Agrega/actualiza la variable `CORS_ORIGINS`**:

```env
CORS_ORIGINS=https://acuamarina-ceramica-rbqj.vercel.app,https://acuamarina-ceramica-rbqj-git-main-rene-kuhms-projects.vercel.app,https://acuamarina-ceramica-rbqj-nti3upu1s-rene-kuhms-projects.vercel.app
```

5. **Verifica que estas variables también estén configuradas**:

```env
NODE_ENV=production
API_VERSION=v1
DB_HOST=db.umyrvlzhvdsibpzvfnal.supabase.co
DB_PORT=5432
DB_NAME=postgres
DB_USER=postgres
DB_PASSWORD=Aguamarina@mosaicos
DB_SSL=true
JWT_SECRET=74b9dc7350a5b584accb76d7d3ccf263f1d05485b5f95faa4bda4d4599aa08b8342439cdfe215e0b3fe81e7bcf0a7dda0169feca7c24f841948876870759852E
JWT_EXPIRES_IN=7d
```

6. **Guarda los cambios** → Railway redesplegará automáticamente

---

### 2. Configurar Variables de Entorno en Admin Dashboard (Vercel)

1. **Accede a Vercel Dashboard**: https://vercel.com/
2. **Selecciona tu proyecto**: `acuamarina-ceramica-rbqj`
3. **Ve a Settings → Environment Variables**
4. **Agrega las siguientes variables**:

```env
NEXT_PUBLIC_API_URL=https://diligent-upliftment-production-54de.up.railway.app/api/v1
NEXT_PUBLIC_API_BASE_URL=https://diligent-upliftment-production-54de.up.railway.app
```

5. **Aplica a todos los entornos**: Production, Preview, Development
6. **Redesplega el proyecto**: Deployments → Latest → Redeploy

---

### 3. Verificar la Conexión

#### A) Verificar el backend (Railway)

Abre en tu navegador:
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

#### B) Probar CORS desde el admin dashboard

Abre la consola del navegador en tu admin dashboard y ejecuta:

```javascript
fetch('https://diligent-upliftment-production-54de.up.railway.app/api/v1', {
  method: 'GET',
  headers: {
    'Content-Type': 'application/json',
  },
})
.then(res => res.json())
.then(data => console.log('✅ CORS funcionando:', data))
.catch(err => console.error('❌ Error CORS:', err));
```

Si ves `✅ CORS funcionando:` con datos, ¡está funcionando correctamente!

---

### 4. Endpoints Disponibles

Una vez configurado correctamente, tu admin dashboard podrá acceder a:

| Endpoint | URL Completa |
|----------|-------------|
| API Base | `https://diligent-upliftment-production-54de.up.railway.app/api/v1` |
| Auth | `https://diligent-upliftment-production-54de.up.railway.app/api/v1/auth` |
| Products | `https://diligent-upliftment-production-54de.up.railway.app/api/v1/products` |
| Categories | `https://diligent-upliftment-production-54de.up.railway.app/api/v1/categories` |
| Orders | `https://diligent-upliftment-production-54de.up.railway.app/api/v1/orders` |
| Customers | `https://diligent-upliftment-production-54de.up.railway.app/api/v1/customers` |
| Stats | `https://diligent-upliftment-production-54de.up.railway.app/api/v1/stats` |
| Upload | `https://diligent-upliftment-production-54de.up.railway.app/api/v1/upload` |
| Export | `https://diligent-upliftment-production-54de.up.railway.app/api/v1/export` |
| Docs | `https://diligent-upliftment-production-54de.up.railway.app/api-docs` |

---

## 🔍 Troubleshooting

### Error: "CORS policy: No 'Access-Control-Allow-Origin' header"

**Causa**: La URL del admin dashboard no está en `CORS_ORIGINS` en Railway

**Solución**:
1. Verifica que `CORS_ORIGINS` en Railway incluya TODAS las URLs de Vercel
2. Asegúrate de no tener espacios en la lista de URLs
3. Redesplega Railway después de cambiar variables

### Error: "Network request failed"

**Causa**: La URL de la API está mal configurada en el admin dashboard

**Solución**:
1. Verifica `NEXT_PUBLIC_API_URL` en Vercel
2. Asegúrate de incluir `/api/v1` al final
3. Redesplega el admin dashboard

### El backend no responde

**Causa**: El servicio en Railway está apagado o tiene errores

**Solución**:
1. Ve a Railway Dashboard → Logs
2. Verifica que el servicio esté corriendo
3. Revisa los logs por errores de conexión a base de datos

---

## 📝 Notas Importantes

1. **CORS ya está configurado** para aceptar cualquier dominio `*.vercel.app` en el código (línea 37-38 de `environment.ts`)
2. Agregar `CORS_ORIGINS` específicos mejora la seguridad
3. Después de cambiar variables en Railway o Vercel, **siempre redesplega**
4. Los logs de Railway te mostrarán si una petición fue bloqueada por CORS: `⚠️ CORS blocked origin: ...`

---

## 🚀 Próximos Pasos

Una vez configurado:

1. Prueba el login desde el admin dashboard
2. Verifica que las peticiones a productos, categorías, etc. funcionen
3. Revisa los logs en Railway para asegurar que no hay errores CORS
4. (Opcional) Configura un dominio personalizado en Vercel y agrégalo a `CORS_ORIGINS`

---

**Archivo de referencia**: `.env.railway` contiene todas las variables necesarias para Railway.
