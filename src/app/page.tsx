'use client';

import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import Image from 'next/image';

type Product = {
  id: string;
  nome: string;
  preco: number;
  quantidade: number;
  image_url: string;
};

export default function Home() {
  const [products, setProducts] = useState<Product[]>([]);
   const [imageFile, setImageFile] = useState<File | null>(null);
  const [form, setForm] = useState<{ id?: string; nome: string; preco: number; quantidade: number }>({
    nome: '',
    preco: 0,
    quantidade: 0,
  });

  // Fetch initial products
  useEffect(() => {
    fetchProducts();
  }, []);

  // Fetch all products from Supabase
  const fetchProducts = async () => {
    const { data, error } = await supabase.from('products').select('*');
    if (error) {
      console.error('Erro ao buscar produtos:', error.message);
      return;
    }
    if (data) setProducts(data);
  };

  // Handle form submission for create or update
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

  // Populate form with product data for editing
  const handleEdit = (product: Product) => {
    setForm(product);
  };

  // Delete a product by ID
  // Delete a product by ID
const handleDelete = async (id: string) => {
  // Encontrar o produto no estado
  const productToDelete = products.find((product) => product.id === id);

  if (!productToDelete) {
    console.error('Produto não encontrado.');
    return;
  }

  // Deletar o registro no banco de dados
  const { error: deleteError } = await supabase.from('products').delete().eq('id', id);

  if (deleteError) {
    console.error('Erro ao deletar produto:', deleteError.message);
    return;
  }

  // Remover a imagem associada (se houver)
  if (productToDelete.image_url) {
    // Extrair o caminho relativo no bucket
    const path = productToDelete.image_url.split('/produto/')[1]; // Obtém "nome-da-imagem"
    if (path) {
      const { error: storageError } = await supabase.storage.from('box3').remove([`produto/${path}`]);
      if (storageError) {
        console.error('Erro ao deletar imagem do storage:', storageError.message);
      }
    }
  }

  // Atualizar localmente o estado
  setProducts((prev) => prev.filter((product) => product.id !== id));
};

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">CRUD de Produtos</h1>

      {/* Product Form */}
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

      {/* Product List */}
      <ul>
        {products.map((product) => (
          <li key={product.id} className="border-b p-2 flex items-center">
            {/* Imagem do Produto */}
            {product.image_url && (
              <Image
                src={product.image_url}
                alt={product.nome}
                width={100}
                height={100}
                className="w-16 h-16 object-cover mr-4"
              />
            )}
            {/* Detalhes do Produto */}
            <div>
              <strong>{product.nome}</strong> - ${product.preco.toFixed(2)} - {product.quantidade} unidades
            </div>
            {/* Botões */}
            <div className="ml-auto">
              <button
                onClick={() => handleEdit(product)}
                className="bg-yellow-500 text-white px-2 py-1 mr-2"
              >
                Editar
              </button>
              <button
                onClick={() => handleDelete(product.id)}
                className="bg-red-500 text-white px-2 py-1"
              >
                Excluir
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
