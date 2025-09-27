@@ .. @@
-import { createClient } from '@supabase/supabase-js';
+import { createClient } from '@supabase/supabase-js'
+import { Database } from '../types/database'

-const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
-const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';
+const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
+const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

-export const supabase = createClient(supabaseUrl, supabaseAnonKey);
+if (!supabaseUrl || !supabaseAnonKey) {
+  console.warn('Supabase credentials not found. Please set up your environment variables.')
+}
+
+export const supabase = createClient<Database>(
+  supabaseUrl || 'https://placeholder.supabase.co',
+  supabaseAnonKey || 'placeholder-key'
+)
+
+// Test connection function
+export const testSupabaseConnection = async () => {
+  try {
+    const { data, error } = await supabase.from('profiles').select('count').limit(1)
+    if (error) throw error
+    return { success: true, message: 'Supabase connection successful' }
+  } catch (error) {
+    return { success: false, message: `Connection failed: ${error.message}` }
+  }
+}