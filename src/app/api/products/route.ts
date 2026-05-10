import { NextRequest, NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/server';
import { slugify } from '@/lib/utils';

// GET /api/products — filtered product list
export async function GET(req: NextRequest) {
  try {
    const supabase = createAdminClient();
    const { searchParams } = new URL(req.url);

    let query = supabase
      .from('products')
      .select('*, category:categories(*)', { count: 'exact' });

    const search = searchParams.get('search');
    if (search) {
      query = query.or(`name.ilike.%${search}%,brand.ilike.%${search}%`);
    }

    const brand = searchParams.getAll('brand');
    if (brand.length) query = query.in('brand', brand);

    const page     = Number(searchParams.get('page') || 1);
    const pageSize = Number(searchParams.get('pageSize') || 12);
    const from = (page - 1) * pageSize;
    query = query.range(from, from + pageSize - 1);

    const sort = searchParams.get('sort') || 'newest';
    if (sort === 'price_asc')  query = query.order('price', { ascending: true });
    else if (sort === 'price_desc') query = query.order('price', { ascending: false });
    else query = query.order('created_at', { ascending: false });

    const { data, error, count } = await query;
    if (error) throw error;

    return NextResponse.json({
      success: true,
      data,
      meta: { page, pageSize, total: count ?? 0, totalPages: Math.ceil((count ?? 0) / pageSize) },
    });
  } catch (err: unknown) {
    return NextResponse.json({ success: false, error: (err as Error).message }, { status: 500 });
  }
}

// POST /api/products — create product
export async function POST(req: NextRequest) {
  try {
    const supabase = createAdminClient();
    const body = await req.json();

    const payload = { ...body, slug: slugify(body.name) };
    const { data, error } = await supabase.from('products').insert(payload).select().single();
    if (error) throw error;

    return NextResponse.json({ success: true, data }, { status: 201 });
  } catch (err: unknown) {
    return NextResponse.json({ success: false, error: (err as Error).message }, { status: 500 });
  }
}
