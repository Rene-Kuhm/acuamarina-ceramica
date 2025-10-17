# 🚀 Configurar Cloudinary en Railway

## Problema
El backend en Railway no tiene las credenciales de Cloudinary configuradas, causando error 500 al subir imágenes.

## ✅ Solución - Configurar Variables de Entorno en Railway

### Paso 1: Ir al Dashboard de Railway

1. Ve a: https://railway.app/
2. Haz login
3. Selecciona tu proyecto `acuamarina-ceramicos-backend`

### Paso 2: Configurar Variables de Entorno

1. En el proyecto, ve a la pestaña **"Variables"**
2. Agrega las siguientes variables:

```
CLOUDINARY_CLOUD_NAME=ddztbf1se
CLOUDINARY_API_KEY=128868447893278
CLOUDINARY_API_SECRET=F18PTLCgiZsw5_9oKnzckKcs2XY
```

### Paso 3: Redeploy

1. Railway va a redeploy automáticamente después de agregar las variables
2. Espera 2-3 minutos a que termine el deploy
3. Verifica que el servicio esté corriendo

### Paso 4: Probar Upload

1. Ve al admin dashboard en Vercel
2. Intenta crear un producto y subir una imagen
3. Debería funcionar correctamente ✅

## 🔍 Verificar que funciona

Los logs en Railway deberían mostrar:

```
📸 Iniciando upload de imagen de producto
📦 Archivo recibido: imagen.jpg, tamaño: 123456 bytes
☁️ Subiendo a Cloudinary...
✅ Imagen subida a Cloudinary: https://res.cloudinary.com/...
```

Si ves este error:
```
❌ Cloudinary no está configurado correctamente
```

Significa que las variables de entorno NO están configuradas.

## 📝 Credenciales de Cloudinary

Las credenciales actuales están en `backend/.env`:

```env
CLOUDINARY_CLOUD_NAME=ddztbf1se
CLOUDINARY_API_KEY=128868447893278
CLOUDINARY_API_SECRET=F18PTLCgiZsw5_9oKnzckKcs2XY
```

## ⚠️ Importante

- NO commitees las credenciales a Git
- Este archivo está en .gitignore
- Las credenciales solo deben estar en:
  - Railway (variables de entorno)
  - `.env` local (para desarrollo)
