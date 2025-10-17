# Integración de Cloudinary - Admin Dashboard

## 📋 Configuración Completada

### 1. Variables de Entorno

Se agregaron las siguientes variables al archivo `.env` del backend:

```env
# Cloudinary Configuration
CLOUDINARY_CLOUD_NAME=your_cloud_name_here
CLOUDINARY_API_KEY=your_api_key_here
CLOUDINARY_API_SECRET=your_api_secret_here
```

**⚠️ IMPORTANTE:** Reemplaza estos valores con tus credenciales reales de Cloudinary.

### 2. Componentes Creados

#### `CloudinaryImageUploader`
**Ubicación:** `src/components/ui/cloudinary-image-uploader.tsx`

Componente completo con:
- ✅ Drag & Drop con react-dropzone
- ✅ Preview de imágenes
- ✅ Upload a Cloudinary vía backend
- ✅ Múltiples imágenes con reordenamiento
- ✅ Marcador de imagen principal
- ✅ Eliminación de imágenes
- ✅ Estados de loading y errores
- ✅ Validación de tamaño (máx 5MB)
- ✅ Límite configurable de imágenes

#### Servicio API
**Ubicación:** `src/lib/api/upload.ts`

Funciones disponibles:
- `uploadProductImage(file, productId?, options?)` - Sube imagen de producto
- `uploadCategoryImage(file, categoryId?)` - Sube imagen de categoría
- `deleteImage(imageId)` - Elimina imagen de Cloudinary y DB

---

## 🚀 Uso del Componente

### Ejemplo 1: Formulario de Producto Nuevo

```tsx
'use client';

import { useState } from 'react';
import { CloudinaryImageUploader, ProductImage } from '@/components/ui/cloudinary-image-uploader';
import { Button } from '@/components/ui/button';

export default function NewProductForm() {
  const [images, setImages] = useState<ProductImage[]>([]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Las imágenes ya están subidas a Cloudinary
    // Solo necesitas enviar las URLs al crear el producto
    const imageUrls = images.map(img => img.url);
    const primaryImage = images.find(img => img.isPrimary)?.url;

    console.log('URLs de imágenes:', imageUrls);
    console.log('Imagen principal:', primaryImage);

    // Aquí envías los datos del producto
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="space-y-6">
        <div>
          <label className="text-sm font-medium">Imágenes del Producto</label>
          <CloudinaryImageUploader
            value={images}
            onChange={setImages}
            maxImages={5}
          />
        </div>

        <Button type="submit">Crear Producto</Button>
      </div>
    </form>
  );
}
```

### Ejemplo 2: Editar Producto Existente

```tsx
'use client';

import { useState, useEffect } from 'react';
import { CloudinaryImageUploader, ProductImage } from '@/components/ui/cloudinary-image-uploader';

export default function EditProductForm({ productId }: { productId: number }) {
  const [images, setImages] = useState<ProductImage[]>([]);

  // Cargar imágenes existentes
  useEffect(() => {
    async function loadProduct() {
      const response = await fetch(`/api/v1/products/${productId}`);
      const product = await response.json();

      // Convertir imágenes del producto al formato del componente
      const existingImages: ProductImage[] = product.images.map((img: any) => ({
        id: img.id,
        url: img.image_url,
        cloudinaryId: img.cloudinary_id,
        altText: img.alt_text,
        isPrimary: img.is_primary,
      }));

      setImages(existingImages);
    }

    loadProduct();
  }, [productId]);

  return (
    <div>
      <CloudinaryImageUploader
        value={images}
        onChange={setImages}
        productId={productId}
        maxImages={10}
      />
    </div>
  );
}
```

### Ejemplo 3: Con React Hook Form

```tsx
'use client';

import { useForm } from 'react-hook-form';
import { CloudinaryImageUploader, ProductImage } from '@/components/ui/cloudinary-image-uploader';

interface ProductFormData {
  name: string;
  description: string;
  price: number;
  images: ProductImage[];
}

export default function ProductFormWithValidation() {
  const { register, handleSubmit, watch, setValue } = useForm<ProductFormData>({
    defaultValues: {
      images: [],
    },
  });

  const images = watch('images');

  const onSubmit = (data: ProductFormData) => {
    console.log('Datos del formulario:', data);
    // data.images contiene todas las imágenes con sus URLs de Cloudinary
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="space-y-4">
        <input {...register('name')} placeholder="Nombre del producto" />

        <CloudinaryImageUploader
          value={images}
          onChange={(newImages) => setValue('images', newImages)}
          maxImages={8}
        />

        <button type="submit">Guardar</button>
      </div>
    </form>
  );
}
```

---

## 🎯 Props del Componente

```typescript
interface CloudinaryImageUploaderProps {
  value: ProductImage[];           // Array de imágenes actual
  onChange: (value: ProductImage[]) => void;  // Callback cuando cambian las imágenes
  productId?: number;              // ID del producto (opcional, para asociar imágenes)
  maxImages?: number;              // Máximo de imágenes permitidas (default: 10)
  disabled?: boolean;              // Deshabilitar el componente (default: false)
}

interface ProductImage {
  id?: number;                     // ID en la base de datos
  url: string;                     // URL de Cloudinary
  cloudinaryId?: string;           // ID público de Cloudinary
  altText?: string;                // Texto alternativo
  isPrimary?: boolean;             // Si es la imagen principal
  file?: File;                     // Archivo original (solo durante upload)
  uploading?: boolean;             // Estado de carga
}
```

---

## 🔧 Endpoints del Backend

### Upload Producto
```
POST /api/v1/upload/product-image
Content-Type: multipart/form-data

FormData:
- image: File (required)
- productId: number (optional)
- altText: string (optional)
- isPrimary: boolean (optional)

Response:
{
  "success": true,
  "data": {
    "id": 1,
    "url": "https://res.cloudinary.com/...",
    "cloudinaryId": "aguamarina/products/abc123",
    "width": 1200,
    "height": 1200
  }
}
```

### Upload Categoría
```
POST /api/v1/upload/category-image
Content-Type: multipart/form-data

FormData:
- image: File (required)
- categoryId: number (optional)
```

### Eliminar Imagen
```
DELETE /api/v1/upload/:imageId

Response:
{
  "success": true,
  "message": "Imagen eliminada correctamente"
}
```

---

## 🎨 Características del Componente

### 1. **Drag & Drop**
- Arrastra archivos desde el explorador
- Feedback visual cuando se arrastra sobre la zona
- Validación de tipo de archivo (solo imágenes)

### 2. **Preview Instantáneo**
- Las imágenes se muestran mientras se suben
- Indicador de progreso durante el upload
- Grid responsive (2-5 columnas según pantalla)

### 3. **Gestión de Imágenes**
- **Marcar como principal**: Click en la estrella
- **Reordenar**: Flechas izquierda/derecha
- **Eliminar**: Click en X (elimina de Cloudinary y DB)

### 4. **Validaciones**
- Tamaño máximo: 5MB por imagen
- Tipos permitidos: JPG, PNG, GIF, WEBP
- Límite de imágenes configurable

### 5. **Estados UI**
- Loading spinner durante upload
- Toast notifications para éxito/error
- Overlay con controles al hacer hover
- Badge "Principal" en la imagen principal

---

## 🔄 Flujo de Trabajo

1. **Usuario arrastra/selecciona imágenes**
   - Se validan tamaño y tipo
   - Se agregan al estado con preview

2. **Upload automático a Cloudinary**
   - FormData se envía al backend
   - Backend sube a Cloudinary
   - Devuelve URL y metadata

3. **Actualización del estado**
   - Se reemplaza el preview con la URL real
   - Se guarda el ID de Cloudinary
   - Se marca como subido

4. **Guardado del producto**
   - Las imágenes YA están en Cloudinary
   - Solo se envían las URLs al crear/editar
   - Las relaciones se guardan en DB

---

## 📝 Próximos Pasos

### 1. **Completar Credenciales**
Edita `backend/.env` con tus valores reales de Cloudinary:
```bash
CLOUDINARY_CLOUD_NAME=tu-cloud-name
CLOUDINARY_API_KEY=tu-api-key
CLOUDINARY_API_SECRET=tu-api-secret
```

### 2. **Reiniciar Backend**
```bash
cd backend
npm run dev
```

### 3. **Integrar en Formularios**
- Importa `CloudinaryImageUploader`
- Reemplaza el componente `ImageUpload` antiguo
- Prueba subiendo imágenes

### 4. **Verificar en Cloudinary**
- Ve a tu dashboard de Cloudinary
- Revisa la carpeta `aguamarina/products/`
- Confirma que las imágenes se suben correctamente

---

## 🐛 Troubleshooting

### Error: "No se ha proporcionado ningún archivo"
- Verifica que el campo del formulario se llame `image`
- Asegúrate de usar `multipart/form-data`

### Error: 401 Unauthorized
- Verifica que el token JWT esté en localStorage
- Revisa que el backend esté corriendo

### Error: "Error al subir la imagen"
- Revisa las credenciales de Cloudinary en `.env`
- Verifica que el archivo sea menor a 5MB
- Confirma que sea un formato de imagen válido

### Las imágenes no se muestran
- Verifica que `next.config.ts` tenga configurado el dominio de Cloudinary
- Asegúrate de que la URL comience con `https://res.cloudinary.com/`

---

## 💡 Tips de Uso

1. **Siempre marca una imagen como principal** - Ayuda a identificar la imagen de portada

2. **Ordena las imágenes** - El orden importa para la galería del producto

3. **Usa nombres descriptivos** - Aunque no es obligatorio, ayuda con SEO

4. **Optimiza antes de subir** - Cloudinary optimiza, pero es mejor subir archivos razonables

5. **Prueba con diferentes tamaños** - El componente es responsive y se adapta

---

## 📚 Recursos

- [Cloudinary Docs](https://cloudinary.com/documentation)
- [React Dropzone](https://react-dropzone.js.org/)
- [Backend API Docs](http://localhost:3000/api-docs)

---

✅ **Todo listo para usar Cloudinary en el admin dashboard!**
