import { NextResponse } from 'next/server';
import { supabase } from '../../../lib/supabase'; // ajuste o caminho conforme seu projeto

export async function GET() {
  const { data, error } = await supabase
    .from('perfil')
    .select('user_ref, nome, telefone, email, avatar_url')
    .order('nome', { ascending: true });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const users = data.map((user) => ({
    id: user.user_ref,
    nome: user.nome,
    email: user.email,
    avatar_url: user.avatar_url,
  }));

  return NextResponse.json({ users });
}
