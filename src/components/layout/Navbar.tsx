
import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, ChevronDown } from 'lucide-react';
import { CustomButton } from '@/components/ui/custom-button';
import { cn } from '@/lib/utils';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  const isActive = (path: string) => location.pathname === path;

  return (
    <header
      className={cn(
        'fixed top-0 left-0 right-0 z-40 transition-all duration-300 px-6 md:px-8',
        isScrolled
          ? 'bg-white/80 dark:bg-gray-900/80 backdrop-blur-md py-4 shadow-subtle'
          : 'bg-transparent py-6'
      )}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <Link to="/" className="flex items-center space-x-2 text-primary">
          <span className="h-8 w-8 rounded-md bg-primary flex items-center justify-center">
            <span className="text-white font-bold text-lg">CP</span>
          </span>
          <span className="font-medium text-lg md:text-xl">ContractorPay</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-1">
          <Link 
            to="/"
            className={cn(
              "px-4 py-2 rounded-md text-sm font-medium transition-colors",
              isActive('/') 
                ? "bg-primary/10 text-primary"
                : "text-foreground/80 hover:text-foreground hover:bg-accent"
            )}
          >
            Home
          </Link>
          <Link 
            to="/dashboard"
            className={cn(
              "px-4 py-2 rounded-md text-sm font-medium transition-colors",
              isActive('/dashboard') 
                ? "bg-primary/10 text-primary"
                : "text-foreground/80 hover:text-foreground hover:bg-accent"
            )}
          >
            Dashboard
          </Link>
        </nav>

        <div className="hidden md:flex items-center space-x-4">
          <Link to="/login">
            <CustomButton variant="outline" size="sm">
              Log In
            </CustomButton>
          </Link>
          <Link to="/register">
            <CustomButton size="sm">
              Sign Up
            </CustomButton>
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="md:hidden flex items-center text-gray-700 focus:outline-none"
        >
          {isMobileMenuOpen ? (
            <X className="h-6 w-6" />
          ) : (
            <Menu className="h-6 w-6" />
          )}
        </button>
      </div>

      {/* Mobile Menu */}
      <div
        className={cn(
          "fixed inset-x-0 top-[73px] md:hidden bg-white/90 dark:bg-gray-900/90 backdrop-blur-md transition-all duration-300 ease-in-out transform z-30",
          isMobileMenuOpen 
            ? "translate-y-0 opacity-100 shadow-md"
            : "-translate-y-10 opacity-0 pointer-events-none"
        )}
      >
        <div className="px-6 py-6 space-y-4">
          <Link 
            to="/"
            className={cn(
              "block px-4 py-3 rounded-md font-medium transition-colors",
              isActive('/') 
                ? "bg-primary/10 text-primary"
                : "text-foreground/80 hover:text-foreground hover:bg-accent"
            )}
          >
            Home
          </Link>
          <Link 
            to="/dashboard"
            className={cn(
              "block px-4 py-3 rounded-md font-medium transition-colors",
              isActive('/dashboard') 
                ? "bg-primary/10 text-primary"
                : "text-foreground/80 hover:text-foreground hover:bg-accent"
            )}
          >
            Dashboard
          </Link>
          <div className="border-t border-gray-200 dark:border-gray-800 pt-4 flex flex-col space-y-3">
            <Link to="/login">
              <CustomButton variant="outline" className="w-full">
                Log In
              </CustomButton>
            </Link>
            <Link to="/register">
              <CustomButton className="w-full">
                Sign Up
              </CustomButton>
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
