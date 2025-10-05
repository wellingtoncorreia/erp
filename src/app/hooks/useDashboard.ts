// src/hooks/useDashboard.ts
'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import Swal from 'sweetalert2';
import Cookies from 'js-cookie';

import { useAPIService } from './useAPIService';
import { useInactivityTimer } from './useInactivityTimer';
import { ErpData } from '../types';

export const useDashboard = () => {
  // --- Hooks de Lógica e Estado ---
  const { fetchData, addItem, deleteItem } = useAPIService();
  const router = useRouter();
  const [erpData, setErpData] = useState<ErpData>({ inventory: [], financial: [] });
  const [activeModule, setActiveModule] = useState('dashboard');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // --- Lógica de Dados (CRUD) ---
  const loadInitialData = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await fetchData();
      setErpData(data);
    } catch (err) {
      console.error("Erro ao carregar dados:", err);
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
    await loadInitialData();
  };

  const handleDeleteItem = async (collectionName: keyof ErpData, id: string) => {
    await deleteItem(collectionName, id);
    await loadInitialData();
  };

  // --- Lógica de Sessão e Inatividade ---
  const performLogout = useCallback(() => {
    localStorage.removeItem('logged'); // Assumindo que a autenticação usa cookies
    localStorage.removeItem('userName');
    router.push('/');
  }, [router]);

  const showInactivityModal = useCallback(() => {
    let timerInterval: NodeJS.Timeout;
    Swal.fire({
      title: 'Você ainda está aí?',
      html: 'Sua sessão será encerrada por inatividade em <b></b> segundos.',
      timer: 30000,
      timerProgressBar: true,
      showCancelButton: true,
      confirmButtonText: 'Continuar Logado',
      cancelButtonText: 'Sair Agora',
      cancelButtonColor: '#d33',
      didOpen: () => { /* ... (código do timer do SweetAlert) */ },
      willClose: () => clearInterval(timerInterval)
    }).then((result) => {
      if (result.dismiss === Swal.DismissReason.timer || result.dismiss === Swal.DismissReason.cancel) {
        performLogout();
      }
    });
  }, [performLogout]);

  // Ativa o timer de inatividade (15 minutos)
  useInactivityTimer({ onIdle: showInactivityModal, timeout: 30000 });

  // --- Cálculos Derivados ---
  const financialSummary = useMemo(() => {
    const revenues = erpData.financial.filter(t => t.type === 'Receita').reduce((sum, t) => sum + (t.amount || 0), 0);
    const expenses = erpData.financial.filter(t => t.type === 'Despesa').reduce((sum, t) => sum + (t.amount || 0), 0);
    return { revenues, expenses, netBalance: revenues - expenses };
  }, [erpData.financial]);
  
  // --- Retorno do Hook ---
  return {
    isLoading,
    error,
    erpData,
    activeModule,
    setActiveModule,
    financialSummary,
    handleAddItem,
    handleDeleteItem,
  };
};