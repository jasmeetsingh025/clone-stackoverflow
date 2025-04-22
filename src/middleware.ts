import getOrCreateDB from './models/server/dbSetup';
import getOrCreateStorage from './models/server/storageSetup';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// This function can be marked `async` if using `await` inside
export async function middleware(request: NextRequest) {
  await Promise.all([getOrCreateDB(), getOrCreateStorage()]);
  return NextResponse.next();
}

// See "Matching Paths" below to learn more
export const config = {
  // match all the request paths except for the ones that start with /api
  // and the ones in the /_next/static and /_next/image routes, favicons
  // regex: /^(?!.*\/api|.*\/_next\/static|.*\/_next\/image|.*\/favicon.ico|.*\/about).*/,
  // matcher: ['/((?!api|_next/static|_next/image|favicon.ico|about).*)'],\

  matcher: [
    '/home',
    '/contact',
    '/((?!api|_next/static|_next/image|favicon.ico|about|contact).*)',
  ],
};
