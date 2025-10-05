// src/components/Dashboard.tsx
import { DollarSign, ArrowUp, ArrowDown } from 'lucide-react';
import { ErpData } from '../types';
import { formatCurrency } from '../lib/formatters';

interface DashboardProps {
  erpData: ErpData;
  financialSummary: {
    revenues: number;
    expenses: number;
    netBalance: number;
  };
}

export const Dashboard = ({ erpData, financialSummary }: DashboardProps) => {
  const { revenues, expenses, netBalance } = financialSummary;
  const totalProducts = erpData.inventory.length;
  const totalStock = erpData.inventory.reduce((sum, p) => sum + (p.stock || 0), 0);

  const cardClass = "bg-white p-6 rounded-xl shadow-lg transition-transform transform hover:scale-[1.02]";
  const balanceColor = netBalance >= 0 ? 'text-emerald-500' : 'text-red-500';

  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold text-gray-800">Dashboard: Visão Geral</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Card Saldo Líquido */}
        <div className={`${cardClass} border-t-4 border-t-indigo-600`}>
          <div className="flex justify-between items-center">
            <p className="text-lg font-medium text-gray-500">Saldo Líquido</p>
            <DollarSign className="w-6 h-6 text-indigo-600" />
          </div>
          <p className={`text-4xl font-extrabold mt-1 ${balanceColor}`}>{formatCurrency(netBalance)}</p>
          <p className="text-sm text-gray-400 mt-2">Receitas - Despesas</p>
        </div>
        {/* Card Receitas */}
        <div className={`${cardClass} border-t-4 border-t-emerald-500`}>
             <div className="flex justify-between items-center">
                <p className="text-lg font-medium text-gray-500">Receitas Totais</p>
                <ArrowUp className="w-6 h-6 text-emerald-500" />
            </div>
            <p className="text-4xl font-extrabold mt-1 text-gray-800">{formatCurrency(revenues)}</p>
            <p className="text-sm text-gray-400 mt-2">Entradas financeiras</p>
        </div>
        {/* Card Despesas */}
        <div className={`${cardClass} border-t-4 border-t-red-500`}>
            <div className="flex justify-between items-center">
                <p className="text-lg font-medium text-gray-500">Despesas Totais</p>
                <ArrowDown className="w-6 h-6 text-red-500" />
            </div>
            <p className="text-4xl font-extrabold mt-1 text-gray-800">{formatCurrency(expenses)}</p>
            <p className="text-sm text-gray-400 mt-2">Saídas financeiras</p>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
        {/* Card Estatísticas de Estoque */}
        <div className={`${cardClass} border-l-4 border-l-gray-400`}>
            <h3 className="text-xl font-semibold mb-3 text-gray-700">Estatísticas de Estoque</h3>
            <p className="text-lg">
                <span className="font-bold text-indigo-600">{totalProducts}</span> Produtos Cadastrados
            </p>
            <p className="text-lg">
                <span className="font-bold text-indigo-600">{totalStock}</span> Unidades em Estoque
            </p>
        </div>
        {/* Card Últimas Transações */}
        <div className={`${cardClass} border-l-4 border-l-gray-400`}>
            <h3 className="text-xl font-semibold mb-3 text-gray-700">Últimas 5 Transações</h3>
            {erpData.financial.slice(0, 5).map(t => (
                <div key={t.id} className="flex justify-between border-b last:border-b-0 py-1.5 text-sm">
                    <span className="text-gray-600 truncate mr-2">{t.description}</span>
                    <span className={t.type === 'Receita' ? 'text-emerald-600 font-medium' : 'text-red-600 font-medium'}>
                        {formatCurrency(t.amount)}
                    </span>
                </div>
            ))}
            {erpData.financial.length === 0 && <p className="text-gray-500 italic">Nenhuma transação registrada.</p>}
        </div>
      </div>
    </div>
  );
};