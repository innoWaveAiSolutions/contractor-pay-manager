
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import LoginForm from '@/components/auth/LoginForm';
import { useAuth } from '@/contexts/AuthContext';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, navigate]);

  return (
    <div className="min-h-screen bg-background flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex justify-center"
        >
          <Link to="/" className="flex items-center space-x-2 text-primary">
            <span className="h-10 w-10 rounded-md bg-primary flex items-center justify-center">
              <span className="text-white font-bold text-lg">CP</span>
            </span>
          </Link>
        </motion.div>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <LoginForm />
      </div>

      <div className="mt-8 text-center">
        <Link to="/" className="text-sm text-muted-foreground hover:text-foreground hover:underline">
          ← Back to Home
        </Link>
      </div>
    </div>
  );
};

export default Login;
