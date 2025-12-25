
import React, { useState, useEffect } from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import Transactions from './pages/Transactions';
import AddTransaction from './pages/AddTransaction';
import Analytics from './pages/Analytics';
import Settings from './pages/Settings';
import Tools from './pages/Tools';
import Goals from './pages/Goals';
import Layout from './components/Layout';
import { Transaction, Category, Goal, Debt } from './types';
import { INITIAL_CATEGORIES, CURRENCY_OPTIONS } from './constants';
import { WifiOff, RefreshCw } from 'lucide-react';

const App: React.FC = () => {
  const [transactions, setTransactions] = useState<Transaction[]>(() => {
    const saved = localStorage.getItem('transactions');
    return saved ? JSON.parse(saved) : [];
  });

  const [categories, setCategories] = useState<Category[]>(() => {
    const saved = localStorage.getItem('categories');
    return saved ? JSON.parse(saved) : INITIAL_CATEGORIES;
  });

  const [goals, setGoals] = useState<Goal[]>(() => {
    const saved = localStorage.getItem('goals');
    return saved ? JSON.parse(saved) : [];
  });

  const [debts, setDebts] = useState<Debt[]>(() => {
    const saved = localStorage.getItem('debts');
    return saved ? JSON.parse(saved) : [];
  });

  const [isDarkMode, setIsDarkMode] = useState(() => {
    const saved = localStorage.getItem('darkMode');
    return saved ? JSON.parse(saved) : true;
  });

  const [currency, setCurrency] = useState(() => {
    const saved = localStorage.getItem('currency');
    return saved ? JSON.parse(saved) : CURRENCY_OPTIONS[0]; // Default to PKR
  });

  // Setup/Offline State
  const [isSetupRequired, setIsSetupRequired] = useState(false);

  useEffect(() => {
    const checkInitialization = () => {
      const hasInitialized = localStorage.getItem('app_initialized');
      const isOnline = navigator.onLine;
      // Tailwind check from index.html global flag
      const tailwindAvailable = (window as any).isTailwindLoaded || !!(window as any).tailwind;

      // If we don't have the CSS engine and we're offline, setup is required
      // even if localStorage thinks we're already initialized (covers cache clear case).
      if ((!hasInitialized || !tailwindAvailable) && !isOnline) {
        setIsSetupRequired(true);
      } else if (isOnline) {
        localStorage.setItem('app_initialized', 'true');
        setIsSetupRequired(false);
      }
    };

    checkInitialization();
    window.addEventListener('online', checkInitialization);
    return () => window.removeEventListener('online', checkInitialization);
  }, []);

  useEffect(() => {
    localStorage.setItem('transactions', JSON.stringify(transactions));
  }, [transactions]);

  useEffect(() => {
    localStorage.setItem('categories', JSON.stringify(categories));
  }, [categories]);

  useEffect(() => {
    localStorage.setItem('goals', JSON.stringify(goals));
  }, [goals]);

  useEffect(() => {
    localStorage.setItem('debts', JSON.stringify(debts));
  }, [debts]);

  useEffect(() => {
    localStorage.setItem('currency', JSON.stringify(currency));
  }, [currency]);

  useEffect(() => {
    localStorage.setItem('darkMode', JSON.stringify(isDarkMode));
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  const addTransaction = (t: Omit<Transaction, 'id'>) => {
    const newTransaction = { ...t, id: Math.random().toString(36).substr(2, 9) };
    setTransactions([newTransaction, ...transactions]);
  };

  const deleteTransaction = (id: string) => {
    setTransactions(transactions.filter(t => t.id !== id));
  };

  const addCategory = (name: string, icon: string, color: string) => {
    const newCat = { id: Math.random().toString(36).substr(2, 9), name, icon, color };
    setCategories([...categories, newCat]);
  };

  const addGoal = (goal: Omit<Goal, 'id'>) => {
    const newGoal = { ...goal, id: Math.random().toString(36).substr(2, 9) };
    setGoals([...goals, newGoal]);
  };

  const updateGoalProgress = (id: string, amount: number) => {
    setGoals(goals.map(g => g.id === id ? { ...g, currentAmount: g.currentAmount + amount } : g));
  };

  const addDebt = (debt: Omit<Debt, 'id'>) => {
    const newDebt = { ...debt, id: Math.random().toString(36).substr(2, 9) };
    setDebts([newDebt, ...debts]);
  };

  const deleteDebt = (id: string) => {
    setDebts(debts.filter(d => d.id !== id));
  };

  const toggleDebtStatus = (id: string) => {
    setDebts(debts.map(d => d.id === id ? { ...d, isPaid: !d.isPaid } : d));
  };

  const resetData = () => {
    setTransactions([]);
    setGoals([]);
    setDebts([]);
    setCategories(INITIAL_CATEGORIES);
    localStorage.removeItem('transactions');
    localStorage.removeItem('categories');
    localStorage.removeItem('goals');
    localStorage.removeItem('debts');
    window.location.reload();
  };

  if (isSetupRequired) {
    return (
      <div className="fixed inset-0 z-[999] bg-[#0F172A] flex items-center justify-center p-8 text-center overflow-hidden">
        <div className="max-w-xs animate-in fade-in zoom-in duration-700">
          <div className="w-20 h-20 bg-sky-500/20 text-sky-400 rounded-[24px] flex items-center justify-center mx-auto mb-8 shadow-2xl shadow-sky-500/20">
            <WifiOff size={40} />
          </div>
          <h1 className="text-2xl font-black text-white mb-4 tracking-tight">Offline Recovery</h1>
          <p className="text-slate-400 text-sm leading-relaxed mb-10 font-medium">
            Essential style files were cleared from your browser. Please <span className="text-sky-400 font-bold underline">connect briefly</span> to restore the app's interface.
          </p>
          <button 
            onClick={() => window.location.reload()}
            className="w-full h-14 bg-sky-500 text-white rounded-[20px] font-black uppercase tracking-widest text-xs flex items-center justify-center gap-3 shadow-xl shadow-sky-500/40 active:scale-95 transition-all"
          >
            <RefreshCw size={18} />
            Check Connection
          </button>
        </div>
      </div>
    );
  }

  return (
    <HashRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<Dashboard transactions={transactions} goals={goals} currency={currency} />} />
          <Route path="/transactions" element={<Transactions transactions={transactions} onDelete={deleteTransaction} currency={currency} />} />
          <Route path="/add" element={<AddTransaction onAdd={addTransaction} categories={categories} currency={currency} />} />
          <Route path="/goals" element={<Goals 
            goals={goals} 
            onAddGoal={addGoal} 
            onUpdateProgress={updateGoalProgress} 
            currency={currency} 
            debts={debts}
            onAddDebt={addDebt}
            onDeleteDebt={deleteDebt}
            onToggleDebt={toggleDebtStatus}
          />} />
          <Route path="/analytics" element={<Analytics transactions={transactions} currency={currency} />} />
          <Route path="/tools" element={<Tools categories={categories} onAddCategory={addCategory} transactions={transactions} currency={currency} />} />
          <Route path="/settings" element={<Settings isDarkMode={isDarkMode} setIsDarkMode={setIsDarkMode} onReset={resetData} currency={currency} setCurrency={setCurrency} />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </Layout>
    </HashRouter>
  );
};

export default App;