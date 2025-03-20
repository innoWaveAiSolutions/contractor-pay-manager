
import { useAuth } from '@/contexts/AuthContext';

// Mock project data
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

// Mock contractor data
const mockContractors = [
  {
    id: 'c1',
    name: 'Smith Construction',
    email: 'smith@example.com',
    phone: '555-123-4567',
    projectsAssigned: 2,
  },
  {
    id: 'c2',
    name: 'Johnson Builders',
    email: 'johnson@example.com',
    phone: '555-987-6543',
    projectsAssigned: 1,
  },
  {
    id: 'c3',
    name: 'Wilson Contractors',
    email: 'wilson@example.com',
    phone: '555-456-7890',
    projectsAssigned: 3,
  }
];

// Mock reviewers data
const mockReviewers = [
  {
    id: 'r1',
    name: 'Alice Wilson',
    email: 'alice@example.com',
    role: 'Financial Auditor',
    assignedApplications: 5,
  },
  {
    id: 'r2',
    name: 'Bob Thomas',
    email: 'bob@example.com',
    role: 'Technical Reviewer',
    assignedApplications: 3,
  }
];

// Mock pay applications data
const mockPayApplications = [
  {
    id: 'pa1',
    projectId: '1',
    projectName: 'Office Building Renovation',
    contractor: 'Smith Construction',
    submittedDate: '2023-08-15',
    amount: '$45,000',
    status: 'pending_review',
    reviewers: ['Alice Wilson', 'Bob Thomas'],
    currentReviewer: 'Alice Wilson',
  },
  {
    id: 'pa2',
    projectId: '2',
    projectName: 'Residential Complex',
    contractor: 'Johnson Builders',
    submittedDate: '2023-09-02',
    amount: '$125,000',
    status: 'approved',
    reviewers: ['Alice Wilson', 'Bob Thomas'],
    currentReviewer: null,
  },
  {
    id: 'pa3',
    projectId: '1',
    projectName: 'Office Building Renovation',
    contractor: 'Smith Construction',
    submittedDate: '2023-07-10',
    amount: '$30,000',
    status: 'changes_requested',
    reviewers: ['Alice Wilson', 'Bob Thomas'],
    currentReviewer: 'Bob Thomas',
  }
];

// Dashboard statistics based on role
const getDashboardStats = (role: string) => {
  switch (role) {
    case 'director':
      return [
        {
          title: 'Active Projects',
          value: mockProjects.filter(p => p.status === 'active').length.toString(),
          color: 'text-primary',
        },
        {
          title: 'Pay Applications',
          value: mockPayApplications.length.toString(),
          color: 'text-primary',
        },
        {
          title: 'Pending Reviews',
          value: mockPayApplications.filter(pa => pa.status === 'pending_review').length.toString(),
          color: 'text-amber-500',
        },
        {
          title: 'Organization Members',
          value: '12',
          color: 'text-primary',
        }
      ];
    case 'pm':
      return [
        {
          title: 'Active Projects',
          value: mockProjects.filter(p => p.status === 'active').length.toString(),
          color: 'text-primary',
        },
        {
          title: 'Contractors',
          value: mockContractors.length.toString(),
          color: 'text-primary',
        },
        {
          title: 'Pay Applications',
          value: mockPayApplications.length.toString(),
          color: 'text-primary',
        },
        {
          title: 'Pending Reviews',
          value: mockPayApplications.filter(pa => pa.status === 'pending_review').length.toString(),
          color: 'text-amber-500',
        }
      ];
    case 'reviewer':
      return [
        {
          title: 'Assigned Projects',
          value: '3',
          color: 'text-primary',
        },
        {
          title: 'Pending Reviews',
          value: mockPayApplications.filter(pa => pa.status === 'pending_review').length.toString(),
          color: 'text-amber-500',
        },
        {
          title: 'Approved Applications',
          value: mockPayApplications.filter(pa => pa.status === 'approved').length.toString(),
          color: 'text-primary',
        },
        {
          title: 'Changes Requested',
          value: mockPayApplications.filter(pa => pa.status === 'changes_requested').length.toString(),
          color: 'text-red-500',
        }
      ];
    case 'contractor':
      return [
        {
          title: 'Assigned Projects',
          value: '2',
          color: 'text-primary',
        },
        {
          title: 'Submitted Applications',
          value: mockPayApplications.length.toString(),
          color: 'text-primary',
        },
        {
          title: 'Pending Reviews',
          value: mockPayApplications.filter(pa => pa.status === 'pending_review').length.toString(),
          color: 'text-amber-500',
        },
        {
          title: 'Changes Requested',
          value: mockPayApplications.filter(pa => pa.status === 'changes_requested').length.toString(),
          color: 'text-red-500',
        }
      ];
    default:
      return [];
  }
};

// Hook for using the API
export const useApi = () => {
  const { user } = useAuth();

  // Get dashboard stats based on user role
  const getDashboardStatistics = () => {
    if (!user) return [];
    return getDashboardStats(user.role);
  };

  // Get projects based on user role
  const getProjects = async () => {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 500));
    return mockProjects;
  };

  // Get contractors (only for PMs)
  const getContractors = async () => {
    if (user?.role !== 'pm') throw new Error('Unauthorized');
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 500));
    return mockContractors;
  };

  // Get reviewers (only for PMs and Directors)
  const getReviewers = async () => {
    if (user?.role !== 'pm' && user?.role !== 'director') throw new Error('Unauthorized');
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 500));
    return mockReviewers;
  };

  // Get pay applications based on user role
  const getPayApplications = async () => {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 500));
    return mockPayApplications;
  };

  // Create a new project (only for PMs)
  const createProject = async (projectData: any) => {
    if (user?.role !== 'pm') throw new Error('Unauthorized');
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    console.log('Creating project:', projectData);
    return {
      id: Math.random().toString(36).substring(2, 9),
      ...projectData,
      status: 'active'
    };
  };

  // Invite a team member (only for PMs and Directors)
  const inviteTeamMember = async (email: string, role: string) => {
    if (user?.role !== 'pm' && user?.role !== 'director') throw new Error('Unauthorized');
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    console.log('Inviting team member:', email, role);
    return { success: true, message: `Invitation sent to ${email}` };
  };

  return {
    getDashboardStatistics,
    getProjects,
    getContractors,
    getReviewers,
    getPayApplications,
    createProject,
    inviteTeamMember
  };
};
