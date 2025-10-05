'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Swal from 'sweetalert2';
import axios from 'axios';
import api from '../lib/api'; // Usando alias para o caminho

// Tipo para controlar o estado do backend
type BackendStatus = 'checking' | 'online' | 'offline';

export function useRegistro() {
  const router = useRouter();
  const [form, setForm] = useState({ name: '', username: '', password: '' });
  const [backendStatus, setBackendStatus] = useState<BackendStatus>('checking');

  // Efeito que roda uma vez para verificar se a API está online
  useEffect(() => {
    const checkBackendStatus = async () => {
      try {
        // Tenta fazer uma requisição para a rota de health check
        await api.get('/health');
        setBackendStatus('online');
      } catch (error) {
        if (axios.isAxiosError(error) && !error.response) {
          // Se não houver resposta, o backend está offline
          setBackendStatus('offline');
        } else {
          // Outro tipo de erro, mas ainda consideramos offline para esta página
          setBackendStatus('offline');
        }
      }
    };

    checkBackendStatus();
  }, []); // O array vazio [] garante que isso rode apenas uma vez

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    const { name, username, password } = form;

    try {
      await api.post('/users/register', { name, username, password });
      await Swal.fire('Sucesso', 'Usuário cadastrado com sucesso!', 'success');
      router.push('/');
    } catch (error) {
      Swal.fire('Erro', 'Não foi possível cadastrar o usuário.', 'error');
    }
  };

  return { form, handleChange, handleRegister, backendStatus };
}