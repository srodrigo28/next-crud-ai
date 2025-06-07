'use client';

import { useState } from 'react';
import { supabase } from '../../lib/supabase';

type ProductForm = {
  nome: string;
  preco: number;
  quantidade: number;
};

export default function Cadastrar() {
  const [form, setForm] = useState<ProductForm>({ nome: '', preco: 0, quantidade: 0 });
  const [imageFile, setImageFile] = useState<File | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Upload da imagem
    let imageUrl = null;
    if (imageFile) {
      const fileName = `${Date.now()}-${imageFile.name}`;
      const { error } = await supabase.storage.from('box3').upload(`produto/${fileName}`, imageFile);
      // const { data, error } = await supabase.storage.from('box3').upload(`produto/${fileName}`, imageFile);

      if (error) {
        console.error('Erro ao enviar imagem:', error.message);
        return;
      }

      imageUrl = supabase.storage.from('box3').getPublicUrl(`produto/${fileName}`).data.publicUrl;
    }

    // Salvar dados do produto no banco
    const { error: insertError } = await supabase.from('products').insert([
      { ...form, image_url: imageUrl },
    ]);

    if (insertError) {
      console.error('Erro ao salvar produto:', insertError.message);
      return;
    }

    // Limpar formulário
    setForm({ nome: '', preco: 0, quantidade: 0 });
    setImageFile(null);
    alert('Produto cadastrado com sucesso!');
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Cadastrar Produto</h1>

      <form onSubmit={handleSubmit} className="mb-4">
        {/* Nome */}
        <input
          type="text"
          placeholder="Nome"
          value={form.nome}
          onChange={(e) => setForm({ ...form, nome: e.target.value })}
          className="border p-2 mr-2"
          required
        />
        {/* Preço */}
        <input
          type="number"
          placeholder="Preço"
          value={form.preco}
          onChange={(e) => setForm({ ...form, preco: Number(e.target.value) })}
          className="border p-2 mr-2"
          required
        />
        {/* Quantidade */}
        <input
          type="number"
          placeholder="Quantidade"
          value={form.quantidade}
          onChange={(e) => setForm({ ...form, quantidade: Number(e.target.value) })}
          className="border p-2 mr-2"
          required
        />
        {/* Upload de Imagem */}
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setImageFile(e.target.files?.[0] || null)}
          className="block mb-4"
        />
        {/* Botão */}
        <button type="submit" className="bg-blue-500 text-white px-4 py-2">
          Cadastrar Produto
        </button>
      </form>
    </div>
  );
}
