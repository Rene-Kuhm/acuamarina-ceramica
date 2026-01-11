// 🚨 Fix para Error: categoryId.trim is not a function

/**
 * Utilidades para manejar categoryId de forma segura
 * Previene errores de .trim() en valores no-string
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
 * Función de comparación segura para ordenamiento por categoryId
 * Reemplaza: products.sort((a, b) => a.categoryId.trim().localeCompare(b.categoryId.trim()))
 */
export function compareByCategoryId(a: any, b: any): number {
  const categoryA = safeTrim(a.categoryId);
  const categoryB = safeTrim(b.categoryId);
  return categoryA.localeCompare(categoryB);
}

/**
 * Función de filtrado seguro por categoryId
 */
export function filterByCategoryId(items: any[], targetCategoryId: any): any[] {
  const targetId = safeTrim(targetCategoryId);
  
  return items.filter(item => {
    const itemCategoryId = safeTrim(item.categoryId);
    return itemCategoryId === targetId;
  });
}

/**
 * Validación de categoryId
 */
export function validateCategoryId(categoryId: any): { isValid: boolean; value: string; error?: string } {
  const cleaned = safeTrim(categoryId);
  
  return {
    isValid: cleaned.length > 0,
    value: cleaned,
    error: cleaned.length === 0 ? 'Category ID es requerido' : undefined
  };
}

// Ejemplos de uso para reemplazar código problemático:
/*
// ❌ ANTES (causaba error):
// products.sort((a, b) => a.categoryId.trim().localeCompare(b.categoryId.trim()))

// ✅ DESPUÉS:
// products.sort(compareByCategoryId)

// ❌ ANTES:
// const filtered = products.filter(p => p.categoryId.trim() === targetId.trim())

// ✅ DESPUÉS:
// const filtered = filterByCategoryId(products, targetId)
*/