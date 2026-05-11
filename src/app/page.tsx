import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight, Zap, Shield, Headphones, Truck, ChevronRight } from 'lucide-react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import WhatsAppButton from '@/components/shared/WhatsAppButton';
import ProductCard from '@/components/products/ProductCard';
import { getFeaturedProducts } from '@/lib/utils/products';
import { buildWhatsAppUrl } from '@/lib/utils';
import { Product } from '@/lib/types';

export const metadata: Metadata = {
  title: 'Flex Computers — Premium Laptops & Accessories in Sudan',
  description: 'Discover the best laptops and computing accessories at Flex Computers, Sudan. Gaming, business, and student laptops from top brands.',
};

export const revalidate = 60;

const features = [
  { icon: Zap,        title: 'Top Performance',  desc: 'Latest CPUs & GPUs for every need.' },
  { icon: Shield,     title: 'Genuine Products',  desc: '100% authentic with full warranty.' },
  { icon: Headphones, title: 'Expert Support',    desc: 'Personal advice from our team.' },
  { icon: Truck,      title: 'Fast Delivery',     desc: 'Quick delivery across the Netherlands.' },
];

const brands = ['Apple', 'Dell', 'HP', 'Lenovo', 'ASUS', 'MSI', 'Acer', 'Samsung'];

export default async function HomePage() {
  let featured: Product[] = [];
  let fetchError: string | null = null;

  try {
    featured = await getFeaturedProducts(8);
  } catch (err: unknown) {
    fetchError = (err as Error).message;
  }

  return (
    <>
      <Navbar />
      <main className="min-h-screen pt-16">

        {/* Debug error banner — remove after fixing */}
        {fetchError && (
          <div style={{ background: '#fef2f2', border: '1px solid #fca5a5', padding: '1rem', margin: '1rem', borderRadius: '8px' }}>
            <strong style={{ color: '#dc2626' }}>Server error:</strong>
            <pre style={{ color: '#7f1d1d', fontSize: '0.8rem', marginTop: '0.5rem' }}>{fetchError}</pre>
          </div>
        )}

        {/* Hero Section */}
        <section className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-[#0a1a4e] to-[#090F24] text-white">
          <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden>
            <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-blue-600/15 rounded-full blur-[120px]" />
            <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-blue-400/10 rounded-full blur-[100px]" />
          </div>

          <div className="container-page relative z-10 py-24 sm:py-32 lg:py-40">
            <div className="grid lg:grid-cols-2 gap-16 items-center">
              <div className="space-y-8 animate-fade-in">
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-blue-500/30 bg-blue-500/10 text-blue-300 text-xs font-semibold tracking-wider uppercase">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse" />
                  Rotterdam's #1 Laptop Store
                </div>

                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-[1.1] text-balance">
                  Find Your{' '}
                  <span className="bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text text-transparent">
                    Perfect Laptop
                  </span>{' '}
                  with Flex Computers
                </h1>

                <p className="text-lg text-slate-400 max-w-lg leading-relaxed">
                  From gaming powerhouses to sleek ultrabooks — discover our curated
                  selection of premium laptops and accessories at unbeatable prices.
                </p>

                <div className="flex flex-wrap gap-3">
                  <Link href="/products" className="btn-primary px-7 py-3.5 text-base">
                    Shop Now
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                  <a
                    href={buildWhatsAppUrl()}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-secondary px-7 py-3.5 text-base bg-white/10 border-white/20 text-white hover:bg-white/20"
                  >
                    Get Expert Advice
                  </a>
                </div>

                <div className="flex items-center gap-6 pt-2">
                  <div>
                    <p className="text-2xl font-bold text-white">500+</p>
                    <p className="text-xs text-slate-400">Products</p>
                  </div>
                  <div className="w-px h-10 bg-slate-700" />
                  <div>
                    <p className="text-2xl font-bold text-white">4.9★</p>
                    <p className="text-xs text-slate-400">Customer Rating</p>
                  </div>
                  <div className="w-px h-10 bg-slate-700" />
                  <div>
                    <p className="text-2xl font-bold text-white">5 yrs</p>
                    <p className="text-xs text-slate-400">In Business</p>
                  </div>
                </div>
              </div>

              <div className="relative hidden lg:flex items-center justify-center animate-float">
                <div className="relative w-full max-w-md aspect-square">
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-600/30 to-cyan-500/20 rounded-[2.5rem] blur-3xl" />
                  <div className="relative z-10 w-full h-full rounded-[2.5rem] bg-white/5 border border-white/10 backdrop-blur-sm flex items-center justify-center">
                    <div className="text-center p-8 space-y-4">
                      <div className="text-8xl">💻</div>
                      <p className="text-white/60 text-sm">Premium Laptops</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="absolute bottom-0 left-0 right-0">
            <svg viewBox="0 0 1440 60" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M0 60L1440 60L1440 0C1440 0 1080 60 720 60C360 60 0 0 0 0L0 60Z" className="fill-white dark:fill-[#090F24]" />
            </svg>
          </div>
        </section>

        {/* Features Strip */}
        <section className="py-14 bg-white dark:bg-[#090F24]">
          <div className="container-page">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
              {features.map((f) => (
                <div key={f.title} className="flex items-start gap-4 p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-700/40">
                  <div className="w-10 h-10 rounded-xl bg-blue-100 dark:bg-blue-900/40 flex items-center justify-center shrink-0">
                    <f.icon className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-slate-900 dark:text-white">{f.title}</h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 leading-relaxed">{f.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Featured Products */}
        {featured.length > 0 && (
          <section className="py-16 bg-slate-50 dark:bg-[#060D1F]">
            <div className="container-page">
              <div className="flex items-end justify-between mb-10">
                <div>
                  <p className="text-blue-600 dark:text-blue-400 text-sm font-semibold uppercase tracking-wider mb-2">Hand-picked</p>
                  <h2 className="section-title">Featured Products</h2>
                </div>
                <Link href="/products?featured=true" className="hidden sm:flex items-center gap-1.5 text-sm font-semibold text-blue-600 dark:text-blue-400">
                  View all <ChevronRight className="w-4 h-4" />
                </Link>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                {featured.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Brands */}
        <section className="py-16 bg-white dark:bg-[#090F24]">
          <div className="container-page">
            <p className="text-center text-sm font-semibold text-slate-400 uppercase tracking-widest mb-8">Brands We Carry</p>
            <div className="grid grid-cols-4 sm:grid-cols-8 gap-4">
              {brands.map((brand) => (
                <Link key={brand} href={`/products?brand=${brand}`} className="flex items-center justify-center py-4 px-3 rounded-xl border border-slate-100 dark:border-slate-800 hover:border-blue-300 dark:hover:border-blue-700 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all group">
                  <span className="text-xs font-bold text-slate-400 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">{brand}</span>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Banner */}
        <section className="py-16 bg-gradient-to-r from-blue-600 to-blue-800">
          <div className="container-page text-center text-white">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">Can't Find What You're Looking For?</h2>
            <p className="text-blue-200 text-lg mb-8 max-w-xl mx-auto">
              Our experts are ready to help. Contact us on WhatsApp and we'll find the perfect laptop for your needs and budget.
            </p>
            <a href={buildWhatsAppUrl()} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-8 py-4 bg-white text-blue-700 font-bold rounded-2xl hover:bg-blue-50 shadow-lg hover:shadow-xl transition-all duration-200">
              Chat with an Expert →
            </a>
          </div>
        </section>

      </main>
      <Footer />
      <WhatsAppButton />
    </>
  );
}
