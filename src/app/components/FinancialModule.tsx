// src/components/FinancialModule.tsx
import React, { useState, useMemo } from 'react';
import { Plus, Trash2, Loader } from 'lucide-react';
import { ErpData, FinancialTransaction } from '../types';
import { formatCurrency, formatDate } from '../lib/formatters';

interface FinancialModuleProps {
  erpData: ErpData;
  financialSummary: { netBalance: number };
  handleAddItem: (collection: 'financial', data: any) => Promise<void>;
  handleDeleteItem: (collection: 'financial', id: string) => Promise<void>;
}

const TransactionRow = React.memo(({ t, handleDeleteItem }: { t: FinancialTransaction; handleDeleteItem: (collection: 'financial', id: string) => Promise<void>; }) => {
  const [isDeleting, setIsDeleting] = useState(false);
  const onDelete = async () => {
    setIsDeleting(true);
    await handleDeleteItem('financial', t.id);
  };

  return (
    <tr className="hover:bg-gray-50 transition duration-100">
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{formatDate(t.createdAt)}</td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{t.description}</td>
      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${t.type === 'Receita' ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'}`}>{t.type}</span>
      </td>
      <td className={`px-6 py-4 whitespace-nowrap text-sm font-medium text-right ${t.type === 'Receita' ? 'text-emerald-600' : 'text-red-600'}`}>{formatCurrency(t.amount)}</td>
      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
        <button onClick={onDelete} disabled={isDeleting} className={`p-1 rounded-full transition ${isDeleting ? 'text-gray-400 cursor-not-allowed' : 'text-red-600 hover:text-red-900 hover:bg-red-50'}`} title="Deletar Transação">
          {isDeleting ? <Loader className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
        </button>
      </td>
    </tr>
  );
});
TransactionRow.displayName = 'TransactionRow';

export const FinancialModule = ({ erpData, financialSummary, handleAddItem, handleDeleteItem }: FinancialModuleProps) => {
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [type, setType] = useState<'Receita' | 'Despesa'>('Receita');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!description || !amount) return;
    setIsSubmitting(true);
    await handleAddItem('financial', { description, amount: parseFloat(amount), type });
    setDescription('');
    setAmount('');
    setIsSubmitting(false);
  };

  const sortedTransactions = useMemo(() => [...erpData.financial].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()), [erpData.financial]);

  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold text-gray-800">Módulo Financeiro</h2>
      {/* Formulário de Nova Transação */}
      <div className="bg-white p-6 rounded-xl shadow-lg">
        <h3 className="text-xl font-semibold mb-4 text-indigo-600">Nova Transação</h3>
        <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 items-end">
            <div className="lg:col-span-2">
                <label className="block text-sm font-medium text-gray-700">Descrição</label>
                <input type="text" value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Descrição da transação" className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-2 border" required />
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-700">Valor (R$)</label>
                <input type="number" step="0.01" value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="0.00" className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-2 border" required />
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-700">Tipo</label>
                <select value={type} onChange={(e) => setType(e.target.value as 'Receita' | 'Despesa')} className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-2 border bg-white">
                    <option value="Receita">Receita</option>
                    <option value="Despesa">Despesa</option>
                </select>
            </div>
            <button type="submit" disabled={isSubmitting} className={`w-full inline-flex justify-center rounded-lg border border-transparent py-2 px-4 text-sm font-medium text-white shadow-sm transition duration-150 ease-in-out ${isSubmitting ? 'bg-indigo-400 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2'}`}>
                 {isSubmitting ? <Loader className="w-5 h-5 animate-spin" /> : <><Plus className="w-5 h-5 mr-2" /> Adicionar</>}
            </button>
        </form>
      </div>
      {/* Lista de Transações */}
      <div className="bg-white p-6 rounded-xl shadow-lg overflow-x-auto">
        <h3 className="text-xl font-semibold mb-4 text-gray-700">Histórico de Transações (Saldo: {formatCurrency(financialSummary.netBalance)})</h3>
        <div className="min-w-full">
            <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                    <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Data</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Descrição</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tipo</th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Valor</th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Ações</th>
                    </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                    {sortedTransactions.map(t => <TransactionRow key={t.id} t={t} handleDeleteItem={handleDeleteItem} />)}
                    {erpData.financial.length === 0 && (
                        <tr><td colSpan={5} className="px-6 py-4 text-center text-gray-500 italic">Nenhuma transação registrada.</td></tr>
                    )}
                </tbody>
            </table>
        </div>
      </div>
    </div>
  );
};