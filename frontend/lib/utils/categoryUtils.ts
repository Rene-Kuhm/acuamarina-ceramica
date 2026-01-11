// 🚨 Fix para Error: categoryId.trim is not a function en FRONTEND

/**
 * Utilidades para manejar categoryId de forma segura en el frontend
 * Previene errores de .trim() cuando categoryId es number
 */

export function safeCategoryId(categoryId: any): string {
  // Si es null, undefined, o falsy (excepto 0), retorna string vacío
  if (!categoryId && categoryId !== 0) {
    return '';
  }
  
  // Si es número, lo convierte a string
  if (typeof categoryId === 'number') {
    return categoryId.toString();
  }
  
  // Si es string, lo retorna tal como está
  if (typeof categoryId === 'string') {
    return categoryId;
  }
  
  // Si es object o array, lo convierte a JSON string
  if (typeof categoryId === 'object') {
    return JSON.stringify(categoryId);
  }
  
  // Fallback: convertir a string
  return String(categoryId);
}

/**
 * Función segura para trim que no falla nunca
 */
export function safeTrim(value: any): string {
  const safeValue = safeCategoryId(value);
  return safeValue.trim();
}

/**
 * Función de comparación segura para ordenamiento por categoryId en frontend
 * Reemplaza: productos.sort((a, b) => a.categoryId.trim().localeCompare(b.categoryId.trim()))
 */
export function compareByCategoryId(a: any, b: any): number {
  const categoryA = safeTrim(a.categoryId);
  const categoryB = safeTrim(b.categoryId);
  return categoryA.localeCompare(categoryB);
}

/**
 * Función de filtrado seguro por categoryId en frontend
 */
export function filterByCategoryId(productos: any[], targetCategoryId: any): any[] {
  const targetId = safeTrim(targetCategoryId);
  
  return productos.filter(producto => {
    const productCategoryId = safeTrim(producto.categoryId);
    return productCategoryId === targetId;
  });
}

/**
 * Comparación segura por categoryId numérico (respeta que sea number)
 */
export function compareByCategoryIdNumeric(a: any, b: any): number {
  const categoryA = typeof a.categoryId === 'number' ? a.categoryId : Number(a.categoryId) || 0;
  const categoryB = typeof b.categoryId === 'number' ? b.categoryId : Number(b.categoryId) || 0;
  return categoryA - categoryB;
}

// Exportación por defecto para uso fácil
const categoryUtils = {
  safeCategoryId,
  safeTrim,
  compareByCategoryId,
  filterByCategoryId,
  compareByCategoryIdNumeric
};

export default categoryUtils;

// Ejemplos de uso para reemplazar código problemático:
/*
// ❌ ANTES (causaba error en frontend):
// productos.sort((a, b) => a.categoryId.trim().localeCompare(b.categoryId.trim()))

// ✅ DESPUÉS:
// productos.sort(compareByCategoryId)
// O para números:
// productos.sort(compareByCategoryIdNumeric)

// ❌ ANTES:
// const filtered = productos.filter(p => p.categoryId.trim() === targetId.trim())

// ✅ DESPUÉS:
// const filtered = filterByCategoryId(productos, targetId)
*/