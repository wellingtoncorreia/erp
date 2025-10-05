'use client';

import React from 'react';
import { useRegistro } from '../hooks/useRegistro'; // Importe seu hook
import { LoadingScreen } from '../components/common/LoadingScreen'; // Componente de loading
import { BackendOfflineWarning } from '../components/common/BackendOfflineWarning'; // Novo componente de aviso

export default function RegisterPage() {
  // O hook agora nos dá o status do backend
  const { form, handleChange, handleRegister, backendStatus } = useRegistro();

  // 1. Enquanto verifica o status, mostre uma tela de loading
  if (backendStatus === 'checking') {
    return <LoadingScreen />;
  }

  // 2. Se o backend estiver offline, mostre o aviso
  if (backendStatus === 'offline') {
    return <BackendOfflineWarning />;
  }

  // 3. Se o backend estiver online, mostre o formulário de registro
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md">
        <h1 className="text-2xl font-bold text-center">Criar Nova Conta</h1>
        <form onSubmit={handleRegister} className="space-y-4">
          <div>
            <label className="block text-sm font-medium">Nome Completo</label>
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 mt-1 border rounded-md"
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Usuário</label>
            <input
              type="text"
              name="username"
              value={form.username}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 mt-1 border rounded-md"
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Senha</label>
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 mt-1 border rounded-md"
            />
          </div>
          <button
            type="submit"
            className="w-full py-2 px-4 font-semibold text-white bg-indigo-600 rounded-md hover:bg-indigo-700"
          >
            Cadastrar
          </button>
        </form>
      </div>
    </div>
  );
}