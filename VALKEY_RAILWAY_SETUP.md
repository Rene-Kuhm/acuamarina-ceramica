# Configuración de Valkey en Railway

Este documento explica cómo configurar **Valkey** (fork open-source de Redis) en Railway para tu proyecto.

## ¿Qué es Valkey?

Valkey es un fork open-source de Redis, totalmente compatible con el protocolo Redis. Ofrece las mismas características de almacenamiento en caché de alto rendimiento sin las restricciones de licencia de Redis.

## Configuración en Railway

### Paso 1: Agregar Valkey a tu Proyecto

1. Accede a tu proyecto en [Railway](https://railway.app)
2. Haz clic en **"+ New"** para agregar un nuevo servicio
3. Selecciona **"Database"**
4. Busca y selecciona **"Valkey"** (o "Redis" si Valkey no está disponible - es compatible)
5. Railway creará automáticamente una instancia de Valkey

### Paso 2: Configurar Variables de Entorno

Railway generará automáticamente variables para tu instancia de Valkey. Necesitas copiar estas variables a tu servicio backend:

1. Ve al servicio de **Valkey** en Railway
2. Copia las siguientes variables:
   - `VALKEY_HOST` (o `REDIS_HOST`)
   - `VALKEY_PORT` (o `REDIS_PORT`)
   - `VALKEY_PASSWORD` (o `REDIS_PASSWORD`)

3. Ve al servicio de tu **Backend**
4. En la pestaña **"Variables"**, agrega:

```env
VALKEY_HOST=${{Valkey.RAILWAY_PRIVATE_NETWORK_HOST}}
VALKEY_PORT=${{Valkey.RAILWAY_TCP_PROXY_PORT}}
VALKEY_PASSWORD=${{Valkey.VALKEY_PASSWORD}}
VALKEY_DB=0
```

**Nota importante:** Si Railway usa nombres de variables con prefijo `REDIS_`, puedes usar referencias automáticas:

```env
VALKEY_HOST=${{Redis.REDIS_HOST}}
VALKEY_PORT=${{Redis.REDIS_PORT}}
VALKEY_PASSWORD=${{Redis.REDIS_PASSWORD}}
VALKEY_DB=0
```

### Paso 3: Usar la Red Privada de Railway

Para mejor rendimiento y seguridad, configura tu backend para usar la red privada de Railway:

```env
# Opción 1: Usar la red privada (recomendado)
VALKEY_HOST=${{Valkey.RAILWAY_PRIVATE_NETWORK_HOST}}
VALKEY_PORT=6379  # Puerto estándar en la red privada

# Opción 2: Usar TCP Proxy (si la red privada no está disponible)
VALKEY_HOST=${{Valkey.RAILWAY_TCP_PROXY_DOMAIN}}
VALKEY_PORT=${{Valkey.RAILWAY_TCP_PROXY_PORT}}
```

### Paso 4: Configuración Opcional

Puedes agregar configuraciones adicionales:

```env
# Base de datos de Valkey (0-15)
VALKEY_DB=0
```

## Verificación de la Conexión

Una vez desplegado, verifica la conexión:

1. Accede al endpoint de health check: `https://tu-app.railway.app/health/ready`
2. Deberías ver:

```json
{
  "status": "ok",
  "timestamp": "2025-01-XX...",
  "checks": {
    "database": {
      "status": "up",
      "message": "Database connection is healthy"
    },
    "valkey": {
      "status": "up",
      "message": "Valkey connection is healthy",
      "responseTime": "5ms"
    }
  }
}
```

## Arquitectura Actualizada

El proyecto ahora usa:

```
Backend (Node.js)
    ↓
Valkey (Cache)
    ↓
PostgreSQL (Database)
```

## Características del Cliente ioredis

El proyecto usa `ioredis` como cliente, que es compatible tanto con Redis como con Valkey. Características:

- **Reconexión automática**: Reintenta la conexión hasta 3 veces
- **Modo graceful**: La aplicación funciona sin caché si Valkey no está disponible
- **Timeouts configurados**: 10s para conectar, 30s de keep-alive
- **Lazy connect**: No bloquea el inicio de la aplicación

## Comandos CLI de Valkey

Si necesitas acceder directamente a Valkey desde Railway CLI:

```bash
# Conectar via Railway CLI
railway run valkey-cli -h $VALKEY_HOST -p $VALKEY_PORT -a $VALKEY_PASSWORD

# O usar redis-cli (es compatible)
railway run redis-cli -h $VALKEY_HOST -p $VALKEY_PORT -a $VALKEY_PASSWORD

# Comandos útiles
PING                    # Verificar conexión
KEYS *                  # Listar todas las keys
GET key_name            # Obtener valor
TTL key_name            # Ver tiempo de vida restante
FLUSHDB                 # Limpiar base de datos actual
INFO                    # Información del servidor
```

## Migración desde Redis

Si estabas usando Redis previamente:

1. **No hay cambios en los datos**: Valkey es 100% compatible con Redis
2. **Cliente compatible**: `ioredis` funciona con ambos
3. **Mismos comandos**: Todos los comandos de Redis funcionan en Valkey
4. **Variables de entorno**: Solo necesitas actualizar los nombres (de `REDIS_*` a `VALKEY_*`)

## Troubleshooting

### Error: "Valkey not available"

1. Verifica que el servicio de Valkey esté corriendo en Railway
2. Confirma que las variables de entorno estén configuradas correctamente
3. Revisa los logs del servicio: `railway logs -s backend`

### Error: "Connection timeout"

1. Verifica que estés usando la red privada de Railway
2. Asegúrate de que ambos servicios estén en el mismo proyecto de Railway
3. Verifica el puerto (6379 para red privada, puerto dinámico para TCP proxy)

### La aplicación arranca pero no usa caché

Esto es normal. La aplicación está diseñada para funcionar sin caché:

1. Verifica los logs: `railway logs -s backend`
2. Busca mensajes: "⚠️ Valkey no disponible - continuando sin cache"
3. Esto no es un error crítico, pero deberías resolver la conexión a Valkey

## Métricas y Monitoreo

Accede a métricas detalladas:

```bash
# Health check detallado
curl https://tu-app.railway.app/health/detailed

# Ver estadísticas de Valkey
curl https://tu-app.railway.app/api/v1/cache/stats  # Si tienes este endpoint
```

## Recursos Adicionales

- [Valkey Documentation](https://valkey.io/docs/)
- [Railway Documentation](https://docs.railway.app/)
- [ioredis GitHub](https://github.com/redis/ioredis)
- [Valkey vs Redis Comparison](https://valkey.io/)

## Variables de Entorno Completas

Resumen de todas las variables necesarias para Railway:

```env
# Node
NODE_ENV=production
PORT=3000

# Database (PostgreSQL en Railway)
DB_HOST=${{Postgres.PGHOST}}
DB_PORT=${{Postgres.PGPORT}}
DB_NAME=${{Postgres.PGDATABASE}}
DB_USER=${{Postgres.PGUSER}}
DB_PASSWORD=${{Postgres.PGPASSWORD}}
DB_SSL=true

# Valkey (Caché)
VALKEY_HOST=${{Valkey.RAILWAY_PRIVATE_NETWORK_HOST}}
VALKEY_PORT=6379
VALKEY_PASSWORD=${{Valkey.VALKEY_PASSWORD}}
VALKEY_DB=0

# JWT
JWT_SECRET=your_production_secret_min_32_chars
JWT_EXPIRES_IN=7d
JWT_REFRESH_SECRET=your_refresh_secret_min_32_chars
JWT_REFRESH_EXPIRES_IN=30d

# Cloudinary (opcional)
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# CORS
CORS_ORIGIN=https://tu-dominio.com
CORS_CREDENTIALS=true
```
