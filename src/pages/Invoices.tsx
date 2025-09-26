@@ .. @@
 import React, { useState } from 'react';
-import { Plus, Send, Download, Eye, MoreHorizontal, DollarSign, Calendar, User } from 'lucide-react';
+import { Plus, Send, Download, Eye, MoreHorizontal, DollarSign, Calendar, User, FileText } from 'lucide-react';
 import { useOptimizedData } from '../hooks/useOptimizedData';
 import { OptimizedTable } from '../components/ui/OptimizedTable';
 import { StatusBadge } from '../components/ui/StatusBadge';
+import { CreateInvoiceModal } from '../components/modals/CreateInvoiceModal';
+import { invoiceService } from '../services/invoiceService';
+import { emailService } from '../services/emailService';
 import { Invoice } from '../types';
+import toast from 'react-hot-toast';

 const columns = [
@@ .. @@
 export const Invoices: React.FC = () => {
   const { data: invoices, loading, error, refetch } = useOptimizedData<Invoice>({
     table: 'invoices',
-    orderBy: { column: 'created_at', ascending: false },
+    select: `
+      *,
+      customers (name, email, company)
+    `,
+    orderBy: { column: 'created_at', ascending: false },
     enableRealtime: true
   });
+  
+  const [showCreateModal, setShowCreateModal] = useState(false);
+  const [actionLoading, setActionLoading] = useState<string | null>(null);
+
+  const handleSendInvoice = async (invoice: Invoice) => {
+    setActionLoading(`send-${invoice.id}`);
+    try {
+      await emailService.sendInvoice(invoice.id);
+      toast.success('Invoice sent successfully!');
+      refetch();
+    } catch (error) {
+      toast.error('Failed to send invoice');
+    } finally {
+      setActionLoading(null);
+    }
+  };
+
+  const handleDownloadPDF = async (invoice: Invoice) => {
+    setActionLoading(`download-${invoice.id}`);
+    try {
+      const pdfBlob = await invoiceService.generateInvoicePDF(invoice.id);
+      const url = URL.createObjectURL(pdfBlob);
+      const a = document.createElement('a');
+      a.href = url;
+      a.download = `invoice-${invoice.invoice_number}.pdf`;
+      document.body.appendChild(a);
+      a.click();
+      document.body.removeChild(a);
+      URL.revokeObjectURL(url);
+      toast.success('Invoice downloaded successfully!');
+    } catch (error) {
+      toast.error('Failed to download invoice');
+    } finally {
+      setActionLoading(null);
+    }
+  };
+
+  const handleMarkAsPaid = async (invoice: Invoice) => {
+    setActionLoading(`paid-${invoice.id}`);
+    try {
+      await invoiceService.markAsPaid(invoice.id, invoice.total_amount);
+      toast.success('Invoice marked as paid!');
+      refetch();
+    } catch (error) {
+      toast.error('Failed to mark invoice as paid');
+    } finally {
+      setActionLoading(null);
+    }
+  };

   // Update the actions column render function
   const updatedColumns = columns.map(column => {
@@ .. @@
       return {
         ...column,
         render: (value: any, invoice: Invoice) => (
           <div className="flex items-center space-x-2">
-            <button className="p-1 text-blue-600 hover:text-blue-800 transition-colors">
+            <button 
+              onClick={() => handleSendInvoice(invoice)}
+              disabled={actionLoading === `send-${invoice.id}` || invoice.status === 'paid'}
+              className="p-1 text-blue-600 hover:text-blue-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
+              title="Send Invoice"
+            >
               <Send className="w-4 h-4" />
             </button>
-            <button className="p-1 text-green-600 hover:text-green-800 transition-colors">
+            <button 
+              onClick={() => handleDownloadPDF(invoice)}
+              disabled={actionLoading === `download-${invoice.id}`}
+              className="p-1 text-green-600 hover:text-green-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
+              title="Download PDF"
+            >
               <Download className="w-4 h-4" />
             </button>
-            <button className="p-1 text-gray-600 hover:text-gray-800 transition-colors">
+            <button 
+              className="p-1 text-gray-600 hover:text-gray-800 transition-colors"
+              title="View Invoice"
+            >
               <Eye className="w-4 h-4" />
             </button>
+            {invoice.status !== 'paid' && (
+              <button 
+                onClick={() => handleMarkAsPaid(invoice)}
+                disabled={actionLoading === `paid-${invoice.id}`}
+                className="p-1 text-purple-600 hover:text-purple-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
+                title="Mark as Paid"
+              >
+                <DollarSign className="w-4 h-4" />
+              </button>
+            )}
             <button className="p-1 text-gray-600 hover:text-gray-800 transition-colors">
               <MoreHorizontal className="w-4 h-4" />
             </button>
@@ .. @@
         <button 
           className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2 transition-all duration-200 hover:scale-105 active:scale-95"
-          onClick={() => {
-            // Add invoice modal would open here
-            console.log('Create invoice');
-          }}
+          onClick={() => setShowCreateModal(true)}
         >
           <Plus className="w-4 h-4" />
           Create Invoice
@@ .. @@
         className="animate-fadeIn"
       />
+
+      <CreateInvoiceModal
+        isOpen={showCreateModal}
+        onClose={() => setShowCreateModal(false)}
+        onSuccess={refetch}
+      />
     </div>
   );
 };