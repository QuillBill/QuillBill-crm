import React, { useState } from 'react';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { SetupGuide } from '../SetupGuide';

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [showSetupGuide, setShowSetupGuide] = useState(false);

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header onOpenSetupGuide={() => setShowSetupGuide(true)} />
        <main className="flex-1 overflow-y-auto p-6">
          <div className="animate-fadeIn">
            {children}
          </div>
        </main>
      </div>
      <SetupGuide 
        isOpen={showSetupGuide} 
        onClose={() => setShowSetupGuide(false)} 
      />
    </div>
  );
};