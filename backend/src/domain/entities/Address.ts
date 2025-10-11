export interface Address {
  id: string;
  userId: string;
  label?: string;
  firstName: string;
  lastName: string;
  phone: string;
  streetAddress: string;
  streetNumber: string;
  apartment?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  isDefault: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateAddressDTO {
  userId: string;
  label?: string;
  firstName: string;
  lastName: string;
  phone: string;
  streetAddress: string;
  streetNumber: string;
  apartment?: string;
  city: string;
  state: string;
  postalCode: string;
  country?: string;
  isDefault?: boolean;
}

export interface UpdateAddressDTO {
  label?: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  streetAddress?: string;
  streetNumber?: string;
  apartment?: string;
  city?: string;
  state?: string;
  postalCode?: string;
  country?: string;
  isDefault?: boolean;
}
