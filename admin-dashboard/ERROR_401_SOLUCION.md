# ❌ Error 401: No Autorizado al Subir Imágenes

## 🔍 Diagnóstico del Problema

### Error Completo:
```
Error uploading image: AxiosError {
  message: 'Request failed with status code 401',
  name: 'AxiosError',
  code: 'ERR_BAD_REQUEST',
  ...
}
```

### Causa:
El endpoint `/api/v1/upload/product-image` requiere **autenticación** pero:
- No hay un token válido en `localStorage`
- El token ha expirado
- No estás autenticado en el admin dashboard

---

## ✅ Soluciones

### Solución 1: Iniciar Sesión (Recomendada)

**Pasos:**

1. **Ir a la página de login:**
   ```
   http://localhost:3000/login
   ```

2. **Iniciar sesión con credenciales de admin:**
   ```
   Email: admin@example.com
   Password: tu-contraseña
   ```

3. **Verificar que el token se guardó:**
   - Abre DevTools (F12)
   - Ve a `Application` → `Local Storage`
   - Busca: `accessToken`
   - Debe tener un valor JWT

4. **Volver a intentar subir imágenes**

---

### Solución 2: Verificar Token en el Código

**Revisar que el token se esté enviando:**

`admin-dashboard/src/lib/api/client.ts`:

```typescript
this.client.interceptors.request.use(
  (config) => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('accessToken');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  }
);
```

**Verificar en DevTools:**
1. Abre la pestaña `Network`
2. Intenta subir una imagen
3. Busca la request a `/upload/product-image`
4. Revisa `Headers` → debe tener:
   ```
   Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   ```

---

### Solución 3: Crear Usuario Admin (Si no existe)

Si no tienes un usuario admin creado, necesitas:

**Opción A: Desde el Backend**

```bash
# En el backend, crear un script para seed de admin
cd backend
npm run db:seed
```

**Opción B: Directamente en la Base de Datos**

```sql
-- Insertar usuario admin en PostgreSQL
INSERT INTO users (
  email,
  password_hash,
  role,
  first_name,
  last_name,
  is_active,
  email_verified
) VALUES (
  'admin@aguamarina.com',
  '$2a$10$...',  -- Hash de bcrypt para la contraseña
  'admin',
  'Admin',
  'Sistema',
  true,
  true
);
```

**Generar hash de contraseña:**
```javascript
const bcrypt = require('bcryptjs');
const password = 'admin123';
const hash = await bcrypt.hash(password, 10);
console.log(hash);
```

---

### Solución 4: Deshabilitar Autenticación en Desarrollo (NO RECOMENDADO)

**⚠️ SOLO PARA DESARROLLO LOCAL**

Editar `backend/src/application/routes/upload.routes.ts`:

```typescript
// ANTES (con autenticación)
router.post(
  '/product-image',
  authenticate,          // ← Comentar estas líneas
  authorize('admin', 'manager'),  // ← para desarrollo
  upload.single('image'),
  UploadController.uploadProductImage
);

// DESPUÉS (sin autenticación - SOLO DESARROLLO)
router.post(
  '/product-image',
  // authenticate,       // ← Comentado
  // authorize('admin', 'manager'),
  upload.single('image'),
  UploadController.uploadProductImage
);
```

**⚠️ IMPORTANTE:**
- No hacer commit de este cambio
- Revertirlo antes de producción
- Es inseguro para producción

---

## 🔐 Flujo Correcto de Autenticación

### 1. Login
```
POST /api/v1/auth/login
Body: { email, password }

Response: {
  accessToken: "eyJhbGci...",
  refreshToken: "eyJhbGci...",
  user: { ... }
}
```

### 2. Guardar Token
```typescript
localStorage.setItem('accessToken', response.accessToken);
localStorage.setItem('refreshToken', response.refreshToken);
```

### 3. Usar Token en Requests
```typescript
headers: {
  'Authorization': `Bearer ${accessToken}`
}
```

### 4. Verificar Token
```typescript
// El apiClient automáticamente agrega el token
const response = await uploadProductImage(file);
```

---

## 🧪 Testing

### Verificar que el Token Funciona:

**Test 1: Verificar Token en localStorage**
```javascript
// En DevTools Console
localStorage.getItem('accessToken')
// Debe devolver un JWT string
```

**Test 2: Decodificar el Token**
```javascript
// En DevTools Console o en jwt.io
const token = localStorage.getItem('accessToken');
const payload = JSON.parse(atob(token.split('.')[1]));
console.log(payload);
// Debe mostrar: { userId, role, iat, exp }
```

**Test 3: Verificar que no ha Expirado**
```javascript
const token = localStorage.getItem('accessToken');
const payload = JSON.parse(atob(token.split('.')[1]));
const now = Date.now() / 1000;
console.log('Expira en:', payload.exp - now, 'segundos');
// Si es negativo, el token expiró
```

---

## 🚀 Solución Rápida (Paso a Paso)

### Para el Usuario:

1. **Cerrar sesión** (si estás logueado)
   ```
   Click en avatar → Cerrar sesión
   ```

2. **Ir a login**
   ```
   http://localhost:3000/login
   ```

3. **Iniciar sesión con credenciales correctas**
   ```
   Email: admin@aguamarina.com
   Password: [tu-contraseña]
   ```

4. **Verificar que el token existe**
   - F12 → Application → Local Storage
   - Buscar: `accessToken`

5. **Ir a crear producto**
   ```
   /dashboard/products/new
   ```

6. **Intentar subir imagen nuevamente**
   - Debería funcionar ✅

---

## 📝 Checklist de Verificación

- [ ] ¿Estoy autenticado en el admin dashboard?
- [ ] ¿Existe `accessToken` en localStorage?
- [ ] ¿El token no ha expirado?
- [ ] ¿Mi usuario tiene rol `admin` o `manager`?
- [ ] ¿El backend está corriendo?
- [ ] ¿El CORS está configurado correctamente?
- [ ] ¿Las credenciales de Cloudinary son correctas?

---

## 🔧 Debugging Avanzado

### Ver la Request Completa:

```javascript
// En admin-dashboard/src/lib/api/upload.ts
export async function uploadProductImage(...) {
  console.log('Token:', localStorage.getItem('accessToken'));
  console.log('Uploading to:', '/upload/product-image');

  const formData = new FormData();
  formData.append('image', file);

  console.log('FormData:', {
    file: file.name,
    productId,
    options
  });

  return apiClient.post<UploadResponse>('/upload/product-image', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
}
```

### Ver la Response del Backend:

```javascript
// En backend/src/application/middleware/authenticate.ts
// Agregar logs para debugging
export const authenticate = async (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  console.log('Token recibido:', token ? 'Sí' : 'No');

  if (!token) {
    console.log('Error: No token provided');
    return res.status(401).json({ message: 'No autorizado' });
  }

  // ... resto del código
};
```

---

## 💡 Prevención

### Para Evitar este Error en el Futuro:

1. **Implementar Refresh Token Automático**
   ```typescript
   // En apiClient
   if (error.response?.status === 401) {
     // Auto-refresh token
     const newToken = await refreshToken();
     // Reintentar request
   }
   ```

2. **Mostrar Estado de Autenticación en UI**
   ```tsx
   {!isAuthenticated && (
     <Alert>Debes iniciar sesión para subir imágenes</Alert>
   )}
   ```

3. **Validar Token Antes de Subir**
   ```typescript
   const isTokenValid = () => {
     const token = localStorage.getItem('accessToken');
     if (!token) return false;

     const payload = JSON.parse(atob(token.split('.')[1]));
     return payload.exp > Date.now() / 1000;
   };
   ```

---

## ✅ Resumen

**Causa Principal:** No hay token de autenticación válido

**Solución Rápida:** Iniciar sesión en `/login`

**Verificación:**
1. Token en localStorage ✓
2. Token no expirado ✓
3. Rol correcto (admin/manager) ✓

**Resultado Esperado:** Upload funciona correctamente ✅
