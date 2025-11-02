# 🏗️ Arquitectura de Pagos - Aguamarina Cerámicos

## 📊 Diagrama de Flujo

```
┌─────────────────────────────────────────────────────────────────┐
│                    USUARIO / CLIENTE                            │
└─────────────────────────────────────────────────────────────────┘
                              │
                              │ 1. Navega y compra
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│               FRONTEND (Vercel)                                 │
│         https://aguamarinamosaicos.com                          │
│                                                                 │
│  Variables de entorno:                                          │
│  ❌ NO tiene credenciales de Mercado Pago                       │
│  ✅ NEXT_PUBLIC_API_URL → apunta al backend                     │
└─────────────────────────────────────────────────────────────────┘
                              │
                              │ 2. POST /orders/create
                              │ 3. POST /mercadopago/create-preference
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│               BACKEND API (Railway)                             │
│  https://diligent-upliftment-production-54de.up.railway.app    │
│                                                                 │
│  Variables de entorno:                                          │
│  ✅ MERCADOPAGO_ACCESS_TOKEN (credencial sensible)              │
│  ✅ MERCADOPAGO_PUBLIC_KEY                                      │
│  ✅ FRONTEND_URL (para URLs de retorno)                         │
│                                                                 │
│  Endpoints:                                                     │
│  • POST /api/v1/mercadopago/create-preference                  │
│  • POST /api/v1/mercadopago/webhook                            │
│  • GET  /api/v1/mercadopago/public-key                         │
└─────────────────────────────────────────────────────────────────┘
                              │
                              │ 4. Crea preferencia de pago
                              │    (usando Access Token)
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                  MERCADO PAGO API                               │
│              https://api.mercadopago.com                        │
│                                                                 │
│  Recibe:                                                        │
│  • Datos del pedido                                             │
│  • Access Token del backend                                     │
│                                                                 │
│  Retorna:                                                       │
│  • Preference ID                                                │
│  • Init Point (URL de pago)                                     │
└─────────────────────────────────────────────────────────────────┘
                              │
                              │ 5. Backend devuelve initPoint
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│               FRONTEND (Vercel)                                 │
│                                                                 │
│  Acción:                                                        │
│  window.location.href = preference.initPoint                    │
└─────────────────────────────────────────────────────────────────┘
                              │
                              │ 6. Redirige al usuario
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│           MERCADO PAGO CHECKOUT (Checkout Pro)                 │
│         https://www.mercadopago.com.ar/checkout/...             │
│                                                                 │
│  • Usuario completa datos de pago                              │
│  • Selecciona método de pago                                   │
│  • Confirma el pago                                             │
└─────────────────────────────────────────────────────────────────┘
                              │
                              │ 7. Después del pago
                              ▼
                    ┌─────────┴─────────┐
                    │                   │
                    ▼                   ▼
        ┌───────────────────┐   ┌───────────────────┐
        │  WEBHOOK          │   │  REDIRECT         │
        │  (Backend)        │   │  (Frontend)       │
        └───────────────────┘   └───────────────────┘
                    │                   │
                    │ 8a. Notificación  │ 8b. Usuario ve resultado
                    │    de pago        │
                    ▼                   ▼
        ┌───────────────────┐   ┌───────────────────┐
        │  Actualiza BD     │   │  /pedidos/success │
        │  Estado: paid     │   │  /pedidos/failure │
        │                   │   │  /pedidos/pending │
        └───────────────────┘   └───────────────────┘
```

---

## 🔑 ¿Dónde van las Credenciales?

### ❌ NO van en Vercel (Frontend)

```javascript
// frontend/app/checkout/page.tsx
// ❌ MAL - NO hacer esto
const MERCADOPAGO_ACCESS_TOKEN = "APP_USR-xxx" // ¡NUNCA!

// ✅ BIEN - Solicitar al backend
const preference = await mercadopagoApi.createPreference({ orderId })
window.location.href = preference.initPoint
```

**Razón**: El código del frontend es público, cualquiera puede ver las credenciales.

---

### ✅ SÍ van en Railway (Backend)

```typescript
// backend/src/config/environment.ts
export const config = {
  mercadopago: {
    accessToken: process.env.MERCADOPAGO_ACCESS_TOKEN, // ✅
    publicKey: process.env.MERCADOPAGO_PUBLIC_KEY,     // ✅
  }
}
```

**Razón**: El backend es privado, solo el servidor conoce las credenciales.

---

## 📋 Configuración por Plataforma

### 🌐 Vercel - Frontend

**Proyecto**: `aguamarinamosaicos.com`

**Variables de Entorno Necesarias:**
```env
NEXT_PUBLIC_API_URL=https://diligent-upliftment-production-54de.up.railway.app/api/v1
NEXT_PUBLIC_SITE_URL=https://aguamarinamosaicos.com
```

**Credenciales de Mercado Pago**: ❌ **NO NECESARIAS**

---

### 🚂 Railway - Backend

**Proyecto**: Backend API

**Variables de Entorno Necesarias:**
```env
# Mercado Pago (REQUERIDO)
MERCADOPAGO_ACCESS_TOKEN=APP_USR-8739117242123034-110209-3ac7dd69464f34205d80a02a691fefb0-2951480547
MERCADOPAGO_PUBLIC_KEY=APP_USR-c8332e1c-0d62-4cad-8ba4-47e7b319e17f

# Frontend (para URLs de retorno)
FRONTEND_URL=https://aguamarinamosaicos.com

# CORS (incluir dominio del frontend)
CORS_ORIGINS=https://aguamarinamosaicos.com,https://www.aguamarinamosaicos.com

# Database
DATABASE_URL=postgresql://...
DB_SSL=true

# JWT
JWT_SECRET=...
JWT_EXPIRES_IN=7d
```

---

### 💳 Mercado Pago - Webhook

**URL del Webhook:**
```
https://diligent-upliftment-production-54de.up.railway.app/api/v1/mercadopago/webhook
```

**Configuración:**
1. Panel: https://www.mercadopago.com.ar/developers/panel
2. Webhooks → Agregar URL
3. Eventos: **Pagos**
4. Modo: **Producción**

---

## 🔄 Flujo Detallado del Pago

### 1. Usuario agrega productos al carrito
```javascript
// frontend/lib/store/cart.ts
addToCart(product, quantity)
```

### 2. Usuario va al checkout
```
URL: https://aguamarinamosaicos.com/checkout
```

### 3. Frontend crea la orden
```javascript
// frontend/app/checkout/page.tsx
const order = await ordersApi.create({
  customerName: "Juan Pérez",
  customerEmail: "juan@email.com",
  items: [...],
  shippingAddress: {...}
})
```

### 4. Frontend solicita preferencia de pago
```javascript
const preference = await mercadopagoApi.createPreference({
  orderId: order.id
})
// preference = { preferenceId, initPoint, sandboxInitPoint }
```

### 5. Backend crea preferencia en Mercado Pago
```typescript
// backend/src/application/controllers/MercadoPagoController.ts
const preference = await mpPreferenceClient.create({
  items: [...],
  payer: {...},
  back_urls: {
    success: `${FRONTEND_URL}/pedidos/success`,
    failure: `${FRONTEND_URL}/pedidos/failure`,
    pending: `${FRONTEND_URL}/pedidos/pending`
  }
})
```

### 6. Frontend redirige al usuario
```javascript
window.location.href = preference.initPoint
// https://www.mercadopago.com.ar/checkout/v1/redirect?pref_id=xxx
```

### 7. Usuario completa el pago en Mercado Pago
- Ingresa datos de tarjeta
- Confirma el pago
- Mercado Pago procesa

### 8a. Webhook actualiza el backend
```typescript
// POST /api/v1/mercadopago/webhook
// Mercado Pago notifica: { type: "payment", data: { id: "123" } }
// Backend actualiza: status = "confirmed", payment_status = "completed"
```

### 8b. Usuario es redirigido
```
✅ Pago exitoso → https://aguamarinamosaicos.com/pedidos/success?payment_id=123
❌ Pago fallido → https://aguamarinamosaicos.com/pedidos/failure
⏳ Pago pendiente → https://aguamarinamosaicos.com/pedidos/pending
```

---

## 🎯 Resumen: ¿Qué configurar en Vercel?

### Para Mercado Pago específicamente:

```
┌─────────────────────────────────────────────┐
│  ¿Necesito configurar Mercado Pago          │
│  en Vercel (Frontend)?                      │
│                                             │
│  Respuesta: ❌ NO                           │
│                                             │
│  El frontend solo necesita:                 │
│  • NEXT_PUBLIC_API_URL (ya configurado)     │
│                                             │
│  Las credenciales de MP van en Railway      │
└─────────────────────────────────────────────┘
```

---

## ✅ Checklist Final

### En Railway (Backend):
- [ ] Agregar `MERCADOPAGO_ACCESS_TOKEN`
- [ ] Agregar `MERCADOPAGO_PUBLIC_KEY`
- [ ] Verificar `FRONTEND_URL=https://aguamarinamosaicos.com`
- [ ] Redeploy automático

### En Mercado Pago:
- [ ] Configurar webhook apuntando a Railway
- [ ] Verificar modo: Producción
- [ ] Eventos: Pagos

### En Vercel (Frontend):
- [ ] ✅ Ya está configurado correctamente
- [ ] No necesitas cambiar nada para Mercado Pago

### Testing:
- [ ] Hacer compra de prueba
- [ ] Verificar redirección a Mercado Pago
- [ ] Completar pago
- [ ] Verificar actualización del pedido en BD
- [ ] Verificar redirección de vuelta al frontend

---

**Conclusión**: En Vercel **NO necesitas configurar nada** relacionado con Mercado Pago.
Todo el procesamiento de pagos ocurre en Railway (Backend).
