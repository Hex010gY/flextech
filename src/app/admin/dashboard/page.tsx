import Link from 'next/link';
import { Package, Tag, TrendingUp, PlusCircle, Star, AlertTriangle } from 'lucide-react';
import { createClient } from '@/lib/supabase/server';

async function getStats() {
  const supabase = createClient();
  const [
    { count: total },
    { count: featured },
    { count: outOfStock },
    { count: categories },
  ] = await Promise.all([
    supabase.from('products').select('*', { count: 'exact', head: true }),
    supabase.from('products').select('*', { count: 'exact', head: true }).eq('is_featured', true),
    supabase.from('products').select('*', { count: 'exact', head: true }).eq('stock_status', 'out_of_stock'),
    supabase.from('categories').select('*', { count: 'exact', head: true }),
  ]);

  return {
    total:      total ?? 0,
    featured:   featured ?? 0,
    outOfStock: outOfStock ?? 0,
    categories: categories ?? 0,
  };
}

export default async function AdminDashboardPage() {
  const stats = await getStats();

  const statCards = [
    { icon: Package,       label: 'Total Products',  value: stats.total,      color: 'text-blue-600',   bg: 'bg-blue-50 dark:bg-blue-900/30' },
    { icon: Star,          label: 'Featured',        value: stats.featured,   color: 'text-amber-500',  bg: 'bg-amber-50 dark:bg-amber-900/30' },
    { icon: AlertTriangle, label: 'Out of Stock',    value: stats.outOfStock, color: 'text-red-500',    bg: 'bg-red-50 dark:bg-red-900/30' },
    { icon: Tag,           label: 'Categories',      value: stats.categories, color: 'text-emerald-600',bg: 'bg-emerald-50 dark:bg-emerald-900/30' },
  ];

  const quickActions = [
    { label: 'Add New Product', href: '/admin/dashboard/products/new', icon: PlusCircle, primary: true },
    { label: 'Manage Products', href: '/admin/dashboard/products',     icon: Package,    primary: false },
    { label: 'Categories',      href: '/admin/dashboard/categories',   icon: Tag,        primary: false },
  ];

  return (
    <div className="space-y-6 max-w-5xl">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Dashboard</h1>
        <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">Welcome back to Flex Computers Admin</p>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((stat) => (
          <div key={stat.label} className="card p-5">
            <div className={`w-10 h-10 rounded-xl ${stat.bg} flex items-center justify-center mb-3`}>
              <stat.icon className={`w-5 h-5 ${stat.color}`} />
            </div>
            <p className="text-2xl font-bold text-slate-900 dark:text-white">{stat.value}</p>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Quick actions */}
      <div className="card p-5">
        <h2 className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-4">Quick Actions</h2>
        <div className="flex flex-wrap gap-3">
          {quickActions.map((action) => (
            <Link
              key={action.href}
              href={action.href}
              className={action.primary ? 'btn-primary' : 'btn-secondary'}
            >
              <action.icon className="w-4 h-4" />
              {action.label}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
