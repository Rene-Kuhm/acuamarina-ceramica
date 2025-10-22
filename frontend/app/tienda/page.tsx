import { redirect } from "next/navigation";

/**
 * Tienda Page - Redirects to /productos
 * This provides a user-friendly alias for the shop
 */
export default function TiendaPage() {
  redirect("/productos");
}
