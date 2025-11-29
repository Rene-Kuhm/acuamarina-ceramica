@echo off
REM Script para exportar base de datos de Supabase
REM Reemplaza [PASSWORD] con tu contraseña de Supabase

echo Exportando base de datos de Supabase...
echo.

REM Exportar schema y datos
pg_dump "postgresql://postgres.umyrvlzhvdsibpzvfnal:[PASSWORD]@db.umyrvlzhvdsibpzvfnal.supabase.co:5432/postgres" ^
  --no-owner ^
  --no-privileges ^
  --clean ^
  --if-exists ^
  --exclude-schema=auth ^
  --exclude-schema=storage ^
  --exclude-schema=extensions ^
  --exclude-schema=graphql ^
  --exclude-schema=graphql_public ^
  --exclude-schema=pgbouncer ^
  --exclude-schema=pgsodium ^
  --exclude-schema=pgsodium_masks ^
  --exclude-schema=realtime ^
  --exclude-schema=supabase_functions ^
  --exclude-schema=vault ^
  > supabase_backup.sql

if %ERRORLEVEL% EQU 0 (
    echo.
    echo ✓ Backup exitoso: supabase_backup.sql
    echo.
) else (
    echo.
    echo ✗ Error al crear backup
    echo.
)

pause
