import { sign, verify } from 'jsonwebtoken';
import { serialize } from 'cookie';
import { NextResponse } from 'next/server';

const JWT_SECRET = process.env.JWT_SECRET || 'seu_segredo_super_secreto';

// 1) Cria token
export function createToken(payload: object) {
  return sign(payload, JWT_SECRET, { expiresIn: '1d' });
}

// 2) Verifica token
export function verifyToken(token: string) {
  try {
    return verify(token, JWT_SECRET);
  } catch {
    return null;
  }
}

// 3) Seta cookie de autenticação
export function setAuthCookie(token: string) {
  const cookie = serialize('auth_token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    maxAge: 60 * 60 * 24,
    path: '/',
    sameSite: 'lax',
  });
  const response = NextResponse.json({ success: true });
  response.headers.set('Set-Cookie', cookie);
  return response;
}

// 4) Limpa cookie (logout)
export function clearAuthCookie() {
  const cookie = serialize('auth_token', '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    maxAge: 0,
    path: '/',
    sameSite: 'lax',
  });
  const response = NextResponse.json({ success: true });
  response.headers.set('Set-Cookie', cookie);
  return response;
}
