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

// Add review chain data to mock application summary
const mockApplicationSummary = {
  id: 'pa1',
  projectId: '1',
  projectName: 'Office Building Renovation',
  contractor: 'Smith Construction',
  submittedDate: '2023-08-15',
  periodFrom: '2023-07-01',
  periodTo: '2023-07-31',
  amount: '$45,000',
  status: 'pending_review',
  reviewers: ['Alice Wilson', 'Bob Thomas'],
  currentReviewer: 'Alice Wilson',
  totalContractSum: '$250,000',
  currentPayment: '$45,000',
  previousPayments: '$30,000',
  balance: '$175,000',
  retainage: '$3,750',
  reviewChain: [
    {
      name: 'Alice Wilson',
      role: 'Financial Auditor',
      status: 'reviewing'
    },
    {
      name: 'Bob Thomas',
      role: 'Technical Reviewer',
      status: 'pending'
    },
    {
      name: 'John Director',
      role: 'Director',
      status: 'pending'
    }
  ]
};

// Mock line items data with expenses
const mockLineItems = [
  {
    id: 'li1',
    itemNo: '001',
    description: 'Site Preparation',
    scheduledValue: '$15,000',
    fromPreviousApplication: '$10,000',
    thisPeriod: '$3,000',
    materialsPresent: '$0',
    totalCompleted: '$13,000',
    percentage: '86.7%',
    balanceToFinish: '$2,000',
    retainage: '$650',
    expenses: [
      {
        id: 'exp1',
        name: 'Heavy Equipment Rental',
        amount: '$1,500',
        date: '2023-07-05',
        category: 'Equipment',
        comments: 'Rental of excavator and bulldozer for site clearing and grading.',
        receipt: 'receipt123.pdf'
      },
      {
        id: 'exp2',
        name: 'Labor - Site Clearing',
        amount: '$850',
        date: '2023-07-08',
        category: 'Labor',
        comments: 'Labor costs for site clearing activities including tree removal.',
        receipt: 'receipt124.pdf'
      }
    ]
  },
  {
    id: 'li2',
    itemNo: '002',
    description: 'Foundation Work',
    scheduledValue: '$35,000',
    fromPreviousApplication: '$20,000',
    thisPeriod: '$10,000',
    materialsPresent: '$0',
    totalCompleted: '$30,000',
    percentage: '85.7%',
    balanceToFinish: '$5,000',
    retainage: '$1,500',
    expenses: [
      {
        id: 'exp3',
        name: 'Concrete Materials',
        amount: '$5,500',
        date: '2023-07-12',
        category: 'Material',
        comments: 'Purchase of concrete and rebar for foundation pouring.',
        receipt: 'receipt125.pdf'
      },
      {
        id: 'exp4',
        name: 'Foundation Labor',
        amount: '$3,200',
        date: '2023-07-15',
        category: 'Labor',
        comments: 'Labor costs for foundation formwork and concrete pouring.',
        receipt: 'receipt126.pdf'
      }
    ]
  },
  {
    id: 'li3',
    itemNo: '003',
    description: 'Framing',
    scheduledValue: '$50,000',
    fromPreviousApplication: '$0',
    thisPeriod: '$32,000',
    materialsPresent: '$0',
    totalCompleted: '$32,000',
    percentage: '64%',
    balanceToFinish: '$18,000',
    retainage: '$1,600',
    expenses: [
      {
        id: 'exp5',
        name: 'Lumber Purchase',
        amount: '$15,200',
        date: '2023-07-20',
        category: 'Material',
        comments: 'Lumber order for wall framing and floor joists.',
        receipt: 'receipt127.pdf'
      },
      {
        id: 'exp6',
        name: 'Framing Crew Labor',
        amount: '$12,750',
        date: '2023-07-22',
        category: 'Labor',
        comments: 'Labor costs for framing crew over 8-day period.',
        receipt: 'receipt128.pdf'
      }
    ]
  },
  {
    id: 'li4',
    itemNo: '004',
    description: 'Plumbing Rough-In',
    scheduledValue: '$25,000',
    fromPreviousApplication: '$0',
    thisPeriod: '$0',
    materialsPresent: '$0',
    totalCompleted: '$0',
    percentage: '0%',
    balanceToFinish: '$25,000',
    retainage: '$0',
    expenses: []
  },
  {
    id: 'li5',
    itemNo: '005',
    description: 'Electrical Rough-In',
    scheduledValue: '$30,000',
    fromPreviousApplication: '$0',
    thisPeriod: '$0',
    materialsPresent: '$0',
    totalCompleted: '$0',
    percentage: '0%',
    balanceToFinish: '$30,000',
    retainage: '$0',
    expenses: []
  },
  {
    id: 'li6',
    itemNo: '006',
    description: 'HVAC Installation',
    scheduledValue: '$40,000',
    fromPreviousApplication: '$0',
    thisPeriod: '$0',
    materialsPresent: '$0',
    totalCompleted: '$0',
    percentage: '0%',
    balanceToFinish: '$40,000',
    retainage: '$0',
    expenses: []
  },
  {
    id: 'li7',
    itemNo: '007',
    description: 'Roofing',
    scheduledValue: '$27,000',
    fromPreviousApplication: '$0',
    thisPeriod: '$0',
    materialsPresent: '$0',
    totalCompleted: '$0',
    percentage: '0%',
    balanceToFinish: '$27,000',
    retainage: '$0',
    expenses: []
  },
  {
    id: 'li8',
    itemNo: '008',
    description: 'Exterior Siding',
    scheduledValue: '$18,000',
    fromPreviousApplication: '$0',
    thisPeriod: '$0',
    materialsPresent: '$0',
    totalCompleted: '$0',
    percentage: '0%',
    balanceToFinish: '$18,000',
    retainage: '$0',
    expenses: []
  },
  {
    id: 'li9',
    itemNo: '009',
    description: 'Drywall Installation',
    scheduledValue: '$15,000',
    fromPreviousApplication: '$0',
    thisPeriod: '$0',
    materialsPresent: '$0',
    totalCompleted: '$0',
    percentage: '0%',
    balanceToFinish: '$15,000',
    retainage: '$0',
    expenses: []
  },
  {
    id: 'li10',
    itemNo: '010',
    description: 'Interior Finishes',
    scheduledValue: '$32,000',
    fromPreviousApplication: '$0',
    thisPeriod: '$0',
    materialsPresent: '$0',
    totalCompleted: '$0',
    percentage: '0%',
    balanceToFinish: '$32,000',
    retainage: '$0',
    expenses: []
  },
  {
    id: 'li11',
    itemNo: '011',
    description: 'Flooring',
    scheduledValue: '$22,000',
    fromPreviousApplication: '$0',
    thisPeriod: '$0',
    materialsPresent: '$0',
    totalCompleted: '$0',
    percentage: '0%',
    balanceToFinish: '$22,000',
    retainage: '$0',
    expenses: []
  },
  {
    id: 'li12',
    itemNo: '012',
    description: 'Cabinetry and Countertops',
    scheduledValue: '$18,000',
    fromPreviousApplication: '$0',
    thisPeriod: '$0',
    materialsPresent: '$0',
    totalCompleted: '$0',
    percentage: '0%',
    balanceToFinish: '$18,000',
    retainage: '$0',
    expenses: []
  },
  {
    id: 'li13',
    itemNo: '013',
    description: 'Painting',
    scheduledValue: '$12,000',
    fromPreviousApplication: '$0',
    thisPeriod: '$0',
    materialsPresent: '$0',
    totalCompleted: '$0',
    percentage: '0%',
    balanceToFinish: '$12,000',
    retainage: '$0',
    expenses: []
  },
  {
    id: 'li14',
    itemNo: '014',
    description: 'Fixture Installation',
    scheduledValue: '$8,000',
    fromPreviousApplication: '$0',
    thisPeriod: '$0',
    materialsPresent: '$0',
    totalCompleted: '$0',
    percentage: '0%',
    balanceToFinish: '$8,000',
    retainage: '$0',
    expenses: []
  },
  {
    id: 'li15',
    itemNo: '015',
    description: 'Final Cleanup and Inspection',
    scheduledValue: '$3,000',
    fromPreviousApplication: '$0',
    thisPeriod: '$0',
    materialsPresent: '$0',
    totalCompleted: '$0',
    percentage: '0%',
    balanceToFinish: '$3,000',
    retainage: '$0',
    expenses: []
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

  // Get pay application details
  const getPayApplicationDetails = async (id: string) => {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 800));
    return {
      application: mockApplicationSummary,
      lineItems: mockLineItems
    };
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
    getPayApplicationDetails,
    createProject,
    inviteTeamMember
  };
};
