import { ProductGridSkeleton } from '@/components/products/ProductCardSkeleton';

export default function ProductsLoading() {
  return (
    <div className="min-h-screen pt-16 bg-white dark:bg-[#090F24]">
      <div className="bg-slate-50 dark:bg-[#060D1F] border-b border-slate-100 dark:border-slate-800">
        <div className="container-page py-8">
          <div className="skeleton h-9 w-48 rounded mb-2" />
          <div className="skeleton h-4 w-24 rounded" />
        </div>
      </div>
      <div className="container-page py-8">
        <div className="flex gap-8">
          <div className="hidden lg:block w-64 shrink-0">
            <div className="card p-5 space-y-4">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="space-y-2">
                  <div className="skeleton h-4 w-20 rounded" />
                  <div className="skeleton h-3 w-full rounded" />
                  <div className="skeleton h-3 w-4/5 rounded" />
                </div>
              ))}
            </div>
          </div>
          <div className="flex-1">
            <ProductGridSkeleton count={9} />
          </div>
        </div>
      </div>
    </div>
  );
}
