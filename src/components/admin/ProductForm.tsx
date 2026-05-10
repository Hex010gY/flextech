'use client';

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Upload, X, Loader2, Plus } from 'lucide-react';
import toast from 'react-hot-toast';
import { Category, Product } from '@/lib/types';
import { slugify } from '@/lib/utils';
import { createClient } from '@/lib/supabase/client';

interface ProductFormProps {
  categories: Category[];
  product?: Product;  // undefined = create mode
}

const STOCK_OPTIONS = [
  { value: 'in_stock',     label: 'In Stock' },
  { value: 'out_of_stock', label: 'Out of Stock' },
  { value: 'pre_order',    label: 'Pre-Order' },
];

export default function ProductForm({ categories, product }: ProductFormProps) {
  const router   = useRouter();
  const supabase = createClient();
  const fileRef  = useRef<HTMLInputElement>(null);
  const isEdit   = !!product;

  const [loading,  setLoading]  = useState(false);
  const [previews, setPreviews] = useState<string[]>(product?.images ?? []);
  const [newFiles, setNewFiles] = useState<File[]>([]);
  const [form, setForm] = useState({
    name:         product?.name         ?? '',
    brand:        product?.brand        ?? '',
    category_id:  product?.category_id  ?? '',
    price:        product?.price?.toString() ?? '',
    discount_price: product?.discount_price?.toString() ?? '',
    cpu:          product?.cpu          ?? '',
    gpu:          product?.gpu          ?? '',
    ram:          product?.ram          ?? '',
    storage:      product?.storage      ?? '',
    screen_size:  product?.screen_size  ?? '',
    description:  product?.description  ?? '',
    stock_status: product?.stock_status ?? 'in_stock',
    is_featured:  product?.is_featured  ?? false,
    tags:         product?.tags?.join(', ') ?? '',
  });

  const set = (key: string, val: unknown) =>
    setForm((prev) => ({ ...prev, [key]: val }));

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    if (!files.length) return;

    setNewFiles((prev) => [...prev, ...files]);
    files.forEach((file) => {
      const reader = new FileReader();
      reader.onload = (ev) => {
        setPreviews((prev) => [...prev, ev.target?.result as string]);
      };
      reader.readAsDataURL(file);
    });
    e.target.value = '';
  };

  const removeImage = (idx: number) => {
    setPreviews((prev) => prev.filter((_, i) => i !== idx));
    // If it's a new file, remove it too
    const existingCount = (product?.images?.length ?? 0);
    if (idx >= existingCount) {
      const newIdx = idx - existingCount;
      setNewFiles((prev) => prev.filter((_, i) => i !== newIdx));
    }
  };

  const uploadImages = async (): Promise<string[]> => {
    if (!newFiles.length) return product?.images ?? [];

    const uploaded: string[] = [];
    for (const file of newFiles) {
      const ext  = file.name.split('.').pop();
      const path = `products/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
      const { error } = await supabase.storage.from('product-images').upload(path, file);
      if (error) throw new Error(`Upload failed: ${error.message}`);
      const { data: { publicUrl } } = supabase.storage.from('product-images').getPublicUrl(path);
      uploaded.push(publicUrl);
    }

    // Combine existing (non-removed) + new
    const existingKept = previews.filter((p) => !p.startsWith('data:'));
    return [...existingKept, ...uploaded];
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const toastId = toast.loading(isEdit ? 'Updating product…' : 'Creating product…');

    try {
      const imageUrls = await uploadImages();

      const payload = {
        name:          form.name,
        slug:          slugify(form.name),
        brand:         form.brand,
        category_id:   form.category_id || null,
        price:         parseFloat(form.price),
        discount_price: form.discount_price ? parseFloat(form.discount_price) : null,
        cpu:           form.cpu || null,
        gpu:           form.gpu || null,
        ram:           form.ram || null,
        storage:       form.storage || null,
        screen_size:   form.screen_size || null,
        description:   form.description || null,
        images:        imageUrls,
        stock_status:  form.stock_status,
        is_featured:   form.is_featured,
        tags:          form.tags.split(',').map((t) => t.trim()).filter(Boolean),
      };

      if (isEdit) {
        const { error } = await supabase.from('products').update(payload).eq('id', product!.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from('products').insert(payload);
        if (error) throw error;
      }

      toast.success(isEdit ? 'Product updated!' : 'Product created!', { id: toastId });
      router.push('/admin/dashboard/products');
      router.refresh();
    } catch (err: unknown) {
      toast.error((err as Error).message || 'Something went wrong', { id: toastId });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Basic info */}
      <div className="card p-6 space-y-5">
        <h2 className="font-semibold text-slate-800 dark:text-white">Basic Information</h2>

        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="input-label">Product Name *</label>
            <input required className="input" value={form.name} onChange={(e) => set('name', e.target.value)} placeholder="e.g. Dell XPS 15 9530" />
          </div>
          <div>
            <label className="input-label">Brand *</label>
            <input required className="input" value={form.brand} onChange={(e) => set('brand', e.target.value)} placeholder="e.g. Dell" />
          </div>
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="input-label">Category</label>
            <select className="input" value={form.category_id} onChange={(e) => set('category_id', e.target.value)}>
              <option value="">Select category…</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="input-label">Stock Status *</label>
            <select required className="input" value={form.stock_status} onChange={(e) => set('stock_status', e.target.value)}>
              {STOCK_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
            </select>
          </div>
        </div>

        <div>
          <label className="input-label">Description</label>
          <textarea rows={4} className="input resize-none" value={form.description} onChange={(e) => set('description', e.target.value)} placeholder="Product description…" />
        </div>

        <div>
          <label className="input-label">Tags (comma-separated)</label>
          <input className="input" value={form.tags} onChange={(e) => set('tags', e.target.value)} placeholder="gaming, ultrabook, 4K…" />
        </div>

        <label className="flex items-center gap-3 cursor-pointer group">
          <div className="relative">
            <input
              type="checkbox"
              checked={form.is_featured}
              onChange={(e) => set('is_featured', e.target.checked)}
              className="sr-only"
            />
            <div className={`w-10 h-5 rounded-full transition-colors ${form.is_featured ? 'bg-blue-600' : 'bg-slate-300 dark:bg-slate-600'}`}>
              <div className={`w-4 h-4 rounded-full bg-white shadow m-0.5 transition-transform ${form.is_featured ? 'translate-x-5' : 'translate-x-0'}`} />
            </div>
          </div>
          <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Featured product</span>
        </label>
      </div>

      {/* Pricing */}
      <div className="card p-6 space-y-4">
        <h2 className="font-semibold text-slate-800 dark:text-white">Pricing</h2>
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="input-label">Price (€) *</label>
            <input required type="number" min="0" step="0.01" className="input" value={form.price} onChange={(e) => set('price', e.target.value)} placeholder="999.00" />
          </div>
          <div>
            <label className="input-label">Discount Price (€)</label>
            <input type="number" min="0" step="0.01" className="input" value={form.discount_price} onChange={(e) => set('discount_price', e.target.value)} placeholder="Optional" />
          </div>
        </div>
      </div>

      {/* Specifications */}
      <div className="card p-6 space-y-4">
        <h2 className="font-semibold text-slate-800 dark:text-white">Specifications</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[
            { key: 'cpu',         label: 'CPU',         placeholder: 'Intel Core i7-13700H' },
            { key: 'gpu',         label: 'GPU',         placeholder: 'NVIDIA RTX 4060' },
            { key: 'ram',         label: 'RAM',         placeholder: '16GB DDR5' },
            { key: 'storage',     label: 'Storage',     placeholder: '512GB NVMe SSD' },
            { key: 'screen_size', label: 'Screen Size', placeholder: '15.6' },
          ].map(({ key, label, placeholder }) => (
            <div key={key}>
              <label className="input-label">{label}</label>
              <input className="input" value={(form as Record<string, string>)[key]} onChange={(e) => set(key, e.target.value)} placeholder={placeholder} />
            </div>
          ))}
        </div>
      </div>

      {/* Images */}
      <div className="card p-6 space-y-4">
        <h2 className="font-semibold text-slate-800 dark:text-white">Product Images</h2>

        {/* Preview grid */}
        {previews.length > 0 && (
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3">
            {previews.map((src, i) => (
              <div key={i} className="relative group aspect-square rounded-xl overflow-hidden bg-slate-100 dark:bg-slate-700">
                <Image src={src} alt="" fill className="object-cover" sizes="80px" />
                <button
                  type="button"
                  onClick={() => removeImage(i)}
                  className="absolute top-1 right-1 w-5 h-5 rounded-full bg-red-500 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Upload drop area */}
        <button
          type="button"
          onClick={() => fileRef.current?.click()}
          className="w-full border-2 border-dashed border-slate-300 dark:border-slate-600 rounded-xl py-8 text-center hover:border-blue-400 dark:hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all group"
        >
          <Upload className="w-8 h-8 text-slate-400 group-hover:text-blue-500 mx-auto mb-2 transition-colors" />
          <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Click to upload images</p>
          <p className="text-xs text-slate-400 mt-1">PNG, JPG, WEBP up to 10MB each</p>
        </button>
        <input
          ref={fileRef}
          type="file"
          multiple
          accept="image/*"
          className="hidden"
          onChange={handleFileChange}
        />
      </div>

      {/* Submit */}
      <div className="flex items-center gap-3">
        <button type="submit" disabled={loading} className="btn-primary">
          {loading && <Loader2 className="w-4 h-4 animate-spin" />}
          {loading ? 'Saving…' : isEdit ? 'Update Product' : 'Create Product'}
        </button>
        <button
          type="button"
          onClick={() => router.back()}
          className="btn-secondary"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
