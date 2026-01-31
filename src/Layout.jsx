import React from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from './utils';
import { LayoutDashboard, BarChart3, TrendingUp, Calculator } from 'lucide-react';

export default function Layout({ children, currentPageName }) {
  const navItems = [
    { name: 'MarketOverview', label: '市场总览', icon: LayoutDashboard },
    { name: 'StockCategories', label: '股票分类', icon: BarChart3 },
    { name: 'StockFormulas', label: '股票公式', icon: Calculator },
    { name: 'AIAnalysis', label: 'AI智能分析', icon: TrendingUp },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <style>{`
        :root {
          --primary: #10b981;
          --primary-dark: #059669;
          --accent: #3b82f6;
          --bg-dark: #0f172a;
          --bg-card: #1e293b;
          --text-primary: #f1f5f9;
          --text-secondary: #94a3b8;
          --border: #334155;
        }
      `}</style>

      {/* Header */}
      <header className="bg-slate-900/80 backdrop-blur-lg border-b border-slate-700/50 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-xl font-bold text-white">股票数据中心</h1>
            </div>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar Navigation */}
        <nav className="w-64 bg-slate-900/50 backdrop-blur-sm border-r border-slate-700/50 min-h-[calc(100vh-4rem)] p-4">
          <div className="space-y-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentPageName === item.name;
              return (
                <Link
                  key={item.name}
                  to={createPageUrl(item.name)}
                  className={`flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                    isActive
                      ? 'bg-gradient-to-r from-emerald-500/20 to-emerald-600/20 text-emerald-400 border border-emerald-500/30'
                      : 'text-slate-400 hover:bg-slate-800/50 hover:text-white'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="font-medium">{item.label}</span>
                </Link>
              );
            })}
          </div>
        </nav>

        {/* Main Content */}
        <main className="flex-1 p-6">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}