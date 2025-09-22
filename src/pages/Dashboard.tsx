@@ .. @@
 import React from 'react';
-import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';
-import { DollarSign, Users, CreditCard, TrendingUp, ArrowUpRight, ArrowDownRight } from 'lucide-react';
+import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';
+import { DollarSign, Users, CreditCard, TrendingUp, ArrowUpRight, ArrowDownRight } from 'lucide-react';
+import { useOptimizedData } from '../hooks/useOptimizedData';
+import { DashboardSkeleton } from '../components/ui/SkeletonLoader';
 import { StatCard } from '../components/ui/StatCard';
@@ .. @@
 ];
 
 export const Dashboard: React.FC = () => {
+  const { data: customers, loading: customersLoading } = useOptimizedData({
+    table: 'customers',
+    select: 'id, total_revenue, created_at',
+    limit: 1000
+  });
+
+  const { data: subscriptions, loading: subscriptionsLoading } = useOptimizedData({
+    table: 'subscriptions',
+    select: 'id, status, amount, created_at',
+    limit: 1000
+  });
+
+  const loading = customersLoading || subscriptionsLoading;
+
+  if (loading) {
+    return <DashboardSkeleton />;
+  }
+
+  // Calculate real metrics from data
+  const totalRevenue = subscriptions.reduce((sum, sub) => sum + (sub.amount || 0), 0);
+  const totalCustomers = customers.length;
+  const activeSubscriptions = subscriptions.filter(sub => sub.status === 'active').length;
+  const monthlyGrowth = 12.5; // This would be calculated from historical data
+
   return (
     <div className="space-y-6">
       <div>
@@ .. @@
       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
         <StatCard
           title="Total Revenue"
-          value="$45,231"
+          value={`$${totalRevenue.toLocaleString()}`}
           change="+20.1%"
           changeType="positive"
           icon={DollarSign}
@@ .. @@
         />
         <StatCard
           title="Active Customers"
-          value="1,234"
+          value={totalCustomers.toLocaleString()}
           change="+15.3%"
           changeType="positive"
           icon={Users}
@@ .. @@
         />
         <StatCard
           title="Active Subscriptions"
-          value="892"
+          value={activeSubscriptions.toLocaleString()}
           change="+12.5%"
           changeType="positive"
           icon={CreditCard}
@@ .. @@
         />
         <StatCard
           title="Monthly Growth"
-          value="12.5%"
+          value={`${monthlyGrowth}%`}
           change="+2.4%"
           changeType="positive"
           icon={TrendingUp}
@@ .. @@
       </div>

       {/* Charts */}
-      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
+      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 animate-fadeIn">
         <div className="bg-white p-6 rounded-lg shadow-sm border">
           <h3 className="text-lg font-semibold text-gray-900 mb-4">Revenue Trend</h3>
-          <ResponsiveContainer width="100%" height={300}>
+          <div className="h-80">
+            <ResponsiveContainer width="100%" height="100%">
             <LineChart data={revenueData}>
               <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
               <XAxis dataKey="month" stroke="#6b7280" />
@@ .. @@
               <Line type="monotone" dataKey="revenue" stroke="#3b82f6" strokeWidth={3} dot={{ fill: '#3b82f6', strokeWidth: 2, r: 4 }} />
             </LineChart>
           </ResponsiveContainer>
+          </div>
         </div>

         <div className="bg-white p-6 rounded-lg shadow-sm border">
           <h3 className="text-lg font-semibold text-gray-900 mb-4">Customer Growth</h3>
-          <ResponsiveContainer width="100%" height={300}>
+          <div className="h-80">
+            <ResponsiveContainer width="100%" height="100%">
             <BarChart data={customerData}>
               <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
               <XAxis dataKey="month" stroke="#6b7280" />
@@ .. @@
               <Bar dataKey="customers" fill="#10b981" radius={[4, 4, 0, 0]} />
             </BarChart>
           </ResponsiveContainer>
+          </div>
         </div>
       </div>

       {/* Additional Charts */}
-      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
+      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 animate-fadeIn" style={{ animationDelay: '0.2s' }}>
         <div className="bg-white p-6 rounded-lg shadow-sm border">
           <h3 className="text-lg font-semibold text-gray-900 mb-4">Subscription Distribution</h3>
-          <ResponsiveContainer width="100%" height={300}>
+          <div className="h-80">
+            <ResponsiveContainer width="100%" height="100%">
             <PieChart>
               <Pie
                 data={subscriptionData}
@@ .. @@
               <Tooltip />
             </PieChart>
           </ResponsiveContainer>
+          </div>
         </div>

         <div className="bg-white p-6 rounded-lg shadow-sm border">
@@ .. @@
             </div>
           </div>
         </div>
       </div>
     </div>
   );
 };