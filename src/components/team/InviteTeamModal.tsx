
import { useState } from 'react';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { CustomButton } from '@/components/ui/custom-button';
import { X, Mail } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useApi } from '@/hooks/use-api';
import { toast } from 'sonner';

interface InviteTeamModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultRole?: string;
}

const InviteTeamModal = ({ isOpen, onClose, defaultRole = 'contractor' }: InviteTeamModalProps) => {
  const { user } = useAuth();
  const { inviteTeamMember, isLoading } = useApi();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState(defaultRole);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name || !email) {
      toast.error('Name and email are required');
      return;
    }
    
    try {
      const result = await inviteTeamMember({ name, email, role });
      
      if (result.success) {
        toast.success(`Invitation sent to ${email}`);
        handleClose();
      } else {
        toast.error('Failed to send invitation');
      }
    } catch (error) {
      console.error('Error sending invitation:', error);
      toast.error('An error occurred while sending the invitation');
    }
  };

  const handleClose = () => {
    setName('');
    setEmail('');
    setRole(defaultRole);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">Invite Team Member</DialogTitle>
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
            <label htmlFor="name" className="text-sm font-medium">
              Full Name
            </label>
            <input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-2 border border-input rounded-lg bg-background"
              placeholder="John Doe"
            />
          </div>
          
          <div className="space-y-2">
            <label htmlFor="email" className="text-sm font-medium">
              Email Address
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 border border-input rounded-lg bg-background"
              placeholder="john@example.com"
            />
          </div>
          
          <div className="space-y-2">
            <label htmlFor="role" className="text-sm font-medium">
              Role
            </label>
            <select
              id="role"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full px-4 py-2 border border-input rounded-lg bg-background"
            >
              <option value="contractor">Contractor</option>
              <option value="reviewer">Reviewer</option>
              {user?.role === 'director' && (
                <option value="pm">Project Manager</option>
              )}
            </select>
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
              disabled={isLoading || !name || !email}
            >
              <Mail className="mr-2 h-4 w-4" /> Send Invitation
            </CustomButton>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default InviteTeamModal;
