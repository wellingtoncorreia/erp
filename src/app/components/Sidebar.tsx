// src/components/Sidebar.tsx
import { Shield, LayoutDashboard, DollarSign, Package } from 'lucide-react';

interface SidebarProps {
  activeModule: string;
  setActiveModule: (module: string) => void;
}

const navItems = [
  { icon: LayoutDashboard, name: 'Dashboard', key: 'dashboard' },
  { icon: DollarSign, name: 'Financeiro', key: 'financial' },
  { icon: Package, name: 'Estoque', key: 'inventory' }
];

export const Sidebar = ({ activeModule, setActiveModule }: SidebarProps) => (
  <div className="flex flex-col w-20 md:w-64 bg-indigo-800 text-white shadow-xl transition-all duration-300 flex-shrink-0">
    <div className="flex items-center justify-center h-20 border-b border-indigo-700">
      <Shield className="w-8 h-8 md:mr-2" />
      <span className="hidden md:block text-xl font-extrabold tracking-wider">ERP Sim.</span>
    </div>
    <nav className="flex-1 px-2 py-4 space-y-2">
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
    </nav>
    <div className="p-4 border-t border-indigo-700">
      <p className="text-xs text-indigo-300 hidden md:block">Status:</p>
      <p className="text-sm font-mono text-center md:text-left break-all font-bold text-green-300" title="Modo Simulação">
        MOCK API
      </p>
    </div>
  </div>
);