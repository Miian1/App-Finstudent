
export type TransactionType = 'income' | 'expense';

export interface Transaction {
  id: string;
  amount: number;
  type: TransactionType;
  category: string;
  note: string;
  date: string;
}

export interface Category {
  id: string;
  name: string;
  icon: string;
  color: string;
}

export interface Goal {
  id: string;
  name: string;
  targetAmount: number;
  currentAmount: number;
  deadline: string;
  color: string;
}

export type DebtType = 'borrowed' | 'lent';

export interface Debt {
  id: string;
  personName: string;
  amount: number;
  type: DebtType;
  date: string;
  isPaid: boolean;
}

export interface UserStats {
  balance: number;
  income: number;
  expense: number;
}
