'use client';

import Image from 'next/image';
import Link from 'next/link';
import { MessageCircle } from 'lucide-react';
import { Product } from '@/lib/types';
import { formatPrice, discountPercent, getProductImage, getStockInfo, cn, buildWhatsAppUrl } from '@/lib/utils';

interface ProductCardProps {
  product: Product;
  className?: string;
}

export default function ProductCard({ product, className }: ProductCardProps) {
  const image     = getProductImage(product);
  const stockInfo = getStockInfo(product.stock_status);
  const hasDiscount = product.discount_price && product.discount_price < product.price;
  const pct = hasDiscount ? discountPercent(product.price, product.discount_price!) : 0;

  return (
    <Link
      href={`/products/${product.slug}`}
      className={cn(
        'group card-hover flex flex-col overflow-hidden cursor-pointer',
        className
      )}
    >
      {/* Image container */}
      <div className="relative aspect-[4/3] bg-slate-50 dark:bg-slate-800/50 overflow-hidden rounded-t-2xl">
        <Image
          src={image}
          alt={product.name}
          fill
          className="object-cover object-center transition-transform duration-500 group-hover:scale-105"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
        />

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5">
          {product.is_featured && (
            <span className="badge-blue text-[10px] uppercase tracking-wider font-bold">
              Featured
            </span>
          )}
          {hasDiscount && (
            <span className="badge bg-blue-600 text-white text-[10px] font-bold">
              -{pct}%
            </span>
          )}
        </div>

        {/* Stock badge */}
        <div className="absolute top-3 right-3">
          <span className={cn('badge bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm', stockInfo.color)}>
            <span className={cn('w-1.5 h-1.5 rounded-full', stockInfo.dot)} />
            {stockInfo.label}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="flex flex-col flex-1 p-4 gap-2">
        <div>
          <p className="text-xs text-blue-600 dark:text-blue-400 font-semibold uppercase tracking-wider mb-0.5">
            {product.brand}
          </p>
          <h3 className="text-sm font-semibold text-slate-900 dark:text-white leading-snug line-clamp-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
            {product.name}
          </h3>
        </div>

        {/* Specs */}
        <div className="flex flex-wrap gap-1 mt-1">
          {product.ram && (
            <span className="badge-gray text-[10px]">{product.ram} RAM</span>
          )}
          {product.storage && (
            <span className="badge-gray text-[10px]">{product.storage}</span>
          )}
          {product.screen_size && (
            <span className="badge-gray text-[10px]">{product.screen_size}"</span>
          )}
        </div>

        {/* Price */}
        <div className="flex items-baseline gap-2 mt-auto pt-2">
          {hasDiscount ? (
            <>
              <span className="text-lg font-bold text-slate-900 dark:text-white">
                {formatPrice(product.discount_price!)}
              </span>
              <span className="text-sm text-slate-400 line-through">
                {formatPrice(product.price)}
              </span>
            </>
          ) : (
            <span className="text-lg font-bold text-slate-900 dark:text-white">
              {formatPrice(product.price)}
            </span>
          )}
        </div>
      </div>

      {/* WhatsApp CTA — shown on hover */}
      <div className="px-4 pb-4 pt-0 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-1 group-hover:translate-y-0">
        <a
          href={buildWhatsAppUrl(product.name)}
          target="_blank"
          rel="noopener noreferrer"
          onClick={(e) => e.stopPropagation()}
          className="flex items-center justify-center gap-2 w-full py-2 bg-green-500 hover:bg-green-400 text-white text-xs font-semibold rounded-xl transition-colors"
        >
          <MessageCircle className="w-3.5 h-3.5" />
          Inquire on WhatsApp
        </a>
      </div>
    </Link>
  );
}
