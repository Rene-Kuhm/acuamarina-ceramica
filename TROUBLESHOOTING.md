# 🔧 Troubleshooting Guide - Aguamarina Mosaicos

> Guía completa de resolución de problemas, debugging y solución de errores comunes

**Última actualización:** Diciembre 2025  
**Versión:** 2.0

---

## 📑 Tabla de Contenidos

- [Problemas de Conexión](#-problemas-de-conexión)
- [Errores de CORS](#-errores-de-cors)
- [Problemas de Autenticación](#-problemas-de-autenticación)
- [Errores de Base de Datos](#-errores-de-base-de-datos)
- [Problemas con Valkey (Redis)](#-problemas-con-valkey-redis)
- [Errores de MercadoPago](#-errores-de-mercadopago)
- [Problemas de Upload de Imágenes](#-problemas-de-upload-de-imágenes)
- [Errores de Deployment](#-errores-de-deployment)
- [Problemas de Performance](#-problemas-de-performance)
- [Debugging Avanzado](#-debugging-avanzado)
- [Health Checks y Monitoreo](#-health-checks-y-monitoreo)

---

## 🔌 Problemas de Conexión

### ❌ Error: "Failed to fetch" o "Network Error"

**Síntomas:**
```javascript
Error: Network Error
    at createError (axios.js:...)
```

**Causas posibles:**

1. **Backend no está corriendo**
2. **URL incorrecta en frontend**
3. **Problema de CORS**
4. **Firewall o VPN bloqueando conexión**

**Soluciones:**

#### 1. Verificar que el backend esté corriendo

```bash
# Local
curl http://localhost:3000/health

# Producción
curl https://diligent-upliftment-production-54de.up.railway.app/health
```

**Respuesta esperada:**
```json
{
  "status": "ok",
  "timestamp": "2025-12-13T..."
}
```

Si no responde:
```bash
# Local - Reiniciar backend
cd backend
npm run dev

# Producción - Revisar Railway
# 1. Ir a https://railway.app
# 2. Ver logs del proyecto
# 3. Verificar que el servicio esté "Active"
```

#### 2. Verificar URL en frontend

**Frontend (.env.local):**
```env
# ❌ MAL - Sin /api/v1
NEXT_PUBLIC_API_URL=https://diligent-upliftment-production-54de.up.railway.app

# ✅ BIEN
NEXT_PUBLIC_API_URL=https://diligent-upliftment-production-54de.up.railway.app/api/v1
```

**Verificar en runtime:**
```javascript
// En componente React
console.log('API URL:', process.env.NEXT_PUBLIC_API_URL);
// Debe mostrar: https://diligent-upliftment-production-54de.up.railway.app/api/v1
```

**⚠️ IMPORTANTE:** Después de cambiar variables de entorno en Vercel:
1. Deployments → Latest → **Redeploy**
2. Las variables NO se actualizan sin redeploy

#### 3. Verificar conexión directa

```bash
# Test directo con curl
curl -v https://diligent-upliftment-production-54de.up.railway.app/api/v1/products

# Si falla, probar sin HTTPS
curl -v http://diligent-upliftment-production-54de.up.railway.app/api/v1/products
```

#### 4. Deshabilitar VPN/Proxy temporalmente

Algunas VPNs bloquean conexiones. Probar:
- Desactivar VPN
- Probar desde otra red (móvil 4G)
- Probar desde navegador en incógnito

---

### ❌ Error: "ERR_CONNECTION_REFUSED"

**Síntomas:**
```
GET http://localhost:3000/api/v1/products net::ERR_CONNECTION_REFUSED
```

**Causas:**
- Puerto 3000 ya está en uso
- Backend no está corriendo
- Firewall bloqueando puerto

**Soluciones:**

#### 1. Verificar puerto en uso

```bash
# Windows
netstat -ano | findstr :3000

# Mac/Linux
lsof -i :3000

# Si está en uso, matar proceso
# Windows
taskkill /PID <PID> /F

# Mac/Linux
kill -9 <PID>
```

#### 2. Usar otro puerto

```bash
# Backend
PORT=3001 npm run dev

# Frontend - actualizar .env.local
NEXT_PUBLIC_API_URL=http://localhost:3001/api/v1
```

#### 3. Script para limpiar puerto (Windows)

```powershell
# backend/kill-port.ps1
$port = 3000
$process = Get-NetTCPConnection -LocalPort $port -ErrorAction SilentlyContinue
if ($process) {
    Stop-Process -Id $process.OwningProcess -Force
    Write-Host "Puerto $port liberado"
}
```

```bash
# Ejecutar
powershell -ExecutionPolicy Bypass -File kill-port.ps1
```

---

## 🚫 Errores de CORS

### ❌ Error: "Access-Control-Allow-Origin"

**Síntomas:**
```
Access to fetch at 'https://backend.railway.app/api/v1/products' 
from origin 'https://aguamarinamosaicos.com' has been blocked by CORS policy: 
No 'Access-Control-Allow-Origin' header is present on the requested resource.
```

**Causa:**
El dominio del frontend no está en la lista de `CORS_ORIGINS` del backend.

**Solución:**

#### 1. Verificar CORS_ORIGINS en Railway

```bash
# Railway → Backend → Variables → CORS_ORIGINS
CORS_ORIGINS=https://aguamarinamosaicos.com,https://www.aguamarinamosaicos.com,https://admin.aguamarinamosaicos.com
```

**⚠️ Importante:**
- URLs completas con `https://`
- Sin espacios entre dominios
- Sin barra final `/`
- Separados por comas

#### 2. Para desarrollo local

```env
# backend/.env
CORS_ORIGINS=http://localhost:3000,http://localhost:3001,http://localhost:3002
```

#### 3. Verificar headers CORS

```bash
# Test CORS preflight
curl -I -X OPTIONS https://backend.railway.app/api/v1/products \
  -H "Origin: https://aguamarinamosaicos.com" \
  -H "Access-Control-Request-Method: GET"
```

**Respuesta esperada:**
```http
HTTP/2 204
access-control-allow-origin: https://aguamarinamosaicos.com
access-control-allow-credentials: true
access-control-allow-methods: GET,POST,PUT,PATCH,DELETE,OPTIONS
```

#### 4. Troubleshooting CORS

```javascript
// backend/src/app.ts - Verificar configuración CORS

import cors from 'cors';

const allowedOrigins = process.env.CORS_ORIGINS?.split(',') || ['http://localhost:3000'];

app.use(cors({
  origin: (origin, callback) => {
    console.log('CORS request from origin:', origin);
    
    // Permitir requests sin origin (Postman, curl, etc.)
    if (!origin) {
      return callback(null, true);
    }
    
    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      console.error('CORS blocked for origin:', origin);
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));
```

#### 5. Debugging CORS en producción

**Railway → Logs:**
```bash
# Buscar en logs
CORS request from origin: https://aguamarinamosaicos.com
✅ CORS allowed

# Si bloqueado
CORS blocked for origin: https://some-other-domain.com
❌ CORS denied
```

---

## 🔐 Problemas de Autenticación

### ❌ Error: "Token inválido" o "No autenticado"

**Síntomas:**
```json
{
  "success": false,
  "error": {
    "code": "TOKEN_INVALID",
    "message": "Token de autenticación inválido"
  }
}
```

**Soluciones:**

#### 1. Verificar formato del header

```javascript
// ✅ BIEN
headers: {
  'Authorization': `Bearer ${accessToken}`
}

// ❌ MAL - Sin "Bearer"
headers: {
  'Authorization': accessToken
}

// ❌ MAL - Sin espacio
headers: {
  'Authorization': `Bearer${accessToken}`
}
```

#### 2. Verificar que el token no esté expirado

```javascript
// Decodificar JWT (sin verificar firma)
function decodeJWT(token) {
  const payload = token.split('.')[1];
  return JSON.parse(atob(payload));
}

const decoded = decodeJWT(accessToken);
console.log('Token expira:', new Date(decoded.exp * 1000));
console.log('Ahora:', new Date());

if (decoded.exp * 1000 < Date.now()) {
  console.error('❌ Token expirado!');
  // Refrescar token
}
```

#### 3. Refrescar token automáticamente

```javascript
// lib/api/axios.ts

import axios from 'axios';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
});

// Interceptor para agregar token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('accessToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Interceptor para refrescar token si expira
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    
    // Si el token expiró y no hemos reintentado
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      try {
        const refreshToken = localStorage.getItem('refreshToken');
        const { data } = await axios.post(
          `${process.env.NEXT_PUBLIC_API_URL}/auth/refresh`,
          { refreshToken }
        );
        
        localStorage.setItem('accessToken', data.data.accessToken);
        originalRequest.headers.Authorization = `Bearer ${data.data.accessToken}`;
        
        return api(originalRequest);
      } catch (refreshError) {
        // Refresh falló, redirigir a login
        localStorage.clear();
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }
    
    return Promise.reject(error);
  }
);

export default api;
```

---

### ❌ Error: "Credenciales inválidas"

**Síntomas:**
```json
{
  "success": false,
  "error": {
    "code": "AUTH_FAILED",
    "message": "Credenciales inválidas"
  }
}
```

**Debugging:**

#### 1. Verificar credenciales en BD

```sql
-- Conectar a Supabase SQL Editor
SELECT 
  id,
  email,
  role,
  is_active,
  created_at
FROM users
WHERE email = 'admin@aguamarinamosaicos.com';
```

Si no existe:
```sql
-- Crear usuario admin manualmente
INSERT INTO users (email, password, name, role, is_active)
VALUES (
  'admin@aguamarinamosaicos.com',
  -- Password: Admin123! (hasheado con bcrypt)
  '$2a$10$rKZxjJL0JxqNXbQZfvqMiOXzGqxPXYPtMn9BqvKPb5mLqgJpHZn6K',
  'Administrador',
  'admin',
  true
);
```

#### 2. Hashear nueva password

```javascript
// scripts/hash-password.js
const bcrypt = require('bcryptjs');

const password = 'Admin123!';
const hash = bcrypt.hashSync(password, 10);

console.log('Password hasheado:', hash);
// Usar este hash en la BD
```

```bash
node scripts/hash-password.js
```

#### 3. Verificar comparación de password

```typescript
// backend/src/application/controllers/AuthController.ts

const isPasswordValid = await bcrypt.compare(
  password,      // Password en texto plano del request
  user.password  // Password hasheado de la BD
);

console.log('Password válido:', isPasswordValid);
```

---

## 🗄️ Errores de Base de Datos

### ❌ Error: "Connection terminated unexpectedly"

**Síntomas:**
```
Error: Connection terminated unexpectedly
    at Connection.<anonymous> (pg/lib/client.js:...)
```

**Causas:**
- Pool de conexiones agotado
- Conexión SSL requerida pero no configurada
- Credenciales incorrectas
- Firewall de Supabase

**Soluciones:**

#### 1. Verificar conexión a BD

```bash
# Test de conexión
psql "postgresql://postgres.umyrvlzhvdsibpzvfnal:PASSWORD@db.umyrvlzhvdsibpzvfnal.supabase.co:5432/postgres"

# O con script
node scripts/test-db-connection.js
```

```javascript
// scripts/test-db-connection.js
const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

pool.query('SELECT NOW()', (err, res) => {
  if (err) {
    console.error('❌ Error de conexión:', err);
  } else {
    console.log('✅ Conexión exitosa:', res.rows[0]);
  }
  pool.end();
});
```

#### 2. Configurar SSL en producción

```typescript
// backend/src/infrastructure/database/db.ts

import { Pool } from 'pg';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  
  // ✅ Para Supabase - SSL requerido
  ssl: process.env.NODE_ENV === 'production' 
    ? { rejectUnauthorized: false }
    : false,
  
  // Configuración de pool
  max: 20,                    // Máximo de conexiones
  idleTimeoutMillis: 30000,   // 30 segundos
  connectionTimeoutMillis: 2000, // 2 segundos
});

pool.on('error', (err) => {
  console.error('❌ Error inesperado en pool de BD:', err);
});

export default pool;
```

#### 3. Aumentar pool de conexiones

```env
# Railway → Variables
DB_MAX_CONNECTIONS=20
```

```typescript
const pool = new Pool({
  max: parseInt(process.env.DB_MAX_CONNECTIONS || '20'),
});
```

#### 4. Cerrar conexiones correctamente

```typescript
// ❌ MAL - Deja conexiones abiertas
const { rows } = await pool.query('SELECT * FROM products');
return rows;

// ✅ BIEN - Usa client y lo libera
const client = await pool.connect();
try {
  const { rows } = await client.query('SELECT * FROM products');
  return rows;
} finally {
  client.release();
}
```

---

### ❌ Error: "Too many connections"

**Síntomas:**
```
Error: sorry, too many clients already
```

**Solución:**

#### 1. Ver conexiones activas

```sql
-- En Supabase SQL Editor
SELECT 
  pid,
  usename,
  application_name,
  client_addr,
  state,
  query_start,
  query
FROM pg_stat_activity
WHERE datname = 'postgres'
ORDER BY query_start DESC;
```

#### 2. Matar conexiones idle

```sql
-- Matar conexiones en estado 'idle' por más de 5 minutos
SELECT pg_terminate_backend(pid)
FROM pg_stat_activity
WHERE 
  datname = 'postgres' AND
  state = 'idle' AND
  state_change < NOW() - INTERVAL '5 minutes';
```

#### 3. Reducir max connections en pool

```env
# Railway
DB_MAX_CONNECTIONS=10
```

---

### ❌ Error: "Column does not exist"

**Síntomas:**
```
error: column "product_name" does not exist
```

**Causa:**
Query usa un nombre de columna que no existe en la tabla.

**Solución:**

#### 1. Verificar schema de la tabla

```sql
-- Ver columnas de la tabla
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_name = 'products'
ORDER BY ordinal_position;
```

#### 2. Usar alias correcto

```typescript
// ❌ MAL - "product_name" no existe
const { rows } = await db.query(`
  SELECT product_name FROM products
`);

// ✅ BIEN - Columna se llama "name"
const { rows } = await db.query(`
  SELECT name FROM products
`);

// ✅ BIEN - Usar alias
const { rows } = await db.query(`
  SELECT name AS product_name FROM products
`);
```

---

## 🔴 Problemas con Valkey (Redis)

### ❌ Error: "connect ECONNREFUSED ::1:6379"

**Síntomas:**
```
Error de Valkey: connect ECONNREFUSED ::1:6379
```

**Causa:**
Backend intenta conectarse a `localhost:6379` porque las variables de Valkey no están configuradas.

**Solución completa:**

#### 1. Verificar servicio Valkey en Railway

```
Railway → Project → Services
✅ Debe existir un servicio "Valkey" o "Redis"
```

Si no existe:
1. Click **"+ New"**
2. **"Database"**
3. **"Add Redis"**
4. Esperar a que se provisione

#### 2. Identificar nombre del servicio

El servicio puede llamarse:
- `Redis`
- `Valkey`
- `redis`
- Otro nombre personalizado

**Para verificar:**
1. Click en el servicio
2. Ver nombre en la parte superior
3. **Anotar nombre exacto**

#### 3. Configurar variables en Backend

Railway → Backend Service → Variables

```env
# Variable 1
VALKEY_HOST=${{Redis.RAILWAY_PRIVATE_NETWORK_HOST}}

# Variable 2
VALKEY_PORT=6379

# Variable 3
VALKEY_PASSWORD=${{Redis.REDIS_PASSWORD}}

# Variable 4
VALKEY_DB=0
```

**⚠️ Reemplazar `Redis` con el nombre exacto de tu servicio**

#### 4. Alternativas de conexión

Si la red privada no funciona:

**Opción A: TCP Proxy**
```env
VALKEY_HOST=${{Redis.RAILWAY_TCP_PROXY_DOMAIN}}
VALKEY_PORT=${{Redis.RAILWAY_TCP_PROXY_PORT}}
VALKEY_PASSWORD=${{Redis.REDIS_PASSWORD}}
```

**Opción B: Variables estándar**
```env
VALKEY_HOST=${{Redis.REDIS_HOST}}
VALKEY_PORT=${{Redis.REDIS_PORT}}
VALKEY_PASSWORD=${{Redis.REDIS_PASSWORD}}
```

#### 5. Verificar en logs

Railway → Backend → Logs

**✅ Correcto:**
```
✓ Conectando a Valkey...
✓ Valkey conectado y listo
✅ Valkey connected successfully
```

**❌ Error:**
```
❌ Error de Valkey: connect ECONNREFUSED ::1:6379
⚠️ Valkey no disponible - continuando sin cache
```

#### 6. Graceful degradation

El backend debe funcionar sin Valkey:

```typescript
// backend/src/infrastructure/cache/valkey.ts

let valkeyClient: Redis | null = null;

export async function connectValkey() {
  try {
    if (!process.env.VALKEY_HOST) {
      console.warn('⚠️ VALKEY_HOST no configurado - continuando sin cache');
      return null;
    }
    
    valkeyClient = new Redis({
      host: process.env.VALKEY_HOST,
      port: parseInt(process.env.VALKEY_PORT || '6379'),
      password: process.env.VALKEY_PASSWORD,
      db: parseInt(process.env.VALKEY_DB || '0'),
      retryStrategy: (times) => {
        if (times > 3) {
          console.error('❌ Valkey: Máximo de reintentos alcanzado');
          return null;
        }
        return Math.min(times * 200, 1000);
      },
    });
    
    await valkeyClient.ping();
    console.log('✅ Valkey connected successfully');
    return valkeyClient;
    
  } catch (error) {
    console.error('❌ Error de Valkey:', error);
    console.warn('⚠️ Valkey no disponible - continuando sin cache');
    return null;
  }
}

export async function cacheGet(key: string) {
  if (!valkeyClient) return null;
  try {
    return await valkeyClient.get(key);
  } catch (error) {
    console.error('Error al obtener de cache:', error);
    return null;
  }
}
```

---

## 💳 Errores de MercadoPago

### ❌ Error: "MercadoPago access token no está configurado"

**Síntomas:**
```json
{
  "success": false,
  "error": {
    "message": "Configuración de MercadoPago incompleta"
  }
}
```

**Solución:**

#### 1. Configurar credenciales en Railway

```env
# Railway → Backend → Variables
MERCADOPAGO_ACCESS_TOKEN=APP_USR-8739117242123034-110209-3ac7dd69464f34205d80a02a691fefb0-2951480547
MERCADOPAGO_PUBLIC_KEY=APP_USR-c8332e1c-0d62-4cad-8ba4-47e7b319e17f
```

#### 2. Verificar que se cargaron

```typescript
// backend/src/config/environment.ts

console.log('MercadoPago configurado:', {
  hasAccessToken: !!process.env.MERCADOPAGO_ACCESS_TOKEN,
  hasPublicKey: !!process.env.MERCADOPAGO_PUBLIC_KEY,
  // NO mostrar valores completos en logs
});
```

Railway → Logs:
```
MercadoPago configurado: { hasAccessToken: true, hasPublicKey: true }
```

---

### ❌ Error: "Webhook no actualiza el estado del pedido"

**Debugging:**

#### 1. Verificar URL del webhook en MercadoPago

https://www.mercadopago.com.ar/developers/panel → Webhooks

**URL correcta:**
```
https://diligent-upliftment-production-54de.up.railway.app/api/v1/mercadopago/webhook
```

**⚠️ Verificar:**
- Protocolo `https://`
- Dominio correcto de Railway
- Path `/api/v1/mercadopago/webhook`
- Sin barra final `/`

#### 2. Ver logs de webhook

Railway → Backend → Logs

**Buscar:**
```
Webhook recibido de MercadoPago: payment
Payment ID: 12345678
Consultando estado del pago...
Estado del pago: approved
Orden actualizada: 123
```

**Si no aparece:**
- MercadoPago no está enviando el webhook
- Verificar URL en panel de MP
- Verificar que backend esté público (no private networking)

#### 3. Probar webhook manualmente

```bash
# Simular webhook de MercadoPago
curl -X POST https://backend.railway.app/api/v1/mercadopago/webhook \
  -H "Content-Type: application/json" \
  -d '{
    "type": "payment",
    "data": {
      "id": "12345678"
    }
  }'
```

#### 4. Revisar logs de MercadoPago

MercadoPago → Desarrolladores → Webhooks → Historial

Ver:
- ✅ Estado 200 OK
- ❌ Estado 500 Error
- ⏳ Estado timeout

---

## 📷 Problemas de Upload de Imágenes

### ❌ Error: "File too large"

**Síntomas:**
```json
{
  "success": false,
  "error": {
    "message": "El archivo es demasiado grande. Máximo: 5MB"
  }
}
```

**Soluciones:**

#### 1. Comprimir imagen antes de subir

```javascript
// Frontend - Comprimir con canvas
async function compressImage(file) {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        
        // Max dimensions
        const MAX_WIDTH = 1920;
        const MAX_HEIGHT = 1920;
        
        let width = img.width;
        let height = img.height;
        
        if (width > MAX_WIDTH) {
          height = (height * MAX_WIDTH) / width;
          width = MAX_WIDTH;
        }
        if (height > MAX_HEIGHT) {
          width = (width * MAX_HEIGHT) / height;
          height = MAX_HEIGHT;
        }
        
        canvas.width = width;
        canvas.height = height;
        ctx.drawImage(img, 0, 0, width, height);
        
        canvas.toBlob((blob) => {
          resolve(new File([blob], file.name, { type: 'image/jpeg' }));
        }, 'image/jpeg', 0.85); // 85% quality
      };
      img.src = e.target.result;
    };
    reader.readAsDataURL(file);
  });
}

// Uso
const compressedFile = await compressImage(originalFile);
```

#### 2. Aumentar límite en backend (si es necesario)

```env
# Railway → Variables
MAX_FILE_SIZE=10485760  # 10MB en bytes
```

```typescript
// backend/src/application/middleware/uploadConfig.ts

import multer from 'multer';

const upload = multer({
  limits: {
    fileSize: parseInt(process.env.MAX_FILE_SIZE || '5242880'), // 5MB default
  },
});
```

---

### ❌ Error: "Invalid file type"

**Solución:**

```typescript
// backend/src/application/middleware/uploadConfig.ts

const upload = multer({
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
    
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Tipo de archivo no permitido. Solo JPG, PNG y WEBP.'));
    }
  },
});
```

---

### ❌ Error de Cloudinary: "Upload failed"

**Debugging:**

#### 1. Verificar credenciales de Cloudinary

```env
# Railway → Variables
CLOUDINARY_CLOUD_NAME=ddztbf1se
CLOUDINARY_API_KEY=128868447893278
CLOUDINARY_API_SECRET=****
```

#### 2. Test de upload manual

```javascript
// scripts/test-cloudinary.js
const cloudinary = require('cloudinary').v2;

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

cloudinary.uploader.upload('test-image.jpg', {
  folder: 'products',
}, (error, result) => {
  if (error) {
    console.error('❌ Error:', error);
  } else {
    console.log('✅ Upload exitoso:', result.secure_url);
  }
});
```

---

## 🚀 Errores de Deployment

### ❌ Vercel: Build failed

**Síntomas:**
```
Error: Command "next build" exited with 1
```

**Soluciones:**

#### 1. Ver logs completos

Vercel → Deployments → Failed deployment → View Function Logs

**Errores comunes:**

**Error de TypeScript:**
```
Type error: Property 'xyz' does not exist on type...
```

**Solución:**
```bash
# Local - Verificar tipos
npm run build

# Fix
npm run type-check
```

**Error de módulo faltante:**
```
Module not found: Can't resolve 'xyz'
```

**Solución:**
```bash
# Verificar package.json
npm install

# Verificar que esté en dependencies (no devDependencies)
```

#### 2. Limpiar cache de Vercel

Vercel → Settings → General → Clear Build Cache

Luego: Deployments → Redeploy

#### 3. Verificar variables de entorno

Vercel → Settings → Environment Variables

**Verificar:**
- Todas las `NEXT_PUBLIC_*` estén configuradas
- Sin valores vacíos
- Sin espacios extra

---

### ❌ Railway: Deploy failed

**Síntomas:**
```
❌ Deployment failed
```

**Debugging:**

#### 1. Ver logs de Railway

Railway → Project → Backend → Deployments → Failed → View Logs

**Errores comunes:**

**Error de build:**
```
npm ERR! Failed at the build script
```

**Solución:**
```bash
# Local - Verificar build
npm run build

# Ver errores de TypeScript
npx tsc --noEmit
```

**Error de start:**
```
Error: Cannot find module './dist/server.js'
```

**Solución:**
```json
// package.json - Verificar scripts
{
  "scripts": {
    "build": "tsc",
    "start": "node dist/server.js"
  }
}
```

**Error de variables de entorno:**
```
Error: DATABASE_URL is required
```

**Solución:**
Railway → Variables → Verificar que todas estén configuradas

#### 2. Healthcheck failing

**Error:**
```
Health check timeout
```

**Solución:**

```typescript
// backend/src/server.ts

const PORT = process.env.PORT || 3000;

app.listen(PORT, '0.0.0.0', () => {
  console.log(`✅ Server running on port ${PORT}`);
});

// ❌ MAL - Solo localhost
// app.listen(PORT, 'localhost', ...)
```

#### 3. Rollback de deployment

Railway → Deployments → Previous successful → Redeploy

---

## ⚡ Problemas de Performance

### ❌ Queries lentas

**Debugging:**

#### 1. Analizar query con EXPLAIN

```sql
EXPLAIN ANALYZE
SELECT p.*, c.name as category_name
FROM products p
LEFT JOIN categories c ON p.category_id = c.id
WHERE p.is_active = true
ORDER BY p.created_at DESC
LIMIT 20;
```

**Buscar:**
- `Seq Scan` (tabla scan completa) ❌ Malo
- `Index Scan` ✅ Bueno
- Tiempo de ejecución alto

**Solución:**

```sql
-- Crear índice
CREATE INDEX idx_products_active_created 
ON products(is_active, created_at DESC)
WHERE is_active = true;
```

#### 2. Usar caché para queries frecuentes

```typescript
// backend/src/application/controllers/ProductsController.ts

import { cacheGet, cacheSet } from '@infrastructure/cache/valkey';

export class ProductsController {
  static async getAll(req: Request, res: Response) {
    const cacheKey = `products:list:${JSON.stringify(req.query)}`;
    
    // Intentar obtener de cache
    const cached = await cacheGet(cacheKey);
    if (cached) {
      return res.json(JSON.parse(cached));
    }
    
    // Query a BD
    const products = await db.query('SELECT ...');
    
    // Guardar en cache (5 minutos)
    await cacheSet(cacheKey, JSON.stringify(products), 300);
    
    return res.json(products);
  }
}
```

---

### ❌ Frontend lento

**Soluciones:**

#### 1. Lazy load de imágenes

```typescript
// Next.js Image component
import Image from 'next/image';

<Image
  src={product.imageUrl}
  alt={product.name}
  width={400}
  height={400}
  loading="lazy"
  placeholder="blur"
  blurDataURL="/placeholder.jpg"
/>
```

#### 2. Code splitting

```typescript
// Dynamic import
import dynamic from 'next/dynamic';

const HeavyComponent = dynamic(() => import('./HeavyComponent'), {
  loading: () => <Skeleton />,
  ssr: false, // No SSR si no es crítico
});
```

#### 3. Memoización

```typescript
import { memo, useMemo } from 'react';

const ProductCard = memo(({ product }) => {
  const formattedPrice = useMemo(() => {
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS',
    }).format(product.price);
  }, [product.price]);
  
  return <div>{formattedPrice}</div>;
});
```

---

## 🔍 Debugging Avanzado

### Logs estructurados

```typescript
// backend/src/shared/logger.ts

import winston from 'winston';

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [
    new winston.transports.Console(),
  ],
});

// Uso
logger.info('Orden creada', {
  orderId: 123,
  customerId: 15,
  total: 20400,
});

logger.error('Error al procesar pago', {
  orderId: 123,
  error: error.message,
  stack: error.stack,
});
```

### Request tracking

```typescript
// backend/src/application/middleware/requestId.ts

import { v4 as uuidv4 } from 'uuid';

export function requestIdMiddleware(req, res, next) {
  req.id = uuidv4();
  res.setHeader('X-Request-Id', req.id);
  
  logger.info('Request iniciado', {
    requestId: req.id,
    method: req.method,
    path: req.path,
  });
  
  next();
}
```

---

## 🏥 Health Checks y Monitoreo

### Health check completo

```bash
# Verificar salud del sistema
curl https://backend.railway.app/health/detailed
```

**Respuesta esperada:**
```json
{
  "status": "ok",
  "checks": {
    "database": {
      "status": "up",
      "responseTime": "12ms"
    },
    "valkey": {
      "status": "up",
      "responseTime": "5ms"
    }
  },
  "system": {
    "memory": {
      "total": "512MB",
      "used": "234MB",
      "free": "278MB"
    },
    "uptime": 3456789
  }
}
```

**Si algún servicio está down:**
```json
{
  "status": "degraded",
  "checks": {
    "database": {
      "status": "up"
    },
    "valkey": {
      "status": "down",
      "error": "Connection refused"
    }
  }
}
```

---

## 📞 Soporte

Si después de seguir esta guía sigues teniendo problemas:

1. **Ver logs detallados:**
   - Railway: Project → Logs
   - Vercel: Deployments → Function Logs
   - Browser: DevTools → Console y Network

2. **Documentación adicional:**
   - [ARQUITECTURA.md](./ARQUITECTURA.md)
   - [API_REFERENCE.md](./API_REFERENCE.md)
   - [README.md](./README.md)

3. **Recursos externos:**
   - [Railway Docs](https://docs.railway.app/)
   - [Vercel Docs](https://vercel.com/docs)
   - [Supabase Docs](https://supabase.com/docs)

---

**Última actualización:** Diciembre 2025  
**Versión:** 2.0  
**Estado:** ✅ Completo
