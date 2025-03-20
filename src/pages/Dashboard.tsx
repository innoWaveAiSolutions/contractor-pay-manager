
import { useState } from 'react';
import { motion } from 'framer-motion';
import { FileText, Briefcase, Users, AlertCircle, Plus } from 'lucide-react';
import Sidebar from '@/components/layout/Sidebar';
import DashboardCard from '@/components/dashboard/DashboardCard';
import ProjectsList from '@/components/dashboard/ProjectsList';
import { CustomButton } from '@/components/ui/custom-button';

// Mock stats data for PM dashboard
const pmStats = [
  {
    title: 'Active Projects',
    value: '12',
    icon: <Briefcase size={20} />,
    color: 'text-primary',
  },
  {
    title: 'Contractors',
    value: '36',
    icon: <Users size={20} />,
    color: 'text-primary',
  },
  {
    title: 'Pay Applications',
    value: '24',
    icon: <FileText size={20} />,
    color: 'text-primary',
  },
  {
    title: 'Pending Reviews',
    value: '7',
    icon: <AlertCircle size={20} />,
    color: 'text-amber-500',
  },
];

const Dashboard = () => {
  const [userRole, setUserRole] = useState<'pm' | 'contractor' | 'reviewer' | 'director'>('pm');

  // Simulate changing roles (for demo purposes)
  const handleRoleChange = (role: 'pm' | 'contractor' | 'reviewer' | 'director') => {
    setUserRole(role);
  };

  return (
    <div className="min-h-screen bg-background">
      <Sidebar userRole={userRole} />
      
      <main className="pt-16 pb-12 pl-0 md:pl-20 lg:pl-64">
        <div className="px-6 md:px-8 max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold">Dashboard</h1>
              <p className="text-muted-foreground mt-1">Welcome back, Alex</p>
            </div>

            {/* Role switcher (just for demo) */}
            <div className="flex items-center gap-2 text-sm">
              <span className="text-muted-foreground">Role:</span>
              <select 
                value={userRole}
                onChange={(e) => handleRoleChange(e.target.value as any)}
                className="px-2 py-1 border border-input rounded-md bg-background"
              >
                <option value="pm">Project Manager</option>
                <option value="contractor">Contractor</option>
                <option value="reviewer">Reviewer</option>
                <option value="director">Director</option>
              </select>
            </div>
          </div>

          {/* Dashboard Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {pmStats.map((stat, index) => (
              <DashboardCard
                key={stat.title}
                title={stat.title}
                value={stat.value}
                icon={stat.icon}
                index={index}
              />
            ))}
          </div>

          {/* Quick Actions */}
          <div className="flex flex-wrap gap-4 mb-8">
            <CustomButton>
              <Plus size={16} className="mr-2" /> New Project
            </CustomButton>
            <CustomButton variant="outline">
              <Users size={16} className="mr-2" /> Invite Team Member
            </CustomButton>
          </div>

          {/* Projects Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold">Projects</h2>
              <a href="/projects" className="text-sm text-primary hover:underline">View All</a>
            </div>
            <ProjectsList />
          </motion.div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
