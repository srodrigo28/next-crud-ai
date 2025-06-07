agora quero um exemplo de crud usando nextjs com supabase nesse crud preciso que seja de produtos que tenha nome preco e quantidade usando supabase e typescript é claro.


O ChatGPT disse:
Vamos criar um CRUD de produtos com Next.js, Supabase, e TypeScript. Este projeto terá funcionalidades para criar, listar, atualizar e excluir produtos, onde cada produto tem nome, preço, e quantidade.

Aqui está um guia passo a passo e o código completo.

1. Instalar Dependências
Inicie um projeto Next.js e instale as dependências necessárias:

bash
Copiar
Editar
npx create-next-app@latest my-crud-app --typescript
cd my-crud-app
npm install @supabase/supabase-js
2. Configurar Supabase
Crie um projeto no Supabase.

No painel do Supabase, crie uma tabela chamada products com as colunas:

id (UUID, primary key, default: gen_random_uuid())

nome (text)

preco (decimal)

quantidade (integer)

Obtenha sua URL e chave do Supabase no painel de configurações do projeto.

3. Criar o Cliente do Supabase
No diretório do projeto, crie um arquivo lib/supabase.ts para inicializar o cliente:

typescript
Copiar
Editar
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_KEY!;

export const supabase = createClient(supabaseUrl, supabaseKey);
No arquivo .env.local, adicione suas variáveis de ambiente:

env
Copiar
Editar
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_KEY=your-supabase-anon-key
4. Criar API para Produtos
Adicione um arquivo em pages/api/products.ts para as operações CRUD:

typescript
Copiar
Editar
import type { NextApiRequest, NextApiResponse } from 'next';
import { supabase } from '../../lib/supabase';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { method } = req;

  switch (method) {
    case 'GET':
      const { data: products, error } = await supabase.from('products').select('*');
      if (error) return res.status(500).json({ error: error.message });
      return res.status(200).json(products);

    case 'POST':
      const { nome, preco, quantidade } = req.body;
      const { data, error: insertError } = await supabase
        .from('products')
        .insert([{ nome, preco, quantidade }]);
      if (insertError) return res.status(500).json({ error: insertError.message });
      return res.status(201).json(data);

    case 'PUT':
      const { id, ...updateFields } = req.body;
      const { data: updated, error: updateError } = await supabase
        .from('products')
        .update(updateFields)
        .eq('id', id);
      if (updateError) return res.status(500).json({ error: updateError.message });
      return res.status(200).json(updated);

    case 'DELETE':
      const { deleteId } = req.body;
      const { error: deleteError } = await supabase.from('products').delete().eq('id', deleteId);
      if (deleteError) return res.status(500).json({ error: deleteError.message });
      return res.status(204).end();

    default:
      res.setHeader('Allow', ['GET', 'POST', 'PUT', 'DELETE']);
      return res.status(405).end(`Method ${method} Not Allowed`);
  }
}
5. Criar a Interface do CRUD
Edite o pages/index.tsx para implementar a interface:

typescript
Copiar
Editar
import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

type Product = {
  id: string;
  nome: string;
  preco: number;
  quantidade: number;
};

export default function Home() {
  const [products, setProducts] = useState<Product[]>([]);
  const [form, setForm] = useState({ nome: '', preco: 0, quantidade: 0 });

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    const { data } = await supabase.from('products').select('*');
    if (data) setProducts(data);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await supabase.from('products').insert([form]);
    setForm({ nome: '', preco: 0, quantidade: 0 });
    fetchProducts();
  };

  const handleDelete = async (id: string) => {
    await supabase.from('products').delete().eq('id', id);
    fetchProducts();
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">CRUD de Produtos</h1>

      {/* Formulário */}
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
        <button type="submit" className="bg-blue-500 text-white px-4 py-2">Adicionar</button>
      </form>

      {/* Lista de Produtos */}
      <ul>
        {products.map((product) => (
          <li key={product.id} className="border-b p-2 flex justify-between items-center">
            <div>
              <strong>{product.nome}</strong> - ${product.preco.toFixed(2)} - {product.quantidade} unidades
            </div>
            <button
              onClick={() => handleDelete(product.id)}
              className="bg-red-500 text-white px-2 py-1"
            >
              Excluir
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
6. Executar o Projeto
Inicie o servidor:

bash
Copiar
Editar
npm run dev
Acesse o projeto em http://localhost:3000.