
import { useState } from 'react';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { CustomButton } from '@/components/ui/custom-button';
import { X, Building } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

interface CreateOrganizationModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultName?: string;
}

const CreateOrganizationModal = ({ isOpen, onClose, defaultName = '' }: CreateOrganizationModalProps) => {
  const { user } = useAuth();
  const [name, setName] = useState(defaultName || '');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name) {
      toast.error('Organization name is required');
      return;
    }
    
    try {
      setIsLoading(true);
      
      // In a real implementation, we would create the organization via an API call
      // For now, just simulate success and show toast
      
      setTimeout(() => {
        toast.success(`Organization "${name}" created successfully`);
        handleClose();
        
        // Force reload to see the changes
        window.location.reload();
      }, 1000);
      
    } catch (error) {
      console.error('Failed to create organization:', error);
      toast.error('Failed to create organization');
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setName(defaultName || '');
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">Create Organization</DialogTitle>
          <button 
            className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100"
            onClick={handleClose}
          >
            <X className="h-4 w-4" />
            <span className="sr-only">Close</span>
          </button>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <div className="space-y-2">
            <label htmlFor="organization-name" className="text-sm font-medium">
              Organization Name
            </label>
            <input
              id="organization-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-2 border border-input rounded-lg bg-background"
              placeholder="Acme Construction Co."
            />
          </div>

          <DialogFooter className="pt-4">
            <CustomButton
              type="button"
              variant="outline"
              onClick={handleClose}
            >
              Cancel
            </CustomButton>
            <CustomButton
              type="submit"
              disabled={isLoading || !name}
            >
              <Building className="mr-2 h-4 w-4" /> Create Organization
            </CustomButton>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateOrganizationModal;
