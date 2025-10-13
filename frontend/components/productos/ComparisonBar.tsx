"use client";

import Link from "next/link";
import Image from "next/image";
import { X, Scale, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useComparison } from "@/lib/hooks/useComparison";

export function ComparisonBar() {
  const { items, removeItem, totalItems } = useComparison();

  if (totalItems === 0) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 bg-white border-t shadow-lg">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <Scale className="w-5 h-5 text-primary" />
              <span className="font-semibold text-gray-900">
                Comparar ({totalItems}/4)
              </span>
            </div>
            <div className="hidden sm:flex items-center gap-2 overflow-x-auto max-w-xl">
              {items.slice(0, 4).map((item) => (
                <div
                  key={item.id}
                  className="relative flex items-center gap-2 bg-gray-50 rounded-lg p-2 min-w-[120px]"
                >
                  <div className="relative w-12 h-12 flex-shrink-0">
                    <Image
                      src={item.image || "/placeholder.jpg"}
                      alt={item.name}
                      fill
                      className="object-cover rounded"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium text-gray-900 truncate">
                      {item.name}
                    </p>
                  </div>
                  <button
                    onClick={() => removeItem(item.id)}
                    className="absolute -top-1 -right-1 p-1 bg-white rounded-full shadow-md hover:bg-gray-100"
                  >
                    <X className="w-3 h-3 text-gray-600" />
                  </button>
                </div>
              ))}
            </div>
          </div>
          <Button
            asChild
            size="lg"
            className="bg-primary hover:bg-primary-hover text-white"
          >
            <Link href="/comparar">
              Ver Comparación
              <ArrowRight className="w-4 h-4 ml-2" />
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
