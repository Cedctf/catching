import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { 
  CreditCard, 
  Wallet, 
  QrCode, 
  Link as LinkIcon,
  Plus,
  CheckCircle,
  AlertCircle,
  Clock,
  Activity,
  DollarSign,
  ArrowRight,
  Search,
  Filter,
  Calendar,
  X
} from 'lucide-react';
import Link from 'next/link';
import { getAllAccounts, ACCOUNT_TYPES, formatAccountBalance } from '../../lib/accountData';

export default function PaymentServices({ businessData: initialData, onDataUpdate }) {
  const [activeSection, setActiveSection] = useState('overview');
  const [businessData, setBusinessData] = useState(initialData);
  const [realtimeStatus, setRealtimeStatus] = useState('connecting');
  const [connectedServices, setConnectedServices] = useState([]);
  const [paymentMethods, setPaymentMethods] = useState({});
  
  // Search and filter states for transaction logs
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [paymentMethodFilter, setPaymentMethodFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('all');
  const [showFilters, setShowFilters] = useState(false);

  // Listen for navigation events from overview
  useEffect(() => {
    const handleNavigateToTransactions = () => {
      setActiveSection('transactions');
    };

    window.addEventListener('navigateToTransactions', handleNavigateToTransactions);
    
    return () => {
      window.removeEventListener('navigateToTransactions', handleNavigateToTransactions);
    };
  }, []);

  // Setup real-time connection
  useEffect(() => {
    const eventSource = new EventSource('/api/business/realtime');

    eventSource.onopen = () => {
      setRealtimeStatus('connected');
    };

    eventSource.onmessage = (event) => {
      const data = JSON.parse(event.data);
      
      switch (data.type) {
        case 'transaction':
          // Update transactions and analytics
          setBusinessData(prev => ({
            ...prev,
            transactions: [data.transaction, ...prev.transactions],
            analytics: {
              ...prev.analytics,
              revenue: {
                ...prev.analytics.revenue,
                total: prev.analytics.revenue.total + data.transaction.amount
              },
              transactions: {
                ...prev.analytics.transactions,
                total: prev.analytics.transactions.total + 1
              }
            }
          }));
          break;

        case 'invoice':
          // Update invoices
          setBusinessData(prev => ({
            ...prev,
            invoices: [data.invoice, ...prev.invoices],
            analytics: {
              ...prev.analytics,
              invoices: {
                ...prev.analytics.invoices,
                total: prev.analytics.invoices.total + 1
              }
            }
          }));
          break;

        case 'payment':
          // Update payment services data
          setBusinessData(prev => ({
            ...prev,
            connectedServices: data.connectedServices
          }));
          break;
      }
    };

    eventSource.onerror = () => {
      setRealtimeStatus('disconnected');
      eventSource.close();
      // Try to reconnect after 5 seconds
      setTimeout(() => {
        setRealtimeStatus('connecting');
      }, 5000);
    };

    return () => {
      eventSource.close();
    };
  }, []);

  // Calculate payment method statistics from transactions
  useEffect(() => {
    if (businessData?.transactions) {
      const completedTransactions = businessData.transactions.filter(t => t.transaction_status === 'completed');
      const methodStats = {};
      
      completedTransactions.forEach(transaction => {
        const method = transaction.payment_method;
        if (!methodStats[method]) {
          methodStats[method] = { count: 0, volume: 0 };
        }
        methodStats[method].count += 1;
        methodStats[method].volume += transaction.amount;
      });

      setPaymentMethods(methodStats);
    }
  }, [businessData?.transactions]);

  // Get connected services based on payment methods used
  useEffect(() => {
    if (paymentMethods) {
      const services = [];
      
      // DuitNow (for QR payments)
      if (paymentMethods.QR) {
        services.push({
          id: 'duitnow',
          name: 'DuitNow',
          type: 'bank_transfer',
          status: 'connected',
          logo: '/logos/DuitNowLogo-1.jpg',
          accountNumber: '1234567890',
          monthlyVolume: paymentMethods.QR.volume,
          transactionCount: paymentMethods.QR.count
        });
      }

      // GrabPay (for FACE payments - assuming face payments go through GrabPay)
      if (paymentMethods.FACE) {
        services.push({
          id: 'grabpay',
          name: 'GrabPay',
          type: 'e_wallet',
          status: 'connected',
          logo: '/logos/grabpay.png',
          accountNumber: 'grab_merchant_123',
          monthlyVolume: paymentMethods.FACE.volume,
          transactionCount: paymentMethods.FACE.count
        });
      }

      // Card payments
      if (paymentMethods.CARD) {
        services.push({
          id: 'card',
          name: 'Card Payment',
          type: 'card',
          status: 'connected',
          logo: '/logos/maybank.png',
          accountNumber: '•••• 4567',
          monthlyVolume: paymentMethods.CARD.volume,
          transactionCount: paymentMethods.CARD.count
        });
      }

      // Add some static services for demo
      services.push({
        id: 'boost',
        name: 'Boost',
        type: 'e_wallet',
        status: 'pending',
        logo: '/logos/boost.png',
        accountNumber: 'boost_pending',
        monthlyVolume: 0,
        transactionCount: 0
      });

      services.push({
        id: 'tng',
        name: 'Touch \'n Go eWallet',
        type: 'e_wallet',
        status: 'disconnected',
        logo: '/logos/tng.webp',
        accountNumber: null,
        monthlyVolume: 0,
        transactionCount: 0
      });

      setConnectedServices(services);
    }
  }, [paymentMethods]);

  // Notify parent component of data updates
  useEffect(() => {
    if (onDataUpdate) {
      onDataUpdate(businessData);
    }
  }, [businessData, onDataUpdate]);

  // Format recent transactions for display
  const recentTransactions = businessData?.transactions
    ?.slice(0, 5)
    ?.map(transaction => ({
      id: transaction.transaction_id,
      date: new Date(transaction.transaction_date).toLocaleString('en-MY', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      }),
      amount: transaction.amount,
      status: transaction.transaction_status,
      type: transaction.transaction_type,
      paymentMethod: transaction.payment_method
    })) || [];

  // Filter transactions based on search and filter criteria
  const filteredTransactions = businessData?.transactions?.filter(transaction => {
    const matchesSearch = searchTerm === '' || 
      transaction.transaction_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transaction.payment_method.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transaction.amount.toString().includes(searchTerm);
    
    const matchesStatus = statusFilter === 'all' || transaction.transaction_status === statusFilter;
    const matchesPaymentMethod = paymentMethodFilter === 'all' || transaction.payment_method === paymentMethodFilter;
    
    const matchesDate = dateFilter === 'all' || (() => {
      const transactionDate = new Date(transaction.transaction_date);
      const today = new Date();
      const yesterday = new Date(today);
      yesterday.setDate(yesterday.getDate() - 1);
      const weekAgo = new Date(today);
      weekAgo.setDate(weekAgo.getDate() - 7);
      const monthAgo = new Date(today);
      monthAgo.setMonth(monthAgo.getMonth() - 1);
      
      switch (dateFilter) {
        case 'today':
          return transactionDate.toDateString() === today.toDateString();
        case 'yesterday':
          return transactionDate.toDateString() === yesterday.toDateString();
        case 'week':
          return transactionDate >= weekAgo;
        case 'month':
          return transactionDate >= monthAgo;
        default:
          return true;
      }
    })();
    
    return matchesSearch && matchesStatus && matchesPaymentMethod && matchesDate;
  }) || [];

  // Get unique payment methods for filter dropdown
  const uniquePaymentMethods = [...new Set(businessData?.transactions?.map(t => t.payment_method) || [])];

  // Clear all filters
  const clearFilters = () => {
    setSearchTerm('');
    setStatusFilter('all');
    setPaymentMethodFilter('all');
    setDateFilter('all');
  };

  const maybankAccount = getAllAccounts().find(account => account.id === 'maybank');

  const sections = [
    { id: 'overview', label: 'Overview', icon: Activity },
    { id: 'connected', label: 'Connected Services', icon: LinkIcon },
    { id: 'qr_codes', label: 'QR Codes', icon: QrCode },
    { id: 'transactions', label: 'Transaction Logs', icon: DollarSign }
  ];

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-MY', {
      style: 'currency',
      currency: 'MYR'
    }).format(amount || 0);
  };

  return (
    <div className="w-full px-4 xl:px-6">
      <div className="w-full space-y-6">
      {/* Header with Live Updates */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Payment Services</h2>
          <p className="text-gray-600">Manage your payment methods and transaction logs</p>
        </div>
        <div className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium ${
          realtimeStatus === 'connected' ? 'bg-green-100 text-green-700' :
          realtimeStatus === 'connecting' ? 'bg-yellow-100 text-yellow-700' :
          'bg-red-100 text-red-700'
        }`}>
          <div className={`w-2 h-2 rounded-full ${
            realtimeStatus === 'connected' ? 'bg-green-500' :
            realtimeStatus === 'connecting' ? 'bg-yellow-500' :
            'bg-red-500'
          }`} />
          {realtimeStatus === 'connected' ? 'Live Updates' :
           realtimeStatus === 'connecting' ? 'Connecting...' :
           'Disconnected'}
        </div>
      </div>

      {/* Section Navigation */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-2">
        <div className="flex flex-wrap gap-2">
          {sections.map((section) => {
            const Icon = section.icon;
            return (
              <button
                key={section.id}
                onClick={() => setActiveSection(section.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  activeSection === section.id
                    ? 'bg-[#002fa7] text-white'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <Icon className="h-4 w-4" />
                {section.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Overview Section */}
      {activeSection === 'overview' && (
        <div className="space-y-6">
          {/* Business Bank Accounts */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Business Bank Accounts</h2>
            <div className="p-4 bg-white border border-gray-200 rounded-xl">
              <div className="flex items-center gap-3">
                <img src="/logos/maybank.png" alt="Maybank" className="h-10 w-10 rounded-full object-cover" />
                <div>
                  <h3 className="font-semibold text-gray-900">Maybank</h3>
                  <div className="text-sm text-gray-600">•••• 4567</div>
                </div>
                <div className="ml-auto flex items-center gap-2">
                  <span className="text-xs font-medium px-2 py-1 rounded-full bg-green-100 text-green-600">
                    Connected
                  </span>
                </div>
              </div>
              <div className="mt-4">
                <div className="text-sm text-gray-500">Available Balance</div>
                <div className="text-lg font-bold text-gray-900">
                  {formatCurrency(businessData?.analytics?.revenue?.total || 0)}
                </div>
              </div>
            </div>
          </div>

          {/* Connected Payment Services */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Connected Payment Services</h2>
            <div className="space-y-4">
              {connectedServices.filter(service => service.status === 'connected').map(service => (
                <div key={service.id} className="p-4 bg-white border border-gray-200 rounded-xl">
                  <div className="flex items-center gap-3">
                    <img src={service.logo} alt={service.name} className="h-10 w-10 rounded-full object-cover" />
                    <div>
                      <h3 className="font-semibold text-gray-900">{service.name}</h3>
                      <div className="text-sm text-gray-600">{service.accountNumber}</div>
                    </div>
                    <div className="ml-auto flex items-center gap-2">
                      <span className="text-sm text-gray-600">
                        Monthly Volume: {formatCurrency(service.monthlyVolume)}
                      </span>
                      <span className="text-xs font-medium px-2 py-1 rounded-full bg-green-100 text-green-600">
                        Connected
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Transactions */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Recent Transactions</h2>
            {recentTransactions.length > 0 ? (
              <div className="space-y-4">
                {recentTransactions.map(transaction => (
                  <div key={transaction.id} className="p-4 bg-white border border-gray-200 rounded-xl">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-semibold text-gray-900">
                          {formatCurrency(transaction.amount)}
                        </div>
                        <div className="text-sm text-gray-600">{transaction.paymentMethod}</div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm text-gray-600">{transaction.date}</div>
                        <span className={`text-xs font-medium px-2 py-1 rounded-full ${
                          transaction.status === 'completed' ? 'bg-green-100 text-green-600' :
                          transaction.status === 'pending' ? 'bg-yellow-100 text-yellow-600' :
                          'bg-red-100 text-red-600'
                        }`}>
                          {transaction.status}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center text-gray-500">
                No recent transactions to display
              </div>
            )}
          </div>
        </div>
      )}

      {/* Connected Services Section */}
      {activeSection === 'connected' && (
        <div className="space-y-6">
          {/* Business Bank Accounts */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Business Bank Accounts</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Maybank Account */}
              <div className="p-4 bg-white border border-gray-200 rounded-xl">
                <div className="flex items-center gap-3">
                  <img src="/logos/maybank.png" alt="Maybank" className="h-10 w-10 rounded-full object-cover" />
                  <div>
                    <h3 className="font-semibold text-gray-900">Maybank</h3>
                    <div className="text-sm text-gray-600">•••• 4567</div>
                  </div>
                  <div className="ml-auto flex items-center gap-2">
                    <span className="text-xs font-medium px-2 py-1 rounded-full bg-green-100 text-green-600">
                      Connected
                    </span>
                  </div>
                </div>
                <div className="mt-4">
                  <div className="text-sm text-gray-500">Available Balance</div>
                  <div className="text-lg font-bold text-gray-900">
                    {formatCurrency(businessData?.analytics?.revenue?.total || 0)}
                  </div>
                </div>
              </div>

              {/* Add Account Card */}
              <Link href="/accounts" className="block">
                <div className="p-4 h-full border border-[#002fa7]/20 border-dashed rounded-xl hover:bg-[#002fa7]/5 transition-colors duration-200 flex items-center gap-4 cursor-pointer">
                  <div className="h-10 w-10 rounded-full bg-[#002fa7]/10 flex items-center justify-center">
                    <Plus className="h-5 w-5 text-[#002fa7]" />
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900">Add Account</h3>
                    <p className="text-sm text-gray-500">Connect bank account</p>
                  </div>
                </div>
              </Link>
            </div>
          </div>

          {/* Connected Payment Services */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Connected Payment Services</h2>
            <div className="space-y-4">
              {connectedServices.map(service => (
                <div key={service.id} className="p-4 bg-white border border-gray-200 rounded-xl">
                  <div className="flex items-center gap-3">
                    <img src={service.logo} alt={service.name} className="h-10 w-10 rounded-full object-cover" />
                    <div>
                      <h3 className="font-semibold text-gray-900">{service.name}</h3>
                      <div className="text-sm text-gray-600">{service.accountNumber || 'Not configured'}</div>
                    </div>
                    <div className="ml-auto flex items-center gap-2">
                      {service.monthlyVolume > 0 && (
                        <span className="text-sm text-gray-600">
                          Monthly Volume: {formatCurrency(service.monthlyVolume)}
                        </span>
                      )}
                      <span className={`text-xs font-medium px-2 py-1 rounded-full ${
                        service.status === 'connected' ? 'bg-green-100 text-green-600' :
                        service.status === 'pending' ? 'bg-yellow-100 text-yellow-600' :
                        'bg-red-100 text-red-600'
                      }`}>
                        {service.status}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* QR Codes Section */}
      {activeSection === 'qr_codes' && (
        <div className="space-y-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">QR Codes</h2>
            <div className="flex flex-col items-center space-y-4">
              <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
                <img 
                  src="/duitnowqr.jpg" 
                  alt="DuitNow QR Code" 
                  className="w-64 h-64 object-contain"
                />
              </div>
              <div className="text-center">
                <h3 className="font-medium text-gray-900">DuitNow QR</h3>
                <p className="text-sm text-gray-500">Scan to make payment</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Transaction Logs Section */}
      {activeSection === 'transactions' && (
        <div className="space-y-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900">Transaction Logs</h2>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    showFilters ? 'bg-[#002fa7] text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  <Filter className="h-4 w-4" />
                  Filters
                </button>
                {(searchTerm || statusFilter !== 'all' || paymentMethodFilter !== 'all' || dateFilter !== 'all') && (
                  <button
                    onClick={clearFilters}
                    className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium bg-red-100 text-red-700 hover:bg-red-200 transition-colors"
                  >
                    <X className="h-4 w-4" />
                    Clear
                  </button>
                )}
              </div>
            </div>

            {/* Search Bar */}
            <div className="relative mb-4">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search by transaction ID, payment method, or amount..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#002fa7]/20 focus:border-[#002fa7]/20 transition-all"
              />
            </div>

            {/* Filter Controls */}
            {showFilters && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-4 mb-6 p-4 bg-gray-50 rounded-lg border border-gray-200"
              >
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#002fa7]/20 focus:border-[#002fa7]/20"
                  >
                    <option value="all">All Status</option>
                    <option value="completed">Completed</option>
                    <option value="pending">Pending</option>
                    <option value="failed">Failed</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Payment Method</label>
                  <select
                    value={paymentMethodFilter}
                    onChange={(e) => setPaymentMethodFilter(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#002fa7]/20 focus:border-[#002fa7]/20"
                  >
                    <option value="all">All Methods</option>
                    {uniquePaymentMethods.map(method => (
                      <option key={method} value={method}>{method}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Date Range</label>
                  <select
                    value={dateFilter}
                    onChange={(e) => setDateFilter(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#002fa7]/20 focus:border-[#002fa7]/20"
                  >
                    <option value="all">All Time</option>
                    <option value="today">Today</option>
                    <option value="yesterday">Yesterday</option>
                    <option value="week">Last 7 Days</option>
                    <option value="month">Last 30 Days</option>
                  </select>
                </div>
              </motion.div>
            )}

            {/* Results Summary */}
            <div className="flex items-center justify-between mb-4 text-sm text-gray-600">
              <span>
                Showing {filteredTransactions.length} of {businessData?.transactions?.length || 0} transactions
              </span>
              {filteredTransactions.length > 0 && (
                <span>
                  Total: {formatCurrency(filteredTransactions.reduce((sum, t) => sum + t.amount, 0))}
                </span>
              )}
            </div>

            {/* Transaction List */}
            <div className="space-y-4">
              {filteredTransactions.length > 0 ? (
                filteredTransactions.map(transaction => (
                  <div key={transaction.transaction_id} className="p-4 bg-white border border-gray-200 rounded-xl hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <div className="font-semibold text-gray-900">
                            {formatCurrency(transaction.amount)}
                          </div>
                          <span className={`text-xs font-medium px-2 py-1 rounded-full ${
                            transaction.transaction_status === 'completed' ? 'bg-green-100 text-green-600' :
                            transaction.transaction_status === 'pending' ? 'bg-yellow-100 text-yellow-600' :
                            'bg-red-100 text-red-600'
                          }`}>
                            {transaction.transaction_status}
                          </span>
                        </div>
                        <div className="text-sm text-gray-600">
                          <span className="font-medium">{transaction.payment_method}</span> • {transaction.transaction_id}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm text-gray-600">
                          {new Date(transaction.transaction_date).toLocaleString('en-MY', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-gray-500">
                  {searchTerm || statusFilter !== 'all' || paymentMethodFilter !== 'all' || dateFilter !== 'all' ? (
                    <div>
                      <p className="mb-2">No transactions match your filters</p>
                      <button
                        onClick={clearFilters}
                        className="text-[#002fa7] hover:text-[#002fa7]/80 font-medium"
                      >
                        Clear filters to see all transactions
                      </button>
                    </div>
                  ) : (
                    'No transactions to display'
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
      </div>
    </div>
  );
} 