
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Sidebar from '@/components/layout/Sidebar';
import ProjectsList from '@/components/dashboard/ProjectsList';
import { useAuth } from '@/contexts/AuthContext';
import { useApi } from '@/hooks/use-api';
import NewProjectModal from '@/components/projects/NewProjectModal';
import { Plus } from 'lucide-react';
import { CustomButton } from '@/components/ui/custom-button';

const Projects = () => {
  const { user } = useAuth();
  const { getProjects } = useApi();
  const [projects, setProjects] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isNewProjectModalOpen, setIsNewProjectModalOpen] = useState(false);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        setIsLoading(true);
        const projectsData = await getProjects();
        setProjects(projectsData);
      } catch (error) {
        console.error('Error fetching projects:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProjects();
  }, []);

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
                <h1 className="text-2xl md:text-3xl font-bold">Projects</h1>
                <p className="text-muted-foreground mt-1">Manage all your construction projects</p>
              </div>

              {(user?.role === 'pm' || user?.role === 'director') && (
                <CustomButton onClick={() => setIsNewProjectModalOpen(true)}>
                  <Plus size={16} className="mr-2" /> New Project
                </CustomButton>
              )}
            </div>
          </motion.div>

          {isLoading ? (
            <div className="flex justify-center py-12">
              <div className="animate-spin h-8 w-8 border-4 border-primary rounded-full border-t-transparent"></div>
            </div>
          ) : (
            <ProjectsList projects={projects} />
          )}
        </div>
      </main>

      <NewProjectModal 
        isOpen={isNewProjectModalOpen} 
        onClose={() => setIsNewProjectModalOpen(false)} 
      />
    </div>
  );
};

export default Projects;
