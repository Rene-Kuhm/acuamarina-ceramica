# Estructura Completa del Backend - Acuamarina Cerámicos

## 📁 Árbol de Directorios

\`\`\`
D:\\acuamarina-ceramicos\\backend\\
│
├── 📄 package.json                    # Dependencias y scripts
├── 📄 tsconfig.json                   # Configuración TypeScript
├── 📄 .env.example                    # Variables de entorno ejemplo
├── 📄 .gitignore                      # Archivos ignorados por Git
├── 📄 .prettierrc                     # Configuración Prettier
├── 📄 .eslintrc.json                  # Configuración ESLint
├── 📄 README.md                       # Documentación principal
├── 📄 ESTRUCTURA.md                   # Este archivo
│
├── 📂 src/
│   ├── 📂 domain/                     # CAPA DE DOMINIO (Lógica de negocio)
│   │   ├── 📂 entities/               # Entidades del dominio
│   │   │   ├── User.ts                # ✅ Entidad Usuario
│   │   │   ├── Product.ts             # ✅ Entidad Producto
│   │   │   ├── Category.ts            # ✅ Entidad Categoría
│   │   │   ├── ProductImage.ts        # ✅ Entidad Imagen de Producto
│   │   │   ├── Order.ts               # ✅ Entidad Pedido
│   │   │   ├── Customer.ts            # ✅ Entidad Cliente
│   │   │   └── Address.ts             # ✅ Entidad Dirección
│   │   │
│   │   └── 📂 repositories/           # Interfaces de repositorios
│   │       ├── IUserRepository.ts     # ✅ Interface User Repo
│   │       ├── IProductRepository.ts  # ✅ Interface Product Repo
│   │       ├── ICategoryRepository.ts # ✅ Interface Category Repo
│   │       └── IOrderRepository.ts    # ✅ Interface Order Repo
│   │
│   ├── 📂 infrastructure/             # CAPA DE INFRAESTRUCTURA (Implementaciones)
│   │   ├── 📂 database/               # PostgreSQL
│   │   │   ├── connection.ts          # ✅ Conexión a DB con Pool
│   │   │   ├── schema.sql             # ✅ Schema SQL completo
│   │   │   ├── migrate.ts             # ✅ Script de migraciones
│   │   │   ├── seed.ts                # ✅ Script de seeds
│   │   │   └── reset.ts               # ✅ Script reset DB
│   │   │
│   │   ├── 📂 repositories/           # Implementaciones de repositorios
│   │   │   ├── ProductRepository.ts   # ✅ Implementación Product
│   │   │   ├── UserRepository.ts      # 🔄 Pendiente
│   │   │   ├── CategoryRepository.ts  # 🔄 Pendiente
│   │   │   └── OrderRepository.ts     # 🔄 Pendiente
│   │   │
│   │   ├── 📂 security/               # Seguridad
│   │   │   ├── jwt.ts                 # ✅ Servicio JWT
│   │   │   └── bcrypt.ts              # ✅ Servicio Password
│   │   │
│   │   └── 📂 storage/                # Almacenamiento
│   │       └── cloudinary.ts          # 🔄 Servicio Cloudinary
│   │
│   ├── 📂 application/                # CAPA DE APLICACIÓN (Controllers, Routes)
│   │   ├── 📂 controllers/            # Controladores REST
│   │   │   ├── AuthController.ts      # 🔄 Autenticación
│   │   │   ├── ProductController.ts   # 🔄 Productos
│   │   │   ├── CategoryController.ts  # 🔄 Categorías
│   │   │   ├── OrderController.ts     # 🔄 Pedidos
│   │   │   └── DashboardController.ts # 🔄 Dashboard Admin
│   │   │
│   │   ├── 📂 routes/                 # Definición de rutas
│   │   │   ├── index.ts               # 🔄 Router principal
│   │   │   ├── auth.routes.ts         # 🔄 Rutas auth
│   │   │   ├── products.routes.ts     # 🔄 Rutas productos
│   │   │   ├── categories.routes.ts   # 🔄 Rutas categorías
│   │   │   └── orders.routes.ts       # 🔄 Rutas pedidos
│   │   │
│   │   ├── 📂 middleware/             # Middleware
│   │   │   ├── auth.ts                # ✅ Autenticación JWT
│   │   │   ├── errorHandler.ts        # ✅ Manejo de errores
│   │   │   └── validate.ts            # ✅ Validación con Zod
│   │   │
│   │   └── 📂 validators/             # Schemas Zod
│   │       ├── product.validator.ts   # 🔄 Validaciones producto
│   │       ├── auth.validator.ts      # 🔄 Validaciones auth
│   │       └── order.validator.ts     # 🔄 Validaciones pedido
│   │
│   ├── 📂 shared/                     # CÓDIGO COMPARTIDO
│   │   ├── 📂 errors/                 # Errores personalizados
│   │   │   └── AppError.ts            # ✅ Clase base de errores
│   │   │
│   │   └── 📂 utils/                  # Utilidades
│   │       ├── logger.ts              # ✅ Winston logger
│   │       └── slugify.ts             # 🔄 Generador slugs
│   │
│   ├── 📂 config/                     # CONFIGURACIÓN
│   │   └── environment.ts             # ✅ Variables de entorno
│   │
│   └── 📄 server.ts                   # ✅ PUNTO DE ENTRADA
│
├── 📂 dist/                           # Build de producción (auto-generado)
├── 📂 logs/                           # Archivos de log (auto-generado)
└── 📂 node_modules/                   # Dependencias (auto-generado)
\`\`\`

## 🎯 Estado del Proyecto

### ✅ Completado (Base sólida)

1. **Configuración inicial**
   - package.json con todas las dependencias
   - TypeScript configurado
   - ESLint + Prettier
   - Variables de entorno

2. **Base de datos**
   - Schema SQL completo (11 tablas)
   - Triggers automáticos
   - Índices optimizados
   - Vistas útiles
   - Scripts de migración y seed

3. **Dominio (Entities + Repositories)**
   - 7 entidades principales
   - 4 interfaces de repositorios
   - DTOs para crear/actualizar

4. **Infraestructura**
   - Conexión PostgreSQL con Pool
   - Transacciones
   - JWT service completo
   - Password hashing y validación
   - Logger profesional con Winston

5. **Seguridad**
   - Middleware de autenticación
   - Middleware de autorización por roles
   - Manejo de errores centralizado
   - Validación con Zod

6. **Servidor**
   - Express configurado
   - Helmet, CORS, Rate limiting
   - Compresión
   - Health check
   - Logging de requests

### 🔄 Pendiente (Próxima fase)

1. **Repositorios restantes**
   - UserRepository
   - CategoryRepository
   - OrderRepository
   - AddressRepository

2. **Controladores**
   - AuthController (login, register, refresh)
   - ProductController (CRUD completo)
   - CategoryController (CRUD)
   - OrderController (crear, listar, actualizar)
   - DashboardController (estadísticas)

3. **Rutas**
   - Definir todas las rutas REST
   - Conectar con controladores
   - Aplicar middleware de auth

4. **Validadores**
   - Schemas Zod para cada entidad
   - Validaciones de negocio

5. **Casos de uso**
   - CreateProduct
   - ProcessOrder
   - UpdateInventory
   - etc.

6. **Storage**
   - Servicio Cloudinary
   - Upload de imágenes
   - Resize automático

7. **Documentación**
   - Swagger/OpenAPI
   - Ejemplos de requests

8. **Testing**
   - Tests unitarios
   - Tests de integración
   - Tests E2E

## 📊 Esquema de Base de Datos

### Tablas principales:

1. **users** → Usuarios del sistema (admin, manager, customer)
2. **categories** → Categorías jerárquicas de productos
3. **products** → Productos (cerámicos)
4. **product_images** → Múltiples imágenes por producto
5. **customers** → Info extendida de clientes
6. **addresses** → Direcciones de envío
7. **orders** → Pedidos
8. **order_items** → Items de cada pedido
9. **inventory_movements** → Control de stock
10. **refresh_tokens** → Tokens JWT
11. **audit_logs** → Auditoría completa

### Relaciones:

\`\`\`
users ──< customers
users ──< addresses
users ──< orders
users ──< audit_logs

categories ──< categories (self-reference jerárquica)
categories ──< products

products ──< product_images
products ──< order_items
products ──< inventory_movements

orders ──< order_items
\`\`\`

## 🔐 Roles y Permisos

### Admin
- Acceso total
- CRUD productos, categorías
- Ver/modificar todos los pedidos
- Gestión de usuarios
- Acceso al dashboard

### Manager
- CRUD productos
- Ver pedidos
- Actualizar estado de pedidos
- Gestión de inventario

### Customer
- Ver productos y categorías
- Crear pedidos
- Ver sus propios pedidos
- Gestionar su perfil

## 🚀 Comandos Rápidos

\`\`\`bash
# 1. Instalar
npm install

# 2. Configurar .env
cp .env.example .env
# Editar .env con tus credenciales

# 3. Crear DB
createdb acuamarina_ceramicos

# 4. Migrar
npm run db:migrate

# 5. Seeds
npm run db:seed

# 6. Desarrollo
npm run dev

# 7. Build
npm run build

# 8. Producción
npm start
\`\`\`

## 📈 Próximos Pasos Sugeridos

1. **Inmediato**: Implementar AuthController y rutas de autenticación
2. **Corto plazo**: CRUD completo de productos con imágenes
3. **Medio plazo**: Sistema de pedidos funcional
4. **Largo plazo**: Dashboard admin con estadísticas

## 🛠️ Stack Tecnológico

- **Runtime**: Node.js 18+
- **Lenguaje**: TypeScript 5.3
- **Framework**: Express 4.18
- **Base de datos**: PostgreSQL 14+
- **ORM/Query**: pg (node-postgres)
- **Autenticación**: JWT (jsonwebtoken)
- **Validación**: Zod
- **Logging**: Winston
- **Seguridad**: Helmet, bcryptjs
- **Storage**: Cloudinary
- **Testing**: Jest (pendiente)
- **Docs**: Swagger (pendiente)

---

**Estado actual**: 60% completado
**Listo para**: Desarrollo de controllers y rutas
**Siguiente milestone**: API REST funcional con autenticación
