'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '../../../lib/supabase';
import Image from 'next/image';

type Product = {
  id: string;
  nome: string;
  preco: number;
  quantidade: number;
  image_url: string;
};

export default function ProductDetails({ params }: { params: { id: string } }) {
  const { id } = params; // O parâmetro `id` vem diretamente de `params`.
  const router = useRouter(); // Para navegar de volta.

  const [product, setProduct] = useState<Product | null>(null);

  useEffect(() => {
    if (id) {
      fetchProductDetails(id);
    }
  }, [id]);

  const fetchProductDetails = async (productId: string) => {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('id', productId)
      .single();

    if (error) {
      console.error('Erro ao buscar detalhes do produto:', error.message);
      return;
    }

    setProduct(data);
  };

  if (!product) {
    return <p>Carregando...</p>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Detalhes do Produto</h1>
      <div className="bg-white shadow-md rounded p-6 max-w-lg mx-auto">
        {product.image_url && (
          <Image
            src={product.image_url}
            alt={product.nome}
            width={200}
            height={200}
            className="w-full h-auto object-cover rounded mb-4"
          />
        )}
        <h2 className="text-xl font-bold">{product.nome}</h2>
        <p className="text-gray-500">Preço: ${product.preco.toFixed(2)}</p>
        <p className="text-gray-500">Quantidade: {product.quantidade} unidades</p>
        <button
          onClick={() => router.back()}
          className="mt-4 bg-blue-500 text-white px-4 py-2 rounded"
        >
          Voltar
        </button>
      </div>
    </div>
  );
}
