import { createClient } from '@/lib/supabase/server';
import ProductForm from '@/components/admin/ProductForm';
import { Category } from '@/lib/types';

export const dynamic = 'force-dynamic';

export default async function NewProductPage() {
  const supabase = createClient();
  const { data: categories } = await supabase
    .from('categories')
    .select('*')
    .order('name');

  return (
    <div className="max-w-3xl space-y-5">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Add New Product</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Fill in the details to add a new product</p>
      </div>
      <ProductForm categories={(categories as Category[]) ?? []} />
    </div>
  );
}
