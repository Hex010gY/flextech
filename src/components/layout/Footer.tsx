import Link from 'next/link';
import { Laptop, MapPin, Phone, Mail, MessageCircle } from 'lucide-react';
import { buildWhatsAppUrl } from '@/lib/utils';

const storeInfo = {
  name:    process.env.NEXT_PUBLIC_STORE_NAME    || 'Flex Computers',
  address: process.env.NEXT_PUBLIC_STORE_ADDRESS || 'Coolsingel 40, 3011 AD Rotterdam, Netherlands',
  phone:   process.env.NEXT_PUBLIC_STORE_PHONE   || '+31 6 12 34 56 78',
  email:   process.env.NEXT_PUBLIC_STORE_EMAIL   || 'info@flexcomputers.nl',
};

export default function Footer() {
  return (
    <footer className="bg-slate-900 dark:bg-[#060D1F] text-slate-400 border-t border-slate-800">
      <div className="container-page py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand column */}
          <div className="lg:col-span-1">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center">
                <Laptop className="w-4 h-4 text-white" strokeWidth={2.5} />
              </div>
              <span className="font-bold text-white text-base tracking-tight">
                FLEX <span className="text-blue-400">COMPUTERS</span>
              </span>
            </Link>
            <p className="text-sm leading-relaxed mb-5 text-slate-400">
              Rotterdam's premier destination for laptops and computing accessories.
              Quality products, expert advice, unbeatable service.
            </p>
            <a
              href={buildWhatsAppUrl()}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-green-600 hover:bg-green-500 text-white text-sm font-semibold rounded-xl transition-colors"
            >
              <MessageCircle className="w-4 h-4" />
              WhatsApp Us
            </a>
          </div>

          {/* Quick links */}
          <div>
            <h3 className="text-white font-semibold text-sm mb-4 uppercase tracking-wider">
              Quick Links
            </h3>
            <ul className="space-y-2.5 text-sm">
              {[
                { label: 'Home',        href: '/' },
                { label: 'All Products', href: '/products' },
                { label: 'Laptops',     href: '/products?category=laptops' },
                { label: 'Accessories', href: '/products?category=accessories' },
                { label: 'Featured',    href: '/products?featured=true' },
              ].map((l) => (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    className="hover:text-blue-400 transition-colors"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Brands */}
          <div>
            <h3 className="text-white font-semibold text-sm mb-4 uppercase tracking-wider">
              Brands
            </h3>
            <ul className="space-y-2.5 text-sm">
              {['Apple', 'Dell', 'HP', 'Lenovo', 'ASUS', 'MSI', 'Acer', 'Samsung'].map((b) => (
                <li key={b}>
                  <Link
                    href={`/products?brand=${b}`}
                    className="hover:text-blue-400 transition-colors"
                  >
                    {b}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-white font-semibold text-sm mb-4 uppercase tracking-wider">
              Contact
            </h3>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-blue-400 mt-0.5 shrink-0" />
                <span>{storeInfo.address}</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-blue-400 shrink-0" />
                <a href={`tel:${storeInfo.phone}`} className="hover:text-blue-400 transition-colors">
                  {storeInfo.phone}
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-blue-400 shrink-0" />
                <a href={`mailto:${storeInfo.email}`} className="hover:text-blue-400 transition-colors">
                  {storeInfo.email}
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-10 pt-6 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
          <p>© {new Date().getFullYear()} Flex Computers. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <Link href="/admin/login" className="hover:text-slate-300 transition-colors">Admin</Link>
            <span>Rotterdam, Netherlands</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
