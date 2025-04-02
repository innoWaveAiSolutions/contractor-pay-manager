
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';
import { CustomButton } from '@/components/ui/custom-button';
import { ChevronRight, ChevronLeft, X, Briefcase, Plus, Users } from 'lucide-react';

const ProjectsTutorial = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isVisible, setIsVisible] = useState(true);
  const [currentStep, setCurrentStep] = useState(0);

  const tutorialSteps = [
    {
      title: 'Create Your First Project',
      content: 'Click the "New Project" button above to create your first project. Give it a name, budget and other details to get started.',
      icon: <Plus size={24} className="text-primary" />,
      action: {
        text: 'Create New Project',
        onClick: () => document.querySelector('button:has(.mr-2 svg[data-lucide="plus"])') && 
          (document.querySelector('button:has(.mr-2 svg[data-lucide="plus"])') as HTMLButtonElement).click()
      }
    },
    {
      title: 'Assign Team Members',
      content: 'After creating a project, you\'ll need to assign contractors, project managers, and reviewers to it.',
      icon: <Users size={24} className="text-primary" />
    },
    {
      title: 'Next: Organization Settings',
      content: 'After creating your first project, we\'ll take you to the Organization tab to configure your organization settings.',
      icon: <Briefcase size={24} className="text-primary" />,
      action: {
        text: 'Go to Organization',
        onClick: () => {
          localStorage.setItem('projectsTutorialComplete', 'true');
          navigate('/organization');
        }
      }
    }
  ];

  const dismissTutorial = () => {
    setIsVisible(false);
    localStorage.setItem('projectsTutorialComplete', 'true');
  };

  const nextStep = () => {
    if (currentStep < tutorialSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      dismissTutorial();
      navigate('/organization');
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  // Don't show if tutorial has been completed or user is not a director
  if (!isVisible || user?.role !== 'director' || localStorage.getItem('projectsTutorialComplete') === 'true') {
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

export default ProjectsTutorial;
