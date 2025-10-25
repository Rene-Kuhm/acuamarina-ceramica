# Solución al Error 500 en el Registro de Clientes

## ⚠️ ACTUALIZACIÓN IMPORTANTE

Después de investigar el error 500, identificamos que el problema es una **incompatibilidad entre el esquema de la base de datos y el código del backend**.

## Problema Identificado

El error 500 ocurre porque hay una discrepancia entre el esquema de la base de datos en producción (Railway) y el código del backend. Hay dos posibles escenarios:

### Escenario 1: Esquema simple (esquema original)
- Campo `name` (VARCHAR) - nombre completo
- Campo `password` (VARCHAR) - contraseña hasheada
- Campo `role` con CHECK constraint: solo acepta 'user' o 'admin'

### Escenario 2: Esquema migrado (si se ejecutó add-missing-tables.sql)
- Campos `first_name` y `last_name` (VARCHAR)
- Campo `password_hash` (VARCHAR) - contraseña hasheada
- Campo `role` con CHECK constraint: solo acepta 'user', 'admin' o 'customer'

El código actual (commit e8d3cd2) funciona con el **Escenario 1**, pero si la base de datos en Railway fue migrada al **Escenario 2**, entonces el código falla.

## Solución Implementada

Se actualizó el archivo `backend/src/application/controllers/AuthController.ts` para:

### 1. Schema de validación actualizado:
```typescript
const registerSchema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(6, 'La contraseña debe tener al menos 6 caracteres'),
  firstName: z.string().min(2, 'El nombre debe tener al menos 2 caracteres').optional(),
  lastName: z.string().min(2, 'El apellido debe tener al menos 2 caracteres').optional(),
  name: z.string().min(2, 'El nombre debe tener al menos 2 caracteres').optional(),
  phone: z.string().optional(),
});
```

### 2. Método `register` actualizado:
- Acepta tanto `name` como `firstName`/`lastName`
- Combina `firstName` y `lastName` en un campo `name` si es necesario
- Usa el campo `password` en lugar de `password_hash`
- Inserta el rol como 'user' en lugar de 'customer'
- Guarda el teléfono si se proporciona

### 3. Métodos `login` y `me` actualizados:
- Usan `password` en lugar de `password_hash`
- Usan `name` en lugar de `first_name`/`last_name`
- Dividen el nombre completo al responder para mantener compatibilidad con el frontend

## Cambios Realizados

**Archivo modificado:** `backend/src/application/controllers/AuthController.ts`

**Commit:**
```
fix: Align AuthController with database schema for user registration

- Changed from first_name/last_name to single name field
- Changed from password_hash to password field
- Changed role from 'customer' to 'user' to match CHECK constraint
- Added support for both name and firstName/lastName inputs
- Removed is_active check as field doesn't exist in current schema
- Updated all user queries (login, register, me) to use correct fields
```

## Verificación del Despliegue

### Para verificar que Railway ha desplegado los cambios:

1. **Ver el último commit en GitHub:**
   ```bash
   git log --oneline -1
   ```
   Debería mostrar: `e8d3cd2 fix: Align AuthController with database schema...`

2. **Verificar en Railway:**
   - Ve al dashboard de Railway
   - Busca el servicio del backend
   - Verifica que el último despliegue corresponda al commit `e8d3cd2`
   - Espera a que el estado sea "Active" (no "Building" o "Deploying")

3. **Probar el endpoint manualmente:**
   ```bash
   curl -X POST https://diligent-upliftment-production-54de.up.railway.app/api/v1/auth/register \
     -H "Content-Type: application/json" \
     -d '{"email":"nuevo@example.com","password":"test12345","firstName":"Test","lastName":"User"}' \
     -w "\nHTTP Status: %{http_code}\n"
   ```

   **Respuesta esperada (exitosa):**
   ```json
   {
     "success": true,
     "data": {
       "user": {
         "id": 123,
         "email": "nuevo@example.com",
         "firstName": "Test",
         "lastName": "User",
         "role": "user"
       },
       "accessToken": "...",
       "refreshToken": "..."
     }
   }
   HTTP Status: 201
   ```

## Pasos Siguientes

### Si el despliegue aún no se ha completado:

1. **Espera a que Railway complete el build (toma 2-5 minutos)**
2. **Verifica el log de Railway** para asegurarte de que no hay errores de build
3. **Prueba el endpoint** una vez que el servicio esté "Active"

### Si el error persiste después del despliegue:

Es posible que exista una discrepancia entre el esquema local y el de producción. En ese caso:

1. **Verifica el esquema actual de la tabla `users` en Railway:**
   ```sql
   SELECT column_name, data_type
   FROM information_schema.columns
   WHERE table_name = 'users';
   ```

2. **Si la tabla tiene `first_name`, `last_name` y `password_hash`:**
   - La tabla fue migrada con el script `add-missing-tables.sql`
   - Necesitarás revertir el código a usar esos campos
   - O ejecutar un script para volver al esquema original

3. **Si la tabla tiene `name` y `password`:**
   - El código actual debería funcionar
   - Verifica que Railway esté usando el código correcto
   - Revisa los logs de Railway para ver errores específicos

## 🔧 SOLUCIÓN INMEDIATA

### Opción 1: Ejecutar el script SQL de corrección (RECOMENDADO)

He creado un script SQL que verifica y corrige el esquema de la tabla `users`. Este script:
- Detecta el esquema actual
- Lo convierte al esquema correcto que el código necesita
- Actualiza el CHECK constraint del rol para permitir solo 'user' y 'admin'
- Convierte cualquier 'customer' existente a 'user'

**Archivo:** `backend/FIX_USERS_TABLE_SCHEMA.sql`

**Instrucciones:**
1. Conéctate a tu base de datos de Railway
2. Ejecuta el script SQL completo
3. Verifica que el output muestra el esquema correcto
4. Prueba el registro nuevamente

### Opción 2: Verificar el esquema manualmente

Si prefieres verificar primero, ejecuta esta query en Railway:

```sql
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_name = 'users'
ORDER BY ordinal_position;
```

**Si ves `first_name`, `last_name` y `password_hash`:**
- Ejecuta el script `FIX_USERS_TABLE_SCHEMA.sql` para convertir al esquema simple

**Si ves `name` y `password`:**
- El esquema está correcto
- Verifica que el CHECK constraint del rol permite 'user' y 'admin'
- Ejecuta: `UPDATE users SET role = 'user' WHERE role = 'customer';`

## ⏱️ Estado del Despliegue

El código fue enviado a GitHub (commit e8d3cd2) y Railway debería haber desplegado automáticamente. Sin embargo, **el error persiste**, lo que confirma que hay un problema con el esquema de la base de datos en producción.

**Próximo paso:** Ejecutar el script SQL de corrección en Railway.

## 📞 Necesitas Ayuda?

Si el problema persiste después de ejecutar el script SQL, proporciona:
1. El output completo del script SQL
2. Los logs de Railway al intentar registrar un usuario
3. La respuesta exacta del endpoint de registro
