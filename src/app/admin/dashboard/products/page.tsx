import Link from 'next/link';
import Image from 'next/image';
import { PlusCircle, Pencil, Trash2, Search } from 'lucide-react';
import { createClient } from '@/lib/supabase/server';
import { Product } from '@/lib/types';
import { formatPrice, getStockInfo, getProductImage } from '@/lib/utils';
import DeleteProductButton from '@/components/admin/DeleteProductButton';
import AdminSearchInput from '@/components/admin/AdminSearchInput';

export const dynamic = 'force-dynamic';

interface Props {
  searchParams: { search?: string };
}

export default async function AdminProductsPage({ searchParams }: Props) {
  const supabase = createClient();
  let query = supabase
    .from('products')
    .select('*, category:categories(name)')
    .order('created_at', { ascending: false });

  if (searchParams.search) {
    query = query.or(
      `name.ilike.%${searchParams.search}%,brand.ilike.%${searchParams.search}%`
    );
  }

  const { data: products } = await query;

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Products</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            {products?.length ?? 0} total products
          </p>
        </div>
        <Link href="/admin/dashboard/products/new" className="btn-primary shrink-0">
          <PlusCircle className="w-4 h-4" />
          Add Product
        </Link>
      </div>

      {/* Search */}
      <AdminSearchInput defaultValue={searchParams.search} placeholder="Search products…" />

      {/* Table */}
      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-100 dark:border-slate-700/50 bg-slate-50 dark:bg-slate-800/50">
                <th className="text-left px-4 py-3 font-semibold text-slate-600 dark:text-slate-300 w-12">#</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-600 dark:text-slate-300">Product</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-600 dark:text-slate-300 hidden md:table-cell">Brand</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-600 dark:text-slate-300 hidden lg:table-cell">Category</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-600 dark:text-slate-300">Price</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-600 dark:text-slate-300 hidden sm:table-cell">Status</th>
                <th className="text-right px-4 py-3 font-semibold text-slate-600 dark:text-slate-300">Actions</th>
              </tr>
            </thead>
            <tbody>
              {!products?.length ? (
                <tr>
                  <td colSpan={7} className="px-4 py-12 text-center text-slate-400 text-sm">
                    No products found.{' '}
                    <Link href="/admin/dashboard/products/new" className="text-blue-600 hover:underline">
                      Add your first product →
                    </Link>
                  </td>
                </tr>
              ) : (
                products.map((product: Product & { category: { name: string } }, idx) => {
                  const stock = getStockInfo(product.stock_status);
                  return (
                    <tr
                      key={product.id}
                      className="border-b border-slate-50 dark:border-slate-700/30 hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors"
                    >
                      <td className="px-4 py-3 text-slate-400 dark:text-slate-500 text-xs">{idx + 1}</td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-lg overflow-hidden bg-slate-100 dark:bg-slate-700 shrink-0">
                            <Image
                              src={getProductImage(product)}
                              alt={product.name}
                              width={40}
                              height={40}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <span className="font-medium text-slate-900 dark:text-white line-clamp-1 max-w-[180px]">
                            {product.name}
                          </span>
                        </div>
                      </td>
                      <td className="px-4 py-3 hidden md:table-cell text-slate-600 dark:text-slate-400">{product.brand}</td>
                      <td className="px-4 py-3 hidden lg:table-cell text-slate-500 dark:text-slate-400 text-xs">{product.category?.name ?? '—'}</td>
                      <td className="px-4 py-3 font-semibold text-slate-900 dark:text-white whitespace-nowrap">
                        {product.discount_price
                          ? formatPrice(product.discount_price)
                          : formatPrice(product.price)}
                      </td>
                      <td className="px-4 py-3 hidden sm:table-cell">
                        <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          product.stock_status === 'in_stock'     ? 'bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300' :
                          product.stock_status === 'out_of_stock' ? 'bg-red-100 dark:bg-red-900/40 text-red-700 dark:text-red-300' :
                          'bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-300'
                        }`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${stock.dot}`} />
                          {stock.label}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <Link
                            href={`/admin/dashboard/products/${product.id}`}
                            className="btn-ghost p-2 text-slate-500 hover:text-blue-600"
                            title="Edit"
                          >
                            <Pencil className="w-3.5 h-3.5" />
                          </Link>
                          <DeleteProductButton id={product.id} name={product.name} />
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
