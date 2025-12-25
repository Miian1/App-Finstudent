
import React from 'react';
import { Transaction } from '../types';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { CurrencyOption, formatCompactNumber } from '../constants';

interface AnalyticsProps {
  transactions: Transaction[];
  currency: CurrencyOption;
}

const Analytics: React.FC<AnalyticsProps> = ({ transactions, currency }) => {
  const monthlyExpense = transactions
    .filter(t => t.type === 'expense')
    .reduce((acc, curr) => acc + curr.amount, 0);

  // Daily totals for last 7 days
  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    const label = d.toLocaleDateString('en-US', { weekday: 'short' }).charAt(0);
    const dateStr = d.toISOString().split('T')[0];
    const total = transactions
      .filter(t => t.type === 'expense' && t.date.split('T')[0] === dateStr)
      .reduce((acc, curr) => acc + curr.amount, 0);
    return { name: label, value: total };
  });

  // Top categories
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
    }, [])
    .sort((a, b) => b.value - a.value);

  return (
    <div className="p-6">
      <header className="mb-10 text-center">
        <h2 className="text-2xl font-extrabold text-gray-900 dark:text-white mb-2">Analytics</h2>
        <p className="text-gray-400 text-sm font-medium">Spending trends & insights</p>
      </header>

      {/* Main Bar Chart */}
      <div className="mb-8 p-5 rounded-card bg-white dark:bg-navy-800 shadow-sm border border-gray-100 dark:border-navy-700">
        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-6">Daily Expenses</h3>
        <div className="h-60">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={last7Days}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" opacity={0.2} />
              <XAxis 
                dataKey="name" 
                axisLine={false} 
                tickLine={false} 
                tick={{ fill: '#9CA3AF', fontSize: 10, fontWeight: 700 }}
                dy={10}
              />
              <YAxis hide />
              <Tooltip 
                cursor={{ fill: 'transparent' }}
                contentStyle={{ 
                  borderRadius: '12px', 
                  border: 'none', 
                  boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)',
                  fontSize: '12px',
                  fontWeight: '700'
                }}
                formatter={(value: any) => [formatCompactNumber(value, currency.symbol), 'Amount']}
              />
              <Bar 
                dataKey="value" 
                radius={[6, 6, 6, 6]}
                barSize={32}
              >
                {last7Days.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={index === 6 ? '#38BDF8' : '#F3F4F6'} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="mt-4 flex items-center justify-between">
          <span className="text-xs font-bold text-gray-400">Total Spent</span>
          <span className="text-lg font-extrabold text-gray-900 dark:text-white">{formatCompactNumber(monthlyExpense, currency.symbol)}</span>
        </div>
      </div>

      {/* Categories List */}
      <div className="space-y-4">
        <h3 className="text-lg font-bold text-gray-900 dark:text-white ml-1">Breakdown</h3>
        <div className="space-y-3">
          {categoryData.map((data) => {
            const percentage = ((data.value / monthlyExpense) * 100).toFixed(0);
            return (
              <div key={data.name} className="p-4 rounded-card bg-white dark:bg-navy-800 shadow-sm border border-gray-100 dark:border-navy-700">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm font-bold text-gray-900 dark:text-white">{data.name}</span>
                  <span className="text-sm font-bold text-gray-400">{formatCompactNumber(data.value, currency.symbol)}</span>
                </div>
                <div className="w-full h-2 bg-gray-50 dark:bg-navy-900 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-neonBlue transition-all duration-1000" 
                    style={{ width: `${percentage}%` }} 
                  />
                </div>
                <div className="mt-2 text-right">
                  <span className="text-[10px] font-extrabold text-neonBlue uppercase tracking-widest">{percentage}%</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Analytics;
