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
  const { fetchData, addItem, deleteItem } = useAPIService();
  const router = useRouter();
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

  const performLogout = useCallback(() => {
    Cookies.remove('logged');
    localStorage.removeItem('userName');
    router.push('/');
  }, [router]);

  const showInactivityModal = useCallback(() => {
    // CORREÇÃO APLICADA AQUI
    let timerInterval: NodeJS.Timeout | undefined;

    Swal.fire({
      title: 'Você ainda está aí?',
      html: 'Sua sessão será encerrada por inatividade em <b></b> segundos.',
      timer: 30000,
      timerProgressBar: true,
      showCancelButton: true,
      confirmButtonText: 'Continuar Logado',
      cancelButtonText: 'Sair Agora',
      cancelButtonColor: '#d33',
      didOpen: () => {
        const timerElement = Swal.getHtmlContainer()?.querySelector('b');
        if (timerElement) {
          timerInterval = setInterval(() => {
            const timeLeft = Swal.getTimerLeft();
            if (timeLeft !== undefined) {
              timerElement.textContent = Math.ceil(timeLeft / 1000).toString();
            }
          }, 1000);
        }
      },
      willClose: () => {
        // Verificamos se 'timerInterval' tem um valor antes de limpá-lo
        if (timerInterval) {
          clearInterval(timerInterval);
        }
      }
    }).then((result) => {
      if (result.dismiss === Swal.DismissReason.timer || result.dismiss === Swal.DismissReason.cancel) {
        performLogout();
      }
    });
  }, [performLogout]);

  // Usando um tempo de 30 segundos para teste
  useInactivityTimer({ onIdle: showInactivityModal, timeout: 30000 });

  const financialSummary = useMemo(() => {
    const revenues = erpData.financial.filter(t => t.type === 'Receita').reduce((sum, t) => sum + (t.amount || 0), 0);
    const expenses = erpData.financial.filter(t => t.type === 'Despesa').reduce((sum, t) => sum + (t.amount || 0), 0);
    return { revenues, expenses, netBalance: revenues - expenses };
  }, [erpData.financial]);
  
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