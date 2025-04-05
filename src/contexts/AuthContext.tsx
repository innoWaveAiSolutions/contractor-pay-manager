
import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { User } from '@supabase/supabase-js';
import { toast } from 'sonner';

// Define the role types
export type UserRole = 'contractor' | 'pm' | 'reviewer' | 'director';

// Define the shape of the user object
interface AppUser {
  id: string;
  email: string;
  name?: string;
  role?: UserRole;
  organizationId?: number;
  organizationName?: string;
  needsOnboarding?: boolean;
  hasCompletedTutorial?: boolean;
}

interface AuthContextType {
  user: AppUser | null;
  loading: boolean;
  isAuthenticated: boolean;
  isLoading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signUp: (email: string, password: string, userData: any) => Promise<{ error: any }>;
  signOut: () => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  register: (name: string, email: string, password: string, role: UserRole, organizationName?: string) => Promise<void>;
  resetPassword: (email: string) => Promise<{ error: any }>;
  markTutorialComplete: () => Promise<void>;
  completeDirectorOnboarding: (data: any) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AppUser | null>(null);
  const [loading, setLoading] = useState(true);

  // Process the Supabase user into our AppUser format
  const processUser = (authUser: User): AppUser => {
    // Extract user metadata (which comes from the JWT)
    const metadata = authUser.user_metadata || {};
    
    return {
      id: authUser.id,
      email: authUser.email || '',
      name: `${metadata.first_name || ''} ${metadata.last_name || ''}`.trim() || authUser.email,
      role: metadata.role || 'contractor',
      // These fields might not be available in metadata depending on your setup
      organizationId: metadata.organization_id,
      organizationName: metadata.organization_name,
      needsOnboarding: metadata.needs_onboarding,
      hasCompletedTutorial: metadata.has_completed_tutorial
    };
  };

  useEffect(() => {
    // Get initial session
    const getInitialSession = async () => {
      try {
        setLoading(true);
        
        const { data: { session } } = await supabase.auth.getSession();
        
        if (session?.user) {
          setUser(processUser(session.user));
        } else {
          setUser(null);
        }
      } catch (error) {
        console.error('Error getting initial session:', error);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    getInitialSession();

    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state changed:', event, session?.user?.email);
        if (session?.user) {
          setUser(processUser(session.user));
        } else {
          setUser(null);
        }
        setLoading(false);
      }
    );

    // Clean up subscription
    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // Sign in function
  const signIn = async (email: string, password: string) => {
    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
      return { error: null };
    } catch (error) {
      console.error('Login failed:', error);
      toast.error(error.message || 'Failed to sign in');
      return { error };
    }
  };

  // Login function (alias for signIn for backward compatibility)
  const login = async (email: string, password: string) => {
    const { error } = await signIn(email, password);
    if (error) throw error;
  };

  // Sign up function
  const signUp = async (email: string, password: string, userData: any) => {
    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            first_name: userData.firstName,
            last_name: userData.lastName,
            role: userData.role || 'contractor',
          }
        }
      });
      
      if (error) throw error;
      
      // Show success message
      toast.success('Account created successfully! Please check your email to verify your account.');
      return { error: null };
    } catch (error) {
      console.error('Registration failed:', error);
      toast.error(error.message || 'Failed to create account');
      return { error };
    }
  };

  // Register function (alias for signUp for backward compatibility)
  const register = async (name: string, email: string, password: string, role: UserRole, organizationName?: string) => {
    const nameParts = name.split(' ');
    const firstName = nameParts[0] || '';
    const lastName = nameParts.slice(1).join(' ') || '';
    
    const userData = {
      firstName,
      lastName,
      role,
      organizationName
    };
    
    const { error } = await signUp(email, password, userData);
    if (error) throw error;
  };

  // Sign out function
  const signOut = async () => {
    try {
      await supabase.auth.signOut();
      toast.success('Signed out successfully');
    } catch (error) {
      console.error('Sign out failed:', error);
      toast.error('Failed to sign out');
    }
  };

  // Logout function (alias for signOut for backward compatibility)
  const logout = async () => {
    await signOut();
  };

  // Reset password function
  const resetPassword = async (email: string) => {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });
      
      if (error) throw error;
      
      toast.success('Password reset link sent to your email');
      return { error: null };
    } catch (error) {
      console.error('Password reset failed:', error);
      toast.error(error.message || 'Failed to send password reset link');
      return { error };
    }
  };

  // Mark tutorial as complete
  const markTutorialComplete = async () => {
    if (!user) return;
    
    try {
      const { error } = await supabase.auth.updateUser({
        data: { has_completed_tutorial: true }
      });
      
      if (error) throw error;
      
      // Update local user state
      setUser(prev => prev ? { ...prev, hasCompletedTutorial: true } : null);
      
    } catch (error) {
      console.error('Failed to mark tutorial as complete:', error);
      toast.error('Failed to update profile');
    }
  };

  // Complete director onboarding
  const completeDirectorOnboarding = async (data: any) => {
    if (!user) return;
    
    try {
      const { error } = await supabase.auth.updateUser({
        data: { 
          needs_onboarding: false,
          ...data
        }
      });
      
      if (error) throw error;
      
      // Update local user state
      setUser(prev => prev ? { ...prev, needsOnboarding: false } : null);
      
      toast.success('Profile updated successfully');
    } catch (error) {
      console.error('Failed to complete onboarding:', error);
      toast.error('Failed to update profile');
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isAuthenticated: !!user,
        isLoading: loading,
        signIn,
        signUp,
        signOut,
        login,
        logout,
        register,
        resetPassword,
        markTutorialComplete,
        completeDirectorOnboarding,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
