import React from 'react';
import { useTheme } from '../context/ThemeContext';
import SeazoneLogo from './SeazoneLogo';
import { Trophy, Sliders, LineChart, Bot, Sun, Moon } from 'lucide-react';

export default function Header({ activeTab, setActiveTab }) {
  const { isDark, toggleTheme } = useTheme();

  const TABS = [
    { id: 'verdict', label: 'Duelo & Veredito', icon: Trophy, badge: 'Tese' },
    { id: 'simulator', label: 'Simulador & DRE', icon: Sliders, badge: 'Financeiro' },
    { id: 'charts', label: 'Curvas & Matriz', icon: LineChart, badge: 'Recharts' },
    { id: 'ai', label: 'AI Copilot & Dossiê', icon: Bot, badge: 'IA Quant' }
  ];

  return (
    <header className="border-b sticky top-0 z-50 transition-colors duration-200 backdrop-blur-md dark:border-[#0055FF]/20 dark:bg-[#00143D]/95 bg-white/95 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        
        {/* Brand & Logo */}
        <div className="flex items-center space-x-3.5">
          <div className="w-11 h-11 rounded-2xl dark:bg-[#00143D] bg-slate-50 p-2 border dark:border-[#0055FF]/40 border-slate-200 flex items-center justify-center shadow-md shadow-[#FC6058]/15 transition-transform hover:scale-105">
            <SeazoneLogo className="w-7 h-7" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="font-extrabold text-xl tracking-tight text-slate-900 dark:text-white">seazone</span>
              <span className="text-xs px-2.5 py-0.5 rounded-full font-mono font-bold dark:bg-[#0055FF]/25 dark:text-[#3377FF] dark:border-[#0055FF]/40 bg-blue-50 text-[#0055FF] border border-blue-200">
                EXECUTIVE OS
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 hidden sm:block">
              Plataforma de Decisão de Investimento Imobiliário • Itapema (SC)
            </p>
          </div>
        </div>

        {/* Right Section: Live Badge & Theme Toggle */}
        <div className="flex items-center space-x-3">
          <div className="hidden md:flex items-center space-x-2 px-3 py-1.5 rounded-xl border dark:bg-[#00143D]/90 dark:border-emerald-500/30 bg-emerald-50/80 border-emerald-200">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span className="text-xs font-mono font-medium text-emerald-700 dark:text-emerald-400">
              4.441 Airbnb | 8.329 VivaReal
            </span>
          </div>

          {/* Theme Toggle Button */}
          <button
            onClick={toggleTheme}
            aria-label="Alternar tema claro e escuro"
            className="p-2.5 rounded-xl border transition duration-200 flex items-center justify-center dark:bg-[#0A1530] dark:text-amber-400 dark:hover:bg-[#0E1E45] dark:border-[#0055FF]/30 bg-slate-100 text-slate-700 hover:bg-slate-200 border-slate-300 shadow-sm"
          >
            {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>
        </div>

      </div>

      {/* 4 Strategic Tabs Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 border-t dark:border-[#0055FF]/15 border-slate-200">
        <nav className="flex space-x-2 sm:space-x-3 overflow-x-auto py-2.5 no-scrollbar">
          {TABS.map(tab => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all duration-200 flex items-center space-x-2 ${
                  isActive
                    ? 'bg-[#0055FF] text-white shadow-lg shadow-[#0055FF]/30 ring-1 ring-[#0055FF]'
                    : 'dark:text-slate-300 dark:hover:bg-[#00143D] text-slate-600 hover:bg-slate-100 border border-transparent'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
