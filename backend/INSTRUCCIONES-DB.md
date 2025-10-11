# Instrucciones para crear la Base de Datos

## Opción 1: Desde pgAdmin (Recomendado para Windows)

1. Abre **pgAdmin**
2. Conecta a tu servidor PostgreSQL (generalmente `localhost`)
3. Click derecho en **"Databases"**
4. Selecciona **"Create" → "Database..."**
5. En el campo **"Database"** escribe: `aguamarina_mosaicos`
6. Click en **"Save"**

¡Listo! Ahora puedes ejecutar las migraciones.

## Opción 2: Desde línea de comandos

Si tienes PostgreSQL en el PATH:

\`\`\`bash
createdb -U postgres aguamarina_mosaicos
\`\`\`

## Opción 3: Desde psql

\`\`\`bash
# Conectar a PostgreSQL
psql -U postgres

# Crear la base de datos
CREATE DATABASE aguamarina_mosaicos;

# Verificar
\l

# Salir
\q
\`\`\`

## Opción 4: Usar el script SQL

\`\`\`bash
psql -U postgres -f setup-db.sql
\`\`\`

## Verificar instalación de PostgreSQL

Si PostgreSQL no está instalado o no lo encuentras:

1. **Verificar si está instalado:**
   - Busca "pgAdmin" en el menú de inicio
   - O busca "PostgreSQL" en Programas instalados

2. **Si no está instalado:**
   - Descarga desde: https://www.postgresql.org/download/windows/
   - Instala con las opciones por defecto
   - Anota la contraseña del usuario `postgres`

3. **Agregar PostgreSQL al PATH (opcional):**
   - Busca la carpeta de instalación: `C:\Program Files\PostgreSQL\16\bin`
   - Agrégala a las variables de entorno PATH

## Credenciales por defecto

- **Usuario:** postgres
- **Contraseña:** La que configuraste durante la instalación
- **Puerto:** 5432
- **Host:** localhost

## Siguiente paso

Una vez creada la base de datos, ejecuta:

\`\`\`bash
npm run db:migrate
\`\`\`
