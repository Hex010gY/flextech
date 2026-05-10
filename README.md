# 💻 FLEX COMPUTERS — Full-Stack Next.js Store

A production-ready laptop store web application built with Next.js 14, TypeScript, Tailwind CSS, and Supabase.

---

## ✨ Features

### Public Website
- Beautiful landing page with hero, features, and featured products
- Product catalog with advanced filtering (brand, CPU, GPU, RAM, storage, price)
- Product detail pages with image gallery and WhatsApp CTA
- Full-text search
- Sorting (newest, price, name)
- Pagination
- Loading skeletons
- Dark mode support
- SEO optimized (metadata, OpenGraph)
- Fully responsive (mobile-first)
- Floating WhatsApp button

### Admin Dashboard
- Secure login (Supabase Auth)
- Protected routes via middleware
- Product CRUD (add/edit/delete)
- Multi-image upload to Supabase Storage
- Category management
- Featured product toggle
- Stock status management
- Product search in admin

---

## 🛠️ Tech Stack

| Layer        | Technology              |
|--------------|------------------------|
| Framework    | Next.js 14 (App Router) |
| Language     | TypeScript              |
| Styling      | Tailwind CSS            |
| Database     | Supabase (PostgreSQL)   |
| Storage      | Supabase Storage        |
| Auth         | Supabase Auth           |
| Deployment   | Vercel                  |

---

## 📁 Project Structure

```
flex-computers/
├── docs/
│   ├── schema.sql          # Database schema + seed data
│   └── README.md
├── public/
│   └── images/             # Static assets
├── src/
│   ├── app/
│   │   ├── layout.tsx               # Root layout
│   │   ├── page.tsx                 # Homepage
│   │   ├── not-found.tsx            # 404 page
│   │   ├── products/
│   │   │   ├── page.tsx             # Product catalog
│   │   │   ├── loading.tsx          # Catalog skeleton
│   │   │   └── [id]/
│   │   │       ├── page.tsx         # Product detail
│   │   │       └── loading.tsx      # Detail skeleton
│   │   ├── admin/
│   │   │   ├── login/page.tsx       # Admin login
│   │   │   └── dashboard/
│   │   │       ├── layout.tsx       # Admin sidebar layout
│   │   │       ├── page.tsx         # Dashboard overview
│   │   │       ├── products/
│   │   │       │   ├── page.tsx     # Product list table
│   │   │       │   ├── new/page.tsx # Add product
│   │   │       │   └── [id]/page.tsx # Edit product
│   │   │       └── categories/
│   │   │           └── page.tsx     # Category manager
│   │   └── api/
│   │       ├── auth/callback/       # Supabase auth callback
│   │       ├── products/            # Products REST API
│   │       ├── categories/          # Categories REST API
│   │       └── upload/              # Image upload API
│   ├── components/
│   │   ├── layout/
│   │   │   ├── Navbar.tsx
│   │   │   └── Footer.tsx
│   │   ├── products/
│   │   │   ├── ProductCard.tsx
│   │   │   ├── ProductCardSkeleton.tsx
│   │   │   ├── ProductFilters.tsx
│   │   │   ├── ProductImageGallery.tsx
│   │   │   └── SortSelect.tsx
│   │   ├── admin/
│   │   │   ├── ProductForm.tsx
│   │   │   ├── CategoryManager.tsx
│   │   │   ├── DeleteProductButton.tsx
│   │   │   └── AdminSearchInput.tsx
│   │   ├── shared/
│   │   │   └── WhatsAppButton.tsx
│   │   └── ui/
│   │       ├── Pagination.tsx
│   │       └── EmptyState.tsx
│   ├── lib/
│   │   ├── supabase/
│   │   │   ├── client.ts            # Browser Supabase client
│   │   │   └── server.ts            # Server Supabase client
│   │   ├── utils/
│   │   │   ├── index.ts             # Utility functions
│   │   │   └── products.ts          # Data access layer
│   │   └── types/
│   │       └── index.ts             # TypeScript types
│   ├── middleware.ts                 # Auth middleware
│   └── styles/
│       └── globals.css
├── .env.local.example
├── next.config.js
├── tailwind.config.js
└── package.json
```

---

## 🚀 Setup Guide

### Prerequisites
- Node.js 18+
- npm or yarn
- Supabase account (free tier works)

### 1. Clone & Install

```bash
git clone <your-repo-url> flex-computers
cd flex-computers
npm install
```

### 2. Set Up Supabase

1. Go to [supabase.com](https://supabase.com) and create a new project
2. Copy your project URL and keys from **Settings → API**
3. In the SQL Editor, run the contents of `docs/schema.sql`
4. In Storage, the bucket `product-images` is created automatically by the SQL

### 3. Configure Environment Variables

```bash
cp .env.local.example .env.local
```

Edit `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_WHATSAPP_NUMBER=31612345678
NEXT_PUBLIC_STORE_NAME=Flex Computers
NEXT_PUBLIC_STORE_EMAIL=info@flexcomputers.nl
NEXT_PUBLIC_STORE_PHONE=+31 6 12 34 56 78
NEXT_PUBLIC_STORE_ADDRESS=Coolsingel 40, 3011 AD Rotterdam, Netherlands
```

### 4. Create Admin User

In Supabase Dashboard → **Authentication → Users → Add User**:
- Email: `admin@flexcomputers.nl`
- Password: (set a strong password)

### 5. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

Admin: [http://localhost:3000/admin/login](http://localhost:3000/admin/login)

---

## 🌐 Deployment on Vercel

### 1. Push to GitHub

```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/yourusername/flex-computers.git
git push -u origin main
```

### 2. Deploy to Vercel

1. Go to [vercel.com](https://vercel.com) → New Project
2. Import your GitHub repository
3. Add all environment variables from `.env.local`
4. Change `NEXT_PUBLIC_APP_URL` to your Vercel domain
5. Click **Deploy**

### 3. Configure Supabase Auth Redirect URLs

In Supabase → **Authentication → URL Configuration**:
- Site URL: `https://your-app.vercel.app`
- Redirect URLs: `https://your-app.vercel.app/api/auth/callback`

---

## 🔐 Authentication Flow

1. Admin visits `/admin/login`
2. Enters Supabase credentials
3. Supabase creates a session cookie
4. Middleware (`src/middleware.ts`) checks session on every `/admin/dashboard/*` route
5. Unauthenticated requests are redirected to `/admin/login`

---

## 📸 Adding Products

1. Log in at `/admin/login`
2. Go to **Products → Add Product**
3. Fill in product details and specs
4. Upload product images (stored in Supabase Storage)
5. Toggle **Featured** to show on homepage
6. Set **Stock Status** and save

---

## 🎨 Color Scheme

| Color      | Hex       | Usage                  |
|------------|-----------|------------------------|
| Blue 600   | `#2563eb` | Primary CTA, brand     |
| Blue 400   | `#60a5fa` | Dark mode accents       |
| Baby Blue  | `#bae0ff` | Highlights             |
| Slate 900  | `#0f172a` | Dark backgrounds       |
| White      | `#ffffff` | Light backgrounds      |

---

## 📝 License

MIT © Flex Computers
