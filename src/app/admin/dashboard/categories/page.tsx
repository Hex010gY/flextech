import { createClient } from '@/lib/supabase/server';
import CategoryManager from '@/components/admin/CategoryManager';
import { Category } from '@/lib/types';

export const dynamic = 'force-dynamic';

export default async function AdminCategoriesPage() {
  const supabase = createClient();
  const { data: categories } = await supabase
    .from('categories')
    .select('*')
    .order('name');

  return (
    <div className="max-w-2xl space-y-5">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Categories</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
          Manage product categories
        </p>
      </div>
      <CategoryManager initialCategories={(categories as Category[]) ?? []} />
    </div>
  );
}
