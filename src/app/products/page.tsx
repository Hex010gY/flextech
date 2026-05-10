import type { Metadata } from 'next';
import { Suspense } from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import WhatsAppButton from '@/components/shared/WhatsAppButton';
import ProductCard from '@/components/products/ProductCard';
import ProductFilters from '@/components/products/ProductFilters';
import Pagination from '@/components/ui/Pagination';
import EmptyState from '@/components/ui/EmptyState';
import { getProducts, getFilterOptions } from '@/lib/utils/products';
import { SortOption, ProductFilters as FiltersType } from '@/lib/types';
import SortSelect from '@/components/products/SortSelect';

export const metadata: Metadata = {
  title: 'All Products',
  description: 'Browse our full range of laptops and accessories. Filter by brand, CPU, RAM, GPU, storage, and price.',
};

// ISR: revalidate every 60s
export const revalidate = 60;

interface SearchParams {
  search?:  string;
  brand?:   string | string[];
  cpu?:     string | string[];
  gpu?:     string | string[];
  ram?:     string | string[];
  storage?: string | string[];
  minPrice?: string;
  maxPrice?: string;
  category?: string;
  sort?:    string;
  page?:    string;
  featured?: string;
}

function toArray(val: string | string[] | undefined): string[] | undefined {
  if (!val) return undefined;
  return Array.isArray(val) ? val : [val];
}

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const filters: FiltersType = {
    search:    searchParams.search,
    brand:     toArray(searchParams.brand),
    cpu:       toArray(searchParams.cpu),
    gpu:       toArray(searchParams.gpu),
    ram:       toArray(searchParams.ram),
    storage:   toArray(searchParams.storage),
    minPrice:  searchParams.minPrice ? Number(searchParams.minPrice) : undefined,
    maxPrice:  searchParams.maxPrice ? Number(searchParams.maxPrice) : undefined,
    category:  searchParams.category,
    is_featured: searchParams.featured === 'true' ? true : undefined,
  };

  const sort    = (searchParams.sort as SortOption) || 'newest';
  const page    = Number(searchParams.page) || 1;

  const [{ data: products, meta }, filterOptions] = await Promise.all([
    getProducts(filters, sort, page),
    getFilterOptions(),
  ]);

  return (
    <>
      <Navbar />
      <main className="min-h-screen pt-16 bg-white dark:bg-[#090F24]">
        {/* Page header */}
        <div className="bg-slate-50 dark:bg-[#060D1F] border-b border-slate-100 dark:border-slate-800">
          <div className="container-page py-8">
            <h1 className="section-title mb-1">
              {filters.search ? `Results for "${filters.search}"` : 'All Products'}
            </h1>
            <p className="text-slate-500 dark:text-slate-400 text-sm">
              {meta.total} product{meta.total !== 1 ? 's' : ''} found
            </p>
          </div>
        </div>

        <div className="container-page py-8">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Sidebar filters */}
            <aside className="lg:w-64 shrink-0">
              <ProductFilters
                brands={filterOptions.brands}
                cpus={filterOptions.cpus}
                gpus={filterOptions.gpus}
                rams={filterOptions.rams}
                storages={filterOptions.storages}
                priceRange={filterOptions.priceRange as [number, number]}
              />
            </aside>

            {/* Main content */}
            <div className="flex-1 min-w-0">
              {/* Sort bar */}
              <div className="flex items-center justify-between mb-6">
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  Page {meta.page} of {meta.totalPages}
                </p>
                <Suspense fallback={<div className="skeleton h-9 w-40 rounded-xl" />}>
                  <SortSelect currentSort={sort} />
                </Suspense>
              </div>

              {/* Product grid */}
              {products.length === 0 ? (
                <EmptyState
                  title="No products found"
                  description="Try adjusting your search query or clearing some filters."
                  action={{ label: 'Clear filters', href: '/products' }}
                />
              ) : (
                <>
                  <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
                    {products.map((product) => (
                      <ProductCard key={product.id} product={product} />
                    ))}
                  </div>

                  <Suspense fallback={null}>
                    <Pagination currentPage={meta.page} totalPages={meta.totalPages} />
                  </Suspense>
                </>
              )}
            </div>
          </div>
        </div>
      </main>
      <Footer />
      <WhatsAppButton />
    </>
  );
}
