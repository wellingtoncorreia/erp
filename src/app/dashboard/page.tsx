// src/app/dashboard/page.tsx
'use client';

import React from 'react';
import { useDashboard } from '../hooks/useDashboard'; // Caminho corrigido com alias
import { withAuth } from '../components/withAuth';   // Caminho corrigido com alias

// Componentes visuais
import { Sidebar } from '../components/Sidebar';
import { FinancialModule } from '../components/FinancialModule';
import { InventoryModule } from '../components/InventoryModule';
import { LoadingScreen } from '../components/common/LoadingScreen';
import { ErrorScreen } from '../components/common/ErrorScreen';
import { Dashboard } from '../components/Dashboard';

function DashboardPage() {
  // Chama o hook para obter toda a lógica, estados e funções
  const {
    isLoading,
    error,
    erpData,
    activeModule,
    setActiveModule,
    financialSummary,
    handleAddItem,
    handleDeleteItem,
  } = useDashboard();

  // Lógica de renderização continua a mesma
  const renderModule = () => {
    switch (activeModule) {
      case 'financial':
        return <FinancialModule erpData={erpData} financialSummary={financialSummary} handleAddItem={handleAddItem} handleDeleteItem={handleDeleteItem} />;
      case 'inventory':
        return <InventoryModule erpData={erpData} handleAddItem={handleAddItem} handleDeleteItem={handleDeleteItem} />;
      default:
        // O componente Dashboard continua sendo usado para a parte visual
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

export default withAuth(DashboardPage);