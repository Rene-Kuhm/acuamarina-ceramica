# Railway Debugging - MercadoPago Routes Missing

## Problema
Railway NO está registrando las rutas de MercadoPago a pesar de múltiples deployments.

## Evidencia
```json
// Respuesta actual de /api/v1/
{
  "endpoints": {
    "auth": "/auth",
    "products": "/products",
    "categories": "/categories",
    "orders": "/orders",
    "customers": "/customers",
    "users": "/users",
    "stats": "/stats"
    // ❌ FALTA: "mercadopago": "/mercadopago"
  }
}
```

## Verificaciones Realizadas

### 1. ✅ Archivos Existen Localmente
```bash
backend/src/application/routes/mercadopago.routes.ts
backend/src/application/controllers/MercadoPagoController.ts
```

### 2. ✅ Build Local Exitoso
```bash
npm run build
# ✅ Sin errores
```

### 3. ✅ Archivos Compilados Localmente
```bash
backend/dist/application/routes/mercadopago.routes.js
backend/dist/application/controllers/MercadoPagoController.js
```

### 4. ✅ Rutas Registradas en app.ts
```typescript
import mercadopagoRoutes from './application/routes/mercadopago.routes';
apiRouter.use('/mercadopago', mercadopagoRoutes);
```

### 5. ❌ Railway NO Tiene las Rutas
Test directo a Railway muestra 404 en todas las rutas de MercadoPago.

## Posibles Causas

### Hipótesis 1: Build Falla en Railway
Railway puede estar fallando silenciosamente al compilar TypeScript.

**Solución a probar:**
1. Verificar logs de BUILD (no deployment) en Railway
2. Buscar errores de TypeScript
3. Verificar que `npm run build` se ejecute correctamente

### Hipótesis 2: Railway Usa Caché Viejo
Railway puede estar usando un build cacheado antiguo.

**Solución a probar:**
1. Limpiar caché de Railway manualmente
2. Forzar rebuild desde cero
3. Verificar que Railway use la rama 'main' correcta

### Hipótesis 3: Problema con Import/Export
El import de MercadoPagoController puede estar fallando.

**Solución a probar:**
1. Verificar sintaxis de export en MercadoPagoController.ts
2. Verificar que no haya errores de compilación TypeScript
3. Probar build local y ejecutar servidor localmente

### Hipótesis 4: Railway Monorepo Confusion
Railway puede estar detectando el proyecto incorrectamente.

**Solución a probar:**
1. Verificar que Railway apunte a /backend como root
2. Verificar railway.json o railway.toml
3. Verificar que el comando de build sea correcto

## Próximos Pasos

1. **Revisar logs de BUILD en Railway** (no los de runtime)
2. **Verificar configuración de Railway:**
   - ¿Qué directorio usa como root?
   - ¿Qué comando ejecuta para build?
   - ¿Qué comando ejecuta para start?
3. **Probar localmente:**
   ```bash
   cd backend
   npm run build
   npm start
   curl http://localhost:8080/api/v1/
   # Verificar si mercadopago aparece
   ```

## Configuración Correcta de Railway

### Settings → General
- **Root Directory:** `/backend` o vacío si está en root
- **Build Command:** `npm install && npm run build`
- **Start Command:** `npm start`

### Variables de Entorno
Verificar que todas estén configuradas, especialmente:
- DATABASE_URL
- MERCADOPAGO_ACCESS_TOKEN
- MERCADOPAGO_PUBLIC_KEY

## Última Acción Tomada
- Commit: 7840d05 "chore: Force Railway rebuild for MercadoPago routes"
- Resultado: Railway aún no muestra las rutas

## SIGUIENTE ACCIÓN RECOMENDADA

**OPCIÓN A: Verificar en Railway Dashboard**
1. Ir a Railway → Deployments
2. Ver el último deployment
3. Click en "View Logs" → "Build Logs" (NO "Deploy Logs")
4. Buscar errores de compilación TypeScript
5. Verificar que `npm run build` se ejecute

**OPCIÓN B: Probar Localmente Primero**
```bash
cd backend
rm -rf dist/
npm run build
npm start
# En otra terminal:
curl http://localhost:8080/api/v1/
# Debe mostrar "mercadopago" en endpoints
```

**OPCIÓN C: Redesplegar Manualmente en Railway**
1. Railway → Deployments
2. Click en "Redeploy" del último deployment
3. Seleccionar "Redeploy from scratch" (sin caché)
