@@ .. @@
 import React from 'react';
-import { Bell, Settings, User, Search } from 'lucide-react';
+import { Bell, Settings, User, Search, HelpCircle } from 'lucide-react';
+import { ConnectionStatus } from '../ConnectionStatus';

-export const Header: React.FC = () => {
+interface HeaderProps {
+  onOpenSetupGuide: () => void;
+}
+
+export const Header: React.FC<HeaderProps> = ({ onOpenSetupGuide }) => {
   return (
     <header className="bg-white border-b border-gray-200 px-6 py-4">
       <div className="flex items-center justify-between">
@@ .. @@
         </div>

         <div className="flex items-center space-x-4">
+          <ConnectionStatus />
+          
+          <button
+            onClick={onOpenSetupGuide}
+            className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
+            title="Setup Guide"
+          >
+            <HelpCircle className="w-5 h-5" />
+          </button>
+          
           <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
             <Bell className="w-5 h-5" />
           </button>