
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

export const useApi = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Dashboard statistics
  const getDashboardStatistics = async () => {
    try {
      // Get counts from database
      const { data: projectsCount, error: projectsError } = await supabase
        .from('projects')
        .select('id', { count: 'exact', head: true });
      
      const { data: payAppsCount, error: payAppsError } = await supabase
        .from('pay_applications')
        .select('id', { count: 'exact', head: true });
      
      const { data: membersCount, error: membersError } = await supabase
        .from('users')
        .select('id', { count: 'exact', head: true });
      
      const { data: pendingReviewsCount, error: reviewsError } = await supabase
        .from('pay_applications')
        .select('id', { count: 'exact', head: true })
        .eq('status', 'review');
      
      // Return stats with actual counts or 0 if errors
      return [
        { title: 'Active Projects', value: projectsCount?.count || 0 },
        { title: 'Pay Applications', value: payAppsCount?.count || 0 },
        { title: 'Organization Members', value: membersCount?.count || 0 },
        { title: 'Pending Reviews', value: pendingReviewsCount?.count || 0 },
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
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error('Error fetching projects:', error);
        return [];
      }
      
      // Transform to match the expected format
      return data.map(project => ({
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
      return [];
    } finally {
      setIsLoading(false);
    }
  };

  const createProject = async (projectData: any) => {
    setIsLoading(true);
    try {
      const { data: userData } = await supabase.auth.getUser();
      
      if (!userData || !userData.user) {
        throw new Error('User not authenticated');
      }
      
      // Get the user data from our users table to access organization_id
      const { data: userDetails, error: userError } = await supabase
        .from('users')
        .select('id, organization_id')
        .eq('email', userData.user.email)
        .single();
      
      if (userError || !userDetails) {
        console.error('Error getting user details:', userError);
        throw new Error('Could not retrieve user organization');
      }
      
      // Insert project with organization_id and created_by
      const { data, error } = await supabase
        .from('projects')
        .insert({
          name: projectData.name,
          organization_id: userDetails.organization_id,
          created_by: userDetails.id
          // Add additional fields from projectData as needed
        })
        .select()
        .single();

      if (error) {
        console.error('Error creating project:', error);
        return { success: false, error: error.message };
      }

      return { 
        success: true, 
        data: {
          id: data.id,
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
