
import React, { useState } from 'react';
import { Category, Transaction } from '../types';
import { ICON_OPTIONS, getIcon, CurrencyOption, formatCompactNumber } from '../constants';
import { Plus, LayoutGrid, Info, ArrowUpRight, ArrowDownLeft, X } from 'lucide-react';

interface ToolsProps {
  categories: Category[];
  onAddCategory: (name: string, icon: string, color: string) => void;
  transactions: Transaction[];
  currency: CurrencyOption;
}

const Tools: React.FC<ToolsProps> = ({ categories, onAddCategory, transactions, currency }) => {
  const [showAddCat, setShowAddCat] = useState(false);
  const [newCatName, setNewCatName] = useState('');
  const [selectedIcon, setSelectedIcon] = useState(ICON_OPTIONS[0]);

  const totalIncome = transactions.filter(t => t.type === 'income').reduce((acc, t) => acc + t.amount, 0);
  const totalExpense = transactions.filter(t => t.type === 'expense').reduce((acc, t) => acc + t.amount, 0);
  const healthScore = totalIncome > 0 ? Math.min(100, Math.round(((totalIncome - totalExpense) / totalIncome) * 100)) : 0;

  const handleAdd = () => {
    if (!newCatName.trim()) return;
    onAddCategory(newCatName.trim(), selectedIcon, '#38BDF8');
    setNewCatName('');
    setShowAddCat(false);
  };

  return (
    <div className="p-6">
      <header className="mb-10 text-center">
        <h2 className="text-2xl font-extrabold text-gray-900 dark:text-white mb-2 font-display">Tools</h2>
        <p className="text-gray-400 text-sm font-medium uppercase tracking-widest text-[10px]">Financial Intelligence</p>
      </header>

      {/* Financial Health Score */}
      <div className="mb-8 p-6 rounded-card bg-gradient-to-br from-navy-800 to-navy-900 dark:from-navy-800 dark:to-navy-700 text-white shadow-xl border border-white/5 relative overflow-hidden group">
        <div className="absolute -right-10 -top-10 w-40 h-40 bg-neonBlue/10 rounded-full blur-3xl group-hover:bg-neonBlue/20 transition-all duration-700" />
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-neonBlue">Spending Health</h3>
          <Info size={16} className="text-gray-500" />
        </div>
        <div className="flex items-baseline gap-2 mb-2">
          <span className="text-6xl font-black font-display tracking-tighter">{healthScore}</span>
          <span className="text-xl font-bold text-gray-500">/100</span>
        </div>
        <p className="text-xs font-medium text-gray-400 leading-relaxed mb-8 max-w-[200px]">
          {healthScore > 50 
            ? "Impressive! You're saving more than half of what you earn." 
            : healthScore > 0 
              ? "You're on the right track, but watch those small expenses."
              : "Start tracking more income to see your score grow!"}
        </p>
        <div className="flex gap-4">
            <div className="flex-1 bg-white/5 rounded-2xl p-4 backdrop-blur-md border border-white/5">
                <div className="flex items-center gap-1 text-[10px] font-bold uppercase text-emerald-400 mb-1"><ArrowDownLeft size={10}/> Total In</div>
                <div className="text-lg font-bold">{formatCompactNumber(totalIncome, currency.symbol)}</div>
            </div>
            <div className="flex-1 bg-white/5 rounded-2xl p-4 backdrop-blur-md border border-white/5">
                <div className="flex items-center gap-1 text-[10px] font-bold uppercase text-red-400 mb-1"><ArrowUpRight size={10}/> Total Out</div>
                <div className="text-lg font-bold">{formatCompactNumber(totalExpense, currency.symbol)}</div>
            </div>
        </div>
      </div>

      {/* Category Manager */}
      <section className="mb-10">
        <div className="flex items-center justify-between mb-6 px-1">
          <h3 className="text-lg font-extrabold text-gray-900 dark:text-white font-display">Manage Categories</h3>
          <button 
            onClick={() => setShowAddCat(true)}
            className="flex items-center gap-2 px-4 py-2 bg-neonBlue text-white rounded-full text-[10px] font-bold uppercase tracking-widest shadow-lg shadow-neonBlue/20 active:scale-95 transition-all"
          >
            <Plus size={14} />
            Create
          </button>
        </div>

        {showAddCat && (
          <div className="fixed inset-0 z-[60] bg-navy-900/60 backdrop-blur-sm flex items-end justify-center p-4 animate-in fade-in duration-300">
            <div className="w-full max-w-md bg-white dark:bg-navy-800 rounded-t-[32px] p-8 shadow-2xl animate-in slide-in-from-bottom-full duration-500">
              <div className="flex items-center justify-between mb-8">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white font-display">New Category</h3>
                <button 
                  onClick={() => setShowAddCat(false)}
                  className="w-10 h-10 rounded-full bg-gray-100 dark:bg-navy-900 flex items-center justify-center text-gray-400"
                >
                  <X size={20} />
                </button>
              </div>
              
              <div className="space-y-8">
                <div>
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-3">Label Name</label>
                  <input 
                    type="text" 
                    placeholder="e.g. Freelancing, Gift, Rent"
                    value={newCatName}
                    onChange={(e) => setNewCatName(e.target.value)}
                    className="w-full bg-gray-50 dark:bg-navy-900 rounded-2xl p-5 text-lg font-bold text-gray-900 dark:text-white focus:ring-2 focus:ring-neonBlue/20 outline-none transition-all placeholder:text-gray-300 dark:placeholder:text-navy-700"
                    autoFocus
                  />
                </div>

                <div>
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-4">Choose Visual Icon</label>
                  <div className="grid grid-cols-5 gap-3 max-h-[30vh] overflow-y-auto no-scrollbar pb-4">
                    {ICON_OPTIONS.map(icon => (
                      <button 
                        key={icon}
                        onClick={() => setSelectedIcon(icon)}
                        className={`aspect-square rounded-2xl flex items-center justify-center transition-all ${selectedIcon === icon ? 'bg-neonBlue text-white shadow-lg shadow-neonBlue/30 scale-110' : 'bg-gray-50 dark:bg-navy-900 text-gray-400 dark:text-navy-600 hover:bg-gray-100 dark:hover:bg-navy-700'}`}
                      >
                        {getIcon(icon, 24)}
                      </button>
                    ))}
                  </div>
                </div>

                <button 
                  onClick={handleAdd}
                  disabled={!newCatName.trim()}
                  className="w-full h-16 bg-neonBlue text-white rounded-2xl font-bold text-sm uppercase tracking-widest shadow-xl shadow-neonBlue/20 active:scale-[0.98] transition-all disabled:opacity-50 disabled:grayscale"
                >
                  Add Category
                </button>
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-4 gap-4">
          {categories.map(cat => (
            <div key={cat.id} className="group flex flex-col items-center gap-3 animate-in fade-in zoom-in duration-300">
              <div className="w-full aspect-square rounded-card bg-white dark:bg-navy-800 shadow-sm border border-gray-100 dark:border-navy-700 flex items-center justify-center text-gray-600 dark:text-gray-400 group-hover:border-neonBlue transition-colors group-hover:shadow-lg group-hover:shadow-neonBlue/5">
                {getIcon(cat.icon, 24)}
              </div>
              <span className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-tight truncate w-full text-center px-1">
                {cat.name}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* Analytics Widget (Coming Soon) */}
      <section>
        <h3 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-6 ml-1">Advanced Features</h3>
        <div className="space-y-4">
          <div className="p-5 rounded-card bg-white dark:bg-navy-800 border border-gray-100 dark:border-navy-700 flex items-center gap-5 relative opacity-60">
             <div className="w-12 h-12 rounded-2xl bg-gray-50 dark:bg-navy-900 flex items-center justify-center text-neonBlue">
                <LayoutGrid size={20} />
             </div>
             <div>
                <p className="text-sm font-bold text-gray-900 dark:text-white">Home Screen Widget</p>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Coming in v2.0</p>
             </div>
             <div className="absolute right-6 px-2 py-1 bg-gray-100 dark:bg-navy-900 rounded text-[8px] font-bold text-gray-400 uppercase">Beta</div>
          </div>
        </div>
      </section>

      <div className="mt-12 text-center">
        <p className="text-[9px] font-bold text-gray-300 dark:text-navy-800 uppercase tracking-[0.3em]">FinStudent Modular Framework</p>
      </div>
    </div>
  );
};

export default Tools;
