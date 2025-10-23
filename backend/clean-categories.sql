-- Script para eliminar todas las categorías de prueba
-- Ejecutar este script para limpiar las categorías ficticias

-- Primero, eliminar las relaciones de productos con categorías
UPDATE products SET category_id = NULL WHERE category_id IS NOT NULL;

-- Luego, eliminar todas las categorías
DELETE FROM categories;

-- Reiniciar el contador de IDs (opcional)
-- ALTER SEQUENCE categories_id_seq RESTART WITH 1;

SELECT 'Categorías eliminadas exitosamente' as result;
