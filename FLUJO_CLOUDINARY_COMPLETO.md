# 🖼️ Flujo Completo: Cloudinary + Productos

## 📋 Cómo Funciona Ahora

### Flujo de Creación de Producto con Imágenes

```
1. Usuario llena formulario de producto
   ├── SKU: Auto-generado
   ├── Nombre: "Mosaico de Vidrio Azul"
   ├── Slug: Auto-generado → "mosaico-de-vidrio-azul"
   ├── Precio, stock, etc.
   └── Imágenes: NINGUNA aún ⚠️

2. Usuario hace click en "Crear Producto"
   ├── Se crea el producto en la DB (sin imágenes)
   ├── Se guarda el productId: ej. 123
   └── Toast: "Producto creado exitosamente"

3. Ahora el CloudinaryImageUploader tiene productId
   ├── Usuario arrastra/selecciona imágenes
   ├── Las imágenes se suben a Cloudinary automáticamente
   ├── Se guardan en product_images con product_id = 123
   └── Toast por cada imagen: "Imagen subida correctamente"

4. Producto completo
   ├── Datos del producto en tabla `products`
   ├── Imágenes en tabla `product_images` vinculadas
   └── URLs optimizadas de Cloudinary listas para el frontend
```

---

## 🔄 Detalles Técnicos

### 1. Formulario de Creación (`products/new/page.tsx`)

```tsx
// Estado para guardar el ID del producto creado
const [createdProductId, setCreatedProductId] = useState<number | undefined>();

// Al crear el producto
const onSubmit = async (data) => {
  // 1. Crear producto (sin imágenes)
  const createdProduct = await createProduct.mutateAsync(productData);

  // 2. Guardar el ID
  setCreatedProductId(parseInt(createdProduct.id));

  // 3. Ahora el CloudinaryImageUploader puede usarlo
  // Las imágenes que se suban se vincularán automáticamente
};

// Pasar productId al uploader
<CloudinaryImageUploader
  value={images}
  onChange={setImages}
  productId={createdProductId}  // ← Se pasa después de crear
  maxImages={8}
/>
```

### 2. CloudinaryImageUploader

```tsx
// Recibe productId opcional
interface Props {
  productId?: number;  // ← Puede ser undefined al inicio
  // ...
}

// Al subir imagen
const uploadResponse = await uploadProductImage(file, productId, {
  isPrimary: isFirst,
});

// Si productId existe, se guarda en product_images
// Si no existe, se sube a Cloudinary pero no se vincula aún
```

### 3. Backend - UploadController

```typescript
// POST /api/v1/upload/product-image
async uploadProductImage(req, res) {
  // 1. Subir a Cloudinary
  const uploadResult = await cloudinary.uploader.upload(file);

  // 2. Si hay productId, guardar en DB
  if (productId) {
    await db.query(
      `INSERT INTO product_images (product_id, image_url, cloudinary_id)
       VALUES ($1, $2, $3)`,
      [productId, uploadResult.secure_url, uploadResult.public_id]
    );
  }

  // 3. Devolver URL de Cloudinary
  return { url: uploadResult.secure_url };
}
```

---

## 🎯 Resultado Final

### En la Base de Datos:

**Tabla `products`**
```sql
id  | sku             | name                    | slug                      | ...
123 | PROD-20241016-1 | Mosaico de Vidrio Azul  | mosaico-de-vidrio-azul    | ...
```

**Tabla `product_images`**
```sql
id | product_id | image_url                                          | cloudinary_id              | is_primary
1  | 123        | https://res.cloudinary.com/xxx/products/abc.jpg    | aguamarina/products/abc    | true
2  | 123        | https://res.cloudinary.com/xxx/products/def.jpg    | aguamarina/products/def    | false
3  | 123        | https://res.cloudinary.com/xxx/products/ghi.jpg    | aguamarina/products/ghi    | false
```

### En Cloudinary:

```
aguamarina/
  └── products/
      ├── abc.jpg  (optimizada, 1200x1200)
      ├── def.jpg  (optimizada, 1200x1200)
      └── ghi.jpg  (optimizada, 1200x1200)
```

---

## 🌐 En el Frontend

### Listado de Productos

```tsx
// El backend ya devuelve la imagen principal
{
  id: '123',
  name: 'Mosaico de Vidrio Azul',
  primary_image: 'https://res.cloudinary.com/xxx/products/abc.jpg',
  // ...
}

// En el componente
<img src={product.primary_image} alt={product.name} />
```

### Detalle del Producto

```tsx
// El backend devuelve todas las imágenes
{
  id: '123',
  name: 'Mosaico de Vidrio Azul',
  images: [
    { url: 'https://...abc.jpg', is_primary: true },
    { url: 'https://...def.jpg', is_primary: false },
    { url: 'https://...ghi.jpg', is_primary: false }
  ]
}

// Galería de imágenes
<Gallery images={product.images} />
```

---

## ⚡ Optimizaciones de Cloudinary

Las imágenes en Cloudinary se optimizan automáticamente:

### En el Upload (Backend)

```typescript
cloudinary.uploader.upload(file, {
  folder: 'aguamarina/products',
  transformation: [
    { width: 1200, height: 1200, crop: 'limit' },
    { quality: 'auto' },
    { fetch_format: 'auto' }
  ]
});
```

### En el Frontend (Next.js Image)

```tsx
import Image from 'next/image';

<Image
  src={product.primary_image}
  alt={product.name}
  width={400}
  height={400}
  // Next.js optimiza automáticamente
  // Cloudinary también optimiza
  // = Máxima performance 🚀
/>
```

---

## 📝 Flujo Paso a Paso para el Usuario

### Crear Producto NUEVO:

1. **Abrir formulario** `/dashboard/products/new`
2. **Llenar datos del producto**
   - SKU ya generado ✅
   - Nombre → slug auto-generado ✅
   - Precio, stock, etc.
3. **Click "Crear Producto"**
   - Se crea en la DB
   - Mensaje: "Producto creado exitosamente"
4. **Ahora subir imágenes**
   - Arrastrar/seleccionar imágenes
   - Se suben automáticamente a Cloudinary
   - Se vinculan al producto recién creado
   - Mensajes de éxito por cada imagen
5. **Listo!**
   - Producto con todas sus imágenes
   - Visible en el frontend optimizado

### Editar Producto EXISTENTE:

1. **Abrir edición** `/dashboard/products/123/edit`
2. **Ya tiene productId = 123**
3. **Cargar imágenes existentes** del producto
4. **Agregar más imágenes**
   - Se suben con productId = 123
   - Se agregan a las existentes
5. **Eliminar imágenes**
   - Se eliminan de Cloudinary
   - Se eliminan de la DB
6. **Guardar cambios**

---

## 🔍 Verificación

### 1. Revisar en Admin Dashboard

```
/dashboard/products → Ver producto creado
  ├── Nombre: Mosaico de Vidrio Azul
  ├── SKU: PROD-20241016-1234
  └── Imagen principal visible ✅
```

### 2. Revisar en Cloudinary Dashboard

```
Media Library → aguamarina/products
  ├── abc.jpg (1200x1200, optimizada)
  ├── def.jpg (1200x1200, optimizada)
  └── ghi.jpg (1200x1200, optimizada)
```

### 3. Revisar en Frontend

```
/productos/mosaico-de-vidrio-azul
  ├── Galería de imágenes ✅
  ├── Imágenes optimizadas ✅
  └── Carga rápida ✅
```

---

## ⚠️ Importante

### Las imágenes NO se guardan con el formulario

**Incorrecto:**
```tsx
// ❌ Enviar imágenes en el cuerpo del producto
const productData = {
  name: "...",
  price: 100,
  images: [...] // ← NO funciona
};
```

**Correcto:**
```tsx
// ✅ Subir imágenes después de crear el producto
1. Crear producto → obtener productId
2. Subir imágenes con productId
3. Las imágenes se vinculan automáticamente
```

### Flujo de Upload

```
CloudinaryImageUploader
  ↓
Arrastra imagen
  ↓
FormData con file + productId
  ↓
POST /api/v1/upload/product-image
  ↓
Cloudinary (imagen optimizada)
  ↓
product_images table (URL guardada)
  ↓
Frontend muestra imagen optimizada
```

---

## 🎨 Ventajas de Este Flujo

1. ✅ **Imágenes optimizadas automáticamente**
   - Cloudinary las optimiza al subirlas
   - Mejor rendimiento en el frontend

2. ✅ **URLs permanentes**
   - Las URLs no cambian
   - Se pueden cachear eficientemente

3. ✅ **Vinculación automática**
   - Las imágenes se asocian al producto correcto
   - No hay imágenes "huérfanas"

4. ✅ **Fácil de gestionar**
   - Agregar/eliminar imágenes es simple
   - Todo centralizado en Cloudinary

5. ✅ **Múltiples imágenes**
   - Hasta 8 imágenes por producto
   - Reordenamiento fácil
   - Marcar imagen principal

---

## 🚀 Para Producción

### Variables de Entorno Necesarias:

**Backend:**
```env
CLOUDINARY_CLOUD_NAME=tu-cloud-name
CLOUDINARY_API_KEY=tu-api-key
CLOUDINARY_API_SECRET=tu-api-secret
```

**Frontend/Admin:**
```env
# No se necesitan credenciales de Cloudinary
# Solo el dominio en next.config.ts
```

**Next.js Config:**
```typescript
// next.config.ts
images: {
  remotePatterns: [
    {
      protocol: 'https',
      hostname: '*.cloudinary.com',
      pathname: '/**',
    },
  ],
}
```

---

## 🎉 Resumen

**Flujo Simple:**
1. Crear producto (sin imágenes)
2. Subir imágenes (se vinculan automáticamente)
3. Imágenes aparecen en frontend optimizadas

**Resultado:**
- ✅ Producto en DB
- ✅ Imágenes en Cloudinary
- ✅ Frontend optimizado
- ✅ Todo automático

**¡Listo para usar!** 🚀
