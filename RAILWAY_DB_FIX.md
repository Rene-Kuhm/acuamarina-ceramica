# Fix: Error 500 en Login - Railway Backend

## 🐛 Problema Identificado

El login falla con error `500 (Internal Server Error)` porque **faltan las tablas `refresh_tokens` y `audit_logs`** en la base de datos de Supabase.

**Error original:**
```
ERROR: 42P01: la relación "refresh_tokens" no existe
```

**Error en el código (AuthController.ts:305)**:
```typescript
await getPool().query(
  `UPDATE refresh_tokens
   SET revoked_at = NOW()
   WHERE token = $1`,
  [refreshToken]
);
```

La columna `revoked_at` no existe en la tabla actual.

---

## ✅ Solución

### Paso 1: Ejecutar Script SQL en Supabase

1. **Accede a Supabase Dashboard**: https://supabase.com/dashboard
2. **Ve a tu proyecto**: `umyrvlzhvdsibpzvfnal`
3. **SQL Editor → New Query**
4. **Copia el contenido completo del archivo**:
   `backend/add-missing-tables.sql`

5. **Pega y ejecuta** (botón RUN o Ctrl+Enter)

Este script:
- ✅ Crea la tabla `refresh_tokens` con el campo `revoked_at`
- ✅ Crea la tabla `audit_logs` para logs de auditoría
- ✅ Agrega campos faltantes a `users`: `first_name`, `last_name`, `is_active`, `email_verified`, `last_login`
- ✅ Renombra `password` a `password_hash` si es necesario
- ✅ NO borra datos existentes

---

### Paso 2: Verificar la Ejecución

Deberías ver estos mensajes al finalizar:

```
✅ Tablas para autenticación agregadas correctamente
```

Y una tabla mostrando:
- `refresh_tokens`: 0 rows
- `audit_logs`: 0 rows
- Lista de columnas de `users` incluyendo `first_name`, `last_name`, etc.

---

## 🧪 Verificar la Solución

Después de ejecutar la migración:

1. **Prueba el login nuevamente** desde tu admin dashboard:
   - URL: https://acuamarina-ceramica-rbqj.vercel.app
   - Endpoint: `POST /api/v1/auth/login`

2. **Verifica los logs de Railway**:
   - Ve a Railway Dashboard → tu servicio → Logs
   - Busca errores SQL relacionados con `refresh_tokens`

3. **Prueba desde la consola del navegador**:

```javascript
fetch('https://diligent-upliftment-production-54de.up.railway.app/api/v1/auth/login', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    email: 'admin@aguamarina.com',
    password: 'tu-contraseña'
  })
})
.then(res => res.json())
.then(data => console.log('✅ Login exitoso:', data))
.catch(err => console.error('❌ Error:', err));
```

---

## 📋 Otras Posibles Causas del Error 500

Si el problema persiste después de agregar la columna:

### 1. Usuario Admin No Existe

Verifica que el usuario admin existe en Supabase:

```sql
SELECT * FROM users WHERE email = 'admin@aguamarina.com';
```

Si no existe, créalo:

```sql
-- Crear usuario admin con contraseña hasheada
-- Contraseña original: Admin123!
INSERT INTO users (email, password_hash, role, first_name, last_name, is_active, email_verified)
VALUES (
  'admin@aguamarina.com',
  '$2a$10$YourHashedPasswordHere', -- Reemplazar con hash real
  'admin',
  'Admin',
  'aguamarina',
  true,
  true
);
```

### 2. Problema de Conexión a la Base de Datos

Verifica en Railway Logs si hay errores como:
- `Error: connect ECONNREFUSED`
- `password authentication failed`
- `database "postgres" does not exist`

**Solución**: Verifica las variables de entorno en Railway:
```env
DB_HOST=db.umyrvlzhvdsibpzvfnal.supabase.co
DB_PORT=5432
DB_NAME=postgres
DB_USER=postgres
DB_PASSWORD=Aguamarina@mosaicos
DB_SSL=true
```

### 3. Tabla `audit_logs` No Existe

El login también inserta en `audit_logs`. Verifica que existe:

```sql
SELECT EXISTS (
   SELECT FROM information_schema.tables
   WHERE table_name = 'audit_logs'
);
```

Si no existe, ejecuta el schema completo desde:
`backend/src/infrastructure/database/schema.sql`

---

## 🔍 Debug Avanzado

Para ver el error exacto, revisa los logs de Railway:

1. Railway Dashboard → tu servicio
2. Logs → busca líneas con `ERROR` o `500`
3. Busca el stack trace completo del error

El error probablemente se verá así:

```
error: column "revoked_at" of relation "refresh_tokens" does not exist
    at Parser.parseErrorMessage (...)
    at Parser.handlePacket (...)
```

---

## 📝 Archivos Modificados

- `backend/src/infrastructure/database/schema.sql` - Schema actualizado con `revoked_at`
- `backend/fix-refresh-tokens.sql` - Script de migración
- `RAILWAY_DB_FIX.md` - Esta guía

---

## 🚀 Resultado Esperado

Después de aplicar la solución:

✅ Login funciona correctamente
✅ Tokens de refresh se guardan con `revoked_at` NULL
✅ Logout puede revocar tokens actualizando `revoked_at`
✅ Admin dashboard conectado completamente con el backend

---

## 📞 Soporte

Si el problema persiste:

1. Copia los logs completos de Railway
2. Verifica que la migración se ejecutó: `SELECT column_name FROM information_schema.columns WHERE table_name = 'refresh_tokens';`
3. Prueba crear un usuario de prueba y hacer login
