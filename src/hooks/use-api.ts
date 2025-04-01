
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

// Hook for using the API
export const useApi = () => {
  const { user } = useAuth();

  // Get dashboard stats based on user role
  const getDashboardStatistics = async () => {
    if (!user) return [];

    try {
      // For active projects count
      const { data: projectsData, error: projectsError } = await supabase
        .from('projects')
        .select('id')
        .eq(user.role === 'contractor' ? 'contractor_id' : 'organization_id', 
             user.role === 'contractor' ? user.id : user.organizationId);

      if (projectsError) throw projectsError;
      
      // For pay applications count
      const { data: payAppsData, error: payAppsError } = await supabase
        .from('pay_applications')
        .select('id, status');

      if (payAppsError) throw payAppsError;
      
      // Count pending reviews
      const pendingReviews = payAppsData?.filter(pa => pa.status === 'in_review').length || 0;
      
      // Get organization members count if director
      let memberCount = 0;
      if (user.role === 'director' || user.role === 'pm') {
        const { data: membersData, error: membersError } = await supabase
          .from('users')
          .select('id')
          .eq('organization_id', user.organizationId);
          
        if (membersError) throw membersError;
        memberCount = membersData?.length || 0;
      }
      
      // For contractors count
      let contractorsCount = 0;
      if (user.role === 'pm' || user.role === 'director') {
        const { data: contractorsData, error: contractorsError } = await supabase
          .from('users')
          .select('id')
          .eq('organization_id', user.organizationId)
          .eq('role', 'contractor');
          
        if (contractorsError) throw contractorsError;
        contractorsCount = contractorsData?.length || 0;
      }

      // Format stats based on role
      switch (user.role) {
        case 'director':
          return [
            {
              title: 'Active Projects',
              value: projectsData?.length.toString() || '0',
              color: 'text-primary',
            },
            {
              title: 'Pay Applications',
              value: payAppsData?.length.toString() || '0',
              color: 'text-primary',
            },
            {
              title: 'Pending Reviews',
              value: pendingReviews.toString(),
              color: 'text-amber-500',
            },
            {
              title: 'Organization Members',
              value: memberCount.toString(),
              color: 'text-primary',
            }
          ];
        case 'pm':
          return [
            {
              title: 'Active Projects',
              value: projectsData?.length.toString() || '0',
              color: 'text-primary',
            },
            {
              title: 'Contractors',
              value: contractorsCount.toString(),
              color: 'text-primary',
            },
            {
              title: 'Pay Applications',
              value: payAppsData?.length.toString() || '0',
              color: 'text-primary',
            },
            {
              title: 'Pending Reviews',
              value: pendingReviews.toString(),
              color: 'text-amber-500',
            }
          ];
        case 'reviewer':
          const approvedApps = payAppsData?.filter(pa => pa.status === 'approved').length || 0;
          const changesRequested = payAppsData?.filter(pa => pa.status === 'changes_requested').length || 0;
          
          return [
            {
              title: 'Assigned Projects',
              value: projectsData?.length.toString() || '0',
              color: 'text-primary',
            },
            {
              title: 'Pending Reviews',
              value: pendingReviews.toString(),
              color: 'text-amber-500',
            },
            {
              title: 'Approved Applications',
              value: approvedApps.toString(),
              color: 'text-primary',
            },
            {
              title: 'Changes Requested',
              value: changesRequested.toString(),
              color: 'text-red-500',
            }
          ];
        case 'contractor':
          const submittedApps = payAppsData?.filter(pa => pa.status === 'submitted' || pa.status === 'in_review' || pa.status === 'approved' || pa.status === 'finalized').length || 0;
          const changesReqAsContractor = payAppsData?.filter(pa => pa.status === 'changes_requested').length || 0;
          
          return [
            {
              title: 'Assigned Projects',
              value: projectsData?.length.toString() || '0',
              color: 'text-primary',
            },
            {
              title: 'Submitted Applications',
              value: submittedApps.toString(),
              color: 'text-primary',
            },
            {
              title: 'Pending Reviews',
              value: pendingReviews.toString(),
              color: 'text-amber-500',
            },
            {
              title: 'Changes Requested',
              value: changesReqAsContractor.toString(),
              color: 'text-red-500',
            }
          ];
        default:
          return [];
      }
    } catch (error) {
      console.error('Error fetching dashboard statistics:', error);
      return [];
    }
  };

  // Get projects based on user role
  const getProjects = async () => {
    try {
      let query;
      
      if (user?.role === 'contractor') {
        // Contractors should only see projects they're assigned to
        const { data, error } = await supabase
          .from('project_contractors')
          .select(`
            project_id,
            projects:project_id (
              id,
              name,
              created_at,
              updated_at,
              organizations:organization_id (name)
            )
          `)
          .eq('contractor_id', user.id);
          
        if (error) throw error;
        return data?.map(item => ({
          id: item.projects?.id,
          name: item.projects?.name,
          client: item.projects?.organizations?.name,
          dueDate: new Date(item.projects?.updated_at).toISOString().split('T')[0],
          status: 'active',
          totalBudget: '$0', // We'd need to calculate this from pay applications
          contractorsCount: 1,
          pendingReviews: 0 // We'd need to calculate this from pay applications
        })) || [];
      } else if (user?.role === 'reviewer') {
        // Reviewers should see projects they're assigned to review
        const { data, error } = await supabase
          .from('project_reviewers')
          .select(`
            project_id,
            projects:project_id (
              id,
              name,
              created_at,
              updated_at,
              organizations:organization_id (name)
            )
          `)
          .eq('reviewer_id', user.id);
          
        if (error) throw error;
        return data?.map(item => ({
          id: item.projects?.id,
          name: item.projects?.name,
          client: item.projects?.organizations?.name,
          dueDate: new Date(item.projects?.updated_at).toISOString().split('T')[0],
          status: 'active',
          totalBudget: '$0', // We'd need to calculate this from pay applications
          contractorsCount: 0, // We'd need to calculate this
          pendingReviews: 0 // We'd need to calculate this from pay applications
        })) || [];
      } else {
        // PMs and Directors see all projects in their organization
        const { data, error } = await supabase
          .from('projects')
          .select(`
            id,
            name,
            created_at,
            updated_at,
            organizations:organization_id (name)
          `)
          .eq('organization_id', user?.organizationId);
          
        if (error) throw error;
        return data?.map(item => ({
          id: item.id,
          name: item.name,
          client: item.organizations?.name,
          dueDate: new Date(item.updated_at).toISOString().split('T')[0],
          status: 'active',
          totalBudget: '$0', // We'd need to calculate this from pay applications
          contractorsCount: 0, // We'd need to calculate this
          pendingReviews: 0 // We'd need to calculate this from pay applications
        })) || [];
      }
    } catch (error) {
      console.error('Error fetching projects:', error);
      return [];
    }
  };

  // Get contractors (for PMs and Directors)
  const getContractors = async () => {
    if (user?.role !== 'pm' && user?.role !== 'director') {
      throw new Error('Unauthorized');
    }
    
    try {
      const { data, error } = await supabase
        .from('users')
        .select('id, first_name, last_name, email')
        .eq('organization_id', user.organizationId)
        .eq('role', 'contractor');
        
      if (error) throw error;
      
      return data.map(contractor => ({
        id: contractor.id,
        name: `${contractor.first_name || ''} ${contractor.last_name || ''}`.trim() || contractor.email.split('@')[0],
        email: contractor.email,
        phone: 'N/A', // This field isn't in our schema but included for compatibility
        projectsAssigned: 0 // We'd need to calculate this
      }));
    } catch (error) {
      console.error('Error fetching contractors:', error);
      return [];
    }
  };

  // Get reviewers (for PMs and Directors)
  const getReviewers = async () => {
    if (user?.role !== 'pm' && user?.role !== 'director') {
      throw new Error('Unauthorized');
    }
    
    try {
      const { data, error } = await supabase
        .from('users')
        .select('id, first_name, last_name, email')
        .eq('organization_id', user.organizationId)
        .eq('role', 'reviewer');
        
      if (error) throw error;
      
      return data.map(reviewer => ({
        id: reviewer.id,
        name: `${reviewer.first_name || ''} ${reviewer.last_name || ''}`.trim() || reviewer.email.split('@')[0],
        email: reviewer.email,
        role: 'Reviewer',
        assignedApplications: 0 // We'd need to calculate this
      }));
    } catch (error) {
      console.error('Error fetching reviewers:', error);
      return [];
    }
  };

  // Get pay applications
  const getPayApplications = async () => {
    try {
      let query;
      
      if (user?.role === 'contractor') {
        // Contractors see applications they submitted
        const { data, error } = await supabase
          .from('pay_applications')
          .select(`
            id,
            status,
            submitted_at,
            project_id,
            projects:project_id (name),
            contractor_id,
            contractors:contractor_id (first_name, last_name, email),
            current_reviewer_id,
            reviewers:current_reviewer_id (first_name, last_name, email)
          `)
          .eq('contractor_id', user.id);
          
        if (error) throw error;
        
        return data.map(pa => {
          const contractorName = pa.contractors ? 
            `${pa.contractors.first_name || ''} ${pa.contractors.last_name || ''}`.trim() || 
            pa.contractors.email.split('@')[0] : 
            'Unknown';
            
          const reviewerName = pa.reviewers ? 
            `${pa.reviewers.first_name || ''} ${pa.reviewers.last_name || ''}`.trim() || 
            pa.reviewers.email.split('@')[0] : 
            null;
            
          return {
            id: pa.id,
            projectId: pa.project_id,
            projectName: pa.projects?.name || 'Unknown Project',
            contractor: contractorName,
            submittedDate: pa.submitted_at ? new Date(pa.submitted_at).toISOString().split('T')[0] : 'Draft',
            amount: '$0', // We'd need to calculate this from line items
            status: pa.status || 'draft',
            reviewers: [reviewerName].filter(Boolean),
            currentReviewer: reviewerName
          };
        });
        
      } else if (user?.role === 'reviewer') {
        // Reviewers see applications where they are the current reviewer
        const { data, error } = await supabase
          .from('pay_applications')
          .select(`
            id,
            status,
            submitted_at,
            project_id,
            projects:project_id (name),
            contractor_id,
            contractors:contractor_id (first_name, last_name, email),
            current_reviewer_id
          `)
          .eq('current_reviewer_id', user.id);
          
        if (error) throw error;
        
        return data.map(pa => {
          const contractorName = pa.contractors ? 
            `${pa.contractors.first_name || ''} ${pa.contractors.last_name || ''}`.trim() || 
            pa.contractors.email.split('@')[0] : 
            'Unknown';
            
          return {
            id: pa.id,
            projectId: pa.project_id,
            projectName: pa.projects?.name || 'Unknown Project',
            contractor: contractorName,
            submittedDate: pa.submitted_at ? new Date(pa.submitted_at).toISOString().split('T')[0] : 'Draft',
            amount: '$0', // We'd need to calculate this from line items
            status: pa.status || 'draft',
            reviewers: ['You'],
            currentReviewer: 'You'
          };
        });
        
      } else {
        // PMs and Directors see all applications in their organization
        const { data, error } = await supabase
          .from('pay_applications')
          .select(`
            id,
            status,
            submitted_at,
            project_id,
            projects:project_id (
              name,
              organization_id
            ),
            contractor_id,
            contractors:contractor_id (first_name, last_name, email),
            current_reviewer_id,
            reviewers:current_reviewer_id (first_name, last_name, email)
          `);
          
        if (error) throw error;
        
        // Filter for applications related to the organization
        const orgApplications = data.filter(pa => 
          pa.projects?.organization_id === user?.organizationId
        );
        
        return orgApplications.map(pa => {
          const contractorName = pa.contractors ? 
            `${pa.contractors.first_name || ''} ${pa.contractors.last_name || ''}`.trim() || 
            pa.contractors.email.split('@')[0] : 
            'Unknown';
            
          const reviewerName = pa.reviewers ? 
            `${pa.reviewers.first_name || ''} ${pa.reviewers.last_name || ''}`.trim() || 
            pa.reviewers.email.split('@')[0] : 
            null;
            
          return {
            id: pa.id,
            projectId: pa.project_id,
            projectName: pa.projects?.name || 'Unknown Project',
            contractor: contractorName,
            submittedDate: pa.submitted_at ? new Date(pa.submitted_at).toISOString().split('T')[0] : 'Draft',
            amount: '$0', // We'd need to calculate this from line items
            status: pa.status || 'draft',
            reviewers: [reviewerName].filter(Boolean),
            currentReviewer: reviewerName
          };
        });
      }
    } catch (error) {
      console.error('Error fetching pay applications:', error);
      return [];
    }
  };

  // Get pay application details
  const getPayApplicationDetails = async (id: string) => {
    try {
      // Fetch application details
      const { data: application, error: appError } = await supabase
        .from('pay_applications')
        .select(`
          id,
          status,
          submitted_at,
          finalized_at,
          project_id,
          projects:project_id (name, organization_id),
          contractor_id,
          contractors:contractor_id (first_name, last_name, email),
          current_reviewer_id,
          reviewers:current_reviewer_id (first_name, last_name, email)
        `)
        .eq('id', id)
        .single();
        
      if (appError) throw appError;
      
      // Fetch line items
      const { data: lineItems, error: lineItemsError } = await supabase
        .from('line_items')
        .select(`
          id,
          item_number,
          description_of_work,
          scheduled_value,
          from_previous_application,
          this_period,
          materials_presently_stored,
          total_completed_and_stored,
          percent_complete,
          balance_to_finish,
          retainage
        `)
        .eq('pay_application_id', id);
        
      if (lineItemsError) throw lineItemsError;

      // Fetch expenses for each line item
      const lineItemsWithExpenses = await Promise.all(
        lineItems.map(async (lineItem) => {
          const { data: expenses, error: expensesError } = await supabase
            .from('expenses')
            .select(`
              id,
              description,
              amount,
              category,
              date_of_expense,
              comment
            `)
            .eq('line_item_id', lineItem.id);
            
          if (expensesError) throw expensesError;
          
          // Fetch receipts for each expense
          const expensesWithReceipts = await Promise.all(
            expenses.map(async (expense) => {
              const { data: receipts, error: receiptsError } = await supabase
                .from('receipts')
                .select('id, file_url, uploaded_at')
                .eq('expense_id', expense.id);
                
              if (receiptsError) throw receiptsError;
              
              return {
                ...expense,
                receipts: receipts || []
              };
            })
          );
          
          return {
            ...lineItem,
            expenses: expensesWithReceipts || []
          };
        })
      );
      
      // Format the contractors and reviewers names
      const contractorName = application.contractors ? 
        `${application.contractors.first_name || ''} ${application.contractors.last_name || ''}`.trim() || 
        application.contractors.email.split('@')[0] : 
        'Unknown';
        
      const reviewerName = application.reviewers ? 
        `${application.reviewers.first_name || ''} ${application.reviewers.last_name || ''}`.trim() || 
        application.reviewers.email.split('@')[0] : 
        null;
      
      // Build the application summary
      const applicationSummary = {
        id: application.id,
        projectId: application.project_id,
        projectName: application.projects?.name || 'Unknown Project',
        contractor: contractorName,
        submittedDate: application.submitted_at ? new Date(application.submitted_at).toISOString().split('T')[0] : 'Draft',
        periodFrom: '', // Not in our schema but included for compatibility
        periodTo: '', // Not in our schema but included for compatibility
        amount: '$0', // We'd need to calculate this from line items
        status: application.status || 'draft',
        reviewers: [reviewerName].filter(Boolean),
        currentReviewer: reviewerName,
        totalContractSum: '$0', // We'd need to calculate this
        currentPayment: '$0', // We'd need to calculate this
        previousPayments: '$0', // We'd need to calculate this
        balance: '$0', // We'd need to calculate this
        retainage: '$0', // We'd need to calculate this
        reviewChain: [
          {
            name: reviewerName || 'None assigned',
            role: 'Reviewer',
            status: application.status === 'in_review' ? 'reviewing' : 'pending'
          }
        ]
      };

      return {
        application: applicationSummary,
        lineItems: lineItemsWithExpenses
      };
    } catch (error) {
      console.error('Error fetching pay application details:', error);
      return {
        application: null,
        lineItems: []
      };
    }
  };

  // Create a new project (only for PMs and Directors)
  const createProject = async (projectData: any) => {
    if (user?.role !== 'pm' && user?.role !== 'director') {
      throw new Error('Unauthorized');
    }
    
    try {
      // Check if the organization allows PMs to create projects
      if (user.role === 'pm') {
        const { data: org, error: orgError } = await supabase
          .from('organizations')
          .select('allow_pm_project_creation')
          .eq('id', user.organizationId)
          .single();
          
        if (orgError) throw orgError;
        
        if (!org.allow_pm_project_creation) {
          throw new Error('Your organization does not allow Project Managers to create new projects.');
        }
      }
      
      // Insert the new project
      const { data, error } = await supabase
        .from('projects')
        .insert({
          name: projectData.name,
          organization_id: user.organizationId,
          created_by: user.id,
          assigned_pm_id: user.role === 'pm' ? user.id : null
        })
        .select()
        .single();
        
      if (error) throw error;
      
      toast.success('Project created successfully!');
      
      return {
        id: data.id,
        name: data.name,
        status: 'active',
        // Add other fields as needed
      };
    } catch (error: any) {
      toast.error(`Failed to create project: ${error.message}`);
      throw error;
    }
  };

  // Invite a team member (only for PMs and Directors)
  const inviteTeamMember = async (email: string, role: string) => {
    if (user?.role !== 'pm' && user?.role !== 'director') {
      throw new Error('Unauthorized');
    }
    
    try {
      // In a real app, you'd send an email with an invitation link
      // For now, we'll just simulate a success response
      
      toast.success(`Invitation sent to ${email}`);
      
      return { 
        success: true, 
        message: `Invitation sent to ${email}` 
      };
    } catch (error: any) {
      toast.error(`Failed to invite team member: ${error.message}`);
      throw error;
    }
  };

  return {
    getDashboardStatistics,
    getProjects,
    getContractors,
    getReviewers,
    getPayApplications,
    getPayApplicationDetails,
    createProject,
    inviteTeamMember
  };
};
