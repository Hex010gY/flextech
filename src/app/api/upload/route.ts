import { NextRequest, NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/server';

export async function POST(req: NextRequest) {
  try {
    const supabase = createAdminClient();
    const formData = await req.formData();
    const files    = formData.getAll('files') as File[];

    if (!files.length) {
      return NextResponse.json({ success: false, error: 'No files provided' }, { status: 400 });
    }

    const urls: string[] = [];

    for (const file of files) {
      const bytes  = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);
      const ext    = file.name.split('.').pop() ?? 'jpg';
      const path   = `products/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;

      const { error } = await supabase.storage
        .from('product-images')
        .upload(path, buffer, { contentType: file.type, upsert: false });

      if (error) throw new Error(`Failed to upload ${file.name}: ${error.message}`);

      const { data: { publicUrl } } = supabase.storage
        .from('product-images')
        .getPublicUrl(path);

      urls.push(publicUrl);
    }

    return NextResponse.json({ success: true, urls });
  } catch (err: unknown) {
    return NextResponse.json({ success: false, error: (err as Error).message }, { status: 500 });
  }
}
