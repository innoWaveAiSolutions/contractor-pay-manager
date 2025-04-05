
import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, X } from 'lucide-react';
import { CustomButton } from '@/components/ui/custom-button';

// This component will guide users through creating their first project
const ProjectsTutorial = () => {
  const [isDismissed, setIsDismissed] = useState(false);
  const [step, setStep] = useState(0);
  const location = useLocation();
  
  // If we're on the projects page and it's not dismissed, show the tutorial
  const shouldShow = 
    !isDismissed && 
    location.pathname.includes('/projects') && 
    !localStorage.getItem('projectsTutorialComplete');
  
  useEffect(() => {
    // Check if the tutorial was already completed
    if (localStorage.getItem('projectsTutorialComplete')) {
      setIsDismissed(true);
    }
  }, []);

  const handleComplete = () => {
    localStorage.setItem('projectsTutorialComplete', 'true');
    setIsDismissed(true);
  };

  const handleDismiss = () => {
    setIsDismissed(true);
  };

  const handleNext = () => {
    if (step === steps.length - 1) {
      handleComplete();
    } else {
      setStep(step + 1);
    }
  };

  const steps = [
    {
      title: "Create Your First Project",
      description: "Let's start by creating your first construction project. Click the 'New Project' button to begin.",
      target: '#new-project-btn',
    },
  ];

  if (!shouldShow) return null;

  const currentStep = steps[step];

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 20 }}
        transition={{ duration: 0.3 }}
        className="fixed bottom-6 right-6 z-50"
      >
        <div className="bg-white dark:bg-gray-900 rounded-xl shadow-elevation p-5 max-w-md">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-bold text-lg">{currentStep.title}</h3>
            <button 
              onClick={handleDismiss}
              className="h-7 w-7 rounded-full flex items-center justify-center hover:bg-muted"
            >
              <X size={16} />
            </button>
          </div>
          
          <p className="text-muted-foreground mb-4">{currentStep.description}</p>
          
          <div className="flex justify-between items-center">
            <div className="text-sm text-muted-foreground">
              Step {step + 1} of {steps.length}
            </div>
            <CustomButton 
              size="sm" 
              onClick={handleNext}
            >
              {step === steps.length - 1 ? 'Finish' : 'Next'} <ChevronRight size={16} className="ml-1" />
            </CustomButton>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default ProjectsTutorial;
