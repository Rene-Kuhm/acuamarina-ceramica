// 🚨 Fix para Error: categoryId.trim is not a function

// PROBLEMA: categoryId puede ser null, undefined, number, o object
// SOLUCIÓN: Validación y conversión segura

// ✅ Función helper para manejar categoryId de forma segura
function safeCategoryId(categoryId) {
  // Si es null, undefined, o falsy, retorna string vacío
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
  
  // Si es object o array, lo convierte a JSON y luego string
  if (typeof categoryId === 'object') {
    return JSON.stringify(categoryId);
  }
  
  // Fallback: convertir a string
  return String(categoryId);
}

// ✅ Función para trim seguro
function safeTrim(value) {
  const safeValue = safeCategoryId(value);
  return safeValue.trim();
}

// ✅ EJEMPLOS DE USO:

// ❌ ANTES (causaba error):
// b.categoryId.trim()

// ✅ DESPUÉS (funciona siempre):
// safeTrim(b.categoryId)

// ✅ O usando la función helper:
// safeCategoryId(b.categoryId).trim()

// ✅ Validación adicional para formularios
function validateCategoryId(categoryId) {
  const cleaned = safeTrim(categoryId);
  
  return {
    isValid: cleaned.length > 0,
    value: cleaned,
    error: cleaned.length === 0 ? 'Category ID es requerido' : null
  };
}

// ✅ EXPORT para usar en otros archivos
export { safeCategoryId, safeTrim, validateCategoryId };

// ✅ CASOS DE PRUEBA:
/*
console.log(safeTrim(null));           // ""
console.log(safeTrim(undefined));     // ""
console.log(safeTrim(123));           // "123"
console.log(safeTrim("  test  "));    // "test"
console.log(safeTrim([]));            // "[]"
console.log(safeTrim({}));            // "{}"
*/