import { apiClient } from './client';

export interface UploadResponse {
  success: boolean;
  data: {
    id?: number;
    url: string;
    cloudinaryId: string;
    width: number;
    height: number;
  };
}

export interface DeleteImageResponse {
  success: boolean;
  message: string;
}

/**
 * Upload product image to Cloudinary via backend
 */
export async function uploadProductImage(
  file: File,
  productId?: number,
  options?: {
    altText?: string;
    isPrimary?: boolean;
  }
): Promise<UploadResponse> {
  const formData = new FormData();
  formData.append('image', file);

  if (productId) {
    formData.append('productId', productId.toString());
  }

  if (options?.altText) {
    formData.append('altText', options.altText);
  }

  if (options?.isPrimary !== undefined) {
    formData.append('isPrimary', options.isPrimary.toString());
  }

  return apiClient.post<UploadResponse>('/upload/product-image', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
}

/**
 * Upload category image to Cloudinary via backend
 */
export async function uploadCategoryImage(
  file: File,
  categoryId?: number
): Promise<UploadResponse> {
  const formData = new FormData();
  formData.append('image', file);

  if (categoryId) {
    formData.append('categoryId', categoryId.toString());
  }

  return apiClient.post<UploadResponse>('/upload/category-image', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
}

/**
 * Delete image from Cloudinary and database
 */
export async function deleteImage(imageId: number): Promise<DeleteImageResponse> {
  return apiClient.delete<DeleteImageResponse>(`/upload/${imageId}`);
}
