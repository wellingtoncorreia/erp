// src/types/index.ts

export interface InventoryItem {
  id: string;
  name: string;
  stock: number;
  price: number;
  createdAt: Date;
}

export interface FinancialTransaction {
  id: string;
  description: string;
  amount: number;
  type: 'Receita' | 'Despesa';
  createdAt: Date;
}

export interface ErpData {
  inventory: InventoryItem[];
  financial: FinancialTransaction[];
}