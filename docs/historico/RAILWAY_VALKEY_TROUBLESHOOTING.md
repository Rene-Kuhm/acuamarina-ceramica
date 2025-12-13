# Troubleshooting: Valkey Connection Error en Railway

## ❌ Error Actual

```
Error de Valkey: connect ECONNREFUSED ::1:6379
```

**Causa:** Las variables de entorno de Valkey no están configuradas en Railway, por lo que intenta conectarse a localhost.

## ✅ Solución Completa

### Paso 1: Verificar/Agregar Servicio Redis

1. **Ve a tu proyecto en Railway**: https://railway.app/project/[tu-proyecto-id]

2. **Verifica si existe un servicio de Redis/Valkey:**
   - Debes ver algo como: `[Backend] [Postgres] [Redis]`

3. **Si NO existe, agrégalo:**
   - Click en **"+ New"**
   - Selecciona **"Database"**
   - Busca **"Redis"**
   - Click **"Add Redis"**
   - Espera a que se provisione (aparecerá un ícono de Redis)

### Paso 2: Identificar el Nombre del Servicio

El servicio puede llamarse:
- `Redis` (más común)
- `redis`
- `Valkey`
- O un nombre personalizado que le hayas dado

**Para verificar:**
1. Click en el servicio de Redis
2. En la parte superior verás el nombre (ej: "Redis")
3. **Anota este nombre exacto** - lo necesitarás para las referencias

### Paso 3: Configurar Variables de Entorno

1. **Ve al servicio Backend** (no al de Redis)
2. Click en la pestaña **"Variables"**
3. **Agrega estas 4 variables:**

#### Variables a agregar:

```env
# Variable 1
Nombre: VALKEY_HOST
Valor: ${{Redis.RAILWAY_PRIVATE_NETWORK_HOST}}

# Variable 2
Nombre: VALKEY_PORT
Valor: 6379

# Variable 3
Nombre: VALKEY_PASSWORD
Valor: ${{Redis.REDIS_PASSWORD}}

# Variable 4
Nombre: VALKEY_DB
Valor: 0
```

**Importante:**
- Reemplaza `Redis` con el nombre exacto de tu servicio
- Las referencias `${{...}}` deben escribirse exactamente así
- Railway autocompletará cuando escribas `${{`

### Paso 4: Verificar las Referencias

Las referencias deben verse así en Railway:

```
VALKEY_HOST: ${{Redis.RAILWAY_PRIVATE_NETWORK_HOST}}
             ↑                ↑
             Nombre del      Variable generada
             servicio        automáticamente
```

#### Variables disponibles en el servicio Redis:

Railway genera automáticamente estas variables:
- `RAILWAY_PRIVATE_NETWORK_HOST` ← **Usa esta para VALKEY_HOST**
- `RAILWAY_PRIVATE_NETWORK_PORT`
- `RAILWAY_TCP_PROXY_DOMAIN`
- `RAILWAY_TCP_PROXY_PORT`
- `REDIS_URL`
- `REDIS_HOST`
- `REDIS_PORT`
- `REDIS_PASSWORD` ← **Usa esta para VALKEY_PASSWORD**

### Paso 5: Alternativas si no funciona la Red Privada

Si `RAILWAY_PRIVATE_NETWORK_HOST` no funciona, prueba:

#### Opción A: Usar TCP Proxy
```env
VALKEY_HOST=${{Redis.RAILWAY_TCP_PROXY_DOMAIN}}
VALKEY_PORT=${{Redis.RAILWAY_TCP_PROXY_PORT}}
VALKEY_PASSWORD=${{Redis.REDIS_PASSWORD}}
VALKEY_DB=0
```

#### Opción B: Usar variables estándar de Redis
```env
VALKEY_HOST=${{Redis.REDIS_HOST}}
VALKEY_PORT=${{Redis.REDIS_PORT}}
VALKEY_PASSWORD=${{Redis.REDIS_PASSWORD}}
VALKEY_DB=0
```

### Paso 6: Verificar el Deployment

1. **Railway redesplegará automáticamente** después de agregar las variables
2. **Ve a Deployments** → Selecciona el último deployment
3. **Revisa los logs**

**Logs correctos:**
```
✓ Conectando a Valkey...
✓ Valkey conectado y listo
✅ Valkey connected successfully
```

**Logs con error (antes de la corrección):**
```
❌ Error de Valkey: connect ECONNREFUSED ::1:6379
⚠️ Valkey no disponible - continuando sin cache
```

## 🔍 Debugging Adicional

### Ver las Variables de Entorno Actuales

En el servicio Backend, ve a Variables y confirma que veas:

```
✓ VALKEY_HOST     ${{Redis.RAILWAY_PRIVATE_NETWORK_HOST}}
✓ VALKEY_PORT     6379
✓ VALKEY_PASSWORD ${{Redis.REDIS_PASSWORD}}
✓ VALKEY_DB       0
```

### Ver las Variables del Servicio Redis

1. Click en el servicio **Redis**
2. Ve a la pestaña **"Variables"** o **"Connect"**
3. Deberías ver variables como:
   ```
   RAILWAY_PRIVATE_NETWORK_HOST=redis.railway.internal
   REDIS_PASSWORD=[password-generado]
   REDIS_PORT=6379
   ```

### Comando para Probar la Conexión

En Railway CLI (si lo tienes instalado):

```bash
# Ver variables del backend
railway variables -s backend

# Ver variables del Redis
railway variables -s redis

# Ver logs en tiempo real
railway logs -s backend
```

## ✅ Verificación Final

Una vez configurado correctamente, prueba:

### 1. Health Check
```bash
curl https://tu-backend.railway.app/health/ready
```

**Respuesta esperada:**
```json
{
  "status": "ok",
  "timestamp": "2025-10-28T...",
  "checks": {
    "database": {
      "status": "up",
      "message": "Database connection is healthy"
    },
    "valkey": {
      "status": "up",
      "message": "Valkey connection is healthy",
      "responseTime": "5ms",
      "details": {
        "dbSize": 0
      }
    }
  }
}
```

### 2. Logs del Servidor
```
✓ Conectando a Valkey...
✓ Valkey conectado y listo
✅ Valkey connected successfully
🚀 Servidor Aguamarina Mosaicos iniciado
```

## 🆘 Si Aún No Funciona

### Checklist Final:

- [ ] ¿El servicio de Redis está corriendo? (debe estar verde en Railway)
- [ ] ¿Las variables están en el servicio **Backend** (no en Redis)?
- [ ] ¿El nombre del servicio en `${{Redis...}}` coincide con el nombre real?
- [ ] ¿Las referencias tienen los símbolos `${{` y `}}` correctamente?
- [ ] ¿Railway terminó de redesplegar después de agregar las variables?
- [ ] ¿El servicio de Redis está en el mismo proyecto que el Backend?

### Última Alternativa: Usar REDIS_URL

Si nada funciona, puedes parsear la REDIS_URL:

**En Railway Backend, agrega:**
```env
REDIS_URL=${{Redis.REDIS_URL}}
```

**Luego actualiza el código (valkey.ts) para parsear esta URL** - pero primero intenta las opciones anteriores.

## 📞 Soporte

Si después de seguir todos los pasos sigue sin funcionar:
1. Copia los logs completos
2. Copia las variables de entorno (sin el password)
3. Comparte capturas de tu proyecto en Railway

La aplicación funciona sin caché (graceful degradation), pero es recomendable tener Valkey funcionando para mejor performance.
