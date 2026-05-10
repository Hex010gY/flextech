'use client';

import { useState, useTransition } from 'react';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { ChevronDown, ChevronUp, X, SlidersHorizontal } from 'lucide-react';
import { cn } from '@/lib/utils';

interface FilterGroup {
  key: string;
  label: string;
  options: string[];
}

interface ProductFiltersProps {
  brands:   string[];
  cpus:     string[];
  gpus:     string[];
  rams:     string[];
  storages: string[];
  priceRange: [number, number];
}

function FilterSection({
  label, options, paramKey, selectedValues, onChange,
}: {
  label: string;
  options: string[];
  paramKey: string;
  selectedValues: string[];
  onChange: (key: string, val: string, checked: boolean) => void;
}) {
  const [open, setOpen] = useState(true);

  return (
    <div className="border-b border-slate-100 dark:border-slate-700/50 pb-4 last:border-0">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center justify-between w-full py-2 text-sm font-semibold text-slate-800 dark:text-slate-200"
      >
        {label}
        {open ? <ChevronUp className="w-3.5 h-3.5 text-slate-400" /> : <ChevronDown className="w-3.5 h-3.5 text-slate-400" />}
      </button>
      {open && (
        <div className="mt-2 space-y-1.5 max-h-48 overflow-y-auto pr-1">
          {options.map((opt) => (
            <label key={opt} className="flex items-center gap-2.5 cursor-pointer group">
              <input
                type="checkbox"
                checked={selectedValues.includes(opt)}
                onChange={(e) => onChange(paramKey, opt, e.target.checked)}
                className="w-4 h-4 rounded border-slate-300 dark:border-slate-600 text-blue-600 focus:ring-blue-500"
              />
              <span className="text-sm text-slate-600 dark:text-slate-400 group-hover:text-slate-900 dark:group-hover:text-slate-200 transition-colors">
                {opt}
              </span>
            </label>
          ))}
        </div>
      )}
    </div>
  );
}

export default function ProductFilters({
  brands, cpus, gpus, rams, storages, priceRange,
}: ProductFiltersProps) {
  const router     = useRouter();
  const pathname   = usePathname();
  const searchParams = useSearchParams();
  const [, startTransition] = useTransition();
  const [mobileOpen, setMobileOpen] = useState(false);

  // Read current filter state from URL
  const getValues = (key: string) => searchParams.getAll(key);

  const handleChange = (key: string, val: string, checked: boolean) => {
    const params = new URLSearchParams(searchParams.toString());
    const current = params.getAll(key);
    params.delete(key);
    if (checked) {
      [...current, val].forEach((v) => params.append(key, v));
    } else {
      current.filter((v) => v !== val).forEach((v) => params.append(key, v));
    }
    params.set('page', '1');
    startTransition(() => router.push(`${pathname}?${params.toString()}`));
  };

  const clearAll = () => {
    const params = new URLSearchParams();
    const search = searchParams.get('search');
    if (search) params.set('search', search);
    startTransition(() => router.push(`${pathname}?${params.toString()}`));
  };

  const hasFilters =
    ['brand', 'cpu', 'gpu', 'ram', 'storage'].some((k) => searchParams.has(k));

  const filterGroups: FilterGroup[] = [
    { key: 'brand',   label: 'Brand',   options: brands },
    { key: 'cpu',     label: 'CPU',     options: cpus },
    { key: 'gpu',     label: 'GPU',     options: gpus },
    { key: 'ram',     label: 'RAM',     options: rams },
    { key: 'storage', label: 'Storage', options: storages },
  ].filter((g) => g.options.length > 0);

  const FilterContent = (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-slate-900 dark:text-white flex items-center gap-2">
          <SlidersHorizontal className="w-4 h-4 text-blue-600" />
          Filters
        </h3>
        {hasFilters && (
          <button
            onClick={clearAll}
            className="text-xs text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
          >
            <X className="w-3 h-3" />
            Clear all
          </button>
        )}
      </div>

      {filterGroups.map((g) => (
        <FilterSection
          key={g.key}
          label={g.label}
          options={g.options}
          paramKey={g.key}
          selectedValues={getValues(g.key)}
          onChange={handleChange}
        />
      ))}
    </div>
  );

  return (
    <>
      {/* Mobile toggle */}
      <div className="lg:hidden mb-4">
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="btn-secondary w-full justify-between"
        >
          <span className="flex items-center gap-2">
            <SlidersHorizontal className="w-4 h-4" />
            Filters {hasFilters && <span className="badge-blue text-[10px]">Active</span>}
          </span>
          {mobileOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>
        {mobileOpen && (
          <div className="card p-5 mt-2 animate-slide-down">
            {FilterContent}
          </div>
        )}
      </div>

      {/* Desktop sidebar */}
      <div className="hidden lg:block card p-5 sticky top-24">
        {FilterContent}
      </div>
    </>
  );
}
