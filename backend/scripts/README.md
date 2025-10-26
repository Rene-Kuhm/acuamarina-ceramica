# Backend Utility Scripts

Esta carpeta contiene scripts de utilidad para el backend.

## Scripts Disponibles

### `crear-db.js`

Crea la base de datos PostgreSQL.

**Uso:**
```bash
npm run db:create
# o directamente:
node scripts/crear-db.js
```

**Descripción:**
- Crea la base de datos `aguamarina_mosaicos` si no existe
- Requiere PostgreSQL instalado y corriendo
- Usa las credenciales del archivo `.env`

---

### `generate-password-hash.js`

Genera un hash bcrypt de una contraseña.

**Uso:**
```bash
node scripts/generate-password-hash.js
```

**Descripción:**
- Genera el hash bcrypt de la contraseña `Admin123!`
- Útil para crear o resetear contraseñas de usuarios
- Incluye el SQL para actualizar la contraseña en la BD

**Personalización:**
Edita el archivo y cambia la variable `password` para generar hash de otra contraseña:
```javascript
const password = 'TuNuevaContraseña';
```

---

## Notas

- Estos scripts son herramientas de desarrollo y mantenimiento
- No deben ejecutarse en producción sin supervisión
- Asegúrate de tener las variables de entorno configuradas antes de ejecutarlos
