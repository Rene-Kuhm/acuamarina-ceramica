"use client";

import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Star, X, ChevronLeft, ChevronRight, Upload, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { uploadProductImage } from '@/lib/api/upload';
import { toast } from 'sonner';

export interface ProductImage {
  id?: number;
  url: string;
  cloudinaryId?: string;
  altText?: string;
  isPrimary?: boolean;
  file?: File;
  uploading?: boolean;
}

interface CloudinaryImageUploaderProps {
  value: ProductImage[];
  onChange: (value: ProductImage[]) => void;
  productId?: number;
  maxImages?: number;
  disabled?: boolean;
}

export function CloudinaryImageUploader({
  value = [],
  onChange,
  productId,
  maxImages = 10,
  disabled = false,
}: CloudinaryImageUploaderProps) {
  const [uploading, setUploading] = useState(false);

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      if (disabled) return;

      const remainingSlots = maxImages - value.length;
      if (remainingSlots <= 0) {
        toast.error(`Máximo ${maxImages} imágenes permitidas`);
        return;
      }

      const filesToUpload = acceptedFiles.slice(0, remainingSlots);

      for (const file of filesToUpload) {
        // Validate file size (5MB max)
        if (file.size > 5 * 1024 * 1024) {
          toast.error(`${file.name} excede el tamaño máximo de 5MB`);
          continue;
        }

        // Create preview
        const previewUrl = URL.createObjectURL(file);
        const tempImage: ProductImage = {
          url: previewUrl,
          file,
          uploading: true,
          isPrimary: value.length === 0, // First image is primary
        };

        // Add to UI immediately
        onChange([...value, tempImage]);

        try {
          // Upload to Cloudinary
          const response = await uploadProductImage(file, productId, {
            isPrimary: value.length === 0,
          });

          // Replace preview with real URL
          const updatedImages = value.map((img) =>
            img.url === previewUrl
              ? {
                  id: response.data.id,
                  url: response.data.url,
                  cloudinaryId: response.data.cloudinaryId,
                  isPrimary: value.length === 0,
                  uploading: false,
                }
              : img
          );
          onChange(updatedImages);

          toast.success('Imagen subida correctamente');
        } catch (error) {
          console.error('Error uploading image:', error);
          toast.error('Error al subir la imagen');

          // Remove failed image
          const filteredImages = value.filter((img) => img.url !== previewUrl);
          onChange(filteredImages);
        }
      }
    },
    [value, onChange, productId, maxImages, disabled]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpg', '.jpeg', '.png', '.gif', '.webp'],
    },
    multiple: true,
    disabled,
  });

  const removeImage = async (index: number) => {
    const image = value[index];

    // If image has an ID, delete from backend
    if (image.id) {
      try {
        const { deleteImage } = await import('@/lib/api/upload');
        await deleteImage(image.id);
        toast.success('Imagen eliminada');
      } catch (error) {
        console.error('Error deleting image:', error);
        toast.error('Error al eliminar la imagen');
        return;
      }
    }

    // Remove from UI
    const newImages = value.filter((_, i) => i !== index);

    // If removed image was primary, make first image primary
    if (image.isPrimary && newImages.length > 0) {
      newImages[0].isPrimary = true;
    }

    onChange(newImages);
  };

  const setPrimaryImage = (index: number) => {
    const newImages = value.map((img, i) => ({
      ...img,
      isPrimary: i === index,
    }));
    onChange(newImages);
  };

  const moveImage = (index: number, direction: 'left' | 'right') => {
    const newImages = [...value];
    const targetIndex = direction === 'left' ? index - 1 : index + 1;

    if (targetIndex < 0 || targetIndex >= newImages.length) return;

    [newImages[index], newImages[targetIndex]] = [newImages[targetIndex], newImages[index]];
    onChange(newImages);
  };

  return (
    <div className="space-y-4">
      {/* Dropzone */}
      {value.length < maxImages && (
        <div
          {...getRootProps()}
          className={cn(
            "border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors",
            isDragActive && "border-[#14b8a6] bg-[#f0fdfa]",
            !isDragActive && "border-slate-300 hover:border-slate-400",
            disabled && "opacity-50 cursor-not-allowed"
          )}
        >
          <input {...getInputProps()} />
          <div className="flex flex-col items-center gap-2">
            <Upload className="h-10 w-10 text-slate-400" />
            <p className="text-sm text-slate-600">
              {isDragActive
                ? "Suelta las imágenes aquí"
                : "Arrastra imágenes o haz click para seleccionar"}
            </p>
            <p className="text-xs text-slate-500">
              Máximo {maxImages} imágenes • JPG, PNG, GIF, WEBP • Máx 5MB
            </p>
          </div>
        </div>
      )}

      {/* Image Grid */}
      {value.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {value.map((image, index) => (
            <div
              key={image.url}
              className="relative aspect-square rounded-lg overflow-hidden border border-slate-200 group"
            >
              {/* Image */}
              <img
                src={image.url}
                alt={image.altText || `Imagen ${index + 1}`}
                className="w-full h-full object-cover"
              />

              {/* Uploading Overlay */}
              {image.uploading && (
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                  <Loader2 className="h-8 w-8 text-white animate-spin" />
                </div>
              )}

              {/* Controls Overlay */}
              {!image.uploading && (
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                  {/* Set Primary */}
                  <button
                    type="button"
                    onClick={() => setPrimaryImage(index)}
                    className={cn(
                      "p-2 rounded-full transition-colors",
                      image.isPrimary
                        ? "bg-[#14b8a6] text-white"
                        : "bg-white/90 text-slate-700 hover:bg-white"
                    )}
                    title="Marcar como principal"
                  >
                    <Star className="h-4 w-4" fill={image.isPrimary ? "currentColor" : "none"} />
                  </button>

                  {/* Move Left */}
                  {index > 0 && (
                    <button
                      type="button"
                      onClick={() => moveImage(index, 'left')}
                      className="p-2 rounded-full bg-white/90 text-slate-700 hover:bg-white transition-colors"
                      title="Mover a la izquierda"
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </button>
                  )}

                  {/* Move Right */}
                  {index < value.length - 1 && (
                    <button
                      type="button"
                      onClick={() => moveImage(index, 'right')}
                      className="p-2 rounded-full bg-white/90 text-slate-700 hover:bg-white transition-colors"
                      title="Mover a la derecha"
                    >
                      <ChevronRight className="h-4 w-4" />
                    </button>
                  )}

                  {/* Remove */}
                  <button
                    type="button"
                    onClick={() => removeImage(index)}
                    className="p-2 rounded-full bg-red-500 text-white hover:bg-red-600 transition-colors"
                    title="Eliminar imagen"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              )}

              {/* Primary Badge */}
              {image.isPrimary && !image.uploading && (
                <div className="absolute top-2 left-2 bg-[#14b8a6] text-white text-xs font-semibold px-2 py-1 rounded-full">
                  Principal
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Info Text */}
      {value.length > 0 && (
        <p className="text-xs text-slate-500">
          {value.length} de {maxImages} imágenes
          {value.length > 0 && " • Haz hover sobre las imágenes para ver controles"}
        </p>
      )}
    </div>
  );
}
