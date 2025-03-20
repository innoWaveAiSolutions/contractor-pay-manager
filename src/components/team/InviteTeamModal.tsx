
import { useState } from 'react';
import { X, Mail } from 'lucide-react';
import { CustomButton } from '@/components/ui/custom-button';
import { useApi } from '@/hooks/use-api';
import { toast } from 'sonner';
import { UserRole } from '@/contexts/AuthContext';

interface InviteTeamModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultRole?: string;
}

const InviteTeamModal = ({ isOpen, onClose, defaultRole = 'contractor' }: InviteTeamModalProps) => {
  const { inviteTeamMember } = useApi();
  const [email, setEmail] = useState('');
  const [role, setRole] = useState(defaultRole);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setIsLoading(true);
      await inviteTeamMember(email, role);
      toast.success(`Invitation sent to ${email}`);
      onClose();
      setEmail('');
    } catch (error) {
      console.error('Error inviting team member:', error);
      toast.error('Failed to send invitation. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white dark:bg-gray-900 rounded-xl shadow-elevation max-w-md w-full">
        <div className="p-6 border-b border-border flex items-center justify-between">
          <h2 className="text-xl font-semibold">Invite Team Member</h2>
          <button
            onClick={onClose}
            className="h-8 w-8 rounded-md flex items-center justify-center hover:bg-muted transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="space-y-2">
            <label htmlFor="email" className="text-sm font-medium">Email Address *</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="name@example.com"
                className="w-full pl-10 pr-4 py-2 border border-input rounded-lg bg-background input-focus"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label htmlFor="role" className="text-sm font-medium">Role *</label>
            <select
              id="role"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full px-4 py-2 border border-input rounded-lg bg-background input-focus"
            >
              <option value="contractor">Contractor</option>
              <option value="reviewer">Reviewer</option>
              <option value="pm">Project Manager</option>
            </select>
          </div>

          <div className="pt-4 flex justify-end gap-2">
            <CustomButton
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isLoading}
            >
              Cancel
            </CustomButton>
            <CustomButton
              type="submit"
              disabled={isLoading}
            >
              {isLoading ? (
                <span className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Sending...
                </span>
              ) : 'Send Invitation'}
            </CustomButton>
          </div>
        </form>
      </div>
    </div>
  );
};

export default InviteTeamModal;
