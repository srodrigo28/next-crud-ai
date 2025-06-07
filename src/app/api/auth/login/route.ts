import { NextRequest } from 'next/server';
import { supabase } from '@/lib/supabase';
import { createToken, setAuthCookie } from '@/lib/auth';

export async function POST(request: NextRequest) {
  const { email, password } = await request.json();

  const { data, error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    return new Response(JSON.stringify({ success: false, message: error.message }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  if (!data.user) {
    return new Response(JSON.stringify({ success: false, message: 'Usuário não encontrado' }), {
      status: 404,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const token = createToken({ userId: data.user.id });

  // Aqui retorna a resposta com o cookie configurado via setAuthCookie(token)
  return setAuthCookie(token);
}
