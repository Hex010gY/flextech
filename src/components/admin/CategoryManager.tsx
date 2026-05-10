'use client';

import { useState } from 'react';
import { Plus, Pencil, Trash2, Check, X, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { Category } from '@/lib/types';
import { createClient } from '@/lib/supabase/client';
import { slugify } from '@/lib/utils';

interface CategoryManagerProps {
  initialCategories: Category[];
}

export default function CategoryManager({ initialCategories }: CategoryManagerProps) {
  const supabase = createClient();
  const [categories, setCategories] = useState<Category[]>(initialCategories);
  const [adding, setAdding]   = useState(false);
  const [loading, setLoading] = useState<string | null>(null);
  const [editId, setEditId]   = useState<string | null>(null);
  const [newName, setNewName] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [editName, setEditName] = useState('');
  const [editDesc, setEditDesc] = useState('');

  const handleAdd = async () => {
    if (!newName.trim()) return;
    setLoading('add');
    const payload = { name: newName.trim(), slug: slugify(newName), description: newDesc.trim() || null };
    const { data, error } = await supabase.from('categories').insert(payload).select().single();
    if (error) { toast.error(error.message); }
    else {
      setCategories((p) => [...p, data as Category]);
      toast.success('Category added');
      setNewName(''); setNewDesc(''); setAdding(false);
    }
    setLoading(null);
  };

  const startEdit = (cat: Category) => {
    setEditId(cat.id); setEditName(cat.name); setEditDesc(cat.description ?? '');
  };

  const handleEdit = async (id: string) => {
    setLoading(id);
    const { error } = await supabase
      .from('categories')
      .update({ name: editName, slug: slugify(editName), description: editDesc || null })
      .eq('id', id);
    if (error) { toast.error(error.message); }
    else {
      setCategories((p) => p.map((c) => c.id === id ? { ...c, name: editName, description: editDesc } : c));
      toast.success('Category updated');
      setEditId(null);
    }
    setLoading(null);
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Delete category "${name}"?`)) return;
    setLoading(id + '-del');
    const { error } = await supabase.from('categories').delete().eq('id', id);
    if (error) { toast.error(error.message); }
    else { setCategories((p) => p.filter((c) => c.id !== id)); toast.success('Deleted'); }
    setLoading(null);
  };

  return (
    <div className="space-y-4">
      {/* Add button */}
      {!adding && (
        <button onClick={() => setAdding(true)} className="btn-primary">
          <Plus className="w-4 h-4" /> Add Category
        </button>
      )}

      {/* Add form */}
      {adding && (
        <div className="card p-4 space-y-3 animate-scale-in">
          <p className="font-semibold text-slate-800 dark:text-white text-sm">New Category</p>
          <input className="input" placeholder="Name *" value={newName} onChange={(e) => setNewName(e.target.value)} />
          <input className="input" placeholder="Description (optional)" value={newDesc} onChange={(e) => setNewDesc(e.target.value)} />
          <div className="flex gap-2">
            <button onClick={handleAdd} disabled={loading === 'add' || !newName.trim()} className="btn-primary py-2 px-4">
              {loading === 'add' ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
              Save
            </button>
            <button onClick={() => { setAdding(false); setNewName(''); setNewDesc(''); }} className="btn-secondary py-2 px-4">
              <X className="w-4 h-4" /> Cancel
            </button>
          </div>
        </div>
      )}

      {/* List */}
      <div className="card overflow-hidden">
        {categories.length === 0 ? (
          <p className="text-center text-slate-400 py-10 text-sm">No categories yet.</p>
        ) : (
          <ul className="divide-y divide-slate-100 dark:divide-slate-700/50">
            {categories.map((cat) => (
              <li key={cat.id} className="px-5 py-4">
                {editId === cat.id ? (
                  <div className="space-y-2">
                    <input className="input" value={editName} onChange={(e) => setEditName(e.target.value)} />
                    <input className="input" placeholder="Description" value={editDesc} onChange={(e) => setEditDesc(e.target.value)} />
                    <div className="flex gap-2">
                      <button onClick={() => handleEdit(cat.id)} disabled={loading === cat.id} className="btn-primary py-1.5 px-3 text-xs">
                        {loading === cat.id ? <Loader2 className="w-3 h-3 animate-spin" /> : <Check className="w-3 h-3" />} Save
                      </button>
                      <button onClick={() => setEditId(null)} className="btn-secondary py-1.5 px-3 text-xs">
                        <X className="w-3 h-3" /> Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-slate-900 dark:text-white text-sm">{cat.name}</p>
                      {cat.description && (
                        <p className="text-xs text-slate-400 mt-0.5">{cat.description}</p>
                      )}
                    </div>
                    <div className="flex gap-1">
                      <button onClick={() => startEdit(cat)} className="btn-ghost p-2 text-slate-400 hover:text-blue-600">
                        <Pencil className="w-3.5 h-3.5" />
                      </button>
                      <button onClick={() => handleDelete(cat.id, cat.name)} disabled={loading === cat.id + '-del'} className="btn-ghost p-2 text-slate-400 hover:text-red-500">
                        {loading === cat.id + '-del' ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Trash2 className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                  </div>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
