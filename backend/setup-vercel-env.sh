#!/bin/bash

# Script para configurar variables de entorno en Vercel
# Uso: ./setup-vercel-env.sh

echo "🔧 Configurando variables de entorno en Vercel..."
echo ""
echo "⚠️  IMPORTANTE: Este script requiere que hayas hecho login en Vercel CLI"
echo "   Si no lo has hecho, ejecuta: vercel login"
echo ""

# Leer variables del archivo .env
source .env 2>/dev/null || {
  echo "❌ Error: Archivo .env no encontrado"
  echo "   Crea el archivo .env basado en .env.example"
  exit 1
}

# Función para agregar variable de entorno
add_env_var() {
  local var_name=$1
  local var_value=$2
  local env_type=${3:-"production"}

  if [ -z "$var_value" ]; then
    echo "⏭️  Saltando $var_name (valor vacío)"
    return
  fi

  echo "➕ Agregando $var_name..."
  echo "$var_value" | vercel env add $var_name $env_type 2>&1 | grep -v "What's the value"
}

echo "📝 Configurando variables requeridas..."
echo ""

# Variables requeridas
add_env_var "NODE_ENV" "production" "production"
add_env_var "DATABASE_URL" "$DATABASE_URL" "production"
add_env_var "JWT_SECRET" "$JWT_SECRET" "production"
add_env_var "JWT_EXPIRES_IN" "$JWT_EXPIRES_IN" "production"

# Variables CORS
add_env_var "CORS_ORIGINS" "$CORS_ORIGINS" "production"

# Variables opcionales
if [ -n "$REDIS_URL" ]; then
  echo ""
  echo "📝 Configurando Redis (opcional)..."
  add_env_var "REDIS_URL" "$REDIS_URL" "production"
fi

if [ -n "$CLOUDINARY_CLOUD_NAME" ]; then
  echo ""
  echo "📝 Configurando Cloudinary (opcional)..."
  add_env_var "CLOUDINARY_CLOUD_NAME" "$CLOUDINARY_CLOUD_NAME" "production"
  add_env_var "CLOUDINARY_API_KEY" "$CLOUDINARY_API_KEY" "production"
  add_env_var "CLOUDINARY_API_SECRET" "$CLOUDINARY_API_SECRET" "production"
fi

echo ""
echo "✅ Configuración completada!"
echo ""
echo "📌 Próximos pasos:"
echo "   1. Verifica las variables en: https://vercel.com/dashboard"
echo "   2. Redeploy el proyecto: vercel --prod"
echo ""
