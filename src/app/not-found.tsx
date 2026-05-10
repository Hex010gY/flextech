import Link from 'next/link';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';

export default function NotFoundPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen pt-16 bg-white dark:bg-[#090F24] flex items-center justify-center">
        <div className="text-center px-4">
          <p className="text-8xl font-black text-blue-100 dark:text-blue-900/40 select-none mb-4">404</p>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-3">Page not found</h1>
          <p className="text-slate-500 dark:text-slate-400 mb-8 max-w-sm mx-auto">
            We couldn't find what you were looking for. It may have been moved or deleted.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <Link href="/" className="btn-primary">Go Home</Link>
            <Link href="/products" className="btn-secondary">Browse Products</Link>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
