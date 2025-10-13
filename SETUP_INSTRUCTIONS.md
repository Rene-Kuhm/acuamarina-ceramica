# 🚀 INSTRUCCIONES DE SETUP - AGUAMARINA CERAMICOS

## ✅ ESTADO ACTUAL

- ✅ Base de datos Supabase creada
- ✅ Archivos `.env` configurados (backend, frontend, admin)
- ✅ DATABASE_URL configurado
- ⏳ PENDIENTE: Ejecutar SQL en Supabase

---

## 📋 PASO 1: EJECUTAR SQL EN SUPABASE (5 minutos)

### **Método: SQL Editor (Web)**

1. **Abrir Supabase**
   ```
   https://supabase.com/dashboard/project/umyrvlzhvdsibpzvfnal
   ```

2. **Ir a SQL Editor**
   - Click en "SQL Editor" en el menú lateral izquierdo
   - Click en "+ New query"

3. **Copiar y pegar el SQL**
   - Abrir el archivo: `supabase-setup.sql`
   - Copiar TODO el contenido (Ctrl+A, Ctrl+C)
   - Pegar en el editor de Supabase (Ctrl+V)

4. **Ejecutar**
   - Click en el botón verde "Run" (esquina inferior derecha)
   - Esperar ~10 segundos

5. **Verificar resultado**
   Deberías ver algo como:
   ```
   table_name  | row_count
   ------------|----------
   categories  | 4
   products    | 6
   users       | 1
   reviews     | 3
   ```

   ✅ Si ves esto, la base de datos está lista!

---

## 🎯 PASO 2: PROBAR CONEXIÓN DESDE BACKEND

```bash
# Terminal 1: Iniciar Backend
cd backend
npm install
npm run start:dev

# Debería mostrar:
# ✓ Database connected successfully
# ✓ Server running on http://localhost:3000
```

**Probar endpoints:**
```bash
# En navegador o curl:
http://localhost:3000/api/categories
http://localhost:3000/api/products

# Deberías ver JSON con datos
```

---

## 🎨 PASO 3: INICIAR FRONTEND

```bash
# Terminal 2: Iniciar Frontend
cd frontend
npm install
npm run dev

# Abrir: http://localhost:3001
```

**Verificar:**
- ✅ Homepage carga
- ✅ Se ven las 4 categorías
- ✅ Click en "Ver Productos" muestra los 6 productos
- ✅ Puedes agregar al carrito

---

## 👨‍💼 PASO 4: INICIAR ADMIN DASHBOARD

```bash
# Terminal 3: Iniciar Admin
cd admin-dashboard
npm install
npm run dev

# Abrir: http://localhost:3002
```

**Login:**
- Email: `admin@aguamarina.com`
- Password: `admin123`

**Verificar:**
- ✅ Login funciona
- ✅ Dashboard muestra estadísticas
- ✅ Puedes ver productos, categorías, pedidos

---

## 🔍 VERIFICACIÓN COMPLETA

### **Backend** (http://localhost:3000)
```bash
# Probar estos endpoints:
GET /api/health              → {status: "ok"}
GET /api/categories          → [4 categorías]
GET /api/products            → [6 productos]
GET /api/products/featured   → [4 productos destacados]
POST /api/auth/register      → Crear usuario
POST /api/auth/login         → Login usuario
```

### **Frontend** (http://localhost:3001)
- ✅ Homepage con hero section
- ✅ 4 categorías visibles
- ✅ 6 productos en catálogo
- ✅ Carrito funcional
- ✅ Favoritos funcional
- ✅ Comparador funcional (hasta 4 productos)
- ✅ Login/Register funcional

### **Admin** (http://localhost:3002)
- ✅ Login con admin@aguamarina.com
- ✅ Dashboard con métricas
- ✅ CRUD de productos
- ✅ CRUD de categorías
- ✅ Ver pedidos
- ✅ Ver usuarios

---

## 🗄️ DATOS EN LA BASE DE DATOS

### **Categorías (4)**
1. Mosaicos Cerámicos
2. Azulejos Decorativos
3. Revestimientos
4. Pisos Cerámicos

### **Productos (6)**
1. Mosaico Veneciano Blanco 30x30 - $1,250
2. Azulejo Geométrico Azul 20x20 - $890
3. Revestimiento Símil Madera 15x90 - $2,100
4. Piso Porcelanato Gris 60x60 - $1,580
5. Mosaico Hidráulico Vintage - $1,890
6. Azulejo Subway Blanco 7.5x15 - $450

### **Usuario Admin (1)**
- Email: admin@aguamarina.com
- Password: admin123
- Role: admin

### **Reviews (3)**
- 3 reviews de ejemplo en diferentes productos

---

## ⚠️ TROUBLESHOOTING

### **Error: "Database connection failed"**
```bash
# Verificar DATABASE_URL en backend/.env
# Asegúrate que la contraseña no tenga caracteres especiales sin escapar
# La @ en la contraseña debe estar entre comillas o URL-encoded
```

### **Error: "Cannot find module"**
```bash
# Asegúrate de haber instalado dependencias:
cd backend && npm install
cd ../frontend && npm install
cd ../admin-dashboard && npm install
```

### **Error: "Port 3000 already in use"**
```bash
# Cambiar puerto en backend/.env:
PORT=3001

# O matar el proceso:
# Windows:
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# Linux/Mac:
lsof -ti:3000 | xargs kill -9
```

### **Frontend no se conecta al Backend**
```bash
# Verificar que el backend esté corriendo:
curl http://localhost:3000/api/health

# Verificar CORS en backend/.env:
CORS_ORIGINS=http://localhost:3001,http://localhost:3002
```

---

## 📊 PRÓXIMOS PASOS

Una vez que todo funcione localmente:

1. **Agregar más productos**
   - Desde Admin Dashboard
   - O con INSERT SQL en Supabase

2. **Probar flujo completo**
   - Registrar usuario
   - Agregar productos al carrito
   - Hacer checkout
   - Ver pedido en admin

3. **Deploy a producción**
   - Seguir [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md)
   - O [QUICK_START.md](./QUICK_START.md) para deploy rápido

---

## ✅ CHECKLIST

- [ ] SQL ejecutado en Supabase
- [ ] Backend corriendo en :3000
- [ ] Frontend corriendo en :3001
- [ ] Admin corriendo en :3002
- [ ] Login admin funciona
- [ ] Productos visibles en frontend
- [ ] Carrito funcional
- [ ] Dashboard con datos

---

**¿Algún problema?**
Revisa la sección Troubleshooting o crea un issue en GitHub.
