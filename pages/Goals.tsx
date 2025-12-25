
import React, { useState } from 'react';
import { Goal, Debt, DebtType } from '../types';
import { Target, Plus, ChevronRight, CheckCircle2, Users, ArrowRightLeft, Trash2, CheckCircle, Circle } from 'lucide-react';
import { CurrencyOption, formatCompactNumber } from '../constants';

interface GoalsProps {
  goals: Goal[];
  onAddGoal: (goal: Omit<Goal, 'id'>) => void;
  onUpdateProgress: (id: string, amount: number) => void;
  currency: CurrencyOption;
  debts: Debt[];
  onAddDebt: (debt: Omit<Debt, 'id'>) => void;
  onDeleteDebt: (id: string) => void;
  onToggleDebt: (id: string) => void;
}

const Goals: React.FC<GoalsProps> = ({ 
  goals, 
  onAddGoal, 
  onUpdateProgress, 
  currency, 
  debts, 
  onAddDebt, 
  onDeleteDebt, 
  onToggleDebt 
}) => {
  const [activeTab, setActiveTab] = useState<'goals' | 'udhaar'>('goals');
  const [showAdd, setShowAdd] = useState(false);
  
  // Goal form state
  const [goalName, setGoalName] = useState('');
  const [goalTarget, setGoalTarget] = useState('');
  const [goalDeadline, setGoalDeadline] = useState('');

  // Udhaar form state
  const [personName, setPersonName] = useState('');
  const [debtAmount, setDebtAmount] = useState('');
  const [debtType, setDebtType] = useState<DebtType>('lent');

  const handleAddGoal = () => {
    if (!goalName || !goalTarget) return;
    onAddGoal({
      name: goalName,
      targetAmount: parseFloat(goalTarget),
      currentAmount: 0,
      deadline: goalDeadline || new Date().toISOString(),
      color: '#38BDF8'
    });
    setGoalName('');
    setGoalTarget('');
    setShowAdd(false);
  };

  const handleAddDebt = () => {
    if (!personName || !debtAmount) return;
    onAddDebt({
      personName,
      amount: parseFloat(debtAmount),
      type: debtType,
      date: new Date().toISOString(),
      isPaid: false
    });
    setPersonName('');
    setDebtAmount('');
    setShowAdd(false);
  };

  const totalBorrowed = debts.filter(d => d.type === 'borrowed' && !d.isPaid).reduce((acc, d) => acc + d.amount, 0);
  const totalLent = debts.filter(d => d.type === 'lent' && !d.isPaid).reduce((acc, d) => acc + d.amount, 0);

  return (
    <div className="p-6">
      <header className="mb-8 text-center">
        <h2 className="text-2xl font-extrabold text-gray-900 dark:text-white mb-6 font-display">Planning</h2>
        
        {/* Tab Switcher */}
        <div className="flex bg-white dark:bg-navy-800 p-1 rounded-2xl shadow-sm border border-gray-100 dark:border-navy-700">
          <button 
            onClick={() => { setActiveTab('goals'); setShowAdd(false); }}
            className={`flex-1 py-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 ${activeTab === 'goals' ? 'bg-neonBlue text-white shadow-lg shadow-neonBlue/20' : 'text-gray-400'}`}
          >
            <Target size={16} />
            Savings Goals
          </button>
          <button 
            onClick={() => { setActiveTab('udhaar'); setShowAdd(false); }}
            className={`flex-1 py-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 ${activeTab === 'udhaar' ? 'bg-softOrange text-white shadow-lg shadow-softOrange/20' : 'text-gray-400'}`}
          >
            <Users size={16} />
            Udhaar Tracker
          </button>
        </div>
      </header>

      {/* Summary Cards for Udhaar */}
      {activeTab === 'udhaar' && debts.length > 0 && (
        <div className="grid grid-cols-2 gap-4 mb-8">
          <div className="p-4 rounded-card bg-white dark:bg-navy-800 border border-gray-100 dark:border-navy-700">
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">You Owe</p>
            <p className="text-xl font-bold text-red-500">{formatCompactNumber(totalBorrowed, currency.symbol)}</p>
          </div>
          <div className="p-4 rounded-card bg-white dark:bg-navy-800 border border-gray-100 dark:border-navy-700">
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Owed to You</p>
            <p className="text-xl font-bold text-emerald-500">{formatCompactNumber(totalLent, currency.symbol)}</p>
          </div>
        </div>
      )}

      <div className="flex justify-center mb-8">
        <button 
          onClick={() => setShowAdd(!showAdd)}
          className={`flex items-center gap-2 px-8 py-3 rounded-full font-bold shadow-lg transition-all active:scale-95 ${activeTab === 'goals' ? 'bg-neonBlue text-white shadow-neonBlue/20' : 'bg-softOrange text-white shadow-softOrange/20'}`}
        >
          <Plus size={20} />
          {activeTab === 'goals' ? 'New Savings Goal' : 'New Udhaar Entry'}
        </button>
      </div>

      {showAdd && (
        <div className={`mb-8 p-6 rounded-card bg-white dark:bg-navy-800 border-2 animate-in slide-in-from-top-4 duration-300 ${activeTab === 'goals' ? 'border-neonBlue' : 'border-softOrange'}`}>
          {activeTab === 'goals' ? (
            <div className="space-y-4">
              <div>
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-2">Goal Name</label>
                <input 
                  type="text" 
                  value={goalName}
                  onChange={(e) => setGoalName(e.target.value)}
                  placeholder="e.g. New iPhone"
                  className="w-full bg-transparent text-lg font-bold text-gray-900 dark:text-white focus:outline-none"
                />
              </div>
              <div className="flex gap-4">
                <div className="flex-1">
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-2">Target ({currency.symbol})</label>
                  <input 
                    type="number" 
                    value={goalTarget}
                    onChange={(e) => setGoalTarget(e.target.value)}
                    placeholder="1000"
                    className="w-full bg-transparent text-lg font-bold text-gray-900 dark:text-white focus:outline-none"
                  />
                </div>
                <div className="flex-1">
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-2">By Date</label>
                  <input 
                    type="date" 
                    value={goalDeadline}
                    onChange={(e) => setGoalDeadline(e.target.value)}
                    className="w-full bg-transparent text-sm font-bold text-gray-900 dark:text-white focus:outline-none"
                  />
                </div>
              </div>
              <button 
                onClick={handleAddGoal}
                className="w-full h-12 bg-neonBlue text-white rounded-xl font-bold mt-4"
              >
                Create Goal
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex bg-gray-50 dark:bg-navy-900 p-1 rounded-xl mb-4">
                <button 
                  onClick={() => setDebtType('lent')}
                  className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all ${debtType === 'lent' ? 'bg-emerald-500 text-white' : 'text-gray-400'}`}
                >
                  Owed to me
                </button>
                <button 
                  onClick={() => setDebtType('borrowed')}
                  className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all ${debtType === 'borrowed' ? 'bg-red-500 text-white' : 'text-gray-400'}`}
                >
                  I owe them
                </button>
              </div>
              <div>
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-2">Person's Name</label>
                <input 
                  type="text" 
                  value={personName}
                  onChange={(e) => setPersonName(e.target.value)}
                  placeholder="e.g. Aslam bhai"
                  className="w-full bg-transparent text-lg font-bold text-gray-900 dark:text-white focus:outline-none"
                />
              </div>
              <div>
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-2">Amount ({currency.symbol})</label>
                <input 
                  type="number" 
                  value={debtAmount}
                  onChange={(e) => setDebtAmount(e.target.value)}
                  placeholder="500"
                  className="w-full bg-transparent text-lg font-bold text-gray-900 dark:text-white focus:outline-none"
                />
              </div>
              <button 
                onClick={handleAddDebt}
                className="w-full h-12 bg-softOrange text-white rounded-xl font-bold mt-4"
              >
                Add Udhaar
              </button>
            </div>
          )}
        </div>
      )}

      <div className="space-y-6">
        {activeTab === 'goals' ? (
          goals.map(goal => {
            const progress = Math.min(100, (goal.currentAmount / goal.targetAmount) * 100);
            return (
              <div key={goal.id} className="p-6 rounded-card bg-white dark:bg-navy-800 shadow-sm border border-gray-100 dark:border-navy-700">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-neonBlue/10 text-neonBlue flex items-center justify-center">
                      <Target size={20} />
                    </div>
                    <div>
                      <h4 className="text-lg font-bold text-gray-900 dark:text-white">{goal.name}</h4>
                      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Due {new Date(goal.deadline).toLocaleDateString()}</p>
                    </div>
                  </div>
                  {progress >= 100 && <CheckCircle2 size={24} className="text-emerald-500" />}
                </div>

                <div className="flex justify-between items-end mb-2">
                  <span className="text-2xl font-extrabold text-gray-900 dark:text-white">{formatCompactNumber(goal.currentAmount, currency.symbol)}</span>
                  <span className="text-xs font-bold text-gray-400">Target: {formatCompactNumber(goal.targetAmount, currency.symbol)}</span>
                </div>

                <div className="w-full h-3 bg-gray-100 dark:bg-navy-900 rounded-full overflow-hidden mb-6">
                  <div 
                    className="h-full bg-neonBlue transition-all duration-1000 ease-out"
                    style={{ width: `${progress}%` }}
                  />
                </div>

                <div className="flex gap-2">
                  {[10, 50, 100].map(amount => (
                     <button 
                      key={amount}
                      onClick={() => onUpdateProgress(goal.id, amount)}
                      className="flex-1 py-2 bg-gray-50 dark:bg-navy-700 text-gray-500 dark:text-gray-300 text-[10px] font-bold rounded-lg hover:bg-neonBlue hover:text-white transition-colors"
                     >
                      +{formatCompactNumber(amount, currency.symbol)}
                     </button>
                  ))}
                </div>
              </div>
            );
          })
        ) : (
          debts.map(debt => (
            <div key={debt.id} className={`p-5 rounded-card bg-white dark:bg-navy-800 shadow-sm border border-gray-100 dark:border-navy-700 transition-opacity ${debt.isPaid ? 'opacity-50' : 'opacity-100'}`}>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center ${debt.type === 'lent' ? 'bg-emerald-100 dark:bg-emerald-500/10 text-emerald-600' : 'bg-red-100 dark:bg-red-500/10 text-red-600'}`}>
                    {debt.type === 'lent' ? <ArrowRightLeft size={20} /> : <Users size={20} />}
                  </div>
                  <div className="flex flex-col text-left">
                    <span className="text-sm font-bold text-gray-900 dark:text-white">{debt.personName}</span>
                    <span className={`text-[10px] font-bold uppercase tracking-wider ${debt.type === 'lent' ? 'text-emerald-500' : 'text-red-500'}`}>
                      {debt.type === 'lent' ? 'Owed to you' : 'You owe'}
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold text-gray-900 dark:text-white">
                    {formatCompactNumber(debt.amount, currency.symbol)}
                  </p>
                  <p className="text-[9px] font-bold text-gray-400 uppercase">
                    {new Date(debt.date).toLocaleDateString()}
                  </p>
                </div>
              </div>
              
              <div className="flex gap-2 pt-2 border-t border-gray-50 dark:border-navy-700">
                <button 
                  onClick={() => onToggleDebt(debt.id)}
                  className={`flex-1 py-2 rounded-lg text-[10px] font-bold uppercase tracking-widest flex items-center justify-center gap-2 transition-all ${debt.isPaid ? 'bg-gray-100 text-gray-400 dark:bg-navy-900' : 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600'}`}
                >
                  {debt.isPaid ? <CheckCircle size={14} /> : <Circle size={14} />}
                  {debt.isPaid ? 'Paid' : 'Mark as Paid'}
                </button>
                <button 
                  onClick={() => onDeleteDebt(debt.id)}
                  className="w-12 h-9 rounded-lg bg-red-50 dark:bg-red-500/5 text-red-400 flex items-center justify-center hover:bg-red-500 hover:text-white transition-all"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))
        )}

        {((activeTab === 'goals' && goals.length === 0) || (activeTab === 'udhaar' && debts.length === 0)) && (
          <div className="flex flex-col items-center justify-center py-20 opacity-30">
            {activeTab === 'goals' ? <Target size={48} className="text-gray-400 mb-4" /> : <Users size={48} className="text-gray-400 mb-4" />}
            <p className="text-sm font-bold text-gray-500">
              {activeTab === 'goals' ? 'No goals set yet' : 'No Udhaar entries yet'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Goals;
