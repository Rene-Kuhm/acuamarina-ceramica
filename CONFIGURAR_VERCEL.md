# Configurar Variables de Entorno en Vercel

## Variables Necesarias para el Frontend

El frontend en Vercel necesita las siguientes variables de entorno:

### 1. Variables Obligatorias

```bash
# Backend API URL (Railway)
NEXT_PUBLIC_API_URL=https://diligent-upliftment-production-54de.up.railway.app/api/v1

# Frontend Site URL (tu dominio de Vercel)
NEXT_PUBLIC_SITE_URL=https://acuamarina-ceramicos-frontend.vercel.app

# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://umyrvlzhvdsibpzvfnal.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVteXJ2bHpodmRzaWJwenZmbmFsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjAyOTUwMzIsImV4cCI6MjA3NTg3MTAzMn0.2BbeYqIrwlN3kp0lU_XULYkfMAFZb3HTlxYUnAT6mIw

# Environment
NODE_ENV=production
```

## Pasos para Configurar en Vercel

### Opción 1: Usando la Interfaz Web de Vercel

1. **Accede a tu proyecto en Vercel**
   - Ve a https://vercel.com/dashboard
   - Selecciona tu proyecto `acuamarina-ceramicos-frontend`

2. **Navega a Settings**
   - Click en "Settings" en el menú superior
   - Click en "Environment Variables" en el menú lateral

3. **Agregar cada variable**
   - Click en "Add New"
   - Nombre: `NEXT_PUBLIC_API_URL`
   - Value: `https://diligent-upliftment-production-54de.up.railway.app/api/v1`
   - Environment: Selecciona `Production`, `Preview`, y `Development`
   - Click "Save"

4. **Repite para cada variable**:
   ```
   NEXT_PUBLIC_API_URL
   NEXT_PUBLIC_SITE_URL
   NEXT_PUBLIC_SUPABASE_URL
   NEXT_PUBLIC_SUPABASE_ANON_KEY
   NODE_ENV
   ```

5. **Redesplegar**
   - Ve a "Deployments"
   - Click en el último deployment
   - Click en los tres puntos "..."
   - Selecciona "Redeploy"
   - Confirma el redespliegue

### Opción 2: Usando Vercel CLI

```bash
# Instalar Vercel CLI (si no la tienes)
npm i -g vercel

# Login
vercel login

# Ir al directorio del frontend
cd frontend

# Agregar variables de entorno
vercel env add NEXT_PUBLIC_API_URL production
# Pega el valor cuando te lo pida: https://diligent-upliftment-production-54de.up.railway.app/api/v1

vercel env add NEXT_PUBLIC_SITE_URL production
# Pega el valor: https://acuamarina-ceramicos-frontend.vercel.app

vercel env add NEXT_PUBLIC_SUPABASE_URL production
# Pega el valor: https://umyrvlzhvdsibpzvfnal.supabase.co

vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY production
# Pega el valor: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

vercel env add NODE_ENV production
# Pega el valor: production

# Redesplegar
vercel --prod
```

## Verificar Configuración

Una vez configuradas las variables:

1. **Verifica que estén configuradas:**
   - Ve a Settings → Environment Variables en Vercel
   - Deberías ver todas las variables listadas

2. **Verifica el deployment:**
   - Espera a que termine el redespliegue (1-2 minutos)
   - Ve a tu sitio: https://acuamarina-ceramicos-frontend.vercel.app
   - Abre la consola del navegador (F12)
   - Ejecuta: `console.log(process.env.NEXT_PUBLIC_API_URL)`
   - Debería mostrar la URL de Railway

## ⚠️ Importante: Variables Privadas

**NO agregues estas variables en Vercel (son solo para el backend):**

❌ `MERCADOPAGO_ACCESS_TOKEN` - Solo para Railway backend
❌ `MERCADOPAGO_PUBLIC_KEY` - Solo para Railway backend (aunque es "pública", solo la necesita el backend)
❌ `DATABASE_URL` - Solo para Railway backend
❌ `JWT_SECRET` - Solo para Railway backend
❌ `JWT_REFRESH_SECRET` - Solo para Railway backend
❌ `CLOUDINARY_API_KEY` - Solo para Railway backend
❌ `CLOUDINARY_API_SECRET` - Solo para Railway backend
❌ `CLOUDINARY_CLOUD_NAME` - Solo para Railway backend

El frontend solo se comunica con el backend a través de la API REST.
Todas las operaciones de MercadoPago se manejan en el backend.

## Flujo de Pago con MercadoPago

```
Usuario → Frontend (Vercel) → Backend (Railway) → MercadoPago
         NEXT_PUBLIC_API_URL    MERCADOPAGO_ACCESS_TOKEN
```

1. Frontend envía datos del pedido a `NEXT_PUBLIC_API_URL/orders`
2. Backend crea la orden en la base de datos
3. Backend crea preferencia en MercadoPago usando `MERCADOPAGO_ACCESS_TOKEN`
4. Backend devuelve `initPoint` al frontend
5. Frontend redirige al usuario a la URL de pago de MercadoPago
6. MercadoPago procesa el pago
7. MercadoPago notifica al backend via webhook
8. Backend actualiza el estado de la orden
9. MercadoPago redirige al usuario a la página de éxito/fallo

## Troubleshooting

### Error: "Failed to fetch" o "Network Error"

**Causa:** `NEXT_PUBLIC_API_URL` no está configurada o es incorrecta

**Solución:**
1. Verifica que la variable esté configurada en Vercel
2. Verifica que la URL sea correcta (sin barra final `/`)
3. Redesplega el proyecto

### Error: 404 en llamadas a la API

**Causa:** La URL del backend está incorrecta

**Solución:**
1. Verifica que Railway esté funcionando: https://diligent-upliftment-production-54de.up.railway.app/health
2. Actualiza `NEXT_PUBLIC_API_URL` si Railway cambió la URL
3. Redesplega

### El pago no funciona

**Causa:** Credenciales de MercadoPago faltantes en Railway (NO en Vercel)

**Solución:**
1. Ve a Railway → tu proyecto → Variables
2. Verifica que existan:
   - `MERCADOPAGO_ACCESS_TOKEN`
   - `MERCADOPAGO_PUBLIC_KEY`
3. Si faltan, agrégalas y redesplega Railway

## Variables Actualizadas ✅

Después de configurar Vercel, tu setup será:

**Vercel (Frontend):**
- ✅ NEXT_PUBLIC_API_URL
- ✅ NEXT_PUBLIC_SITE_URL
- ✅ NEXT_PUBLIC_SUPABASE_URL
- ✅ NEXT_PUBLIC_SUPABASE_ANON_KEY
- ✅ NODE_ENV

**Railway (Backend):**
- ✅ DATABASE_URL
- ✅ JWT_SECRET
- ✅ JWT_REFRESH_SECRET
- ✅ MERCADOPAGO_ACCESS_TOKEN
- ✅ MERCADOPAGO_PUBLIC_KEY
- ✅ CLOUDINARY_API_KEY
- ✅ CLOUDINARY_API_SECRET
- ✅ CLOUDINARY_CLOUD_NAME
- ✅ FRONTEND_URL (opcional: URL de Vercel para CORS)

¡Listo! Tu aplicación estará completamente configurada para procesar pagos con MercadoPago.
