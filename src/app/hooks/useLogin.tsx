'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Swal from 'sweetalert2';
import axios from 'axios'; // Importe o axios para checar o tipo do erro
import api from '../lib/api';

// Defina as credenciais do seu login mockado aqui
const MOCK_USER = {
  username: 'admin',
  password: 'admin',
  name: 'Usuário Mock'
};

export function useLogin() {
  const router = useRouter();
  const [form, setForm] = useState({ username: '', password: '' });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const { username, password } = form;

    try {
      // 1. Tenta fazer o login real primeiro
      const response = await api.post('/users/auth', { username, password });
      
      // Se der certo, segue o fluxo normal
      localStorage.setItem('logged', 'true');
      localStorage.setItem('userName', response.data.name);
      router.push('/dashboard');

    } catch (error) {
      // 2. Se a chamada falhar, entramos no bloco catch
      
      // Verificamos se é um erro do Axios e se NÃO houve resposta do servidor (backend offline)
      if (axios.isAxiosError(error) && !error.response) {
        console.warn('BACKEND NÃO ENCONTRADO. Usando login mockado para desenvolvimento.');

        // 3. Se o backend estiver offline, tentamos o login mockado
        if (username === MOCK_USER.username && password === MOCK_USER.password) {
          
          Swal.fire({
            title: 'Sucesso (Mock)',
            text: 'Login realizado com dados de simulação.',
            icon: 'info',
            timer: 2000,
            showConfirmButton: false
          });

          localStorage.setItem('logged', 'true');
          localStorage.setItem('userName', MOCK_USER.name);
          router.push('/dashboard');
        
        } else {
          // Se as credenciais do mock estiverem erradas
          Swal.fire('Erro (Mock)', 'Usuário ou senha de simulação incorretos!', 'error');
        }

      } else {
        // 4. Se o backend respondeu (mas com erro), é um erro de credenciais inválidas
        Swal.fire('Erro', 'Usuário ou senha incorretos!', 'error');
      }
    }
  };

  return { form, handleChange, handleLogin };
}