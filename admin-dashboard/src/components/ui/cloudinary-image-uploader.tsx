'use client';

import { useState, useCallback } from 'react';
import { UploadCloud, X, Loader2, GripVertical, Star } from 'lucide-react';
import { useDropzone } from 'react-dropzone';
import { Button } from './button';
import { uploadProductImage, deleteImage } from '@/lib/api/upload';
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

export const CloudinaryImageUploader: React.FC<CloudinaryImageUploaderProps> = ({
  value,
  onChange,
  productId,
  maxImages = 10,
  disabled = false,
}) => {
  const [uploadingCount, setUploadingCount] = useState(0);

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      if (disabled) return;

      // Check if adding these files would exceed the limit
      if (value.length + acceptedFiles.length > maxImages) {
        toast.error(`Máximo ${maxImages} imágenes permitidas`);
        return;
      }

      // Add files as pending uploads with preview
      const newImages: ProductImage[] = acceptedFiles.map((file) => ({
        url: URL.createObjectURL(file),
        file,
        uploading: true,
        isPrimary: value.length === 0, // First image is primary by default
      }));

      onChange([...value, ...newImages]);
      setUploadingCount((prev) => prev + acceptedFiles.length);

      // Upload each file
      for (let i = 0; i < acceptedFiles.length; i++) {
        const file = acceptedFiles[i];
        const imageIndex = value.length + i;

        try {
          const response = await uploadProductImage(file, productId, {
            isPrimary: value.length === 0 && i === 0,
          });

          // Update the image with the server response
          const updatedImages = [...value, ...newImages].map((img, idx) =>
            idx === imageIndex
              ? {
                  ...img,
                  id: response.data.id,
                  url: response.data.url,
                  cloudinaryId: response.data.cloudinaryId,
                  uploading: false,
                  file: undefined,
                }
              : img
          );
          onChange(updatedImages);

          toast.success('Imagen subida correctamente');
        } catch (error: any) {
          console.error('Error uploading image:', error);
          toast.error(error?.response?.data?.message || 'Error al subir la imagen');

          // Remove the failed upload
          const filteredImages = [...value, ...newImages].filter((_, idx) => idx !== imageIndex);
          onChange(filteredImages);
        } finally {
          setUploadingCount((prev) => prev - 1);
        }
      }
    },
    [value, onChange, productId, maxImages, disabled]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'image/*': ['.jpeg', '.jpg', '.png', '.gif', '.webp'] },
    disabled: disabled || value.length >= maxImages,
    maxSize: 5 * 1024 * 1024, // 5MB
  });

  const handleRemove = async (index: number) => {
    if (disabled) return;

    const image = value[index];

    // If image has an ID, delete from server
    if (image.id) {
      try {
        await deleteImage(image.id);
        toast.success('Imagen eliminada correctamente');
      } catch (error: any) {
        console.error('Error deleting image:', error);
        toast.error(error?.response?.data?.message || 'Error al eliminar la imagen');
        return;
      }
    }

    // Remove from local state
    const newValue = [...value];
    newValue.splice(index, 1);
    onChange(newValue);
  };

  const handleSetPrimary = (index: number) => {
    if (disabled) return;

    const newValue = value.map((img, idx) => ({
      ...img,
      isPrimary: idx === index,
    }));
    onChange(newValue);
  };

  const moveImage = (fromIndex: number, toIndex: number) => {
    if (disabled) return;

    const newValue = [...value];
    const [movedItem] = newValue.splice(fromIndex, 1);
    newValue.splice(toIndex, 0, movedItem);
    onChange(newValue);
  };

  return (
    <div className="space-y-4">
      {/* Image Grid */}
      {value.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {value.map((image, index) => (
            <div
              key={image.id || index}
              className="relative aspect-square rounded-lg overflow-hidden group border border-slate-200 dark:border-slate-700"
            >
              {/* Image */}
              <img
                src={image.url}
                alt={image.altText || `Product image ${index + 1}`}
                className="w-full h-full object-cover"
              />

              {/* Loading Overlay */}
              {image.uploading && (
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                  <Loader2 className="h-8 w-8 text-white animate-spin" />
                </div>
              )}

              {/* Controls Overlay */}
              {!image.uploading && (
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/50 transition-all duration-200">
                  <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button
                      type="button"
                      size="icon"
                      variant="destructive"
                      className="h-8 w-8"
                      onClick={() => handleRemove(index)}
                      disabled={disabled}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>

                  <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button
                      type="button"
                      size="icon"
                      variant={image.isPrimary ? 'default' : 'secondary'}
                      className="h-8 w-8"
                      onClick={() => handleSetPrimary(index)}
                      disabled={disabled}
                      title="Marcar como principal"
                    >
                      <Star className={`h-4 w-4 ${image.isPrimary ? 'fill-current' : ''}`} />
                    </Button>

                    {value.length > 1 && (
                      <div className="flex gap-1">
                        <Button
                          type="button"
                          size="icon"
                          variant="secondary"
                          className="h-8 w-8"
                          onClick={() => moveImage(index, Math.max(0, index - 1))}
                          disabled={disabled || index === 0}
                        >
                          ←
                        </Button>
                        <Button
                          type="button"
                          size="icon"
                          variant="secondary"
                          className="h-8 w-8"
                          onClick={() => moveImage(index, Math.min(value.length - 1, index + 1))}
                          disabled={disabled || index === value.length - 1}
                        >
                          →
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Primary Badge */}
              {image.isPrimary && (
                <div className="absolute top-2 left-2 bg-cyan-600 text-white text-xs px-2 py-1 rounded-md flex items-center gap-1">
                  <Star className="h-3 w-3 fill-current" />
                  Principal
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Dropzone */}
      {value.length < maxImages && (
        <div
          {...getRootProps()}
          className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-all duration-200 ${
            isDragActive
              ? 'border-cyan-600 dark:border-cyan-500 bg-cyan-50 dark:bg-cyan-950/30 scale-[1.02]'
              : disabled
              ? 'border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 cursor-not-allowed opacity-50'
              : 'border-slate-300 dark:border-slate-700 hover:border-cyan-500 dark:hover:border-cyan-400 hover:bg-slate-50 dark:hover:bg-slate-900/50'
          }`}
        >
          <input {...getInputProps()} />
          <div className="flex flex-col items-center gap-3 text-slate-600 dark:text-slate-400">
            {uploadingCount > 0 ? (
              <>
                <Loader2 className="h-10 w-10 animate-spin text-cyan-600" />
                <p className="font-medium">Subiendo {uploadingCount} imagen(es)...</p>
              </>
            ) : (
              <>
                <UploadCloud className="h-10 w-10" />
                {isDragActive ? (
                  <p className="font-medium">Suelta las imágenes aquí...</p>
                ) : (
                  <>
                    <p className="font-medium">
                      Arrastra y suelta imágenes, o haz clic para seleccionar
                    </p>
                    <p className="text-sm text-slate-500 dark:text-slate-500">
                      Máximo {maxImages} imágenes, hasta 5MB cada una
                    </p>
                    <p className="text-xs text-slate-400 dark:text-slate-600">
                      {value.length}/{maxImages} imágenes
                    </p>
                  </>
                )}
              </>
            )}
          </div>
        </div>
      )}

      {/* Instructions */}
      {value.length > 0 && (
        <div className="text-xs text-slate-500 dark:text-slate-500 space-y-1">
          <p>• Haz clic en la estrella para marcar una imagen como principal</p>
          <p>• Usa las flechas para cambiar el orden de las imágenes</p>
          <p>• Haz clic en la X para eliminar una imagen</p>
        </div>
      )}
    </div>
  );
};
