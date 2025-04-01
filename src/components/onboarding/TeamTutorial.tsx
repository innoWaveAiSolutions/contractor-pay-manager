
import { useState } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';
import { CustomButton } from '@/components/ui/custom-button';
import { ChevronRight, X, Users, Mail, CheckCircle } from 'lucide-react';

const TeamTutorial = () => {
  const { user } = useAuth();
  const [isVisible, setIsVisible] = useState(true);
  const [currentStep, setCurrentStep] = useState(0);

  const tutorialSteps = [
    {
      title: 'Build Your Team',
      content: 'Invite team members by clicking the "Invite Team Member" button. You\'ll need project managers, reviewers, and contractors.',
      icon: <Users size={24} className="text-primary" />
    },
    {
      title: 'Send Invitations',
      content: 'New members will receive an email invitation to join your organization. They\'ll need to create an account to accept.',
      icon: <Mail size={24} className="text-primary" />
    },
    {
      title: 'Onboarding Complete!',
      content: 'Congratulations! You\'ve completed the initial setup of your Construction Pay account. Explore the app to start managing your projects.',
      icon: <CheckCircle size={24} className="text-primary" />
    }
  ];

  const dismissTutorial = () => {
    setIsVisible(false);
    localStorage.setItem('teamTutorialComplete', 'true');
    // Also mark the full onboarding as completed
    localStorage.setItem('onboardingComplete', 'true');
  };

  const nextStep = () => {
    if (currentStep < tutorialSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      dismissTutorial();
    }
  };

  // Don't show if tutorial has been completed or user is not a director
  if (!isVisible || user?.role !== 'director' || localStorage.getItem('teamTutorialComplete') === 'true') {
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
        
        <CustomButton onClick={nextStep} size="sm">
          {currentStep === tutorialSteps.length - 1 ? 'Finish' : 'Next'}
          <ChevronRight size={14} className="ml-1" />
        </CustomButton>
      </div>
    </motion.div>
  );
};

export default TeamTutorial;
