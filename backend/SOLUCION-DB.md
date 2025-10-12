# 🔧 Solución: Base de Datos No Existe

## ❌ Error Actual:
```
no existe la base de datos "aguamarina_mosaicos"
```

---

## ✅ **OPCIÓN 1: Usar Docker (RECOMENDADO)**

Esta es la forma más fácil y rápida.

### Paso 1: Iniciar Docker Desktop

1. **Abre Docker Desktop** (el programa con el logo de la ballena)
2. Espera a que inicie completamente (hasta que diga "Docker Desktop is running")

### Paso 2: Levantar los contenedores

```bash
cd D:\acuamarina-ceramicos\backend

# Levantar PostgreSQL + Redis
docker-compose up -d postgres redis

# Verificar que están corriendo
docker-compose ps
```

Deberías ver:
```
aguamarina-postgres   running
aguamarina-redis      running
```

### Paso 3: La base de datos se crea automáticamente!

Docker ya creó la base de datos con el archivo `setup-db.sql`.

### Paso 4: Ejecutar migraciones y seed

```bash
npm run db:migrate
npm run db:seed
```

### Paso 5: Iniciar el backend

```bash
npm run dev
```

✅ **¡Listo! El backend debería estar corriendo en http://localhost:3000**

---

## ✅ **OPCIÓN 2: PostgreSQL Local (Sin Docker)**

Si no quieres usar Docker y tienes PostgreSQL instalado localmente:

### Paso 1: Crear la base de datos

```bash
cd D:\acuamarina-ceramicos\backend

# Este script crea la base de datos automáticamente
npm run db:create
```

Deberías ver:
```
✓ Conectado a PostgreSQL
✓ Base de datos 'aguamarina_mosaicos' creada exitosamente
```

### Paso 2: Ejecutar setup completo

```bash
# Esto crea la DB, las tablas y los datos de prueba
npm run db:setup
```

### Paso 3: Iniciar el backend

```bash
npm run dev
```

✅ **¡Listo! El backend debería estar corriendo en http://localhost:3000**

---

## 🐛 Problemas Comunes

### 1. "no existe la base de datos"
- **Solución**: Ejecuta `npm run db:create`

### 2. "password authentication failed"
- **Solución**: Verifica el password en `.env`:
```env
DB_PASSWORD=198540  ⬅️ Debe coincidir con tu password de PostgreSQL
```

### 3. "could not connect to server"
- **Solución**:
  - Docker: Inicia Docker Desktop y ejecuta `docker-compose up -d postgres`
  - Local: Verifica que PostgreSQL esté corriendo en Windows Services

### 4. "puerto 5432 ya está en uso"
- **Solución**: Ya tienes PostgreSQL corriendo localmente
  - Usa la Opción 2 (PostgreSQL Local)
  - O detén PostgreSQL local y usa Docker

---

## 📊 Scripts Útiles

```bash
# Setup completo (crear DB + tablas + datos)
npm run db:setup

# Solo crear la base de datos
npm run db:create

# Solo crear las tablas
npm run db:migrate

# Solo insertar datos de prueba
npm run db:seed

# Resetear todo (¡CUIDADO! Borra todo)
npm run db:reset
```

---

## 🎯 Verificar que todo funciona

Una vez que el backend esté corriendo:

1. **Health Check**:
   - http://localhost:3000/health
   - Debería responder: `{"status":"ok"}`

2. **Swagger API Docs**:
   - http://localhost:3000/api-docs
   - Documentación interactiva de la API

3. **Login de prueba**:
```bash
curl -X POST http://localhost:3000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@aguamarina.com","password":"Admin123!"}'
```

---

## 💡 Recomendación

**USA DOCKER (Opción 1)** porque:
- ✅ No afecta tu sistema
- ✅ Todo está aislado en contenedores
- ✅ Fácil de limpiar o resetear
- ✅ Incluye Redis para cache
- ✅ Configuración profesional

---

## 🆘 Ayuda Adicional

Si sigues teniendo problemas:

1. Verifica el archivo `.env`:
```bash
cat .env | grep DB_
```

2. Verifica que PostgreSQL esté corriendo:
```bash
# Docker
docker-compose ps postgres

# Local Windows
# Ve a Services y busca "PostgreSQL"
```

3. Lee los logs:
```bash
# Docker
docker-compose logs postgres

# Backend
npm run dev
# (los errores aparecerán aquí)
```
