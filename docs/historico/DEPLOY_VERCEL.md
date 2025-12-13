# 🚀 Guía de Deploy del Backend a Vercel

## Paso 1: Crear Proyecto en Vercel

1. Ve a [vercel.com](https://vercel.com)
2. Click en "Add New" → "Project"
3. Importa tu repositorio `acuamarina-ceramica`
4. Configura el proyecto:
   - **Project Name**: `aguamarina-backend` (o el nombre que prefieras)
   - **Framework Preset**: Other
   - **Root Directory**: `backend`
   - **Build Command**: Dejar vacío (Vercel detecta automáticamente)
   - **Output Directory**: Dejar vacío
   - **Install Command**: `npm install`

## Paso 2: Configurar Variables de Entorno

En el dashboard de Vercel, ve a:
**Settings → Environment Variables**

Agrega las siguientes variables (copia los valores de Railway):

### Variables Esenciales ✅

```bash
NODE_ENV=production
API_VERSION=v1

# Base de datos Neon
DATABASE_URL=postgresql://user:password@host.neon.tech:5432/database?sslmode=require

# JWT
JWT_SECRET=your_super_secret_jwt_key
JWT_EXPIRES_IN=7d
JWT_REFRESH_SECRET=your_refresh_token_secret
JWT_REFRESH_EXPIRES_IN=30d

# Cloudinary
CLOUDINARY_CLOUD_NAME=tu_cloud_name
CLOUDINARY_API_KEY=tu_api_key
CLOUDINARY_API_SECRET=tu_api_secret

# MercadoPago
MERCADOPAGO_ACCESS_TOKEN=APP_USR-xxxxx
MERCADOPAGO_PUBLIC_KEY=APP_USR-xxxxx

# CORS
CORS_ORIGIN=https://admin.aguamarinamosaicos.com,https://acuamarina-ceramica.vercel.app
CORS_CREDENTIALS=true

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100

# Email (Resend)
RESEND_API_KEY=re_xxxxxxxxxxxx
RESEND_FROM_EMAIL=noreply@aguamarinamosaicos.com

# Frontend URL
FRONTEND_URL=https://acuamarina-ceramica.vercel.app
```

### Variables Opcionales (Valkey/Redis) ⚠️

Si tienes Valkey/Redis configurado en Railway:

```bash
REDIS_URL=redis://default:password@host:6379
```

**NOTA**: Vercel Serverless no soporta conexiones persistentes a Redis/Valkey.
Si necesitas caching, considera usar:
- Vercel KV (Redis compatible)
- Upstash Redis (serverless)

Por ahora, puedes omitir estas variables y el backend funcionará sin cache.

## Paso 3: Deploy

1. Click en **"Deploy"**
2. Espera a que termine el build (2-3 minutos)
3. Copia la URL del deploy (ej: `https://aguamarina-backend.vercel.app`)

## Paso 4: Verificar que funciona

Abre en el navegador:

```
https://tu-backend.vercel.app/health
```

Deberías ver:
```json
{
  "status": "ok",
  "timestamp": "2025-12-01T..."
}
```

También prueba:
```
https://tu-backend.vercel.app/api/v1
```

## Paso 5: Actualizar Admin Dashboard

Actualiza la variable de entorno en el proyecto Vercel del admin-dashboard:

1. Ve al proyecto `admin-dashboard` en Vercel
2. Settings → Environment Variables
3. Actualiza `NEXT_PUBLIC_API_URL` con tu nueva URL:

```bash
NEXT_PUBLIC_API_URL=https://tu-backend.vercel.app/api/v1
```

4. Redeploy el admin-dashboard (Deployments → ⋮ → Redeploy)

## Paso 6: Desactivar Railway (Opcional)

Una vez que verifiques que todo funciona en Vercel:

1. Ve a tu proyecto en Railway
2. Settings → Danger → Delete Service

Esto evitará cargos innecesarios.

---

## 🔧 Troubleshooting

### Error: "Database connection failed"
- Verifica que `DATABASE_URL` esté correctamente configurado
- Asegúrate de incluir `?sslmode=require` al final de la URL de Neon
- Verifica que la IP de Vercel esté permitida en Neon (generalmente no hay restricciones)

### Error: "Environment variable validation failed"
- Revisa que todas las variables requeridas estén configuradas
- Ver archivo `backend/src/config/validateEnv.ts` para ver qué variables son obligatorias

### Error 404 en las rutas
- Verifica que el `vercel.json` esté en la raíz de `backend/`
- Asegúrate de que el Root Directory esté configurado como `backend`

### Las imágenes no se suben
- Verifica que las credenciales de Cloudinary sean correctas
- Cloudinary debería funcionar igual en Vercel que en Railway

---

## 📝 Notas Importantes

1. **Vercel Serverless Functions tienen límites**:
   - Timeout: 10 segundos (plan Free), 60 segundos (Pro)
   - Tamaño máximo de respuesta: 4.5MB
   - Si tienes operaciones largas, considera usar Vercel Pro o mover esas operaciones a un job queue

2. **Sin Valkey/Redis por defecto**:
   - El caching no funcionará hasta que configures Vercel KV o Upstash
   - La app funcionará sin problemas, solo sin cache

3. **Cold Starts**:
   - Las funciones serverless tienen "cold starts" (1-2 segundos)
   - La primera request después de inactividad puede ser más lenta
   - Esto es normal en serverless

4. **Logs**:
   - Los logs están en Vercel Dashboard → tu-proyecto → Logs
   - Más detallados que Railway

---

## ✅ Checklist Final

- [ ] Variables de entorno configuradas en Vercel
- [ ] Deploy exitoso (sin errores en los logs)
- [ ] `/health` responde correctamente
- [ ] `/api/v1` responde con info de la API
- [ ] Admin dashboard actualizado con nueva URL
- [ ] Probado crear/editar productos y categorías
- [ ] Railway desactivado (opcional)

---

¡Listo! Tu backend ahora está en Vercel con mejor integración y deploys más confiables. 🎉
