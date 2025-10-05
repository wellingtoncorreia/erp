'use client';

import Link from 'next/link';
import { useLogin } from './hooks/useLogin';

export default function Home() {
  const { form, handleChange, handleLogin } = useLogin();

  return (
    <main className="flex h-screen bg-[#e0f7fa]">
      {/* Lado Esquerdo com a Imagem de Fundo */}
      {/* A classe 'hidden sm:flex' esconde este lado em telas pequenas (mobile) */}
      <div className="hidden sm:flex flex-1 bg-[url('/erp.png')] bg-start bg-cover " />

      {/* Lado Direito com o Formulário */}
      <div className="flex-1 flex justify-center items-center bg-white">
        <div className="w-full sm:w-[50dvw] flex flex-col items-center p-4">
          
          <img
            src="logo.png"
            alt="Logo da empresa"
            width={200}
            height={100} // Ajuste a altura conforme necessário
            className="mb-4"
          />

          <h2 className="text-2xl font-bold mb-5">
            Sistema de Gerenciamento
          </h2>

          <form onSubmit={handleLogin} className="w-full max-w-sm flex flex-col">
            <label htmlFor="username" className="mb-1 font-bold">Usuário</label>
            <input
              id="username"
              type="text" // Alterado de 'email' para 'text' para corresponder ao seu hook
              name="username" // Essencial para o hook handleChange
              placeholder="Digite seu usuário"
              required
              value={form.username}
              onChange={handleChange}
              className="px-3 py-2 mb-4 border border-gray-300 rounded-md text-black focus:outline-none focus:ring-2 focus:ring-blue-400"
            />

            <label htmlFor="password" className="mb-1 font-bold">Senha</label>
            <input
              id="password"
              type="password"
              name="password" // Essencial para o hook handleChange
              placeholder="Digite sua senha"
              required
              value={form.password}
              onChange={handleChange}
              className="px-3 py-2 mb-4 border border-gray-300 rounded-md text-black focus:outline-none focus:ring-2 focus:ring-blue-400"
            />

            <button
              type="submit"
              className="p-3 bg-[#00aaff] text-white rounded-md cursor-pointer text-base font-semibold hover:bg-[#007bb5] transition-colors"
            >
              Entrar
            </button>
          </form>

          <div className="text-center mt-5">
            <Link href="/registro" className="text-blue-600 hover:underline">
              Não tem uma conta? Cadastre-se
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}