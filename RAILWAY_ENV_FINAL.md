# Variables de Entorno para Railway - CONFIGURACIÓN FINAL

## 🚨 Problema Actual

Railway no puede conectarse a Supabase por IPv6:
```
Error: connect ENETUNREACH 2600:1f18:2e13:9d2e:1e6f:7f0a:65b4:b56:5432
```

## ✅ Solución: Usar DATABASE_URL

En lugar de variables separadas, usa una sola variable `DATABASE_URL` que force IPv4.

---

## 📋 Variables de Entorno para Railway

### Opción 1: Usar DATABASE_URL (RECOMENDADO)

**Borra las variables individuales** (`DB_HOST`, `DB_PORT`, etc.) y agrega SOLO esta:

```
DATABASE_URL=postgresql://postgres:Aguamarina%40mosaicos@db.umyrvlzhvdsibpzvfnal.supabase.co:5432/postgres?sslmode=require
```

**Nota**: `%40` = `@` (URL encoded)

### Opción 2: Agregar Todas las Variables Individuales

Si prefieres usar variables separadas:

```
DB_HOST=db.umyrvlzhvdsibpzvfnal.supabase.co
DB_PORT=5432
DB_NAME=postgres
DB_USER=postgres
DB_PASSWORD=Aguamarina@mosaicos
DB_SSL=true
DB_MAX_CONNECTIONS=10
JWT_SECRET=74b9dc7350a5b584accb76d7d3ccf263f1d05485b5f95faa4bda4d4599aa08b8342439cdfe215e0b3fe81e7bcf0a7dda0169feca7c24f841948876870759852E
JWT_REFRESH_SECRET=84c9dc7350a5b584accb76d7d3ccf263f1d05485b5f95faa4bda4d4599aa08b8342439cdfe215e0b3fe81e7bcf0a7dda0169feca7c24f841948876870759852F
NODE_ENV=production
API_VERSION=v1
CORS_ORIGINS=https://acuamarina-ceramica-rbqj.vercel.app,https://acuamarina-ceramica-rbqj-git-main-rene-kuhms-projects.vercel.app
```

---

## 🔧 Pasos para Configurar

1. **Ve a Railway Dashboard**
2. Tu servicio → **Variables**
3. **Borra variables antiguas de DB** (si existen)
4. **Agrega solo `DATABASE_URL`** (Opción 1)
5. Guarda → Espera redespliegue (2-3 min)

---

## 🧪 Verificar Conexión

Después del redespliegue, verifica los logs:

**Debe decir:**
```
✅ Database connected successfully
✓ Conexión exitosa a PostgreSQL
```

**NO debe decir:**
```
⚠️ Database not available
ENETUNREACH
ECONNREFUSED
```

---

## 📝 Verificar que Funciona

### Test 1: Health Check
```
https://diligent-upliftment-production-54de.up.railway.app/health
```

### Test 2: Login
```javascript
fetch('https://diligent-upliftment-production-54de.up.railway.app/api/v1/auth/login', {
  method: 'POST',
  headers: {'Content-Type': 'application/json'},
  body: JSON.stringify({
    email: 'admin@aguamarina.com',
    password: 'Admin123!'
  })
})
.then(res => res.json())
.then(data => console.log('Login:', data));
```

**Resultado esperado:**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": 1,
      "email": "admin@aguamarina.com",
      "firstName": "Admin",
      "lastName": "Aguamarina",
      "role": "admin"
    },
    "accessToken": "eyJhbGc...",
    "refreshToken": "eyJhbGc..."
  }
}
```

---

## 🔍 Troubleshooting

### Si sigue sin conectar:

1. **Verifica las variables en Railway**:
   - Asegúrate de que `DATABASE_URL` esté escrita correctamente
   - Sin espacios extras
   - `%40` en lugar de `@` en la contraseña

2. **Verifica en Supabase**:
   - Proyecto: `umyrvlzhvdsibpzvfnal`
   - Settings → Database
   - Connection string debe ser la misma

3. **Revisa los logs de Railway**:
   - Busca el error específico
   - Si ves `ETIMEDOUT` o `ENOTFOUND` → problema de DNS/red
   - Si ves `password authentication failed` → contraseña incorrecta

---

## 🎯 Resumen

- ✅ Usar `DATABASE_URL` en Railway
- ✅ Incluir `?sslmode=require` al final
- ✅ Codificar `@` como `%40` en la contraseña
- ✅ Verificar logs después del deploy
- ✅ Probar login desde consola del navegador

**Una vez configurado, el backend se conectará correctamente a Supabase y el login funcionará.** 🚀
