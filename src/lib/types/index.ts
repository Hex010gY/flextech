// ============================================================
// FLEX COMPUTERS — Central Type Definitions
// ============================================================

// ----- Database types (mirror Supabase schema) -----

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  image_url: string | null;
  created_at: string;
  updated_at: string;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  brand: string;
  category_id: string;
  category?: Category;
  price: number;
  discount_price: number | null;
  cpu: string | null;
  gpu: string | null;
  ram: string | null;
  storage: string | null;
  screen_size: string | null;
  description: string | null;
  images: string[];        // Array of Supabase storage URLs
  stock_status: 'in_stock' | 'out_of_stock' | 'pre_order';
  is_featured: boolean;
  tags: string[];
  created_at: string;
  updated_at: string;
}

export interface ProductImage {
  id: string;
  product_id: string;
  url: string;
  sort_order: number;
  created_at: string;
}

// ----- Filter / Search types -----

export interface ProductFilters {
  search?: string;
  brand?: string[];
  cpu?: string[];
  gpu?: string[];
  ram?: string[];
  storage?: string[];
  minPrice?: number;
  maxPrice?: number;
  category?: string;
  stock_status?: string;
  is_featured?: boolean;
}

export type SortOption =
  | 'price_asc'
  | 'price_desc'
  | 'newest'
  | 'name_asc'
  | 'name_desc';

export interface PaginationMeta {
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
}

export interface ProductsResponse {
  data: Product[];
  meta: PaginationMeta;
}

// ----- API response wrappers -----

export interface ApiSuccess<T> {
  success: true;
  data: T;
  message?: string;
}

export interface ApiError {
  success: false;
  error: string;
}

export type ApiResponse<T> = ApiSuccess<T> | ApiError;

// ----- Form types -----

export interface ProductFormData {
  name: string;
  brand: string;
  category_id: string;
  price: string;
  discount_price: string;
  cpu: string;
  gpu: string;
  ram: string;
  storage: string;
  screen_size: string;
  description: string;
  stock_status: 'in_stock' | 'out_of_stock' | 'pre_order';
  is_featured: boolean;
  tags: string;
  images: File[];
  existingImages: string[];
}

export interface CategoryFormData {
  name: string;
  slug: string;
  description: string;
  image_url: string;
}

// ----- UI types -----

export interface NavItem {
  label: string;
  href: string;
}

export interface FilterOption {
  label: string;
  value: string;
  count?: number;
}

export type ToastType = 'success' | 'error' | 'loading';

// ----- Auth types -----

export interface AdminUser {
  id: string;
  email: string;
  role: string;
}
