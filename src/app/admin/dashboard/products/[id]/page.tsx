import { notFound } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import ProductForm from '@/components/admin/ProductForm';
import { Category, Product } from '@/lib/types';

export const dynamic = 'force-dynamic';

interface Props { params: { id: string } }

export default async function EditProductPage({ params }: Props) {
  const supabase = createClient();

  const [{ data: product }, { data: categories }] = await Promise.all([
    supabase.from('products').select('*').eq('id', params.id).single(),
    supabase.from('categories').select('*').order('name'),
  ]);

  if (!product) notFound();

  return (
    <div className="max-w-3xl space-y-5">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Edit Product</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 truncate">{product.name}</p>
      </div>
      <ProductForm
        categories={(categories as Category[]) ?? []}
        product={product as Product}
      />
    </div>
  );
}
