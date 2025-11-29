# 📘 MANUAL DE USUARIO - ADMIN DASHBOARD
## Aguamarina Mosaicos

**Versión**: 1.0
**Fecha**: Noviembre 2025
**Para**: Administradores del sistema

---

## 📋 ÍNDICE

1. [Introducción](#introducción)
2. [Acceso al Admin Dashboard](#acceso-al-admin-dashboard)
3. [Gestión de Categorías](#gestión-de-categorías)
   - [Crear Categoría Principal](#crear-categoría-principal)
   - [Crear Subcategoría](#crear-subcategoría)
   - [Editar Categoría](#editar-categoría)
   - [Eliminar Categoría](#eliminar-categoría)
4. [Gestión de Productos](#gestión-de-productos)
   - [Crear Producto Nuevo](#crear-producto-nuevo)
   - [Subir Imágenes de Producto](#subir-imágenes-de-producto)
   - [Editar Producto](#editar-producto)
   - [Eliminar Producto](#eliminar-producto)
5. [Buenas Prácticas](#buenas-prácticas)
6. [Resolución de Problemas](#resolución-de-problemas)
7. [Preguntas Frecuentes](#preguntas-frecuentes)

---

## 🚀 INTRODUCCIÓN

Este manual te guiará paso a paso en el uso del Admin Dashboard de Aguamarina Mosaicos para gestionar correctamente categorías, subcategorías y productos.

### ¿Qué puedes hacer?

- ✅ Crear y organizar categorías de productos
- ✅ Crear subcategorías dentro de categorías principales
- ✅ Agregar productos con toda su información
- ✅ Subir múltiples imágenes por producto
- ✅ Gestionar stock e inventario
- ✅ Activar/desactivar productos y categorías
- ✅ Destacar productos en la página principal

---

## 🔐 ACCESO AL ADMIN DASHBOARD

### URL de Acceso
```
https://admin.aguamarinamosaicos.com
```

### Iniciar Sesión

1. **Abre tu navegador** y ve a: `https://admin.aguamarinamosaicos.com`

2. **Página de Login**: Verás un formulario con dos campos
   - Email
   - Contraseña

3. **Ingresa tus credenciales de administrador**:
   ```
   Email: admin@aguamarinamosaicos.com
   Contraseña: [Tu contraseña configurada]
   ```

4. **Click en "Iniciar Sesión"**

5. **Serás redirigido** al Dashboard principal

### Cerrar Sesión

- Click en tu avatar o nombre en la esquina superior derecha
- Selecciona "Cerrar Sesión"

---

## 📁 GESTIÓN DE CATEGORÍAS

Las categorías organizan tus productos y ayudan a los clientes a encontrar lo que buscan.

### ✅ CREAR CATEGORÍA PRINCIPAL

Una categoría principal es una categoría de nivel superior (sin padre).

#### Paso 1: Ir a Categorías

1. En el menú lateral, click en **"Categorías"**
2. Click en el botón **"Nueva Categoría"** (esquina superior derecha)

#### Paso 2: Completar Información Básica

**Campos obligatorios:**

**1. Nombre*** (Obligatorio)
```
Ejemplo: Mosaicos Decorativos
Ejemplo: Porcelanatos
Ejemplo: Revestimientos
```
- Escribe un nombre descriptivo y claro
- Usa mayúsculas al inicio de cada palabra
- Evita caracteres especiales excepto espacios y guiones

**2. Slug (URL)** (Se genera automáticamente)
```
Se genera automáticamente del nombre:
"Mosaicos Decorativos" → "mosaicos-decorativos"
```
- ✅ Se genera solo al escribir el nombre
- 📝 Puedes editarlo manualmente si es necesario
- ⚠️ Usa solo letras minúsculas, números y guiones
- ⚠️ Sin espacios ni caracteres especiales

**3. Imagen de la Categoría** (Opcional pero recomendado)
```
Formatos aceptados: JPG, PNG, WEBP
Tamaño máximo: 5MB
Tamaño recomendado: 800x600 píxeles mínimo
```

**Cómo subir imagen:**
- Click en **"Elegir archivo"** o arrastra la imagen
- Se mostrará una vista previa
- La imagen se guarda automáticamente en Cloudinary

**4. Descripción** (Opcional)
```
Ejemplo:
"Descubre nuestra colección de mosaicos decorativos para
dar un toque único a tus espacios. Ideales para baños,
cocinas y áreas de estar."
```
- Describe brevemente la categoría
- Usa entre 50-200 caracteres
- Ayuda al SEO y a los clientes

#### Paso 3: Configurar Organización

**Panel derecho - "Organización"**

**1. Categoría Padre**
```
Selecciona: "Sin categoría padre"
```
- Para una categoría principal, deja este campo sin seleccionar
- O selecciona "Sin categoría padre"

**2. Orden de visualización**
```
Valor por defecto: 0
Menor número = aparece primero
```
Ejemplos:
- Categoría más importante: 0
- Segunda categoría: 1
- Tercera categoría: 2

**3. Categoría activa**
```
☑ Marcado = La categoría es visible en la tienda
☐ Desmarcado = La categoría está oculta
```
- ✅ Marca este checkbox para que se vea en la web

#### Paso 4: Guardar

1. **Revisa todos los datos**
2. Click en botón **"Crear Categoría"**
3. Verás mensaje: "Categoría creada exitosamente"
4. Serás redirigido a la lista de categorías

---

### 📂 CREAR SUBCATEGORÍA

Una subcategoría es una categoría que pertenece a otra categoría (tiene padre).

#### ¿Cuándo crear una subcategoría?

Ejemplos de jerarquías:

```
Categoría Principal: Mosaicos
  └─ Subcategoría: Mosaicos Venecianos
  └─ Subcategoría: Mosaicos de Vidrio
  └─ Subcategoría: Mosaicos Cerámicos

Categoría Principal: Porcelanatos
  └─ Subcategoría: Porcelanatos Esmaltados
  └─ Subcategoría: Porcelanatos Pulidos
  └─ Subcategoría: Porcelanatos Rústicos

Categoría Principal: Revestimientos
  └─ Subcategoría: Revestimientos para Baño
  └─ Subcategoría: Revestimientos para Cocina
  └─ Subcategoría: Revestimientos Exteriores
```

#### Paso 1: Ir a Categorías

1. En el menú lateral, click en **"Categorías"**
2. Click en el botón **"Nueva Categoría"**

#### Paso 2: Completar Información

Completa todos los campos como en una categoría principal:
- Nombre
- Slug (se genera automáticamente)
- Imagen (opcional)
- Descripción (opcional)

#### Paso 3: Seleccionar Categoría Padre ⭐ IMPORTANTE

**Panel derecho - "Organización"**

**Categoría Padre:**
```
Selecciona la categoría principal de la lista desplegable
```

**Ejemplo:**
```
Si estás creando "Mosaicos de Vidrio"
Selecciona: "Mosaicos" como categoría padre
```

#### Paso 4: Configurar y Guardar

1. **Orden de visualización**: Define el orden dentro de su categoría padre
2. **Marca "Categoría activa"**
3. Click en **"Crear Categoría"**

#### Resultado

La subcategoría aparecerá:
- En la lista de categorías, indentada bajo su padre
- En la web, dentro del menú de su categoría principal

---

### ✏️ EDITAR CATEGORÍA

#### Paso 1: Buscar la Categoría

1. Ve a **"Categorías"** en el menú lateral
2. Busca la categoría que quieres editar
3. Click en el **ícono de lápiz (Editar)** o en el nombre

#### Paso 2: Modificar Información

- Modifica los campos que necesites
- Puedes cambiar:
  - Nombre
  - Slug (cuidado: cambia la URL)
  - Imagen
  - Descripción
  - Categoría padre (convertir a subcategoría o viceversa)
  - Orden
  - Estado activo/inactivo

#### Paso 3: Guardar Cambios

1. Click en **"Guardar Cambios"** o **"Actualizar Categoría"**
2. Verás mensaje de confirmación

---

### 🗑️ ELIMINAR CATEGORÍA

⚠️ **ADVERTENCIA**: Eliminar una categoría es permanente.

#### Antes de Eliminar

**Verifica:**
- ¿Hay productos asociados a esta categoría?
- ¿Hay subcategorías dentro de esta categoría?

**Recomendación**: Si hay productos, primero:
1. Mueve los productos a otra categoría, O
2. Elimina los productos primero

#### Cómo Eliminar

1. Ve a **"Categorías"**
2. Busca la categoría
3. Click en el **ícono de basura (Eliminar)**
4. Confirma la eliminación en el diálogo
5. La categoría será eliminada

---

## 🛍️ GESTIÓN DE PRODUCTOS

### ✅ CREAR PRODUCTO NUEVO

#### Paso 1: Ir a Productos

1. En el menú lateral, click en **"Productos"**
2. Click en el botón **"Nuevo Producto"** (esquina superior derecha)

#### Paso 2: Información Básica del Producto

**Panel Izquierdo - "Información del Producto"**

**1. SKU*** (Obligatorio)
```
Ejemplo: MSC-DEC-001
Ejemplo: POR-ESM-045
Ejemplo: REV-BAÑ-023
```
- **SKU = Stock Keeping Unit** (Código único del producto)
- Se genera automáticamente al cargar la página
- ✅ Puedes usar el SKU generado o cambiarlo
- 🔄 Click en "Generar nuevo SKU" para otro código
- ⚠️ Debe ser único (no repetir)

**2. Nombre del Producto*** (Obligatorio)
```
Ejemplo: Mosaico Veneciano Azul Cobalto 30x30cm
Ejemplo: Porcelanato Esmaltado Gris Cemento 60x60cm
Ejemplo: Revestimiento Cerámico Blanco Brillante 20x60cm
```
- Sé específico y descriptivo
- Incluye:
  - Tipo de producto
  - Material/acabado
  - Color principal
  - Medidas (cuando aplique)

**3. Slug (URL)** (Se genera automáticamente)
```
Se genera del nombre:
"Mosaico Veneciano Azul Cobalto" → "mosaico-veneciano-azul-cobalto"
```
- ✅ Se genera automáticamente al escribir el nombre
- 📝 Puedes editarlo si es necesario
- Usado en la URL del producto en la web

**4. Descripción Corta** (Opcional pero recomendado)
```
Ejemplo:
"Mosaico veneciano de alta calidad con acabado brillante.
Ideal para decoración de baños y cocinas."

Longitud recomendada: 100-150 caracteres
```
- Aparece en las tarjetas de producto
- Debe ser atractiva y concisa
- Resalta lo más importante

**5. Descripción** (Opcional pero recomendado)
```
Ejemplo:
"Nuestro mosaico veneciano azul cobalto combina tradición
y modernidad. Fabricado con materiales de primera calidad,
ofrece resistencia al agua y fácil limpieza.

Características:
- Material: Vidrio veneciano
- Acabado: Brillante
- Uso: Interior
- Resistencia: Alta

Ideal para crear espacios únicos y elegantes."

Longitud recomendada: 200-500 caracteres
```
- Descripción detallada del producto
- Incluye características técnicas
- Beneficios para el cliente
- Cuidados y mantenimiento

#### Paso 3: Precios y Stock

**Panel Izquierdo - Continuación**

**6. Precio*** (Obligatorio)
```
Ejemplo: 1250.00
Ejemplo: 890.50
```
- Solo números y punto decimal
- Sin símbolos de moneda ($)
- Sin comas
- ✅ Correcto: 1250.00
- ❌ Incorrecto: $1,250.00

**7. Precio Comparado** (Opcional)
```
Ejemplo: 1500.00 (si el precio actual es 1250)
```
- Precio anterior o precio de lista
- Si lo completas, se mostrará tachado en la web
- Útil para mostrar descuentos

**8. Stock Disponible*** (Obligatorio)
```
Ejemplo: 50
Ejemplo: 100
Ejemplo: 0 (sin stock)
```
- Cantidad de unidades disponibles
- Debe ser un número entero
- Si es 0, el producto aparecerá como "Sin stock"

**9. Umbral de Stock Bajo*** (Obligatorio)
```
Valor por defecto: 10
Ejemplo: 5
```
- Cuando el stock llegue a este número, recibirás alerta
- Útil para reordenar productos a tiempo

#### Paso 4: Clasificación

**Panel Derecho - "Clasificación"**

**10. Categoría** (Opcional pero recomendado)
```
Selecciona la categoría adecuada del menú desplegable
```

**Ejemplos:**
- Mosaico veneciano → Categoría: "Mosaicos" → Subcategoría: "Mosaicos Venecianos"
- Porcelanato esmaltado → Categoría: "Porcelanatos" → Subcategoría: "Porcelanatos Esmaltados"

**¿No encuentras la categoría?**
- Primero ve a "Categorías" y créala
- Luego vuelve a crear el producto

#### Paso 5: Especificaciones Técnicas

**Panel Derecho - Continuación**

**11. Dimensiones** (Opcional)
```
Ejemplo: 30x30cm
Ejemplo: 60x60x1.2cm
Ejemplo: 20x60cm
```
- Alto x Ancho x Espesor
- Incluye unidad de medida

**12. Material** (Opcional)
```
Ejemplo: Vidrio veneciano
Ejemplo: Porcelanato esmaltado
Ejemplo: Cerámica
Ejemplo: Gres porcelánico
```

**13. Acabado/Terminación** (Opcional)
```
Ejemplo: Brillante
Ejemplo: Mate
Ejemplo: Satinado
Ejemplo: Rústico
Ejemplo: Pulido
```

**14. Color** (Opcional)
```
Ejemplo: Azul Cobalto
Ejemplo: Gris Cemento
Ejemplo: Blanco Hueso
Ejemplo: Multicolor
```

#### Paso 6: Opciones de Visualización

**Panel Derecho - "Opciones"**

**15. Producto Activo**
```
☑ Marcado = El producto es visible en la tienda
☐ Desmarcado = El producto está oculto
```
- ✅ Marca para que se vea en la web
- Útil para ocultar productos temporalmente

**16. Producto Destacado**
```
☑ Marcado = Aparece en la sección de destacados
☐ Desmarcado = Producto normal
```
- Los productos destacados aparecen en la página principal
- Úsalo para promocionar productos especiales

#### Paso 7: Imágenes del Producto

**Panel Izquierdo - "Imágenes del Producto"**

Las imágenes son **FUNDAMENTALES** para vender productos.

**Recomendaciones:**

```
Formato: JPG, PNG, WEBP
Tamaño máximo por imagen: 5MB
Tamaño recomendado: 1200x1200 píxeles mínimo
Cantidad: 1-8 imágenes por producto
```

**Cómo subir imágenes:**

1. **Click en "Subir Imagen"** o arrastra imágenes
2. **Espera** a que la imagen se suba (verás barra de progreso)
3. **Vista previa**: La imagen aparecerá en la galería
4. **Subir más imágenes**: Repite el proceso
5. **Ordenar**: Arrastra las imágenes para cambiar su orden
   - La primera imagen es la principal (portada)
6. **Eliminar**: Click en el ícono de basura para borrar una imagen

**Buenas prácticas para imágenes:**

✅ **Primera imagen** (Portada):
- Vista general del producto
- Fondo neutro (blanco o gris claro)
- Producto centrado
- Buena iluminación

✅ **Siguientes imágenes**:
- Detalles y texturas
- Diferentes ángulos
- Producto instalado (si es posible)
- Comparación de tamaño
- Variaciones de color

❌ **Evitar**:
- Imágenes borrosas
- Mala iluminación
- Imágenes muy pesadas (más de 5MB)
- Marcas de agua intrusivas

#### Paso 8: Guardar el Producto

1. **Revisa toda la información**
2. **Verifica** que al menos tengas:
   - ✅ SKU
   - ✅ Nombre
   - ✅ Precio
   - ✅ Stock
   - ✅ Al menos 1 imagen (recomendado)
3. **Click en "Crear Producto"**
4. **Espera** mientras se guarda
   - Si hay imágenes, se vincularán automáticamente
5. **Verás mensaje**: "Producto creado exitosamente"
6. **Serás redirigido** a la lista de productos

---

### 📸 SUBIR IMÁGENES DE PRODUCTO

#### Durante la Creación del Producto

**Método 1: Drag & Drop (Arrastrar y Soltar)**
1. Arrastra la imagen desde tu explorador de archivos
2. Suéltala en el área de "Imágenes del Producto"
3. La imagen se subirá automáticamente

**Método 2: Selector de Archivos**
1. Click en "Subir Imagen"
2. Selecciona una o múltiples imágenes
3. Click en "Abrir"
4. Las imágenes se subirán

#### Después de Crear el Producto

1. **Ve a "Productos"** en el menú lateral
2. **Busca el producto** y click en "Editar"
3. **En la sección "Imágenes"**, sube nuevas imágenes
4. **Click en "Guardar Cambios"**

#### Gestionar Imágenes Existentes

**Reordenar imágenes:**
- Arrastra y suelta las imágenes para cambiar su orden
- La primera imagen es la que aparece en las tarjetas de producto

**Eliminar imágenes:**
- Click en el ícono de **basura** sobre la imagen
- Confirma la eliminación
- La imagen se borra de Cloudinary

**Establecer imagen principal:**
- Arrastra la imagen que quieres como principal a la primera posición

---

### ✏️ EDITAR PRODUCTO

#### Paso 1: Buscar el Producto

1. Ve a **"Productos"** en el menú lateral
2. Usa el **buscador** o navega por la lista
3. Click en el **ícono de lápiz (Editar)** o en el nombre del producto

#### Paso 2: Modificar Información

- Edita cualquier campo que necesites
- Puedes cambiar:
  - Información básica
  - Precios
  - Stock
  - Categoría
  - Especificaciones
  - Imágenes
  - Estado (activo/destacado)

#### Paso 3: Guardar Cambios

1. Click en **"Guardar Cambios"** o **"Actualizar Producto"**
2. Verás mensaje de confirmación
3. Los cambios se reflejarán inmediatamente en la web

---

### 🗑️ ELIMINAR PRODUCTO

⚠️ **ADVERTENCIA**: Eliminar un producto es permanente.

#### Cuándo Eliminar

- Producto discontinuado
- Producto duplicado por error
- Producto que ya no se vende

#### Alternativa: Desactivar

**En lugar de eliminar**, considera:
- Desmarcar "Producto Activo"
- El producto se oculta pero conservas la información
- Puedes reactivarlo en el futuro

#### Cómo Eliminar

1. Ve a **"Productos"**
2. Busca el producto
3. Click en el **ícono de basura (Eliminar)**
4. **Confirma la eliminación** en el diálogo
5. El producto y sus imágenes serán eliminados

---

## 💡 BUENAS PRÁCTICAS

### Para Categorías

✅ **Organización Lógica**
```
Crea una estructura clara y lógica
Ejemplo:

Mosaicos (Principal)
  ├─ Mosaicos Venecianos (Subcategoría)
  ├─ Mosaicos de Vidrio (Subcategoría)
  └─ Mosaicos Cerámicos (Subcategoría)

Porcelanatos (Principal)
  ├─ Porcelanatos Esmaltados (Subcategoría)
  └─ Porcelanatos Pulidos (Subcategoría)
```

✅ **Nombres Claros**
- Usa nombres descriptivos
- Evita abreviaturas confusas
- Piensa en cómo buscaría el cliente

✅ **Imágenes Representativas**
- Usa imágenes que representen la categoría
- Tamaño mínimo: 800x600px
- Fondo neutro

✅ **Descripciones SEO**
- Incluye palabras clave relevantes
- 50-200 caracteres
- Describe qué encontrará el cliente

❌ **Evitar**
- Demasiadas categorías principales (máx. 10-15)
- Nombres ambiguos
- Subcategorías de subcategorías (máx. 2 niveles)

### Para Productos

✅ **Información Completa**
```
Completa TODOS los campos posibles:
☑ SKU único
☑ Nombre descriptivo
☑ Descripción corta
☑ Descripción detallada
☑ Precio
☑ Stock actualizado
☑ Categoría correcta
☑ Dimensiones
☑ Material
☑ Acabado
☑ Color
☑ Mínimo 3 imágenes de calidad
```

✅ **SKU Consistente**
```
Usa un sistema de SKU consistente:

Formato sugerido: TIPO-SUBTIPO-###

Ejemplos:
MSC-VEN-001 (Mosaico Veneciano 001)
MSC-VEN-002 (Mosaico Veneciano 002)
POR-ESM-001 (Porcelanato Esmaltado 001)
REV-BAÑ-001 (Revestimiento Baño 001)
```

✅ **Nombres Descriptivos**
```
Incluye:
- Tipo de producto
- Características principales
- Medidas

Ejemplo:
"Mosaico Veneciano Azul Cobalto 30x30cm"
mejor que
"Mosaico Azul"
```

✅ **Precios Competitivos**
- Investiga precios de la competencia
- Actualiza regularmente
- Usa "Precio Comparado" para mostrar descuentos

✅ **Stock Realista**
- Mantén el stock actualizado
- Establece un umbral de stock bajo apropiado
- Actualiza cuando recibas mercancía

✅ **Imágenes Profesionales**
```
Mínimo 3 imágenes por producto:
1. Vista general (portada)
2. Detalle/textura
3. Producto instalado o en uso

Ideal 5-8 imágenes:
1. Vista frontal
2. Vista de detalle
3. Vista de textura
4. Producto instalado
5. Comparación de tamaño
6-8. Otras vistas o variantes
```

✅ **Categorización Correcta**
- Asigna siempre una categoría
- Usa la subcategoría más específica posible
- Si es necesario, crea nuevas categorías

✅ **Producto Activo/Destacado**
```
Producto Activo: Siempre marcado (a menos que esté agotado)
Producto Destacado: Solo 10-20 productos máximo
```

❌ **Evitar**
- SKU duplicados
- Información incompleta
- Imágenes de mala calidad
- Precios incorrectos
- Stock desactualizado
- Productos sin categoría
- Demasiados productos destacados

### Flujo de Trabajo Recomendado

#### Para Nuevos Productos

1. **Preparación**
   - Toma fotos de calidad
   - Recopila especificaciones técnicas
   - Define precio y stock

2. **Verificación de Categorías**
   - ¿Existe la categoría apropiada?
   - Si no, créala primero

3. **Creación del Producto**
   - Completa todos los campos
   - Sube todas las imágenes
   - Revisa antes de guardar

4. **Verificación Post-Creación**
   - Ve a la web pública
   - Verifica que se vea correctamente
   - Prueba el proceso de compra

#### Para Actualización de Stock

1. **Inventario regular** (semanal o diario)
2. **Actualiza cantidades** en cada producto
3. **Desactiva productos agotados** (si no volverán)
4. **Reactiva productos** cuando llegue nuevo stock

#### Para Promociones

1. **Identifica productos** a promocionar
2. **Actualiza "Precio Comparado"** con el precio anterior
3. **Reduce el "Precio"** al precio promocional
4. **Marca "Producto Destacado"** si quieres que aparezca en home
5. **Al finalizar**: Revierte los cambios

---

## 🔧 RESOLUCIÓN DE PROBLEMAS

### Problemas Comunes con Categorías

#### ❌ "No puedo eliminar una categoría"

**Causa**: La categoría tiene productos o subcategorías asociadas

**Solución**:
1. Mueve los productos a otra categoría
2. Elimina o mueve las subcategorías
3. Intenta eliminar nuevamente

---

#### ❌ "La categoría no aparece en la web"

**Causa**: La categoría no está activa

**Solución**:
1. Ve a editar la categoría
2. Marca ☑ "Categoría activa"
3. Guarda cambios

---

#### ❌ "La imagen de la categoría no se sube"

**Causas posibles**:
- Imagen muy grande (más de 5MB)
- Formato no soportado
- Problema de conexión

**Solución**:
1. Verifica el tamaño del archivo
2. Usa JPG o PNG
3. Comprime la imagen si es muy grande
4. Intenta nuevamente

---

### Problemas Comunes con Productos

#### ❌ "Error: SKU duplicado"

**Causa**: Ya existe un producto con ese SKU

**Solución**:
1. Genera un nuevo SKU automáticamente
2. O modifica el SKU manualmente
3. Verifica que sea único

---

#### ❌ "El producto no aparece en la web"

**Causas posibles**:
- Producto no activo
- Stock en 0
- No tiene categoría
- No tiene imágenes

**Solución**:
1. Verifica que "Producto Activo" esté marcado
2. Verifica que el stock sea mayor a 0
3. Asigna una categoría
4. Sube al menos 1 imagen

---

#### ❌ "Las imágenes no se suben"

**Causas posibles**:
- Imagen muy grande
- Formato no soportado
- Problema de conexión con Cloudinary
- Límite de imágenes alcanzado

**Solución**:
1. Verifica tamaño (máx. 5MB por imagen)
2. Usa JPG, PNG o WEBP
3. Comprime las imágenes si es necesario
4. Sube de a una imagen por vez
5. Espera a que cada imagen termine de subir

---

#### ❌ "Error al guardar el producto"

**Causas posibles**:
- Campos obligatorios vacíos
- Formato de precio incorrecto
- Problema de conexión

**Solución**:
1. Verifica que todos los campos obligatorios (*) estén completos:
   - SKU
   - Nombre
   - Precio
   - Stock
   - Umbral de stock bajo
2. Verifica formato del precio (solo números y punto)
3. Revisa la consola del navegador (F12) para ver error específico
4. Intenta nuevamente

---

#### ❌ "No encuentro la categoría en el desplegable"

**Causa**: La categoría no existe o no está creada

**Solución**:
1. Ve a "Categorías"
2. Crea la categoría primero
3. Vuelve a crear/editar el producto
4. Selecciona la categoría nueva

---

## ❓ PREGUNTAS FRECUENTES

### Categorías

**P: ¿Cuántas categorías puedo crear?**
R: No hay límite, pero recomendamos 10-15 categorías principales máximo para mantener la web organizada.

**P: ¿Puedo convertir una categoría principal en subcategoría?**
R: Sí, edita la categoría y selecciona una categoría padre.

**P: ¿Puedo tener subcategorías de subcategorías?**
R: Técnicamente sí, pero no es recomendable. Mantén máximo 2 niveles (principal → subcategoría).

**P: ¿Qué pasa si elimino una categoría con productos?**
R: Los productos quedarán sin categoría. Debes reasignarlos manualmente.

**P: ¿Las categorías afectan al SEO?**
R: Sí, los nombres y descripciones de categorías ayudan al posicionamiento web.

---

### Productos

**P: ¿Cuántos productos puedo crear?**
R: No hay límite técnico. Puedes crear miles de productos.

**P: ¿Puedo duplicar un producto?**
R: Actualmente no hay función de duplicar, pero puedes crear uno nuevo copiando la información manualmente.

**P: ¿Qué pasa si pongo stock en 0?**
R: El producto aparecerá como "Sin stock" pero seguirá visible (si está activo).

**P: ¿Puedo asignar un producto a múltiples categorías?**
R: No, cada producto pertenece a una sola categoría. Elige la más específica.

**P: ¿Las imágenes se comprimen automáticamente?**
R: Cloudinary optimiza las imágenes automáticamente para la web.

**P: ¿Cuántas imágenes puedo subir por producto?**
R: Puedes subir hasta 8 imágenes por producto (recomendado: 3-5).

**P: ¿Qué formato de imagen es mejor?**
R: JPG para fotografías, PNG para gráficos con transparencia, WEBP es el más moderno y liviano.

**P: ¿Puedo editar múltiples productos a la vez?**
R: No, debes editar cada producto individualmente.

**P: ¿Cómo destaco un producto en la página principal?**
R: Marca ☑ "Producto Destacado" al crear o editar el producto.

**P: ¿Qué es el "Precio Comparado"?**
R: Es el precio anterior que se muestra tachado para mostrar el descuento.

---

### Imágenes

**P: ¿Dónde se guardan las imágenes?**
R: En Cloudinary (servicio en la nube).

**P: ¿Las imágenes se eliminan automáticamente al borrar un producto?**
R: Sí, las imágenes asociadas se eliminan de Cloudinary.

**P: ¿Puedo usar la misma imagen en varios productos?**
R: Cada imagen se sube por separado a cada producto.

**P: ¿Qué tamaño de imagen es recomendable?**
R: Mínimo 1200x1200 píxeles, máximo 5MB.

**P: ¿Puedo editar las imágenes después de subirlas?**
R: No, debes eliminarla y subir una nueva editada.

---

### General

**P: ¿Los cambios se reflejan inmediatamente en la web?**
R: Sí, al guardar un producto o categoría, los cambios son instantáneos.

**P: ¿Puedo previsualizar cómo se ve antes de publicar?**
R: Desmarca "Activo", guarda, ve a la web para verificar en modo admin, luego activa.

**P: ¿Hay forma de importar productos masivamente?**
R: Actualmente no, debes crearlos uno por uno desde el dashboard.

**P: ¿Puedo exportar la lista de productos?**
R: Actualmente no hay función de exportación desde el dashboard.

**P: ¿Cómo busco un producto específico?**
R: En la lista de productos, usa el buscador en la parte superior.

---

## 📞 SOPORTE

### ¿Necesitas Ayuda?

Si tienes problemas que no se resuelven con este manual:

**1. Revisa la consola del navegador**
```
Presiona F12 → Pestaña "Console"
Busca mensajes de error en rojo
```

**2. Verifica tu conexión a internet**
```
Las imágenes requieren buena conexión
```

**3. Intenta en otro navegador**
```
Prueba en Chrome, Firefox o Edge
```

**4. Limpia el cache del navegador**
```
Ctrl + Shift + Del → Limpiar cache
```

**5. Contacta al administrador del sistema**
```
Email: contacto@aguamarinamosaicos.com
```

---

## ✅ CHECKLIST RÁPIDA

### Antes de Crear Categoría

- [ ] Tengo un nombre claro
- [ ] Tengo una imagen representativa
- [ ] Sé si es principal o subcategoría
- [ ] Tengo una descripción breve

### Antes de Crear Producto

- [ ] Tengo el nombre del producto
- [ ] Tengo el precio definido
- [ ] Sé el stock disponible
- [ ] Tengo al menos 3 fotos de calidad
- [ ] La categoría apropiada ya existe
- [ ] Tengo las especificaciones técnicas (dimensiones, material, etc.)
- [ ] Tengo descripción corta y detallada

### Después de Crear Producto

- [ ] Verifiqué que se vea en la web
- [ ] Las imágenes se ven correctamente
- [ ] El precio es correcto
- [ ] El stock es correcto
- [ ] La categoría es la correcta
- [ ] El producto está activo

---

## 📚 GLOSARIO

**Admin Dashboard**: Panel de administración donde gestionas categorías y productos.

**Categoría**: Agrupación de productos similar (ej: Mosaicos, Porcelanatos).

**Subcategoría**: Categoría hija dentro de una categoría principal.

**SKU**: Stock Keeping Unit - Código único que identifica cada producto.

**Slug**: Parte de la URL amigable del producto o categoría.

**Stock**: Cantidad de unidades disponibles de un producto.

**Umbral de Stock Bajo**: Cantidad mínima antes de recibir alerta.

**Producto Activo**: Producto visible en la tienda online.

**Producto Destacado**: Producto que aparece en la sección de destacados de la homepage.

**Cloudinary**: Servicio en la nube donde se almacenan las imágenes.

**Precio Comparado**: Precio anterior o de lista que se muestra tachado.

---

**FIN DEL MANUAL**

---

**Última actualización**: Noviembre 2025
**Versión**: 1.0
**Documento creado para**: Aguamarina Mosaicos Admin Dashboard

---

## 💡 TIPS FINALES

1. **Organización es clave**: Tómate tiempo para planificar tu estructura de categorías antes de empezar.

2. **Imágenes de calidad**: Invierten en buenas fotos de productos. Es lo que más impacta en las ventas.

3. **Información completa**: Cuanta más información proporciones, mejor. Los clientes quieren detalles.

4. **Actualización regular**: Revisa y actualiza stock al menos semanalmente.

5. **Prueba como usuario**: Regularmente ve a la web pública y navega como lo haría un cliente.

6. **Backup mental**: Antes de eliminar algo importante, piénsalo dos veces.

7. **Consistencia**: Mantén un estilo consistente en nombres, descripciones y fotos.

8. **SEO-friendly**: Usa palabras clave relevantes en nombres y descripciones.

¡Éxito gestionando tu tienda de Aguamarina Mosaicos! 🎉
