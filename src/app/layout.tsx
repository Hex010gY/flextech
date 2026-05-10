import type { Metadata, Viewport } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import { ThemeProvider } from 'next-themes';
import { Toaster } from 'react-hot-toast';
import '@/styles/globals.css';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
  display: 'swap',
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
  display: 'swap',
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'https://flexcomputers.nl'),
  title: {
    default: 'Flex Computers — Premium Laptops & Accessories',
    template: '%s | Flex Computers',
  },
  description:
    'Flex Computers offers the best selection of laptops and accessories. Gaming, business, and student laptops from top brands at competitive prices.',
  keywords: ['laptops', 'computers', 'accessories', 'gaming laptops', 'business laptops', 'Rotterdam'],
  authors: [{ name: 'Flex Computers' }],
  openGraph: {
    type: 'website',
    locale: 'en_NL',
    url: '/',
    siteName: 'Flex Computers',
    images: [{ url: '/images/og-image.jpg', width: 1200, height: 630, alt: 'Flex Computers' }],
  },
  twitter: {
    card: 'summary_large_image',
    creator: '@flexcomputers',
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)',  color: '#090F24' },
  ],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${geistSans.variable} ${geistMono.variable} font-sans antialiased`}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          {children}
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: {
                borderRadius: '12px',
                fontSize: '14px',
                fontWeight: '500',
              },
            }}
          />
        </ThemeProvider>
      </body>
    </html>
  );
}
