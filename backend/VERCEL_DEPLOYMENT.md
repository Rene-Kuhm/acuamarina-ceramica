# Guía de Despliegue en Vercel - Backend Aguamarina Cerámicos

## Cambios Realizados para Producción

### 1. Arquitectura Serverless
- **Creado `src/app.ts`**: Aplicación Express exportable sin servidor HTTP
- **Creado `api/index.ts`**: Punto de entrada serverless con lazy initialization
- **Actualizado `vercel.json`**: Configuración completa con builds y routes
- **Actualizado `package.json`**: Main apunta a `api/index.ts`

### 2. Configuración de Variables de Entorno

Las siguientes variables de entorno deben configurarse en Vercel Dashboard:

#### Variables Requeridas
```bash
# Database
DATABASE_URL=postgresql://user:password@host:5432/database

# JWT
JWT_SECRET=your_super_secret_jwt_key_change_this
JWT_EXPIRES_IN=7d

# CORS
CORS_ORIGIN=https://your-frontend.vercel.app,https://your-admin.vercel.app
CORS_CREDENTIALS=true

# Node Environment
NODE_ENV=production
API_VERSION=v1
```

#### Variables Opcionales
```bash
# Redis (para caching)
REDIS_URL=redis://default:password@host:6379

# Cloudinary (para imágenes)
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

## Pasos para Desplegar

### 1. Preparar la Base de Datos

Asegúrate de tener una base de datos PostgreSQL accesible desde internet (ej: Supabase, Neon, Railway):

```bash
# Ejecutar migraciones (desde tu entorno local conectado a la DB de producción)
npm run db:migrate

# Opcional: Cargar datos de prueba
npm run db:seed
```

### 2. Desplegar en Vercel

#### Opción A: Vercel CLI
```bash
# Instalar Vercel CLI (si no lo tienes)
npm install -g vercel

# Login
vercel login

# Deploy
vercel --prod
```

#### Opción B: GitHub Integration
1. Conecta tu repositorio con Vercel
2. Configura las variables de entorno en Vercel Dashboard
3. Push a main branch para deploy automático

### 3. Configurar Variables de Entorno en Vercel

1. Ve a tu proyecto en [vercel.com](https://vercel.com)
2. Settings → Environment Variables
3. Agrega todas las variables requeridas
4. Redeploy si es necesario

### 4. Verificar el Despliegue

Una vez desplegado, verifica:

```bash
# Health check básico
curl https://tu-backend.vercel.app/health

# Health check detallado
curl https://tu-backend.vercel.app/health/detailed

# API info
curl https://tu-backend.vercel.app/api/v1

# Documentación
https://tu-backend.vercel.app/api-docs
```

## Características Serverless Implementadas

### Lazy Initialization
- Las conexiones a DB y Redis se inicializan solo cuando llega la primera petición
- El estado se mantiene entre invocaciones en la misma instancia
- Retry automático si falla la inicialización

### Connection Pooling
- Pool de conexiones PostgreSQL configurado para serverless (max: 5)
- Reutilización de conexiones entre invocaciones
- Timeout configurado para evitar conexiones colgadas

### Error Handling
- Manejo de errores robusto con logs estructurados
- Respuestas HTTP adecuadas en caso de fallo
- No expone detalles internos en producción

## Consideraciones Importantes

### Límites de Vercel
- **Timeout**: 10 segundos por función (configurable hasta 900s en Pro)
- **Memoria**: 1024 MB (configurable en vercel.json)
- **Payload**: 4.5 MB request, 4.5 MB response
- **Región**: US East (iad1) - cambiar según necesidades

### Base de Datos
- Usar DATABASE_URL con connection pooling (ej: Supabase Pooler)
- Configurar SSL en producción (`DB_SSL=true`)
- Limitar conexiones simultáneas (recomendado: 5-10)

### Redis (Opcional)
- No es crítico, la app funciona sin Redis
- Útil para caching y mejorar performance
- Considerar Upstash Redis para serverless

### Imágenes
- Cloudinary configurado para uploads
- Alternativa: Vercel Blob Storage
- Considerar CDN para servir imágenes estáticas

## Monitoreo y Logs

### Ver Logs en Vercel
```bash
vercel logs
```

### Métricas Disponibles
- `/health` - Health check básico
- `/health/ready` - Readiness con DB y Redis
- `/health/detailed` - Métricas completas del sistema

### Alertas Recomendadas
- Error rate > 5%
- Response time > 2s
- Database connection failures
- Memory usage > 80%

## Troubleshooting

### Error: Database connection failed
- Verificar DATABASE_URL en variables de entorno
- Comprobar que la DB acepta conexiones desde Vercel IPs
- Verificar SSL configuration

### Error: Function timeout
- Optimizar queries de base de datos
- Agregar índices necesarios
- Considerar aumentar timeout en vercel.json

### Error: Module not found
- Verificar que todas las dependencias estén en `dependencies` (no en `devDependencies`)
- Limpiar caché: `vercel --force`

### Error: CORS issues
- Verificar CORS_ORIGIN en variables de entorno
- Incluir todos los dominios frontend necesarios
- Verificar protocolo (https vs http)

## Optimizaciones Futuras

### Performance
- [ ] Implementar caching con Redis
- [ ] Optimizar queries con índices
- [ ] Implementar CDN para assets estáticos
- [ ] Rate limiting por usuario autenticado

### Seguridad
- [ ] Implementar API key rotation
- [ ] Agregar request signing
- [ ] Implementar audit logging
- [ ] Configurar Vercel Firewall

### Monitoring
- [ ] Integrar APM (New Relic, Datadog)
- [ ] Configurar alertas en Slack/Email
- [ ] Dashboard de métricas custom
- [ ] Implementar distributed tracing

## Recursos

- [Vercel Serverless Functions Docs](https://vercel.com/docs/functions/serverless-functions)
- [Express on Vercel](https://vercel.com/docs/frameworks/backend/express)
- [Vercel Environment Variables](https://vercel.com/docs/projects/environment-variables)
- [Vercel CLI Reference](https://vercel.com/docs/cli)

## Soporte

Para problemas o preguntas:
1. Verificar logs en Vercel Dashboard
2. Revisar esta documentación
3. Consultar [Vercel Support](https://vercel.com/support)
