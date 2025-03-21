
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link, useParams } from 'react-router-dom';
import { 
  FileText, 
  Download, 
  Check, 
  X, 
  ArrowLeft, 
  Clock, 
  PlusCircle, 
  Upload,
  DollarSign
} from 'lucide-react';
import Sidebar from '@/components/layout/Sidebar';
import { useAuth } from '@/contexts/AuthContext';
import { useApi } from '@/hooks/use-api';
import { CustomButton } from '@/components/ui/custom-button';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

// Mock pay application data
const mockLineItems = [
  {
    id: '1',
    itemNo: 'A-01',
    description: 'Site Work & Excavation',
    scheduledValue: '$45,000.00',
    fromPreviousApplication: '$23,000.00',
    thisPeriod: '$12,000.00',
    materialsPresent: '$0.00',
    totalCompleted: '$35,000.00',
    percentage: '78%',
    balanceToFinish: '$10,000.00',
    retainage: '$3,500.00',
    expenses: [
      {
        id: 'exp1',
        name: 'Equipment Rental',
        amount: '$5,200.00',
        date: '2023-09-15',
        category: 'Equipment',
        receipt: 'receipt1.pdf',
        comments: 'Excavator rental from ABC Equipment',
        status: 'approved'
      },
      {
        id: 'exp2',
        name: 'Labor Costs',
        amount: '$6,800.00',
        date: '2023-09-18',
        category: 'Labor',
        receipt: 'receipt2.pdf',
        comments: 'Site preparation team - 4 workers',
        status: 'pending'
      }
    ]
  },
  {
    id: '2',
    itemNo: 'A-02',
    description: 'Foundation',
    scheduledValue: '$62,000.00',
    fromPreviousApplication: '$31,000.00',
    thisPeriod: '$18,000.00',
    materialsPresent: '$3,000.00',
    totalCompleted: '$52,000.00',
    percentage: '84%',
    balanceToFinish: '$10,000.00',
    retainage: '$5,200.00',
    expenses: [
      {
        id: 'exp3',
        name: 'Concrete Delivery',
        amount: '$12,500.00',
        date: '2023-09-22',
        category: 'Material',
        receipt: 'receipt3.pdf',
        comments: 'Foundation concrete pour',
        status: 'approved'
      },
      {
        id: 'exp4',
        name: 'Rebar Installation',
        amount: '$5,500.00',
        date: '2023-09-24',
        category: 'Labor',
        receipt: 'receipt4.pdf',
        comments: 'Rebar installation labor',
        status: 'changes_requested'
      }
    ]
  },
  {
    id: '3',
    itemNo: 'A-03',
    description: 'Framing & Structure',
    scheduledValue: '$95,000.00',
    fromPreviousApplication: '$0.00',
    thisPeriod: '$45,000.00',
    materialsPresent: '$20,000.00',
    totalCompleted: '$65,000.00',
    percentage: '68%',
    balanceToFinish: '$30,000.00',
    retainage: '$6,500.00',
    expenses: [
      {
        id: 'exp5',
        name: 'Lumber Package',
        amount: '$32,000.00',
        date: '2023-10-01',
        category: 'Material',
        receipt: 'receipt5.pdf',
        comments: 'Complete lumber package for framing',
        status: 'pending'
      },
      {
        id: 'exp6',
        name: 'Framing Crew',
        amount: '$13,000.00',
        date: '2023-10-05',
        category: 'Labor',
        receipt: 'receipt6.pdf',
        comments: 'Framing labor - 6 workers',
        status: 'pending'
      }
    ]
  },
];

// Application summary data
const mockApplicationSummary = {
  id: 'pa1',
  projectId: '1',
  projectName: 'Office Building Renovation',
  contractor: 'Smith Construction',
  periodFrom: '2023-09-01',
  periodTo: '2023-09-30',
  submittedDate: '2023-10-02',
  contractDate: '2023-07-15',
  totalContractSum: '$1,250,000.00',
  currentPayment: '$75,000.00',
  previousPayments: '$230,000.00',
  balance: '$945,000.00',
  retainage: '$30,500.00',
  status: 'pending_review',
  currentReviewer: 'Alice Wilson',
  reviewChain: [
    { name: 'Alice Wilson', role: 'Financial Auditor', status: 'reviewing' },
    { name: 'Bob Thomas', role: 'Technical Reviewer', status: 'pending' },
    { name: 'Director User', role: 'Director', status: 'pending' },
  ]
};

const PayApplicationDetails = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const [application, setApplication] = useState(mockApplicationSummary);
  const [lineItems, setLineItems] = useState(mockLineItems);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedLineItem, setSelectedLineItem] = useState<any>(null);
  const [isExpenseModalOpen, setIsExpenseModalOpen] = useState(false);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [reviewAction, setReviewAction] = useState('');
  const [reviewComment, setReviewComment] = useState('');
  const [showReceipt, setShowReceipt] = useState(false);
  const [selectedReceipt, setSelectedReceipt] = useState('');

  useEffect(() => {
    // Simulate API call to get application details
    const fetchData = async () => {
      try {
        setIsLoading(true);
        // In a real implementation, this would be an API call
        await new Promise(resolve => setTimeout(resolve, 800));
        
        // For now, we're using mock data
        setApplication(mockApplicationSummary);
        setLineItems(mockLineItems);
      } catch (error) {
        console.error('Error fetching pay application:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, [id]);

  const handleApproveApplication = () => {
    // Open review modal with approve action
    setReviewAction('approve');
    setIsReviewModalOpen(true);
  };

  const handleRequestChanges = () => {
    // Open review modal with reject action
    setReviewAction('reject');
    setIsReviewModalOpen(true);
  };

  const submitReview = async () => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      if (reviewAction === 'approve') {
        toast.success('Pay application approved and sent to next reviewer');
      } else {
        toast.info('Changes requested from contractor');
      }
      
      setIsReviewModalOpen(false);
      setReviewComment('');
    } catch (error) {
      console.error('Error submitting review:', error);
      toast.error('Failed to submit review');
    }
  };

  const handleAddExpense = () => {
    setIsExpenseModalOpen(true);
  };

  const closeExpenseModal = () => {
    setIsExpenseModalOpen(false);
  };

  const closeReceipt = () => {
    setShowReceipt(false);
    setSelectedReceipt('');
  };

  const viewReceipt = (receiptId: string) => {
    setSelectedReceipt(receiptId);
    setShowReceipt(true);
  };

  // Status badge component for expenses
  const StatusBadge = ({ status }: { status: string }) => {
    const statusStyles = {
      approved: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
      pending: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
      changes_requested: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
    };
  
    const statusText = {
      approved: "Approved",
      pending: "Pending Review",
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

  const LineItemCard = ({ item }: { item: any }) => (
    <div 
      className="bg-white dark:bg-gray-900 rounded-xl overflow-hidden shadow-card hover:shadow-elevation transition-all duration-300 cursor-pointer"
      onClick={() => setSelectedLineItem(item)}
    >
      <div className="p-6">
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
          <div>
            <h3 className="font-medium text-lg">{item.itemNo}: {item.description}</h3>
            <p className="text-muted-foreground">Scheduled Value: {item.scheduledValue}</p>
          </div>
          <div className="flex flex-col items-end">
            <div className="text-sm font-medium">This Period: {item.thisPeriod}</div>
            <div className="text-sm text-muted-foreground">
              Total: {item.totalCompleted} ({item.percentage})
            </div>
          </div>
        </div>
      </div>
    </div>
  );

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
              <div className="flex items-center gap-2">
                <Link to="/applications" className="text-muted-foreground hover:text-foreground transition-colors">
                  <ArrowLeft size={18} />
                </Link>
                <h1 className="text-2xl md:text-3xl font-bold">{application.projectName}</h1>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <span className={cn(
                  "px-3 py-1 rounded-full text-sm font-medium",
                  application.status === 'approved' ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400" :
                  application.status === 'pending_review' ? "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400" :
                  "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                )}>
                  {application.status === 'approved' ? 'Approved' :
                   application.status === 'pending_review' ? 'Pending Review' :
                   'Changes Requested'}
                </span>
              </div>
            </div>
          </motion.div>

          {/* Application Summary */}
          <div className="bg-white dark:bg-gray-900 rounded-xl shadow-card mb-8 p-6">
            <h2 className="text-lg font-semibold mb-4">Application Summary</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div>
                <p className="text-sm text-muted-foreground">Contractor</p>
                <p className="font-medium">{application.contractor}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Period</p>
                <p className="font-medium">{new Date(application.periodFrom).toLocaleDateString()} - {new Date(application.periodTo).toLocaleDateString()}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Submitted</p>
                <p className="font-medium">{new Date(application.submittedDate).toLocaleDateString()}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Contract Sum</p>
                <p className="font-medium">{application.totalContractSum}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Current Payment</p>
                <p className="font-medium">{application.currentPayment}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Previous Payments</p>
                <p className="font-medium">{application.previousPayments}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Balance to Finish</p>
                <p className="font-medium">{application.balance}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Retainage</p>
                <p className="font-medium">{application.retainage}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Current Reviewer</p>
                <p className="font-medium">{application.currentReviewer}</p>
              </div>
            </div>
          </div>

          {/* Review Chain */}
          <div className="bg-white dark:bg-gray-900 rounded-xl shadow-card mb-8 p-6">
            <h2 className="text-lg font-semibold mb-4">Review Chain</h2>
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
              {application.reviewChain.map((reviewer, index) => (
                <div key={index} className="flex items-center gap-3">
                  <div 
                    className={cn(
                      "flex items-center justify-center w-8 h-8 rounded-full text-white",
                      reviewer.status === 'reviewing' ? "bg-amber-500" :
                      reviewer.status === 'approved' ? "bg-green-500" : "bg-muted"
                    )}
                  >
                    {reviewer.status === 'approved' ? (
                      <Check size={16} />
                    ) : reviewer.status === 'reviewing' ? (
                      <Clock size={16} />
                    ) : (
                      index + 1
                    )}
                  </div>
                  <div>
                    <p className="font-medium text-sm">{reviewer.name}</p>
                    <p className="text-xs text-muted-foreground">{reviewer.role}</p>
                  </div>
                  
                  {index < application.reviewChain.length - 1 && (
                    <div className="hidden sm:block w-8 h-px bg-border mx-2"></div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Line Items Section */}
          {selectedLineItem ? (
            <div className="mb-8">
              <button 
                onClick={() => setSelectedLineItem(null)}
                className="mb-4 flex items-center text-sm text-muted-foreground hover:text-foreground"
              >
                <ArrowLeft size={16} className="mr-1" /> Back to all line items
              </button>
              
              <div className="bg-white dark:bg-gray-900 rounded-xl shadow-card mb-6">
                <div className="p-6 border-b border-border">
                  <h2 className="text-lg font-semibold">{selectedLineItem.itemNo}: {selectedLineItem.description}</h2>
                </div>
                
                <div className="p-6">
                  <h3 className="font-medium mb-4">Financial Summary</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-4 mb-6">
                    <div>
                      <p className="text-sm text-muted-foreground">Scheduled Value</p>
                      <p className="font-medium">{selectedLineItem.scheduledValue}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">From Previous Application</p>
                      <p className="font-medium">{selectedLineItem.fromPreviousApplication}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">This Period</p>
                      <p className="font-medium">{selectedLineItem.thisPeriod}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Materials Present</p>
                      <p className="font-medium">{selectedLineItem.materialsPresent}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Total Completed</p>
                      <p className="font-medium">{selectedLineItem.totalCompleted}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Percentage</p>
                      <p className="font-medium">{selectedLineItem.percentage}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Balance to Finish</p>
                      <p className="font-medium">{selectedLineItem.balanceToFinish}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Retainage</p>
                      <p className="font-medium">{selectedLineItem.retainage}</p>
                    </div>
                  </div>
                  
                  <div className="mt-8">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-medium">Expenses</h3>
                      {user?.role === 'contractor' && (
                        <CustomButton size="sm" onClick={handleAddExpense}>
                          <PlusCircle size={16} className="mr-2" /> Add Expense
                        </CustomButton>
                      )}
                    </div>
                    
                    {selectedLineItem.expenses.length > 0 ? (
                      <div className="space-y-4">
                        {selectedLineItem.expenses.map((expense: any) => (
                          <div 
                            key={expense.id} 
                            className="bg-muted/30 dark:bg-muted/10 p-4 rounded-lg border border-border"
                          >
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
                              <div>
                                <div className="flex items-center gap-2">
                                  <h4 className="font-medium">{expense.name}</h4>
                                  <StatusBadge status={expense.status} />
                                </div>
                                <p className="text-sm text-muted-foreground">
                                  {new Date(expense.date).toLocaleDateString()} • {expense.category}
                                </p>
                              </div>
                              <div className="text-lg font-semibold">
                                {expense.amount}
                              </div>
                            </div>
                            
                            {expense.comments && (
                              <p className="text-sm mb-3">
                                {expense.comments}
                              </p>
                            )}
                            
                            <div className="flex items-center gap-2">
                              <button 
                                onClick={() => viewReceipt(expense.receipt)}
                                className="text-xs flex items-center text-primary hover:underline"
                              >
                                <FileText size={14} className="mr-1" /> View Receipt
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8 bg-muted/20 rounded-lg border border-dashed border-border">
                        <DollarSign size={32} className="mx-auto text-muted-foreground opacity-20 mb-2" />
                        <p className="text-muted-foreground">No expenses added yet</p>
                        {user?.role === 'contractor' && (
                          <CustomButton 
                            size="sm" 
                            variant="outline" 
                            className="mt-3"
                            onClick={handleAddExpense}
                          >
                            <PlusCircle size={16} className="mr-2" /> Add Expense
                          </CustomButton>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
              
              {/* Reviewer Actions */}
              {user?.role === 'reviewer' && (
                <div className="flex justify-end gap-3">
                  <CustomButton variant="outline" onClick={handleRequestChanges}>
                    <X size={16} className="mr-2" /> Request Changes
                  </CustomButton>
                  <CustomButton onClick={handleApproveApplication}>
                    <Check size={16} className="mr-2" /> Approve
                  </CustomButton>
                </div>
              )}
              
              {/* Director Actions */}
              {user?.role === 'director' && application.status === 'pending_review' && (
                <div className="flex justify-end gap-3">
                  <CustomButton variant="outline" onClick={handleRequestChanges}>
                    <X size={16} className="mr-2" /> Request Changes
                  </CustomButton>
                  <CustomButton onClick={handleApproveApplication}>
                    <Check size={16} className="mr-2" /> Approve & Finalize
                  </CustomButton>
                </div>
              )}
              
              {/* Export Actions */}
              {application.status === 'approved' && (
                <div className="flex justify-end">
                  <CustomButton>
                    <Download size={16} className="mr-2" /> Export as G702
                  </CustomButton>
                </div>
              )}
            </div>
          ) : (
            <div className="mb-8">
              <h2 className="text-xl font-semibold mb-6">Line Items</h2>
              <div className="grid grid-cols-1 gap-4">
                {lineItems.map((item) => (
                  <LineItemCard key={item.id} item={item} />
                ))}
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Receipt View Modal */}
      {showReceipt && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white dark:bg-gray-900 rounded-xl shadow-elevation max-w-4xl w-full max-h-screen overflow-auto">
            <div className="p-6 border-b border-border flex items-center justify-between">
              <h2 className="text-xl font-semibold">Receipt</h2>
              <button
                onClick={closeReceipt}
                className="h-8 w-8 rounded-md flex items-center justify-center hover:bg-muted transition-colors"
              >
                <X size={18} />
              </button>
            </div>
            <div className="p-6">
              <div className="bg-muted/30 p-4 rounded-lg text-center">
                <p className="mb-4 text-muted-foreground">
                  Receipt: {selectedReceipt}
                </p>
                {/* Mock receipt display */}
                <div className="bg-white rounded border border-border p-6 max-w-md mx-auto">
                  <h3 className="text-lg font-semibold mb-4">Receipt #{selectedReceipt.split('.')[0]}</h3>
                  <p className="mb-2">Date: Oct 5, 2023</p>
                  <p className="mb-2">Vendor: Building Materials Inc.</p>
                  <p className="mb-2">Description: Construction Materials</p>
                  <p className="mb-6">Amount: $2,450.00</p>
                  <div className="border-t border-border pt-4 text-center">
                    <p className="text-sm text-primary">PAID</p>
                  </div>
                </div>
              </div>
              <div className="flex justify-end mt-4">
                <CustomButton>
                  <Download size={16} className="mr-2" /> Download Receipt
                </CustomButton>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add Expense Modal */}
      {isExpenseModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white dark:bg-gray-900 rounded-xl shadow-elevation max-w-md w-full">
            <div className="p-6 border-b border-border flex items-center justify-between">
              <h2 className="text-xl font-semibold">Add Expense</h2>
              <button
                onClick={closeExpenseModal}
                className="h-8 w-8 rounded-md flex items-center justify-center hover:bg-muted transition-colors"
              >
                <X size={18} />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div className="space-y-2">
                <label htmlFor="expense-name" className="text-sm font-medium">
                  Expense Name
                </label>
                <input
                  id="expense-name"
                  type="text"
                  placeholder="Enter expense name"
                  className="w-full px-4 py-2 border border-input rounded-lg bg-background input-focus"
                />
              </div>
              
              <div className="space-y-2">
                <label htmlFor="expense-amount" className="text-sm font-medium">
                  Amount
                </label>
                <input
                  id="expense-amount"
                  type="text"
                  placeholder="$0.00"
                  className="w-full px-4 py-2 border border-input rounded-lg bg-background input-focus"
                />
              </div>
              
              <div className="space-y-2">
                <label htmlFor="expense-date" className="text-sm font-medium">
                  Date
                </label>
                <input
                  id="expense-date"
                  type="date"
                  className="w-full px-4 py-2 border border-input rounded-lg bg-background input-focus"
                />
              </div>
              
              <div className="space-y-2">
                <label htmlFor="expense-category" className="text-sm font-medium">
                  Category
                </label>
                <select
                  id="expense-category"
                  className="w-full px-4 py-2 border border-input rounded-lg bg-background input-focus"
                >
                  <option value="Material">Material</option>
                  <option value="Labor">Labor</option>
                  <option value="Equipment">Equipment</option>
                  <option value="Misc">Misc</option>
                </select>
              </div>
              
              <div className="space-y-2">
                <label htmlFor="expense-receipt" className="text-sm font-medium">
                  Receipt
                </label>
                <div className="border border-dashed border-input rounded-lg p-4 bg-background">
                  <div className="flex flex-col items-center justify-center">
                    <Upload size={24} className="text-muted-foreground mb-2" />
                    <p className="text-sm text-muted-foreground mb-2">
                      Drag & drop a file or browse
                    </p>
                    <input
                      id="expense-receipt"
                      type="file"
                      className="hidden"
                    />
                    <CustomButton size="sm" variant="outline" onClick={() => document.getElementById('expense-receipt')?.click()}>
                      Browse Files
                    </CustomButton>
                  </div>
                </div>
              </div>
              
              <div className="space-y-2">
                <label htmlFor="expense-comments" className="text-sm font-medium">
                  Comments (Optional)
                </label>
                <textarea
                  id="expense-comments"
                  placeholder="Add any additional details about this expense"
                  className="w-full px-4 py-2 border border-input rounded-lg bg-background input-focus h-24 resize-none"
                ></textarea>
              </div>
            </div>
            <div className="p-6 border-t border-border flex justify-end gap-2">
              <CustomButton variant="outline" onClick={closeExpenseModal}>
                Cancel
              </CustomButton>
              <CustomButton onClick={closeExpenseModal}>
                Save Expense
              </CustomButton>
            </div>
          </div>
        </div>
      )}

      {/* Review Modal */}
      {isReviewModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white dark:bg-gray-900 rounded-xl shadow-elevation max-w-md w-full">
            <div className="p-6 border-b border-border flex items-center justify-between">
              <h2 className="text-xl font-semibold">
                {reviewAction === 'approve' ? 'Approve Application' : 'Request Changes'}
              </h2>
              <button
                onClick={() => setIsReviewModalOpen(false)}
                className="h-8 w-8 rounded-md flex items-center justify-center hover:bg-muted transition-colors"
              >
                <X size={18} />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div className="space-y-2">
                <label htmlFor="review-comments" className="text-sm font-medium">
                  {reviewAction === 'approve' ? 'Comments (Optional)' : 'Comments for Contractor'}
                </label>
                <textarea
                  id="review-comments"
                  value={reviewComment}
                  onChange={(e) => setReviewComment(e.target.value)}
                  placeholder={reviewAction === 'approve' ? 
                    "Add any comments about this approval" : 
                    "Explain what changes the contractor needs to make"
                  }
                  className="w-full px-4 py-2 border border-input rounded-lg bg-background input-focus h-32 resize-none"
                  required={reviewAction === 'reject'}
                ></textarea>
              </div>
            </div>
            <div className="p-6 border-t border-border flex justify-end gap-2">
              <CustomButton variant="outline" onClick={() => setIsReviewModalOpen(false)}>
                Cancel
              </CustomButton>
              <CustomButton 
                onClick={submitReview}
                variant={reviewAction === 'approve' ? 'default' : 'destructive'}
              >
                {reviewAction === 'approve' ? (
                  <>
                    <Check size={16} className="mr-2" /> Submit Approval
                  </>
                ) : (
                  <>
                    <X size={16} className="mr-2" /> Request Changes
                  </>
                )}
              </CustomButton>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PayApplicationDetails;
