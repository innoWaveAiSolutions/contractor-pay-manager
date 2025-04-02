
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Sidebar from '@/components/layout/Sidebar';
import { useAuth } from '@/contexts/AuthContext';
import { useApi } from '@/hooks/use-api';
import { Plus } from 'lucide-react';
import { CustomButton } from '@/components/ui/custom-button';
import InviteTeamModal from '@/components/team/InviteTeamModal';
import TeamTutorial from '@/components/onboarding/TeamTutorial';

const Team = () => {
  const { user } = useAuth();
  const { getContractors, getReviewers } = useApi();
  const [contractors, setContractors] = useState<any[]>([]);
  const [reviewers, setReviewers] = useState<any[]>([]);
  const [projectManagers, setProjectManagers] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  const [selectedRole, setSelectedRole] = useState('contractor');

  // Show tutorial if needed
  const showTutorial = user?.role === 'director' && 
    !localStorage.getItem('teamTutorialComplete') && 
    localStorage.getItem('organizationTutorialComplete') === 'true';

  useEffect(() => {
    const fetchTeamMembers = async () => {
      try {
        setIsLoading(true);
        
        if (user?.role === 'pm' || user?.role === 'director') {
          // For this demo, we're using mock data until the backend is ready
          const contractorsData = await getContractors();
          const reviewersData = await getReviewers();
          
          setContractors(contractorsData || []);
          setReviewers(reviewersData || []);
          
          // Add mock project managers for directors
          if (user?.role === 'director') {
            setProjectManagers([
              { id: 1, name: 'Jane Smith', email: 'jane@example.com', projectsManaged: 2 },
              { id: 2, name: 'Mark Johnson', email: 'mark@example.com', projectsManaged: 1 },
            ]);
          }
        }
      } catch (error) {
        console.error('Error fetching team members:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchTeamMembers();
  }, [user]);

  const openInviteModal = (role: string) => {
    setSelectedRole(role);
    setIsInviteModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-background">
      <Sidebar userRole={user?.role || 'pm'} />
      
      <main className="pt-16 pb-12 pl-0 md:pl-20 lg:pl-64">
        <div className="px-6 md:px-8 max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
              <div>
                <h1 className="text-2xl md:text-3xl font-bold">Team</h1>
                <p className="text-muted-foreground mt-1">
                  {user?.role === 'pm' || user?.role === 'director' 
                    ? 'Manage your contractors and reviewers' 
                    : 'Your team members'}
                </p>
              </div>

              {(user?.role === 'pm' || user?.role === 'director') && (
                <div className="flex gap-2 flex-wrap">
                  <CustomButton onClick={() => openInviteModal('contractor')}>
                    <Plus size={16} className="mr-2" /> Add Contractor
                  </CustomButton>
                  <CustomButton variant="outline" onClick={() => openInviteModal('reviewer')}>
                    <Plus size={16} className="mr-2" /> Add Reviewer
                  </CustomButton>
                  {user?.role === 'director' && (
                    <CustomButton variant="outline" onClick={() => openInviteModal('pm')}>
                      <Plus size={16} className="mr-2" /> Add PM
                    </CustomButton>
                  )}
                </div>
              )}
            </div>
          </motion.div>

          {isLoading ? (
            <div className="flex justify-center py-12">
              <div className="animate-spin h-8 w-8 border-4 border-primary rounded-full border-t-transparent"></div>
            </div>
          ) : (
            <>
              {/* Project Managers section (for directors only) */}
              {user?.role === 'director' && (
                <div className="mb-10">
                  <h2 className="text-xl font-semibold mb-4">Project Managers</h2>
                  {projectManagers.length > 0 ? (
                    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden">
                      <div className="overflow-x-auto">
                        <table className="w-full">
                          <thead>
                            <tr className="bg-gray-50 dark:bg-gray-900/50 text-left">
                              <th className="px-6 py-3 text-sm font-medium">Name</th>
                              <th className="px-6 py-3 text-sm font-medium">Email</th>
                              <th className="px-6 py-3 text-sm font-medium">Projects Managed</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                            {projectManagers.map((pm) => (
                              <tr key={pm.id} className="hover:bg-gray-50 dark:hover:bg-gray-900/20">
                                <td className="px-6 py-4 whitespace-nowrap">{pm.name}</td>
                                <td className="px-6 py-4 whitespace-nowrap">{pm.email}</td>
                                <td className="px-6 py-4 whitespace-nowrap">{pm.projectsManaged}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-8 border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-lg">
                      <p className="text-muted-foreground mb-4">No project managers added yet</p>
                      <CustomButton onClick={() => openInviteModal('pm')} variant="outline">
                        <Plus size={16} className="mr-2" /> Add Project Manager
                      </CustomButton>
                    </div>
                  )}
                </div>
              )}

              {/* Contractors section */}
              <div className="mb-10">
                <h2 className="text-xl font-semibold mb-4">Contractors</h2>
                {contractors.length > 0 ? (
                  <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden">
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr className="bg-gray-50 dark:bg-gray-900/50 text-left">
                            <th className="px-6 py-3 text-sm font-medium">Name</th>
                            <th className="px-6 py-3 text-sm font-medium">Email</th>
                            <th className="px-6 py-3 text-sm font-medium">Projects Assigned</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                          {contractors.map((contractor) => (
                            <tr key={contractor.id} className="hover:bg-gray-50 dark:hover:bg-gray-900/20">
                              <td className="px-6 py-4 whitespace-nowrap">{contractor.name}</td>
                              <td className="px-6 py-4 whitespace-nowrap">{contractor.email}</td>
                              <td className="px-6 py-4 whitespace-nowrap">{contractor.projectsAssigned}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8 border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-lg">
                    <p className="text-muted-foreground mb-4">No contractors added yet</p>
                    <CustomButton onClick={() => openInviteModal('contractor')}>
                      <Plus size={16} className="mr-2" /> Add Contractor
                    </CustomButton>
                  </div>
                )}
              </div>

              {/* Reviewers section */}
              <div className="mb-10">
                <h2 className="text-xl font-semibold mb-4">Reviewers</h2>
                {reviewers.length > 0 ? (
                  <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden">
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr className="bg-gray-50 dark:bg-gray-900/50 text-left">
                            <th className="px-6 py-3 text-sm font-medium">Name</th>
                            <th className="px-6 py-3 text-sm font-medium">Email</th>
                            <th className="px-6 py-3 text-sm font-medium">Assigned Applications</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                          {reviewers.map((reviewer) => (
                            <tr key={reviewer.id} className="hover:bg-gray-50 dark:hover:bg-gray-900/20">
                              <td className="px-6 py-4 whitespace-nowrap">{reviewer.name}</td>
                              <td className="px-6 py-4 whitespace-nowrap">{reviewer.email}</td>
                              <td className="px-6 py-4 whitespace-nowrap">{reviewer.assignedApplications}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8 border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-lg">
                    <p className="text-muted-foreground mb-4">No reviewers added yet</p>
                    <CustomButton onClick={() => openInviteModal('reviewer')} variant="outline">
                      <Plus size={16} className="mr-2" /> Add Reviewer
                    </CustomButton>
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </main>

      {/* Show tutorial if needed */}
      {showTutorial && <TeamTutorial />}

      <InviteTeamModal
        isOpen={isInviteModalOpen}
        onClose={() => setIsInviteModalOpen(false)}
        defaultRole={selectedRole}
      />
    </div>
  );
};

export default Team;
