
import { useState } from 'react';
import { X, Calendar } from 'lucide-react';
import { CustomButton } from '@/components/ui/custom-button';
import { useApi } from '@/hooks/use-api';
import { toast } from 'sonner';

interface NewProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const NewProjectModal = ({ isOpen, onClose }: NewProjectModalProps) => {
  const { createProject } = useApi();
  const [formData, setFormData] = useState({
    name: '',
    client: '',
    description: '',
    totalBudget: '',
    startDate: '',
    dueDate: '',
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setIsLoading(true);
      await createProject(formData);
      toast.success('Project created successfully!');
      onClose();
      
      // In a real app, we'd probably want to refresh the projects list
      // or navigate to the new project details page
    } catch (error) {
      console.error('Error creating project:', error);
      toast.error('Failed to create project. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white dark:bg-gray-900 rounded-xl shadow-elevation max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-border flex items-center justify-between">
          <h2 className="text-xl font-semibold">Create New Project</h2>
          <button
            onClick={onClose}
            className="h-8 w-8 rounded-md flex items-center justify-center hover:bg-muted transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label htmlFor="name" className="text-sm font-medium">Project Name *</label>
              <input
                id="name"
                name="name"
                type="text"
                value={formData.name}
                onChange={handleChange}
                required
                placeholder="Enter project name"
                className="w-full px-4 py-2 border border-input rounded-lg bg-background input-focus"
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="client" className="text-sm font-medium">Client Name *</label>
              <input
                id="client"
                name="client"
                type="text"
                value={formData.client}
                onChange={handleChange}
                required
                placeholder="Enter client name"
                className="w-full px-4 py-2 border border-input rounded-lg bg-background input-focus"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label htmlFor="description" className="text-sm font-medium">Project Description</label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Enter project description"
              rows={3}
              className="w-full px-4 py-2 border border-input rounded-lg bg-background input-focus resize-none"
            ></textarea>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label htmlFor="totalBudget" className="text-sm font-medium">Total Budget *</label>
              <input
                id="totalBudget"
                name="totalBudget"
                type="text"
                value={formData.totalBudget}
                onChange={handleChange}
                required
                placeholder="e.g. $250,000"
                className="w-full px-4 py-2 border border-input rounded-lg bg-background input-focus"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label htmlFor="startDate" className="text-sm font-medium">Start Date *</label>
              <div className="relative">
                <input
                  id="startDate"
                  name="startDate"
                  type="date"
                  value={formData.startDate}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-input rounded-lg bg-background input-focus"
                />
                <Calendar className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
              </div>
            </div>
            <div className="space-y-2">
              <label htmlFor="dueDate" className="text-sm font-medium">Due Date *</label>
              <div className="relative">
                <input
                  id="dueDate"
                  name="dueDate"
                  type="date"
                  value={formData.dueDate}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-input rounded-lg bg-background input-focus"
                />
                <Calendar className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
              </div>
            </div>
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
                  Creating...
                </span>
              ) : 'Create Project'}
            </CustomButton>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NewProjectModal;
