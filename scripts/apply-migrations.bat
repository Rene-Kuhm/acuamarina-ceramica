@echo off
echo =========================================
echo  APLICAR MIGRACIONES A NEON
echo =========================================
echo.
echo Este script aplicara las migraciones a tu base de datos Neon
echo.
echo Necesitas el DATABASE_URL de Neon de Railway
echo Puedes encontrarlo en: https://railway.app/project/[tu-proyecto]/variables
echo.
set /p DATABASE_URL="Pega aqui tu DATABASE_URL de Neon: "
echo.
echo Aplicando migraciones...
echo.

node apply-migrations-neon.js

echo.
echo Presiona cualquier tecla para cerrar...
pause > nul
