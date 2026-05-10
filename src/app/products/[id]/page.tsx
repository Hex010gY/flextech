import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { ChevronRight, MessageCircle, Cpu, HardDrive, Monitor, MemoryStick, Tag } from 'lucide-react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import WhatsAppButton from '@/components/shared/WhatsAppButton';
import ProductCard from '@/components/products/ProductCard';
import { getProductBySlug, getRelatedProducts } from '@/lib/utils/products';
import { formatPrice, discountPercent, getStockInfo, buildWhatsAppUrl, cn } from '@/lib/utils';
import ProductImageGallery from '@/components/products/ProductImageGallery';

interface Props {
  params: { id: string };  // slug
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const product = await getProductBySlug(params.id);
  if (!product) return { title: 'Product Not Found' };
  return {
    title: product.name,
    description: product.description ?? `${product.brand} ${product.name} — available at Flex Computers`,
    openGraph: {
      images: product.images?.[0] ? [{ url: product.images[0] }] : [],
    },
  };
}

export const revalidate = 60;

export default async function ProductDetailPage({ params }: Props) {
  const product = await getProductBySlug(params.id);
  if (!product) notFound();

  const related   = await getRelatedProducts(product, 4);
  const stockInfo = getStockInfo(product.stock_status);
  const hasDiscount = product.discount_price && product.discount_price < product.price;
  const pct = hasDiscount ? discountPercent(product.price, product.discount_price!) : 0;

  const specs = [
    { icon: Cpu,         label: 'CPU',          value: product.cpu },
    { icon: MemoryStick, label: 'RAM',          value: product.ram },
    { icon: HardDrive,   label: 'Storage',      value: product.storage },
    { icon: Monitor,     label: 'Screen Size',  value: product.screen_size ? `${product.screen_size}"` : null },
  ].filter((s) => s.value);

  // Add GPU separately as it's not always a generic icon
  if (product.gpu) {
    specs.splice(1, 0, { icon: Cpu, label: 'GPU', value: product.gpu });
  }

  return (
    <>
      <Navbar />
      <main className="min-h-screen pt-16 bg-white dark:bg-[#090F24]">

        {/* Breadcrumb */}
        <div className="container-page py-4">
          <nav className="flex items-center gap-1.5 text-xs text-slate-400">
            <Link href="/" className="hover:text-blue-600 transition-colors">Home</Link>
            <ChevronRight className="w-3 h-3" />
            <Link href="/products" className="hover:text-blue-600 transition-colors">Products</Link>
            <ChevronRight className="w-3 h-3" />
            <span className="text-slate-600 dark:text-slate-300 truncate max-w-[200px]">{product.name}</span>
          </nav>
        </div>

        {/* Product detail */}
        <div className="container-page pb-16">
          <div className="grid lg:grid-cols-2 gap-12 items-start">
            {/* Gallery */}
            <ProductImageGallery images={product.images} name={product.name} />

            {/* Info */}
            <div className="lg:sticky lg:top-24 space-y-6">
              {/* Brand + badges */}
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-sm font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider">
                  {product.brand}
                </span>
                {product.is_featured && (
                  <span className="badge-blue text-xs">Featured</span>
                )}
                <span className={cn(
                  'badge text-xs border',
                  product.stock_status === 'in_stock'     ? 'bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800' :
                  product.stock_status === 'out_of_stock' ? 'bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 border-red-200 dark:border-red-800' :
                  'bg-amber-50 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-800'
                )}>
                  <span className={cn('w-1.5 h-1.5 rounded-full', stockInfo.dot)} />
                  {stockInfo.label}
                </span>
              </div>

              <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white leading-tight">
                {product.name}
              </h1>

              {/* Price */}
              <div className="flex items-baseline gap-3">
                {hasDiscount ? (
                  <>
                    <span className="text-3xl font-extrabold text-slate-900 dark:text-white">
                      {formatPrice(product.discount_price!)}
                    </span>
                    <span className="text-lg text-slate-400 line-through">
                      {formatPrice(product.price)}
                    </span>
                    <span className="badge bg-blue-600 text-white font-bold">-{pct}%</span>
                  </>
                ) : (
                  <span className="text-3xl font-extrabold text-slate-900 dark:text-white">
                    {formatPrice(product.price)}
                  </span>
                )}
              </div>

              {/* Specs */}
              {specs.length > 0 && (
                <div className="grid grid-cols-2 gap-3">
                  {specs.map((s) => (
                    <div
                      key={s.label}
                      className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-700/50"
                    >
                      <div className="w-8 h-8 rounded-lg bg-blue-100 dark:bg-blue-900/40 flex items-center justify-center shrink-0">
                        <s.icon className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                      </div>
                      <div>
                        <p className="text-[10px] text-slate-400 font-medium uppercase tracking-wider">{s.label}</p>
                        <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">{s.value}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Description */}
              {product.description && (
                <div className="prose prose-sm dark:prose-invert max-w-none text-slate-600 dark:text-slate-400">
                  <p className="leading-relaxed">{product.description}</p>
                </div>
              )}

              {/* Tags */}
              {product.tags?.length > 0 && (
                <div className="flex flex-wrap gap-2 items-center">
                  <Tag className="w-3.5 h-3.5 text-slate-400" />
                  {product.tags.map((tag) => (
                    <Link
                      key={tag}
                      href={`/products?search=${tag}`}
                      className="badge-gray hover:badge-blue transition-colors"
                    >
                      {tag}
                    </Link>
                  ))}
                </div>
              )}

              {/* CTA */}
              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <a
                  href={buildWhatsAppUrl(product.name)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 flex items-center justify-center gap-2 py-3.5 bg-green-500 hover:bg-green-400 text-white font-bold rounded-xl transition-colors shadow-lg hover:shadow-xl"
                >
                  <MessageCircle className="w-5 h-5" />
                  Order on WhatsApp
                </a>
                <Link
                  href="/products"
                  className="btn-secondary flex-none"
                >
                  ← Back
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Related products */}
        {related.length > 0 && (
          <section className="bg-slate-50 dark:bg-[#060D1F] py-16">
            <div className="container-page">
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-8">
                You May Also Like
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                {related.map((p) => (
                  <ProductCard key={p.id} product={p} />
                ))}
              </div>
            </div>
          </section>
        )}

      </main>
      <Footer />
      <WhatsAppButton />
    </>
  );
}
