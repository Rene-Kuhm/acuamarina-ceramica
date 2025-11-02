# 🚀 Configuración de Mercado Pago en Vercel - Paso por Paso

## 📋 Resumen: ¿Qué necesitas configurar?

En Vercel tienes **3 proyectos**:
1. **Frontend Principal** (aguamarinamosaicos.com) - ⚠️ **NO necesita credenciales de MP**
2. **Admin Dashboard** - ⚠️ **NO necesita credenciales de MP**
3. **Backend API** (si está en Vercel) - ✅ **SÍ necesita credenciales de MP**

> **IMPORTANTE**: Según tu arquitectura, el **Backend está en Railway**, NO en Vercel.
> Por lo tanto, **NO necesitas configurar nada en Vercel para Mercado Pago**.

---

## 🎯 ¿Dónde se configuran las credenciales de Mercado Pago?

### ✅ Backend en Railway (TU CASO)

```
Frontend (Vercel) → Backend (Railway) → Mercado Pago
```

**Las credenciales van SOLO en Railway**, porque:
- El frontend NO tiene credenciales de Mercado Pago
- El frontend hace peticiones al backend
- El backend (en Railway) crea las preferencias de pago
- El backend tiene las credenciales sensibles

---

## 📌 Configuración en Vercel - Frontend

Aunque **NO necesitas credenciales de MP en Vercel**, sí necesitas asegurarte de que tu frontend esté correctamente configurado para comunicarse con el backend.

### Paso 1: Verificar Variables de Entorno en Frontend

#### 🌐 Proyecto: Frontend Principal (aguamarinamosaicos.com)

1. Ve a https://vercel.com/dashboard
2. Selecciona tu proyecto **Frontend** (`acuamarina-ceramica` o similar)
3. Ve a **Settings** → **Environment Variables**
4. Verifica que tengas esta variable:

```env
NEXT_PUBLIC_API_URL=https://diligent-upliftment-production-54de.up.railway.app/api/v1
```

**Explicación**: Esta variable le dice al frontend dónde está el backend que procesará los pagos.

---

#### 🎨 Proyecto: Admin Dashboard

1. Ve a https://vercel.com/dashboard
2. Selecciona tu proyecto **Admin Dashboard** (`acuamarina-ceramica-rbqj`)
3. Ve a **Settings** → **Environment Variables**
4. Verifica que tengas:

```env
NEXT_PUBLIC_API_URL=https://diligent-upliftment-production-54de.up.railway.app/api/v1
```

---

## 🔧 Si tu Backend estuviera en Vercel (Caso Alternativo)

> **Nota**: Este NO es tu caso actual, pero lo incluyo por si migras el backend a Vercel en el futuro.

### Proyecto Backend en Vercel - Variables de Entorno

Si tu backend estuviera en Vercel, deberías configurar:

1. Ve a tu proyecto **Backend** en Vercel
2. **Settings** → **Environment Variables**
3. Agrega estas variables:

```env
# MercadoPago
MERCADOPAGO_ACCESS_TOKEN=APP_USR-8739117242123034-110209-3ac7dd69464f34205d80a02a691fefb0-2951480547
MERCADOPAGO_PUBLIC_KEY=APP_USR-c8332e1c-0d62-4cad-8ba4-47e7b319e17f

# Frontend URL (para URLs de retorno)
FRONTEND_URL=https://aguamarinamosaicos.com

# Database
DATABASE_URL=postgresql://user:password@host:5432/database
DB_SSL=true

# JWT
JWT_SECRET=tu_secret_aqui
JWT_EXPIRES_IN=7d
JWT_REFRESH_SECRET=tu_refresh_secret_aqui
JWT_REFRESH_EXPIRES_IN=30d

# CORS
CORS_ORIGINS=https://aguamarinamosaicos.com,https://www.aguamarinamosaicos.com,https://acuamarina-ceramica-rbqj.vercel.app
```

4. Después de agregar, haz clic en **"Redeploy"** en la pestaña **Deployments**

---

## ✅ TU CONFIGURACIÓN ACTUAL (Recomendada)

### Backend en Railway ✅

**Ya configurado o por configurar en Railway:**

```env
MERCADOPAGO_ACCESS_TOKEN=APP_USR-8739117242123034-110209-3ac7dd69464f34205d80a02a691fefb0-2951480547
MERCADOPAGO_PUBLIC_KEY=APP_USR-c8332e1c-0d62-4cad-8ba4-47e7b319e17f
FRONTEND_URL=https://aguamarinamosaicos.com
```

**Pasos en Railway:**
1. Ve a https://railway.app/dashboard
2. Selecciona tu proyecto **Backend**
3. Pestaña **"Variables"**
4. Agrega o verifica las 3 variables de arriba
5. Railway hará redeploy automático

---

### Frontend en Vercel ✅

**Ya configurado en Vercel:**

```env
NEXT_PUBLIC_API_URL=https://diligent-upliftment-production-54de.up.railway.app/api/v1
```

**No necesitas más configuración en Vercel para Mercado Pago.**

---

## 🔍 Verificación Paso por Paso

### 1. Verificar que el Frontend se comunica con el Backend

Abre la consola del navegador en tu frontend y ejecuta:

```javascript
fetch('https://diligent-upliftment-production-54de.up.railway.app/api/v1/mercadopago/public-key')
  .then(r => r.json())
  .then(data => console.log(data))
```

**Resultado esperado:**
```json
{
  "success": true,
  "data": {
    "publicKey": "APP_USR-c8332e1c-0d62-4cad-8ba4-47e7b319e17f"
  }
}
```

Si ves este resultado, ✅ **Todo está bien configurado**.

---

### 2. Hacer una compra de prueba

1. Ve a https://aguamarinamosaicos.com
2. Agrega productos al carrito
3. Ve al checkout
4. Completa el formulario
5. Haz clic en "Confirmar Pedido"
6. Deberías ser redirigido a Mercado Pago

Si todo funciona, ✅ **La integración está completa**.

---

## 🔐 Seguridad: ¿Por qué NO poner credenciales en el Frontend?

```
❌ MAL: Frontend tiene credenciales → Cualquiera puede verlas en el código
✅ BIEN: Backend tiene credenciales → Solo el servidor las conoce
```

**Flujo correcto:**
```
1. Usuario: "Quiero comprar"
2. Frontend: Envía orden al backend (sin credenciales)
3. Backend: Crea preferencia con MercadoPago (con credenciales)
4. Backend: Devuelve link de pago al frontend
5. Frontend: Redirige al usuario a MercadoPago
6. Usuario: Completa el pago en MercadoPago
7. MercadoPago: Notifica al backend vía webhook
8. Backend: Actualiza estado del pedido
9. Usuario: Es redirigido a página de éxito/fallo
```

---

## 📝 Checklist de Configuración en Vercel

### Frontend Principal (aguamarinamosaicos.com)
- [ ] Verificar `NEXT_PUBLIC_API_URL` apunta a Railway
- [ ] Verificar que el sitio carga correctamente
- [ ] Probar agregar productos al carrito
- [ ] Probar proceso de checkout

### Admin Dashboard
- [ ] Verificar `NEXT_PUBLIC_API_URL` apunta a Railway
- [ ] Verificar que puede ver pedidos
- [ ] Verificar que puede actualizar estados de pedidos

### Backend en Railway (NO en Vercel)
- [ ] Agregar `MERCADOPAGO_ACCESS_TOKEN`
- [ ] Agregar `MERCADOPAGO_PUBLIC_KEY`
- [ ] Verificar `FRONTEND_URL=https://aguamarinamosaicos.com`
- [ ] Configurar webhook en Mercado Pago

---

## 🌐 URLs de tus Proyectos

| Proyecto | URL | Plataforma | Credenciales MP |
|---|---|---|---|
| **Frontend** | https://aguamarinamosaicos.com | Vercel | ❌ NO |
| **Admin** | https://acuamarina-ceramica-rbqj.vercel.app | Vercel | ❌ NO |
| **Backend** | https://diligent-upliftment-production-54de.up.railway.app | Railway | ✅ SÍ |

---

## 🆘 Troubleshooting

### Problema: "No se puede crear la preferencia de pago"

**Causas posibles:**
1. ❌ Backend no tiene las credenciales de Mercado Pago
2. ❌ Frontend apunta a URL incorrecta del backend
3. ❌ CORS no permite peticiones desde el frontend

**Solución:**
```bash
# 1. Verificar que el backend tiene las credenciales
curl https://tu-backend.railway.app/api/v1/mercadopago/public-key

# 2. Verificar CORS en Railway
# Debe incluir: https://aguamarinamosaicos.com
```

---

### Problema: "Error de CORS al crear la orden"

**Solución:**
Verifica en Railway que `CORS_ORIGINS` incluya:
```
https://aguamarinamosaicos.com,https://www.aguamarinamosaicos.com
```

---

### Problema: "Webhook no actualiza el estado del pedido"

**Solución:**
Configura el webhook en Mercado Pago:
```
URL: https://diligent-upliftment-production-54de.up.railway.app/api/v1/mercadopago/webhook
Evento: Pagos
```

---

## 📞 Resumen Final

### ✅ Lo que SÍ necesitas hacer en Vercel:
1. Verificar que `NEXT_PUBLIC_API_URL` apunta a tu backend de Railway
2. Nada más (el frontend no maneja credenciales de MP)

### ✅ Lo que SÍ necesitas hacer en Railway:
1. Agregar `MERCADOPAGO_ACCESS_TOKEN`
2. Agregar `MERCADOPAGO_PUBLIC_KEY`
3. Configurar webhook en Mercado Pago

### ❌ Lo que NO necesitas hacer en Vercel:
1. NO agregar credenciales de Mercado Pago
2. NO configurar webhooks
3. NO hacer nada especial para pagos

---

**Última actualización**: 2025-11-02
**Arquitectura**: Backend en Railway + Frontend en Vercel
**Tipo de Checkout**: Checkout Pro
