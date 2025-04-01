
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Sidebar from '@/components/layout/Sidebar';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import OrganizationTutorial from '@/components/onboarding/OrganizationTutorial';

const Organization = () => {
  const { user } = useAuth();
  const [organization, setOrganization] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchOrganizationDetails = async () => {
      if (!user?.organizationId) {
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        const orgId = typeof user.organizationId === 'string' ? parseInt(user.organizationId, 10) : user.organizationId;
        
        const { data, error } = await supabase
          .from('organizations')
          .select('*')
          .eq('id', orgId)
          .single();

        if (error) throw error;
        setOrganization(data);
        
      } catch (error) {
        console.error('Error fetching organization details:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrganizationDetails();
  }, [user?.organizationId]);

  // Show tutorial if needed
  const showTutorial = user?.role === 'director' && 
    !localStorage.getItem('organizationTutorialComplete') && 
    localStorage.getItem('projectsTutorialComplete') === 'true';

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
            <div className="mb-8">
              <h1 className="text-2xl md:text-3xl font-bold">Organization</h1>
              <p className="text-muted-foreground mt-1">Manage your organization settings and preferences</p>
            </div>
          </motion.div>

          {isLoading ? (
            <div className="flex justify-center py-12">
              <div className="animate-spin h-8 w-8 border-4 border-primary rounded-full border-t-transparent"></div>
            </div>
          ) : organization ? (
            <div className="space-y-8">
              {/* Organization details */}
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
                <h2 className="text-xl font-semibold mb-4">Organization Details</h2>
                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Name</p>
                    <p className="mt-1">{organization.name}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Subscription Plan</p>
                    <p className="mt-1">{organization.subscription_plan || 'Free'}</p>
                  </div>
                </div>
              </div>

              {/* Organization settings */}
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
                <h2 className="text-xl font-semibold mb-4">Settings</h2>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Allow PMs to create projects</p>
                      <p className="text-sm text-muted-foreground">Project managers can create new projects</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" className="sr-only peer" defaultChecked={organization.allow_pm_project_creation} />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-primary"></div>
                    </label>
                  </div>
                </div>
              </div>

              {/* Team structure */}
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
                <h2 className="text-xl font-semibold mb-4">Team Structure</h2>
                <div className="space-y-2">
                  <p className="text-sm font-medium text-muted-foreground">Director</p>
                  <p>{user?.name}</p>
                  
                  <p className="text-sm font-medium text-muted-foreground mt-4">Backup Director</p>
                  <p>{organization.backup_director_id ? 'Set' : 'Not set'}</p>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-12 border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-lg">
              <h3 className="text-xl font-medium mb-2">No organization found</h3>
              <p className="text-muted-foreground">You're not currently assigned to an organization.</p>
            </div>
          )}
        </div>
      </main>

      {/* Show tutorial if needed */}
      {showTutorial && <OrganizationTutorial />}
    </div>
  );
};

export default Organization;
