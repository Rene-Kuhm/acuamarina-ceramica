# Limpiar Categorías Ficticias

Este documento explica cómo eliminar todas las categorías de prueba de la base de datos.

## 🎯 ¿Cuándo usar esto?

Usa este script cuando necesites:
- Eliminar todas las categorías de prueba/seed
- Empezar desde cero con las categorías
- Limpiar la base de datos después de pruebas

## 🚀 Cómo ejecutar

1. Asegúrate de estar en el directorio `backend`:
   ```bash
   cd backend
   ```

2. Ejecuta el script de limpieza:
   ```bash
   node clean-categories.js
   ```

3. El script hará lo siguiente:
   - Mostrará todas las categorías actuales
   - Desvinculará productos de sus categorías
   - Eliminará todas las categorías
   - Reiniciará el contador de IDs

## ⚠️ ADVERTENCIA

**Este script eliminará TODAS las categorías de la base de datos.**

- Los productos NO se eliminarán, solo se les quitará la categoría asignada
- Después de ejecutar este script, deberás crear las categorías nuevamente desde el panel de administración
- Esta acción no se puede deshacer

## 📝 Después de limpiar

Después de ejecutar el script, debes:

1. Ir al panel de administración: https://acuamarina-ceramica-rbqj.vercel.app/dashboard/categories
2. Crear las categorías reales que necesites
3. Asignar productos a las categorías desde el panel de productos

## 🔧 Prevenir categorías de prueba

El archivo `src/infrastructure/database/seed.ts` ya está configurado para **NO** crear categorías automáticamente.

Solo crea el usuario admin por defecto:
- Email: admin@aguamarina.com
- Password: Admin123!

## 🗑️ Eliminar el script después de usar

Una vez que hayas limpiado las categorías y estés satisfecho, puedes eliminar estos archivos:
- `clean-categories.js`
- `clean-categories.sql`
- `CLEAN_CATEGORIES.md` (este archivo)
