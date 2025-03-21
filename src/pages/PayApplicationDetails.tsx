
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
  DollarSign,
  ChevronDown,
  ChevronUp,
  Plus,
  ArrowUp,
} from 'lucide-react';
import Sidebar from '@/components/layout/Sidebar';
import { useAuth } from '@/contexts/AuthContext';
import { useApi } from '@/hooks/use-api';
import { CustomButton } from '@/components/ui/custom-button';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';

interface Expense {
  id: string;
  name: string;
  amount: string;
  date: string;
  category: string;
  comments: string;
  receipt: string;
}

interface LineItem {
  id: string;
  itemNo: string;
  description: string;
  scheduledValue: string;
  fromPreviousApplication: string;
  thisPeriod: string;
  materialsPresent: string;
  totalCompleted: string;
  percentage: string;
  balanceToFinish: string;
  retainage: string;
  expenses: Expense[];
}

interface Reviewer {
  name: string;
  role: string;
  status: 'approved' | 'reviewing' | 'pending';
}

interface PayApplication {
  id: string;
  projectId: string;
  projectName: string;
  contractor: string;
  submittedDate: string;
  periodFrom: string;
  periodTo: string;
  amount: string;
  status: 'approved' | 'pending_review' | 'changes_requested';
  reviewers: string[];
  currentReviewer: string | null;
  totalContractSum: string;
  currentPayment: string;
  previousPayments: string;
  balance: string;
  retainage: string;
  reviewChain: Reviewer[];
}

const mockLineItems: LineItem[] = [
  {
    id: "1",
    itemNo: "1.01",
    description: "Foundation Work",
    scheduledValue: "$25,000.00",
    fromPreviousApplication: "$10,000.00",
    thisPeriod: "$5,000.00",
    materialsPresent: "$0.00",
    totalCompleted: "$15,000.00",
    percentage: "60%",
    balanceToFinish: "$10,000.00",
    retainage: "$750.00",
    expenses: [
      {
        id: "e1",
        name: "Concrete Materials",
        amount: "$2,450.00",
        date: "2023-10-05",
        category: "Material",
        comments: "Purchase of high-grade concrete for foundation pouring. Includes delivery fee and taxes.",
        receipt: "receipt1.pdf"
      },
      {
        id: "e2",
        name: "Site Excavation",
        amount: "$1,800.00",
        date: "2023-10-02",
        category: "Labor",
        comments: "Payment for excavation crew, 2-day work.",
        receipt: "receipt2.pdf"
      }
    ]
  },
  {
    id: "2",
    itemNo: "1.02",
    description: "Framing",
    scheduledValue: "$30,000.00",
    fromPreviousApplication: "$5,000.00",
    thisPeriod: "$15,000.00",
    materialsPresent: "$2,000.00",
    totalCompleted: "$22,000.00",
    percentage: "73%",
    balanceToFinish: "$8,000.00",
    retainage: "$1,100.00",
    expenses: [
      {
        id: "e3",
        name: "Lumber Delivery",
        amount: "$5,250.00",
        date: "2023-10-12",
        category: "Material",
        comments: "Lumber package for wall and roof framing.",
        receipt: "receipt3.pdf"
      },
      {
        id: "e4",
        name: "Framing Crew Labor",
        amount: "$7,800.00",
        date: "2023-10-18",
        category: "Labor",
        comments: "Framing labor for walls and roof structure, 5 days work.",
        receipt: "receipt4.pdf"
      },
      {
        id: "e5",
        name: "Crane Rental",
        amount: "$1,200.00",
        date: "2023-10-17",
        category: "Equipment",
        comments: "One-day crane rental for roof trusses installation.",
        receipt: "receipt5.pdf"
      }
    ]
  },
  {
    id: "3",
    itemNo: "1.03",
    description: "Electrical Work",
    scheduledValue: "$18,000.00",
    fromPreviousApplication: "$0.00",
    thisPeriod: "$8,000.00",
    materialsPresent: "$3,000.00",
    totalCompleted: "$11,000.00",
    percentage: "61%",
    balanceToFinish: "$7,000.00",
    retainage: "$550.00",
    expenses: [
      {
        id: "e6",
        name: "Electrical Materials",
        amount: "$3,850.00",
        date: "2023-10-25",
        category: "Material",
        comments: "Wiring, panels, and fixtures for first floor electrical.",
        receipt: "receipt6.pdf"
      }
    ]
  }
];

const mockApplicationSummary: PayApplication = {
  id: "PA1",
  projectId: "PROJ123",
  projectName: "Riverfront Office Building",
  contractor: "ABC Construction Inc.",
  submittedDate: "2023-11-01",
  periodFrom: "2023-10-01",
  periodTo: "2023-10-31",
  amount: "$28,000.00",
  status: "pending_review",
  reviewers: ["John Smith", "Emily Rodriguez", "Michael Chen"],
  currentReviewer: "Emily Rodriguez",
  totalContractSum: "$125,000.00",
  currentPayment: "$28,000.00",
  previousPayments: "$15,000.00",
  balance: "$82,000.00",
  retainage: "$2,400.00",
  reviewChain: [
    {
      name: "John Smith",
      role: "Project Manager",
      status: "approved"
    },
    {
      name: "Emily Rodriguez",
      role: "Financial Analyst",
      status: "reviewing"
    },
    {
      name: "Michael Chen",
      role: "Director",
      status: "pending"
    }
  ]
};

const PayApplicationDetails = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const [application, setApplication] = useState<PayApplication>(mockApplicationSummary);
  const [lineItems, setLineItems] = useState<LineItem[]>(mockLineItems);
  const [isLoading, setIsLoading] = useState(true);
  const [openLineItems, setOpenLineItems] = useState<string[]>([]);
  const [isExpenseModalOpen, setIsExpenseModalOpen] = useState(false);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [reviewAction, setReviewAction] = useState('');
  const [reviewComment, setReviewComment] = useState('');
  const [showReceipt, setShowReceipt] = useState(false);
  const [selectedReceipt, setSelectedReceipt] = useState('');
  const [selectedLineItemForExpense, setSelectedLineItemForExpense] = useState<LineItem | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        await new Promise(resolve => setTimeout(resolve, 800));
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

  const toggleLineItem = (id: string) => {
    setOpenLineItems(prev => {
      if (prev.includes(id)) {
        return prev.filter(itemId => itemId !== id);
      } else {
        return [...prev, id];
      }
    });
  };

  const handleApproveApplication = () => {
    setReviewAction('approve');
    setIsReviewModalOpen(true);
  };

  const handleRequestChanges = () => {
    setReviewAction('reject');
    setIsReviewModalOpen(true);
  };

  const submitReview = async () => {
    try {
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

  const handleAddExpense = (lineItem: LineItem) => {
    setSelectedLineItemForExpense(lineItem);
    setIsExpenseModalOpen(true);
  };

  const closeExpenseModal = () => {
    setIsExpenseModalOpen(false);
    setSelectedLineItemForExpense(null);
  };

  const closeReceipt = () => {
    setShowReceipt(false);
    setSelectedReceipt('');
  };

  const viewReceipt = (receiptId: string) => {
    setSelectedReceipt(receiptId);
    setShowReceipt(true);
  };

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

  const ExpenseCard = ({ expense }: { expense: Expense }) => {
    const [isExpanded, setIsExpanded] = useState(false);

    const getCategoryColor = (category: string) => {
      switch (category) {
        case 'Equipment':
          return 'bg-green-500';
        case 'Labor':
          return 'bg-amber-500';
        case 'Material':
          return 'bg-blue-500';
        default:
          return 'bg-gray-500';
      }
    };

    return (
      <div className="border border-border rounded-lg mb-3 overflow-hidden">
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center gap-3">
            <div className={`w-2 h-2 rounded-full ${getCategoryColor(expense.category)}`}></div>
            <div>
              <h5 className="font-medium">{expense.name}</h5>
              <p className="text-sm text-muted-foreground">
                {expense.category} • {new Date(expense.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="text-lg font-semibold">{expense.amount}</p>
              <p className="text-xs text-muted-foreground">Receipt Available</p>
            </div>
            <button 
              onClick={() => setIsExpanded(!isExpanded)}
              className="p-1 hover:bg-muted rounded-full"
            >
              {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
            </button>
          </div>
        </div>
        
        {isExpanded && (
          <div className="px-4 pb-4 pt-0 border-t border-border">
            <div className="mt-4">
              <h6 className="text-sm font-medium mb-2">Details</h6>
              <p className="text-sm mb-4">{expense.comments}</p>
              
              <button 
                onClick={() => viewReceipt(expense.receipt)}
                className="flex items-center text-primary hover:underline text-sm"
              >
                <Download size={16} className="mr-2" /> View Receipt
              </button>
            </div>
          </div>
        )}
      </div>
    );
  };

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
                <h1 className="text-2xl md:text-3xl font-bold">Pay Application #{application.id}</h1>
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
            
            <p className="text-muted-foreground mb-6">
              {application.projectName} • {application.contractor} • Submitted: {new Date(application.submittedDate).toLocaleDateString()}
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm p-4">
              <p className="text-sm text-muted-foreground">Total Amount</p>
              <p className="text-2xl font-bold">{application.currentPayment}</p>
            </div>
            <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm p-4">
              <p className="text-sm text-muted-foreground">Status</p>
              <div className="mt-1">
                <span className={cn(
                  "px-2.5 py-1 rounded-full text-sm font-medium",
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
            <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm p-4">
              <p className="text-sm text-muted-foreground">Current Reviewer</p>
              <p className="text-lg font-semibold">{application.currentReviewer}</p>
            </div>
            <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm p-4">
              <p className="text-sm text-muted-foreground">Line Items</p>
              <p className="text-2xl font-bold">{lineItems.length}</p>
            </div>
          </div>

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

          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-6">Line Items</h2>
            
            <div className="space-y-4">
              {lineItems.map((item) => (
                <Collapsible 
                  key={item.id}
                  open={openLineItems.includes(item.id)}
                  onOpenChange={() => toggleLineItem(item.id)}
                  className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-border overflow-hidden"
                >
                  <CollapsibleTrigger className="w-full flex justify-between items-center p-4 hover:bg-muted/40 transition-colors text-left">
                    <div className="flex-1">
                      <div className="flex justify-between items-start">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-medium">#{item.itemNo}</span>
                            <h3 className="font-medium">{item.description}</h3>
                          </div>
                          <p className="text-sm text-muted-foreground">
                            Scheduled Value: {item.scheduledValue} • {item.percentage} Complete • Balance: {item.balanceToFinish}
                          </p>
                        </div>
                        
                        <div className="text-right">
                          <div className="text-lg font-semibold">{item.totalCompleted}</div>
                          <div className="text-sm text-muted-foreground">Total to Date</div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="ml-4">
                      {openLineItems.includes(item.id) ? (
                        <ChevronUp size={20} className="text-muted-foreground" />
                      ) : (
                        <ChevronDown size={20} className="text-muted-foreground" />
                      )}
                    </div>
                  </CollapsibleTrigger>
                  
                  <CollapsibleContent>
                    <div className="p-4 pt-0 border-t border-border">
                      <div className="overflow-x-auto mt-4">
                        <table className="w-full text-sm">
                          <thead>
                            <tr className="border-b border-border">
                              <th className="text-left py-2 font-medium text-muted-foreground">ITEM NO.</th>
                              <th className="text-left py-2 font-medium text-muted-foreground">DESCRIPTION</th>
                              <th className="text-right py-2 font-medium text-muted-foreground">SCHEDULED VALUE</th>
                              <th className="text-right py-2 font-medium text-muted-foreground">PREVIOUS APPLICATIONS</th>
                              <th className="text-right py-2 font-medium text-muted-foreground">THIS PERIOD</th>
                              <th className="text-right py-2 font-medium text-muted-foreground">MATERIALS STORED</th>
                              <th className="text-right py-2 font-medium text-muted-foreground">TOTAL COMPLETED</th>
                              <th className="text-right py-2 font-medium text-muted-foreground">%</th>
                              <th className="text-right py-2 font-medium text-muted-foreground">BALANCE</th>
                              <th className="text-right py-2 font-medium text-muted-foreground">RETAINAGE</th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr>
                              <td className="py-3">{item.itemNo}</td>
                              <td className="py-3">{item.description}</td>
                              <td className="py-3 text-right">{item.scheduledValue}</td>
                              <td className="py-3 text-right">{item.fromPreviousApplication}</td>
                              <td className="py-3 text-right">{item.thisPeriod}</td>
                              <td className="py-3 text-right">{item.materialsPresent}</td>
                              <td className="py-3 text-right">{item.totalCompleted}</td>
                              <td className="py-3 text-right">{item.percentage}</td>
                              <td className="py-3 text-right">{item.balanceToFinish}</td>
                              <td className="py-3 text-right">{item.retainage}</td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                      
                      <div className="mt-6">
                        <div className="flex items-center justify-between mb-3">
                          <h4 className="font-medium">Expenses</h4>
                          {user?.role === 'contractor' && (
                            <CustomButton 
                              size="sm" 
                              onClick={() => handleAddExpense(item)}
                              className="h-8"
                            >
                              <Plus size={16} className="mr-2" /> Add Expense
                            </CustomButton>
                          )}
                        </div>
                        
                        {item.expenses.length > 0 ? (
                          <div className="space-y-1">
                            {item.expenses.map((expense: Expense) => (
                              <ExpenseCard key={expense.id} expense={expense} />
                            ))}
                          </div>
                        ) : (
                          <div className="text-center py-6 bg-muted/20 rounded-lg border border-dashed border-border">
                            <DollarSign size={24} className="mx-auto text-muted-foreground opacity-20 mb-2" />
                            <p className="text-muted-foreground">No expenses added yet</p>
                            {user?.role === 'contractor' && (
                              <CustomButton 
                                size="sm" 
                                variant="outline" 
                                className="mt-3"
                                onClick={() => handleAddExpense(item)}
                              >
                                <Plus size={16} className="mr-2" /> Add Expense
                              </CustomButton>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  </CollapsibleContent>
                </Collapsible>
              ))}
            </div>
            
            <div className="mt-8">
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
              
              {application.status === 'approved' && (
                <div className="flex justify-end">
                  <CustomButton>
                    <Download size={16} className="mr-2" /> Export as G702
                  </CustomButton>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

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

      {isExpenseModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white dark:bg-gray-900 rounded-xl shadow-elevation max-w-md w-full">
            <div className="p-6 border-b border-border flex items-center justify-between">
              <h2 className="text-xl font-semibold">
                Add Expense to {selectedLineItemForExpense?.description}
              </h2>
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
