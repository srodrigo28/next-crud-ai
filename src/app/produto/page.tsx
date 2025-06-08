'use client';

import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
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
  const [modalProduct, setModalProduct] = useState<Product | null>(null);

  const [form, setForm] = useState<{ id?: string; nome: string; preco: number; quantidade: number }>(
    {
      nome: '',
      preco: 0,
      quantidade: 0,
    }
  );

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
    fetchProducts();
  };

  const handleEdit = (product: Product) => {
    setForm(product);
    setImagePreview(product.image_url);
  };

  const handleCancel = () => {
    setForm({ nome: '', preco: 0, quantidade: 0 });
    setImageFile(null);
    setImagePreview(null);
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
    if (!confirm('Tem certeza que deseja excluir este produto?')) return;

    const { error: deleteError } = await supabase.from('products').delete().eq('id', id);
    if (deleteError) {
      console.error('Erro ao deletar produto:', deleteError.message);
      return;
    }
    fetchProducts();
  };

  const handleShowDetails = (product: Product) => {
    setModalProduct(product);
  };

  const handleCloseModal = () => {
    setModalProduct(null);
  };

  return (
    <div className="container flex gap-2 w-screen h-screen bg-blue-400 ">
      
      {/* Formulário */}
      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-md
        rounded p-6 h-72 mb-8"
      >
        <label className="block cursor-pointer mb-4 bg-gray-100">
          {imagePreview ? (
            <Image
              src={imagePreview}
              alt="Preview"
              width={150}
              height={250}
              className="rounded object-cover mx-auto h-44"
            />
          ) : (
            <div className="bg-gray-100 border-dashed border-2 border-gray-300 p-10 text-center rounded">
              <span className="text-gray-500">Adicionar Imagem</span>
            </div>
          )}
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="hidden"
          />
        </label>

        <div className="space-y-4">
          <input
            type="text"
            placeholder="Nome"
            value={form.nome}
            onChange={(e) => setForm({ ...form, nome: e.target.value })}
            className="w-full p-3 border rounded text-black"
            required
          />
          <div className="flex gap-2">
            <input
              type="number"
              placeholder="Preço"
              value={form.preco}
              onChange={(e) => setForm({ ...form, preco: Number(e.target.value) })}
              className="w-full p-3 border rounded text-black"
              required
            />
            <input
              type="number"
              placeholder="Quantidade"
              value={form.quantidade}
              onChange={(e) => setForm({ ...form, quantidade: Number(e.target.value) })}
              className="w-full p-3 border rounded text-black"
              required
            />
          </div>
        </div>

        <div>
          <button type="submit" className="mt-4 w-full bg-blue-600 text-white p-3 rounded">
            {form.id ? 'Atualizar Produto' : 'Cadastrar Produto'}
          </button>
          <button
            type="button"
            onClick={handleCancel}
            className="mt-4 w-full bg-red-600 text-white p-3 rounded"
          >
            Cancelar
          </button>
        </div>
      </form>

      {/* Lista de Produtos */}
      <ul className="space-y-4 bg-blue-300">
        {products.map((product) => (
          <li
            key={product.id}
            className="flex flex-col sm:flex-row items-center bg-white shadow-md rounded p-4"
          >
            {product.image_url && (
              <Image
                src={product.image_url}
                alt={product.nome}
                width={100}
                height={100}
                className="w-20 h-20 object-cover rounded"
              />
            )}
            <div className="flex-1 mt-4 sm:mt-0 sm:ml-4 text-center sm:text-left">
              <strong className="block text-lg">{product.nome}</strong>
              <span className="block text-gray-500">${product.preco.toFixed(2)}</span>
              <span className="block text-gray-500">{product.quantidade} unidades</span>
            </div>
            <div className="flex space-x-2 mt-4 sm:mt-0">
              <button
                onClick={() => handleEdit(product)}
                className="bg-yellow-500 text-white px-4 py-2 rounded"
              >
                Editar
              </button>
              <button
                onClick={() => handleDelete(product.id)}
                className="bg-red-500 text-white px-4 py-2 rounded"
              >
                Excluir
              </button>
              <button
                onClick={() => handleShowDetails(product)}
                className="bg-blue-500 text-white px-4 py-2 rounded"
              >
                Detalhes
              </button>
            </div>
          </li>
        ))}
      </ul>

      
      {/* Modal de Detalhes */}
      {modalProduct && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded shadow-lg max-w-md w-full relative">
            {modalProduct.image_url && (
              <Image
                src={modalProduct.image_url}
                alt={modalProduct.nome}
                width={400}
                height={400}
                className="rounded mb-2 bg-white"
              />
            )}
            <h2 className="text-xl font-bold text-center text-black p-2">{modalProduct.nome}</h2>
            <div className='flex gap-2'>
            <p className='text-black p-2'>Quantidade: {modalProduct.quantidade} unidades</p>
            <p className='text-black p-2'>Preço: R$ {modalProduct.preco.toFixed(2)}</p>
            </div>
            <button
              onClick={handleCloseModal}
              className="mt-4 bg-red-600 text-white px-4 py-2 rounded-2xl
              absolute top-1 right-3 cursor-pointer animate-pulse
              "
            >
              Fechar
            </button>
          </div>
        </div>
      )}

    </div>
  );
}