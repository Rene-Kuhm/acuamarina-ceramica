"use client";

import { Suspense, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import {
  ChevronLeft,
  ShoppingCart,
  Heart,
  Share2,
  Minus,
  Plus,
  Package,
  Truck,
  Shield,
  CheckCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useProduct } from "@/lib/hooks/useProducts";
import { useCartStore } from "@/lib/store/cart";
import { Breadcrumb } from "@/components/ui/breadcrumb";

function ProductDetailContent() {
  const params = useParams();
  const router = useRouter();
  const slug = params.slug as string;
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);

  const { data: product, isLoading, error } = useProduct(slug);
  const { addItem } = useCartStore();

  if (isLoading) {
    return <ProductDetailSkeleton />;
  }

  if (error || !product) {
    return (
      <div className="container mx-auto px-4 py-16">
        <Alert variant="destructive">
          <AlertDescription>
            Producto no encontrado. El producto que buscas no existe o ha sido eliminado.
          </AlertDescription>
        </Alert>
        <div className="mt-6">
          <Button onClick={() => router.push("/productos")}>
            <ChevronLeft className="w-4 h-4 mr-2" />
            Volver a Productos
          </Button>
        </div>
      </div>
    );
  }

  const breadcrumbItems = [
    { label: "Inicio", href: "/" },
    { label: "Productos", href: "/productos" },
    { label: product.category?.name || "Categoría", href: `/categorias/${product.category?.slug}` },
    { label: product.name },
  ];

  const handleAddToCart = () => {
    addItem({
      id: product.id,
      name: product.name,
      slug: product.slug,
      price: product.price,
      image: product.images[0] || "/placeholder.jpg",
      stock: product.stock,
      quantity,
    });
  };

  const handleQuantityChange = (delta: number) => {
    const newQuantity = quantity + delta;
    if (newQuantity >= 1 && newQuantity <= product.stock) {
      setQuantity(newQuantity);
    }
  };

  const inStock = product.stock > 0;
  const formattedPrice = new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS",
    minimumFractionDigits: 0,
  }).format(product.price);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <section className="bg-white border-b">
        <div className="container mx-auto px-4 py-4">
          <Breadcrumb items={breadcrumbItems} />
        </div>
      </section>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Image Gallery */}
          <div className="space-y-4">
            {/* Main Image */}
            <div className="relative aspect-square bg-white rounded-lg overflow-hidden border">
              <Image
                src={product.images[selectedImage] || "/placeholder.jpg"}
                alt={product.name}
                fill
                className="object-cover"
                priority
              />
              {!inStock && (
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                  <Badge variant="destructive" className="text-lg px-4 py-2">
                    Sin Stock
                  </Badge>
                </div>
              )}
            </div>

            {/* Thumbnail Gallery */}
            {product.images.length > 1 && (
              <div className="grid grid-cols-4 gap-4">
                {product.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`relative aspect-square bg-white rounded-lg overflow-hidden border-2 transition-all ${
                      selectedImage === index
                        ? "border-cyan-600"
                        : "border-gray-200 hover:border-cyan-300"
                    }`}
                  >
                    <Image src={image} alt={`${product.name} - ${index + 1}`} fill className="object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            <div>
              <Link
                href={`/categorias/${product.category?.slug}`}
                className="text-cyan-600 hover:text-cyan-700 text-sm font-medium"
              >
                {product.category?.name}
              </Link>
              <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mt-2">
                {product.name}
              </h1>
            </div>

            {/* Price */}
            <div className="flex items-baseline gap-4">
              <span className="text-4xl font-bold text-cyan-600">
                {formattedPrice}
              </span>
              {inStock ? (
                <Badge variant="default" className="bg-green-100 text-green-700 hover:bg-green-100">
                  <CheckCircle className="w-3 h-3 mr-1" />
                  En Stock
                </Badge>
              ) : (
                <Badge variant="destructive">Sin Stock</Badge>
              )}
            </div>

            <Separator />

            {/* Description */}
            <div>
              <h3 className="text-lg font-semibold mb-2">Descripción</h3>
              <p className="text-gray-600 leading-relaxed">{product.description}</p>
            </div>

            {/* Specifications */}
            {Object.keys(product.specifications || {}).length > 0 && (
              <>
                <Separator />
                <div>
                  <h3 className="text-lg font-semibold mb-3">Especificaciones</h3>
                  <dl className="grid grid-cols-2 gap-3">
                    {Object.entries(product.specifications).map(([key, value]) => (
                      <div key={key} className="space-y-1">
                        <dt className="text-sm font-medium text-gray-500">{key}</dt>
                        <dd className="text-sm text-gray-900">{value}</dd>
                      </div>
                    ))}
                  </dl>
                </div>
              </>
            )}

            <Separator />

            {/* Quantity Selector */}
            {inStock && (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Cantidad</label>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center border rounded-lg">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleQuantityChange(-1)}
                        disabled={quantity <= 1}
                        className="rounded-r-none"
                      >
                        <Minus className="w-4 h-4" />
                      </Button>
                      <span className="px-6 py-2 font-medium">{quantity}</span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleQuantityChange(1)}
                        disabled={quantity >= product.stock}
                        className="rounded-l-none"
                      >
                        <Plus className="w-4 h-4" />
                      </Button>
                    </div>
                    <span className="text-sm text-gray-500">
                      {product.stock} disponibles
                    </span>
                  </div>
                </div>

                {/* Add to Cart */}
                <div className="flex gap-3">
                  <Button
                    onClick={handleAddToCart}
                    size="lg"
                    className="flex-1 bg-cyan-600 hover:bg-cyan-700 text-white"
                  >
                    <ShoppingCart className="w-5 h-5 mr-2" />
                    Agregar al Carrito
                  </Button>
                  <Button variant="outline" size="lg">
                    <Heart className="w-5 h-5" />
                  </Button>
                  <Button variant="outline" size="lg">
                    <Share2 className="w-5 h-5" />
                  </Button>
                </div>
              </div>
            )}

            {/* Benefits */}
            <Card>
              <CardContent className="p-6 space-y-4">
                <div className="flex items-start gap-3">
                  <Truck className="w-5 h-5 text-cyan-600 mt-0.5" />
                  <div>
                    <h4 className="font-medium">Envío Gratis</h4>
                    <p className="text-sm text-gray-600">En compras mayores a $50.000</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Package className="w-5 h-5 text-cyan-600 mt-0.5" />
                  <div>
                    <h4 className="font-medium">Entrega Rápida</h4>
                    <p className="text-sm text-gray-600">Recibe tu pedido en 3-5 días hábiles</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Shield className="w-5 h-5 text-cyan-600 mt-0.5" />
                  <div>
                    <h4 className="font-medium">Compra Protegida</h4>
                    <p className="text-sm text-gray-600">Garantía de calidad y devoluciones</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

function ProductDetailSkeleton() {
  return (
    <div className="min-h-screen bg-gray-50">
      <section className="bg-white border-b">
        <div className="container mx-auto px-4 py-4">
          <Skeleton className="h-6 w-96" />
        </div>
      </section>
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="space-y-4">
            <Skeleton className="aspect-square w-full rounded-lg" />
            <div className="grid grid-cols-4 gap-4">
              {[1, 2, 3, 4].map((i) => (
                <Skeleton key={i} className="aspect-square rounded-lg" />
              ))}
            </div>
          </div>
          <div className="space-y-6">
            <Skeleton className="h-10 w-3/4" />
            <Skeleton className="h-12 w-48" />
            <Skeleton className="h-32 w-full" />
            <Skeleton className="h-64 w-full" />
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ProductDetailPage() {
  return (
    <Suspense fallback={<ProductDetailSkeleton />}>
      <ProductDetailContent />
    </Suspense>
  );
}
