// src/app/api/auth/route.ts
import { NextRequest } from 'next/server';
import { supabase } from '@/lib/supabase';
import { createToken, setAuthCookie } from '@/lib/auth';

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { type, email, password, nome, telefone } = body;

  // 1) LOGIN
  if (type === 'login') {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error || !data.user) {
      return new Response(
        JSON.stringify({ success: false, message: error?.message || 'Login falhou' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Cria e seta cookie
    const token = createToken({ userId: data.user.id });
    return setAuthCookie(token);
  }

  // 2) REGISTER
  if (type === 'register') {
    // 2.1) Cria no Auth
    const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
      email,
      password,
    });
    if (signUpError || !signUpData.user) {
      return new Response(
        JSON.stringify({ success: false, message: signUpError?.message || 'Cadastro falhou' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // 2.2) Insere no perfil
    const { error: profileError } = await supabase
      .from('perfil')
      .insert({
        user_ref: signUpData.user.id,
        nome,
        telefone,
        email,
      });
    if (profileError) {
      return new Response(
        JSON.stringify({ success: false, message: profileError.message }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // 2.3) Cria e seta cookie
    const token = createToken({ userId: signUpData.user.id });
    return setAuthCookie(token);
  }

  // 3) TIPO INVÁLIDO
  return new Response(
    JSON.stringify({ success: false, message: 'Tipo de requisição inválido' }),
    { status: 400, headers: { 'Content-Type': 'application/json' } }
  );
}
