// src/components/Sidebar.tsx
'use client';

import { Shield, LayoutDashboard, DollarSign, Package, LogOut, User } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Cookies from 'js-cookie';
import Swal from 'sweetalert2'; // Importe a biblioteca de alertas

interface SidebarProps {
  activeModule: string;
  setActiveModule: (module: string) => void;
}

const navItems = [
  { icon: LayoutDashboard, name: 'Dashboard', key: 'dashboard' },
  { icon: DollarSign, name: 'Financeiro', key: 'financial' },
  { icon: Package, name: 'Estoque', key: 'inventory' }
];

export const Sidebar = ({ activeModule, setActiveModule }: SidebarProps) => {
  const router = useRouter();
  const [userName, setUserName] = useState('');

  useEffect(() => {
    const name = localStorage.getItem('userName');
    if (name) {
      setUserName(name);
    }
  }, []);

  // Separe a lógica de logout real em uma função própria
  const performLogout = () => {
    localStorage.removeItem('logged');
    localStorage.removeItem('userName');
    router.push('/');
  };

  // Esta função agora INICIA o processo de logout com o timer
  const handleLogout = () => {
    let timerInterval: NodeJS.Timeout;

    Swal.fire({
      title: 'Saindo do sistema...',
      html: 'Você será desconectado em <b></b> segundos.',
      timer: 30000, // 30 segundos em milissegundos
      timerProgressBar: true,
      showCancelButton: true,
      confirmButtonText: 'Sair Agora',
      cancelButtonText: 'Cancelar',
      didOpen: () => {
        const timerElement = Swal.getHtmlContainer()?.querySelector('b');
        if (timerElement) {
          // Atualiza o contador a cada segundo
          timerInterval = setInterval(() => {
            const timeLeft = Swal.getTimerLeft();
            if (timeLeft !== undefined) {
              timerElement.textContent = Math.ceil(timeLeft / 1000).toString();
            }
          }, 1000);
        }
      },
      willClose: () => {
        clearInterval(timerInterval); // Limpa o intervalo quando o modal fecha
      }
    }).then((result) => {
      // Se o timer acabar, o `dismiss` será 'timer'
      if (result.dismiss === Swal.DismissReason.timer) {
        console.log('Fui desconectado pelo timer');
        performLogout();
      }
      // Se o usuário clicar em "Sair Agora"
      if (result.isConfirmed) {
        performLogout();
      }
    });
  };

  return (
    <div className="flex flex-col w-20 md:w-64 bg-indigo-800 text-white shadow-xl transition-all duration-300 flex-shrink-0">
      {/* O resto do seu componente JSX continua o mesmo... */}
      <div className="flex items-center justify-center h-20 border-b border-indigo-700">
        <Shield className="w-8 h-8 md:mr-2" />
        <span className="hidden md:block text-xl font-extrabold tracking-wider">ERP Sim.</span>
      </div>
      <nav className="flex-1 px-2 py-4 space-y-2 flex flex-col">
        {navItems.map(({ icon: Icon, name, key }) => (
          <button
            key={key}
            onClick={() => setActiveModule(key)}
            className={`flex items-center w-full px-4 py-3 rounded-xl transition-colors duration-200 ${
              activeModule === key ? 'bg-indigo-700 shadow-lg' : 'hover:bg-indigo-700'
            }`}
          >
            <Icon className="w-6 h-6" />
            <span className="hidden md:block ml-3 text-sm font-medium">{name}</span>
          </button>
        ))}
        <button
          onClick={handleLogout}
          className="flex items-center w-full mt-auto px-4 py-3 rounded-xl text-red-300 hover:bg-red-900/50 hover:text-white transition-colors duration-200"
        >
          <LogOut className="w-6 h-6" />
          <span className="hidden md:block ml-3 text-sm font-medium">Sair</span>
        </button>
      </nav>
      <div className="p-4 border-t border-indigo-700">
        <div className='flex items-center justify-center md:justify-start'>
          <User className="w-5 h-5 md:mr-2 flex-shrink-0" />
          <div className="hidden md:block overflow-hidden">
            <p className="text-xs text-indigo-300">Usuário Logado:</p>
            <p className="text-sm font-bold text-white truncate" title={userName}>
              {userName || 'Carregando...'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};