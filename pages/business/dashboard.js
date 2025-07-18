import { useState, useEffect } from 'react';
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
  Building2,
  CheckCircle,
  AlertCircle,
  Clock,
  ArrowRight,
  Menu,
  X
} from 'lucide-react';

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

  useEffect(() => {
    fetchBusinessData();
  }, []);

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
      setLoading(false);
    } catch (error) {
      console.error('Error fetching business data:', error);
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
      day: 'numeric'
    });
  };

  const handleTabChange = (tabId) => {
    setActiveTab(tabId);
    setSidebarOpen(false); // Close sidebar after selecting a tab
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-8 h-8 border-2 border-[#002fa7] border-t-transparent rounded-full"
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              {/* Menu Button */}
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="menu-button p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <Menu className="h-6 w-6" />
              </button>
              
              <div className="p-2 bg-[#002fa7] rounded-lg">
                <Building2 className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">
                  {businessData?.businessName || 'Business Dashboard'}
                </h1>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              {/* Notifications */}
              <div className="relative">
                <button className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition-colors">
                  <Bell className="h-5 w-5" />
                  {notifications.length > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                      {notifications.length}
                    </span>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex relative">
          {/* Sidebar Overlay for mobile */}
          <AnimatePresence>
            {sidebarOpen && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
                onClick={() => setSidebarOpen(false)}
              />
            )}
          </AnimatePresence>

          {/* Sidebar Navigation */}
          <AnimatePresence>
            {sidebarOpen && (
              <motion.div
                initial={{ x: -300, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: -300, opacity: 0 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
                className="sidebar fixed left-0 top-0 h-full w-80 bg-white shadow-xl z-50 lg:relative lg:w-64 lg:shadow-sm border-r border-gray-200"
              >
                <div className="p-4 border-b border-gray-200 lg:hidden">
                  <div className="flex items-center justify-between">
                    <h2 className="text-lg font-semibold text-gray-900">Menu</h2>
                    <button
                      onClick={() => setSidebarOpen(false)}
                      className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition-colors"
                    >
                      <X className="h-5 w-5" />
                    </button>
                  </div>
                </div>

                <nav className="p-4 space-y-2">
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
              </motion.div>
            )}
          </AnimatePresence>

          {/* Main Content */}
          <div className="flex-1 min-h-screen">
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
                    onDataUpdate={setBusinessData}
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