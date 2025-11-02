# 🛒 Configuración de Mercado Pago - Aguamarina Cerámicos

## ✅ Credenciales de Producción Configuradas

### 📋 Credenciales Disponibles

```env
MERCADOPAGO_ACCESS_TOKEN=APP_USR-8739117242123034-110209-3ac7dd69464f34205d80a02a691fefb0-2951480547
MERCADOPAGO_PUBLIC_KEY=APP_USR-c8332e1c-0d62-4cad-8ba4-47e7b319e17f
CLIENT_ID=8739117242123034
CLIENT_SECRET=5X5RPtH3uwV9YZxk8iPzdPCUuvUimD4X
```

---

## 🚀 Configuración en Railway (Backend en Producción)

### Paso 1: Acceder a las Variables de Entorno

1. Ve a https://railway.app/
2. Entra a tu proyecto **Aguamarina Cerámicos Backend**
3. Haz clic en el servicio del backend
4. Ve a la pestaña **"Variables"**

### Paso 2: Agregar las Variables de Mercado Pago

Agrega estas **2 variables** (las únicas necesarias para Checkout Pro):

```env
MERCADOPAGO_ACCESS_TOKEN=APP_USR-8739117242123034-110209-3ac7dd69464f34205d80a02a691fefb0-2951480547

MERCADOPAGO_PUBLIC_KEY=APP_USR-c8332e1c-0d62-4cad-8ba4-47e7b319e17f
```

### Paso 3: Redeploy

Después de agregar las variables:
1. Railway automáticamente hará redeploy
2. O puedes forzar un redeploy haciendo clic en **"Deploy"**

---

## 🔔 Configurar Webhook en Mercado Pago

### URL del Webhook

Obtén tu URL de Railway y configura el webhook:

```
https://TU-BACKEND.railway.app/api/v1/mercadopago/webhook
```

Por ejemplo:
```
https://acuamarina-backend-production.up.railway.app/api/v1/mercadopago/webhook
```

### Pasos para Configurar el Webhook

1. Ve a https://www.mercadopago.com.ar/developers/panel
2. Navega a **"Tus integraciones"** → **"Webhooks"**
3. Haz clic en **"Agregar webhook"** o **"Nueva URL"**
4. Completa:
   - **URL**: `https://tu-backend.railway.app/api/v1/mercadopago/webhook`
   - **Eventos**: Selecciona **"Pagos"** (payment)
   - **Modo**: **Producción**
5. Guarda los cambios

### Verificar el Webhook

Para verificar que el webhook funciona:
1. Mercado Pago enviará una notificación de prueba
2. Revisa los logs de Railway para ver si la recibió
3. Deberías ver logs como: `Webhook recibido de MercadoPago: payment`

---

## 🧪 Testing en Producción

### 1. Verificar que el Backend está usando las credenciales

Prueba este endpoint (NO expone credenciales sensibles):
```bash
curl https://tu-backend.railway.app/api/v1/mercadopago/public-key
```

Debería retornar:
```json
{
  "success": true,
  "data": {
    "publicKey": "APP_USR-c8332e1c-0d62-4cad-8ba4-47e7b319e17f"
  }
}
```

### 2. Realizar una Compra de Prueba

1. Ve a tu tienda: https://acuamarina-ceramica.vercel.app
2. Agrega productos al carrito
3. Ve al checkout
4. Completa el formulario
5. Haz clic en **"Confirmar Pedido"**
6. Serás redirigido a Mercado Pago
7. Completa el pago (esto es REAL, se cobrará)

### 3. URLs de Retorno Configuradas

Después del pago, el usuario será redirigido a:

- ✅ **Éxito**: `https://acuamarina-ceramica.vercel.app/pedidos/success`
- ❌ **Error**: `https://acuamarina-ceramica.vercel.app/pedidos/failure`
- ⏳ **Pendiente**: `https://acuamarina-ceramica.vercel.app/pedidos/pending`

---

## 📊 Monitoreo de Pagos

### En el Panel de Mercado Pago

1. Ve a https://www.mercadopago.com.ar/activities
2. Verás todos los pagos realizados
3. Estados posibles:
   - **Aprobado**: Pago exitoso
   - **Pendiente**: Esperando confirmación
   - **Rechazado**: Pago fallido
   - **Cancelado**: Usuario canceló

### En tu Base de Datos

Los pedidos se actualizan automáticamente vía webhook:

```sql
-- Ver pedidos con pagos de Mercado Pago
SELECT
  id,
  order_number,
  status,
  payment_status,
  mercadopago_payment_id,
  total,
  created_at
FROM orders
WHERE mercadopago_payment_id IS NOT NULL
ORDER BY created_at DESC;
```

Estados en la BD:
- `status`: `pending` | `confirmed` | `cancelled`
- `payment_status`: `pending` | `completed` | `failed` | `refunded`

---

## 🔒 Seguridad

### ⚠️ Credenciales Sensibles

- **NUNCA** subas el archivo `.env` a GitHub
- El `.env` ya está en `.gitignore`
- Las credenciales solo deben estar en:
  - ✅ Variables de entorno de Railway (producción)
  - ✅ `.env` local (desarrollo)
  - ❌ **NUNCA** en el código fuente

### 🔐 Client Secret

El `CLIENT_SECRET` NO se usa en Checkout Pro, solo en integraciones avanzadas.
Lo guardamos como referencia pero no es necesario configurarlo.

---

## 📝 Checklist de Configuración

- [x] Credenciales agregadas al `.env` local
- [ ] Credenciales agregadas a Railway (Variables de entorno)
- [ ] Backend redeployado en Railway
- [ ] Webhook configurado en Mercado Pago
- [ ] Webhook verificado (revisar logs)
- [ ] Prueba de pago realizada
- [ ] Verificar que el pedido se actualiza en la BD

---

## 🆘 Troubleshooting

### Problema: "MercadoPago access token no está configurado"

**Solución**:
1. Verifica que las variables estén en Railway
2. Redeploy el backend
3. Revisa los logs: `railway logs`

### Problema: El webhook no actualiza el estado del pedido

**Solución**:
1. Verifica la URL del webhook en Mercado Pago
2. Revisa los logs de Railway: `railway logs`
3. Busca: `Webhook recibido de MercadoPago`
4. Verifica que el backend esté público (no en private networking)

### Problema: Redirige a página en blanco después del pago

**Solución**:
1. Verifica que `FRONTEND_URL` esté configurado correctamente en Railway
2. Debe ser: `https://acuamarina-ceramica.vercel.app`
3. SIN barra final `/`

---

## 📞 Soporte

- **Documentación MP**: https://www.mercadopago.com.ar/developers/es/docs
- **Panel de MP**: https://www.mercadopago.com.ar/developers/panel
- **Railway Dashboard**: https://railway.app/dashboard

---

**Última actualización**: 2025-11-02
**Modo**: Producción
**Tipo de Checkout**: Checkout Pro
