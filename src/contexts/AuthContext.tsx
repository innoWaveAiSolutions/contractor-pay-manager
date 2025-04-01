
import { 
  createContext, 
  useContext, 
  useState, 
  useEffect, 
  ReactNode 
} from 'react';
import { useNavigate } from 'react-router-dom';
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
}

// Define authentication context interface
interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string, role: UserRole, organizationName?: string) => Promise<void>;
  logout: () => Promise<void>;
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

  // Set up auth state listener and check for existing session
  useEffect(() => {
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setSession(session);
        if (session?.user) {
          // We'll fetch user profile data in a separate effect
          setIsLoading(true);
        } else {
          setUser(null);
          setIsLoading(false);
        }
      }
    );

    // THEN check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (!session?.user) {
        setIsLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  // Fetch user profile data when session changes
  useEffect(() => {
    const fetchUserProfile = async (supabaseUser: SupabaseUser) => {
      try {
        // Use a setTimeout to prevent recursion issues with onAuthStateChange
        setTimeout(async () => {
          const { data, error } = await supabase
            .from('users')
            .select(`
              id, 
              first_name, 
              last_name, 
              email, 
              role,
              organization_id,
              organizations:organization_id (name)
            `)
            .eq('email', supabaseUser.email)
            .maybeSingle();

          if (error) {
            console.error('Error fetching user profile:', error);
            setUser(null);
          } else if (data) {
            setUser({
              id: data.id.toString(),
              name: `${data.first_name || ''} ${data.last_name || ''}`.trim() || supabaseUser.email?.split('@')[0] || 'User',
              email: data.email,
              role: data.role as UserRole || 'contractor',
              organizationId: data.organization_id,
              organizationName: data.organizations?.name
            });
          }
          setIsLoading(false);
        }, 0);
      } catch (error) {
        console.error('Failed to fetch user profile:', error);
        setUser(null);
        setIsLoading(false);
      }
    };

    if (session?.user) {
      fetchUserProfile(session.user);
    }
  }, [session]);

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
      navigate('/dashboard');
    } catch (error: any) {
      toast.error(`Login failed: ${error.message}`);
      throw error;
    } finally {
      setIsLoading(false);
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
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            first_name: firstName,
            last_name: lastName,
            role: role
          }
        }
      });
      
      if (authError) {
        throw authError;
      }

      if (authData.user && role === 'director' && organizationName) {
        // Wait a moment for the user record to be created by the trigger
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Fetch the newly created user's ID
        const { data: userData, error: userFetchError } = await supabase
          .from('users')
          .select('id')
          .eq('email', email)
          .single();

        if (userFetchError) {
          throw userFetchError;
        }

        // Create a new organization
        const { data: orgData, error: orgError } = await supabase
          .from('organizations')
          .insert([{
            name: organizationName,
            created_by: userData.id
          }])
          .select('id')
          .single();

        if (orgError) {
          throw orgError;
        }

        // Update the user's organization_id
        const { error: userUpdateError } = await supabase
          .from('users')
          .update({ organization_id: orgData.id })
          .eq('id', userData.id);

        if (userUpdateError) {
          throw userUpdateError;
        }
      }

      toast.success('Account created successfully!');
      navigate('/dashboard');
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

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated: !!user,
        login,
        register,
        logout
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
