@@ .. @@
 import React from 'react';
+import { cn } from '../../lib/utils';

-interface LoadingSpinnerProps {
-  size?: 'sm' | 'md' | 'lg';
-}
+interface LoadingSpinnerProps {
+  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
+  className?: string;
+  color?: 'blue' | 'white' | 'gray';
+}

-export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ size = 'md' }) => {
-  const sizeClasses = {
-    sm: 'w-4 h-4',
-    md: 'w-6 h-6',
-    lg: 'w-8 h-8'
+export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ 
+  size = 'md', 
+  className,
+  color = 'blue'
+}) => {
+  const sizeClasses = {
+    xs: 'w-3 h-3',
+    sm: 'w-4 h-4',
+    md: 'w-6 h-6',
+    lg: 'w-8 h-8',
+    xl: 'w-12 h-12'
+  };
+
+  const colorClasses = {
+    blue: 'border-blue-600 border-t-transparent',
+    white: 'border-white border-t-transparent',
+    gray: 'border-gray-400 border-t-transparent'
   };

   return (
-    <div className={`${sizeClasses[size]} border-2 border-blue-600 border-t-transparent rounded-full animate-spin`} />
+    <div 
+      className={cn(
+        'border-2 rounded-full animate-spin',
+        sizeClasses[size],
+        colorClasses[color],
+        className
+      )}
+      role="status"
+      aria-label="Loading"
+    />
   );
 };