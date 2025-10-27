# Guía de Configuración de Subdominio para Admin Dashboard

Esta guía te ayudará a configurar `admin.aguamarinamosaicos.com` para acceder al dashboard administrativo de forma profesional y segura.

---

## 🎯 Objetivo

Configurar el subdominio `admin.aguamarinamosaicos.com` que apunte al admin-dashboard desplegado en Vercel, manteniendo una separación clara entre el sitio público y la administración.

**Resultado final:**
- Sitio público: `https://aguamarinamosaicos.com`
- Admin dashboard: `https://admin.aguamarinamosaicos.com`

---

## 📋 Pasos de Configuración

### Paso 1: Configurar el Subdominio en Vercel

1. **Ve al proyecto admin-dashboard en Vercel:**
   - Dashboard de Vercel → Selecciona el proyecto `acuamarina-ceramica-rbqj`
   - O visita directamente: https://vercel.com/dashboard

2. **Agregar el dominio personalizado:**
   - Click en **Settings** (Configuración)
   - Click en **Domains** (Dominios)
   - Click en **Add** (Agregar)
   - Ingresa: `admin.aguamarinamosaicos.com`
   - Click en **Add** (Agregar)

3. **Vercel te mostrará la configuración DNS necesaria:**
   ```
   Type: CNAME
   Name: admin
   Value: cname.vercel-dns.com
   ```

---

### Paso 2: Configurar DNS en tu Proveedor de Dominio

Ahora necesitas configurar el DNS donde compraste `aguamarinamosaicos.com`. Los pasos varían según tu proveedor:

#### Proveedores Comunes:

<details>
<summary><b>GoDaddy</b></summary>

1. Inicia sesión en GoDaddy
2. Ve a **Mis Productos** → **Dominios**
3. Click en tu dominio `aguamarinamosaicos.com`
4. Click en **DNS** o **Administrar DNS**
5. Busca la sección **Registros**
6. Click en **Agregar** → **CNAME**
7. Configura:
   - **Host/Nombre:** `admin`
   - **Apunta a/Valor:** `cname.vercel-dns.com`
   - **TTL:** 600 segundos (o el predeterminado)
8. Click en **Guardar**

</details>

<details>
<summary><b>Namecheap</b></summary>

1. Inicia sesión en Namecheap
2. Ve a **Domain List** → Click en **Manage** junto a tu dominio
3. Click en **Advanced DNS**
4. En **Host Records**, click en **Add New Record**
5. Configura:
   - **Type:** CNAME Record
   - **Host:** `admin`
   - **Value/Target:** `cname.vercel-dns.com`
   - **TTL:** Automatic
6. Click en el check verde para guardar

</details>

<details>
<summary><b>Cloudflare</b></summary>

1. Inicia sesión en Cloudflare
2. Selecciona tu dominio `aguamarinamosaicos.com`
3. Ve a **DNS** en el menú lateral
4. Click en **Add record**
5. Configura:
   - **Type:** CNAME
   - **Name:** `admin`
   - **Target:** `cname.vercel-dns.com`
   - **Proxy status:** DNS only (nube gris, NO naranja)
   - **TTL:** Auto
6. Click en **Save**

**Importante en Cloudflare:** Asegúrate de que el proxy esté desactivado (nube gris) o podría interferir con la configuración de SSL de Vercel.

</details>

<details>
<summary><b>Google Domains</b></summary>

1. Inicia sesión en Google Domains
2. Click en tu dominio
3. Ve a **DNS** en el menú lateral
4. Scroll hasta **Custom resource records**
5. Configura:
   - **Name:** `admin`
   - **Type:** CNAME
   - **TTL:** 1H (o predeterminado)
   - **Data:** `cname.vercel-dns.com`
6. Click en **Add**

</details>

<details>
<summary><b>Otros proveedores</b></summary>

Busca la sección de **DNS Management**, **DNS Settings** o **Zona DNS** y agrega un registro CNAME:

```
Type: CNAME
Host/Name/Alias: admin
Target/Value/Points to: cname.vercel-dns.com
TTL: 600 o Auto
```

</details>

---

### Paso 3: Verificar la Configuración DNS

**Tiempo de propagación:** 5 minutos a 48 horas (normalmente 10-30 minutos)

**Verificar en terminal/cmd:**

```bash
# Windows (CMD o PowerShell)
nslookup admin.aguamarinamosaicos.com

# Mac/Linux
dig admin.aguamarinamosaicos.com
```

**Verificar online:**
- https://dnschecker.org/#CNAME/admin.aguamarinamosaicos.com

Deberías ver que `admin.aguamarinamosaicos.com` apunta a `cname.vercel-dns.com`

---

### Paso 4: Configurar SSL/HTTPS en Vercel

Vercel configurará automáticamente el certificado SSL cuando el DNS esté propagado.

1. **Ve a Vercel → Tu proyecto → Settings → Domains**
2. Espera a que aparezca el ✅ verde junto a `admin.aguamarinamosaicos.com`
3. Vercel emitirá un certificado SSL automáticamente (Let's Encrypt)

**Estado del dominio:**
- ⏳ **Pendiente:** Esperando propagación DNS
- ✅ **Activo:** Dominio configurado correctamente con SSL

---

### Paso 5: Actualizar Variables de Entorno

#### 5.1 Actualizar CORS en Railway (Backend)

1. **Ve a Railway → Tu proyecto → Variables**
2. **Edita `CORS_ORIGINS` y agrega el nuevo subdominio:**

```bash
CORS_ORIGINS=https://aguamarinamosaicos.com,https://www.aguamarinamosaicos.com,https://admin.aguamarinamosaicos.com,https://acuamarina-ceramica-rbqj.vercel.app,https://acuamarina-ceramica-rbqj-git-main-rene-kuhms-projects.vercel.app,https://acuamarina-ceramica-rbqj-nti3upu1s-rene-kuhms-projects.vercel.app
```

3. **Guarda** - Railway redesplegará automáticamente

#### 5.2 Actualizar Variable en Vercel (Admin Dashboard)

1. **Ve a Vercel → Proyecto admin-dashboard → Settings → Environment Variables**
2. **Actualiza `NEXT_PUBLIC_SITE_URL`:**

```bash
NEXT_PUBLIC_SITE_URL=https://admin.aguamarinamosaicos.com
```

3. **Guarda y redespliega:**
   - Ve a **Deployments**
   - Click en el último deployment
   - Click en los tres puntos **⋮** → **Redeploy**

---

### Paso 6: Verificación Final

Una vez que el DNS esté propagado y Vercel haya configurado el SSL:

1. **Accede a:** `https://admin.aguamarinamosaicos.com`
2. **Verifica:**
   - ✅ El sitio carga correctamente
   - ✅ No hay errores de SSL (candado verde en el navegador)
   - ✅ El login funciona
   - ✅ Puede conectarse al backend en Railway
   - ✅ No hay errores CORS en la consola del navegador

3. **Prueba el flujo completo:**
   - Login en `admin.aguamarinamosaicos.com`
   - Navegar al dashboard
   - Cargar productos, órdenes, etc.
   - Verificar que todas las llamadas al backend funcionen

---

## 🔍 Solución de Problemas

### Error: "DNS_PROBE_FINISHED_NXDOMAIN"

**Causa:** El DNS aún no se ha propagado o está mal configurado.

**Solución:**
1. Verifica que el registro CNAME esté correcto
2. Espera más tiempo (hasta 48 horas máximo)
3. Limpia caché DNS local:
   ```bash
   # Windows
   ipconfig /flushdns

   # Mac
   sudo dscacheutil -flushcache; sudo killall -HUP mDNSResponder

   # Linux
   sudo systemd-resolve --flush-caches
   ```

### Error: "ERR_CERT_COMMON_NAME_INVALID" o "SSL Error"

**Causa:** Vercel aún no ha emitido el certificado SSL.

**Solución:**
1. Verifica que el DNS esté propagado
2. Espera unos minutos más
3. En Vercel → Domains, verifica el estado
4. Si persiste después de 1 hora, elimina y vuelve a agregar el dominio en Vercel

### Error: "Not allowed by CORS"

**Causa:** El subdominio no está en la lista de CORS del backend.

**Solución:**
1. Verifica que `https://admin.aguamarinamosaicos.com` esté en `CORS_ORIGINS` en Railway
2. Asegúrate de que Railway se haya redesplegado después de actualizar la variable
3. Verifica los logs de Railway para ver qué origen está bloqueando

### El login redirige a la URL antigua de Vercel

**Causa:** `NEXT_PUBLIC_SITE_URL` no está actualizada.

**Solución:**
1. Actualiza `NEXT_PUBLIC_SITE_URL` en Vercel
2. **IMPORTANTE:** Redespliega manualmente - las variables no se actualizan hasta el próximo deploy

---

## 📊 Comparación: Antes vs Después

| Aspecto | Antes | Después |
|---------|-------|---------|
| **URL Pública** | aguamarinamosaicos.com | aguamarinamosaicos.com |
| **URL Admin** | acuamarina-ceramica-rbqj.vercel.app | admin.aguamarinamosaicos.com |
| **Profesionalismo** | ⭐⭐⭐ | ⭐⭐⭐⭐⭐ |
| **Seguridad** | Buena | Excelente |
| **Mantenibilidad** | Buena | Excelente |
| **Separación de concerns** | Clara | Muy clara |

---

## 🎯 Ventajas del Subdominio

✅ **Profesional:** URLs limpias y fáciles de recordar
✅ **Seguro:** Puedes aplicar reglas de seguridad diferentes
✅ **Escalable:** Fácil agregar más subdominios (ej: api.aguamarinamosaicos.com)
✅ **Independiente:** Deployments completamente separados
✅ **SEO-friendly:** No afecta el SEO del sitio principal
✅ **Cookies:** Dominio separado para sesiones de admin

---

## 📝 Checklist de Implementación

- [ ] Agregar dominio en Vercel (admin-dashboard project)
- [ ] Configurar registro CNAME en proveedor DNS
- [ ] Esperar propagación DNS (verificar con dnschecker.org)
- [ ] Verificar que Vercel emitió certificado SSL
- [ ] Actualizar CORS_ORIGINS en Railway
- [ ] Actualizar NEXT_PUBLIC_SITE_URL en Vercel
- [ ] Redeplegar admin-dashboard en Vercel
- [ ] Probar acceso a https://admin.aguamarinamosaicos.com
- [ ] Verificar login y funcionalidad completa
- [ ] Verificar conexión al backend (sin errores CORS)
- [ ] Actualizar bookmarks/favoritos al nuevo dominio
- [ ] Comunicar nueva URL al equipo

---

## 📞 Soporte

Si encuentras problemas durante la configuración:

1. **Vercel Support:** https://vercel.com/support
2. **Railway Support:** https://railway.app/help
3. **DNS Propagation Check:** https://dnschecker.org
4. **SSL Check:** https://www.ssllabs.com/ssltest/

---

## 🔐 Configuración de Seguridad Adicional (Opcional)

### Restringir acceso al dominio antiguo

Una vez que el subdominio esté funcionando, puedes redirigir el dominio antiguo:

**En el proyecto admin-dashboard en Vercel:**

Settings → Domains → `acuamarina-ceramica-rbqj.vercel.app` → Set as Redirect to `admin.aguamarinamosaicos.com`

Esto redirigirá automáticamente cualquier acceso al dominio antiguo al nuevo subdominio.

---

**Última actualización:** 2025-01-27
**Versión:** 1.0
