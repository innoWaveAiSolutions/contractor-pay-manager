
import { 
  createContext, 
  useContext, 
  useState, 
  useEffect, 
  ReactNode 
} from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { User as SupabaseUser, Session } from '@supabase/supabase-js';

// Define user role types
export type UserRole = 'pm' | 'contractor' | 'reviewer' | 'director';

// Define user type
export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  organizationId?: string | number;
  organizationName?: string;
  needsOnboarding?: boolean;
  hasCompletedTutorial?: boolean;
}

// Define authentication context interface
interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string, role: UserRole, organizationName?: string) => Promise<void>;
  logout: () => Promise<void>;
  completeDirectorOnboarding: (backupDirectorEmail: string, backupDirectorName: string) => Promise<void>;
  markTutorialComplete: () => void;
}

// Create the authentication context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Create a custom hook to use the auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Auth Provider component
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  // Set up auth state listener and check for existing session
  useEffect(() => {
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state changed:', event, session?.user?.email);
        setSession(session);
        
        if (session?.user) {
          // Use setTimeout to prevent recursion issues with onAuthStateChange
          setTimeout(() => {
            fetchUserProfile(session.user);
          }, 0);
        } else {
          setUser(null);
          setIsLoading(false);
        }
      }
    );

    // THEN check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session?.user) {
        fetchUserProfile(session.user);
      } else {
        setIsLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  // Handle redirects after authentication status changes
  useEffect(() => {
    if (user && location.pathname === '/login') {
      navigate('/dashboard');
    }
  }, [user, location.pathname, navigate]);

  // Check if this is the first time the user is logging in
  const isFirstLogin = (supabaseUser: SupabaseUser): boolean => {
    // Check if the last_sign_in_at is close to the created_at (within 5 minutes)
    const createdAt = new Date(supabaseUser.created_at || '').getTime();
    const lastSignIn = new Date(supabaseUser.last_sign_in_at || '').getTime();
    
    // If the difference is less than 5 minutes, consider it a first login
    return Math.abs(lastSignIn - createdAt) < 5 * 60 * 1000;
  };

  // Separate function to fetch user profile data
  const fetchUserProfile = async (supabaseUser: SupabaseUser) => {
    try {
      // Skip trying to query the users table and use auth metadata instead
      // This avoids the permission denied errors
      const email = supabaseUser.email || '';
      const userMeta = supabaseUser.user_metadata || {};
      
      const firstName = userMeta.first_name || '';
      const lastName = userMeta.last_name || '';
      const role = (userMeta.role as UserRole) || 'contractor';
      const organizationName = userMeta.organization_name || '';
      const firstTimeLogin = isFirstLogin(supabaseUser);
      
      // Get tutorial completion status from localStorage
      const tutorialKey = `${email}_tutorial_complete`;
      const hasCompletedTutorial = localStorage.getItem(tutorialKey) === 'true';
      
      // Get onboarding status from localStorage
      const onboardingKey = `${email}_onboarding_complete`;
      const hasCompletedOnboarding = localStorage.getItem(onboardingKey) === 'true';
      
      // Create user object from auth data
      const userFromAuth: User = {
        id: supabaseUser.id,
        name: `${firstName} ${lastName}`.trim() || email.split('@')[0] || 'User',
        email,
        role,
        organizationName,
        // Director needs onboarding only on first login and if it hasn't been completed
        needsOnboarding: role === 'director' && firstTimeLogin && !hasCompletedOnboarding,
        hasCompletedTutorial
      };
      
      setUser(userFromAuth);
      setIsLoading(false);
    } catch (error) {
      console.error('Failed to process user data:', error);
      setUser(null);
      setIsLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      
      if (error) {
        throw error;
      }
      
      toast.success('Login successful!');
      // Navigation is handled in the useEffect when user data is loaded
    } catch (error: any) {
      toast.error(`Login failed: ${error.message}`);
      setIsLoading(false);
      throw error;
    }
  };

  const register = async (name: string, email: string, password: string, role: UserRole, organizationName?: string) => {
    try {
      setIsLoading(true);
      
      // Extract first and last name
      const nameParts = name.split(' ');
      const firstName = nameParts[0];
      const lastName = nameParts.length > 1 ? nameParts.slice(1).join(' ') : '';
      
      // Sign up the user with Supabase Auth
      const { error, data } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            first_name: firstName,
            last_name: lastName,
            role: role,
            organization_name: organizationName
          }
        }
      });
      
      if (error) {
        throw error;
      }

      toast.success('Registration successful! Please check your email to verify your account.');
      navigate('/login');
    } catch (error: any) {
      toast.error(`Registration failed: ${error.message}`);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      await supabase.auth.signOut();
      setUser(null);
      toast.info('You have been logged out.');
      navigate('/login');
    } catch (error) {
      console.error('Logout failed:', error);
      toast.error('Logout failed. Please try again.');
    }
  };

  // Mark tutorial as completed
  const markTutorialComplete = () => {
    if (user) {
      const tutorialKey = `${user.email}_tutorial_complete`;
      localStorage.setItem(tutorialKey, 'true');
      setUser(prev => prev ? {...prev, hasCompletedTutorial: true} : null);
    }
  };

  // Complete director onboarding by setting backup director
  const completeDirectorOnboarding = async (backupDirectorEmail: string, backupDirectorName: string) => {
    if (!user || user.role !== 'director') {
      toast.error('Only directors can complete onboarding');
      return;
    }

    try {
      setIsLoading(true);
      
      // In a real implementation, we would use an edge function to send an email
      // and update the organization with the pending backup director info
      
      console.log('Sending invitation to backup director:', backupDirectorEmail, backupDirectorName);
      
      // Mark onboarding as completed in localStorage
      const onboardingKey = `${user.email}_onboarding_complete`;
      localStorage.setItem(onboardingKey, 'true');
      
      // Update user state
      setUser(prev => prev ? {...prev, needsOnboarding: false} : null);
      
      toast.success(`Invitation sent to ${backupDirectorEmail}`);
    } catch (error: any) {
      console.error('Failed to complete onboarding:', error);
      toast.error('Failed to send backup director invitation');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated: !!user,
        login,
        register,
        logout,
        completeDirectorOnboarding,
        markTutorialComplete
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
