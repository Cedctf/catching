import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function BusinessDashboard() {
  const [transactions, setTransactions] = useState([]);
  const [invoices, setInvoices] = useState([]);
  const [totalBalance, setTotalBalance] = useState(0);
  const [monthlyIncome, setMonthlyIncome] = useState(0);
  const [loading, setLoading] = useState(true);
  
  // Expandable card states
  const [transactionsExpanded, setTransactionsExpanded] = useState(false);
  const [invoicesExpanded, setInvoicesExpanded] = useState(false);
  
  // Filter states
  const [transactionFilters, setTransactionFilters] = useState({
    search: '',
    dateRange: 'all',
    paymentMethod: 'all',
    sortBy: 'date_desc'
  });
  const [invoiceFilters, setInvoiceFilters] = useState({
    search: '',
    dateRange: 'all',
    status: 'all',
    sortBy: 'date_desc'
  });

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [transactionsRes, invoicesRes] = await Promise.all([
        fetch('/api/business/transactions'),
        fetch('/api/business/invoices')
      ]);

      const transactionsData = await transactionsRes.json();
      const invoicesData = await invoicesRes.json();

      setTransactions(transactionsData.transactions || []);
      setInvoices(invoicesData.invoices || []);
      
      // Calculate metrics
      const completedTransactions = transactionsData.transactions?.filter(t => t.transaction_status === 'completed') || [];
      const balance = completedTransactions.reduce((sum, t) => sum + t.amount, 0);
      setTotalBalance(balance);
      
      // Calculate monthly income (current month)
      const currentMonth = new Date().getMonth();
      const currentYear = new Date().getFullYear();
      const monthlyTrans = completedTransactions.filter(t => {
        const transDate = new Date(t.transaction_date);
        return transDate.getMonth() === currentMonth && transDate.getFullYear() === currentYear;
      });
      setMonthlyIncome(monthlyTrans.reduce((sum, t) => sum + t.amount, 0));
      
      setLoading(false);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      setLoading(false);
    }
  };

  const formatCurrency = (amount) => {
    return `RM${amount.toLocaleString('en-MY', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-MY', {
      month: 'short',
      day: 'numeric'
    });
  };

  const getIncomeGrowth = () => {
    return "+6.2%"; // Mock data
  };

  // Filter and sort functions
  const getFilteredTransactions = () => {
    let filtered = [...transactions];
    
    // Search filter
    if (transactionFilters.search) {
      filtered = filtered.filter(t => 
        t.transaction_id.toLowerCase().includes(transactionFilters.search.toLowerCase()) ||
        t.payment_method.toLowerCase().includes(transactionFilters.search.toLowerCase())
      );
    }
    
    // Payment method filter
    if (transactionFilters.paymentMethod !== 'all') {
      filtered = filtered.filter(t => t.payment_method === transactionFilters.paymentMethod);
    }
    
    // Date range filter
    if (transactionFilters.dateRange !== 'all') {
      const now = new Date();
      const startDate = new Date();
      
      switch (transactionFilters.dateRange) {
        case 'today':
          startDate.setHours(0, 0, 0, 0);
          break;
        case 'week':
          startDate.setDate(now.getDate() - 7);
          break;
        case 'month':
          startDate.setMonth(now.getMonth() - 1);
          break;
      }
      
      filtered = filtered.filter(t => new Date(t.transaction_date) >= startDate);
    }
    
    // Sort
    filtered.sort((a, b) => {
      switch (transactionFilters.sortBy) {
        case 'date_desc':
          return new Date(b.transaction_date) - new Date(a.transaction_date);
        case 'date_asc':
          return new Date(a.transaction_date) - new Date(b.transaction_date);
        case 'amount_desc':
          return b.amount - a.amount;
        case 'amount_asc':
          return a.amount - b.amount;
        default:
          return 0;
      }
    });
    
    return filtered;
  };

  const getFilteredInvoices = () => {
    let filtered = [...invoices];
    
    // Search filter
    if (invoiceFilters.search) {
      filtered = filtered.filter(i => 
        i.invoice_number.toLowerCase().includes(invoiceFilters.search.toLowerCase())
      );
    }
    
    // Status filter
    if (invoiceFilters.status !== 'all') {
      filtered = filtered.filter(i => i.status === invoiceFilters.status);
    }
    
    // Date range filter
    if (invoiceFilters.dateRange !== 'all') {
      const now = new Date();
      const startDate = new Date();
      
      switch (invoiceFilters.dateRange) {
        case 'today':
          startDate.setHours(0, 0, 0, 0);
          break;
        case 'week':
          startDate.setDate(now.getDate() - 7);
          break;
        case 'month':
          startDate.setMonth(now.getMonth() - 1);
          break;
      }
      
      filtered = filtered.filter(i => new Date(i.created_at) >= startDate);
    }
    
    // Sort
    filtered.sort((a, b) => {
      switch (invoiceFilters.sortBy) {
        case 'date_desc':
          return new Date(b.created_at) - new Date(a.created_at);
        case 'date_asc':
          return new Date(a.created_at) - new Date(b.created_at);
        case 'amount_desc':
          return b.amount - a.amount;
        case 'amount_asc':
          return a.amount - b.amount;
        default:
          return 0;
      }
    });
    
    return filtered;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Modern Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
              <p className="text-sm text-gray-500">Track and Analyze Your Financial Performance</p>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search..."
                  className="pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
                <svg className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center">
                  <span className="text-sm font-medium text-indigo-600">JM</span>
                </div>
                <div className="text-sm">
                  <div className="font-medium text-gray-900">Doe's Bakery</div>
                  <div className="text-gray-500">Admin</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Main Balance Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Balance Card */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-sm p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-900">My Balance</h2>
                <button className="px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 transition-colors">
                  Add Transaction
                </button>
              </div>
              <div className="mb-6">
                <div className="text-3xl font-bold text-gray-900 mb-1">{formatCurrency(totalBalance)}</div>
                <div className="text-sm text-gray-500">Your Balance This Month</div>
              </div>
              
              {/* Revenue Metrics */}
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                    <svg className="w-5 h-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 11l5-5m0 0l5 5m-5-5v12" />
                    </svg>
                  </div>
                  <div>
                    <div className="text-sm text-gray-500">Monthly Revenue</div>
                    <div className="font-semibold text-gray-900">{formatCurrency(monthlyIncome)}</div>
                    <div className="text-xs text-green-600 flex items-center">
                      <span>{getIncomeGrowth()}</span>
              </div>
            </div>
          </div>

                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                    <svg className="w-5 h-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                  </div>
                  <div>
                    <div className="text-sm text-gray-500">Total Transactions</div>
                    <div className="font-semibold text-gray-900">{transactions.length}</div>
                    <div className="text-xs text-blue-600 flex items-center">
                      <span>This month</span>
                    </div>
                  </div>
              </div>
              </div>
            </div>
          </div>

          {/* Revenue by Payment Method */}
          <div className="bg-white rounded-2xl shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-gray-900">Revenue by Payment Method</h3>
              <span className="text-sm text-gray-500">This Month</span>
            </div>
            <div className="text-2xl font-bold text-gray-900 mb-2">{formatCurrency(monthlyIncome)}</div>
            
            {/* Mock Donut Chart */}
            <div className="relative w-32 h-32 mx-auto mb-4">
              <svg className="w-32 h-32 transform -rotate-90" viewBox="0 0 120 120">
                <circle cx="60" cy="60" r="45" fill="none" stroke="#e5e7eb" strokeWidth="10"/>
                <circle cx="60" cy="60" r="45" fill="none" stroke="#3b82f6" strokeWidth="10" 
                        strokeDasharray={`${2 * Math.PI * 45 * 0.7} ${2 * Math.PI * 45 * 0.3}`} strokeLinecap="round"/>
                <circle cx="60" cy="60" r="45" fill="none" stroke="#06b6d4" strokeWidth="10" 
                        strokeDasharray={`${2 * Math.PI * 45 * 0.3} ${2 * Math.PI * 45 * 0.7}`} 
                        strokeDashoffset={`${2 * Math.PI * 45 * -0.7}`} strokeLinecap="round"/>
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <div className="text-xl font-bold text-gray-900">100%</div>
                  <div className="text-xs text-gray-500">Revenue</div>
                </div>
              </div>
            </div>
            
            {/* Legend */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                  <span className="text-gray-600">Face Recognition</span>
                </div>
                <span className="font-medium">70%</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-cyan-500 rounded-full"></div>
                  <span className="text-gray-600">Card Payment</span>
                </div>
                <span className="font-medium">30%</span>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Transactions - Expandable */}
        <div className="bg-white rounded-2xl shadow-sm p-6 mb-8">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-900">Recent Transactions</h3>
            <button
              onClick={() => setTransactionsExpanded(!transactionsExpanded)}
              className="flex items-center space-x-2 px-3 py-1 text-sm border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <span>{transactionsExpanded ? 'Show Less' : 'Show More'}</span>
              <svg 
                className={`w-4 h-4 transition-transform ${transactionsExpanded ? 'rotate-180' : ''}`} 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
          </div>

          {/* Filters */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-3 mb-6">
            <div>
              <input
                type="text"
                placeholder="Search transactions..."
                value={transactionFilters.search}
                onChange={(e) => setTransactionFilters({...transactionFilters, search: e.target.value})}
                className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            
            <select
              value={transactionFilters.dateRange}
              onChange={(e) => setTransactionFilters({...transactionFilters, dateRange: e.target.value})}
              className="text-sm border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="all">All Time</option>
              <option value="today">Today</option>
              <option value="week">Past Week</option>
              <option value="month">Past Month</option>
            </select>
            
            <select
              value={transactionFilters.paymentMethod}
              onChange={(e) => setTransactionFilters({...transactionFilters, paymentMethod: e.target.value})}
              className="text-sm border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="all">All Methods</option>
              <option value="FACE">Face Recognition</option>
              <option value="CARD">Card Payment</option>
            </select>
            
            <select
              value={transactionFilters.sortBy}
              onChange={(e) => setTransactionFilters({...transactionFilters, sortBy: e.target.value})}
              className="text-sm border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="date_desc">Newest First</option>
              <option value="date_asc">Oldest First</option>
              <option value="amount_desc">Highest Amount</option>
              <option value="amount_asc">Lowest Amount</option>
            </select>
          </div>
          
          <div className="overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="text-left border-b border-gray-100">
                  <th className="pb-3 text-sm font-medium text-gray-500">Transaction Details</th>
                  <th className="pb-3 text-sm font-medium text-gray-500">Payment Method</th>
                  <th className="pb-3 text-sm font-medium text-gray-500">Date</th>
                  <th className="pb-3 text-sm font-medium text-gray-500">Amount</th>
                  <th className="pb-3 text-sm font-medium text-gray-500">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {(() => {
                  const filteredTransactions = getFilteredTransactions();
                  const displayTransactions = transactionsExpanded ? filteredTransactions : filteredTransactions.slice(0, 5);
                  
                  if (filteredTransactions.length === 0) {
                    return (
                  <tr>
                        <td colSpan="5" className="py-8 text-center text-gray-500">
                          No transactions found
                    </td>
                  </tr>
                    );
                  }
                  
                  return displayTransactions.map((transaction) => (
                    <tr key={transaction.transaction_id} className="hover:bg-gray-50">
                      <td className="py-4 flex items-center space-x-3">
                        <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center">
                          <span className="text-sm font-medium text-indigo-600">
                            {transaction.payment_method === 'FACE' ? '👤' : '💳'}
                          </span>
                        </div>
                        <div>
                          <div className="font-medium text-gray-900">Customer Transaction</div>
                          <div className="text-sm text-gray-500">{transaction.transaction_id}</div>
                        </div>
                      </td>
                      <td className="py-4">
                        <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-medium">
                          {transaction.payment_method}
                        </span>
                      </td>
                      <td className="py-4 text-sm text-gray-900">{formatDate(transaction.transaction_date)}</td>
                      <td className="py-4 font-semibold text-gray-900">{formatCurrency(transaction.amount)}</td>
                      <td className="py-4">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          transaction.transaction_status === 'completed'
                            ? 'bg-green-100 text-green-700'
                            : 'bg-yellow-100 text-yellow-700'
                        }`}>
                          {transaction.transaction_status === 'completed' ? 'Complete' : 'Pending'}
                        </span>
                      </td>
                    </tr>
                  ));
                })()}
              </tbody>
            </table>
          </div>
          
          {!transactionsExpanded && getFilteredTransactions().length > 5 && (
            <div className="mt-4 text-center text-sm text-gray-500">
              Showing 5 of {getFilteredTransactions().length} transactions
            </div>
          )}
        </div>

        {/* Recent Invoices - Expandable */}
        <div className="bg-white rounded-2xl shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-900">Recent Invoices</h3>
            <div className="flex items-center space-x-2">
              <button className="px-3 py-1 text-sm border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                Create Invoice
              </button>
              <button
                onClick={() => setInvoicesExpanded(!invoicesExpanded)}
                className="flex items-center space-x-2 px-3 py-1 text-sm border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <span>{invoicesExpanded ? 'Show Less' : 'Show More'}</span>
                <svg 
                  className={`w-4 h-4 transition-transform ${invoicesExpanded ? 'rotate-180' : ''}`} 
                  fill="none" 
                  viewBox="0 0 24 24" 
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
            </div>
          </div>

          {/* Filters */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-3 mb-6">
            <div>
              <input
                type="text"
                placeholder="Search invoices..."
                value={invoiceFilters.search}
                onChange={(e) => setInvoiceFilters({...invoiceFilters, search: e.target.value})}
                className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            
            <select
              value={invoiceFilters.dateRange}
              onChange={(e) => setInvoiceFilters({...invoiceFilters, dateRange: e.target.value})}
              className="text-sm border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="all">All Time</option>
              <option value="today">Today</option>
              <option value="week">Past Week</option>
              <option value="month">Past Month</option>
            </select>
            
            <select
              value={invoiceFilters.status}
              onChange={(e) => setInvoiceFilters({...invoiceFilters, status: e.target.value})}
              className="text-sm border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="all">All Status</option>
              <option value="paid">Paid</option>
              <option value="pending">Pending</option>
              <option value="overdue">Overdue</option>
            </select>
            
            <select
              value={invoiceFilters.sortBy}
              onChange={(e) => setInvoiceFilters({...invoiceFilters, sortBy: e.target.value})}
              className="text-sm border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="date_desc">Newest First</option>
              <option value="date_asc">Oldest First</option>
              <option value="amount_desc">Highest Amount</option>
              <option value="amount_asc">Lowest Amount</option>
            </select>
          </div>
          
          <div className="overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="text-left border-b border-gray-100">
                  <th className="pb-3 text-sm font-medium text-gray-500">Invoice Details</th>
                  <th className="pb-3 text-sm font-medium text-gray-500">Amount</th>
                  <th className="pb-3 text-sm font-medium text-gray-500">Status</th>
                  <th className="pb-3 text-sm font-medium text-gray-500">Created</th>
                  <th className="pb-3 text-sm font-medium text-gray-500">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {(() => {
                  const filteredInvoices = getFilteredInvoices();
                  const displayInvoices = invoicesExpanded ? filteredInvoices : filteredInvoices.slice(0, 5);
                  
                  if (filteredInvoices.length === 0) {
                    return (
                  <tr>
                        <td colSpan="5" className="py-8 text-center text-gray-500">
                          No invoices found
                    </td>
                  </tr>
                    );
                  }
                  
                  return displayInvoices.map((invoice) => (
                    <tr key={invoice.invoice_number} className="hover:bg-gray-50">
                      <td className="py-4 flex items-center space-x-3">
                        <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                          <span className="text-sm font-medium text-purple-600">📄</span>
                        </div>
                        <div>
                          <div className="font-medium text-gray-900">Invoice {invoice.invoice_number}</div>
                          <div className="text-sm text-gray-500">Customer Payment</div>
                        </div>
                      </td>
                      <td className="py-4 font-semibold text-gray-900">{formatCurrency(invoice.amount)}</td>
                      <td className="py-4">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          invoice.status === 'paid'
                            ? 'bg-green-100 text-green-700'
                            : invoice.status === 'pending'
                            ? 'bg-yellow-100 text-yellow-700'
                            : 'bg-red-100 text-red-700'
                        }`}>
                          {invoice.status.charAt(0).toUpperCase() + invoice.status.slice(1)}
                        </span>
                      </td>
                      <td className="py-4 text-sm text-gray-900">{formatDate(invoice.created_at)}</td>
                      <td className="py-4">
                        <div className="flex items-center space-x-2">
                        <Link 
                          href={`/invoice/${invoice.invoice_number}`}
                            className="text-indigo-600 hover:text-indigo-800 text-sm font-medium"
                        >
                          View
                        </Link>
                          <span className="text-gray-300">|</span>
                          <button className="text-gray-600 hover:text-gray-800 text-sm">
                            Download
                          </button>
                        </div>
                      </td>
                    </tr>
                  ));
                })()}
              </tbody>
            </table>
          </div>
          
          {!invoicesExpanded && getFilteredInvoices().length > 5 && (
            <div className="mt-4 text-center text-sm text-gray-500">
              Showing 5 of {getFilteredInvoices().length} invoices
            </div>
          )}
        </div>
      </div>
    </div>
  );
}