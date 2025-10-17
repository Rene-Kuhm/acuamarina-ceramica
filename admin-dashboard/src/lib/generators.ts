/**
 * Utility functions for generating SKUs, slugs, and other identifiers
 */

/**
 * Generate a slug from a string
 * @param text - The text to convert to slug
 * @returns A URL-friendly slug
 */
export function generateSlug(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .normalize('NFD') // Normalize to decomposed form
    .replace(/[\u0300-\u036f]/g, '') // Remove diacritics
    .replace(/[^a-z0-9\s-]/g, '') // Remove special characters
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/-+/g, '-') // Replace multiple hyphens with single hyphen
    .replace(/^-+|-+$/g, ''); // Remove leading/trailing hyphens
}

/**
 * Generate a unique SKU for a product
 * Format: PROD-YYYYMMDD-XXXX (where XXXX is a random 4-digit number)
 * @param prefix - Optional prefix (default: 'PROD')
 * @returns A unique SKU
 */
export function generateSKU(prefix: string = 'PROD'): string {
  const date = new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const random = String(Math.floor(Math.random() * 10000)).padStart(4, '0');

  return `${prefix}-${year}${month}${day}-${random}`;
}

/**
 * Generate a SKU based on category and name
 * Format: CAT-NAME-XXXX
 * @param category - Category name or code
 * @param productName - Product name
 * @returns A descriptive SKU
 */
export function generateDescriptiveSKU(category: string, productName: string): string {
  const catCode = category
    .toUpperCase()
    .replace(/[^A-Z0-9]/g, '')
    .slice(0, 3);

  const nameCode = productName
    .toUpperCase()
    .replace(/[^A-Z0-9]/g, '')
    .slice(0, 4);

  const random = String(Math.floor(Math.random() * 1000)).padStart(3, '0');

  return `${catCode}-${nameCode}-${random}`;
}

/**
 * Validate if a string is a valid SKU format
 * @param sku - The SKU to validate
 * @returns True if valid, false otherwise
 */
export function isValidSKU(sku: string): boolean {
  // Check for common SKU patterns
  const patterns = [
    /^[A-Z]{3,4}-[A-Z0-9]{4,8}-[0-9]{3,4}$/, // CAT-NAME-123
    /^[A-Z]{4}-[0-9]{8}-[0-9]{4}$/, // PROD-20240101-1234
    /^[A-Z0-9]{6,20}$/, // Simple alphanumeric
  ];

  return patterns.some((pattern) => pattern.test(sku));
}

/**
 * Validate if a string is a valid slug
 * @param slug - The slug to validate
 * @returns True if valid, false otherwise
 */
export function isValidSlug(slug: string): boolean {
  const pattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
  return pattern.test(slug);
}
