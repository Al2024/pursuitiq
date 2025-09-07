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
    <div className="min-h-screen bg-gray-50">
      {/* Top Bar */}
      <header className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <h1 className="text-2xl font-bold text-gray-900">PursuitIQ</h1>
            {currentProject && (
              <div className="flex items-center space-x-2">
                <span className="text-gray-500">|</span>
                <span className="text-lg font-medium text-gray-700">{currentProject}</span>
              </div>
            )}
          </div>
          <div className="flex items-center space-x-4">
            <span className="text-sm text-gray-600">Welcome, Bid Manager</span>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside className="w-64 bg-white border-r border-gray-200 min-h-[calc(100vh-73px)]">
          <nav className="p-4">
            <ul className="space-y-2">
              {navigation.map((item) => {
                const Icon = item.icon;
                return (
                  <li key={item.id}>
                    <button
                      onClick={() => setActiveTab(item.id)}
                      className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-colors ${
                        activeTab === item.id
                          ? 'bg-blue-50 text-blue-700 border border-blue-200'
                          : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                      <span className="font-medium">{item.label}</span>
                    </button>
                  </li>
                );
              })}
            </ul>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6">
          {renderActiveScreen()}
        </main>
      </div>
    </div>
  );
}
