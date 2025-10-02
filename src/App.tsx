import React, { useState, useEffect, Suspense, lazy } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Layout from './components/layout/Layout';
import { useAuth } from './hooks/useAuth';
import { supabase } from './lib/supabase';
import LoadingSpinner from './components/ui/LoadingSpinner';

// Lazy load pages for better performance
const Dashboard = lazy(() => import('./pages/Dashboard'));
const Customers = lazy(() => import('./pages/Customers'));
const Invoices = lazy(() => import('./pages/Invoices'));

// Optimized loading component
const PageLoader = () => (
  <div className="min-h-screen bg-gray-50 flex items-center justify-center">
    <div className="text-center">
      <LoadingSpinner size="lg" />
      <p className="mt-4 text-gray-600">Loading...</p>
    </div>
  </div>
);

function App() {
  const { user, loading } = useAuth();
  const [isInitialized, setIsInitialized] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState('connecting');

  useEffect(() => {
    // Initialize the app
    const initializeApp = async () => {
      try {
        setConnectionStatus('connecting');
        // Check Supabase connection
        const { data, error } = await supabase.from('profiles').select('count').limit(1);
        setConnectionStatus(error ? 'offline' : 'online');
      } catch (error) {
        setConnectionStatus('offline');
      } finally {
        setIsInitialized(true);
      }
    };

    initializeApp();
  }, []);

  if (loading || !isInitialized) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center animate-fadeIn">
          <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full flex items-center justify-center mb-4 mx-auto">
            <div className="w-8 h-8 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
          </div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">QuillBill</h2>
          <p className="text-gray-600">Initializing your billing platform...</p>
          <div className="mt-4 flex items-center justify-center gap-2">
            <div className={`w-2 h-2 rounded-full ${connectionStatus === 'online' ? 'bg-green-500' : connectionStatus === 'offline' ? 'bg-red-500' : 'bg-yellow-500 animate-pulse'}`}></div>
            <span className="text-sm text-gray-500 capitalize">{connectionStatus}</span>
          </div>
        </div>
      </div>
    <div className="min-h-screen bg-gray-50">
      <Toaster 
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: {
            background: '#363636',
            color: '#fff',
            borderRadius: '8px',
            fontSize: '14px',
          },
          success: {
            style: { background: '#10b981' },
          },
          error: {
            style: { background: '#ef4444' },
          },
        }}
      />
      
      {user ? (
        <Layout>
          <Suspense fallback={<PageLoader />}>
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/customers" element={<Customers />} />
              <Route path="/invoices" element={<Invoices />} />
              <Route path="/analytics" element={<Analytics />} />
              <Route path="*" element={<Navigate to="/dashboard" replace />} />
            </Routes>
          </Suspense>
        </Layout>
      ) : (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center">
          <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full mx-4 animate-scaleIn">
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-white font-bold text-xl">QB</span>
              </div>
              <h1 className="text-2xl font-bold text-gray-900">Welcome to QuillBill</h1>
              <p className="text-gray-600 mt-2">Your complete SaaS billing platform</p>
            </div>
            <div className="space-y-4">
              <button 
                onClick={handleDemoLogin}
                className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors font-medium"
              >
                Start Demo
              </button>
              <p className="text-center text-sm text-gray-500">
                Demo mode - All features available
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;