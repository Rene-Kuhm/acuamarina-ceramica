# Configuración del Código QR para Producción

## 📋 Descripción

El código QR permite a los usuarios acceder al catálogo completo de productos escaneándolo con su teléfono móvil. Esta guía explica cómo configurarlo para que funcione correctamente en producción.

---

## 🚀 Configuración en Vercel

### 1. Obtener la URL de tu proyecto en Vercel

Después de desplegar tu frontend en Vercel, tendrás una URL similar a:
- `https://tu-proyecto.vercel.app`
- o un dominio personalizado como `https://aguamarina-mosaicos.com`

### 2. Configurar Variables de Entorno en Vercel

1. Ve a tu proyecto en Vercel: [vercel.com/dashboard](https://vercel.com/dashboard)
2. Selecciona tu proyecto del frontend
3. Ve a **Settings → Environment Variables**
4. Agrega las siguientes variables:

```env
NEXT_PUBLIC_API_URL=https://diligent-upliftment-production-54de.up.railway.app/api/v1
NEXT_PUBLIC_SITE_URL=https://tu-proyecto.vercel.app
NEXT_PUBLIC_SUPABASE_URL=https://umyrvlzhvdsibpzvfnal.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVteXJ2bHpodmRzaWJwenZmbmFsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjAyOTUwMzIsImV4cCI6MjA3NTg3MTAzMn0.2BbeYqIrwlN3kp0lU_XULYkfMAFZb3HTlxYUnAT6mIw
```

**IMPORTANTE:** Reemplaza `https://tu-proyecto.vercel.app` con tu URL real de Vercel.

5. Selecciona los ambientes donde se aplicarán (Production, Preview, Development)
6. Guarda los cambios
7. **Redesplega** el proyecto: Ve a Deployments → Latest → ⋯ → Redeploy

---

## 🔍 Verificar que el QR Funciona

### Opción 1: Verificar visualmente en la página

1. Abre tu sitio en producción: `https://tu-proyecto.vercel.app`
2. Ve a la página de inicio
3. Busca la sección "Catálogo Móvil"
4. Deberías ver el código QR generado

### Opción 2: Escanear con tu móvil

1. Abre la cámara de tu teléfono (iOS) o una app de escáner QR (Android)
2. Apunta la cámara al código QR en la pantalla
3. Deberías ver una notificación para abrir: `https://tu-proyecto.vercel.app/productos`
4. Al tocar, debería llevarte a la página de productos

### Opción 3: Verificar en el navegador

1. Abre la consola del navegador (F12)
2. Ve a la pestaña "Console"
3. Deberías ver el mensaje: `QR Code URL: https://tu-proyecto.vercel.app/productos`
4. Verifica que la URL sea correcta

---

## 🛠️ Solución de Problemas

### El QR no aparece

**Causa:** El componente no se está renderizando

**Solución:**
1. Verifica que la variable `NEXT_PUBLIC_SITE_URL` esté configurada en Vercel
2. Redesplega el proyecto
3. Limpia la caché del navegador (Ctrl + Shift + R)

### El QR apunta a localhost

**Causa:** La variable de entorno no está configurada correctamente

**Solución:**
1. Ve a Vercel → Settings → Environment Variables
2. Verifica que `NEXT_PUBLIC_SITE_URL` tenga tu URL de producción
3. Asegúrate de que la variable esté aplicada al ambiente "Production"
4. Redesplega el proyecto

### El QR no escanea / no funciona

**Causas posibles:**
1. El QR está muy pequeño o pixelado
2. La URL está mal formada
3. El navegador bloqueó el acceso

**Soluciones:**
1. Descarga el QR como PNG usando el botón "Descargar QR"
2. Verifica la URL en la consola del navegador
3. Prueba con diferentes apps de escaneo QR

### Error al descargar el QR

**Causa:** Problema con el navegador o CORS

**Solución:**
1. Prueba en un navegador diferente (Chrome, Firefox, Safari)
2. Verifica que no haya bloqueadores de popups activos
3. Prueba hacer screenshot del QR como alternativa

---

## 📱 Uso del QR

### Para clientes

El código QR permite a tus clientes:
1. **Acceso rápido:** Escanear y acceder al catálogo sin escribir URLs
2. **Compartir fácilmente:** Tomar foto del QR y compartir con amigos
3. **Uso offline:** Descargar el QR e imprimirlo en material promocional

### Para tu negocio

Puedes usar el QR en:
1. **Material impreso:** Volantes, tarjetas de presentación, folletos
2. **Punto de venta:** Cartel en tu tienda física
3. **Redes sociales:** Post con el QR para acceso directo
4. **Embalaje:** Imprimir en cajas o bolsas de productos
5. **Publicidad:** Vallas, banners, anuncios

---

## 📥 Descargar el QR

### Desde la página web

1. Ve a la sección "Catálogo Móvil" en la página de inicio
2. Haz clic en el botón "Descargar QR"
3. Se descargará como `catalogo-aguamarina-qr.png`
4. Ya puedes usarlo en material impreso o digital

### Personalización del QR (Opcional)

Si quieres personalizar el QR con tu logo:

1. Agrega tu logo en `/public/logo.png` (40x40 píxeles recomendado)
2. El componente QR automáticamente lo incrustará en el centro
3. Si no existe el logo, el QR se generará sin él (funciona igual)

---

## 🎨 Características del QR

- **Color personalizado:** Cyan (#0891b2) que coincide con tu marca
- **Alta calidad:** Nivel de corrección de errores "H" (30% de redundancia)
- **Logo integrado:** Opción de agregar logo en el centro (40x40px)
- **Descargable:** Formato PNG de alta calidad
- **Responsive:** Se adapta a todos los dispositivos
- **SEO friendly:** URLs amigables para motores de búsqueda

---

## 🔄 Actualizar la URL del QR

Si cambias tu dominio o la URL de producción:

1. Ve a Vercel → Settings → Environment Variables
2. Edita `NEXT_PUBLIC_SITE_URL` con la nueva URL
3. Guarda los cambios
4. Redesplega el proyecto
5. El QR se actualizará automáticamente con la nueva URL

---

## ✅ Checklist de Producción

Antes de lanzar a producción, verifica:

- [ ] Variable `NEXT_PUBLIC_SITE_URL` configurada en Vercel
- [ ] Variable apunta a tu URL real de producción (no localhost)
- [ ] Variable aplicada al ambiente "Production"
- [ ] Proyecto redesplegado después de configurar variables
- [ ] QR visible en la página de inicio
- [ ] QR escaneado y probado con móvil
- [ ] URL del QR apunta a `/productos` correctamente
- [ ] Botón de descarga funciona correctamente
- [ ] QR descargado es de buena calidad

---

## 📞 Soporte

Si tienes problemas:

1. Revisa los logs de Vercel: Dashboard → Deployments → Latest → View Function Logs
2. Verifica las variables de entorno en Settings
3. Prueba en modo incógnito para descartar problemas de caché
4. Consulta la documentación de Next.js sobre [Environment Variables](https://nextjs.org/docs/basic-features/environment-variables)

---

**¡Tu código QR está listo para producción!** 🎉
