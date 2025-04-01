
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { CustomButton } from '@/components/ui/custom-button';
import { toast } from 'sonner';
import { motion } from 'framer-motion';
import { CheckCircle, ChevronRight, Mail } from 'lucide-react';

const DirectorOnboarding = () => {
  const { user, completeDirectorOnboarding } = useAuth();
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [backupDirectorName, setBackupDirectorName] = useState('');
  const [backupDirectorEmail, setBackupDirectorEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // If no user or not a director, or if director doesn't need onboarding, don't show onboarding
  if (!user || user.role !== 'director' || !user.needsOnboarding) {
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!backupDirectorEmail || !backupDirectorName) {
      toast.error('Please provide both name and email for the backup director');
      return;
    }
    
    try {
      setIsSubmitting(true);
      await completeDirectorOnboarding(backupDirectorEmail, backupDirectorName);
      setCurrentStep(2);
    } catch (error) {
      console.error('Failed to submit:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const goToDashboard = () => {
    navigate('/dashboard');
  };

  return (
    <motion.div 
      className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center overflow-y-auto"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div 
        className="bg-white dark:bg-gray-900 rounded-xl shadow-elevation max-w-xl w-full m-4"
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <div className="p-6 border-b border-border">
          <h2 className="text-2xl font-semibold">Welcome to Construction Pay</h2>
          <p className="text-muted-foreground mt-1">Let's complete your onboarding as a Director</p>
        </div>

        <div className="p-6">
          {currentStep === 1 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-6"
            >
              <div className="space-y-4">
                <h3 className="text-xl font-medium">Add a Backup Director</h3>
                <p className="text-muted-foreground">
                  For security and continuity reasons, please designate a backup director for your organization. 
                  This person will have administrative capabilities when you're unavailable.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <label htmlFor="backupDirectorName" className="text-sm font-medium">
                    Backup Director's Full Name
                  </label>
                  <input
                    id="backupDirectorName"
                    type="text"
                    value={backupDirectorName}
                    onChange={(e) => setBackupDirectorName(e.target.value)}
                    placeholder="Jane Doe"
                    required
                    className="w-full px-4 py-2 border border-input rounded-lg bg-background input-focus"
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="backupDirectorEmail" className="text-sm font-medium">
                    Backup Director's Email
                  </label>
                  <input
                    id="backupDirectorEmail"
                    type="email"
                    value={backupDirectorEmail}
                    onChange={(e) => setBackupDirectorEmail(e.target.value)}
                    placeholder="jane@example.com"
                    required
                    className="w-full px-4 py-2 border border-input rounded-lg bg-background input-focus"
                  />
                </div>

                <div className="pt-4">
                  <CustomButton
                    type="submit"
                    className="w-full"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <span className="flex items-center justify-center">
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Sending Invitation...
                      </span>
                    ) : (
                      <span className="flex items-center justify-center">
                        Send Invitation <ChevronRight size={16} className="ml-2" />
                      </span>
                    )}
                  </CustomButton>
                </div>
              </form>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-6 text-center py-6"
            >
              <div className="flex justify-center">
                <CheckCircle size={60} className="text-primary" />
              </div>
              <div className="space-y-4">
                <h3 className="text-xl font-medium">Invitation Sent!</h3>
                <p className="text-muted-foreground">
                  We've sent an invitation to {backupDirectorEmail}. Once they accept, they'll be set as your backup director.
                </p>
                <div className="bg-primary/10 p-4 rounded-lg flex gap-3 text-left">
                  <Mail className="text-primary flex-shrink-0" />
                  <p className="text-sm">
                    <span className="font-medium">Next steps:</span> We'll now guide you through setting up your organization, 
                    creating your first project, and adding team members.
                  </p>
                </div>
              </div>

              <div className="pt-4">
                <CustomButton
                  onClick={goToDashboard}
                  className="w-full"
                >
                  Continue to Dashboard <ChevronRight size={16} className="ml-1" />
                </CustomButton>
              </div>
            </motion.div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
};

export default DirectorOnboarding;
