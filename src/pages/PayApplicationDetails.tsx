
import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, FileText, Check, X, ChevronDown, ChevronUp, Download } from 'lucide-react';
import Sidebar from '@/components/layout/Sidebar';
import { CustomButton } from '@/components/ui/custom-button';
import { useAuth } from '@/contexts/AuthContext';
import { cn } from '@/lib/utils';

// Mock line items for the pay application
const mockLineItems = [
  {
    id: '1',
    number: '1',
    description: 'Site Preparation',
    scheduledValue: 25000,
    previouslyCompleted: 20000,
    thisperiod: 5000,
    storedMaterials: 0,
    totalCompletedToDate: 25000,
    percentageComplete: 100,
    balanceToFinish: 0,
    retainage: 1250,
    expenses: [
      {
        id: 'e1',
        name: 'Equipment Rental',
        amount: 3000,
        date: '2023-06-05',
        category: 'Equipment',
        hasReceipt: true,
        comments: 'Heavy machinery rental for site clearing',
        approved: true,
      },
      {
        id: 'e2',
        name: 'Labor Costs',
        amount: 2000,
        date: '2023-06-10',
        category: 'Labor',
        hasReceipt: true,
        comments: 'Site clearing labor',
        approved: false,
      },
    ],
  },
  {
    id: '2',
    number: '2',
    description: 'Foundation Work',
    scheduledValue: 40000,
    previouslyCompleted: 30000,
    thisperiod: 10000,
    storedMaterials: 0,
    totalCompletedToDate: 40000,
    percentageComplete: 100,
    balanceToFinish: 0,
    retainage: 2000,
    expenses: [
      {
        id: 'e3',
        name: 'Concrete Materials',
        amount: 6000,
        date: '2023-06-15',
        category: 'Material',
        hasReceipt: true,
        comments: 'Concrete for foundation',
        approved: true,
      },
      {
        id: 'e4',
        name: 'Labor Costs',
        amount: 4000,
        date: '2023-06-20',
        category: 'Labor',
        hasReceipt: true,
        comments: 'Foundation labor',
        approved: true,
      },
    ],
  },
  {
    id: '3',
    number: '3',
    description: 'Framing',
    scheduledValue: 35000,
    previouslyCompleted: 0,
    thisperiod: 20000,
    storedMaterials: 5000,
    totalCompletedToDate: 25000,
    percentageComplete: 71,
    balanceToFinish: 10000,
    retainage: 1250,
    expenses: [
      {
        id: 'e5',
        name: 'Lumber Materials',
        amount: 12000,
        date: '2023-07-01',
        category: 'Material',
        hasReceipt: true,
        comments: 'Lumber for framing',
        approved: true,
      },
      {
        id: 'e6',
        name: 'Labor Costs',
        amount: 8000,
        date: '2023-07-05',
        category: 'Labor',
        hasReceipt: false,
        comments: 'Framing labor',
        approved: false,
      },
    ],
  },
];

const PayApplicationDetails = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const [application, setApplication] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [expandedLineItems, setExpandedLineItems] = useState<Record<string, boolean>>({});
  const [expandedExpenses, setExpandedExpenses] = useState<Record<string, boolean>>({});

  useEffect(() => {
    const fetchApplicationDetails = async () => {
      try {
        setIsLoading(true);
        // This would be an API call in a real application
        await new Promise(resolve => setTimeout(resolve, 800));
        
        setApplication({
          id,
          projectId: '1',
          projectName: 'Office Building Renovation',
          contractor: 'Smith Construction',
          submittedDate: '2023-08-15',
          amount: '$45,000',
          status: 'pending_review',
          reviewers: ['Alice Wilson', 'Bob Thomas'],
          currentReviewer: 'Alice Wilson',
          lineItems: mockLineItems,
        });
      } catch (error) {
        console.error('Error fetching application details:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchApplicationDetails();
  }, [id]);

  const toggleLineItem = (lineItemId: string) => {
    setExpandedLineItems(prev => ({
      ...prev,
      [lineItemId]: !prev[lineItemId]
    }));
  };

  const toggleExpense = (expenseId: string) => {
    setExpandedExpenses(prev => ({
      ...prev,
      [expenseId]: !prev[expenseId]
    }));
  };

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

  if (!application) {
    return (
      <div className="min-h-screen bg-background">
        <Sidebar userRole={user?.role || 'pm'} />
        <main className="pt-16 pb-12 pl-0 md:pl-20 lg:pl-64">
          <div className="px-6 md:px-8 max-w-6xl mx-auto text-center py-20">
            <h2 className="text-2xl font-bold mb-2">Application Not Found</h2>
            <p className="text-muted-foreground mb-6">The pay application you're looking for doesn't exist or you don't have permission to view it.</p>
            <Link to="/applications">
              <CustomButton>
                <ArrowLeft size={16} className="mr-2" /> Back to Applications
              </CustomButton>
            </Link>
          </div>
        </main>
      </div>
    );
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);
  };

  const isReviewer = user?.role === 'reviewer' || user?.role === 'pm';
  const isContractor = user?.role === 'contractor';

  return (
    <div className="min-h-screen bg-background">
      <Sidebar userRole={user?.role || 'pm'} />
      
      <main className="pt-16 pb-12 pl-0 md:pl-20 lg:pl-64">
        <div className="px-6 md:px-8 max-w-6xl mx-auto">
          <div className="mb-6">
            <Link to="/applications" className="text-sm text-muted-foreground hover:text-foreground hover:underline flex items-center">
              <ArrowLeft size={16} className="mr-1" /> Back to Applications
            </Link>
          </div>

          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <h1 className="text-2xl md:text-3xl font-bold">Pay Application #{application.id.slice(-4)}</h1>
                  <StatusBadge status={application.status} />
                </div>
                <p className="text-muted-foreground">
                  {application.projectName} • {application.contractor} • 
                  Submitted: {new Date(application.submittedDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                </p>
              </div>

              <div className="flex flex-wrap gap-2">
                {isReviewer && application.status === 'pending_review' && (
                  <>
                    <CustomButton variant="outline" size="sm">
                      <X size={16} className="mr-2" /> Request Changes
                    </CustomButton>
                    <CustomButton size="sm">
                      <Check size={16} className="mr-2" /> Approve
                    </CustomButton>
                  </>
                )}
                {(user?.role === 'director' || user?.role === 'pm') && application.status === 'approved' && (
                  <CustomButton size="sm">
                    <Download size={16} className="mr-2" /> Download AIA G702
                  </CustomButton>
                )}
              </div>
            </div>
          </motion.div>

          {/* Header Summary */}
          <div className="bg-white dark:bg-gray-900 rounded-xl p-6 shadow-card mb-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div>
                <div className="text-sm text-muted-foreground">Total Amount</div>
                <div className="text-2xl font-semibold">{application.amount}</div>
              </div>
              <div>
                <div className="text-sm text-muted-foreground">Status</div>
                <StatusBadge status={application.status} />
              </div>
              <div>
                <div className="text-sm text-muted-foreground">Current Reviewer</div>
                <div className="font-medium">{application.currentReviewer || 'N/A'}</div>
              </div>
              <div>
                <div className="text-sm text-muted-foreground">Line Items</div>
                <div className="font-medium">{application.lineItems.length}</div>
              </div>
            </div>
          </div>

          {/* Line Items */}
          <h2 className="text-xl font-semibold mb-4">Line Items</h2>
          <div className="space-y-4 mb-8">
            {application.lineItems.map((item: any) => (
              <div 
                key={item.id}
                className="bg-white dark:bg-gray-900 rounded-xl shadow-card overflow-hidden"
              >
                <div 
                  className="p-4 cursor-pointer flex items-center justify-between hover:bg-muted/30 transition-colors"
                  onClick={() => toggleLineItem(item.id)}
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-muted-foreground">#{item.number}</span>
                      <h3 className="font-medium">{item.description}</h3>
                    </div>
                    <div className="text-sm text-muted-foreground mt-1">
                      Scheduled Value: {formatCurrency(item.scheduledValue)} • 
                      {item.percentageComplete}% Complete • 
                      Balance: {formatCurrency(item.balanceToFinish)}
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <div className="font-medium">{formatCurrency(item.totalCompletedToDate)}</div>
                      <div className="text-xs text-muted-foreground">Total to Date</div>
                    </div>
                    {expandedLineItems[item.id] ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                  </div>
                </div>

                {expandedLineItems[item.id] && (
                  <div className="px-4 pb-4 border-t border-border pt-4">
                    {/* Financial Details */}
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="border-b border-border">
                            <th className="text-left pb-2 font-medium text-muted-foreground">Description</th>
                            <th className="text-right pb-2 font-medium text-muted-foreground">Scheduled Value</th>
                            <th className="text-right pb-2 font-medium text-muted-foreground">Previous Applications</th>
                            <th className="text-right pb-2 font-medium text-muted-foreground">This Period</th>
                            <th className="text-right pb-2 font-medium text-muted-foreground">Materials Stored</th>
                            <th className="text-right pb-2 font-medium text-muted-foreground">Total Completed</th>
                            <th className="text-right pb-2 font-medium text-muted-foreground">%</th>
                            <th className="text-right pb-2 font-medium text-muted-foreground">Balance</th>
                            <th className="text-right pb-2 font-medium text-muted-foreground">Retainage</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr>
                            <td className="py-3 font-medium">{item.description}</td>
                            <td className="py-3 text-right">{formatCurrency(item.scheduledValue)}</td>
                            <td className="py-3 text-right">{formatCurrency(item.previouslyCompleted)}</td>
                            <td className="py-3 text-right">{formatCurrency(item.thisperiod)}</td>
                            <td className="py-3 text-right">{formatCurrency(item.storedMaterials)}</td>
                            <td className="py-3 text-right font-medium">{formatCurrency(item.totalCompletedToDate)}</td>
                            <td className="py-3 text-right">{item.percentageComplete}%</td>
                            <td className="py-3 text-right">{formatCurrency(item.balanceToFinish)}</td>
                            <td className="py-3 text-right">{formatCurrency(item.retainage)}</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>

                    {/* Expenses */}
                    <div className="mt-6">
                      <h4 className="font-medium mb-3">Expenses</h4>
                      {item.expenses.length === 0 ? (
                        <p className="text-muted-foreground">No expenses added</p>
                      ) : (
                        <div className="space-y-3">
                          {item.expenses.map((expense: any) => (
                            <div 
                              key={expense.id}
                              className="border border-border rounded-lg overflow-hidden"
                            >
                              <div 
                                className="p-3 flex items-center justify-between cursor-pointer hover:bg-muted/30 transition-colors"
                                onClick={() => toggleExpense(expense.id)}
                              >
                                <div className="flex items-center gap-3">
                                  <div className={cn(
                                    "w-2 h-2 rounded-full",
                                    expense.approved ? "bg-green-500" : "bg-amber-500"
                                  )} />
                                  <div>
                                    <div className="font-medium">{expense.name}</div>
                                    <div className="text-xs text-muted-foreground">
                                      {expense.category} • {new Date(expense.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                                    </div>
                                  </div>
                                </div>
                                <div className="flex items-center gap-4">
                                  <div className="text-right">
                                    <div className="font-medium">{formatCurrency(expense.amount)}</div>
                                    {expense.hasReceipt && (
                                      <div className="text-xs text-muted-foreground">Receipt Available</div>
                                    )}
                                  </div>
                                  {expandedExpenses[expense.id] ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                                </div>
                              </div>

                              {expandedExpenses[expense.id] && (
                                <div className="px-4 py-3 border-t border-border">
                                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                      <div className="text-sm text-muted-foreground mb-1">Details</div>
                                      <p className="text-sm">{expense.comments || 'No comments provided'}</p>
                                    </div>
                                    <div>
                                      {expense.hasReceipt && (
                                        <div className="flex justify-end">
                                          <CustomButton variant="outline" size="sm">
                                            <Download size={14} className="mr-2" /> View Receipt
                                          </CustomButton>
                                        </div>
                                      )}
                                    </div>
                                  </div>

                                  {isReviewer && !expense.approved && (
                                    <div className="flex justify-end gap-2 mt-4 pt-3 border-t border-border">
                                      <CustomButton variant="outline" size="sm">
                                        <X size={14} className="mr-1" /> Reject
                                      </CustomButton>
                                      <CustomButton size="sm">
                                        <Check size={14} className="mr-1" /> Approve
                                      </CustomButton>
                                    </div>
                                  )}
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      )}

                      {isContractor && (
                        <div className="mt-4">
                          <CustomButton size="sm" variant="outline">
                            <Plus size={16} className="mr-2" /> Add Expense
                          </CustomButton>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Review Status */}
          <div className="bg-white dark:bg-gray-900 rounded-xl p-6 shadow-card">
            <h2 className="text-xl font-semibold mb-4">Review Process</h2>
            <div className="space-y-4">
              {application.reviewers.map((reviewer: string, index: number) => {
                const isCurrentReviewer = reviewer === application.currentReviewer;
                const hasReviewed = application.status === 'approved' || 
                  (application.status === 'pending_review' && 
                   application.reviewers.indexOf(application.currentReviewer) > index);
                
                return (
                  <div 
                    key={index}
                    className={cn(
                      "p-4 border rounded-lg flex items-center justify-between",
                      isCurrentReviewer ? "border-amber-500 bg-amber-50/50 dark:bg-amber-950/20" : 
                        hasReviewed ? "border-green-500 bg-green-50/50 dark:bg-green-950/20" : 
                          "border-gray-200 dark:border-gray-800"
                    )}
                  >
                    <div className="flex items-center gap-3">
                      <div className={cn(
                        "w-2 h-2 rounded-full",
                        isCurrentReviewer ? "bg-amber-500" : 
                          hasReviewed ? "bg-green-500" : "bg-gray-300 dark:bg-gray-600"
                      )} />
                      <div>
                        <div className="font-medium">{reviewer}</div>
                        <div className="text-xs text-muted-foreground">
                          {isCurrentReviewer ? "Currently Reviewing" : 
                            hasReviewed ? "Approved" : "Pending"}
                        </div>
                      </div>
                    </div>
                    {hasReviewed && (
                      <div className="flex items-center text-green-600 dark:text-green-400">
                        <Check size={16} className="mr-1" />
                        <span className="text-sm font-medium">Approved</span>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default PayApplicationDetails;
