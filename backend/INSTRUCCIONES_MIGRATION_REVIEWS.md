# Instrucciones para Migración de Reviews

## Problema Actual
La tabla `reviews` en Supabase no tiene las columnas `title` y `verified_purchase`, lo cual causa errores 500 al intentar crear reseñas.

## Solución Temporal Aplicada
El backend ahora funciona sin estas columnas, pero las reseñas no tendrán:
- Título opcional (siempre será `null`)
- Indicador de compra verificada (siempre será `false`)

## Migración Necesaria

### Paso 1: Acceder a Supabase
1. Ve a https://supabase.com/dashboard
2. Selecciona tu proyecto
3. Ve a la sección **SQL Editor** en el menú izquierdo

### Paso 2: Ejecutar la Migración
1. Copia y pega este SQL en el editor:

```sql
-- Migración para agregar columnas faltantes a la tabla reviews

-- Agregar columna title (opcional)
ALTER TABLE reviews
ADD COLUMN IF NOT EXISTS title VARCHAR(100);

-- Agregar columna verified_purchase (compra verificada)
ALTER TABLE reviews
ADD COLUMN IF NOT EXISTS verified_purchase BOOLEAN DEFAULT false;

-- Verificar que las columnas se agregaron correctamente
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns
WHERE table_name = 'reviews'
ORDER BY ordinal_position;
```

2. Haz clic en **Run** o presiona `Ctrl+Enter`

### Paso 3: Verificar la Migración
Deberías ver en los resultados que ahora la tabla `reviews` tiene estas columnas:
- `id` - integer
- `product_id` - integer
- `user_id` - integer
- `rating` - integer
- `comment` - text
- `created_at` - timestamp
- `updated_at` - timestamp
- **`title`** - varchar(100) ✅ NUEVA
- **`verified_purchase`** - boolean ✅ NUEVA

### Paso 4: Actualizar el Backend (DESPUÉS de ejecutar la migración)
Una vez que las columnas existan en Supabase, necesitaremos actualizar el backend para usarlas.

**NO HAGAS ESTO TODAVÍA** - Primero ejecuta la migración en Supabase, luego avísame para actualizar el código del backend.

## Estado Actual
✅ Backend actualizado para funcionar SIN las columnas (temporal)
❌ Columnas NO EXISTEN en base de datos
⏳ Esperando que ejecutes la migración

## Después de la Migración
Una vez ejecutada, necesitarás:
1. Confirmarme que se ejecutó correctamente
2. Yo actualizaré el backend para usar las nuevas columnas
3. Hacer deploy del backend actualizado

---

**Archivo SQL de migración:** `backend/ADD_REVIEW_COLUMNS.sql`
