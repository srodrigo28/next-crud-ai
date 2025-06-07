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
    const { data } = await supabase.from('products').select('*');
    if (data) setProducts(data);
  };

  // Handle form submission for create or update
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (form.id) {
      // Update existing product
      await supabase
        .from('products')
        .update({
          nome: form.nome,
          preco: form.preco,
          quantidade: form.quantidade,
        })
        .eq('id', form.id);
    } else {
      // Add a new product
      await supabase.from('products').insert([form]);
    }
    // Reset form and refresh products
    setForm({ nome: '', preco: 0, quantidade: 0 });
    fetchProducts();
  };

  // Populate form with product data for editing
  const handleEdit = (product: Product) => {
    setForm(product);
  };

  // Delete a product by ID
  const handleDelete = async (id: string) => {
    await supabase.from('products').delete().eq('id', id);
    fetchProducts();
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">CRUD de Produtos</h1>

      {/* Product Form */}
      <form onSubmit={handleSubmit} className="mb-4">
        <input
          type="text"
          placeholder="Nome"
          value={form.nome}
          onChange={(e) => setForm({ ...form, nome: e.target.value })}
          className="border p-2 mr-2"
          required
        />
        <input
          type="number"
          placeholder="Preço"
          value={form.preco}
          onChange={(e) => setForm({ ...form, preco: Number(e.target.value) })}
          className="border p-2 mr-2"
          required
        />
        <input
          type="number"
          placeholder="Quantidade"
          value={form.quantidade}
          onChange={(e) => setForm({ ...form, quantidade: Number(e.target.value) })}
          className="border p-2 mr-2"
          required
        />
        <button type="submit" className="bg-blue-500 text-white px-4 py-2">
          {form.id ? 'Atualizar Produto' : 'Adicionar Produto'}
        </button>
        {form.id && (
          <button
            type="button"
            onClick={() => setForm({ nome: '', preco: 0, quantidade: 0 })}
            className="bg-gray-500 text-white px-4 py-2 ml-2"
          >
            Cancelar
          </button>
        )}
      </form>

      {/* Product List */}
      <ul>
        {products.map((product) => (
          <li key={product.id} className="border-b p-2 flex justify-between items-center">
            <div>
              <strong>{product.nome}</strong> - ${product.preco.toFixed(2)} - {product.quantidade} unidades
            </div>
            <div>
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
