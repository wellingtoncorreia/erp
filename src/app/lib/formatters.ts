// src/lib/formatters.ts

export const formatDate = (timestamp: Date): string => {
  if (!timestamp) return 'N/A';
  const date = timestamp instanceof Date ? timestamp : new Date(timestamp);
  return date.toLocaleDateString('pt-BR', { year: 'numeric', month: '2-digit', day: '2-digit' });
};

export const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value);
};