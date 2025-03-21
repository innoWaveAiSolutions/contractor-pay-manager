
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Users, 
  UserCheck, 
  Shield, 
  Mail, 
  Building, 
  CreditCard, 
  PlusCircle, 
  Settings, 
  ChevronRight 
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useApi } from '@/hooks/use-api';
import Sidebar from '@/components/layout/Sidebar';
import { CustomButton } from '@/components/ui/custom-button';
import InviteTeamModal from '@/components/team/InviteTeamModal';
import { toast } from 'sonner';

// Mock organization data
const mockOrganizationData = {
  id: 'org1',
  name: 'Demo Organization',
  created: '2023-06-15',
  subscription: {
    plan: 'Pro',
    price: '$11.99/month',
    members: {
      directors: { allowed: 1, used: 1 },
      projectManagers: { allowed: 4, used: 2 },
      reviewers: { allowed: 4, used: 1 },
      contractors: { allowed: 4, used: 3 }
    },
    nextBillingDate: '2023-11-15'
  },
  members: [
    { id: 'u1', name: 'Director User', email: 'director@example.com', role: 'director', status: 'active' },
    { id: 'u2', name: 'Project Manager 1', email: 'pm1@example.com', role: 'pm', status: 'active' },
    { id: 'u3', name: 'Project Manager 2', email: 'pm2@example.com', role: 'pm', status: 'active' },
    { id: 'u4', name: 'Reviewer User', email: 'reviewer@example.com', role: 'reviewer', status: 'active' },
    { id: 'u5', name: 'Contractor 1', email: 'contractor1@example.com', role: 'contractor', status: 'active' },
    { id: 'u6', name: 'Contractor 2', email: 'contractor2@example.com', role: 'contractor', status: 'active' },
    { id: 'u7', name: 'Contractor 3', email: 'contractor3@example.com', role: 'contractor', status: 'active' },
    { id: 'u8', name: 'Pending PM', email: 'pm3@example.com', role: 'pm', status: 'pending' }
  ],
  backupDirector: { id: 'u3', name: 'Project Manager 2', email: 'pm2@example.com' }
};

const Organization = () => {
  const { user } = useAuth();
  const [organization, setOrganization] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  const [selectedRole, setSelectedRole] = useState('pm');
  const [showBackupDirectorModal, setShowBackupDirectorModal] = useState(false);
  const [backupDirectorEmail, setBackupDirectorEmail] = useState('');

  useEffect(() => {
    // Check if the user is a director
    if (user && user.role !== 'director') {
      // Redirect to dashboard if not a director
      window.location.href = '/dashboard';
      return;
    }

    // Fetch organization data
    const fetchOrganizationData = async () => {
      try {
        setIsLoading(true);
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 800));
        setOrganization(mockOrganizationData);
      } catch (error) {
        console.error('Error fetching organization data:', error);
        toast.error('Failed to load organization data');
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrganizationData();
  }, [user]);

  const openInviteModal = (role: string) => {
    setSelectedRole(role);
    setIsInviteModalOpen(true);
  };

  const handleSetBackupDirector = async () => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast.success('Backup Director has been set successfully');
      setShowBackupDirectorModal(false);
      
      // Update the UI with the new backup director
      // In a real application, you would refresh the data from the API
      const updatedOrg = { ...organization };
      const member = updatedOrg.members.find((m: any) => m.email === backupDirectorEmail);
      
      if (member) {
        updatedOrg.backupDirector = { id: member.id, name: member.name, email: member.email };
        setOrganization(updatedOrg);
      }
    } catch (error) {
      console.error('Error setting backup director:', error);
      toast.error('Failed to set backup director');
    }
  };

  // Role icons map
  const roleIconMap: Record<string, React.ReactNode> = {
    director: <Shield size={18} className="text-primary" />,
    pm: <UserCheck size={18} className="text-emerald-500" />,
    reviewer: <Users size={18} className="text-amber-500" />,
    contractor: <Building size={18} className="text-violet-500" />
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Sidebar userRole={user?.role || 'director'} />
        <main className="pt-16 pb-12 pl-0 md:pl-20 lg:pl-64">
          <div className="flex justify-center items-center h-[calc(100vh-150px)]">
            <div className="animate-spin h-8 w-8 border-4 border-primary rounded-full border-t-transparent"></div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Sidebar userRole={user?.role || 'director'} />
      
      <main className="pt-16 pb-12 pl-0 md:pl-20 lg:pl-64">
        <div className="px-6 md:px-8 max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
              <div>
                <h1 className="text-2xl md:text-3xl font-bold">Organization</h1>
                <p className="text-muted-foreground mt-1">Manage your organization settings and team</p>
              </div>
            </div>
          </motion.div>

          {organization && (
            <>
              {/* Organization Overview */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                {/* Organization Details */}
                <div className="lg:col-span-2 bg-white dark:bg-gray-900 rounded-xl shadow-card">
                  <div className="p-6 border-b border-border">
                    <h2 className="text-lg font-semibold">Organization Details</h2>
                  </div>
                  <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <p className="text-sm text-muted-foreground">Organization Name</p>
                      <p className="font-medium">{organization.name}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Created</p>
                      <p className="font-medium">{new Date(organization.created).toLocaleDateString()}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Backup Director</p>
                      <div className="flex items-center justify-between">
                        <p className="font-medium">
                          {organization.backupDirector ? organization.backupDirector.name : 'Not set'}
                        </p>
                        <button 
                          onClick={() => setShowBackupDirectorModal(true)}
                          className="text-xs text-primary hover:underline"
                        >
                          {organization.backupDirector ? 'Change' : 'Set Backup'}
                        </button>
                      </div>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Organization ID</p>
                      <p className="font-medium">{organization.id}</p>
                    </div>
                  </div>
                </div>

                {/* Subscription Info */}
                <div className="bg-white dark:bg-gray-900 rounded-xl shadow-card">
                  <div className="p-6 border-b border-border">
                    <h2 className="text-lg font-semibold">Subscription</h2>
                  </div>
                  <div className="p-6">
                    <div className="mb-4 pb-4 border-b border-border">
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-medium">{organization.subscription.plan} Plan</span>
                        <span className="text-sm text-primary font-medium">{organization.subscription.price}</span>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Next billing: {new Date(organization.subscription.nextBillingDate).toLocaleDateString()}
                      </p>
                    </div>
                    
                    <div className="space-y-3">
                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-sm">Directors</span>
                          <span className="text-sm">{organization.subscription.members.directors.used}/{organization.subscription.members.directors.allowed}</span>
                        </div>
                        <div className="w-full h-2 bg-muted rounded overflow-hidden">
                          <div 
                            className="h-full bg-primary" 
                            style={{ width: `${(organization.subscription.members.directors.used / organization.subscription.members.directors.allowed) * 100}%` }}
                          ></div>
                        </div>
                      </div>
                      
                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-sm">Project Managers</span>
                          <span className="text-sm">{organization.subscription.members.projectManagers.used}/{organization.subscription.members.projectManagers.allowed}</span>
                        </div>
                        <div className="w-full h-2 bg-muted rounded overflow-hidden">
                          <div 
                            className="h-full bg-emerald-500" 
                            style={{ width: `${(organization.subscription.members.projectManagers.used / organization.subscription.members.projectManagers.allowed) * 100}%` }}
                          ></div>
                        </div>
                      </div>
                      
                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-sm">Reviewers</span>
                          <span className="text-sm">{organization.subscription.members.reviewers.used}/{organization.subscription.members.reviewers.allowed}</span>
                        </div>
                        <div className="w-full h-2 bg-muted rounded overflow-hidden">
                          <div 
                            className="h-full bg-amber-500" 
                            style={{ width: `${(organization.subscription.members.reviewers.used / organization.subscription.members.reviewers.allowed) * 100}%` }}
                          ></div>
                        </div>
                      </div>
                      
                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-sm">Contractors</span>
                          <span className="text-sm">{organization.subscription.members.contractors.used}/{organization.subscription.members.contractors.allowed}</span>
                        </div>
                        <div className="w-full h-2 bg-muted rounded overflow-hidden">
                          <div 
                            className="h-full bg-violet-500" 
                            style={{ width: `${(organization.subscription.members.contractors.used / organization.subscription.members.contractors.allowed) * 100}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>

                    <button className="w-full flex items-center justify-center gap-1 text-primary font-medium hover:underline mt-6">
                      <CreditCard size={16} />
                      <span>Manage Subscription</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Team Members */}
              <div className="bg-white dark:bg-gray-900 rounded-xl shadow-card mb-8">
                <div className="p-6 border-b border-border flex items-center justify-between">
                  <h2 className="text-lg font-semibold">Team Members</h2>
                  <div className="flex gap-2">
                    <div className="relative">
                      <select 
                        className="appearance-none bg-transparent pr-8 text-primary text-sm font-medium cursor-pointer focus:outline-none"
                        onChange={(e) => openInviteModal(e.target.value)}
                        value=""
                      >
                        <option value="" disabled>Invite Member</option>
                        <option value="pm">Project Manager</option>
                        <option value="reviewer">Reviewer</option>
                        <option value="contractor">Contractor</option>
                      </select>
                      <PlusCircle size={16} className="absolute right-0 top-1/2 -translate-y-1/2 text-primary pointer-events-none" />
                    </div>
                  </div>
                </div>
                <div className="p-6">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="text-left text-xs text-muted-foreground border-b border-border">
                          <th className="pb-3 font-medium">Name</th>
                          <th className="pb-3 font-medium">Email</th>
                          <th className="pb-3 font-medium">Role</th>
                          <th className="pb-3 font-medium">Status</th>
                          <th className="pb-3 font-medium sr-only">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {organization.members.map((member: any) => (
                          <tr key={member.id} className="border-b border-border">
                            <td className="py-3 pr-4 font-medium">{member.name}</td>
                            <td className="py-3 pr-4 text-muted-foreground">{member.email}</td>
                            <td className="py-3 pr-4">
                              <div className="flex items-center gap-1.5">
                                {roleIconMap[member.role]}
                                <span className="capitalize">
                                  {member.role === 'pm' ? 'Project Manager' : member.role}
                                </span>
                              </div>
                            </td>
                            <td className="py-3 pr-4">
                              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                member.status === 'active' 
                                  ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' 
                                  : 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400'
                              }`}>
                                {member.status === 'active' ? 'Active' : 'Pending'}
                              </span>
                            </td>
                            <td className="py-3 text-right">
                              <button className="text-muted-foreground hover:text-foreground">
                                <ChevronRight size={16} />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>

              {/* Organization Settings */}
              <div className="bg-white dark:bg-gray-900 rounded-xl shadow-card">
                <div className="p-6 border-b border-border">
                  <h2 className="text-lg font-semibold">Organization Settings</h2>
                </div>
                <div className="p-6 space-y-4">
                  <div className="flex items-center justify-between pb-4 border-b border-border">
                    <div>
                      <h3 className="font-medium">PM Project Creation</h3>
                      <p className="text-sm text-muted-foreground">Allow Project Managers to create new projects</p>
                    </div>
                    <div className="relative inline-block w-12 h-6 transition duration-200 ease-in-out rounded-full">
                      <input 
                        type="checkbox" 
                        id="pm-project-creation" 
                        className="absolute w-6 h-6 transition duration-200 ease-in-out transform bg-white border rounded-full appearance-none cursor-pointer peer border-border checked:right-0 checked:border-primary peer-checked:bg-primary checked:bg-primary focus:outline-none focus:ring-0 left-0"
                        defaultChecked={true}
                      />
                      <label 
                        htmlFor="pm-project-creation" 
                        className="block h-full overflow-hidden rounded-full cursor-pointer bg-muted peer-checked:bg-primary/30"
                      ></label>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between pb-4 border-b border-border">
                    <div>
                      <h3 className="font-medium">Required Backup Director</h3>
                      <p className="text-sm text-muted-foreground">Require a backup director to be set before creating projects</p>
                    </div>
                    <div className="relative inline-block w-12 h-6 transition duration-200 ease-in-out rounded-full">
                      <input 
                        type="checkbox" 
                        id="backup-director" 
                        className="absolute w-6 h-6 transition duration-200 ease-in-out transform bg-white border rounded-full appearance-none cursor-pointer peer border-border checked:right-0 checked:border-primary peer-checked:bg-primary checked:bg-primary focus:outline-none focus:ring-0 left-0"
                        defaultChecked={true}
                      />
                      <label 
                        htmlFor="backup-director" 
                        className="block h-full overflow-hidden rounded-full cursor-pointer bg-muted peer-checked:bg-primary/30"
                      ></label>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium">Director Auto Approval</h3>
                      <p className="text-sm text-muted-foreground">Always make the Director the final approver on all projects</p>
                    </div>
                    <div className="relative inline-block w-12 h-6 transition duration-200 ease-in-out rounded-full">
                      <input 
                        type="checkbox" 
                        id="director-approval" 
                        className="absolute w-6 h-6 transition duration-200 ease-in-out transform bg-white border rounded-full appearance-none cursor-pointer peer border-border checked:right-0 checked:border-primary peer-checked:bg-primary checked:bg-primary focus:outline-none focus:ring-0 left-0"
                        defaultChecked={true}
                      />
                      <label 
                        htmlFor="director-approval" 
                        className="block h-full overflow-hidden rounded-full cursor-pointer bg-muted peer-checked:bg-primary/30"
                      ></label>
                    </div>
                  </div>

                  <div className="pt-4 flex justify-end">
                    <CustomButton>
                      <Settings size={16} className="mr-2" /> Save Settings
                    </CustomButton>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </main>

      {/* Invite Team Modal */}
      <InviteTeamModal 
        isOpen={isInviteModalOpen} 
        onClose={() => setIsInviteModalOpen(false)} 
        defaultRole={selectedRole}
      />

      {/* Backup Director Modal */}
      {showBackupDirectorModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white dark:bg-gray-900 rounded-xl shadow-elevation max-w-md w-full">
            <div className="p-6 border-b border-border flex items-center justify-between">
              <h2 className="text-xl font-semibold">Set Backup Director</h2>
              <button
                onClick={() => setShowBackupDirectorModal(false)}
                className="h-8 w-8 rounded-md flex items-center justify-center hover:bg-muted transition-colors"
              >
                <Shield size={18} />
              </button>
            </div>

            <div className="p-6 space-y-6">
              <p className="text-sm text-muted-foreground">
                The backup director will automatically inherit access if you're inactive for 60 days. They must be an existing member of your organization.
              </p>
              
              <div className="space-y-2">
                <label htmlFor="backup-email" className="text-sm font-medium">Email Address *</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <input
                    id="backup-email"
                    type="email"
                    value={backupDirectorEmail}
                    onChange={(e) => setBackupDirectorEmail(e.target.value)}
                    required
                    placeholder="name@example.com"
                    className="w-full pl-10 pr-4 py-2 border border-input rounded-lg bg-background input-focus"
                  />
                </div>
              </div>
            </div>

            <div className="p-6 border-t border-border flex justify-end gap-2">
              <CustomButton
                type="button"
                variant="outline"
                onClick={() => setShowBackupDirectorModal(false)}
              >
                Cancel
              </CustomButton>
              <CustomButton
                type="button"
                onClick={handleSetBackupDirector}
              >
                Set Backup Director
              </CustomButton>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Organization;
