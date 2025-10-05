// src/components/common/LoadingScreen.tsx
import { Loader } from 'lucide-react';

export const LoadingScreen = () => (
  <div className="min-h-screen flex items-center justify-center bg-gray-100">
    <div className="flex flex-col items-center p-8 rounded-xl shadow-xl bg-white">
      <Loader className="w-8 h-8 animate-spin text-indigo-600" />
      <p className="mt-4 text-gray-600">Carregando dados (Simulação)...</p>
    </div>
  </div>
);