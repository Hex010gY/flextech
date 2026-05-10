import { NextRequest, NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/server';
import { slugify } from '@/lib/utils';

interface Params { params: { id: string } }

export async function PATCH(req: NextRequest, { params }: Params) {
  try {
    const supabase = createAdminClient();
    const body = await req.json();
    if (body.name) body.slug = slugify(body.name);
    const { data, error } = await supabase
      .from('categories')
      .update(body)
      .eq('id', params.id)
      .select()
      .single();
    if (error) throw error;
    return NextResponse.json({ success: true, data });
  } catch (err: unknown) {
    return NextResponse.json({ success: false, error: (err as Error).message }, { status: 500 });
  }
}

export async function DELETE(_req: NextRequest, { params }: Params) {
  try {
    const supabase = createAdminClient();
    const { error } = await supabase.from('categories').delete().eq('id', params.id);
    if (error) throw error;
    return NextResponse.json({ success: true, message: 'Category deleted' });
  } catch (err: unknown) {
    return NextResponse.json({ success: false, error: (err as Error).message }, { status: 500 });
  }
}
