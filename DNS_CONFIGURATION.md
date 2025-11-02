# Configuración DNS para admin.aguamarinamosaicos.com

## ✅ Estado Actual

- ✅ Dominio agregado en Vercel
- ⏳ Pendiente: Configurar DNS
- ⏳ Pendiente: Verificación SSL

---

## 🎯 Configuración DNS Requerida

Vercel ha generado un registro CNAME específico para tu dominio:

```
Type: CNAME
Name: admin
Value: 5cc954b8b9b815fa.vercel-dns-017.com.
```

**⚠️ IMPORTANTE:** Usa el valor específico de Vercel (NO `cname.vercel-dns.com`)

---

## 📋 Pasos para Configurar DNS

### 1. Identifica tu Proveedor DNS

Necesitas saber dónde está configurado el DNS de `aguamarinamosaicos.com`.

**Verificar proveedor:**
- Ve a: https://lookup.icann.org/en/lookup
- Busca: `aguamarinamosaicos.com`
- Mira el campo "Registrar" para saber quién gestiona tu dominio

**Proveedores comunes:**
- GoDaddy
- Namecheap
- Google Domains
- Cloudflare
- DonWeb
- NIC Argentina

---

### 2. Agregar Registro CNAME

Ve al panel de DNS de tu proveedor y agrega:

#### 📌 GoDaddy

1. Inicia sesión en GoDaddy
2. **Mis Productos** → **Dominios**
3. Click en `aguamarinamosaicos.com`
4. **Configuración adicional** → **Administrar DNS**
5. En **Registros**, click **Agregar**
6. Selecciona **CNAME**
7. Configura:
   - **Nombre:** `admin`
   - **Valor:** `5cc954b8b9b815fa.vercel-dns-017.com.`
   - **TTL:** 600 segundos (o 1 hora)
8. Click **Guardar**

---

#### 📌 Namecheap

1. Inicia sesión en Namecheap
2. **Domain List** → Click **Manage** junto a tu dominio
3. **Advanced DNS**
4. En **Host Records**, click **Add New Record**
5. Configura:
   - **Type:** CNAME Record
   - **Host:** `admin`
   - **Value:** `5cc954b8b9b815fa.vercel-dns-017.com.`
   - **TTL:** Automatic
6. Click en el ✓ verde para guardar

---

#### 📌 Cloudflare

1. Inicia sesión en Cloudflare
2. Selecciona `aguamarinamosaicos.com`
3. Click en **DNS** (menú lateral)
4. Click **Add record**
5. Configura:
   - **Type:** CNAME
   - **Name:** `admin`
   - **Target:** `5cc954b8b9b815fa.vercel-dns-017.com`
   - **Proxy status:** **DNS only** (nube GRIS ☁️, NO naranja 🟧)
   - **TTL:** Auto
6. Click **Save**

**⚠️ MUY IMPORTANTE en Cloudflare:**
- La nube debe estar **GRIS** (DNS only)
- Si está NARANJA (Proxied), el SSL de Vercel NO funcionará
- Click en la nube naranja para cambiarla a gris

---

#### 📌 Google Domains

1. Inicia sesión en Google Domains
2. Click en tu dominio `aguamarinamosaicos.com`
3. **DNS** en el menú lateral
4. Scroll hasta **Custom resource records**
5. Configura:
   - **Name:** `admin`
   - **Type:** CNAME
   - **TTL:** 1H
   - **Data:** `5cc954b8b9b815fa.vercel-dns-017.com.`
6. Click **Add**

---

#### 📌 DonWeb / NIC Argentina

1. Inicia sesión en tu panel de control
2. Busca **Gestión de DNS** o **Zona DNS**
3. Agrega un nuevo registro:
   - **Tipo:** CNAME
   - **Nombre/Host:** `admin`
   - **Destino/Valor:** `5cc954b8b9b815fa.vercel-dns-017.com.`
   - **TTL:** 600 o el predeterminado
4. Guardar cambios

---

#### 📌 Otro Proveedor

Busca la sección de **DNS Management**, **DNS Records** o **Zona DNS** y agrega:

```
Type: CNAME
Host/Name: admin
Target/Value: 5cc954b8b9b815fa.vercel-dns-017.com.
TTL: 600 o Auto
```

**Notas:**
- En "Name" pon solo `admin` (no `admin.aguamarinamosaicos.com`)
- El punto (`.`) al final del valor es opcional en algunos proveedores
- TTL: 600 segundos = 10 minutos

---

### 3. Verificar Configuración DNS

#### Opción A: Online (Recomendado)

1. Ve a: https://dnschecker.org/#CNAME/admin.aguamarinamosaicos.com
2. Espera a ver checkmarks verdes ✅ en varios lugares
3. Debería mostrar que apunta a: `5cc954b8b9b815fa.vercel-dns-017.com`

#### Opción B: Línea de comandos

**Windows (CMD o PowerShell):**
```cmd
nslookup admin.aguamarinamosaicos.com
```

**Mac/Linux:**
```bash
dig admin.aguamarinamosaicos.com CNAME
```

**Resultado esperado:**
```
admin.aguamarinamosaicos.com → 5cc954b8b9b815fa.vercel-dns-017.com
```

---

### 4. Tiempo de Propagación

- **Mínimo:** 5-10 minutos
- **Promedio:** 30 minutos a 2 horas
- **Máximo:** 48 horas

**Factores que afectan:**
- TTL configurado previamente
- Caché DNS de tu ISP
- Ubicación geográfica

**Acelerar propagación:**
```bash
# Limpiar caché DNS local

# Windows
ipconfig /flushdns

# Mac
sudo dscacheutil -flushcache; sudo killall -HUP mDNSResponder

# Linux
sudo systemd-resolve --flush-caches
```

---

### 5. Verificar en Vercel

Una vez que el DNS esté propagado:

1. Ve a: Vercel → Proyecto admin-dashboard → Settings → Domains
2. Busca `admin.aguamarinamosaicos.com`
3. El estado debería cambiar de "Invalid Configuration" a:
   - ⏳ **"Pending"** (verificando)
   - ✅ **"Valid"** (configurado correctamente)
4. Vercel emitirá certificado SSL automáticamente
5. Espera el ✅ verde junto al dominio

---

### 6. Probar Acceso

Cuando veas el ✅ en Vercel:

1. Abre un navegador en **modo incógnito** (para evitar caché)
2. Ve a: `https://admin.aguamarinamosaicos.com`
3. Verifica:
   - ✅ La página carga
   - ✅ Candado verde (SSL activo)
   - ✅ No hay warnings de seguridad
   - ✅ El login funciona

---

## 🔍 Solución de Problemas

### Error: "DNS_PROBE_FINISHED_NXDOMAIN"

**Causa:** DNS aún no propagado o mal configurado.

**Solución:**
1. Verifica que el CNAME esté correcto en tu proveedor
2. Espera más tiempo (hasta 48h máximo)
3. Limpia caché DNS (comandos arriba)
4. Prueba desde otra red (datos móviles)

---

### Error: "ERR_SSL_VERSION_OR_CIPHER_MISMATCH"

**Causa:** Vercel aún no emitió el certificado SSL.

**Solución:**
1. Verifica que el DNS esté propagado globalmente
2. Espera 10-30 minutos más
3. En Vercel → Domains, debería mostrar estado del SSL
4. Si persiste >1 hora, elimina y vuelve a agregar el dominio

---

### Error: "ERR_TOO_MANY_REDIRECTS"

**Causa:** Configuración incorrecta en Cloudflare (proxy activado).

**Solución:**
1. Ve a Cloudflare → DNS
2. Busca el registro CNAME de `admin`
3. Asegúrate que la nube esté **GRIS** (DNS only), NO naranja
4. Si está naranja, haz click para desactivar proxy
5. Espera 5 minutos y prueba de nuevo

---

### Vercel muestra "Invalid Configuration" después de horas

**Causa:** El CNAME no apunta al valor correcto.

**Solución:**
1. Verifica con `nslookup` o dnschecker.org
2. Asegúrate que apunte EXACTAMENTE a: `5cc954b8b9b815fa.vercel-dns-017.com`
3. Revisa que no haya errores de tipeo
4. El punto (.) al final es opcional, pero el resto debe ser exacto

---

## 📊 Checklist de Verificación

- [ ] Identificar proveedor DNS
- [ ] Agregar registro CNAME en proveedor DNS
- [ ] Esperar 10-30 minutos
- [ ] Verificar con dnschecker.org
- [ ] Limpiar caché DNS local
- [ ] Verificar estado en Vercel (debe cambiar a Valid)
- [ ] Esperar emisión de SSL (puede tomar 10-30 min adicionales)
- [ ] Probar acceso a https://admin.aguamarinamosaicos.com
- [ ] Verificar candado verde (SSL)
- [ ] Probar login en el dashboard

---

## 🎯 Siguiente Paso: Actualizar CORS

Una vez que `admin.aguamarinamosaicos.com` esté funcionando:

### Actualizar Railway (Backend)

1. Ve a Railway → Variables
2. Edita `CORS_ORIGINS`:
   ```
   https://aguamarinamosaicos.com,https://www.aguamarinamosaicos.com,https://admin.aguamarinamosaicos.com,https://acuamarina-ceramica-rbqj.vercel.app,https://acuamarina-ceramica-rbqj-git-main-rene-kuhms-projects.vercel.app,https://acuamarina-ceramica-rbqj-nti3upu1s-rene-kuhms-projects.vercel.app
   ```
3. Save (Railway redesplegará)

### Actualizar Vercel (Admin Dashboard)

1. Vercel → Admin Dashboard → Settings → Environment Variables
2. Edita `NEXT_PUBLIC_SITE_URL`:
   ```
   https://admin.aguamarinamosaicos.com
   ```
3. Save y Redeploy

---

**Última actualización:** 2025-01-27
