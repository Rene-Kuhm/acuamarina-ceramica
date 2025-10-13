# 🔐 Solucionar Error de Autenticación PostgreSQL

## Error actual:
```
la autentificación password falló para el usuario "postgres"
```

Esto significa que la contraseña en `.env` no coincide con la contraseña real de PostgreSQL.

## ✅ Soluciones (elige una):

### Opción 1: Actualizar el archivo .env con la contraseña correcta (RECOMENDADO)

1. **Abre el archivo `.env`** en:
   ```
   D:\aguamarina-mosaicos\backend\.env
   ```

2. **Cambia la línea de DB_PASSWORD:**
   ```env
   DB_PASSWORD=TU_CONTRASEÑA_REAL_AQUI
   ```

   Usa la contraseña que configuraste cuando instalaste PostgreSQL.

3. **Guarda el archivo**

4. **Reinicia el servidor:**
   ```bash
   npm run dev
   ```

### Opción 2: Si no recuerdas la contraseña de PostgreSQL

#### Windows - Método de confianza temporal:

1. **Encuentra el archivo `pg_hba.conf`:**
   - Ubicación común: `C:\Program Files\PostgreSQL\16\data\pg_hba.conf`
   - O busca "pg_hba.conf" en el explorador de archivos

2. **Edita el archivo como Administrador:**
   - Click derecho → Abrir con Notepad++ (o Notepad como admin)

3. **Busca estas líneas:**
   ```
   # IPv4 local connections:
   host    all             all             127.0.0.1/32            scram-sha-256
   ```

4. **Cámbiala temporalmente a:**
   ```
   # IPv4 local connections:
   host    all             all             127.0.0.1/32            trust
   ```

5. **Reinicia el servicio PostgreSQL:**
   - Windows: Services → PostgreSQL → Restart
   - O en CMD como admin: `net stop postgresql-x64-16 && net start postgresql-x64-16`

6. **Conecta sin contraseña y cámbiala:**
   ```bash
   psql -U postgres
   ALTER USER postgres PASSWORD 'nueva_contraseña_aqui';
   \q
   ```

7. **Vuelve a cambiar `pg_hba.conf` a `scram-sha-256`**

8. **Reinicia PostgreSQL otra vez**

9. **Actualiza `.env` con la nueva contraseña**

### Opción 3: Crear un nuevo usuario PostgreSQL

Si prefieres no tocar el usuario postgres:

1. **Conecta a PostgreSQL con pgAdmin o psql**

2. **Crea un nuevo usuario:**
   ```sql
   CREATE USER aguamarina WITH PASSWORD 'MiPassword123!';
   ALTER USER aguamarina CREATEDB;
   GRANT ALL PRIVILEGES ON DATABASE aguamarina_mosaicos TO aguamarina;
   ```

3. **Actualiza `.env`:**
   ```env
   DB_USER=aguamarina
   DB_PASSWORD=MiPassword123!
   ```

### Opción 4: Sin contraseña (solo para desarrollo local)

1. **Edita `.env`:**
   ```env
   DB_PASSWORD=
   ```

2. **Configura `pg_hba.conf` con `trust`** (ver Opción 2)

## 🔍 Cómo encontrar tu contraseña de PostgreSQL

**Si instalaste PostgreSQL recientemente:**
- La contraseña es la que pusiste durante la instalación
- Revisa notas o emails donde la guardaste

**Métodos comunes que la gente usa:**
- `postgres`
- `admin`
- `root`
- `123456`
- La contraseña de tu PC
- Tu email/nombre

**⚠️ IMPORTANTE:** Prueba estas contraseñas comunes, pero en producción siempre usa contraseñas seguras.

## 🧪 Probar la conexión

Después de actualizar la contraseña, prueba:

```bash
# Verifica que .env tiene la contraseña correcta
cat .env | grep DB_PASSWORD

# Intenta conectar manualmente (reemplaza con tu contraseña)
psql -U postgres -d aguamarina_mosaicos -h localhost -p 5432

# Si funciona, sal con:
\q
```

## 🚀 Una vez solucionado:

```bash
# 1. Ejecutar migraciones
npm run db:migrate

# 2. Cargar datos de prueba
npm run db:seed

# 3. Iniciar servidor
npm run dev
```

## 💡 Tips

- **pgAdmin** es más fácil que la línea de comandos
- La contraseña debe estar en `.env` sin comillas
- Si cambias `.env`, reinicia el servidor
- En desarrollo, una contraseña simple está bien

---

**¿Necesitas más ayuda?**
Dime qué método prefieres y te guío paso a paso.
