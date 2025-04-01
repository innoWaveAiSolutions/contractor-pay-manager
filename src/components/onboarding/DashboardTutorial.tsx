
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';
import { CustomButton } from '@/components/ui/custom-button';
import { ChevronRight, X, Briefcase, Users, Settings, Building } from 'lucide-react';

interface TutorialStep {
  title: string;
  content: string;
  icon: JSX.Element;
}

const DashboardTutorial = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isVisible, setIsVisible] = useState(true);
  const [currentStep, setCurrentStep] = useState(0);
  const [tutorial, setTutorial] = useState<TutorialStep[]>([]);

  useEffect(() => {
    // Show different tutorials based on user role
    if (user?.role === 'director') {
      setTutorial([
        {
          title: 'Welcome to Your Dashboard',
          content: 'This is your central hub where you can monitor all activity across your organization, projects, and team members.',
          icon: <Briefcase size={24} className="text-primary" />
        },
        {
          title: 'Create Your First Project',
          content: 'Start by creating your first construction project. Click on "New Project" or head to the Projects tab.',
          icon: <Briefcase size={24} className="text-primary" />
        },
        {
          title: 'Add Your Team',
          content: 'Invite team members to join your organization. You\'ll need Project Managers, Reviewers, and Contractors.',
          icon: <Users size={24} className="text-primary" />
        },
        {
          title: 'Configure Your Organization',
          content: 'Visit the Organization tab to set up preferences and permissions for your team.',
          icon: <Building size={24} className="text-primary" />
        }
      ]);
    } else {
      // Default tutorial for other roles
      setTutorial([
        {
          title: 'Welcome to Your Dashboard',
          content: 'This is your central hub where you can see your assigned projects and tasks.',
          icon: <Briefcase size={24} className="text-primary" />
        },
        {
          title: 'Explore Your Projects',
          content: 'Click on the Projects tab to view all projects assigned to you.',
          icon: <Briefcase size={24} className="text-primary" />
        },
        {
          title: 'Update Your Settings',
          content: 'Visit the Settings tab to update your profile and preferences.',
          icon: <Settings size={24} className="text-primary" />
        }
      ]);
    }
  }, [user?.role]);

  const dismissTutorial = () => {
    setIsVisible(false);
    localStorage.setItem('dashboardTutorialComplete', 'true');
  };

  const nextStep = () => {
    if (currentStep < tutorial.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      dismissTutorial();

      // Navigate to Projects page after completing director tutorial
      if (user?.role === 'director') {
        navigate('/projects');
      }
    }
  };

  // Don't show if tutorial has been completed before or no tutorial data
  if (!isVisible || !tutorial.length || localStorage.getItem('dashboardTutorialComplete') === 'true') {
    return null;
  }

  return (
    <motion.div
      className="fixed bottom-8 right-8 bg-white dark:bg-gray-900 rounded-xl shadow-elevation max-w-sm w-full p-6 z-40"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
    >
      <button 
        onClick={dismissTutorial} 
        className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
      >
        <X size={18} />
      </button>
      
      <div className="flex items-start mb-4 gap-3">
        {tutorial[currentStep].icon}
        <div>
          <h3 className="font-semibold text-lg">{tutorial[currentStep].title}</h3>
          <p className="text-muted-foreground text-sm mt-1">{tutorial[currentStep].content}</p>
        </div>
      </div>
      
      <div className="flex justify-between items-center mt-6">
        <div className="flex gap-1.5">
          {tutorial.map((_, index) => (
            <span 
              key={index} 
              className={`w-2 h-2 rounded-full ${
                index === currentStep ? 'bg-primary' : 'bg-gray-300'
              }`} 
            />
          ))}
        </div>
        
        <CustomButton onClick={nextStep} size="sm">
          {currentStep === tutorial.length - 1 ? 'Finish' : 'Next'}
          <ChevronRight size={14} className="ml-1" />
        </CustomButton>
      </div>
    </motion.div>
  );
};

export default DashboardTutorial;
