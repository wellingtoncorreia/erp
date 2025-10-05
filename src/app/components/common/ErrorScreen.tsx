// src/components/common/ErrorScreen.tsx
import { AlertTriangle } from 'lucide-react';

interface ErrorScreenProps {
  error: string;
}

export const ErrorScreen = ({ error }: ErrorScreenProps) => (
  <div className="min-h-screen flex items-center justify-center bg-red-50">
    <div className="flex flex-col items-center p-8 rounded-xl shadow-xl bg-white border-t-4 border-red-500">
      <AlertTriangle className="w-8 h-8 text-red-500" />
      <p className="mt-4 text-red-600 font-medium">{error}</p>
      <p className="mt-2 text-sm text-gray-500">Ocorreu um erro na comunicação simulada. Tente recarregar a página.</p>
    </div>
  </div>
);