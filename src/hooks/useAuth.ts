 import { useState, useEffect } from 'react';
 import { User } from '@supabase/supabase-js';
 import { supabase } from '../lib/supabase';
import toast from 'react-hot-toast';

 export const useAuth = () => {
   const [user, setUser] = useState<User | null>(null);
   const [loading, setLoading] = useState(true);

   useEffect(() => {
     // Get initial session
     supabase.auth.getSession().then(({ data: { session } }) => {
       setUser(session?.user ?? null);
       setLoading(false);
     });

     // Listen for auth changes
     const { data: { subscription } } = supabase.auth.onAuthStateChange(
       async (event, session) => {
         setUser(session?.user ?? null);
         setLoading(false);
+        
+        if (event === 'SIGNED_IN') {
+          toast.success('Successfully signed in!');
+        } else if (event === 'SIGNED_OUT') {
+          toast.success('Successfully signed out!');
+        }
       }
     );

     return () => subscription.unsubscribe();
   }, []);

   const signIn = async (email: string, password: string) => {
+    try {
       const { error } = await supabase.auth.signInWithPassword({
         email,
         password,
       });
-      return { error };
+      
+      if (error) {
+        toast.error(error.message);
+        return { error };
+      }
+      
+      return { error: null };
+    } catch (error) {
+      toast.error('An unexpected error occurred');
+      return { error };
+    }
   };

   const signUp = async (email: string, password: string, fullName: string) => {
+    try {
       const { error } = await supabase.auth.signUp({
         email,
         password,
         options: {
           data: {
             full_name: fullName,
           },
         },
       });
-      return { error };
+      
+      if (error) {
+        toast.error(error.message);
+        return { error };
+      }
+      
+      toast.success('Account created! Please check your email to verify.');
+      return { error: null };
+    } catch (error) {
+      toast.error('An unexpected error occurred');
+      return { error };
+    }
   };

   const signOut = async () => {
+    try {
       const { error } = await supabase.auth.signOut();
-      return { error };
+      
+      if (error) {
+        toast.error(error.message);
+        return { error };
+      }
+      
+      return { error: null };
+    } catch (error) {
+      toast.error('An unexpected error occurred');
+      return { error };
+    }
   };

   return {
     user,
     loading,
     signIn,
     signUp,
     signOut,
   };
 };