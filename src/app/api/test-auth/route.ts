// src/app/api/test-auth/route.ts

import { NextResponse } from 'next/server';
import { createToken, setAuthCookie } from '@/lib/auth';

export async function POST(request: Request) {
  const { userId } = await request.json();

  if (!userId) {
    return NextResponse.json(
      { success: false, message: 'userId é obrigatório' },
      { status: 400 }
    );
  }

  // 1) Cria o token JWT
  const token = createToken({ userId });

  // 2) Retorna a resposta JSON com o cookie já configurado
  return setAuthCookie(token);
}
