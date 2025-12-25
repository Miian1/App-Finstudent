
import React from 'react';
import { 
  Utensils, 
  Bus, 
  ShoppingBag, 
  GraduationCap, 
  Heart, 
  Gamepad2, 
  Home, 
  Briefcase,
  Coffee,
  Zap,
  Car,
  Plane,
  Gift,
  Plus,
  Coins,
  Banknote,
  TrendingUp,
  Wallet,
  Award,
  Gem,
  Landmark
} from 'lucide-react';
import { Category } from './types';

export const INITIAL_CATEGORIES: Category[] = [
  { id: 'cat-1', name: 'Food', icon: 'Utensils', color: '#FB923C' },
  { id: 'cat-2', name: 'Transport', icon: 'Bus', color: '#38BDF8' },
  { id: 'cat-3', name: 'Shopping', icon: 'ShoppingBag', color: '#EC4899' },
  { id: 'cat-4', name: 'Education', icon: 'GraduationCap', color: '#8B5CF6' },
  { id: 'cat-5', name: 'Health', icon: 'Heart', color: '#EF4444' },
  { id: 'cat-6', name: 'Fun', icon: 'Gamepad2', color: '#F59E0B' },
  { id: 'cat-7', name: 'Rent', icon: 'Home', color: '#10B981' },
  { id: 'cat-8', name: 'Salary', icon: 'Briefcase', color: '#3B82F6' },
];

export const ICON_OPTIONS = [
  'Utensils', 'Bus', 'ShoppingBag', 'GraduationCap', 'Heart', 
  'Gamepad2', 'Home', 'Briefcase', 'Coffee', 'Zap', 'Car', 
  'Plane', 'Gift', 'Banknote', 'TrendingUp', 'Wallet', 
  'Award', 'Gem', 'Landmark', 'Coins'
];

export interface CurrencyOption {
  code: string;
  symbol: string;
  name: string;
}

export const CURRENCY_OPTIONS: CurrencyOption[] = [
  { code: 'PKR', symbol: 'Rs.', name: 'Pakistani Rupee' },
  { code: 'USD', symbol: '$', name: 'US Dollar' },
  { code: 'EUR', symbol: '€', name: 'Euro' },
  { code: 'GBP', symbol: '£', name: 'British Pound' },
  { code: 'INR', symbol: '₹', name: 'Indian Rupee' },
  { code: 'JPY', symbol: '¥', name: 'Japanese Yen' },
  { code: 'AUD', symbol: 'A$', name: 'Australian Dollar' },
  { code: 'CAD', symbol: 'C$', name: 'Canadian Dollar' },
  { code: 'AED', symbol: 'DH', name: 'UAE Dirham' },
  { code: 'SAR', symbol: 'SR', name: 'Saudi Riyal' },
];

export const getIcon = (iconName: string, size = 20) => {
  switch (iconName) {
    case 'Utensils': return <Utensils size={size} />;
    case 'Bus': return <Bus size={size} />;
    case 'ShoppingBag': return <ShoppingBag size={size} />;
    case 'GraduationCap': return <GraduationCap size={size} />;
    case 'Heart': return <Heart size={size} />;
    case 'Gamepad2': return <Gamepad2 size={size} />;
    case 'Home': return <Home size={size} />;
    case 'Briefcase': return <Briefcase size={size} />;
    case 'Coffee': return <Coffee size={size} />;
    case 'Zap': return <Zap size={size} />;
    case 'Car': return <Car size={size} />;
    case 'Plane': return <Plane size={size} />;
    case 'Gift': return <Gift size={size} />;
    case 'Plus': return <Plus size={size} />;
    case 'Coins': return <Coins size={size} />;
    case 'Banknote': return <Banknote size={size} />;
    case 'TrendingUp': return <TrendingUp size={size} />;
    case 'Wallet': return <Wallet size={size} />;
    case 'Award': return <Award size={size} />;
    case 'Gem': return <Gem size={size} />;
    case 'Landmark': return <Landmark size={size} />;
    default: return <ShoppingBag size={size} />;
  }
};

/**
 * Formats large numbers into a short, readable string (k, M, B, T).
 */
export const formatCompactNumber = (number: number, symbol: string = ''): string => {
  const absNum = Math.abs(number);
  const sign = number < 0 ? '-' : '';
  let result = '';

  if (absNum >= 1.0e+12) {
    result = (absNum / 1.0e+12).toFixed(1).replace(/\.0$/, '') + 'T';
  } else if (absNum >= 1.0e+9) {
    result = (absNum / 1.0e+9).toFixed(1).replace(/\.0$/, '') + 'B';
  } else if (absNum >= 1.0e+6) {
    result = (absNum / 1.0e+6).toFixed(1).replace(/\.0$/, '') + 'M';
  } else if (absNum >= 1.0e+3) {
    result = (absNum / 1.0e+3).toFixed(1).replace(/\.0$/, '') + 'k';
  } else {
    result = absNum.toLocaleString(undefined, { maximumFractionDigits: 1 });
  }

  return `${sign}${symbol}${result}`;
};
