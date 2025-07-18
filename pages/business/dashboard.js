import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  FileText, 
  Users, 
  CreditCard,
  Calendar,
  MoreVertical,
  ArrowUpRight,
  ArrowDownLeft,
  CheckCircle,
  Clock,
  AlertCircle,
  Settings,
  Bell,
  Plus
} from 'lucide-react';
import AnalyticsCard from '../../components/AnalyticsCard';
import SimpleBarChart from '../../components/SimpleBarChart';

export default function BusinessDashboard() {
  const [transactions, setTransactions] = useState([]);
  const [invoices, setInvoices] = useState([]);
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [transactionsRes, invoicesRes, analyticsRes] = await Promise.all([
        fetch('/api/business/transactions'),
        fetch('/api/business/invoices'),
        fetch('/api/business/analytics')
      ]);

      const transactionsData = await transactionsRes.json();
      const invoicesData = await invoicesRes.json();
      const analyticsData = await analyticsRes.json();

      setTransactions(transactionsData.transactions || []);
      setInvoices(invoicesData.invoices || []);
      setAnalytics(analyticsData.analytics || null);
      
      setLoading(false);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      setLoading(false);
    }
  };

  const formatCurrency = (amount) => {
    const numAmount = Number(amount) || 0;
    return new Intl.NumberFormat('en-MY', {
      style: 'currency',
      currency: 'MYR',
    }).format(numAmount);
  };

  const formatPercentage = (value) => {
    const numValue = Number(value) || 0;
    return `${numValue.toFixed(1)}%`;
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-MY', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed': return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'pending': return <Clock className="h-4 w-4 text-yellow-500" />;
      case 'failed': return <AlertCircle className="h-4 w-4 text-red-500" />;
      default: return null;
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 50, rotateX: 15 },
    visible: {
      opacity: 1, y: 0, rotateX: 0,
      transition: { duration: 0.8, ease: [0.25, 0.4, 0.25, 1] }
    }
  };

  if (loading || !analytics) {
    return (
      <div className="relative w-full max-w-7xl mx-auto px-6 py-8">
        <div className="flex items-center justify-center min-h-[400px]">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            className="w-8 h-8 border-2 border-[#002fa7] border-t-transparent rounded-full"
          />
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full max-w-7xl mx-auto px-6 py-8 space-y-6">
      {/* Header */}
      <header className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Business Dashboard</h1>
          <p className="text-gray-600">Monitor your business performance and transactions</p>
        </div>
        <div className="flex items-center gap-3">
          <Link href="/invoice">
            <motion.button 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center gap-2 bg-[#002fa7] hover:bg-[#002fa7]/90 text-white font-medium py-2 px-4 rounded-xl transition-colors duration-200 text-sm"
            >
              <Plus className="h-4 w-4" />
              <span>Create Invoice</span>
            </motion.button>
          </Link>
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

      {/* Analytics Overview */}
      {analytics && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <motion.div
            variants={cardVariants}
            initial="hidden"
            animate="visible"
            className="p-6 bg-white border border-gray-200 rounded-3xl shadow-lg"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-[#002fa7]/10 rounded-xl">
                <DollarSign className="h-6 w-6 text-[#002fa7]" />
              </div>
              <div className={`flex items-center gap-1 px-2 py-1 rounded-md text-xs font-medium ${
                analytics.revenue?.growth >= 0 ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'
              }`}>
                {analytics.revenue?.growth >= 0 ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownLeft className="h-3 w-3" />}
                {formatPercentage(Math.abs(analytics.revenue?.growth || 0))}
              </div>
            </div>
            <div className="space-y-1">
              <h3 className="text-sm font-medium text-gray-600">Total Revenue</h3>
              <p className="text-2xl font-bold text-gray-900">{formatCurrency(analytics.revenue?.total || 0)}</p>
            </div>
          </motion.div>

          <motion.div
            variants={cardVariants}
            initial="hidden"
            animate="visible"
            className="p-6 bg-white border border-gray-200 rounded-3xl shadow-lg"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-green-100 rounded-xl">
                <FileText className="h-6 w-6 text-green-600" />
              </div>
              <div className={`flex items-center gap-1 px-2 py-1 rounded-md text-xs font-medium ${
                analytics.invoices?.growth >= 0 ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'
              }`}>
                {analytics.invoices?.growth >= 0 ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownLeft className="h-3 w-3" />}
                {formatPercentage(Math.abs(analytics.invoices?.growth || 0))}
              </div>
            </div>
            <div className="space-y-1">
              <h3 className="text-sm font-medium text-gray-600">Total Invoices</h3>
              <p className="text-2xl font-bold text-gray-900">{analytics.invoices?.total || 0}</p>
            </div>
          </motion.div>

          <motion.div
            variants={cardVariants}
            initial="hidden"
            animate="visible"
            className="p-6 bg-white border border-gray-200 rounded-3xl shadow-lg"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-purple-100 rounded-xl">
                <CreditCard className="h-6 w-6 text-purple-600" />
              </div>
              <div className={`flex items-center gap-1 px-2 py-1 rounded-md text-xs font-medium ${
                analytics.transactions?.growth >= 0 ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'
              }`}>
                {analytics.transactions?.growth >= 0 ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownLeft className="h-3 w-3" />}
                {formatPercentage(Math.abs(analytics.transactions?.growth || 0))}
              </div>
            </div>
            <div className="space-y-1">
              <h3 className="text-sm font-medium text-gray-600">Transactions</h3>
              <p className="text-2xl font-bold text-gray-900">{analytics.transactions?.total || 0}</p>
            </div>
          </motion.div>

          <motion.div
            variants={cardVariants}
            initial="hidden"
            animate="visible"
            className="p-6 bg-white border border-gray-200 rounded-3xl shadow-lg"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-orange-100 rounded-xl">
                <Users className="h-6 w-6 text-orange-600" />
              </div>
              <div className="flex items-center gap-1 px-2 py-1 rounded-md text-xs font-medium bg-green-100 text-green-600">
                <ArrowUpRight className="h-3 w-3" />
                {formatPercentage(analytics.successRate || 0)}
              </div>
            </div>
            <div className="space-y-1">
              <h3 className="text-sm font-medium text-gray-600">Success Rate</h3>
              <p className="text-2xl font-bold text-gray-900">{formatPercentage(analytics.successRate || 0)}</p>
            </div>
          </motion.div>
        </div>
      )}

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {analytics && (
          <motion.div
            variants={cardVariants}
            initial="hidden"
            animate="visible"
            className="lg:col-span-3 bg-white border border-gray-200 rounded-3xl shadow-lg p-6"
          >
            <SimpleBarChart 
              data={analytics.dailyRevenue.map(day => ({
                label: day.fullDate,
                value: day.revenue
              }))} 
              title="Daily Revenue (Last 7 Days)"
              formatValue={formatCurrency}
            />
          </motion.div>
        )}

        {analytics && (
          <motion.div
            variants={cardVariants}
            initial="hidden"
            animate="visible"
            className="lg:col-span-1 bg-white border border-gray-200 rounded-3xl shadow-lg p-6"
          >
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">Business QR Code</h3>
              <div className="flex flex-col items-center space-y-3">
                <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
                  <img 
                    src="/duitnowqr.jpg" 
                    alt="DuitNow QR Code" 
                    className="w-48 h-48 object-contain"
                  />
                </div>
                <div className="text-center">
                  <p className="text-sm text-gray-500">Scan to pay</p>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </div>

      {/* Recent Transactions */}
      <motion.div
        variants={cardVariants}
        initial="hidden"
        animate="visible"
        className="bg-white border border-gray-200 rounded-3xl shadow-lg"
      >
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">Recent Transactions</h3>
            <Link href="/business/transactions" className="text-[#002fa7] hover:text-[#002fa7]/80 font-medium text-sm">
              View All
            </Link>
          </div>
        </div>
        <div className="p-6">
          <div className="space-y-4">
            {transactions.slice(0, 5).map((transaction) => (
              <div key={transaction.transaction_id} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                <div className="flex items-center gap-4">
                  <div className="p-2 bg-white rounded-xl border border-gray-200">
                    {getStatusIcon(transaction.transaction_status)}
                  </div>
                  <div>
                    <div className="font-medium text-gray-900">
                      {transaction.payer_identity_token ? `Payment from ${transaction.payer_identity_token.substring(0, 8)}...` : 'Anonymous Payment'}
                    </div>
                    <div className="text-sm text-gray-500">
                      {formatDate(transaction.transaction_date)} • {transaction.payment_method}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-semibold text-gray-900">{formatCurrency(transaction.amount || 0)}</div>
                  <div className={`text-xs capitalize ${
                    transaction.transaction_status === 'completed' ? 'text-green-600' :
                    transaction.transaction_status === 'pending' ? 'text-yellow-600' :
                    'text-red-600'
                  }`}>
                    {transaction.transaction_status}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Recent Invoices */}
      <motion.div
        variants={cardVariants}
        initial="hidden"
        animate="visible"
        className="bg-white border border-gray-200 rounded-3xl shadow-lg"
      >
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">Recent Invoices</h3>
            <Link href="/invoice" className="text-[#002fa7] hover:text-[#002fa7]/80 font-medium text-sm">
              View All
            </Link>
          </div>
        </div>
        <div className="p-6">
          <div className="space-y-4">
            {invoices.slice(0, 5).map((invoice) => {
              const dueDate = new Date(invoice.due_date);
              const isOverdue = dueDate < new Date() && invoice.status === 'pending';
              
              return (
                <div key={invoice.invoice_number} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                  <div className="flex items-center gap-4">
                    <div className="p-2 bg-white rounded-xl border border-gray-200">
                      <FileText className={`h-4 w-4 ${
                        invoice.status === 'paid' ? 'text-green-500' :
                        isOverdue ? 'text-red-500' : 'text-yellow-500'
                      }`} />
                    </div>
                    <div>
                      <div className="font-medium text-gray-900">
                        Invoice #{invoice.invoice_number}
                      </div>
                      <div className="text-sm text-gray-500">
                        Due: {formatDate(invoice.due_date)}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-semibold text-gray-900">{formatCurrency(invoice.amount || 0)}</div>
                    <div className={`text-xs capitalize ${
                      invoice.status === 'paid' ? 'text-green-600' :
                      isOverdue ? 'text-red-600' : 'text-yellow-600'
                    }`}>
                      {isOverdue ? 'Overdue' : invoice.status}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </motion.div>
    </div>
  );
}