# 🔧 Aplicar Migraciones a Neon

## ⚠️ IMPORTANTE: Debes ejecutar esto para solucionar el error 500 al crear categorías

El error ocurre porque la tabla `categories` no tiene las columnas necesarias.

## 📋 Pasos para aplicar las migraciones:

### Método 1: Script Batch (Windows - Recomendado)

1. Abre una terminal en `D:\acuamarina-ceramicos\scripts`
2. Ejecuta:
   ```cmd
   apply-migrations.bat
   ```
3. Cuando te pida el `DATABASE_URL`:
   - Ve a https://railway.app
   - Abre tu proyecto
   - Ve a **Variables**
   - Copia el valor completo de `DATABASE_URL`
   - Pégalo en la terminal

### Método 2: Node.js directo

```bash
cd D:\acuamarina-ceramicos\scripts

# Configura la variable de entorno
set DATABASE_URL=postgresql://usuario:password@host.neon.tech/dbname?sslmode=require

# Ejecuta el script
node apply-migrations-neon.js
```

## ✅ Qué hace el script:

1. ✓ Se conecta a Neon
2. ✓ Lee `backend/migrations.sql`
3. ✓ Ejecuta las migraciones
4. ✓ Agrega las columnas faltantes:
   - `parent_id` (para categorías padre)
   - `display_order`
   - `is_active`
   - `meta_title`
   - `meta_description`
5. ✓ Verifica que todo se aplicó correctamente

## 🎯 Resultado esperado:

```
🚀 Aplicando migraciones a Neon...
📡 Conectando a la base de datos...
✅ Conexión exitosa
📄 Leyendo migraciones desde: D:\acuamarina-ceramicos\backend\migrations.sql
✅ Archivo de migraciones leído
⚙️  Ejecutando migraciones...
✅ Migraciones aplicadas exitosamente
🔍 Verificando estructura de tabla categories...
✅ La columna parent_id existe - ¡El problema está solucionado!
✨ Proceso completado exitosamente
```

## 🐛 Troubleshooting

### Error: "password authentication failed"
- Verifica que copiaste el `DATABASE_URL` completo y correcto de Railway

### Error: "connection timeout"
- Verifica tu conexión a internet
- Asegúrate que el URL termine con `?sslmode=require`

### Error: "permission denied"
- Asegúrate de usar el DATABASE_URL del owner (neondb_owner)

## 📝 Después de aplicar las migraciones:

1. ✓ El error 500 al crear categorías desaparecerá
2. ✓ Podrás crear categorías padre en el admin
3. ✓ Podrás crear subcategorías
4. ✓ No necesitas reiniciar Railway (las migraciones afectan la BD, no el código)
