import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { Product } from '@/lib/types';

// Merge Tailwind classes safely
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Format price in euros
export function formatPrice(price: number): string {
  return new Intl.NumberFormat('nl-NL', {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(price);
}

// Calculate discount percentage
export function discountPercent(price: number, discountPrice: number): number {
  return Math.round(((price - discountPrice) / price) * 100);
}

// Generate a URL-friendly slug from a string
export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

// Truncate text with ellipsis
export function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength).trimEnd() + '…';
}

// Get first available product image
export function getProductImage(product: Product): string {
  if (product.images && product.images.length > 0) {
    return product.images[0];
  }
  return '/images/placeholder-laptop.svg';
}

// Build WhatsApp inquiry URL
export function buildWhatsAppUrl(productName?: string): string {
  const phone = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '31612345678';
  const message = productName
    ? `Hi! I'm interested in the ${productName}. Can you provide more details?`
    : `Hi! I'd like to know more about your products.`;
  return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
}

// Stock status label and color
export function getStockInfo(status: Product['stock_status']): {
  label: string;
  color: string;
  dot: string;
} {
  switch (status) {
    case 'in_stock':
      return { label: 'In Stock', color: 'text-emerald-600 dark:text-emerald-400', dot: 'bg-emerald-500' };
    case 'out_of_stock':
      return { label: 'Out of Stock', color: 'text-red-500 dark:text-red-400', dot: 'bg-red-500' };
    case 'pre_order':
      return { label: 'Pre-Order', color: 'text-amber-600 dark:text-amber-400', dot: 'bg-amber-500' };
    default:
      return { label: 'Unknown', color: 'text-gray-500', dot: 'bg-gray-400' };
  }
}

// Debounce helper
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function debounce<T extends (...args: any[]) => void>(
  fn: T,
  delay: number
): (...args: Parameters<T>) => void {
  let timer: ReturnType<typeof setTimeout>;
  return (...args: Parameters<T>) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  };
}

// Parse comma-separated tags string
export function parseTags(tagsString: string): string[] {
  return tagsString
    .split(',')
    .map((t) => t.trim())
    .filter(Boolean);
}
