# Testing API de Railway

## 🧪 Cómo Probar la API Correctamente

La ruta `/api/v1/auth/login` es una ruta **POST**, no GET. Por eso cuando la abres en el navegador ves `"Ruta no encontrada"`.

### ✅ Forma Correcta de Probar

#### Opción 1: Desde la Consola del Navegador (Chrome/Edge)

1. Abre tu admin dashboard: https://acuamarina-ceramica-rbqj.vercel.app
2. Presiona **F12** para abrir DevTools
3. Ve a la pestaña **Console**
4. Pega y ejecuta este código:

```javascript
fetch('https://diligent-upliftment-production-54de.up.railway.app/api/v1/auth/login', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    email: 'admin@aguamarina.com',
    password: 'admin123'
  })
})
.then(res => res.json())
.then(data => {
  console.log('✅ Respuesta:', data);
  if (data.success) {
    console.log('🎉 Login exitoso!');
  } else {
    console.error('❌ Login falló:', data.message);
  }
})
.catch(err => console.error('❌ Error de conexión:', err));
```

#### Opción 2: Usando cURL (Terminal)

```bash
curl -X POST https://diligent-upliftment-production-54de.up.railway.app/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@aguamarina.com","password":"admin123"}'
```

#### Opción 3: Postman / Thunder Client

1. **Method**: POST
2. **URL**: `https://diligent-upliftment-production-54de.up.railway.app/api/v1/auth/login`
3. **Headers**:
   - `Content-Type: application/json`
4. **Body** (raw JSON):
```json
{
  "email": "admin@aguamarina.com",
  "password": "admin123"
}
```

---

## 🔍 Diagnóstico de Errores

### Error: `{"success":false,"message":"Ruta no encontrada"}`

**Causa**: Estás haciendo GET en lugar de POST, o la ruta no existe.

**Solución**:
- Usa POST en lugar de GET
- Verifica que la URL sea exactamente: `/api/v1/auth/login`

### Error: `500 (Internal Server Error)`

**Causa**: El backend tiene un error interno, probablemente:
1. ❌ No se ejecutó el script SQL en Supabase
2. ❌ Falta la tabla `refresh_tokens` o `audit_logs`
3. ❌ Problema de conexión a la base de datos

**Solución**:
1. **Ejecuta el script SQL** en Supabase: `backend/add-missing-tables.sql`
2. **Revisa los logs de Railway**:
   - Ve a Railway Dashboard
   - Selecciona tu servicio backend
   - Click en **Logs**
   - Busca el error exacto

### Error: CORS (Access-Control-Allow-Origin)

**Causa**: CORS no configurado correctamente.

**Solución**: Ya lo configuramos antes, pero verifica que `CORS_ORIGINS` esté en Railway.

---

## 📊 Verificar Estado del Backend

### 1. Health Check (GET - funciona en navegador)

Abre en tu navegador:
```
https://diligent-upliftment-production-54de.up.railway.app/health
```

**Respuesta esperada:**
```json
{
  "success": true,
  "message": "API Aguamarina Mosaicos - Servidor activo",
  "version": "v1",
  ...
}
```

Si esto NO funciona → El backend no está corriendo en Railway.

### 2. API Info (GET)

```
https://diligent-upliftment-production-54de.up.railway.app/api/v1
```

**Respuesta esperada:**
```json
{
  "message": "API Aguamarina Mosaicos",
  "version": "v1",
  "endpoints": {...}
}
```

### 3. Swagger Docs (GET)

```
https://diligent-upliftment-production-54de.up.railway.app/api-docs
```

Deberías ver la documentación interactiva de la API.

---

## 🚨 Si el Login Sigue Fallando

### Paso 1: Ver los Logs de Railway

1. Railway Dashboard → tu servicio
2. **Logs** (ícono de terminal)
3. Busca líneas con `ERROR` o `500`
4. Copia el error completo

### Paso 2: Verificar que Supabase tiene las Tablas

Ejecuta esto en Supabase SQL Editor:

```sql
-- Verificar tablas existentes
SELECT table_name
FROM information_schema.tables
WHERE table_schema = 'public'
ORDER BY table_name;

-- Verificar columnas de refresh_tokens
SELECT column_name, data_type
FROM information_schema.columns
WHERE table_name = 'refresh_tokens';
```

Deberías ver:
- `refresh_tokens` en la lista de tablas
- Columnas: `id`, `user_id`, `token`, `expires_at`, `revoked_at`, `created_at`

### Paso 3: Verificar Usuario Admin

```sql
SELECT id, email, role, is_active
FROM users
WHERE email = 'admin@aguamarina.com';
```

Debería retornar 1 fila con el usuario admin.

---

## ✅ Resultado Esperado (Login Exitoso)

Cuando todo funcione correctamente, la respuesta será:

```json
{
  "success": true,
  "data": {
    "user": {
      "id": 1,
      "email": "admin@aguamarina.com",
      "firstName": "Administrador",
      "lastName": "",
      "role": "admin"
    },
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

---

## 📞 Siguiente Paso

1. **Ejecuta el test de fetch** desde la consola del navegador (Opción 1)
2. **Copia TODA la respuesta** (error o éxito)
3. **Revisa los logs de Railway** y copia el error si lo hay
4. Comparte ambos resultados y te ayudo a solucionarlo
