// src/hooks/useInactivityTimer.ts
'use client';

import { useEffect, useRef } from 'react';

// Os eventos que consideramos como "atividade do usuário"
const USER_ACTIVITY_EVENTS = [
  'mousemove', 'mousedown', 'keydown', 'touchstart', 'scroll'
];

interface InactivityTimerProps {
  onIdle: () => void; // Função a ser chamada quando o usuário ficar inativo
  timeout: number;   // Tempo em milissegundos para considerar o usuário inativo
}

export const useInactivityTimer = ({ onIdle, timeout }: InactivityTimerProps) => {
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Função para resetar o timer de inatividade
  const resetTimer = () => {
    // Limpa o timer anterior
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }
    // Inicia um novo timer
    timerRef.current = setTimeout(onIdle, timeout);
  };

  useEffect(() => {
    // Adiciona os event listeners para todos os eventos de atividade
    USER_ACTIVITY_EVENTS.forEach(event => {
      window.addEventListener(event, resetTimer);
    });

    // Inicia o timer pela primeira vez
    resetTimer();

    // Função de limpeza: remove os event listeners quando o componente desmontar
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
      USER_ACTIVITY_EVENTS.forEach(event => {
        window.removeEventListener(event, resetTimer);
      });
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [onIdle, timeout]); // Roda novamente se as props mudarem

  return null; // Este hook não renderiza nada
};