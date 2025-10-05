// src/hooks/useAPIService.ts

import { useState, useCallback } from 'react';
import { ErpData, InventoryItem, FinancialTransaction } from '../types';

const MOCK_INVENTORY: InventoryItem[] = [
  { id: 'inv1', name: 'Teclado Mecânico X-Pro', stock: 45, price: 350.00, createdAt: new Date(Date.now() - 86400000) },
  { id: 'inv2', name: 'Monitor Ultra HD 27"', stock: 12, price: 1899.99, createdAt: new Date(Date.now() - 172800000) },
];

const MOCK_FINANCIAL: FinancialTransaction[] = [
  { id: 'fin1', description: 'Venda de Monitores (3 und)', amount: 5699.97, type: 'Receita', createdAt: new Date(Date.now() - 3600000) },
  { id: 'fin2', description: 'Pagamento Aluguel Escritório', amount: 3500.00, type: 'Despesa', createdAt: new Date(Date.now() - 7200000) },
  { id: 'fin3', description: 'Serviços de Marketing Digital', amount: 1200.00, type: 'Despesa', createdAt: new Date(Date.now() - 10800000) },
  { id: 'fin4', description: 'Venda Teclados (10 und)', amount: 3500.00, type: 'Receita', createdAt: new Date(Date.now() - 14400000) },
];

export const useAPIService = () => {
  const [mockData, setMockData] = useState<ErpData>({
    inventory: MOCK_INVENTORY,
    financial: MOCK_FINANCIAL,
  });

  const simulateDelay = () => new Promise(resolve => setTimeout(resolve, 500));
  const generateId = () => Math.random().toString(36).substring(2, 9);

  const fetchData = useCallback(async (): Promise<ErpData> => {
    await simulateDelay();
    // Retorna uma cópia para simular a imutabilidade dos dados da API
    return {
      inventory: [...mockData.inventory],
      financial: [...mockData.financial],
    };
  }, [mockData]);

  const addItem = useCallback(async (collectionName: keyof ErpData, data: Omit<any, 'id' | 'createdAt'>) => {
    await simulateDelay();
    const newItem = { ...data, id: generateId(), createdAt: new Date() };

    setMockData(prev => ({
      ...prev,
      [collectionName]: [...prev[collectionName], newItem],
    }));
    return true;
  }, []);

  const deleteItem = useCallback(async (collectionName: keyof ErpData, id: string) => {
    await simulateDelay();
    setMockData(prev => ({
      ...prev,
      [collectionName]: prev[collectionName].filter((item: any) => item.id !== id),
    }));
  }, []);

  return { fetchData, addItem, deleteItem };
};