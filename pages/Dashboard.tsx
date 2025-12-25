
import React from 'react';
import { Transaction, Goal } from '../types';
import { getIcon, CurrencyOption, formatCompactNumber } from '../constants';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import { ArrowUpRight, ArrowDownLeft, Target, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';

interface DashboardProps {
  transactions: Transaction[];
  goals: Goal[];
  currency: CurrencyOption;
}

const Dashboard: React.FC<DashboardProps> = ({ transactions, goals, currency }) => {
  const totalBalance = transactions.reduce((acc, curr) => acc + (curr.type === 'income' ? curr.amount : -curr.amount), 0);
  const monthlyIncome = transactions
    .filter(t => t.type === 'income')
    .reduce((acc, curr) => acc + curr.amount, 0);
  const monthlyExpense = transactions
    .filter(t => t.type === 'expense')
    .reduce((acc, curr) => acc + curr.amount, 0);

  const categoryData = transactions
    .filter(t => t.type === 'expense')
    .reduce((acc: any[], curr) => {
      const existing = acc.find(a => a.name === curr.category);
      if (existing) {
        existing.value += curr.amount;
      } else {
        acc.push({ name: curr.category, value: curr.amount });
      }
      return acc;
    }, []);

  const COLORS = ['#38BDF8', '#FB923C', '#EC4899', '#8B5CF6', '#10B981'];

  return (
    <div className="p-6 pt-12 pb-10 space-y-8">
      {/* 1. Total Amount Header */}
      <div className="text-center">
        <span className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-[0.2em] mb-2 block">Total Balance</span>
        <h2 className="text-5xl font-extrabold text-gray-900 dark:text-white font-display">
          {formatCompactNumber(totalBalance, currency.symbol)}
        </h2>
      </div>

      {/* 2. Income | Expenses Cards */}
      <div className="grid grid-cols-2 gap-4">
        <div className="p-5 rounded-card bg-white dark:bg-navy-800 shadow-sm border border-gray-100 dark:border-navy-700 flex flex-col gap-2">
          <div className="w-10 h-10 rounded-full bg-emerald-100 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
            <ArrowDownLeft size={20} />
          </div>
          <div>
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Income</span>
            <p className="text-xl font-bold text-gray-900 dark:text-white mt-1">{formatCompactNumber(monthlyIncome, '+ ' + currency.symbol)}</p>
          </div>
        </div>
        <div className="p-5 rounded-card bg-white dark:bg-navy-800 shadow-sm border border-gray-100 dark:border-navy-700 flex flex-col gap-2">
          <div className="w-10 h-10 rounded-full bg-red-100 dark:bg-red-500/10 text-red-600 dark:text-red-400 flex items-center justify-center">
            <ArrowUpRight size={20} />
          </div>
          <div>
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Expenses</span>
            <p className="text-xl font-bold text-gray-900 dark:text-white mt-1">{formatCompactNumber(monthlyExpense, '- ' + currency.symbol)}</p>
          </div>
        </div>
      </div>

      {/* 3. Goals Card */}
      <Link 
        to="/goals" 
        className="block p-6 rounded-card bg-gradient-to-br from-neonBlue to-blue-600 text-white shadow-lg shadow-neonBlue/30 transform transition-transform active:scale-[0.98]"
      >
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
              <Target size={22} />
            </div>
            <div>
              <h3 className="text-lg font-bold">Savings Goals</h3>
              <p className="text-xs opacity-80">{goals.length} active targets</p>
            </div>
          </div>
          <ChevronRight size={20} className="opacity-60" />
        </div>
        <div className="flex gap-2">
          {goals.slice(0, 3).map((goal, idx) => (
            <div key={goal.id} className="flex-1 bg-white/10 rounded-xl p-2 backdrop-blur-sm">
              <p className="text-[9px] font-bold uppercase truncate opacity-70 mb-1">{goal.name}</p>
              <p className="text-xs font-bold">{Math.min(100, Math.round((goal.currentAmount/goal.targetAmount)*100))}%</p>
            </div>
          ))}
          {goals.length === 0 && <p className="text-sm italic opacity-70">No goals set yet. Start saving!</p>}
        </div>
      </Link>

      {/* 4. Spending by Category Card */}
      <div className="p-6 rounded-card bg-white dark:bg-navy-800 shadow-sm border border-gray-100 dark:border-navy-700">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white font-display">Spending</h3>
          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Categories</span>
        </div>
        <div className="flex items-center gap-6 h-36">
          <div className="w-32 h-32">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categoryData.length > 0 ? categoryData : [{ name: 'Empty', value: 1 }]}
                  innerRadius={35}
                  outerRadius={50}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {(categoryData.length > 0 ? categoryData : [{ name: 'Empty', value: 1 }]).map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.name === 'Empty' ? '#E5E7EB' : COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex flex-col gap-2 overflow-y-auto no-scrollbar flex-1 max-h-32">
            {categoryData.length > 0 ? categoryData.slice(0, 5).map((data, index) => (
              <div key={data.name} className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: COLORS[index % COLORS.length] }} />
                <span className="text-xs font-bold text-gray-600 dark:text-gray-400 truncate">{data.name}</span>
                <span className="text-xs font-bold text-gray-400 ml-auto">
                  {((data.value / monthlyExpense) * 100).toFixed(0)}%
                </span>
              </div>
            )) : <span className="text-xs text-gray-400 font-medium">No activity yet.</span>}
          </div>
        </div>
      </div>

      {/* 5. Recent Activity */}
      <div>
        <div className="flex items-center justify-between mb-4 px-1">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white font-display">Recent Activity</h3>
          <Link to="/transactions" className="text-neonBlue text-sm font-bold flex items-center gap-1">
            See all <ChevronRight size={14} />
          </Link>
        </div>
        <div className="space-y-3">
          {transactions.slice(0, 5).map((t) => (
            <div key={t.id} className="p-4 rounded-card bg-white dark:bg-navy-800 shadow-sm border border-gray-100 dark:border-navy-700 flex items-center justify-between transition-transform active:scale-[0.99]">
              <div className="flex items-center gap-4">
                <div className="w-11 h-11 rounded-full bg-gray-50 dark:bg-navy-900 flex items-center justify-center text-gray-500 dark:text-gray-400 border border-gray-100 dark:border-navy-700">
                  {getIcon(t.category, 18)}
                </div>
                <div className="flex flex-col">
                  <span className="text-sm font-bold text-gray-900 dark:text-white truncate max-w-[120px]">{t.note || t.category}</span>
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">{t.category}</span>
                </div>
              </div>
              <div className="text-right">
                <p className={`text-sm font-bold ${t.type === 'income' ? 'text-emerald-500' : 'text-gray-900 dark:text-white'}`}>
                  {t.type === 'income' ? '+' : '-'}{currency.symbol}{t.amount.toLocaleString()}
                </p>
                <p className="text-[9px] font-bold text-gray-300 dark:text-gray-600 uppercase">
                  {new Date(t.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                </p>
              </div>
            </div>
          ))}
          {transactions.length === 0 && (
            <div className="text-center py-10 opacity-30">
              <p className="text-sm font-bold">Your activity will appear here</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
