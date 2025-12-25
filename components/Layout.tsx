
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Target, Plus, PieChart, Settings } from 'lucide-react';

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="min-h-screen flex flex-col max-w-lg mx-auto bg-offwhite dark:bg-navy-900 transition-colors duration-300 relative">
      <main className="flex-1 overflow-y-auto pb-32 no-scrollbar">
        {children}
      </main>

      {/* Persistent Bottom Navigation with Mobile Safe Area Support */}
      <nav className="fixed bottom-0 left-0 right-0 max-w-lg mx-auto bg-white/80 dark:bg-navy-800/80 backdrop-blur-lg border-t border-gray-100 dark:border-navy-700 h-auto pt-4 px-4 flex items-start justify-between z-50 rounded-t-card shadow-[0_-10px_25px_-5px_rgba(0,0,0,0.1)] nav-safe-padding">
        <Link to="/" className={`flex flex-col items-center gap-1 w-14 transition-colors ${isActive('/') ? 'text-neonBlue' : 'text-gray-400'}`}>
          <Home size={22} />
          <span className="text-[9px] font-bold">Home</span>
        </Link>
        <Link to="/goals" className={`flex flex-col items-center gap-1 w-14 transition-colors ${isActive('/goals') ? 'text-neonBlue' : 'text-gray-400'}`}>
          <Target size={22} />
          <span className="text-[9px] font-medium">Goals</span>
        </Link>
        
        {/* Center Add Button - Lifted for visual impact */}
        <Link to="/add" className="relative -top-10 bg-neonBlue text-white p-4 rounded-full shadow-lg shadow-neonBlue/40 transform transition-transform hover:scale-110 active:scale-95">
          <Plus size={26} />
        </Link>

        <Link to="/analytics" className={`flex flex-col items-center gap-1 w-14 transition-colors ${isActive('/analytics') ? 'text-neonBlue' : 'text-gray-400'}`}>
          <PieChart size={22} />
          <span className="text-[9px] font-medium">Stats</span>
        </Link>
        <Link to="/settings" className={`flex flex-col items-center gap-1 w-14 transition-colors ${isActive('/settings') ? 'text-neonBlue' : 'text-gray-400'}`}>
          <Settings size={22} />
          <span className="text-[9px] font-medium">Settings</span>
        </Link>
      </nav>
    </div>
  );
};

export default Layout;
