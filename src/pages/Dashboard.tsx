import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Briefcase, FileText, Users, AlertCircle, Plus, Building } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useApi } from '@/hooks/use-api';
import Sidebar from '@/components/layout/Sidebar';
import DashboardCard from '@/components/dashboard/DashboardCard';
import ProjectsList from '@/components/dashboard/ProjectsList';
import { CustomButton } from '@/components/ui/custom-button';
import NewProjectModal from '@/components/projects/NewProjectModal';
import InviteTeamModal from '@/components/team/InviteTeamModal';
import DirectorOnboarding from '@/components/onboarding/DirectorOnboarding';
import DashboardTutorial from '@/components/onboarding/DashboardTutorial';

const Dashboard = () => {
  const { user } = useAuth();
  const { getDashboardStatistics, getProjects } = useApi();
  const [stats, setStats] = useState<any[]>([]);
  const [projects, setProjects] = useState<any[]>([]);
  const [isLoadingProjects, setIsLoadingProjects] = useState(true);
  const [isNewProjectModalOpen, setIsNewProjectModalOpen] = useState(false);
  const [isInviteTeamModalOpen, setIsInviteTeamModalOpen] = useState(false);

  useEffect(() => {
    if (user) {
      // Get dashboard statistics
      const fetchStats = async () => {
        try {
          const statsData = await getDashboardStatistics();
          setStats(statsData);
        } catch (error) {
          console.error('Error fetching stats:', error);
          setStats([]);
        }
      };
      
      fetchStats();
      
      // Fetch projects
      const fetchProjects = async () => {
        try {
          setIsLoadingProjects(true);
          const projectsData = await getProjects();
          setProjects(projectsData);
        } catch (error) {
          console.error('Error fetching projects:', error);
          setProjects([]);
        } finally {
          setIsLoadingProjects(false);
        }
      };
      
      fetchProjects();
    }
  }, [user]);

  // Map lucide icons to dashboard cards
  const getIconForStat = (title: string) => {
    switch (title) {
      case 'Active Projects':
        return <Briefcase size={20} />;
      case 'Contractors':
      case 'Organization Members':
        return <Users size={20} />;
      case 'Pay Applications':
      case 'Submitted Applications':
      case 'Approved Applications':
        return <FileText size={20} />;
      case 'Pending Reviews':
      case 'Changes Requested':
        return <AlertCircle size={20} />;
      case 'Assigned Projects':
        return <Briefcase size={20} />;
      default:
        return <Building size={20} />;
    }
  };

  // Show director onboarding if needed
  const showDirectorOnboarding = user?.role === 'director' && user.needsOnboarding;

  return (
    <div className="min-h-screen bg-background">
      <Sidebar userRole={user?.role || 'pm'} />
      
      <main className="pt-16 pb-12 pl-0 md:pl-20 lg:pl-64">
        <div className="px-6 md:px-8 max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold">Dashboard</h1>
              <p className="text-muted-foreground mt-1">Welcome back, {user?.name || 'User'}</p>
            </div>

            <div className="flex items-center gap-2 text-sm">
              <span className="text-muted-foreground">Organization:</span>
              <span className="font-medium">{user?.organizationName || 'Not Assigned'}</span>
            </div>
          </div>

          {/* Dashboard Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {stats.map((stat, index) => (
              <Link
                key={stat.title}
                to={
                  stat.title === 'Active Projects' ? '/projects' :
                  stat.title === 'Contractors' || stat.title === 'Organization Members' ? '/team' :
                  stat.title === 'Pay Applications' || 
                  stat.title === 'Submitted Applications' || 
                  stat.title === 'Pending Reviews' ? '/applications' :
                  '#'
                }
              >
                <DashboardCard
                  title={stat.title}
                  value={stat.value}
                  icon={getIconForStat(stat.title)}
                  index={index}
                />
              </Link>
            ))}
          </div>

          {/* Quick Actions */}
          <div className="flex flex-wrap gap-4 mb-8">
            {(user?.role === 'pm' || user?.role === 'director') && (
              <>
                <CustomButton onClick={() => setIsNewProjectModalOpen(true)}>
                  <Plus size={16} className="mr-2" /> New Project
                </CustomButton>
                <CustomButton variant="outline" onClick={() => setIsInviteTeamModalOpen(true)}>
                  <Users size={16} className="mr-2" /> Invite Team Member
                </CustomButton>
              </>
            )}
          </div>

          {/* Projects Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold">Projects</h2>
              <Link to="/projects" className="text-sm text-primary hover:underline">View All</Link>
            </div>
            
            {isLoadingProjects ? (
              <div className="flex justify-center py-12">
                <div className="animate-spin h-8 w-8 border-4 border-primary rounded-full border-t-transparent"></div>
              </div>
            ) : (
              <ProjectsList projects={projects.slice(0, 3)} />
            )}
          </motion.div>
        </div>
      </main>

      {/* Director Onboarding (shown if needed) */}
      {showDirectorOnboarding && <DirectorOnboarding />}

      {/* Dashboard Tutorial (shown if not dismissed) */}
      <DashboardTutorial />

      {/* Modals */}
      <NewProjectModal 
        isOpen={isNewProjectModalOpen} 
        onClose={() => setIsNewProjectModalOpen(false)} 
      />
      
      <InviteTeamModal 
        isOpen={isInviteTeamModalOpen} 
        onClose={() => setIsInviteTeamModalOpen(false)} 
      />
    </div>
  );
};

export default Dashboard;
