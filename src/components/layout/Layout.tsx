@@ .. @@
 import React from 'react';
+import { Suspense } from 'react';
 import { Sidebar } from './Sidebar';
 import { Header } from './Header';
+import { LoadingSpinner } from '../ui/LoadingSpinner';

 interface LayoutProps {
   children: React.ReactNode;
@@ .. @@
 export const Layout: React.FC<LayoutProps> = ({ children }) => {
   return (
-    <div className="flex h-screen bg-gray-50">
+    <div className="flex h-screen bg-gray-50 overflow-hidden">
       <Sidebar />
-      <div className="flex-1 flex flex-col overflow-hidden">
+      <div className="flex-1 flex flex-col overflow-hidden animate-slideIn">
         <Header />
-        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50 p-6">
-          {children}
+        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50 p-6 scroll-smooth">
+          <Suspense fallback={
+            <div className="flex items-center justify-center h-64">
+              <LoadingSpinner size="lg" />
+            </div>
+          }>
+            <div className="animate-fadeIn">
+              {children}
+            </div>
+          </Suspense>
         </main>
       </div>
     </div>
   );
 };