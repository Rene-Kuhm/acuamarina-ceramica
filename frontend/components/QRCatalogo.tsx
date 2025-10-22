"use client";

import { useEffect, useState } from "react";
import { QRCodeSVG } from "qrcode.react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { QrCode, Download } from "lucide-react";
import { Button } from "@/components/ui/button";

/**
 * QRCatalogo Component
 * Displays a QR code that links to the products catalog
 * Users can scan this QR code with their mobile devices to access the full catalog
 */
export function QRCatalogo() {
  const [catalogUrl, setCatalogUrl] = useState("");

  useEffect(() => {
    // Get the production URL from environment variable or fallback to window location
    // For production, use NEXT_PUBLIC_SITE_URL
    // For development, use window.location.origin
    const baseUrl =
      process.env.NEXT_PUBLIC_SITE_URL ||
      (typeof window !== "undefined" ? window.location.origin : "");

    setCatalogUrl(`${baseUrl}/productos`);
  }, []);

  /**
   * Downloads the QR code as PNG
   */
  const downloadQR = () => {
    const svg = document.getElementById("qr-code-svg");
    if (!svg) return;

    const svgData = new XMLSerializer().serializeToString(svg);
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    const img = new Image();

    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx?.drawImage(img, 0, 0);
      const pngFile = canvas.toDataURL("image/png");

      const downloadLink = document.createElement("a");
      downloadLink.download = "catalogo-aguamarina-qr.png";
      downloadLink.href = pngFile;
      downloadLink.click();
    };

    img.src = "data:image/svg+xml;base64," + btoa(svgData);
  };

  if (!catalogUrl) return null;

  return (
    <Card className="w-full max-w-sm mx-auto hover:shadow-xl transition-shadow duration-300 border-2 border-primary/20">
      <CardHeader className="text-center space-y-2">
        <div className="mx-auto w-12 h-12 bg-primary-light rounded-full flex items-center justify-center text-primary mb-2">
          <QrCode className="w-6 h-6" />
        </div>
        <CardTitle className="text-xl font-bold text-gray-900">
          Escanea y Explora
        </CardTitle>
        <CardDescription className="text-base">
          Accede a nuestro catálogo completo desde tu móvil
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* QR Code */}
        <div className="flex justify-center p-6 bg-white rounded-lg border-2 border-dashed border-primary/30">
          <QRCodeSVG
            id="qr-code-svg"
            value={catalogUrl}
            size={200}
            level="H"
            includeMargin={true}
            fgColor="#0891b2" // cyan-600
            bgColor="#ffffff"
            imageSettings={{
              src: "/logo.png",
              x: undefined,
              y: undefined,
              height: 40,
              width: 40,
              excavate: true,
            }}
          />
        </div>

        {/* Instructions */}
        <div className="text-center space-y-2">
          <p className="text-sm text-gray-600">
            Apunta tu cámara al código QR para ver todos nuestros productos
          </p>
          <Button
            onClick={downloadQR}
            variant="outline"
            size="sm"
            className="w-full border-primary text-primary hover:bg-cyan-50"
          >
            <Download className="w-4 h-4 mr-2" />
            Descargar QR
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
