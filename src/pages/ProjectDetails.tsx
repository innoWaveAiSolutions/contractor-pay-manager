
import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import Sidebar from '@/components/layout/Sidebar';
import { useAuth } from '@/contexts/AuthContext';
import { Briefcase, Calendar, Users, DollarSign, FileText, ArrowLeft } from 'lucide-react';
import { cn } from '@/lib/utils';
import { CustomButton } from '@/components/ui/custom-button';

const ProjectDetails = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const [project, setProject] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchProject = async () => {
      try {
        setIsLoading(true);
        // This would be an API call in a real application
        // For now, let's simulate a delay and return mock data
        await new Promise(resolve => setTimeout(resolve, 800));
        
        setProject({
          id,
          name: 'Office Building Renovation',
          client: 'Acme Corp',
          dueDate: '2023-12-15',
          status: 'active',
          totalBudget: '$250,000',
          description: 'Complete renovation of a 3-story office building including structural repairs, electrical upgrades, plumbing updates, and interior design overhaul.',
          location: '123 Business Park, Suite 101, New York, NY',
          startDate: '2023-01-15',
          endDate: '2023-12-15',
          contractors: [
            { id: 'c1', name: 'Smith Construction', role: 'General Contractor' },
            { id: 'c2', name: 'Johnson Electrical', role: 'Electrical Contractor' },
          ],
          reviewers: [
            { id: 'r1', name: 'Alice Wilson', role: 'Financial Auditor' },
            { id: 'r2', name: 'Bob Thomas', role: 'Technical Reviewer' },
          ],
          payApplications: [
            {
              id: 'pa1',
              submittedDate: '2023-06-15',
              amount: '$45,000',
              status: 'approved',
              contractor: 'Smith Construction',
            },
            {
              id: 'pa2',
              submittedDate: '2023-07-15',
              amount: '$30,000',
              status: 'pending_review',
              contractor: 'Johnson Electrical',
            },
          ],
        });
      } catch (error) {
        console.error('Error fetching project:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProject();
  }, [id]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Sidebar userRole={user?.role || 'pm'} />
        <main className="pt-16 pb-12 pl-0 md:pl-20 lg:pl-64">
          <div className="flex justify-center py-20">
            <div className="animate-spin h-8 w-8 border-4 border-primary rounded-full border-t-transparent"></div>
          </div>
        </main>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="min-h-screen bg-background">
        <Sidebar userRole={user?.role || 'pm'} />
        <main className="pt-16 pb-12 pl-0 md:pl-20 lg:pl-64">
          <div className="px-6 md:px-8 max-w-6xl mx-auto text-center py-20">
            <h2 className="text-2xl font-bold mb-2">Project Not Found</h2>
            <p className="text-muted-foreground mb-6">The project you're looking for doesn't exist or you don't have permission to view it.</p>
            <Link to="/projects">
              <CustomButton>
                <ArrowLeft size={16} className="mr-2" /> Back to Projects
              </CustomButton>
            </Link>
          </div>
        </main>
      </div>
    );
  }

  const StatusBadge = ({ status }: { status: string }) => {
    const statusStyles = {
      active: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
      review: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
      planning: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
      completed: "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400",
      approved: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
      pending_review: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
      changes_requested: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
    };
  
    const statusText = {
      active: "Active",
      review: "In Review",
      planning: "Planning",
      completed: "Completed",
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
          <div className="mb-6">
            <Link to="/projects" className="text-sm text-muted-foreground hover:text-foreground hover:underline flex items-center">
              <ArrowLeft size={16} className="mr-1" /> Back to Projects
            </Link>
          </div>

          <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <h1 className="text-2xl md:text-3xl font-bold">{project.name}</h1>
                <StatusBadge status={project.status} />
              </div>
              <p className="text-muted-foreground">{project.client}</p>
            </div>

            {(user?.role === 'pm' || user?.role === 'director') && (
              <div className="flex flex-wrap gap-2">
                <CustomButton size="sm" variant="outline">
                  Edit Project
                </CustomButton>
                {user?.role === 'pm' && (
                  <CustomButton size="sm" variant="outline">
                    <Users size={16} className="mr-2" /> Manage Team
                  </CustomButton>
                )}
              </div>
            )}
          </div>

          {/* Project Details */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="col-span-2">
              <div className="bg-white dark:bg-gray-900 rounded-xl p-6 shadow-card mb-6">
                <h2 className="text-xl font-semibold mb-4">Project Details</h2>
                <p className="text-muted-foreground mb-4">{project.description}</p>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex items-start gap-2">
                    <Calendar className="h-5 w-5 text-muted-foreground mt-0.5" />
                    <div>
                      <div className="text-sm font-medium">Timeline</div>
                      <div className="text-sm text-muted-foreground">
                        {new Date(project.startDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })} - 
                        {new Date(project.endDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-2">
                    <Briefcase className="h-5 w-5 text-muted-foreground mt-0.5" />
                    <div>
                      <div className="text-sm font-medium">Client</div>
                      <div className="text-sm text-muted-foreground">{project.client}</div>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-2">
                    <DollarSign className="h-5 w-5 text-muted-foreground mt-0.5" />
                    <div>
                      <div className="text-sm font-medium">Budget</div>
                      <div className="text-sm text-muted-foreground">{project.totalBudget}</div>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-2">
                    <Users className="h-5 w-5 text-muted-foreground mt-0.5" />
                    <div>
                      <div className="text-sm font-medium">Contractors</div>
                      <div className="text-sm text-muted-foreground">{project.contractors.length} assigned</div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Pay Applications */}
              <div className="bg-white dark:bg-gray-900 rounded-xl p-6 shadow-card">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-semibold">Pay Applications</h2>
                  {user?.role === 'contractor' && (
                    <Link to="/applications/new">
                      <CustomButton size="sm">
                        <FileText size={16} className="mr-2" /> New Application
                      </CustomButton>
                    </Link>
                  )}
                </div>
                
                {project.payApplications.length === 0 ? (
                  <p className="text-muted-foreground">No pay applications yet</p>
                ) : (
                  <div className="space-y-4">
                    {project.payApplications.map((app: any) => (
                      <Link to={`/applications/${app.id}`} key={app.id}>
                        <div className="border border-border rounded-lg p-4 hover:bg-accent/50 transition-colors">
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                            <div>
                              <div className="flex items-center gap-2 mb-1">
                                <span className="font-medium">Application #{app.id.slice(-4)}</span>
                                <StatusBadge status={app.status} />
                              </div>
                              <div className="text-sm text-muted-foreground">
                                Submitted: {new Date(app.submittedDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                              </div>
                            </div>
                            <div className="flex items-center gap-4">
                              <div className="text-right">
                                <div className="font-medium">{app.amount}</div>
                                <div className="text-xs text-muted-foreground">{app.contractor}</div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            </div>
            
            {/* Sidebar */}
            <div className="col-span-1 space-y-6">
              {/* Team */}
              <div className="bg-white dark:bg-gray-900 rounded-xl p-6 shadow-card">
                <h2 className="text-lg font-semibold mb-4">Project Team</h2>
                
                {(user?.role === 'pm' || user?.role === 'director') && (
                  <>
                    <h3 className="text-sm font-medium text-muted-foreground mb-3">Contractors</h3>
                    <div className="space-y-3 mb-6">
                      {project.contractors.map((contractor: any) => (
                        <div key={contractor.id} className="flex items-center justify-between">
                          <div>
                            <div className="font-medium">{contractor.name}</div>
                            <div className="text-xs text-muted-foreground">{contractor.role}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </>
                )}
                
                <h3 className="text-sm font-medium text-muted-foreground mb-3">Reviewers</h3>
                <div className="space-y-3">
                  {project.reviewers.map((reviewer: any) => (
                    <div key={reviewer.id} className="flex items-center justify-between">
                      <div>
                        <div className="font-medium">{reviewer.name}</div>
                        <div className="text-xs text-muted-foreground">{reviewer.role}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ProjectDetails;
