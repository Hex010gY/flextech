import { NextResponse, type NextRequest } from 'next/server';

// Temporarily disable middleware auth check — handle protection in page instead
export async function middleware(request: NextRequest) {
  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*'],
};
