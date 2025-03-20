
import { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Plus, ArrowRight, Calendar, UserCircle } from 'lucide-react';
import { CustomButton } from '@/components/ui/custom-button';
import { cn } from '@/lib/utils';

// Mock data for projects
const mockProjects = [
  {
    id: '1',
    name: 'Office Building Renovation',
    client: 'Acme Corp',
    dueDate: '2023-12-15',
    status: 'active',
    totalBudget: '$250,000',
    contractorsCount: 5,
    pendingReviews: 2,
  },
  {
    id: '2',
    name: 'Residential Complex',
    client: 'Homestead Properties',
    dueDate: '2024-03-22',
    status: 'active',
    totalBudget: '$1,250,000',
    contractorsCount: 12,
    pendingReviews: 4,
  },
  {
    id: '3',
    name: 'Commercial Mall Expansion',
    client: 'Metro Development',
    dueDate: '2023-11-30',
    status: 'review',
    totalBudget: '$3,750,000',
    contractorsCount: 8,
    pendingReviews: 7,
  },
  {
    id: '4',
    name: 'Hospital Wing Construction',
    client: 'City Health Services',
    dueDate: '2024-06-10',
    status: 'planning',
    totalBudget: '$4,500,000',
    contractorsCount: 3,
    pendingReviews: 0,
  },
];

// Status badge component
const StatusBadge = ({ status }: { status: string }) => {
  const statusStyles = {
    active: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
    review: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
    planning: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
    completed: "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400",
  };

  const statusText = {
    active: "Active",
    review: "In Review",
    planning: "Planning",
    completed: "Completed",
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

const ProjectsList = () => {
  const [searchQuery, setSearchQuery] = useState('');
  
  const filteredProjects = mockProjects.filter(project => 
    project.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    project.client.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search projects..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 pr-4 py-2 w-full sm:w-[300px] border border-input rounded-lg bg-background input-focus"
          />
        </div>
        <CustomButton size="sm">
          <Plus size={16} className="mr-2" /> New Project
        </CustomButton>
      </div>
      
      <div className="grid grid-cols-1 gap-4">
        {filteredProjects.map((project, index) => (
          <motion.div
            key={project.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ 
              duration: 0.4,
              delay: index * 0.1,
              ease: [0.22, 1, 0.36, 1]
            }}
          >
            <div className="bg-white dark:bg-gray-900 rounded-xl overflow-hidden shadow-card hover:shadow-elevation transition-all duration-300 hover:translate-y-[-2px]">
              <div className="p-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="font-medium text-lg">{project.name}</h3>
                      <StatusBadge status={project.status} />
                    </div>
                    <p className="text-muted-foreground">{project.client}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="flex flex-col items-end">
                      <div className="text-sm font-medium">{project.totalBudget}</div>
                      <div className="text-xs text-muted-foreground">Total Budget</div>
                    </div>
                  </div>
                </div>
                
                <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <div className="text-sm">Due: {new Date(project.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</div>
                  </div>
                  <div className="flex items-center gap-2">
                    <UserCircle className="h-4 w-4 text-muted-foreground" />
                    <div className="text-sm">{project.contractorsCount} Contractors</div>
                  </div>
                  {project.pendingReviews > 0 && (
                    <div className="bg-amber-50 dark:bg-amber-950/30 text-amber-700 dark:text-amber-400 text-sm px-3 py-1 rounded-md flex items-center justify-center">
                      {project.pendingReviews} Reviews Pending
                    </div>
                  )}
                </div>
              </div>
              
              <div className="px-6 py-3 bg-muted/30 dark:bg-muted/10 border-t border-border">
                <a 
                  href={`/projects/${project.id}`}
                  className="flex items-center justify-end text-sm text-primary font-medium hover:underline"
                >
                  View Details <ArrowRight size={14} className="ml-1" />
                </a>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default ProjectsList;
