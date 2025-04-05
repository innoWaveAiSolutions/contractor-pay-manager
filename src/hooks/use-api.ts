
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

export const useApi = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Dashboard statistics
  const getDashboardStatistics = async () => {
    try {
      // Get counts from database
      const { count: projectsCount } = await supabase
        .from('projects')
        .select('id', { count: 'exact', head: true });
      
      const { count: payAppsCount } = await supabase
        .from('pay_applications')
        .select('id', { count: 'exact', head: true });
      
      const { count: membersCount } = await supabase
        .from('users')
        .select('id', { count: 'exact', head: true });
      
      const { count: pendingReviewsCount } = await supabase
        .from('pay_applications')
        .select('id', { count: 'exact', head: true })
        .eq('status', 'review');
      
      // Return stats with actual counts or 0 if errors
      return [
        { title: 'Active Projects', value: projectsCount || 0 },
        { title: 'Pay Applications', value: payAppsCount || 0 },
        { title: 'Organization Members', value: membersCount || 0 },
        { title: 'Pending Reviews', value: pendingReviewsCount || 0 },
      ];
    } catch (error) {
      console.error('Error fetching dashboard statistics:', error);
      return [
        { title: 'Active Projects', value: 0 },
        { title: 'Pay Applications', value: 0 },
        { title: 'Organization Members', value: 0 },
        { title: 'Pending Reviews', value: 0 },
      ];
    }
  };

  // Projects methods
  const getProjects = async () => {
    try {
      setIsLoading(true);
      
      // Get projects directly, without trying to join with the users table
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error('Error fetching projects:', error);
        throw error;
      }
      
      // Transform to match the expected format
      return (data || []).map(project => ({
        id: project.id,
        name: project.name || 'Untitled Project',
        client: 'Client Name', // Add default or get from additional column
        status: 'active', // Add default or get from additional column
        totalBudget: '$250,000', // Add default or get from additional column
        dueDate: new Date().toISOString(), // Add default or get from additional column
        contractorsCount: 3, // Add default or get from additional column
        pendingReviews: 0 // Add default or get from additional column
      }));
    } catch (error) {
      console.error('Error in getProjects:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const createProject = async (projectData: any) => {
    setIsLoading(true);
    try {
      const { data: userData, error: authError } = await supabase.auth.getUser();
      
      if (authError || !userData || !userData.user) {
        throw new Error('User not authenticated');
      }
      
      // Use the user's ID directly from auth
      const userId = userData.user.id;
      
      // Create the project without trying to access the users table
      const { data, error } = await supabase
        .from('projects')
        .insert({
          name: projectData.name,
          created_by: userId // Use the auth user ID directly
        })
        .select();
      
      if (error) {
        console.error('Error creating project:', error);
        throw error;
      }

      if (!data || data.length === 0) {
        throw new Error('No project data returned after creation');
      }

      return { 
        success: true, 
        data: {
          id: data[0].id,
          ...projectData
        }
      };
    } catch (error: any) {
      console.error('Error creating project:', error);
      return { success: false, error: error.message || 'Failed to create project' };
    } finally {
      setIsLoading(false);
    }
  };

  // Team methods
  const getContractors = async () => {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('role', 'contractor');
        
      if (error) {
        console.error('Error fetching contractors:', error);
        return [];
      }
      
      return data || [];
    } catch (error) {
      console.error('Error in getContractors:', error);
      return [];
    }
  };

  const getReviewers = async () => {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .in('role', ['pm', 'director']);
        
      if (error) {
        console.error('Error fetching reviewers:', error);
        return [];
      }
      
      return data || [];
    } catch (error) {
      console.error('Error in getReviewers:', error);
      return [];
    }
  };

  const inviteTeamMember = async (inviteData: any) => {
    setIsLoading(true);
    try {
      // Mock implementation
      console.log('Inviting team member:', inviteData);
      return { success: true };
    } catch (error) {
      console.error('Error inviting team member:', error);
      return { success: false, error };
    } finally {
      setIsLoading(false);
    }
  };

  // Pay applications methods
  const getPayApplications = async () => {
    try {
      const { data, error } = await supabase
        .from('pay_applications')
        .select('*');
        
      if (error) {
        console.error('Error fetching pay applications:', error);
        return [];
      }
      
      return data || [];
    } catch (error) {
      console.error('Error in getPayApplications:', error);
      return [];
    }
  };

  return {
    isLoading,
    getDashboardStatistics,
    getProjects,
    createProject,
    getContractors,
    getReviewers,
    inviteTeamMember,
    getPayApplications
  };
};
