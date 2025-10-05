// src/components/common/BackendOfflineWarning.tsx
'use client';

import Link from "next/link";
import { AlertTriangle } from "lucide-react";

export const BackendOfflineWarning = () => (
  <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-4">
    <div className="w-full max-w-md p-8 text-center bg-white rounded-lg shadow-md border-t-4 border-red-500">
      <AlertTriangle className="w-12 h-12 mx-auto text-red-500 mb-4" />
      <h1 className="text-2xl font-bold text-gray-800 mb-2">
        Erro de Conexão com a API
      </h1>
      <p className="text-gray-600 mb-6">
        Não foi possível encontrar o backend. Por favor, verifique se o servidor está rodando em{' '}
        <code className="bg-gray-200 text-red-700 px-1 rounded">localhost:8080</code>.
      </p>
      <div className="bg-gray-100 p-4 rounded-md text-left">
        <h2 className="font-semibold text-gray-700">Desenvolvimento Offline</h2>
        <p className="text-sm text-gray-500 mt-1">
          Para continuar testando, use as credenciais de simulação na tela de login:
        </p>
        <div className="mt-2">
          <p className="text-sm"><strong>Usuário:</strong> <code className="bg-gray-200 px-1 rounded">admin</code></p>
          <p className="text-sm"><strong>Senha:</strong> <code className="bg-gray-200 px-1 rounded">admin</code></p>
        </div>
      </div>
      <Link href="/" className="inline-block mt-6 bg-indigo-600 text-white font-bold py-2 px-4 rounded hover:bg-indigo-700 transition-colors">
        Ir para a Página de Login
      </Link>
    </div>
  </div>
);