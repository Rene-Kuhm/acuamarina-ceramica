export interface Customer {
  id: string;
  userId: string;
  companyName?: string;
  taxId?: string;
  birthDate?: Date;
  notes?: string;
  totalSpent: number;
  totalOrders: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateCustomerDTO {
  userId: string;
  companyName?: string;
  taxId?: string;
  birthDate?: Date;
  notes?: string;
}

export interface UpdateCustomerDTO {
  companyName?: string;
  taxId?: string;
  birthDate?: Date;
  notes?: string;
}
