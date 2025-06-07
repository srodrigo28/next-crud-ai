// middleware.ts

import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Defina aqui apenas as rotas que devem realmente ser protegidas
export const config = {
  matcher: ['/dashboard/:path*', '/home/:path*'],
};

export function middleware(req: NextRequest) {
  // Tente ler o cookie exatamente com o mesmo nome que você usou em setAuthCookie
  const token = req.cookies.get('auth_token')?.value;

  // DEBUG: para ver no terminal se o cookie está vindo
  console.log('[middleware] token:', token);

  // Se não tiver token, redireciona para /login
  if (!token) {
    const url = req.nextUrl.clone();
    url.pathname = '/login';
    return NextResponse.redirect(url);
  }

  // Se houver token, deixa passar
  return NextResponse.next();
}
