
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Sidebar from '@/components/layout/Sidebar';
import { useAuth } from '@/contexts/AuthContext';
import { useApi } from '@/hooks/use-api';
import { CustomButton } from '@/components/ui/custom-button';
import { Search, Plus, UserCircle, Mail, Phone, Briefcase, FileText } from 'lucide-react';
import InviteTeamModal from '@/components/team/InviteTeamModal';

const Team = () => {
  const { user } = useAuth();
  const { getContractors, getReviewers } = useApi();
  const [activeTab, setActiveTab] = useState('contractors');
  const [contractors, setContractors] = useState<any[]>([]);
  const [reviewers, setReviewers] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);

  useEffect(() => {
    const fetchTeamMembers = async () => {
      try {
        setIsLoading(true);
        
        if (user?.role === 'pm' || user?.role === 'director') {
          if (activeTab === 'contractors' && user?.role === 'pm') {
            const contractorsData = await getContractors();
            setContractors(contractorsData);
          } else if (activeTab === 'reviewers') {
            const reviewersData = await getReviewers();
            setReviewers(reviewersData);
          }
        }
      } catch (error) {
        console.error('Error fetching team members:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTeamMembers();
  }, [activeTab, user?.role]);

  // Filter team members based on search query
  const filteredContractors = contractors.filter(c => 
    c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredReviewers = reviewers.filter(r => 
    r.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    r.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
                <h1 className="text-2xl md:text-3xl font-bold">Team Management</h1>
                <p className="text-muted-foreground mt-1">
                  {user?.role === 'director' 
                    ? 'Manage your organization members' 
                    : 'Manage contractors and reviewers'}
                </p>
              </div>

              {(user?.role === 'pm' || user?.role === 'director') && (
                <CustomButton onClick={() => setIsInviteModalOpen(true)}>
                  <Plus size={16} className="mr-2" /> Invite Team Member
                </CustomButton>
              )}
            </div>
          </motion.div>

          {user?.role === 'pm' && (
            <div className="mb-6 border-b border-border">
              <div className="flex space-x-6">
                <button
                  className={`pb-3 px-1 text-sm font-medium ${
                    activeTab === 'contractors'
                      ? 'text-primary border-b-2 border-primary'
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                  onClick={() => setActiveTab('contractors')}
                >
                  Contractors
                </button>
                <button
                  className={`pb-3 px-1 text-sm font-medium ${
                    activeTab === 'reviewers'
                      ? 'text-primary border-b-2 border-primary'
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                  onClick={() => setActiveTab('reviewers')}
                >
                  Reviewers
                </button>
              </div>
            </div>
          )}

          <div className="mb-6">
            <div className="relative max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                placeholder={`Search ${activeTab}...`}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-2 w-full border border-input rounded-lg bg-background input-focus"
              />
            </div>
          </div>

          {/* Team Members List */}
          {isLoading ? (
            <div className="flex justify-center py-12">
              <div className="animate-spin h-8 w-8 border-4 border-primary rounded-full border-t-transparent"></div>
            </div>
          ) : user?.role === 'director' && activeTab === 'contractors' ? (
            <div className="text-center py-12">
              <UserCircle size={48} className="mx-auto text-muted-foreground opacity-20 mb-4" />
              <h3 className="text-lg font-medium mb-2">Directors manage organizations</h3>
              <p className="text-muted-foreground mb-6">
                Please use the Reviewers tab to manage your organization's reviewers.
              </p>
              <CustomButton onClick={() => setActiveTab('reviewers')}>
                View Reviewers
              </CustomButton>
            </div>
          ) : activeTab === 'contractors' && filteredContractors.length === 0 ? (
            <div className="text-center py-12">
              <UserCircle size={48} className="mx-auto text-muted-foreground opacity-20 mb-4" />
              <h3 className="text-lg font-medium mb-2">No contractors found</h3>
              <p className="text-muted-foreground mb-6">
                {searchQuery ? 'Try a different search query' : 'Start by inviting contractors to your team'}
              </p>
              <CustomButton onClick={() => setIsInviteModalOpen(true)}>
                <Plus size={16} className="mr-2" /> Invite Contractor
              </CustomButton>
            </div>
          ) : activeTab === 'reviewers' && filteredReviewers.length === 0 ? (
            <div className="text-center py-12">
              <UserCircle size={48} className="mx-auto text-muted-foreground opacity-20 mb-4" />
              <h3 className="text-lg font-medium mb-2">No reviewers found</h3>
              <p className="text-muted-foreground mb-6">
                {searchQuery ? 'Try a different search query' : 'Start by inviting reviewers to your team'}
              </p>
              <CustomButton onClick={() => setIsInviteModalOpen(true)}>
                <Plus size={16} className="mr-2" /> Invite Reviewer
              </CustomButton>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {activeTab === 'contractors' && filteredContractors.map((contractor, index) => (
                <motion.div
                  key={contractor.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ 
                    duration: 0.4,
                    delay: index * 0.1,
                    ease: [0.22, 1, 0.36, 1]
                  }}
                >
                  <div className="bg-white dark:bg-gray-900 rounded-xl p-6 shadow-card hover:shadow-elevation transition-all duration-300">
                    <div className="flex items-start gap-4">
                      <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                        <UserCircle size={24} className="text-primary" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-medium text-lg">{contractor.name}</h3>
                        <div className="text-muted-foreground mb-3">Contractor</div>
                        
                        <div className="space-y-2">
                          <div className="flex items-center gap-2 text-sm">
                            <Mail size={14} className="text-muted-foreground" /> 
                            {contractor.email}
                          </div>
                          <div className="flex items-center gap-2 text-sm">
                            <Phone size={14} className="text-muted-foreground" /> 
                            {contractor.phone}
                          </div>
                          <div className="flex items-center gap-2 text-sm">
                            <Briefcase size={14} className="text-muted-foreground" /> 
                            {contractor.projectsAssigned} Projects Assigned
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
              
              {activeTab === 'reviewers' && filteredReviewers.map((reviewer, index) => (
                <motion.div
                  key={reviewer.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ 
                    duration: 0.4,
                    delay: index * 0.1,
                    ease: [0.22, 1, 0.36, 1]
                  }}
                >
                  <div className="bg-white dark:bg-gray-900 rounded-xl p-6 shadow-card hover:shadow-elevation transition-all duration-300">
                    <div className="flex items-start gap-4">
                      <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                        <UserCircle size={24} className="text-primary" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-medium text-lg">{reviewer.name}</h3>
                        <div className="text-muted-foreground mb-3">{reviewer.role}</div>
                        
                        <div className="space-y-2">
                          <div className="flex items-center gap-2 text-sm">
                            <Mail size={14} className="text-muted-foreground" /> 
                            {reviewer.email}
                          </div>
                          <div className="flex items-center gap-2 text-sm">
                            <FileText size={14} className="text-muted-foreground" /> 
                            {reviewer.assignedApplications} Applications Assigned
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </main>

      <InviteTeamModal 
        isOpen={isInviteModalOpen} 
        onClose={() => setIsInviteModalOpen(false)} 
        defaultRole={activeTab === 'contractors' ? 'contractor' : 'reviewer'}
      />
    </div>
  );
};

export default Team;
