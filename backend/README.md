# Backend Aguamarina Mosaicos

Backend profesional para tienda de cerámicos construido con Node.js, TypeScript, PostgreSQL y Clean Architecture.

## Características

- **Clean Architecture**: Separación clara de capas (Domain, Infrastructure, Application)
- **TypeScript**: Tipado estático para mayor seguridad
- **PostgreSQL**: Base de datos relacional robusta
- **JWT Authentication**: Autenticación segura con tokens
- **Validación con Zod**: Validación de datos robusta
- **Gestión de imágenes**: Integración con Cloudinary
- **API RESTful**: Endpoints bien estructurados
- **Logging profesional**: Winston para logs estructurados
- **Seguridad**: Helmet, CORS, Rate limiting
- **Migraciones y Seeds**: Gestión de esquema de base de datos

## Estructura del Proyecto

```
backend/
├── src/
│   ├── domain/                  # Lógica de negocio pura
│   │   ├── entities/            # Entidades (User, Product, Order, etc.)
│   │   └── repositories/        # Interfaces de repositorios
│   ├── infrastructure/          # Implementaciones técnicas
│   │   ├── database/            # Conexión, migraciones, seeds
│   │   ├── repositories/        # Implementación de repositorios
│   │   ├── security/            # JWT, bcrypt
│   │   └── storage/             # Cloudinary
│   ├── application/             # Capa de aplicación
│   │   ├── controllers/         # Controladores REST
│   │   ├── middleware/          # Auth, validación, errores
│   │   └── routes/              # Definición de rutas
│   ├── shared/                  # Código compartido
│   │   ├── errors/              # Errores personalizados
│   │   └── utils/               # Utilidades (logger, etc.)
│   ├── config/                  # Configuración
│   └── server.ts                # Punto de entrada
├── .env.example                 # Variables de entorno de ejemplo
├── package.json
└── tsconfig.json
```

## Requisitos Previos

- **Node.js** >= 18.0.0
- **npm** >= 9.0.0
- **PostgreSQL** >= 14.0

## Instalación

### 1. Instalar dependencias

\`\`\`bash
cd D:\\aguamarina-mosaicos\\backend
npm install
\`\`\`

### 2. Configurar variables de entorno

Copia el archivo \`.env.example\` a \`.env\` y configura tus valores:

\`\`\`bash
cp .env.example .env
\`\`\`

Edita el archivo \`.env\` con tus credenciales:

\`\`\`env
# Base de datos PostgreSQL
DB_HOST=localhost
DB_PORT=5432
DB_NAME=aguamarina_mosaicos
DB_USER=postgres
DB_PASSWORD=tu_contraseña

# JWT (¡IMPORTANTE! Cambia estos valores)
JWT_SECRET=tu_clave_secreta_super_segura_aqui
JWT_REFRESH_SECRET=tu_refresh_secret_aqui

# Cloudinary (opcional al inicio)
CLOUDINARY_CLOUD_NAME=tu_cloud_name
CLOUDINARY_API_KEY=tu_api_key
CLOUDINARY_API_SECRET=tu_api_secret
\`\`\`

### 3. Crear base de datos PostgreSQL

\`\`\`bash
# Conectarse a PostgreSQL
psql -U postgres

# Crear la base de datos
CREATE DATABASE aguamarina_mosaicos;

# Salir
\\q
\`\`\`

### 4. Ejecutar migraciones

\`\`\`bash
npm run db:migrate
\`\`\`

### 5. Ejecutar seeds (datos de prueba)

\`\`\`bash
npm run db:seed
\`\`\`

## Comandos Disponibles

\`\`\`bash
# Desarrollo (con hot-reload)
npm run dev

# Build para producción
npm run build

# Ejecutar en producción
npm start

# Base de datos
npm run db:migrate    # Ejecutar migraciones
npm run db:seed       # Cargar datos de prueba
npm run db:reset      # ⚠️ Resetear base de datos (BORRA TODO)

# Calidad de código
npm run lint          # Linter
npm run format        # Formatear código
npm test              # Tests (cuando se implementen)
\`\`\`

## Base de Datos

### Tablas Principales

1. **users** - Usuarios (admin, manager, customer)
2. **categories** - Categorías de productos (jerárquicas)
3. **products** - Productos (cerámicos)
4. **product_images** - Imágenes de productos
5. **customers** - Datos extendidos de clientes
6. **addresses** - Direcciones de envío
7. **orders** - Pedidos
8. **order_items** - Items de pedidos
9. **inventory_movements** - Movimientos de stock
10. **refresh_tokens** - Tokens de refresco
11. **audit_logs** - Auditoría de cambios

### Usuario Admin por Defecto

Después de ejecutar los seeds, puedes acceder con:

- **Email**: admin@aguamarina.com
- **Password**: Admin123!

⚠️ **IMPORTANTE**: Cambia esta contraseña inmediatamente en producción.

## API Endpoints (Planificados)

### Autenticación
- \`POST /api/v1/auth/register\` - Registrar usuario
- \`POST /api/v1/auth/login\` - Login
- \`POST /api/v1/auth/refresh\` - Refrescar token
- \`POST /api/v1/auth/logout\` - Logout

### Productos
- \`GET /api/v1/products\` - Listar productos
- \`GET /api/v1/products/:id\` - Obtener producto
- \`POST /api/v1/products\` - Crear producto (admin)
- \`PUT /api/v1/products/:id\` - Actualizar producto (admin)
- \`DELETE /api/v1/products/:id\` - Eliminar producto (admin)
- \`GET /api/v1/products/search\` - Buscar productos

### Categorías
- \`GET /api/v1/categories\` - Listar categorías
- \`GET /api/v1/categories/:id\` - Obtener categoría
- \`POST /api/v1/categories\` - Crear categoría (admin)
- \`PUT /api/v1/categories/:id\` - Actualizar categoría (admin)
- \`DELETE /api/v1/categories/:id\` - Eliminar categoría (admin)

### Pedidos
- \`GET /api/v1/orders\` - Listar pedidos
- \`GET /api/v1/orders/:id\` - Obtener pedido
- \`POST /api/v1/orders\` - Crear pedido
- \`PUT /api/v1/orders/:id\` - Actualizar estado (admin)

### Dashboard Admin
- \`GET /api/v1/dashboard/stats\` - Estadísticas generales
- \`GET /api/v1/dashboard/products/low-stock\` - Productos con stock bajo
- \`GET /api/v1/dashboard/orders/recent\` - Pedidos recientes

## Seguridad

- **Helmet**: Headers de seguridad HTTP
- **CORS**: Control de acceso cross-origin
- **Rate Limiting**: Protección contra fuerza bruta
- **JWT**: Tokens seguros con expiración
- **Bcrypt**: Hash de contraseñas con salt
- **Validación**: Zod para validar datos de entrada
- **SQL Injection**: Protección con queries parametrizadas

## Desarrollo

### Agregar una nueva entidad

1. Crear interfaz en \`src/domain/entities/\`
2. Crear repositorio en \`src/domain/repositories/\`
3. Implementar repositorio en \`src/infrastructure/repositories/\`
4. Crear controlador en \`src/application/controllers/\`
5. Definir rutas en \`src/application/routes/\`

### Testing

\`\`\`bash
# Ejecutar tests (cuando se implementen)
npm test

# Coverage
npm run test:coverage
\`\`\`

## Despliegue

### Variables de entorno en producción

Asegúrate de configurar:
- \`NODE_ENV=production\`
- \`JWT_SECRET\` (valor único y seguro)
- \`DB_PASSWORD\` (contraseña segura)
- Credenciales de Cloudinary

### Build y ejecución

\`\`\`bash
npm run build
npm start
\`\`\`

## Próximos Pasos

1. ✅ Estructura del proyecto
2. ✅ Base de datos y migraciones
3. ✅ Entidades del dominio
4. ✅ Configuración y middleware
5. 🔄 Implementar controladores y rutas completas
6. 🔄 Implementar casos de uso
7. 🔄 Agregar tests unitarios e integración
8. 🔄 Documentación con Swagger
9. 🔄 CI/CD Pipeline
10. 🔄 Docker y Docker Compose

## Recursos

- [Documentación TypeScript](https://www.typescriptlang.org/docs/)
- [Node.js Best Practices](https://github.com/goldbergyoni/nodebestpractices)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
- [Clean Architecture](https://blog.cleancoder.com/uncle-bob/2012/08/13/the-clean-architecture.html)

## Licencia

MIT

## Contacto

Para soporte o preguntas, contacta al equipo de desarrollo de Aguamarina Mosaicos.
