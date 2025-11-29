@echo off
REM Script para importar base de datos a Neon
REM Reemplaza la CONNECTION STRING con la de Neon

echo Importando base de datos a Neon...
echo.
echo IMPORTANTE: Asegurate de tener el archivo supabase_backup.sql en esta carpeta
echo.

set /p NEON_URL="Pega aqui tu Neon CONNECTION STRING: "

echo.
echo Importando datos...
echo.

psql "%NEON_URL%" < supabase_backup.sql

if %ERRORLEVEL% EQU 0 (
    echo.
    echo ✓ Importacion exitosa
    echo.
) else (
    echo.
    echo ✗ Error al importar
    echo.
)

pause
