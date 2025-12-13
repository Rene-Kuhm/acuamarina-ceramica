# Migración de Supabase a Neon - Guía Completa

## 📋 Checklist Pre-Migración

- [ ] Cuenta creada en Neon (https://neon.tech)
- [ ] Proyecto creado en Neon
- [ ] Connection String de Neon guardado
- [ ] PostgreSQL client instalado (`pg_dump` y `psql`)

## Paso 1: Crear Proyecto en Neon

1. Ve a https://neon.tech y crea una cuenta (gratis)
2. Click en **Create Project**
3. Configuración:
   - **Name**: `aguamarina-mosaicos`
   - **Region**: US East (Ohio) - `us-east-2` (cerca de Railway)
   - **PostgreSQL**: Version 16
4. Click **Create Project**
5. **GUARDA LA CONTRASEÑA** que aparece (solo se muestra una vez)
6. Copia el **Connection String** que se ve así:

```
postgresql://neondb_owner:AbCd1234XyZ@ep-cool-name-123456.us-east-2.aws.neon.tech/neondb?sslmode=require
```

## Paso 2: Exportar desde Supabase

### Método 1: pg_dump (Recomendado)

Abre una terminal y ejecuta:

```bash
# Reemplaza [TU-PASSWORD] con la contraseña de Supabase
pg_dump "postgresql://postgres.umyrvlzhvdsibpzvfnal:[TU-PASSWORD]@db.umyrvlzhvdsibpzvfnal.supabase.co:5432/postgres" \
  --no-owner \
  --no-privileges \
  --clean \
  --if-exists \
  --exclude-schema=auth \
  --exclude-schema=storage \
  --exclude-schema=extensions \
  --exclude-schema=graphql \
  --exclude-schema=graphql_public \
  --exclude-schema=pgbouncer \
  --exclude-schema=pgsodium \
  --exclude-schema=pgsodium_masks \
  --exclude-schema=realtime \
  --exclude-schema=supabase_functions \
  --exclude-schema=vault \
  > supabase_backup.sql
```

### Método 2: Desde Supabase Dashboard

1. Ve a tu proyecto en Supabase
2. Database → Backups
3. Download del backup más reciente

### Método 3: Usar el script que creamos

```bash
cd D:\acuamarina-ceramicos\scripts
.\export-from-supabase.bat
```

Edita primero el archivo y reemplaza `[PASSWORD]` con tu contraseña de Supabase.

## Paso 3: Importar a Neon

### Usando psql:

```bash
# Reemplaza [NEON-CONNECTION-STRING] con tu string de Neon
psql "[NEON-CONNECTION-STRING]" < supabase_backup.sql
```

### Usando el script:

```bash
cd D:\acuamarina-ceramicos\scripts
.\import-to-neon.bat
```

El script te pedirá el connection string de Neon.

## Paso 4: Verificar la Migración

Conéctate a Neon y verifica que las tablas existen:

```bash
psql "[NEON-CONNECTION-STRING]"
```

Luego ejecuta:

```sql
-- Ver todas las tablas
\dt

-- Contar usuarios
SELECT COUNT(*) FROM users;

-- Contar productos
SELECT COUNT(*) FROM products;

-- Verificar usuario admin
SELECT id, email, name, role FROM users WHERE email = 'admin@aguamarina.com';
```

## Paso 5: Actualizar Railway

1. Ve a Railway Dashboard
2. Selecciona el servicio **diligent-upliftment**
3. Ve a **Variables**
4. Edita `DATABASE_URL` y pega el connection string de Neon:

```
postgresql://neondb_owner:AbCd1234XyZ@ep-cool-name-123456.us-east-2.aws.neon.tech/neondb?sslmode=require
```

5. **IMPORTANTE**: Elimina estas variables si existen (ya no las necesitas):
   - `DB_HOST`
   - `DB_PORT`
   - `DB_NAME`
   - `DB_USER`
   - `DB_PASSWORD`
   - `DB_SSL`

6. Railway redesplegará automáticamente

## Paso 6: Verificar el Deployment

1. Espera a que Railway termine de redesplegar
2. Ve a **Logs** en Railway
3. Deberías ver:
   ```
   ✓ Conexión exitosa a PostgreSQL
   ✓ Environment variables validated successfully
   🚀 Servidor Aguamarina Mosaicos iniciado
   ```

4. Ya NO deberías ver:
   ```
   ✗ Error al conectar a PostgreSQL: Tenant or user not found
   ```

## Paso 7: Probar el Login

1. Ve a https://admin.aguamarinamosaicos.com/login
2. Intenta hacer login con tus credenciales
3. Debería funcionar correctamente

## Si no existe el usuario admin

Si después de la migración no existe el usuario admin, ejecuta esto en Neon SQL Editor:

```sql
-- Crear usuario admin (contraseña: Admin@123)
INSERT INTO users (email, password, name, role, created_at, updated_at)
VALUES (
  'admin@aguamarina.com',
  '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy',
  'Administrador',
  'admin',
  NOW(),
  NOW()
)
ON CONFLICT (email) DO NOTHING;
```

## Ventajas de Neon sobre Supabase

✅ **Más rápido** - Conexiones más rápidas desde Railway
✅ **Branching** - Puedes crear branches de tu DB para testing
✅ **Auto-scaling** - Escala automáticamente según uso
✅ **Mejor integración** - Funciona mejor con Railway
✅ **Serverless** - Solo pagas por lo que usas

## Troubleshooting

### Error: "role does not exist"
Ejecuta en Neon:
```sql
CREATE ROLE postgres WITH LOGIN PASSWORD 'tu_password';
```

### Error: "permission denied"
Asegúrate de usar `--no-owner --no-privileges` al exportar.

### Tablas de Supabase que aparecen en Neon
Es normal. Los schemas `auth`, `storage`, etc. de Supabase no se importan gracias a los `--exclude-schema`.

### Connection timeout
Verifica que el connection string de Neon incluya `?sslmode=require` al final.

## Rollback (si algo sale mal)

Si necesitas volver a Supabase:

1. En Railway, cambia `DATABASE_URL` de vuelta al de Supabase
2. Railway redesplegará automáticamente

## Después de la Migración Exitosa

Una vez que todo funcione con Neon:

1. Puedes pausar el proyecto de Supabase (Settings → General → Pause project)
2. O eliminarlo completamente si no lo necesitas
3. Actualiza tu `.env.railway` local con el nuevo connection string de Neon
