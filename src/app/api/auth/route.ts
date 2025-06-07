import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '../../../lib/supabase';

export async function POST(request: NextRequest) {
  const body = await request.json();

  if (body.type === 'login') {
    const { email, password } = body;
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      return NextResponse.json({ success: false, message: error.message }, { status: 400 });
    }

    return NextResponse.json({ success: true, user: data.user });
  } else if (body.type === 'register') {
    const { email, password, nome, telefone } = body;
    const { data, error } = await supabase.auth.signUp({ email, password });

    if (error) {
      return NextResponse.json({ success: false, message: error.message }, { status: 400 });
    }

    const { user } = data;

    const { error: profileError } = await supabase
      .from('perfil')
      .insert({ user_ref: user!.id, nome, telefone });

    if (profileError) {
      return NextResponse.json({ success: false, message: profileError.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, user });
  }

  return NextResponse.json({ success: false, message: 'Invalid request type' }, { status: 400 });
}
