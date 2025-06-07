'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

interface User {
  id: string;
  nome: string;
  email: string;
}

const mockLoggedUser = {
  nome: 'João Silva',
  email: 'joao.silva@email.com',
};

export default function Dashboard() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [loggedUser, setLoggedUser] = useState<{ nome: string; email: string } | null>(null);

  const router = useRouter();

 useEffect(() => {
  async function fetchUsers() {
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/users');
      if (!res.ok) throw new Error('Falha ao buscar usuários');
      const data = await res.json();
      setUsers(data.users || []);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Erro desconhecido');
      }
    } finally {
      setLoading(false);
    }
  }

    fetchUsers();
    setLoggedUser(mockLoggedUser);
    // [] para rodar só uma vez
  }, []);

  function handleLogout() {
    localStorage.removeItem('token'); // limpar o token
    router.push('/login'); // redirecionar para login
  }

  return (
    <div className="max-w-5xl mx-auto p-6">
      {loggedUser && (
        <header className="mb-10 bg-white p-6 rounded shadow flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="w-14 h-14 rounded-full bg-blue-600 text-white flex items-center justify-center text-xl font-bold select-none">
              {loggedUser.nome
                .split(' ')
                .map((n) => n[0])
                .join('')
                .toUpperCase()}
            </div>
            <div>
              <p className="text-lg font-semibold">{loggedUser.nome}</p>
              <p className="text-gray-600 text-sm">{loggedUser.email}</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="bg-red-600 hover:bg-red-700 text-white font-semibold px-4 py-2 rounded transition"
          >
            Sair
          </button>
        </header>
      )}

      <h1 className="text-3xl font-bold mb-6">Dashboard</h1>

      <div className="mb-8">
        <h2 className="text-xl font-semibold">Quantidade de usuários cadastrados:</h2>
        <p className="text-2xl font-bold">{users.length}</p>
      </div>

      {loading && <p>Carregando usuários...</p>}
      {error && <p className="text-red-600">{error}</p>}

      {!loading && !error && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {users.map((user) => (
            <div key={user.id} className="flex items-center bg-white shadow rounded p-4 space-x-4">
              <Image src="/default-avatar.png" alt="Avatar" width={70} height={70} />
              <div>
                <p className="font-semibold text-black">{user.nome}</p>
                <p className="text-gray-600 text-sm">{user.email}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
