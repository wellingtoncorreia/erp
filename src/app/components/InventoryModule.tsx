// src/components/InventoryModule.tsx
import React, { useState, useMemo } from 'react';
import { Plus, Trash2, Loader } from 'lucide-react';
import { ErpData, InventoryItem } from '../types';
import { formatCurrency } from '../lib/formatters';

// Tipos para as props do componente
interface InventoryModuleProps {
  erpData: ErpData;
  handleAddItem: (collection: 'inventory', data: any) => Promise<void>;
  handleDeleteItem: (collection: 'inventory', id: string) => Promise<void>;
}

// Componente da linha da tabela, memoizado para performance
const ProductRow = React.memo(({ p, handleDeleteItem }: { p: InventoryItem; handleDeleteItem: (collection: 'inventory', id: string) => Promise<void>; }) => {
  const [isDeleting, setIsDeleting] = useState(false);
  const onDelete = async () => {
    setIsDeleting(true);
    await handleDeleteItem('inventory', p.id);
  };
  const stockColor = p.stock < 20 ? 'text-red-600 font-semibold' : 'text-gray-700';

  return (
    <tr className="hover:bg-gray-50 transition duration-100">
      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{p.name}</td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-right font-medium">
        <span className={stockColor}>{p.stock}</span>
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-900">{formatCurrency(p.price)}</td>
      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
        <button
          onClick={onDelete}
          disabled={isDeleting}
          className={`p-1 rounded-full transition ${isDeleting ? 'text-gray-400 cursor-not-allowed' : 'text-red-600 hover:text-red-900 hover:bg-red-50'}`}
          title="Deletar Produto"
        >
          {isDeleting ? <Loader className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
        </button>
      </td>
    </tr>
  );
});
ProductRow.displayName = 'ProductRow';

// Componente principal do módulo
export const InventoryModule = ({ erpData, handleAddItem, handleDeleteItem }: InventoryModuleProps) => {
  const [name, setName] = useState('');
  const [stock, setStock] = useState('');
  const [price, setPrice] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !stock || !price) return;
    setIsSubmitting(true);
    await handleAddItem('inventory', {
      name,
      stock: parseInt(stock),
      price: parseFloat(price),
    });
    setName('');
    setStock('');
    setPrice('');
    setIsSubmitting(false);
  };

  const sortedProducts = useMemo(() => [...erpData.inventory].sort((a, b) => a.name.localeCompare(b.name)), [erpData.inventory]);

  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold text-gray-800">Módulo de Estoque</h2>
      {/* Formulário de Novo Produto */}
      <div className="bg-white p-6 rounded-xl shadow-lg">
        <h3 className="text-xl font-semibold mb-4 text-indigo-600">Novo Produto</h3>
        <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 items-end">
            <div className="lg:col-span-2">
                <label className="block text-sm font-medium text-gray-700">Nome do Produto</label>
                <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Ex: Notebook Pro" className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-2 border" required />
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-700">Estoque (unidades)</label>
                <input type="number" min="0" value={stock} onChange={(e) => setStock(e.target.value)} placeholder="0" className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-2 border" required />
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-700">Preço Venda (R$)</label>
                <input type="number" step="0.01" value={price} onChange={(e) => setPrice(e.target.value)} placeholder="0.00" className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-2 border" required />
            </div>
            <button type="submit" disabled={isSubmitting} className={`w-full inline-flex justify-center rounded-lg border border-transparent py-2 px-4 text-sm font-medium text-white shadow-sm transition duration-150 ease-in-out ${isSubmitting ? 'bg-indigo-400 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2'}`}>
                {isSubmitting ? <Loader className="w-5 h-5 animate-spin" /> : <><Plus className="w-5 h-5 mr-2" /> Adicionar</>}
            </button>
        </form>
      </div>
      {/* Lista de Produtos */}
      <div className="bg-white p-6 rounded-xl shadow-lg overflow-x-auto">
        <h3 className="text-xl font-semibold mb-4 text-gray-700">Produtos Cadastrados ({erpData.inventory.length})</h3>
        <div className="min-w-full">
            <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                    <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Produto</th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Estoque</th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Preço</th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Ações</th>
                    </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                    {sortedProducts.map(p => <ProductRow key={p.id} p={p} handleDeleteItem={handleDeleteItem} />)}
                    {erpData.inventory.length === 0 && (
                        <tr><td colSpan={4} className="px-6 py-4 text-center text-gray-500 italic">Nenhum produto cadastrado.</td></tr>
                    )}
                </tbody>
            </table>
        </div>
      </div>
    </div>
  );
};