export type InventoryStatus = 'available' | 'low_stock' | 'out_of_stock';

export type Gender = 'hombre' | 'mujer';

export interface ProductImage {
  id: number;
  url: string;
  alt: string;
  is_primary: boolean;
  order: number;
}

export interface ProductVariant {
  id: number;
  size: string | null;
  color: string | null;
  color_hex: string | null;
  price: number;
  compare_price: number | null;
  inventory_status: InventoryStatus;
  sku: string;
}

export interface Category {
  id: number;
  name: string;
  slug: string;
  description: string | null;
}

export interface Product {
  id: number;
  name: string;
  slug: string;
  description: string | null;
  price: number;
  compare_price: number | null;
  inventory_status: InventoryStatus;
  images: ProductImage[];
  variants: ProductVariant[];
  category: Category | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  gender?: Gender;
}

export interface ProductFilters {
  category?: string;
  categoryId?: number;
  page?: number;
  limit?: number;
  search?: string;
  gender?: Gender;
}
