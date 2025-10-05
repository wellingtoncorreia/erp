// src/app/dashboard/page.tsx
'use client';

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useAPIService } from '../hooks/useAPIService';
import { ErpData } from '../types';

// Importando todos os componentes da aplicação
import { Sidebar } from '../components/Sidebar';
import { Dashboard } from '../components/Dashboard';
import { FinancialModule } from '../components/FinancialModule';
import { InventoryModule } from '../components/InventoryModule';
import { LoadingScreen } from '../components/common/LoadingScreen';
import { ErrorScreen } from '../components/common/ErrorScreen';
export default function DashboardPage() {
  const { fetchData, addItem, deleteItem } = useAPIService();
  const [erpData, setErpData] = useState<ErpData>({ inventory: [], financial: [] });
  const [activeModule, setActiveModule] = useState('dashboard');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadInitialData = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await fetchData();
      setErpData(data);
    } catch (err) {
      console.error("Erro ao carregar dados simulados:", err);
      setError("Falha ao carregar dados da API simulada.");
    } finally {
      setIsLoading(false);
    }
  }, [fetchData]);

  useEffect(() => {
    loadInitialData();
  }, [loadInitialData]);

  const handleAddItem = async (collectionName: keyof ErpData, data: any) => {
    await addItem(collectionName, data);
    await loadInitialData(); // Recarrega os dados para refletir a mudança
  };

  const handleDeleteItem = async (collectionName: keyof ErpData, id: string) => {
    await deleteItem(collectionName, id);
    await loadInitialData(); // Recarrega os dados para refletir a mudança
  };

  const financialSummary = useMemo(() => {
    const revenues = erpData.financial
      .filter(t => t.type === 'Receita')
      .reduce((sum, t) => sum + (t.amount || 0), 0);
    const expenses = erpData.financial
      .filter(t => t.type === 'Despesa')
      .reduce((sum, t) => sum + (t.amount || 0), 0);
    return { revenues, expenses, netBalance: revenues - expenses };
  }, [erpData.financial]);

  const renderModule = () => {
    switch (activeModule) {
      case 'financial':
        return <FinancialModule erpData={erpData} financialSummary={financialSummary} handleAddItem={handleAddItem} handleDeleteItem={handleDeleteItem} />;
      case 'inventory':
        return <InventoryModule erpData={erpData} handleAddItem={handleAddItem} handleDeleteItem={handleDeleteItem} />;
      default:
        return <Dashboard erpData={erpData} financialSummary={financialSummary} />;
    }
  };

  if (isLoading) return <LoadingScreen />;
  if (error) return <ErrorScreen error={error} />;

  return (
    <div className="flex h-screen bg-gray-100 font-inter">
      <Sidebar activeModule={activeModule} setActiveModule={setActiveModule} />
      <main className="flex-1 overflow-y-auto p-4 md:p-10">
        <div className="max-w-7xl mx-auto">{renderModule()}</div>
      </main>
    </div>
  );
}