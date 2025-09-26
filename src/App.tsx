@@ .. @@
 import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
 import { Layout } from './components/layout/Layout';
+import { Toast } from './components/ui/Toast';
 import { useAuth } from './hooks/useAuth';
@@ .. @@
       ) : (
         <Auth />
       )}
+      <Toast />
     </Router>
   );
 }