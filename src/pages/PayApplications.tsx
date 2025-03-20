
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { FileText, Plus, Search, ArrowRight } from 'lucide-react';
import Sidebar from '@/components/layout/Sidebar';
import { useAuth } from '@/contexts/AuthContext';
import { useApi } from '@/hooks/use-api';
import { CustomButton } from '@/components/ui/custom-button';
import { cn } from '@/lib/utils';

const PayApplications = () => {
  const { user } = useAuth();
  const { getPayApplications } = useApi();
  const [applications, setApplications] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        setIsLoading(true);
        const applicationsData = await getPayApplications();
        setApplications(applicationsData);
      } catch (error) {
        console.error('Error fetching pay applications:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchApplications();
  }, []);

  const filteredApplications = applications.filter(app => 
    app.projectName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    app.contractor.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const StatusBadge = ({ status }: { status: string }) => {
    const statusStyles = {
      approved: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
      pending_review: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
      changes_requested: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
    };
  
    const statusText = {
      approved: "Approved",
      pending_review: "Pending Review",
      changes_requested: "Changes Requested",
    };
  
    return (
      <span className={cn(
        "px-2.5 py-0.5 text-xs font-medium rounded-full",
        statusStyles[status as keyof typeof statusStyles]
      )}>
        {statusText[status as keyof typeof statusText]}
      </span>
    );
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
                <h1 className="text-2xl md:text-3xl font-bold">Pay Applications</h1>
                <p className="text-muted-foreground mt-1">Manage payment applications for your projects</p>
              </div>

              {user?.role === 'contractor' && (
                <Link to="/applications/new">
                  <CustomButton>
                    <Plus size={16} className="mr-2" /> New Application
                  </CustomButton>
                </Link>
              )}
            </div>
          </motion.div>

          <div className="mb-6">
            <div className="relative max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search applications..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-2 w-full border border-input rounded-lg bg-background input-focus"
              />
            </div>
          </div>

          {isLoading ? (
            <div className="flex justify-center py-12">
              <div className="animate-spin h-8 w-8 border-4 border-primary rounded-full border-t-transparent"></div>
            </div>
          ) : filteredApplications.length === 0 ? (
            <div className="text-center py-12">
              <FileText size={48} className="mx-auto text-muted-foreground opacity-20 mb-4" />
              <h3 className="text-lg font-medium mb-2">No applications found</h3>
              <p className="text-muted-foreground mb-6">
                {searchQuery ? 'Try a different search query' : 'No pay applications have been submitted yet'}
              </p>
              {user?.role === 'contractor' && (
                <Link to="/applications/new">
                  <CustomButton>
                    <Plus size={16} className="mr-2" /> New Application
                  </CustomButton>
                </Link>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4">
              {filteredApplications.map((app, index) => (
                <motion.div
                  key={app.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ 
                    duration: 0.4,
                    delay: index * 0.1,
                    ease: [0.22, 1, 0.36, 1]
                  }}
                >
                  <Link to={`/applications/${app.id}`}>
                    <div className="bg-white dark:bg-gray-900 rounded-xl overflow-hidden shadow-card hover:shadow-elevation transition-all duration-300 hover:translate-y-[-2px]">
                      <div className="p-6">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                          <div>
                            <div className="flex items-center gap-2 mb-2">
                              <h3 className="font-medium text-lg">Application #{app.id.slice(-4)}</h3>
                              <StatusBadge status={app.status} />
                            </div>
                            <p className="text-muted-foreground">{app.projectName}</p>
                          </div>
                          <div className="flex items-center gap-3">
                            <div className="flex flex-col items-end">
                              <div className="text-sm font-medium">{app.amount}</div>
                              <div className="text-xs text-muted-foreground">
                                Submitted: {new Date(app.submittedDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                              </div>
                            </div>
                          </div>
                        </div>
                        
                        <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div className="flex items-center gap-2">
                            <div className="text-sm">Contractor: {app.contractor}</div>
                          </div>
                          {app.currentReviewer && (
                            <div className="flex items-center gap-2">
                              <div className="text-sm">Current Reviewer: {app.currentReviewer}</div>
                            </div>
                          )}
                        </div>
                      </div>
                      
                      <div className="px-6 py-3 bg-muted/30 dark:bg-muted/10 border-t border-border">
                        <div className="flex items-center justify-end text-sm text-primary font-medium hover:underline">
                          View Details <ArrowRight size={14} className="ml-1" />
                        </div>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default PayApplications;
