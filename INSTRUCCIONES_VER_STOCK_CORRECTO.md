# Instrucciones: Cómo Ver el Stock Correctamente

**Fecha:** 23 de Octubre, 2025
**Problema:** Los productos muestran "sin stock" (badge rojo) cuando en realidad sí tienen stock

## ✅ SOLUCIÓN IMPLEMENTADA

El código ya está corregido y desplegado. Para ver los cambios correctamente:

## 🔄 Paso 1: Esperar el Despliegue de Vercel

Vercel está desplegando automáticamente los cambios. Esto toma **1-3 minutos**.

**Cómo verificar que ya desplegó:**
1. Ve a: https://github.com/Rene-Kuhm/acuamarina-ceramica/commits/main
2. Busca el commit más reciente: `7ab3bb3 - chore: Force Vercel redeploy`
3. Debe aparecer un ✅ verde (significa que Vercel terminó de desplegar)

## 🧹 Paso 2: Limpiar Caché del Navegador

**Opción A: Hard Refresh (Recomendado)**

1. Ve a: https://acuamarina-ceramica-rbqj.vercel.app/dashboard/products
2. Presiona las siguientes teclas según tu sistema operativo:

   **Windows/Linux:**
   ```
   Ctrl + Shift + R
   ```
   o
   ```
   Ctrl + F5
   ```

   **Mac:**
   ```
   Cmd + Shift + R
   ```
   o
   ```
   Shift + Click en el botón Recargar
   ```

3. Espera a que la página cargue completamente

**Opción B: Limpiar Caché Completo (Si el Hard Refresh no funciona)**

**Chrome/Edge:**
1. Presiona `Ctrl + Shift + Delete` (Windows) o `Cmd + Shift + Delete` (Mac)
2. Selecciona "Todo el tiempo" en rango de tiempo
3. Marca solo "Imágenes y archivos en caché"
4. Click "Borrar datos"
5. Cierra y abre el navegador
6. Vuelve a abrir el dashboard

**Firefox:**
1. Presiona `Ctrl + Shift + Delete`
2. Selecciona "Todo"
3. Marca solo "Caché"
4. Click "Borrar ahora"
5. Recarga la página

**Safari:**
1. Safari → Preferencias → Avanzado
2. Marca "Mostrar menú Desarrollo en la barra de menús"
3. Menú Desarrollo → Vaciar cachés
4. Recarga la página

## 🎨 Paso 3: Verificar los Nuevos Colores

Después de limpiar el caché, deberías ver el nuevo sistema de 3 colores:

### Sistema ACTUAL (Correcto) ✅

| Color Badge | Condición | Significado | Ejemplo |
|-------------|-----------|-------------|---------|
| 🔴 **ROJO** | `stock === 0` | **Sin stock** - Agotado | 0 unidades |
| 🟡 **AMARILLO** | `0 < stock ≤ umbral` | **Stock bajo** - Disponible pero necesita reorden | 5 de 10 unidades |
| 🟢 **VERDE** | `stock > umbral` | **Stock bueno** - Inventario suficiente | 15 de 10 unidades |

### ¿Qué Deberías Ver?

Para el producto actual **"HIERRO FUNDIDO"**:
- Stock actual: **5 unidades**
- Umbral: **10 unidades**
- Badge esperado: **🟡 AMARILLO** con el texto "5"
- Significado: **"Hay 5 unidades disponibles pero está por debajo del umbral de 10, necesita reabastecimiento pronto"**

## ❌ Sistema VIEJO (Incorrecto) - Lo que NO deberías ver

| Color Badge | Condición | Problema |
|-------------|-----------|----------|
| 🔴 **ROJO** | `stock ≤ umbral` | Mostraba ROJO para productos con stock bajo |
| ⚪ **GRIS** | `stock > umbral` | Solo 2 niveles, confuso |

Si sigues viendo este sistema viejo (ROJO/GRIS), significa que el caché no se limpió correctamente.

## 🔍 Paso 4: Verificación Visual

**Antes de limpiar caché (Sistema VIEJO):**
```
HIERRO FUNDIDO
Stock: 5
Badge: 🔴 ROJO "5"  ❌ Incorrecto - parece sin stock pero tiene 5 unidades
```

**Después de limpiar caché (Sistema NUEVO):**
```
HIERRO FUNDIDO
Stock: 5
Badge: 🟡 AMARILLO "5"  ✅ Correcto - tiene stock pero está bajo
```

## 🐛 Troubleshooting

### Problema: Sigo viendo badges ROJOS en productos con stock

**Solución:**

1. **Verifica que Vercel desplegó:**
   - Ve a: https://vercel.com/tu-usuario/admin-dashboard/deployments
   - El deployment más reciente debe estar "Ready" (verde)
   - Debe ser posterior a las 23:30 del 23 de octubre 2025

2. **Prueba en modo incógnito:**
   - Abre una ventana de incógnito/privada
   - Ve a: https://acuamarina-ceramica-rbqj.vercel.app/dashboard/products
   - Inicia sesión
   - Verifica los colores

3. **Prueba en otro navegador:**
   - Si usas Chrome, prueba en Firefox o Edge
   - Esto descarta problemas de caché específicos del navegador

4. **Inspecciona el código en el navegador:**
   - Click derecho en el badge → Inspeccionar
   - Busca las clases CSS del badge
   - Debe tener: `bg-amber-500` (amarillo) o `bg-green-500` (verde) o `bg-red-500` (rojo)
   - Si tiene `bg-red-500` pero el stock > 0, hay un problema

### Problema: El badge tiene el color correcto pero el número está mal

**Posible causa:** El API no está devolviendo el stockQuantity correcto

**Solución:**
1. Abre la consola del navegador (F12)
2. Ve a Network → Filtra por "products"
3. Click en la llamada GET a `/api/v1/products`
4. Ve a la pestaña Response
5. Busca el producto y verifica:
   ```json
   {
     "name": "HIERRO FUNDIDO",
     "stockQuantity": 5,  // ¿Es correcto?
     "lowStockThreshold": 10
   }
   ```

## 📊 Ejemplo Real del Producto Actual

Según los datos del API:

```json
{
  "name": "HIERRO FUNDIDO",
  "sku": "PROD-20251023-3081",
  "stockQuantity": 5,
  "lowStockThreshold": 10,
  "isActive": true
}
```

**Badge esperado:** 🟡 AMARILLO con "5"

**Razón:**
- Tiene stock (5 unidades) ✅
- Pero está por debajo del umbral (10) ⚠️
- Por lo tanto: AMARILLO = "Stock bajo pero disponible"

## 🎯 Resultado Esperado Final

Cuando todo esté correcto, verás:

1. **Productos sin inventario** → 🔴 Badge ROJO "0"
2. **Productos con poco inventario** → 🟡 Badge AMARILLO "X" (donde X ≤ umbral)
3. **Productos con buen inventario** → 🟢 Badge VERDE "X" (donde X > umbral)

## 📝 Notas Adicionales

### ¿Por qué AMARILLO y no ROJO?

El AMARILLO significa: **"Aún hay stock disponible para vender, pero deberías reordenar pronto"**

El ROJO significa: **"No hay stock, no se puede vender"**

Esta distinción es importante para:
- **Equipo de ventas:** Saben que pueden vender el producto
- **Equipo de inventario:** Saben que necesitan reordenar
- **Clientes:** Ven que el producto está disponible (no agotado)

### ¿Cómo ajustar el umbral?

Si quieres que un producto muestre VERDE con menos unidades:

1. Ve a editar el producto
2. Cambia "Umbral de Stock Bajo" (lowStockThreshold)
3. Ejemplo: Si cambias de 10 a 3, entonces:
   - 0 unidades → 🔴 ROJO
   - 1-3 unidades → 🟡 AMARILLO
   - 4+ unidades → 🟢 VERDE

## 📞 ¿Necesitas Ayuda?

Si después de seguir todos estos pasos sigues viendo badges rojos en productos con stock:

1. Toma una captura de pantalla del dashboard
2. Abre la consola del navegador (F12)
3. Busca errores en la pestaña Console
4. Reporta el issue con:
   - Captura de pantalla
   - Navegador y versión
   - Mensajes de error en consola
   - Nombre del producto que muestra incorrectamente

## ✅ Checklist Final

- [ ] Esperé 2-3 minutos para que Vercel desplegara
- [ ] Hice hard refresh (Ctrl+Shift+R)
- [ ] Limpié el caché del navegador
- [ ] Verifiqué en modo incógnito
- [ ] Verifiqué en otro navegador
- [ ] Los badges ahora muestran AMARILLO para productos con stock bajo
- [ ] Los badges solo muestran ROJO para productos con 0 unidades

---

**Última actualización:** 23 de Octubre, 2025 - 23:45
**Commit:** 7ab3bb3 - Force Vercel redeploy
**Estado:** ✅ Fix desplegado, esperando confirmación del usuario
