
import React, { useRef, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Moon, Sun, Download, Upload, Trash2, 
  ChevronRight, List, Wrench, X, Check, Wifi, WifiOff
} from 'lucide-react';
import { CURRENCY_OPTIONS, CurrencyOption, getIcon } from '../constants';

interface SettingsProps {
  isDarkMode: boolean;
  setIsDarkMode: (val: boolean) => void;
  onReset: () => void;
  currency: CurrencyOption;
  setCurrency: (cur: CurrencyOption) => void;
}

const Settings: React.FC<SettingsProps> = ({ isDarkMode, setIsDarkMode, onReset, currency, setCurrency }) => {
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [showCurrencyModal, setShowCurrencyModal] = useState(false);
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    const handleStatusChange = () => setIsOnline(navigator.onLine);
    window.addEventListener('online', handleStatusChange);
    window.addEventListener('offline', handleStatusChange);
    return () => {
      window.removeEventListener('online', handleStatusChange);
      window.removeEventListener('offline', handleStatusChange);
    };
  }, []);

  const handleExport = () => {
    const data = {
      transactions: JSON.parse(localStorage.getItem('transactions') || '[]'),
      categories: JSON.parse(localStorage.getItem('categories') || '[]'),
      goals: JSON.parse(localStorage.getItem('goals') || '[]'),
      darkMode: JSON.parse(localStorage.getItem('darkMode') || 'true'),
      currency: JSON.parse(localStorage.getItem('currency') || 'null'),
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `finstudent_backup_${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target?.result as string);
        if (data.transactions) localStorage.setItem('transactions', JSON.stringify(data.transactions));
        if (data.categories) localStorage.setItem('categories', JSON.stringify(data.categories));
        if (data.goals) localStorage.setItem('goals', JSON.stringify(data.goals));
        if (data.darkMode !== undefined) localStorage.setItem('darkMode', JSON.stringify(data.darkMode));
        if (data.currency) localStorage.setItem('currency', JSON.stringify(data.currency));
        
        alert('Data imported successfully! The app will now reload.');
        window.location.reload();
      } catch (err) {
        alert('Error importing data. Please check the file format.');
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="p-6">
      <header className="mb-10 text-center">
        <h2 className="text-2xl font-extrabold text-gray-900 dark:text-white mb-2 font-display">Settings</h2>
        <div className="flex items-center justify-center gap-2">
          <div className={`w-2 h-2 rounded-full ${isOnline ? 'bg-emerald-500' : 'bg-amber-500'}`} />
          <p className="text-gray-400 text-xs font-bold uppercase tracking-widest">
            {isOnline ? 'Cloud Sync Active' : 'Offline Mode'}
          </p>
        </div>
      </header>

      <div className="space-y-6">
        {/* Navigation Section */}
        <div>
          <h3 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-4 ml-1">Essentials</h3>
          <div className="flex flex-col bg-white dark:bg-navy-800 rounded-card overflow-hidden shadow-sm border border-gray-100 dark:border-navy-700 divide-y divide-gray-50 dark:divide-navy-700">
            <button 
              onClick={() => navigate('/transactions')}
              className="p-5 flex items-center justify-between group active:bg-gray-50 dark:active:bg-navy-900 transition-colors"
            >
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-neonBlue/10 text-neonBlue flex items-center justify-center">
                  <List size={20} />
                </div>
                <div className="flex flex-col text-left">
                  <span className="text-sm font-bold text-gray-900 dark:text-white">Transaction History</span>
                  <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">View all activity</span>
                </div>
              </div>
              <ChevronRight size={18} className="text-gray-300 group-hover:text-neonBlue transition-colors" />
            </button>
            <button 
              onClick={() => navigate('/tools')}
              className="p-5 flex items-center justify-between group active:bg-gray-50 dark:active:bg-navy-900 transition-colors"
            >
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-softOrange/10 text-softOrange flex items-center justify-center">
                  <Wrench size={20} />
                </div>
                <div className="flex flex-col text-left">
                  <span className="text-sm font-bold text-gray-900 dark:text-white">Finance Tools</span>
                  <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Health score & categories</span>
                </div>
              </div>
              <ChevronRight size={18} className="text-gray-300 group-hover:text-neonBlue transition-colors" />
            </button>
          </div>
        </div>

        {/* Preferences Section */}
        <div>
          <h3 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-4 ml-1">Preferences</h3>
          <div className="flex flex-col bg-white dark:bg-navy-800 rounded-card overflow-hidden shadow-sm border border-gray-100 dark:border-navy-700 divide-y divide-gray-50 dark:divide-navy-700">
            <div className="p-5 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-purple-100 dark:bg-purple-500/10 text-purple-600 flex items-center justify-center">
                  {isDarkMode ? <Moon size={20} /> : <Sun size={20} />}
                </div>
                <div className="flex flex-col">
                  <span className="text-sm font-bold text-gray-900 dark:text-white">Dark Mode</span>
                  <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Protect your eyes</span>
                </div>
              </div>
              <button 
                onClick={() => setIsDarkMode(!isDarkMode)}
                className={`w-12 h-6 rounded-full transition-all relative ${isDarkMode ? 'bg-neonBlue' : 'bg-gray-200'}`}
              >
                <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${isDarkMode ? 'left-7' : 'left-1'}`} />
              </button>
            </div>

            <button 
              onClick={() => setShowCurrencyModal(true)}
              className="p-5 flex items-center justify-between group active:bg-gray-50 dark:active:bg-navy-900 transition-colors"
            >
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-emerald-100 dark:bg-emerald-500/10 text-emerald-600 flex items-center justify-center">
                  {getIcon('Coins', 20)}
                </div>
                <div className="flex flex-col text-left">
                  <span className="text-sm font-bold text-gray-900 dark:text-white">Currency</span>
                  <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Current: {currency.code} ({currency.symbol})</span>
                </div>
              </div>
              <ChevronRight size={18} className="text-gray-300" />
            </button>
          </div>
        </div>

        {/* Data Management Section */}
        <div>
          <h3 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-4 ml-1">Data Management</h3>
          <div className="flex flex-col bg-white dark:bg-navy-800 rounded-card overflow-hidden shadow-sm border border-gray-100 dark:border-navy-700 divide-y divide-gray-50 dark:divide-navy-700">
            <button 
              onClick={handleExport}
              className="p-5 flex items-center justify-between group active:bg-gray-50 dark:active:bg-navy-900 transition-colors"
            >
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-gray-100 dark:bg-navy-900 text-gray-500 flex items-center justify-center">
                  <Download size={20} />
                </div>
                <div className="flex flex-col text-left">
                  <span className="text-sm font-bold text-gray-900 dark:text-white">Export Data</span>
                  <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Save backup locally</span>
                </div>
              </div>
              <ChevronRight size={18} className="text-gray-300 transition-colors" />
            </button>
            <button 
              onClick={handleImportClick}
              className="p-5 flex items-center justify-between group active:bg-gray-50 dark:active:bg-navy-900 transition-colors"
            >
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-gray-100 dark:bg-navy-900 text-gray-500 flex items-center justify-center">
                  <Upload size={20} />
                </div>
                <div className="flex flex-col text-left">
                  <span className="text-sm font-bold text-gray-900 dark:text-white">Import Data</span>
                  <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Restore from backup</span>
                </div>
              </div>
              <ChevronRight size={18} className="text-gray-300 transition-colors" />
              <input 
                type="file" 
                ref={fileInputRef} 
                className="hidden" 
                accept=".json" 
                onChange={handleFileImport} 
              />
            </button>
          </div>
        </div>

        <div>
          <h3 className="text-[10px] font-bold text-red-400 uppercase tracking-widest mb-4 ml-1">Danger Zone</h3>
          <button 
            onClick={() => {
              if (window.confirm('Delete everything? This will wipe your history, goals, and custom categories.')) {
                onReset();
                alert('All data has been cleared.');
              }
            }}
            className="w-full p-5 rounded-card bg-red-50 dark:bg-red-500/5 border border-red-100 dark:border-red-500/20 flex items-center justify-between group active:scale-[0.98] transition-all"
          >
            <div className="flex items-center gap-4 text-left">
              <div className="w-10 h-10 rounded-full bg-red-100 dark:bg-red-500/10 text-red-600 flex items-center justify-center">
                <Trash2 size={20} />
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-bold text-red-600">Clear All Data</span>
                <span className="text-[10px] text-red-400 font-bold uppercase tracking-wider">Permanent removal</span>
              </div>
            </div>
            <ChevronRight size={18} className="text-red-300" />
          </button>
        </div>
      </div>

      <div className="mt-16 text-center">
        <p className="text-[10px] font-bold text-gray-300 dark:text-navy-700 uppercase tracking-[0.2em]">FinStudent Premium v1.2.0 • Offline Ready</p>
      </div>

      {showCurrencyModal && (
        <div className="fixed inset-0 z-[100] flex items-end justify-center bg-navy-900/60 backdrop-blur-sm p-4 animate-in fade-in duration-300">
          <div className="w-full max-w-md bg-white dark:bg-navy-800 rounded-t-[32px] p-8 shadow-2xl animate-in slide-in-from-bottom-full duration-500">
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">Select Currency</h3>
              <button 
                onClick={() => setShowCurrencyModal(false)}
                className="w-10 h-10 rounded-full bg-gray-100 dark:bg-navy-900 flex items-center justify-center text-gray-400"
              >
                <X size={20} />
              </button>
            </div>
            <div className="grid grid-cols-1 gap-3 max-h-[60vh] overflow-y-auto no-scrollbar">
              {CURRENCY_OPTIONS.map((opt) => (
                <button
                  key={opt.code}
                  onClick={() => {
                    setCurrency(opt);
                    setShowCurrencyModal(false);
                  }}
                  className={`flex items-center justify-between p-5 rounded-2xl border transition-all ${currency.code === opt.code ? 'bg-neonBlue/10 border-neonBlue text-neonBlue' : 'bg-gray-50 dark:bg-navy-900 border-transparent text-gray-900 dark:text-white hover:border-gray-200'}`}
                >
                  <div className="flex items-center gap-4">
                    <span className="w-12 h-12 rounded-xl bg-white dark:bg-navy-800 flex items-center justify-center text-lg font-extrabold shadow-sm">{opt.symbol}</span>
                    <div className="flex flex-col text-left">
                      <span className="text-sm font-bold">{opt.code}</span>
                      <span className="text-[10px] font-bold uppercase tracking-wider opacity-60">{opt.name}</span>
                    </div>
                  </div>
                  {currency.code === opt.code && <Check size={20} />}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Settings;
