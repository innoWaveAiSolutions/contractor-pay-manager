
import { 
  createContext, 
  useContext, 
  useState, 
  useEffect, 
  ReactNode 
} from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

// Define user role types
export type UserRole = 'pm' | 'contractor' | 'reviewer' | 'director';

// Define user type
export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  organizationId?: string;
  organizationName?: string;
}

// Define authentication context interface
interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string, role: UserRole) => Promise<void>;
  logout: () => void;
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

// Mock API functions (to be replaced with actual backend API calls)
const mockLogin = async (email: string, password: string): Promise<User> => {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // For demo, create different users based on email
  if (email.includes('director')) {
    return {
      id: 'd1',
      name: 'Director User',
      email,
      role: 'director',
      organizationId: 'org1',
      organizationName: 'Demo Organization'
    };
  } else if (email.includes('pm')) {
    return {
      id: 'pm1',
      name: 'Project Manager',
      email,
      role: 'pm',
      organizationId: 'org1',
      organizationName: 'Demo Organization'
    };
  } else if (email.includes('reviewer')) {
    return {
      id: 'r1',
      name: 'Reviewer User',
      email,
      role: 'reviewer',
      organizationId: 'org1',
      organizationName: 'Demo Organization'
    };
  } else {
    return {
      id: 'c1',
      name: 'Contractor User',
      email,
      role: 'contractor',
      organizationId: 'org1',
      organizationName: 'Demo Organization'
    };
  }
};

const mockRegister = async (
  name: string, 
  email: string, 
  password: string, 
  role: UserRole
): Promise<User> => {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  return {
    id: Math.random().toString(36).substring(2, 9),
    name,
    email,
    role,
    organizationId: role === 'director' ? Math.random().toString(36).substring(2, 9) : undefined,
    organizationName: role === 'director' ? 'New Organization' : undefined
  };
};

// Auth Provider component
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  // Check if user is already logged in
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      const userData = await mockLogin(email, password);
      setUser(userData);
      localStorage.setItem('user', JSON.stringify(userData));
      toast.success(`Welcome back, ${userData.name}!`);
      navigate('/dashboard');
    } catch (error) {
      toast.error('Login failed. Please check your credentials.');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (name: string, email: string, password: string, role: UserRole) => {
    try {
      setIsLoading(true);
      const userData = await mockRegister(name, email, password, role);
      setUser(userData);
      localStorage.setItem('user', JSON.stringify(userData));
      toast.success('Account created successfully!');
      navigate('/dashboard');
    } catch (error) {
      toast.error('Registration failed. Please try again.');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('user');
    setUser(null);
    toast.info('You have been logged out.');
    navigate('/login');
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
