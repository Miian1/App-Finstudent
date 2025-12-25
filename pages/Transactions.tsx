
import React, { useState } from 'react';
import { Transaction } from '../types';
import { getIcon, CurrencyOption } from '../constants';
import { Search, Filter, Trash2 } from 'lucide-react';

interface TransactionsProps {
  transactions: Transaction[];
  onDelete: (id: string) => void;
  currency: CurrencyOption;
}

const Transactions: React.FC<TransactionsProps> = ({ transactions, onDelete, currency }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'income' | 'expense'>('all');

  const filtered = transactions
    .filter(t => filterType === 'all' || t.type === filterType)
    .filter(t => t.note.toLowerCase().includes(searchTerm.toLowerCase()) || t.category.toLowerCase().includes(searchTerm.toLowerCase()));

  // Group by date (simplified to YYYY-MM-DD string)
  const grouped = filtered.reduce((groups: { [key: string]: Transaction[] }, t) => {
    const date = new Date(t.date).toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' });
    if (!groups[date]) groups[date] = [];
    groups[date].push(t);
    return groups;
  }, {});

  return (
    <div className="p-6">
      <header className="mb-8">
        <h2 className="text-2xl font-extrabold text-gray-900 dark:text-white mb-6">History</h2>
        
        <div className="flex gap-3 mb-6">
          <div className="flex-1 bg-white dark:bg-navy-800 rounded-card p-4 flex items-center gap-3 border border-gray-100 dark:border-navy-700 focus-within:ring-2 focus-within:ring-neonBlue/20 transition-all">
            <Search size={18} className="text-gray-400" />
            <input 
              type="text" 
              placeholder="Search history..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-transparent focus:outline-none text-sm font-bold text-gray-900 dark:text-white w-full placeholder:text-gray-300 dark:placeholder:text-gray-600"
            />
          </div>
          <button className="bg-white dark:bg-navy-800 p-4 rounded-card border border-gray-100 dark:border-navy-700 text-gray-400 transition-colors active:text-neonBlue">
            <Filter size={18} />
          </button>
        </div>

        <div className="flex gap-2 overflow-x-auto no-scrollbar">
          {['all', 'expense', 'income'].map((type) => (
            <button 
              key={type}
              onClick={() => setFilterType(type as any)}
              className={`px-6 py-2 rounded-full text-xs font-bold capitalize transition-all ${filterType === type ? 'bg-neonBlue text-white shadow-lg shadow-neonBlue/20' : 'bg-white dark:bg-navy-800 text-gray-400 dark:text-gray-500'}`}
            >
              {type}
            </button>
          ))}
        </div>
      </header>

      <div className="space-y-8">
        {Object.keys(grouped).length > 0 ? Object.keys(grouped).map((date) => (
          <div key={date}>
            <h3 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-4 ml-1">{date}</h3>
            <div className="space-y-3">
              {grouped[date].map((t) => (
                <div key={t.id} className="group p-4 rounded-card bg-white dark:bg-navy-800 shadow-sm border border-gray-100 dark:border-navy-700 flex items-center justify-between transition-all hover:border-red-500/30">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-gray-50 dark:bg-navy-900 flex items-center justify-center text-gray-500 dark:text-gray-400">
                      {getIcon(t.category)}
                    </div>
                    <div className="flex flex-col">
                      <span className="text-sm font-bold text-gray-900 dark:text-white">{t.note || t.category}</span>
                      <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">{t.category}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className={`text-sm font-bold ${t.type === 'income' ? 'text-emerald-500' : 'text-gray-900 dark:text-white'}`}>
                      {t.type === 'income' ? '+' : '-'}{currency.symbol}{t.amount.toLocaleString()}
                    </span>
                    <button 
                      onClick={() => onDelete(t.id)}
                      className="opacity-0 group-hover:opacity-100 transition-opacity text-red-400 p-2"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )) : (
          <div className="flex flex-col items-center justify-center py-20 opacity-30">
            <Search size={48} className="text-gray-400 mb-4" />
            <p className="text-sm font-bold text-gray-500">No transactions found</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Transactions;
