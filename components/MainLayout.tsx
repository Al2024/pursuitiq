'use client';

import { useState } from 'react';
import { FileText, FolderOpen, BarChart3, Settings, Plus } from 'lucide-react';
import NewProjectScreen from './NewProjectScreen';
import ProjectListScreen from './ProjectListScreen';
import DashboardScreen from './DashboardScreen';
import SettingsScreen from './SettingsScreen';

interface MainLayoutProps {
  children?: React.ReactNode;
  currentProject?: string;
}

export default function MainLayout({ children, currentProject }: MainLayoutProps) {
  const [activeTab, setActiveTab] = useState('new-project');

  const navigation = [
    { id: 'new-project', label: 'New Project', icon: Plus },
    { id: 'project-list', label: 'Project List', icon: FolderOpen },
    { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  const renderActiveScreen = () => {
    switch (activeTab) {
      case 'new-project':
        return <NewProjectScreen />;
      case 'project-list':
        return <ProjectListScreen />;
      case 'dashboard':
        return <DashboardScreen />;
      case 'settings':
        return <SettingsScreen />;
      default:
        return <NewProjectScreen />;
    }
  };

  return (
    <div className="min-h-screen bg-dark-950 text-slate-100 relative overflow-hidden">
      <div className="absolute inset-0 bg-grid opacity-30" />
      <div className="absolute -top-32 left-24 h-[520px] w-[520px] rounded-full bg-brand-500/20 blur-[180px]" />
      <div className="absolute -bottom-48 right-[-140px] h-[560px] w-[560px] rounded-full bg-pink-500/15 blur-[200px]" />

      {/* Top Bar */}
      <header className="relative z-20 bg-slate-950/80 backdrop-blur border-b border-slate-800 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <h1 className="text-2xl font-black tracking-tight text-white">PursuitIQ</h1>
            {currentProject && (
              <div className="flex items-center space-x-2">
                <span className="text-slate-500">|</span>
                <span className="text-lg font-medium text-slate-300">{currentProject}</span>
              </div>
            )}
          </div>
          <div className="flex items-center space-x-4 text-sm text-slate-400">
            <span>Welcome, Bid Manager</span>
          </div>
        </div>
      </header>

      <div className="flex relative z-10">
        {/* Sidebar */}
        <aside className="w-72 bg-slate-950/70 backdrop-blur border-r border-slate-800 min-h-[calc(100vh-73px)]">
          <nav className="p-5">
            <ul className="space-y-2">
              {navigation.map((item) => {
                const Icon = item.icon;
                return (
                  <li key={item.id}>
                    <button
                      onClick={() => setActiveTab(item.id)}
                      className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-left transition-all ${
                        activeTab === item.id
                          ? 'bg-brand-500/15 text-brand-200 border border-brand-500/30 shadow-lg shadow-brand-500/10'
                          : 'text-slate-300 hover:bg-slate-900/70 hover:text-white'
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                      <span className="font-medium uppercase tracking-[0.1em] text-xs">{item.label}</span>
                    </button>
                  </li>
                );
              })}
            </ul>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6 md:p-10">
          {renderActiveScreen()}
        </main>
      </div>
    </div>
  );
}
