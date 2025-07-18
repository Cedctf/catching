import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Home,
  User,
  CreditCard,
  FileText,
  BarChart3,
  Shield,
  Wallet,
  Users,
  Settings,
  Bell,
  CheckCircle,
  AlertCircle,
  Clock,
  ArrowRight,
  Menu,
  X,
  Download
} from 'lucide-react';
import { calculateBusinessAnalytics, formatCurrency } from '../../lib/analytics';

// Import components (we'll create these)
import BusinessOverview from '../../components/dashboard/BusinessOverview';
import ProfileManagement from '../../components/dashboard/ProfileManagement';
import PaymentServices from '../../components/dashboard/PaymentServices';
import InvoicingModule from '../../components/dashboard/InvoicingModule';
import AnalyticsSection from '../../components/dashboard/AnalyticsSection';
import ComplianceTracker from '../../components/dashboard/ComplianceTracker';
import FinancialAccess from '../../components/dashboard/FinancialAccess';
import TeamManagement from '../../components/dashboard/TeamManagement';
import SecuritySettings from '../../components/dashboard/SecuritySettings';

export default function BusinessDashboard() {
  const [activeTab, setActiveTab] = useState('overview');
  const [businessData, setBusinessData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notifications, setNotifications] = useState([]);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [todayReport, setTodayReport] = useState(null);
  const [realtimeStatus, setRealtimeStatus] = useState('connecting');

  // Fetch initial data
  useEffect(() => {
    fetchBusinessData();
  }, []);

  // Setup real-time connection
  useEffect(() => {
    let eventSource;

    const connectEventSource = () => {
      eventSource = new EventSource('/api/business/realtime');

      eventSource.onopen = () => {
        setRealtimeStatus('connected');
      };

      eventSource.onmessage = (event) => {
        const data = JSON.parse(event.data);
        
        setBusinessData(prev => {
          if (!prev) return prev;

          switch (data.type) {
            case 'transaction': {
              const newTransactions = [data.transaction, ...(prev.transactions || [])];
              const newRevenue = (prev.analytics?.revenue?.total || 0) + data.transaction.amount;
              const newTransactionCount = (prev.analytics?.transactions?.total || 0) + 1;
              
              return {
                ...prev,
                transactions: newTransactions,
                analytics: {
                  ...prev.analytics,
                  revenue: {
                    ...prev.analytics?.revenue,
                    total: newRevenue
                  },
                  transactions: {
                    ...prev.analytics?.transactions,
                    total: newTransactionCount
                  }
                }
              };
            }

            case 'invoice': {
              return {
                ...prev,
                invoices: [data.invoice, ...(prev.invoices || [])],
                analytics: {
                  ...prev.analytics,
                  invoices: {
                    ...prev.analytics?.invoices,
                    total: (prev.analytics?.invoices?.total || 0) + 1
                  }
                }
              };
            }

            default:
              return prev;
          }
        });
      };

      eventSource.onerror = () => {
        setRealtimeStatus('disconnected');
        eventSource.close();
        // Try to reconnect after 5 seconds
        setTimeout(connectEventSource, 5000);
      };
    };

    if (businessData) {
      connectEventSource();
    }

    return () => {
      if (eventSource) {
        eventSource.close();
      }
    };
  }, [businessData !== null]); // Only reconnect when businessData changes from null to non-null

  // Handle data updates from child components
  const handleDataUpdate = (newData) => {
    if (JSON.stringify(newData) !== JSON.stringify(businessData)) {
      setBusinessData(newData);
    }
  };

  // Generate today's sales report
  const generateTodayReport = () => {
    if (!businessData) return null;

    const analytics = calculateBusinessAnalytics(businessData.businessToken);
    const today = new Date().toISOString().split('T')[0];
    
    // Get today's revenue from daily revenue
    const todayRevenue = analytics.dailyRevenue.find(day => day.date === today)?.revenue || 0;
    
    // Calculate today's transactions
    const todayTransactions = analytics.completedTransactions;
    const todayPending = analytics.pendingTransactions;
    
    // Get payment method breakdown for today
    const paymentMethodsBreakdown = Object.entries(analytics.paymentMethods).map(([method, data]) => ({
      method,
      amount: data.amount,
      count: data.count,
      percentage: data.percentage
    }));

    const report = {
      date: new Date().toLocaleDateString('en-MY', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      }),
      totalRevenue: todayRevenue,
      transactionCount: todayTransactions,
      pendingTransactions: todayPending,
      averageTransactionValue: analytics.avgTransactionValue,
      paymentMethods: paymentMethodsBreakdown,
      successRate: analytics.successRate
    };

    setTodayReport(report);
    return report;
  };

  // Download report as CSV
  const downloadTodayReport = () => {
    const report = todayReport || generateTodayReport();
    if (!report) return;

    const csvContent = [
      ['Sales Report -', report.date],
      [''],
      ['Total Revenue', formatCurrency(report.totalRevenue)],
      ['Transaction Count', report.transactionCount],
      ['Pending Transactions', report.pendingTransactions],
      ['Average Transaction Value', formatCurrency(report.averageTransactionValue)],
      ['Success Rate', `${report.successRate.toFixed(1)}%`],
      [''],
      ['Payment Method Breakdown'],
      ['Method', 'Amount', 'Count', 'Percentage'],
      ...report.paymentMethods.map(pm => [
        pm.method,
        formatCurrency(pm.amount),
        pm.count,
        `${pm.percentage.toFixed(1)}%`
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `sales_report_${report.date.replace(/[^0-9]/g, '_')}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Close sidebar when clicking outside on mobile
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (sidebarOpen && !event.target.closest('.sidebar') && !event.target.closest('.menu-button')) {
        setSidebarOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [sidebarOpen]);

  const fetchBusinessData = async () => {
    try {
      const response = await fetch('/api/business/dashboard');
      const data = await response.json();
      setBusinessData(data);
      setNotifications(data.notifications || []);
    } catch (error) {
      console.error('Error fetching business data:', error);
    } finally {
      setLoading(false);
    }
  };

  const tabs = [
    { id: 'overview', label: 'Overview', icon: Home, component: BusinessOverview },
    { id: 'profile', label: 'Profile', icon: User, component: ProfileManagement },
    { id: 'payments', label: 'Payments', icon: CreditCard, component: PaymentServices },
    { id: 'invoicing', label: 'Invoicing', icon: FileText, component: InvoicingModule },
    { id: 'analytics', label: 'Analytics', icon: BarChart3, component: AnalyticsSection },
    { id: 'compliance', label: 'Compliance', icon: Shield, component: ComplianceTracker },
    { id: 'financial', label: 'Financial Access', icon: Wallet, component: FinancialAccess },
    { id: 'team', label: 'Team', icon: Users, component: TeamManagement },
    { id: 'security', label: 'Security', icon: Settings, component: SecuritySettings }
  ];

  const ActiveComponent = tabs.find(tab => tab.id === activeTab)?.component;

  // Helper function to format date
  const formatDate = (dateString) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString('en-MY', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleTabChange = (tabId) => {
    setActiveTab(tabId);
    setSidebarOpen(false); // Close sidebar after selecting a tab
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center mt-16">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            className="w-8 h-8 border-2 border-[#002fa7] border-t-transparent rounded-full"
          />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-16">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-16 z-30">
        <div className="max-w-[1400px] mx-auto px-10">
          <div className="flex items-center justify-between h-12">
        <div>
              <h1 className="text-lg font-bold text-gray-900">Business Dashboard</h1>
            </div>
            
            <div className="flex items-center space-x-3">
              {/* Notifications */}
              <div className="relative">
                <button className="p-1.5 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition-colors">
                  <Bell className="h-5 w-5" />
                  {notifications.length > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                      {notifications.length}
                    </span>
                  )}
                </button>
              </div>
            </div>
              </div>
            </div>
      </header>

      <div className="max-w-[1400px] mx-auto p-10">
        <div className="flex relative">
          {/* Permanent Compact Sidebar */}
          <div className="fixed left-0 top-16 bottom-0 w-16 bg-white border-r border-gray-200 z-40">
            <div className="h-full flex flex-col py-4">
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="w-full flex justify-center p-3 mb-2 text-gray-600 hover:text-gray-900 hover:bg-gray-50 transition-colors"
              >
                <Menu className="h-5 w-5" />
              </button>
              <nav className="flex-1 space-y-2">
                {tabs.map((tab) => {
                  const Icon = tab.icon;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => handleTabChange(tab.id)}
                      className={`w-full flex justify-center p-3 hover:bg-gray-50 transition-colors ${
                        activeTab === tab.id ? 'text-[#002fa7]' : 'text-gray-600'
                      }`}
                    >
                      <Icon className="h-5 w-5" />
                    </button>
                  );
                })}
              </nav>
            </div>
        </div>

          {/* Sidebar Overlay */}
          <AnimatePresence>
            {sidebarOpen && (
          <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-gray-900/60 backdrop-blur-sm z-40"
                onClick={() => setSidebarOpen(false)}
              />
            )}
          </AnimatePresence>

          {/* Full Sidebar Navigation */}
          <AnimatePresence>
            {sidebarOpen && (
          <motion.div
                initial={{ x: -300, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: -300, opacity: 0 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
                className="sidebar fixed left-0 top-0 bottom-0 h-screen w-64 bg-white shadow-xl z-50"
                style={{ height: '100vh', position: 'fixed', top: 0, left: 0 }}
              >
                <div className="h-full flex flex-col">
                  <div className="p-4 border-b border-gray-200">
                    <div className="flex justify-end">
                      <button
                        onClick={() => setSidebarOpen(false)}
                        className="p-1.5 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition-colors"
                      >
                        <X className="h-5 w-5" />
                      </button>
                    </div>
                  </div>

                  <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
                    {tabs.map((tab) => {
                      const Icon = tab.icon;
                      return (
                        <button
                          key={tab.id}
                          onClick={() => handleTabChange(tab.id)}
                          className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 ${
                            activeTab === tab.id
                              ? 'bg-[#002fa7] text-white shadow-lg'
                              : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                          }`}
                        >
                          <Icon className="h-5 w-5" />
                          {tab.label}
                          {activeTab === tab.id && (
                            <motion.div
                              layoutId="activeTab"
                              className="ml-auto"
                            >
                              <ArrowRight className="h-4 w-4" />
          </motion.div>
        )}
                        </button>
                      );
                    })}
                  </nav>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Main Content */}
          <div className="flex-1 min-h-screen transition-all duration-300 pl-16">
            <AnimatePresence mode="wait">
      <motion.div
                key={activeTab}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="w-full"
              >
                {ActiveComponent && (
                  <ActiveComponent 
                    businessData={businessData} 
                    onDataUpdate={handleDataUpdate}
                    onDownloadReport={activeTab === 'overview' ? downloadTodayReport : undefined}
                    onTabChange={activeTab === 'overview' ? handleTabChange : undefined}
                  />
                )}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
        </div>
    </div>
  );
}