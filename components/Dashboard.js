import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import MoneyFlowChart from './MoneyFlowChart';
import { 
  Wallet, 
  CreditCard, 
  Plus, 
  MoreVertical, 
  Eye, 
  EyeOff, 
  ArrowUpRight, 
  ArrowDownLeft, 
  TrendingUp, 
  Send,
  Download,
  Settings,
  Bell,
  Search,
  CheckCircle,
  Clock,
  AlertCircle,
  QrCode,
  Link,
  Shield,
  BarChart2,
  Calendar,
  Filter,
  CreditCard as PaymentIcon,
  Building,
  ChevronDown
} from 'lucide-react';
import { useRouter } from 'next/router';

// Mock Data for Malaysian Banks and E-wallets
const walletAccounts = [
  {
    id: 'maybank',
    name: 'Maybank',
    type: 'Bank',
    balance: 15250.75,
    currency: 'MYR',
    icon: <img src="/logos/maybank.jpeg" alt="Maybank" className="h-8 w-8 rounded-full" />,
  },
  {
    id: 'cimb',
    name: 'CIMB Bank',
    type: 'Bank',
    balance: 8540.20,
    currency: 'MYR',
    icon: <img src="/logos/cimb.jpeg" alt="CIMB" className="h-8 w-8 rounded-full" />,
  },
  {
    id: 'hsbc',
    name: 'HSBC Bank',
    type: 'Bank',
    balance: 22300.00,
    currency: 'MYR',
    icon: <img src="/logos/HSBC.png" alt="HSBC" className="h-8 w-8 rounded-full" />,
  },
  {
    id: 'tng',
    name: 'Touch \'n Go',
    type: 'E-Wallet',
    balance: 750.50,
    currency: 'MYR',
    icon: <img src="/logos/tng.webp" alt="Touch n Go" className="h-8 w-8 rounded-full" />,
  },
  {
    id: 'boost',
    name: 'Boost',
    type: 'E-Wallet',
    balance: 320.80,
    currency: 'MYR',
    icon: <img src="/logos/boost.png" alt="Boost" className="h-8 w-8 rounded-full" />,
  },
  {
    id: 'grabpay',
    name: 'GrabPay',
    type: 'E-Wallet',
    balance: 510.00,
    currency: 'MYR',
    icon: <img src="/logos/grabpay.png" alt="GrabPay" className="h-8 w-8 rounded-full" />,
  },
];

const transactions = [
  { id: 1, type: 'send', description: 'DuitNow Transfer', amount: 150.00, currency: 'MYR', date: '2024-07-22T10:30:00Z', status: 'completed', from: 'Maybank', to: 'CIMB Bank', platform: 'maybank' },
  { id: 2, type: 'receive', description: 'Salary Deposit', amount: 5500.00, currency: 'MYR', date: '2024-07-21T18:00:00Z', status: 'completed', from: 'Company ABC', to: 'Maybank', platform: 'maybank' },
  { id: 3, type: 'payment', description: 'GrabFood Order', amount: 45.50, currency: 'MYR', date: '2024-07-21T13:15:00Z', status: 'completed', from: 'GrabPay', platform: 'grabpay' },
  { id: 4, type: 'payment', description: 'Unifi Bill', amount: 129.00, currency: 'MYR', date: '2024-07-20T11:00:00Z', status: 'completed', from: 'HSBC', platform: 'HSBC' },
  { id: 5, type: 'top-up', description: 'TNG E-Wallet', amount: 50.00, currency: 'MYR', date: '2024-07-19T09:45:00Z', status: 'completed', from: 'CIMB', platform: 'touch_ngo' },
  { id: 6, type: 'send', description: 'Payment to John', amount: 75.00, currency: 'MYR', date: '2024-07-18T16:20:00Z', status: 'pending', from: 'Boost', to: 'Jane Doe', platform: 'boost' },
  { id: 7, type: 'payment', description: 'Netflix Subscription', amount: 55.00, currency: 'MYR', date: '2024-07-18T08:00:00Z', status: 'completed', from: 'Maybank', platform: 'maybank' },
  { id: 8, type: 'receive', description: 'Refund from Lazada', amount: 120.00, currency: 'MYR', date: '2024-07-17T14:50:00Z', status: 'completed', from: 'Lazada', to: 'GrabPay', platform: 'grabpay' },
  { id: 9, type: 'payment', description: 'Parking Fee', amount: 5.00, currency: 'MYR', date: '2024-07-16T19:05:00Z', status: 'failed', from: 'Touch \'n Go', platform: 'touch_ngo' },
];

// Helper Functions
const formatCurrency = (amount, currency) => {
  return new Intl.NumberFormat('en-MY', {
    style: 'currency',
    currency: currency,
  }).format(amount);
};

const getTotalBalance = () => {
  return walletAccounts.reduce((total, wallet) => total + wallet.balance, 0);
};

const getStatusIcon = (status) => {
  switch (status) {
    case 'completed': return <CheckCircle className="h-4 w-4 text-cyan-400" />;
    case 'pending': return <Clock className="h-4 w-4 text-yellow-400" />;
    case 'failed': return <AlertCircle className="h-4 w-4 text-red-400" />;
    default: return null;
  }
};

const getTransactionIcon = (type) => {
  switch (type) {
    case 'send':
    case 'payment':
    case 'top-up':
      return <ArrowUpRight className="h-4 w-4 text-red-400" />;
    case 'receive':
      return <ArrowDownLeft className="h-4 w-4 text-green-400" />;
    default:
      return <CreditCard className="h-4 w-4 text-gray-400" />;
  }
};

const Dashboard = () => {
  const [showBalances, setShowBalances] = useState(true);
  const [activeTab, setActiveTab] = useState('wallets');
  const [searchTerm, setSearchTerm] = useState('');
  const [dateRange, setDateRange] = useState('all');
  const [selectedType, setSelectedType] = useState('all');
  const [selectedAccount, setSelectedAccount] = useState('all');
  const [selectedMethod, setSelectedMethod] = useState('all');
  const [showCustomDateRange, setShowCustomDateRange] = useState(false);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [datePickerPosition, setDatePickerPosition] = useState({ top: 0, right: 0 });

  const router = useRouter();

  // Handle date range change
  const handleDateRangeChange = (e) => {
    const value = e.target.value;
    setDateRange(value);
    if (value === 'custom') {
      setShowCustomDateRange(true);
      // Calculate position for the date picker
      const selectElement = e.target;
      const rect = selectElement.getBoundingClientRect();
      setDatePickerPosition({
        top: rect.height + 8,
        right: 0
      });
    } else {
      setShowCustomDateRange(false);
    }
  };

  // Handle date selection
  const handleDateSelection = (type, value) => {
    if (type === 'start') {
      setStartDate(value);
      // If end date is before start date, update end date
      if (endDate && new Date(value) > new Date(endDate)) {
        setEndDate(value);
      }
    } else {
      // Don't allow end date to be before start date
      if (!startDate || new Date(value) >= new Date(startDate)) {
        setEndDate(value);
      }
    }
  };

  // Close date picker when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      const datePicker = document.getElementById('custom-date-picker');
      const dateSelect = document.getElementById('date-range-select');
      if (datePicker && !datePicker.contains(event.target) && !dateSelect.contains(event.target)) {
        setShowCustomDateRange(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Filter options
  const typeOptions = [
    { value: 'all', label: 'All Types' },
    { value: 'send', label: 'Send' },
    { value: 'receive', label: 'Receive' },
    { value: 'payment', label: 'Payment' },
    { value: 'top-up', label: 'Top-up' }
  ];

  const methodOptions = [
    { value: 'all', label: 'All Methods' },
    { value: 'bank', label: 'Bank Transfer' },
    { value: 'card', label: 'Card' },
    { value: 'ewallet', label: 'E-Wallet' },
    { value: 'qr', label: 'QR Payment' }
  ];

  const dateRangeOptions = [
    { value: 'all', label: 'All Time' },
    { value: 'today', label: 'Today' },
    { value: 'week', label: 'This Week' },
    { value: 'month', label: 'This Month' },
    { value: 'year', label: 'This Year' },
    { value: 'custom', label: 'Custom Range' }
  ];

  // Helper function to check if a date is within range
  const isDateInRange = (txDate) => {
    if (dateRange === 'custom' && startDate && endDate) {
      const date = new Date(txDate);
      const start = new Date(startDate);
      const end = new Date(endDate);
      // Set time to start of day for accurate comparison
      date.setHours(0, 0, 0, 0);
      start.setHours(0, 0, 0, 0);
      end.setHours(23, 59, 59, 999);
      return date >= start && date <= end;
    }

    const date = new Date(txDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    switch (dateRange) {
      case 'today':
        return date.toDateString() === today.toDateString();
      case 'week': {
        const weekStart = new Date(today);
        weekStart.setDate(today.getDate() - today.getDay());
        return date >= weekStart;
      }
      case 'month': {
        return date.getMonth() === today.getMonth() && 
               date.getFullYear() === today.getFullYear();
      }
      case 'year':
        return date.getFullYear() === today.getFullYear();
      default:
        return true; // 'all' case
    }
  };

  // Filter transactions based on all criteria
  const filteredTransactions = transactions.filter(tx => {
    const matchesSearch = tx.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         tx.currency.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = selectedType === 'all' || tx.type === selectedType;
    const matchesAccount = selectedAccount === 'all' || tx.from === selectedAccount || tx.to === selectedAccount;
    const matchesMethod = selectedMethod === 'all' || tx.platform.includes(selectedMethod);
    const matchesDateRange = isDateInRange(tx.date);
    
    return matchesSearch && matchesType && matchesAccount && matchesMethod && matchesDateRange;
  });

  const cardVariants = {
    hidden: { opacity: 0, y: 50, rotateX: 15 },
    visible: {
      opacity: 1, y: 0, rotateX: 0,
      transition: { duration: 0.8, ease: [0.25, 0.4, 0.25, 1] }
    }
  };

  return (
    <div className="relative w-full max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <header className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600">Manage your wallets and transactions</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 bg-white hover:bg-gray-50 text-gray-700 font-medium py-2 px-4 rounded-xl transition-colors duration-200 border border-gray-200 text-sm">
            <Bell className="h-4 w-4" />
            <span>Notifications</span>
          </button>
          <button className="flex items-center gap-2 bg-white hover:bg-gray-50 text-gray-700 font-medium py-2 px-4 rounded-xl transition-colors duration-200 border border-gray-200 text-sm">
            <Settings className="h-4 w-4" />
            <span>Settings</span>
          </button>
        </div>
      </header>

      {/* Total Balance and Money Flow Section */}
      <div className="grid grid-cols-12 gap-6">
        {/* Total Balance Card */}
        <motion.div
          variants={cardVariants}
          initial="hidden"
          animate="visible"
          className="col-span-8 p-6 rounded-3xl bg-white border border-gray-200 shadow-lg"
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">My Balance</h2>
            <div className="flex items-center gap-2">
              <select className="bg-white border border-gray-200 rounded-xl text-sm text-gray-700 px-3 py-1 focus:outline-none focus:ring-2 focus:ring-[#002fa7]/30">
                <option>This Month</option>
                <option>Last Month</option>
                <option>Last 3 Months</option>
                <option>Last 6 Months</option>
                <option>This Year</option>
              </select>
              <button onClick={() => setShowBalances(!showBalances)} className="p-1 rounded-full text-gray-600 hover:bg-gray-100 transition-colors">
                {showBalances ? <Eye className="h-5 w-5" /> : <EyeOff className="h-5 w-5" />}
              </button>
            </div>
          </div>
          <div>
            <div className="text-4xl font-bold text-gray-900">
              {showBalances ? formatCurrency(66000.00, 'MYR') : 'XXXX'}
            </div>
            <div className="text-sm text-gray-600 mt-1">Your Balance in Month</div>
          </div>

          {/* Income and Expenses Cards */}
          <div className="flex gap-4 mt-6">
            {/* Income Card */}
            <div className="flex-1 p-4 rounded-2xl bg-white border border-gray-200">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-[#002fa7]/10 rounded-xl">
                  <ArrowDownLeft className="h-5 w-5 text-[#002fa7]" />
                </div>
                <span className="text-sm font-medium text-gray-900">Income</span>
                <div className="ml-auto px-2 py-1 rounded-md bg-green-100 text-green-600 flex items-center gap-1">
                  <ArrowUpRight className="h-3 w-3" />
                  <span className="text-xs">45.2%</span>
                </div>
              </div>
              <div className="text-2xl font-bold text-gray-900">
                {showBalances ? formatCurrency(44000.00, 'MYR') : 'XXXX'}
              </div>
            </div>

            {/* Expenses Card */}
            <div className="flex-1 p-4 rounded-2xl bg-white border border-gray-200">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-red-100 rounded-xl">
                  <ArrowUpRight className="h-5 w-5 text-red-500" />
                </div>
                <span className="text-sm font-medium text-gray-900">Expenses</span>
                <div className="ml-auto px-2 py-1 rounded-md bg-red-100 text-red-500 flex items-center gap-1">
                  <ArrowDownLeft className="h-3 w-3" />
                  <span className="text-xs">12.8%</span>
                </div>
              </div>
              <div className="text-2xl font-bold text-gray-900">
                {showBalances ? formatCurrency(22000.00, 'MYR') : 'XXXX'}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Money Flow Chart */}
        <motion.div
          variants={cardVariants}
          initial="hidden"
          animate="visible"
          className="col-span-4 bg-white border border-gray-200 rounded-3xl shadow-lg"
        >
          <MoneyFlowChart />
        </motion.div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <motion.button 
          whileHover={{ scale: 1.05 }} 
          whileTap={{ scale: 0.95 }} 
          className="h-24 flex flex-col items-center justify-center gap-2 bg-[#002fa7] hover:bg-[#002fa7]/90 rounded-2xl transition-all duration-200 text-white font-semibold shadow-lg hover:shadow-[#002fa7]/20"
        >
          <Send className="h-6 w-6" />
          <span>Send Money</span>
        </motion.button>
        <motion.button 
          whileHover={{ 
            scale: 1.05,
            boxShadow: "0 0 20px rgba(0, 47, 167, 0.3)",
            backgroundColor: "rgba(0, 47, 167, 0.05)"
          }} 
          whileTap={{ scale: 0.95 }} 
          className="h-24 flex flex-col items-center justify-center gap-2 bg-white border border-gray-200 rounded-2xl transition-all duration-200 text-gray-700 hover:border-[#002fa7]/30"
        >
          <QrCode className="h-6 w-6" />
          <span className="font-medium">Scan QR</span>
        </motion.button>
        <motion.button 
          whileHover={{ 
            scale: 1.05,
            boxShadow: "0 0 20px rgba(0, 47, 167, 0.3)",
            backgroundColor: "rgba(0, 47, 167, 0.05)"
          }} 
          whileTap={{ scale: 0.95 }} 
          className="h-24 flex flex-col items-center justify-center gap-2 bg-white border border-gray-200 rounded-2xl transition-all duration-200 text-gray-700 hover:border-[#002fa7]/30"
        >
          <Link className="h-6 w-6" />
          <span className="font-medium">Manage Linked Accounts</span>
        </motion.button>
        <motion.button 
          whileHover={{ 
            scale: 1.05,
            boxShadow: "0 0 20px rgba(0, 47, 167, 0.3)",
            backgroundColor: "rgba(0, 47, 167, 0.05)"
          }} 
          whileTap={{ scale: 0.95 }} 
          onClick={() => router.push('/settings?section=identity')}
          className="h-24 flex flex-col items-center justify-center gap-2 bg-white border border-gray-200 rounded-2xl transition-all duration-200 text-gray-700 hover:border-[#002fa7]/30"
        >
          <Shield className="h-6 w-6" />
          <span className="font-medium">Identity Token</span>
        </motion.button>
      </div>

      {/* Main Content */}
      <motion.div
        variants={cardVariants}
        initial="hidden"
        animate="visible"
        className="bg-white border border-gray-200 rounded-3xl shadow-lg"
      >
        <div className="flex border-b border-gray-200 px-4">
          <button onClick={() => setActiveTab('wallets')} className={`py-4 px-4 text-sm font-medium transition-colors duration-200 relative ${activeTab === 'wallets' ? 'text-[#002fa7]' : 'text-gray-600 hover:text-gray-900'}`}>
            Wallets & Accounts
            {activeTab === 'wallets' && <motion.div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#002fa7]" layoutId="underline" />}
          </button>
          <button onClick={() => setActiveTab('transactions')} className={`py-4 px-4 text-sm font-medium transition-colors duration-200 relative ${activeTab === 'transactions' ? 'text-[#002fa7]' : 'text-gray-600 hover:text-gray-900'}`}>
            Recent Transactions
            {activeTab === 'transactions' && <motion.div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#002fa7]" layoutId="underline" />}
          </button>
        </div>

        <div className="p-6">
          {activeTab === 'wallets' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {walletAccounts.map(wallet => (
                <div key={wallet.id} className="p-5 bg-white border border-gray-200 rounded-2xl hover:bg-gray-50 transition-colors shadow-lg">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      {wallet.icon}
                      <div>
                        <h3 className="font-semibold text-gray-900">{wallet.name}</h3>
                        <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${wallet.type === 'Bank' ? 'bg-[#002fa7]/10 text-[#002fa7]' : 'bg-green-100 text-green-600'}`}>
                          {wallet.type}
                        </span>
                      </div>
                    </div>
                    <button className="p-1 text-gray-400 hover:text-gray-600">
                      <MoreVertical className="h-4 w-4" />
                    </button>
                  </div>
                  <div className="space-y-2">
                    <div className="text-2xl font-bold text-gray-900">
                      {showBalances ? formatCurrency(wallet.balance, wallet.currency) : '••••••'}
                    </div>
                  </div>
                </div>
              ))}
            </motion.div>
          )}

          {activeTab === 'transactions' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
              <div className="space-y-4">
                {/* Search Bar */}
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search transactions..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 bg-white border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#002fa7]/30 focus:border-[#002fa7]/20 transition-all duration-200"
                  />
                </div>

                {/* Filters */}
                <div className="flex justify-end gap-3">
                  {/* Date Range Filter */}
                  <div className="relative">
                    <select
                      id="date-range-select"
                      value={dateRange}
                      onChange={handleDateRangeChange}
                      className="appearance-none bg-white border border-gray-200 rounded-xl text-sm text-gray-700 pl-9 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#002fa7]/30 cursor-pointer min-w-[140px]"
                    >
                      {dateRangeOptions.map(option => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                    <Calendar className="absolute left-2.5 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  </div>

                  {/* Type Filter */}
                  <div className="relative">
                    <select
                      value={selectedType}
                      onChange={(e) => setSelectedType(e.target.value)}
                      className="appearance-none bg-white border border-gray-200 rounded-xl text-sm text-gray-700 pl-9 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#002fa7]/30 cursor-pointer"
                    >
                      {typeOptions.map(option => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                    <Send className="absolute left-2.5 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  </div>

                  {/* Account Filter */}
                  <div className="relative">
                    <select
                      value={selectedAccount}
                      onChange={(e) => setSelectedAccount(e.target.value)}
                      className="appearance-none bg-white border border-gray-200 rounded-xl text-sm text-gray-700 pl-9 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#002fa7]/30 cursor-pointer"
                    >
                      <option value="all">All Accounts</option>
                      {walletAccounts.map(account => (
                        <option key={account.id} value={account.name}>
                          {account.name}
                        </option>
                      ))}
                    </select>
                    <Building className="absolute left-2.5 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  </div>

                  {/* Method Filter */}
                  <div className="relative">
                    <select
                      value={selectedMethod}
                      onChange={(e) => setSelectedMethod(e.target.value)}
                      className="appearance-none bg-white border border-gray-200 rounded-xl text-sm text-gray-700 pl-9 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#002fa7]/30 cursor-pointer"
                    >
                      {methodOptions.map(option => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                    <PaymentIcon className="absolute left-2.5 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  </div>
                </div>
              </div>

              {/* Transaction Table */}
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                  <thead className="text-xs text-gray-500 uppercase">
                    <tr>
                      <th scope="col" className="px-6 py-3">Type</th>
                      <th scope="col" className="px-6 py-3">Description</th>
                      <th scope="col" className="px-6 py-3">Amount</th>
                      <th scope="col" className="px-6 py-3">Date</th>
                      <th scope="col" className="px-6 py-3">Payment Method</th>
                      <th scope="col" className="px-6 py-3"><span className="sr-only">Actions</span></th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredTransactions.map(tx => (
                      <tr key={tx.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="p-2 bg-gray-100 rounded-full border border-gray-200">{getTransactionIcon(tx.type)}</div>
                            <span className="capitalize font-medium text-gray-900">{tx.type}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="font-medium text-gray-900">{tx.description}</div>
                          <div className="text-xs text-gray-500">
                            {tx.from && `From: ${tx.from}`}
                            {tx.to && `To: ${tx.to}`}
                          </div>
                        </td>
                        <td className={`px-6 py-4 font-medium ${tx.type === 'receive' ? 'text-green-600' : 'text-red-500'}`}>
                          {formatCurrency(tx.amount, tx.currency)}
                        </td>
                        <td className="px-6 py-4 text-gray-500">
                          {new Date(tx.date).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <div className="w-8 h-8 flex-shrink-0">
                              <img
                                src={`/logos/${tx.platform}.${tx.platform === 'tng' ? 'webp' : tx.platform === 'bankislam' || tx.platform === 'alliance' || tx.platform === 'hongleong' || tx.platform === 'cimb' ? 'jpeg' : 'png'}`}
                                alt={tx.platform}
                                className="w-full h-full rounded-full object-cover"
                              />
                            </div>
                            <span className="text-gray-700 capitalize">{tx.platform.replace('_', ' ')}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <button className="text-gray-400 hover:text-gray-600">
                            <MoreVertical className="h-4 w-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </motion.div>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default Dashboard;