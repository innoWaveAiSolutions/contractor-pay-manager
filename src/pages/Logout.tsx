
import { useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';

const Logout = () => {
  const { logout } = useAuth();

  useEffect(() => {
    const performLogout = async () => {
      await logout();
    };
    
    performLogout();
  }, [logout]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="animate-spin h-8 w-8 border-4 border-primary rounded-full border-t-transparent"></div>
    </div>
  );
};

export default Logout;
