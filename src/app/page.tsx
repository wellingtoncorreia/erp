import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gray-100 p-8 text-center font-inter">
      <div className="bg-white p-10 rounded-2xl shadow-xl max-w-lg">
        <h1 className="text-4xl font-extrabold text-indigo-800 mb-4">
          Bem-vindo ao ERP Sim.
        </h1>
        <p className="text-lg text-gray-600 mb-8">
          Sua solução simplificada para gerenciamento de estoque e finanças.
        </p>
        <Link 
          href="/dashboard" 
          className="inline-flex items-center justify-center rounded-lg bg-indigo-600 px-8 py-3 text-base font-medium text-white shadow-sm transition-transform transform hover:scale-105 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
        >
          Acessar o Dashboard
          <ArrowRight className="ml-2 h-5 w-5" />
        </Link>
      </div>
      <footer className="mt-10 text-gray-500 text-sm">
        <p>Desenvolvido como um projeto de simulação de ERP.</p>
      </footer>
    </main>
  );
}