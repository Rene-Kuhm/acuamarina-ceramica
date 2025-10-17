# ✅ Integración de Cloudinary - COMPLETADA

## 📦 Archivos Creados/Modificados

### Backend
- ✅ **`backend/.env`** - Agregadas variables de Cloudinary (necesitan tus credenciales)
- ✅ **`backend/src/config/cloudinary.ts`** - Configuración existente ✓
- ✅ **`backend/src/application/controllers/UploadController.ts`** - Controlador existente ✓
- ✅ **`backend/src/application/routes/upload.routes.ts`** - Rutas existentes ✓

### Admin Dashboard
- ✅ **`admin-dashboard/.env.local`** - Agregadas variables opcionales de Cloudinary
- ✅ **`admin-dashboard/src/lib/api/upload.ts`** - **NUEVO** Servicio API para uploads
- ✅ **`admin-dashboard/src/components/ui/cloudinary-image-uploader.tsx`** - **NUEVO** Componente completo
- ✅ **`admin-dashboard/CLOUDINARY_INTEGRATION.md`** - **NUEVO** Documentación completa

### Frontend
- ✅ **`frontend/next.config.ts`** - Ya configurado para Cloudinary ✓

---

## 🔑 Acción Requerida: Configurar Credenciales

### 1. Backend - Edita `backend/.env`

Reemplaza estos valores con tus credenciales de Cloudinary:

```env
# Cloudinary Configuration
CLOUDINARY_CLOUD_NAME=your_cloud_name_here     # ← Cambiar
CLOUDINARY_API_KEY=your_api_key_here           # ← Cambiar
CLOUDINARY_API_SECRET=your_api_secret_here     # ← Cambiar
```

### Dónde encontrar tus credenciales:

1. Ve a [cloudinary.com](https://cloudinary.com/users/login)
2. Inicia sesión
3. En el Dashboard verás:
   - **Cloud Name** - Arriba a la derecha
   - **API Key** - En "Account Details" → "API Keys"
   - **API Secret** - Mismo lugar (click "Reveal")

---

## 🚀 Cómo Usar el Nuevo Componente

### Importar el componente:

```tsx
import { CloudinaryImageUploader, ProductImage } from '@/components/ui/cloudinary-image-uploader';
```

### Uso básico:

```tsx
'use client';

import { useState } from 'react';
import { CloudinaryImageUploader, ProductImage } from '@/components/ui/cloudinary-image-uploader';

export default function MyForm() {
  const [images, setImages] = useState<ProductImage[]>([]);

  return (
    <CloudinaryImageUploader
      value={images}
      onChange={setImages}
      maxImages={5}
    />
  );
}
```

---

## ✨ Características Implementadas

### 1. **Drag & Drop Profesional**
- Arrastra archivos desde tu computadora
- Feedback visual cuando arrastras sobre la zona
- Validación automática de tipos y tamaños

### 2. **Upload Automático a Cloudinary**
- Las imágenes se suben inmediatamente al seleccionarlas
- Indicador de progreso mientras se suben
- Notificaciones de éxito/error

### 3. **Gestión Completa de Imágenes**
- **Marcar como principal** - Estrella para identificar la imagen principal
- **Reordenar** - Flechas para cambiar el orden
- **Eliminar** - Botón X que elimina de Cloudinary y la base de datos
- **Preview** - Ve las imágenes mientras se cargan

### 4. **Validaciones**
- Máximo 5MB por imagen
- Solo formatos: JPG, PNG, GIF, WEBP
- Límite de imágenes configurable (default: 10)

### 5. **UI/UX Moderna**
- Grid responsive (2-5 columnas según pantalla)
- Animaciones suaves
- Tema oscuro/claro compatible
- Controles que aparecen al hacer hover

---

## 🔄 Flujo de Trabajo

```
Usuario selecciona imagen
         ↓
Preview instantáneo
         ↓
Upload automático a Cloudinary
         ↓
Backend procesa y guarda en DB
         ↓
Componente muestra URL final
         ↓
Listo para guardar el producto
```

---

## 📋 Endpoints del Backend

### Subir Imagen de Producto
```
POST /api/v1/upload/product-image
Content-Type: multipart/form-data

Body:
- image: File (requerido)
- productId: number (opcional)
- altText: string (opcional)
- isPrimary: boolean (opcional)
```

### Subir Imagen de Categoría
```
POST /api/v1/upload/category-image
Content-Type: multipart/form-data

Body:
- image: File (requerido)
- categoryId: number (opcional)
```

### Eliminar Imagen
```
DELETE /api/v1/upload/:imageId
```

---

## 🎯 Próximos Pasos

### 1. Configura tus credenciales
Edita `backend/.env` con los valores de Cloudinary

### 2. Reinicia el backend
```bash
cd backend
npm run dev
```

### 3. Integra en tus formularios
Reemplaza el componente `ImageUpload` antiguo por `CloudinaryImageUploader`

### 4. Prueba el upload
- Ve a crear/editar producto
- Arrastra una imagen
- Verifica que se suba a Cloudinary
- Revisa tu dashboard de Cloudinary en la carpeta `aguamarina/products/`

---

## 📚 Documentación Completa

Para ejemplos detallados, troubleshooting y más información:

👉 **Lee el archivo:** `admin-dashboard/CLOUDINARY_INTEGRATION.md`

---

## 🎨 Ejemplo Visual del Componente

```
┌─────────────────────────────────────────────┐
│  🖼️  🖼️  🖼️  🖼️  🖼️                        │
│  ⭐    ←→   ←→   ←→   ←→                    │
│                                             │
│  ┌────────────────────────────────────┐    │
│  │    ☁️  Arrastra imágenes aquí      │    │
│  │    o haz click para seleccionar    │    │
│  │    Máximo 10 imágenes - 5MB c/u    │    │
│  └────────────────────────────────────┘    │
│                                             │
│  • Click en ⭐ para marcar como principal   │
│  • Usa ← → para reordenar                  │
│  • Click en ✕ para eliminar                │
└─────────────────────────────────────────────┘
```

---

## 🐛 Solución de Problemas

### No se suben las imágenes
1. Verifica credenciales de Cloudinary en `backend/.env`
2. Asegúrate de que el backend esté corriendo
3. Revisa la consola del navegador por errores

### Error 401 Unauthorized
- Verifica que estés autenticado (token en localStorage)
- Revisa que el backend tenga CORS configurado correctamente

### Las imágenes no se ven
- Confirma que `next.config.ts` tenga el dominio de Cloudinary
- Verifica que la URL sea válida (empieza con `https://res.cloudinary.com/`)

---

## 💡 Tips

1. **Organización** - Las imágenes se guardan en `aguamarina/products/` en Cloudinary
2. **Optimización** - Cloudinary optimiza automáticamente las imágenes
3. **Tamaño** - Se limita a 1200x1200px para productos, 800x800px para categorías
4. **Formato** - Se convierte automáticamente a WebP para mejor rendimiento

---

## ✅ Checklist de Implementación

- [x] Variables de entorno configuradas
- [x] Servicio API creado
- [x] Componente CloudinaryImageUploader creado
- [x] Documentación completa
- [x] Ejemplos de uso incluidos
- [ ] **Configurar credenciales de Cloudinary** ← PENDIENTE
- [ ] Reiniciar backend con credenciales
- [ ] Integrar en formularios de productos
- [ ] Probar upload de imágenes
- [ ] Verificar en dashboard de Cloudinary

---

**🎉 La integración de Cloudinary está lista!**

Solo falta que agregues tus credenciales y comiences a subir imágenes.
