
import { useState, useEffect } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { 
  Home, 
  Users, 
  Briefcase, 
  FileText, 
  Settings, 
  ChevronRight, 
  Menu, 
  X,
  LogOut,
  Building
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useIsMobile } from '@/hooks/use-mobile';
import { useAuth, UserRole } from '@/contexts/AuthContext';

interface SidebarProps {
  userRole?: UserRole;
}

const Sidebar = ({ userRole = 'pm' }: SidebarProps) => {
  const [expanded, setExpanded] = useState(true);
  const isMobile = useIsMobile();
  const location = useLocation();
  const { user } = useAuth();

  // Use the authenticated user's role if available
  const role = user?.role || userRole;

  useEffect(() => {
    if (isMobile) {
      setExpanded(false);
    } else {
      setExpanded(true);
    }
  }, [isMobile]);

  useEffect(() => {
    if (isMobile) {
      setExpanded(false);
    }
  }, [location, isMobile]);

  const NavItem = ({ icon: Icon, href, label }: { icon: any; href: string; label: string }) => {
    const isActive = location.pathname === href;

    return (
      <NavLink
        to={href}
        className={({ isActive }) =>
          cn(
            "flex items-center gap-x-3 py-3 px-3 rounded-md text-sm font-medium transition-all group",
            isActive
              ? "bg-primary/10 text-primary dark:bg-primary/20"
              : "text-foreground/70 hover:text-foreground hover:bg-accent"
          )
        }
      >
        <Icon size={18} className={isActive ? "text-primary" : "text-foreground/70 group-hover:text-foreground"} />
        <span className={cn("transition-all", expanded ? "opacity-100" : "opacity-0 w-0 overflow-hidden")}>
          {label}
        </span>
      </NavLink>
    );
  };

  const navItemsByRole = {
    pm: [
      { icon: Home, href: '/dashboard', label: 'Dashboard' },
      { icon: Briefcase, href: '/projects', label: 'Projects' },
      { icon: Users, href: '/team', label: 'Team' },
      { icon: FileText, href: '/applications', label: 'Applications' },
      { icon: Settings, href: '/settings', label: 'Settings' },
    ],
    contractor: [
      { icon: Home, href: '/dashboard', label: 'Dashboard' },
      { icon: Briefcase, href: '/projects', label: 'Projects' },
      { icon: FileText, href: '/applications', label: 'Applications' },
      { icon: Settings, href: '/settings', label: 'Settings' },
    ],
    reviewer: [
      { icon: Home, href: '/dashboard', label: 'Dashboard' },
      { icon: FileText, href: '/applications', label: 'Applications' },
      { icon: Settings, href: '/settings', label: 'Settings' },
    ],
    director: [
      { icon: Home, href: '/dashboard', label: 'Dashboard' },
      { icon: Briefcase, href: '/projects', label: 'Projects' },
      { icon: FileText, href: '/applications', label: 'Applications' },
      { icon: Building, href: '/organization', label: 'Organization' },
      { icon: Settings, href: '/settings', label: 'Settings' },
    ],
  };

  const navItems = navItemsByRole[role] || navItemsByRole.pm;

  return (
    <>
      {/* Mobile Overlay */}
      {isMobile && expanded && (
        <div 
          className="fixed inset-0 bg-black/30 z-40 transition-opacity"
          onClick={() => setExpanded(false)}
        />
      )}

      <aside
        className={cn(
          "fixed top-0 left-0 h-full z-50 transition-all duration-300 ease-in-out",
          expanded ? "w-64" : "w-20",
          isMobile && !expanded && "translate-x-[-100%]",
          "bg-white dark:bg-gray-900 border-r border-border"
        )}
      >
        <div className="h-full flex flex-col">
          <div className="h-16 flex items-center px-4 border-b border-border">
            <div className="flex items-center justify-between w-full">
              <div className="flex items-center">
                <div className="h-8 w-8 rounded-md bg-primary flex items-center justify-center">
                  <span className="text-white font-bold text-lg">CP</span>
                </div>
                {expanded && (
                  <span className="ml-2 font-medium text-lg transition-all duration-300">
                    ContractorPay
                  </span>
                )}
              </div>
              <button
                onClick={() => setExpanded(!expanded)}
                className="p-1.5 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              >
                {isMobile ? (
                  expanded ? <X size={18} /> : <Menu size={18} />
                ) : (
                  <ChevronRight
                    size={18}
                    className={cn(
                      "transition-transform duration-300",
                      expanded ? "rotate-180" : "rotate-0"
                    )}
                  />
                )}
              </button>
            </div>
          </div>

          <div className="flex-1 py-6 px-3 space-y-1 overflow-y-auto">
            {navItems.map((item) => (
              <NavItem
                key={item.href}
                icon={item.icon}
                href={item.href}
                label={item.label}
              />
            ))}
          </div>

          <div className="p-3 border-t border-border">
            <NavLink
              to="/logout"
              className="flex items-center gap-x-3 py-3 px-3 rounded-md text-sm font-medium text-destructive/80 hover:bg-destructive/10 hover:text-destructive transition-all"
            >
              <LogOut size={18} />
              <span className={cn("transition-all", expanded ? "opacity-100" : "opacity-0 w-0 overflow-hidden")}>
                Logout
              </span>
            </NavLink>
          </div>
        </div>
      </aside>

      {/* Mobile toggle button */}
      {isMobile && !expanded && (
        <button
          onClick={() => setExpanded(true)}
          className="fixed bottom-6 left-6 z-40 h-12 w-12 rounded-full bg-primary text-white flex items-center justify-center shadow-elevation"
        >
          <Menu size={20} />
        </button>
      )}

      {/* Content margin */}
      <div
        className={cn(
          "transition-all duration-300 ease-in-out",
          expanded && !isMobile ? "ml-64" : isMobile ? "ml-0" : "ml-20"
        )}
      />
    </>
  );
};

export default Sidebar;
