'use client';

import { useState } from 'react';
import { UploadCloud, X, Image as ImageIcon } from 'lucide-react';
import { useDropzone } from 'react-dropzone';
import { Input } from './input';
import { Button } from './button';

interface ImageUploadProps {
  value: (File | string)[];
  onChange: (value: (File | string)[]) => void;
}

export const ImageUpload: React.FC<ImageUploadProps> = ({ value, onChange }) => {
  const [urlInput, setUrlInput] = useState('');

  const onDrop = (acceptedFiles: File[]) => {
    onChange([...value, ...acceptedFiles]);
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'image/*': ['.jpeg', '.jpg', '.png', '.gif', '.webp'] },
  });

  const handleRemove = (index: number) => {
    const newValue = [...value];
    newValue.splice(index, 1);
    onChange(newValue);
  };

  const handleAddUrl = () => {
    if (urlInput && !value.includes(urlInput)) {
      onChange([...value, urlInput]);
      setUrlInput('');
    }
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-4">
        {value.map((item, index) => (
          <div key={index} className="relative aspect-square rounded-md overflow-hidden group">
            <img
              src={typeof item === 'string' ? item : URL.createObjectURL(item)}
              alt={`Product image ${index + 1}`}
              className="w-full h-full object-cover"
            />
            <div className="absolute top-1 right-1">
              <Button
                type="button"
                size="icon"
                variant="destructive"
                className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={() => handleRemove(index)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
        ))}
      </div>

      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
          isDragActive
            ? 'border-cyan-600 dark:border-cyan-500 bg-cyan-50 dark:bg-cyan-950/30'
            : 'border-slate-300 dark:border-slate-700 hover:border-cyan-500 dark:hover:border-cyan-400'
        }`}
      >
        <input {...getInputProps()} />
        <div className="flex flex-col items-center gap-2 text-slate-600 dark:text-slate-400">
          <UploadCloud className="h-10 w-10" />
          {isDragActive ? (
            <p>Suelta las imágenes aquí...</p>
          ) : (
            <p>Arrastra y suelta imágenes, o haz clic para seleccionarlas</p>
          )}
        </div>
      </div>
      <div className="flex gap-2">
        <Input
          type="text"
          placeholder="O pega una URL de imagen"
          value={urlInput}
          onChange={(e) => setUrlInput(e.target.value)}
        />
        <Button type="button" variant="outline" onClick={handleAddUrl}>
          Añadir URL
        </Button>
      </div>
    </div>
  );
};
