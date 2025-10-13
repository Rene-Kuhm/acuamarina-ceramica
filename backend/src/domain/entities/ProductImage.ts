export interface ProductImage {
  id: string;
  productId: string;
  imageUrl: string;
  thumbnailUrl?: string;
  altText?: string;
  displayOrder: number;
  isPrimary: boolean;
  createdAt: Date;
}

export interface CreateProductImageDTO {
  productId: string;
  imageUrl: string;
  thumbnailUrl?: string;
  altText?: string;
  displayOrder?: number;
  isPrimary?: boolean;
}

export interface UpdateProductImageDTO {
  altText?: string;
  displayOrder?: number;
  isPrimary?: boolean;
}
