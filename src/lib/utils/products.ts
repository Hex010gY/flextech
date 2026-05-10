import { createClient } from '@/lib/supabase/server';
import { Product, ProductFilters, ProductsResponse, SortOption } from '@/lib/types';

const PAGE_SIZE = 12;

/**
 * Fetch paginated, filtered, and sorted products (server-side)
 */
export async function getProducts(
  filters: ProductFilters = {},
  sort: SortOption = 'newest',
  page = 1
): Promise<ProductsResponse> {
  const supabase = createClient();

  let query = supabase
    .from('products')
    .select('*, category:categories(*)', { count: 'exact' });

  // --- Text search ---
  if (filters.search) {
    query = query.or(
      `name.ilike.%${filters.search}%,brand.ilike.%${filters.search}%,description.ilike.%${filters.search}%`
    );
  }

  // --- Array filters ---
  if (filters.brand?.length) query = query.in('brand', filters.brand);
  if (filters.cpu?.length) query = query.in('cpu', filters.cpu);
  if (filters.gpu?.length) query = query.in('gpu', filters.gpu);
  if (filters.ram?.length) query = query.in('ram', filters.ram);
  if (filters.storage?.length) query = query.in('storage', filters.storage);

  // --- Price range ---
  if (filters.minPrice != null) query = query.gte('price', filters.minPrice);
  if (filters.maxPrice != null) query = query.lte('price', filters.maxPrice);

  // --- Boolean / exact filters ---
  if (filters.category) query = query.eq('category_id', filters.category);
  if (filters.stock_status) query = query.eq('stock_status', filters.stock_status);
  if (filters.is_featured != null) query = query.eq('is_featured', filters.is_featured);

  // --- Sort ---
  switch (sort) {
    case 'price_asc':  query = query.order('price', { ascending: true });  break;
    case 'price_desc': query = query.order('price', { ascending: false }); break;
    case 'name_asc':   query = query.order('name',  { ascending: true });  break;
    case 'name_desc':  query = query.order('name',  { ascending: false }); break;
    default:           query = query.order('created_at', { ascending: false });
  }

  // --- Pagination ---
  const from = (page - 1) * PAGE_SIZE;
  const to   = from + PAGE_SIZE - 1;
  query = query.range(from, to);

  const { data, error, count } = await query;

  if (error) throw new Error(error.message);

  return {
    data: (data as Product[]) ?? [],
    meta: {
      page,
      pageSize: PAGE_SIZE,
      total: count ?? 0,
      totalPages: Math.ceil((count ?? 0) / PAGE_SIZE),
    },
  };
}

/** Fetch a single product by slug */
export async function getProductBySlug(slug: string): Promise<Product | null> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('products')
    .select('*, category:categories(*)')
    .eq('slug', slug)
    .single();

  if (error) return null;
  return data as Product;
}

/** Fetch featured products */
export async function getFeaturedProducts(limit = 8): Promise<Product[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('products')
    .select('*, category:categories(*)')
    .eq('is_featured', true)
    .eq('stock_status', 'in_stock')
    .order('created_at', { ascending: false })
    .limit(limit);

  if (error) return [];
  return (data as Product[]) ?? [];
}

/** Fetch related products (same brand or category, excluding current) */
export async function getRelatedProducts(
  product: Product,
  limit = 4
): Promise<Product[]> {
  const supabase = createClient();
  const { data } = await supabase
    .from('products')
    .select('*, category:categories(*)')
    .neq('id', product.id)
    .or(`brand.eq.${product.brand},category_id.eq.${product.category_id}`)
    .limit(limit);

  return (data as Product[]) ?? [];
}

/** Get unique filter values (for sidebar filters) */
export async function getFilterOptions() {
  const supabase = createClient();
  const { data } = await supabase
    .from('products')
    .select('brand, cpu, gpu, ram, storage, price');

  if (!data) return { brands: [], cpus: [], gpus: [], rams: [], storages: [], priceRange: [0, 5000] };

  const uniq = <T>(arr: T[]) => [...new Set(arr.filter(Boolean))].sort() as T[];

  return {
    brands:    uniq(data.map((p) => p.brand)),
    cpus:      uniq(data.map((p) => p.cpu)),
    gpus:      uniq(data.map((p) => p.gpu)),
    rams:      uniq(data.map((p) => p.ram)),
    storages:  uniq(data.map((p) => p.storage)),
    priceRange: [
      Math.floor(Math.min(...data.map((p) => p.price))),
      Math.ceil( Math.max(...data.map((p) => p.price))),
    ],
  };
}
