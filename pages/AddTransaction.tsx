
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, Check, Calendar as CalendarIcon } from 'lucide-react';
import { TransactionType, Category } from '../types';
import { getIcon, CurrencyOption } from '../constants';

interface AddTransactionProps {
  onAdd: (t: any) => void;
  categories: Category[];
  currency: CurrencyOption;
}

const AddTransaction: React.FC<AddTransactionProps> = ({ onAdd, categories, currency }) => {
  const navigate = useNavigate();
  const [type, setType] = useState<TransactionType>('expense');
  const [amount, setAmount] = useState('0');
  const [category, setCategory] = useState(categories[0]?.name || 'Shopping');
  const [note, setNote] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);

  const handleSave = () => {
    const numAmount = parseFloat(amount);
    if (isNaN(numAmount) || numAmount <= 0) return;

    onAdd({
      type,
      amount: numAmount,
      category,
      note,
      date: new Date(date).toISOString(),
    });
    navigate('/');
  };

  const handleAmountChange = (val: string) => {
    if (/^\d*\.?\d{0,2}$/.test(val)) {
      setAmount(val);
    }
  };

  return (
    <div className="p-6 flex flex-col h-full animate-in fade-in slide-in-from-bottom-4 duration-500">
      <header className="flex items-center justify-between mb-8">
        <button onClick={() => navigate(-1)} className="text-gray-400 p-2 -ml-2">
          <ChevronLeft size={24} />
        </button>
        <h2 className="text-lg font-extrabold text-gray-900 dark:text-white font-display">New Transaction</h2>
        <div className="w-10" />
      </header>

      <div className="flex flex-col items-center justify-center mb-10">
        <div className="flex h-12 bg-gray-100 dark:bg-navy-800 rounded-full p-1 w-full max-w-[240px] mb-8 relative">
          <button 
            onClick={() => setType('expense')}
            className={`flex-1 flex items-center justify-center rounded-full text-xs font-bold transition-all z-10 ${type === 'expense' ? 'text-white' : 'text-gray-400'}`}
          >
            Expense
          </button>
          <button 
            onClick={() => setType('income')}
            className={`flex-1 flex items-center justify-center rounded-full text-xs font-bold transition-all z-10 ${type === 'income' ? 'text-white' : 'text-gray-400'}`}
          >
            Income
          </button>
          <div 
            className={`absolute top-1 bottom-1 w-[calc(50%-4px)] rounded-full transition-all duration-300 ${type === 'expense' ? 'bg-softOrange left-1 shadow-lg shadow-softOrange/30' : 'bg-neonBlue left-[calc(50%+1px)] shadow-lg shadow-neonBlue/30'}`}
          />
        </div>

        <div className="flex items-center justify-center gap-1 group">
          <span className="text-4xl font-bold text-gray-300 dark:text-gray-600 group-focus-within:text-neonBlue transition-colors">{currency.symbol}</span>
          <input 
            type="text" 
            value={amount === '0' ? '' : amount}
            placeholder="0.00"
            onChange={(e) => handleAmountChange(e.target.value)}
            className="text-6xl font-black bg-transparent text-gray-900 dark:text-white text-center focus:outline-none w-full max-w-[300px] placeholder:text-gray-200 dark:placeholder:text-navy-700 tracking-tighter"
            autoFocus
          />
        </div>
      </div>

      <div className="mt-8 mb-10">
        <div className="flex items-center justify-between mb-4">
          <label className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em]">Select Category</label>
          <span className="text-[10px] font-bold text-neonBlue uppercase tracking-widest">{category}</span>
        </div>
        <div className="flex overflow-x-auto gap-4 pb-4 no-scrollbar -mx-6 px-6">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setCategory(cat.name)}
              className={`flex-shrink-0 transition-all duration-300 ${category === cat.name ? 'scale-110' : 'opacity-40 hover:opacity-70 active:scale-90'}`}
              title={cat.name}
            >
              <div 
                className={`w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg transition-all ${category === cat.name ? 'bg-neonBlue text-white ring-4 ring-neonBlue/20 shadow-neonBlue/20' : 'bg-white dark:bg-navy-800 text-gray-500 border border-gray-100 dark:border-navy-700'}`}
              >
                {getIcon(cat.icon, 24)}
              </div>
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-4 mb-12">
        <div className="p-5 rounded-card bg-white dark:bg-navy-800 border border-gray-100 dark:border-navy-700 focus-within:ring-2 focus-within:ring-neonBlue/20 transition-all shadow-sm">
          <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-2">Note</label>
          <input 
            type="text" 
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="What was this for?" 
            className="w-full bg-transparent text-base font-bold text-gray-900 dark:text-white focus:outline-none placeholder:text-gray-300 dark:placeholder:text-gray-600"
          />
        </div>

        <div className="p-5 rounded-card bg-white dark:bg-navy-800 border border-gray-100 dark:border-navy-700 focus-within:ring-2 focus-within:ring-neonBlue/20 transition-all shadow-sm relative group overflow-hidden">
          <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-2">Date</label>
          <div className="flex items-center justify-between">
            <input 
              type="date" 
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full bg-transparent text-base font-bold text-gray-900 dark:text-white focus:outline-none cursor-pointer z-10"
            />
            <CalendarIcon size={16} className="text-gray-400 group-hover:text-neonBlue transition-colors" />
          </div>
        </div>
      </div>

      <button 
        onClick={handleSave}
        className="mt-auto w-full h-16 bg-neonBlue text-white rounded-2xl font-black text-sm uppercase tracking-[0.2em] flex items-center justify-center gap-3 shadow-xl shadow-neonBlue/30 transform transition-all active:scale-[0.98] hover:brightness-110"
      >
        <Check size={20} strokeWidth={3} />
        Save Transaction
      </button>
    </div>
  );
};

export default AddTransaction;
