import React from 'react';
import { Bell, Settings, User, HelpCircle } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { ConnectionStatus } from '../ConnectionStatus';

interface HeaderProps {
  onOpenSetupGuide: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onOpenSetupGuide }) => {
  const { user, signOut } = useAuth();

  return (
    <header className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <h2 className="text-lg font-semibold text-gray-900">QuillBill</h2>
          <ConnectionStatus />
        </div>

        <div className="flex items-center space-x-4">
          <button
            onClick={onOpenSetupGuide}
            className="flex items-center gap-2 px-3 py-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <HelpCircle className="w-4 h-4" />
            Setup Guide
          </button>

          <button className="relative p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors">
            <Bell className="w-5 h-5" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
          </button>

          <button className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors">
            <Settings className="w-5 h-5" />
          </button>

          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-medium text-sm">
              <User className="w-4 h-4" />
            </div>
            <div className="hidden md:block">
              <div className="text-sm font-medium text-gray-900">
                {user?.email || 'Demo User'}
              </div>
              <button
                onClick={signOut}
                className="text-xs text-gray-500 hover:text-gray-700"
              >
                Sign out
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};