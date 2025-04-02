
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';
import { CustomButton } from '@/components/ui/custom-button';
import { ChevronRight, ChevronLeft, X, BarChart2, Briefcase } from 'lucide-react';

const DashboardTutorial = () => {
  const { user, markTutorialComplete } = useAuth();
  const navigate = useNavigate();
  const [isVisible, setIsVisible] = useState(true);
  const [currentStep, setCurrentStep] = useState(0);

  const tutorialSteps = [
    {
      title: 'Welcome to Construction Pay',
      content: 'This is your Dashboard. Here, you can see an overview of your projects, pay applications, and team members.',
      icon: <BarChart2 size={24} className="text-primary" />,
      action: { text: 'Next: Create Project', onClick: () => navigate('/projects') }
    },
    {
      title: 'Manage Your Projects',
      content: 'In the Projects section, you can create and manage all your construction projects.',
      icon: <Briefcase size={24} className="text-primary" />,
      action: { text: 'Go to Projects', onClick: () => navigate('/projects') }
    }
  ];

  const dismissTutorial = () => {
    setIsVisible(false);
    markTutorialComplete();
    localStorage.setItem('dashboardTutorialComplete', 'true');
  };

  const nextStep = () => {
    if (currentStep < tutorialSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      dismissTutorial();
      // Navigate to the next step in the onboarding process
      navigate('/projects');
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  // Don't show if tutorial has been completed or user is not a director
  if (!isVisible || user?.role !== 'director' || user.hasCompletedTutorial || localStorage.getItem('dashboardTutorialComplete') === 'true') {
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
        {tutorialSteps[currentStep].icon}
        <div>
          <h3 className="font-semibold text-lg">{tutorialSteps[currentStep].title}</h3>
          <p className="text-muted-foreground text-sm mt-1">{tutorialSteps[currentStep].content}</p>
        </div>
      </div>
      
      <div className="flex justify-between items-center mt-6">
        <div className="flex gap-1.5">
          {tutorialSteps.map((_, index) => (
            <span 
              key={index} 
              className={`w-2 h-2 rounded-full ${
                index === currentStep ? 'bg-primary' : 'bg-gray-300'
              }`} 
            />
          ))}
        </div>
        
        <div className="flex gap-2">
          {currentStep > 0 && (
            <CustomButton onClick={prevStep} size="sm" variant="outline">
              <ChevronLeft size={14} className="mr-1" /> Previous
            </CustomButton>
          )}
          
          {tutorialSteps[currentStep].action ? (
            <CustomButton onClick={tutorialSteps[currentStep].action.onClick} size="sm">
              {tutorialSteps[currentStep].action.text} <ChevronRight size={14} className="ml-1" />
            </CustomButton>
          ) : (
            <CustomButton onClick={nextStep} size="sm">
              {currentStep === tutorialSteps.length - 1 ? 'Finish' : 'Next'}
              <ChevronRight size={14} className="ml-1" />
            </CustomButton>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default DashboardTutorial;
