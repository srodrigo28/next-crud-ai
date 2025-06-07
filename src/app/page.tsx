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
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [form, setForm] = useState<{ id?: string; nome: string; preco: number; quantidade: number }>({
    nome: '',
    preco: 0,
    quantidade: 0,
  });

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    const { data, error } = await supabase.from('products').select('*');
    if (error) {
      console.error('Erro ao buscar produtos:', error.message);
      return;
    }
    if (data) setProducts(data);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    let imageUrl = null;
    if (imageFile) {
      const fileName = `${Date.now()}-${imageFile.name}`;
      const { error } = await supabase.storage.from('box3').upload(`produto/${fileName}`, imageFile);

      if (error) {
        console.error('Erro ao enviar imagem:', error.message);
        return;
      }

      imageUrl = supabase.storage.from('box3').getPublicUrl(`produto/${fileName}`).data.publicUrl;
    }

    const { error: insertError } = await supabase.from('products').insert([
      { ...form, image_url: imageUrl },
    ]);

    if (insertError) {
      console.error('Erro ao salvar produto:', insertError.message);
      return;
    }

    setForm({ nome: '', preco: 0, quantidade: 0 });
    setImageFile(null);
    setImagePreview(null);
    alert('Produto cadastrado com sucesso!');
    fetchProducts(); // Atualiza a lista
  };

  const handleEdit = (product: Product) => {
    setForm(product);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setImageFile(file);
    if (file) {
      const reader = new FileReader();
      reader.onload = () => setImagePreview(reader.result as string);
      reader.readAsDataURL(file);
    } else {
      setImagePreview(null);
    }
  };

  const handleDelete = async (id: string) => {
    const productToDelete = products.find((product) => product.id === id);

    if (!productToDelete) {
      console.error('Produto não encontrado.');
      return;
    }

    const { error: deleteError } = await supabase.from('products').delete().eq('id', id);

    if (deleteError) {
      console.error('Erro ao deletar produto:', deleteError.message);
      return;
    }

    if (productToDelete.image_url) {
      const path = productToDelete.image_url.split('/produto/')[1];
      if (path) {
        const { error: storageError } = await supabase.storage.from('box3').remove([`produto/${path}`]);
        if (storageError) {
          console.error('Erro ao deletar imagem do storage:', storageError.message);
        }
      }
    }

    fetchProducts(); // Atualiza a lista após exclusão
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">CRUD de Produtos</h1>

      <form onSubmit={handleSubmit} className="mb-5 w-full mx-auto">
        <label className="cursor-pointer w-36 bg-gray-200 hover:bg-gray-300 p-2 rounded flex items-center justify-center mb-4">
          {imagePreview ? (
            <Image src={imagePreview} alt="Preview" width={100} height={100} className="rounded" />
          ) : (
            <span className="text-sm text-gray-700">Adicionar Imagem</span>
          )}
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="hidden"
          />
        </label>
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
        <button type="submit" className="bg-blue-500 text-white px-4 py-2 mt-4">
          Cadastrar Produto
        </button>
      </form>

      <ul>
        {products.map((product) => (
          <li key={product.id} className="border-b p-2 flex items-center">
            {product.image_url && (
              <Image
                src={product.image_url}
                alt={product.nome}
                width={100}
                height={100}
                className="w-16 h-16 object-cover mr-4"
              />
            )}
            <div>
              <strong>{product.nome}</strong> - ${product.preco.toFixed(2)} - {product.quantidade} unidades
            </div>
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
