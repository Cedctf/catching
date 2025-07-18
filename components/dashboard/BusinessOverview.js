import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  FileText, 
  Users, 
  CreditCard,
  ArrowUpRight,
  ArrowDownLeft,
  CheckCircle,
  Clock,
  AlertCircle,
  X,
  Share2,
  Download,
  Plus
} from 'lucide-react';
import Link from 'next/link';
import SimpleBarChart from '../SimpleBarChart';
import { getAllAccounts, ACCOUNT_TYPES, formatAccountBalance } from '../../lib/accountData';

export default function BusinessOverview({ businessData, onDataUpdate, onDownloadReport, onTabChange }) {
  const [showQRModal, setShowQRModal] = useState(false);

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

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'DuitNow QR Code',
          text: 'Scan this QR code to make a payment',
          url: window.location.origin + '/duitnowqr_whole_exported.jpg'
        });
      } catch (error) {
        console.log('Error sharing:', error);
      }
    } else {
      // Fallback: copy to clipboard
      try {
        await navigator.clipboard.writeText(window.location.origin + '/duitnowqr_whole_exported.jpg');
        alert('QR code link copied to clipboard!');
      } catch (error) {
        console.log('Error copying to clipboard:', error);
      }
    }
  };

  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = '/duitnowqr_whole_exported.jpg';
    link.download = 'duitnow-qr-code.jpg';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 50, rotateX: 15 },
    visible: {
      opacity: 1, y: 0, rotateX: 0,
      transition: { duration: 0.8, ease: [0.25, 0.4, 0.25, 1] }
    }
  };

  const pageVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.6,
        ease: "easeOut",
        staggerChildren: 0.1
      }
    }
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  const analytics = businessData?.analytics || {};
  const transactions = businessData?.transactions || [];
  const invoices = businessData?.invoices || [];

  // Helper function to check if date is within last 7 days
  const isWithinLast7Days = (dateString) => {
    const transactionDate = new Date(dateString);
    const today = new Date();
    const sevenDaysAgo = new Date(today);
    sevenDaysAgo.setDate(today.getDate() - 7);
    return transactionDate >= sevenDaysAgo && transactionDate <= today;
  };

  // Calculate recent transactions for display (last 7 days)
  const recentTransactions = transactions
    .filter(t => t.transaction_status === 'completed' && isWithinLast7Days(t.transaction_date))
    .slice(0, 5)
    .map(transaction => ({
      id: transaction.transaction_id,
      date: new Date(transaction.transaction_date).toLocaleDateString('en-MY', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      }),
      amount: transaction.amount,
      status: transaction.transaction_status,
      paymentMethod: transaction.payment_method,
      customer: `Customer ${transaction.transaction_id.slice(-3)}`
    }));

  // Calculate recent invoices for display (last 7 days)
  const recentInvoices = invoices
    .filter(invoice => isWithinLast7Days(invoice.created_at))
    .slice(0, 5);

  return (
    <div className="w-full px-4 xl:px-6">
      <motion.div 
        className="space-y-6"
        variants={pageVariants}
        initial="hidden"
        animate="visible"
      >
      {/* Header */}
      <header className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Business Dashboard</h1>
          <p className="text-gray-600">Welcome back, {businessData?.businessName || 'Business Owner'}</p>
        </div>
        <div className="flex items-center gap-3">
          <Link href="/invoice">
            <motion.button 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center gap-2 bg-[#002fa7] hover:bg-[#002fa7]/90 text-white font-medium py-2 px-4 rounded-xl transition-colors duration-200 text-sm"
            >
              <FileText className="h-4 w-4" />
              <span>Create Invoice</span>
            </motion.button>
          </Link>
        </div>
      </header>

      {/* Analytics Overview */}
      <motion.div 
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-4 gap-4 xl:gap-6"
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
      >
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
      </motion.div>

      {/* Charts Section */}
      <motion.div 
        className="grid grid-cols-1 lg:grid-cols-4 gap-4 xl:gap-6"
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
      >
        {analytics.dailyRevenue && (
          <motion.div
            variants={cardVariants}
            initial="hidden"
            animate="visible"
            className="lg:col-span-3 bg-white border border-gray-200 rounded-3xl shadow-lg"
          >
            <div className="h-full flex flex-col">
              <div className="px-6 pt-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold text-gray-900">Daily Revenue (Last 7 Days)</h3>
                  <button
                    onClick={onDownloadReport}
                    className="flex items-center space-x-2 px-3 py-1.5 bg-[#002fa7] text-white rounded-lg hover:bg-[#002fa7]/90 transition-colors"
                  >
                    <Download className="h-4 w-4" />
                    <span>Today's Report</span>
                  </button>
                </div>
              </div>
              <div className="flex-1 flex items-end justify-center">
                <div className="px-6 pt-6 pb-8 w-full">
                  <SimpleBarChart 
                    data={analytics.dailyRevenue.map(day => ({
                      label: day.fullDate,
                      value: day.revenue
                    }))} 
                    formatValue={formatCurrency}
                  />
                </div>
              </div>
            </div>
          </motion.div>
        )}

        <motion.div
          variants={cardVariants}
          initial="hidden"
          animate="visible"
          className="lg:col-span-1 bg-white border border-gray-200 rounded-3xl shadow-lg p-6"
        >
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">DuitNow QR</h3>
            <div className="flex flex-col items-center space-y-3">
              <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
                <img 
                  src="/duitnowqr.jpg" 
                  alt="DuitNow QR Code" 
                  className="w-48 h-48 object-contain"
                />
              </div>
              <div className="text-center">
                <button
                  onClick={() => setShowQRModal(true)}
                  className="text-sm text-[#002fa7] hover:text-[#002fa7]/80 font-medium underline"
                >
                  Details
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>

      {/* Recent Transactions */}
      <motion.div
        variants={cardVariants}
        initial="hidden"
        animate="visible"
        className="bg-white border border-gray-200 rounded-3xl shadow-lg"
      >
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">Recent Transactions (Last 7 Days)</h3>
            <button
              onClick={() => {
                if (onTabChange) {
                  onTabChange('payments');
                  // Set a flag to navigate to transactions section
                  setTimeout(() => {
                    const event = new CustomEvent('navigateToTransactions');
                    window.dispatchEvent(event);
                  }, 100);
                }
              }}
              className="text-[#002fa7] hover:text-[#002fa7]/80 font-medium text-sm"
            >
              View All
            </button>
          </div>
        </div>
        <div className="p-6">
        {recentTransactions.length > 0 ? (
          <div className="space-y-4">
            {recentTransactions.map((transaction) => (
              <div key={transaction.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                <div className="flex items-center gap-4">
                  <div className="p-2 bg-green-100 rounded-full">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">
                      Payment from {transaction.customer}
                    </p>
                    <p className="text-sm text-gray-500">
                      {transaction.date} • {transaction.paymentMethod}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-gray-900">
                    {formatCurrency(transaction.amount)}
                  </p>
                  <p className="text-xs text-green-600 capitalize">
                    {transaction.status}
                  </p>
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
            <h3 className="text-lg font-semibold text-gray-900">Recent Invoices (Last 7 Days)</h3>
            <button
              onClick={() => onTabChange && onTabChange('invoicing')}
              className="text-[#002fa7] hover:text-[#002fa7]/80 font-medium text-sm"
            >
              View All
            </button>
          </div>
        </div>
        <div className="p-6">
          <div className="space-y-4">
            {recentInvoices.map((invoice) => {
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

      {/* QR Modal */}
      {showQRModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            className="bg-white rounded-xl shadow-xl max-w-md w-full p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-gray-900">DuitNow QR Code</h3>
              <button
                onClick={() => setShowQRModal(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="h-5 w-5 text-gray-500" />
              </button>
            </div>
            <div className="flex flex-col items-center space-y-4">
              <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
                <img 
                  src="/duitnowqr_whole_exported.jpg" 
                  alt="DuitNow QR Code" 
                  className="w-56 h-56 object-contain"
                />
              </div>
              <div className="flex gap-3">
                <button
                  onClick={handleShare}
                  className="flex items-center gap-2 bg-[#002fa7] hover:bg-[#002fa7]/90 text-white px-4 py-2 rounded-lg transition-colors"
                >
                  <Share2 className="h-4 w-4" />
                  Share
                </button>
                <button
                  onClick={handleDownload}
                  className="flex items-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg transition-colors"
                >
                  <Download className="h-4 w-4" />
                  Download
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
      </motion.div>
    </div>
  );
} 