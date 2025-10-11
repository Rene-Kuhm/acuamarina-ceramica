# 🚀 Inicio Rápido - Backend Aguamarina Mosaicos

## ⚡ Pasos para empezar EN 5 MINUTOS

### 1️⃣ Instalar PostgreSQL (si no lo tienes)

**Windows:**
- Descarga desde: https://www.postgresql.org/download/windows/
- Instala con las opciones por defecto
- Anota la contraseña que asignes al usuario `postgres`

**Verificar instalación:**
\`\`\`bash
psql --version
\`\`\`

### 2️⃣ Instalar dependencias Node

\`\`\`bash
cd D:\\aguamarina-mosaicos\\backend
npm install
\`\`\`

Esto instalará:
- Express (servidor web)
- PostgreSQL driver
- TypeScript
- JWT para autenticación
- Y todas las dependencias necesarias...

### 3️⃣ Crear archivo .env

\`\`\`bash
# En Windows PowerShell:
Copy-Item .env.example .env

# O simplemente copia manualmente el archivo .env.example y renómbralo a .env
\`\`\`

**Edita el archivo .env** con tus datos:

\`\`\`env
# MÍNIMO NECESARIO PARA EMPEZAR:

DB_HOST=localhost
DB_PORT=5432
DB_NAME=aguamarina_mosaicos
DB_USER=postgres
DB_PASSWORD=TU_CONTRASEÑA_POSTGRES_AQUI  ⬅️ CÁMBIALA

JWT_SECRET=mi_super_clave_secreta_123456  ⬅️ CÁMBIALA
JWT_REFRESH_SECRET=mi_refresh_secret_123  ⬅️ CÁMBIALA

# El resto puede dejarse como está por ahora
\`\`\`

### 4️⃣ Crear la base de datos

**Opción A - Desde línea de comandos:**
\`\`\`bash
# Conectar a PostgreSQL
psql -U postgres

# Crear la base de datos
CREATE DATABASE aguamarina_mosaicos;

# Verificar que se creó
\\l

# Salir
\\q
\`\`\`

**Opción B - Desde pgAdmin:**
1. Abre pgAdmin
2. Click derecho en "Databases"
3. Create → Database
4. Nombre: `aguamarina_mosaicos`
5. Save

### 5️⃣ Ejecutar migraciones (crear tablas)

\`\`\`bash
npm run db:migrate
\`\`\`

Esto creará todas las tablas:
- users
- products
- categories
- orders
- Y 7 tablas más...

### 6️⃣ Cargar datos de prueba

\`\`\`bash
npm run db:seed
\`\`\`

Esto creará:
- ✅ Usuario admin (admin@aguamarina.com / Admin123!)
- ✅ 5 categorías de productos
- ✅ 2 productos de ejemplo

### 7️⃣ Iniciar el servidor

\`\`\`bash
npm run dev
\`\`\`

Verás algo como:
\`\`\`
===========================================
🚀 Servidor Aguamarina Mosaicos iniciado
   Entorno: development
   Puerto: 3000
   API: http://localhost:3000/api/v1
===========================================
\`\`\`

### 8️⃣ Probar que funciona

Abre tu navegador o Postman:

**Health Check:**
\`\`\`
GET http://localhost:3000/health
\`\`\`

Respuesta:
\`\`\`json
{
  "status": "ok",
  "timestamp": "2024-01-10T...",
  "environment": "development"
}
\`\`\`

**Info API:**
\`\`\`
GET http://localhost:3000/api/v1
\`\`\`

---

## ✅ ¡Listo! Ahora tienes:

- ✅ Servidor corriendo en puerto 3000
- ✅ Base de datos con 11 tablas
- ✅ Usuario admin creado
- ✅ Productos de ejemplo
- ✅ Sistema de autenticación JWT
- ✅ Logs en consola y archivos

---

## 🔧 Comandos útiles

\`\`\`bash
# Ver logs en tiempo real
npm run dev

# Reiniciar base de datos (⚠️ BORRA TODO)
npm run db:reset
npm run db:migrate
npm run db:seed

# Formatear código
npm run format

# Verificar errores
npm run lint

# Build para producción
npm run build
npm start
\`\`\`

---

## 🗄️ Conectar a la base de datos

### Con pgAdmin:
1. Servers → PostgreSQL → Databases
2. Busca `aguamarina_mosaicos`
3. Explora las tablas en Schemas → public → Tables

### Con DBeaver / DataGrip / etc:
- Host: localhost
- Port: 5432
- Database: aguamarina_mosaicos
- User: postgres
- Password: (la que pusiste)

---

## 🎯 Próximos pasos (desarrollo)

### Opción 1: Continuar con la API REST
1. Implementar controladores faltantes
2. Crear rutas completas
3. Validadores con Zod

### Opción 2: Probar el sistema
1. Usar Postman/Thunder Client
2. Probar endpoints existentes
3. Crear productos manualmente en DB

### Opción 3: Frontend
1. Crear dashboard admin
2. Conectar con este backend
3. Formularios de gestión

---

## ❓ Problemas comunes

### Error: "password authentication failed"
- Verifica la contraseña en .env
- Asegúrate que PostgreSQL está corriendo

### Error: "database aguamarina_mosaicos does not exist"
- Ejecuta: \`createdb aguamarina_mosaicos\`
- O créala desde pgAdmin

### Error: "Cannot find module"
- Ejecuta: \`npm install\`

### Error: "Port 3000 is already in use"
- Cambia PORT en .env a otro (ej: 3001)
- O mata el proceso: \`npx kill-port 3000\`

### Error en migraciones
- Verifica que PostgreSQL esté corriendo
- Verifica credenciales en .env
- Si falla, resetea: \`npm run db:reset\`

---

## 📞 Necesitas ayuda?

1. Lee el README.md completo
2. Revisa ESTRUCTURA.md para ver el código
3. Busca en los logs (carpeta \`logs/\`)

---

## 🎉 Tips Pro

1. **Instala extensiones VSCode:**
   - Thunder Client (testing API)
   - PostgreSQL (gestión DB)
   - Prettier (formateo)
   - ESLint (linting)

2. **Variables de entorno:**
   - NUNCA subas .env a Git
   - Usa valores seguros en producción

3. **Base de datos:**
   - Haz backups frecuentes
   - Usa db:reset solo en desarrollo

4. **Desarrollo:**
   - El servidor se reinicia automáticamente al guardar
   - Los logs están en \`logs/all.log\`

---

**¡Éxito con tu proyecto Aguamarina Mosaicos!** 🏺✨
