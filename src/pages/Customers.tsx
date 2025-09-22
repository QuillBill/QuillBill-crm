@@ .. @@
 import React from 'react';
-import { Search, Plus, Mail, Phone, Calendar, DollarSign } from 'lucide-react';
+import { Plus, Mail, Phone, Calendar, DollarSign } from 'lucide-react';
+import { useOptimizedData } from '../hooks/useOptimizedData';
+import { OptimizedTable } from '../components/ui/OptimizedTable';
 import { StatusBadge } from '../components/ui/StatusBadge';
+import { Customer } from '../types';

-const customers = [
-  {
-    id: 1,
-    name: 'John Doe',
-    email: 'john@example.com',
-    phone: '+1 (555) 123-4567',
-    status: 'active',
-    totalRevenue: 2450,
-    subscriptions: 2,
-    joinDate: '2024-01-15'
-  },
-  {
-    id: 2,
-    name: 'Jane Smith',
-    email: 'jane@example.com',
-    phone: '+1 (555) 987-6543',
-    status: 'active',
-    totalRevenue: 1890,
-    subscriptions: 1,
-    joinDate: '2024-02-20'
-  },
-  {
-    id: 3,
-    name: 'Bob Johnson',
-    email: 'bob@example.com',
-    phone: '+1 (555) 456-7890',
-    status: 'inactive',
-    totalRevenue: 750,
-    subscriptions: 0,
-    joinDate: '2024-01-08'
-  },
-  {
-    id: 4,
-    name: 'Alice Brown',
-    email: 'alice@example.com',
-    phone: '+1 (555) 321-0987',
-    status: 'active',
-    totalRevenue: 3200,
-    subscriptions: 3,
-    joinDate: '2023-12-10'
-  }
-];
+const columns = [
+  {
+    key: 'name' as keyof Customer,
+    label: 'Customer',
+    sortable: true,
+    render: (value: string, customer: Customer) => (
+      <div className="flex items-center space-x-3">
+        <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-medium text-sm">
+          {value.charAt(0).toUpperCase()}
+        </div>
+        <div>
+          <div className="font-medium text-gray-900">{value}</div>
+          <div className="text-sm text-gray-500 flex items-center">
+            <Mail className="w-3 h-3 mr-1" />
+            {customer.email}
+          </div>
+        </div>
+      </div>
+    )
+  },
+  {
+    key: 'phone' as keyof Customer,
+    label: 'Contact',
+    render: (value: string) => (
+      <div className="flex items-center text-sm text-gray-600">
+        <Phone className="w-3 h-3 mr-1" />
+        {value}
+      </div>
+    )
+  },
+  {
+    key: 'status' as keyof Customer,
+    label: 'Status',
+    sortable: true,
+    render: (value: string) => <StatusBadge status={value} />
+  },
+  {
+    key: 'total_revenue' as keyof Customer,
+    label: 'Total Revenue',
+    sortable: true,
+    render: (value: number) => (
+      <div className="flex items-center font-medium text-gray-900">
+        <DollarSign className="w-4 h-4 mr-1 text-green-600" />
+        ${value?.toLocaleString() || '0'}
+      </div>
+    )
+  },
+  {
+    key: 'subscriptions' as keyof Customer,
+    label: 'Subscriptions',
+    sortable: true,
+    render: (value: number) => (
+      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
+        {value || 0} active
+      </span>
+    )
+  },
+  {
+    key: 'created_at' as keyof Customer,
+    label: 'Join Date',
+    sortable: true,
+    render: (value: string) => (
+      <div className="flex items-center text-sm text-gray-600">
+        <Calendar className="w-3 h-3 mr-1" />
+        {new Date(value).toLocaleDateString()}
+      </div>
+    )
+  }
+];

 export const Customers: React.FC = () => {
+  const { data: customers, loading, error, refetch } = useOptimizedData<Customer>({
+    table: 'customers',
+    orderBy: { column: 'created_at', ascending: false },
+    enableRealtime: true
+  });
+
   return (
     <div className="space-y-6">
       <div className="flex justify-between items-center">
@@ .. @@
           <h1 className="text-2xl font-bold text-gray-900">Customers</h1>
           <p className="text-gray-600">Manage your customer base and track their activity</p>
         </div>
-        <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2">
+        <button 
+          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2 transition-all duration-200 hover:scale-105 active:scale-95"
+          onClick={() => {
+            // Add customer modal would open here
+            console.log('Add customer');
+          }}
+        >
           <Plus className="w-4 h-4" />
           Add Customer
         </button>
       </div>

-      <div className="bg-white rounded-lg shadow-sm border">
-        <div className="p-6 border-b border-gray-200">
-          <div className="flex items-center justify-between">
-            <h2 className="text-lg font-semibold text-gray-900">All Customers</h2>
-            <div className="relative">
-              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
-              <input
-                type="text"
-                placeholder="Search customers..."
-                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
-              />
-            </div>
-          </div>
-        </div>
-        
-        <div className="overflow-x-auto">
-          <table className="w-full">
-            <thead className="bg-gray-50">
-              <tr>
-                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
-                  Customer
-                </th>
-                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
-                  Contact
-                </th>
-                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
-                  Status
-                </th>
-                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
-                  Total Revenue
-                </th>
-                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
-                  Subscriptions
-                </th>
-                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
-                  Join Date
-                </th>
-              </tr>
-            </thead>
-            <tbody className="bg-white divide-y divide-gray-200">
-              {customers.map((customer) => (
-                <tr key={customer.id} className="hover:bg-gray-50">
-                  <td className="px-6 py-4 whitespace-nowrap">
-                    <div className="flex items-center">
-                      <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-medium">
-                        {customer.name.charAt(0)}
-                      </div>
-                      <div className="ml-4">
-                        <div className="text-sm font-medium text-gray-900">{customer.name}</div>
-                        <div className="text-sm text-gray-500 flex items-center">
-                          <Mail className="w-3 h-3 mr-1" />
-                          {customer.email}
-                        </div>
-                      </div>
-                    </div>
-                  </td>
-                  <td className="px-6 py-4 whitespace-nowrap">
-                    <div className="flex items-center text-sm text-gray-600">
-                      <Phone className="w-3 h-3 mr-1" />
-                      {customer.phone}
-                    </div>
-                  </td>
-                  <td className="px-6 py-4 whitespace-nowrap">
-                    <StatusBadge status={customer.status} />
-                  </td>
-                  <td className="px-6 py-4 whitespace-nowrap">
-                    <div className="flex items-center text-sm font-medium text-gray-900">
-                      <DollarSign className="w-4 h-4 mr-1 text-green-600" />
-                      ${customer.totalRevenue.toLocaleString()}
-                    </div>
-                  </td>
-                  <td className="px-6 py-4 whitespace-nowrap">
-                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
-                      {customer.subscriptions} active
-                    </span>
-                  </td>
-                  <td className="px-6 py-4 whitespace-nowrap">
-                    <div className="flex items-center text-sm text-gray-600">
-                      <Calendar className="w-3 h-3 mr-1" />
-                      {new Date(customer.joinDate).toLocaleDateString()}
-                    </div>
-                  </td>
-                </tr>
-              ))}
-            </tbody>
-          </table>
-        </div>
-      </div>
+      {error && (
+        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
+          <p className="text-red-800">Error loading customers: {error}</p>
+          <button 
+            onClick={refetch}
+            className="mt-2 text-red-600 hover:text-red-800 underline"
+          >
+            Try again
+          </button>
+        </div>
+      )}
+
+      <OptimizedTable
+        data={customers}
+        columns={columns}
+        loading={loading}
+        searchable={true}
+        filterable={true}
+        pageSize={15}
+        className="animate-fadeIn"
+      />
     </div>
   );
 };