'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const router = useRouter();

  // Estados para login
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Modal de cadastro
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [registerForm, setRegisterForm] = useState({
    nome: '',
    telefone: '',
    email: '',
    senha: '',
    confirmaSenha: '',
  });
  const [registerError, setRegisterError] = useState('');
  const [registerLoading, setRegisterLoading] = useState(false);

  // Login
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'login', email, password }),
      });

      const data = await res.json();

      if (!data.success) {
        setError(data.message || 'Erro no login');
      } else {
        alert('Login realizado com sucesso!');
        router.push('/dashboard'); // redireciona para dashboard
      }
    } catch {
      setError('Erro inesperado no login');
    } finally {
      setLoading(false);
    }
  };

  // Cadastro
  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setRegisterError('');

    if (registerForm.senha !== registerForm.confirmaSenha) {
      setRegisterError('As senhas não conferem.');
      return;
    }

    setRegisterLoading(true);

    try {
      const res = await fetch('/api/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'register',
          nome: registerForm.nome,
          telefone: registerForm.telefone,
          email: registerForm.email,
          password: registerForm.senha,
        }),
      });

      const data = await res.json();

      if (!data.success) {
        setRegisterError(data.message || 'Erro no cadastro');
      } else {
        alert('Cadastro realizado com sucesso! Verifique seu email para ativar a conta.');
        setShowRegisterModal(false);
        setRegisterForm({
          nome: '',
          telefone: '',
          email: '',
          senha: '',
          confirmaSenha: '',
        });
        router.push('/dashboard'); // redireciona para dashboard após cadastro
      }
    } catch {
      setRegisterError('Erro inesperado no cadastro');
    } finally {
      setRegisterLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gray-100 text-black">
      {/* Login */}
      <form onSubmit={handleLogin} className="bg-white p-8 rounded shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center">Login</h2>

        {error && <p className="text-red-600 mb-4 text-center font-semibold">{error}</p>}

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="w-full p-3 mb-4 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <input
          type="password"
          placeholder="Senha"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="w-full p-3 mb-6 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white p-3 rounded hover:bg-blue-700 transition"
        >
          {loading ? 'Entrando...' : 'Entrar'}
        </button>

        <p className="mt-6 text-center text-gray-600">
          Não tem uma conta?{' '}
          <button
            type="button"
            onClick={() => setShowRegisterModal(true)}
            className="text-blue-600 underline hover:text-blue-800"
          >
            Cadastre-se
          </button>
        </p>
      </form>

      {/* Modal de cadastro */}
      {showRegisterModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded p-8 max-w-md w-full relative shadow-lg">
            <button
              onClick={() => setShowRegisterModal(false)}
              className="absolute top-3 right-3 text-gray-600 hover:text-gray-900 text-xl font-bold"
              aria-label="Fechar modal"
            >
              &times;
            </button>

            <h2 className="text-2xl font-bold mb-6 text-center">Cadastro</h2>

            {registerError && (
              <p className="mb-4 text-red-600 font-semibold text-center">{registerError}</p>
            )}

            <form onSubmit={handleRegister}>
              <input
                type="text"
                placeholder="Nome"
                value={registerForm.nome}
                onChange={(e) => setRegisterForm({ ...registerForm, nome: e.target.value })}
                required
                className="w-full p-3 mb-4 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="tel"
                placeholder="Telefone"
                value={registerForm.telefone}
                onChange={(e) => setRegisterForm({ ...registerForm, telefone: e.target.value })}
                required
                className="w-full p-3 mb-4 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="email"
                placeholder="Email"
                value={registerForm.email}
                onChange={(e) => setRegisterForm({ ...registerForm, email: e.target.value })}
                required
                className="w-full p-3 mb-4 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="password"
                placeholder="Senha"
                value={registerForm.senha}
                onChange={(e) => setRegisterForm({ ...registerForm, senha: e.target.value })}
                required
                className="w-full p-3 mb-4 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="password"
                placeholder="Confirmar Senha"
                value={registerForm.confirmaSenha}
                onChange={(e) => setRegisterForm({ ...registerForm, confirmaSenha: e.target.value })}
                required
                className="w-full p-3 mb-6 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              />

              <button
                type="submit"
                disabled={registerLoading}
                className="w-full bg-green-600 text-white p-3 rounded hover:bg-green-700 transition"
              >
                {registerLoading ? 'Cadastrando...' : 'Cadastrar'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
