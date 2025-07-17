import { useState, useEffect } from 'react';
import Link from 'next/link';
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
    return `RM ${amount.toFixed(2)}`;
  };

  const formatPercentage = (value) => {
    return `${value.toFixed(1)}%`;
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-MY', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Business Dashboard</h1>
              <p className="text-gray-600">Doe's Bakery</p>
            </div>
            <Link href="/" className="text-blue-600 hover:text-blue-800">
              ← Back to Home
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Analytics Overview */}
        {analytics && (
          <>
            {/* Primary Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <AnalyticsCard
                title="Total Revenue"
                value={formatCurrency(analytics.revenue)}
                subtitle={`Net Balance: ${formatCurrency(analytics.balance)}`}
                icon="💰"
                color="green"
              />
              
              <AnalyticsCard
                title="Transactions"
                value={analytics.totalTransactions}
                subtitle={`${analytics.completedTransactions} completed`}
                icon="📊"
                color="blue"
              />
              
              <AnalyticsCard
                title="Invoices"
                value={analytics.totalInvoices}
                subtitle={`${analytics.paidInvoices} paid`}
                icon="📄"
                color="purple"
              />
              
              <AnalyticsCard
                title="Success Rate"
                value={formatPercentage(analytics.successRate)}
                subtitle={`Avg: ${formatCurrency(analytics.avgTransactionValue)}`}
                icon="📈"
                color="yellow"
              />
            </div>

            {/* Secondary Analytics */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              {/* Payment Methods Breakdown */}
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-semibold mb-4">Payment Methods</h3>
                <div className="space-y-3">
                  {Object.entries(analytics.paymentMethods).map(([method, amount]) => (
                    <div key={method} className="flex justify-between items-center">
                      <span className="text-sm font-medium text-gray-600">{method}</span>
                      <span className="text-sm font-bold text-gray-900">{formatCurrency(amount)}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Monthly Summary */}
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-semibold mb-4">This Month</h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-gray-600">Revenue</span>
                    <span className="text-sm font-bold text-green-600">{formatCurrency(analytics.monthlyRevenue)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-gray-600">Pending</span>
                    <span className="text-sm font-bold text-yellow-600">{formatCurrency(analytics.pendingAmount)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-gray-600">Failed</span>
                    <span className="text-sm font-bold text-red-600">{formatCurrency(analytics.failedAmount)}</span>
                  </div>
                </div>
              </div>

              {/* Invoice Status */}
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-semibold mb-4">Invoice Status</h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-gray-600">Paid</span>
                    <span className="text-sm font-bold text-green-600">{analytics.paidInvoices}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-gray-600">Pending</span>
                    <span className="text-sm font-bold text-yellow-600">{analytics.pendingInvoices}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-gray-600">Overdue</span>
                    <span className="text-sm font-bold text-red-600">{analytics.overdueInvoices}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Daily Revenue Chart */}
            <SimpleBarChart
              title="Daily Revenue (Last 7 Days)"
              data={analytics.dailyRevenue.map(day => ({
                label: new Date(day.date).toLocaleDateString('en-US', { weekday: 'short' }),
                value: day.revenue
              }))}
              formatValue={formatCurrency}
            />
          </>
        )}

        {/* Recent Transactions */}
        <div className="bg-white rounded-lg shadow mb-8">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Recent Transactions</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Transaction ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Amount
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Method
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {transactions.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="px-6 py-4 text-center text-gray-500">
                      No transactions yet
                    </td>
                  </tr>
                ) : (
                  transactions.map((transaction) => (
                    <tr key={transaction.transaction_id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-gray-900">
                        {transaction.transaction_id}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">
                        {formatCurrency(transaction.amount)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          transaction.payment_method === 'FACE' 
                            ? 'bg-blue-100 text-blue-800' 
                            : 'bg-green-100 text-green-800'
                        }`}>
                          {transaction.payment_method}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {formatDate(transaction.transaction_date)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          transaction.transaction_status === 'completed'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {transaction.transaction_status}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Recent Invoices */}
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Recent Invoices</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Invoice Number
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Amount
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Created
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {invoices.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="px-6 py-4 text-center text-gray-500">
                      No invoices yet
                    </td>
                  </tr>
                ) : (
                  invoices.map((invoice) => (
                    <tr key={invoice.invoice_number} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-gray-900">
                        {invoice.invoice_number}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">
                        {formatCurrency(invoice.amount)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          invoice.status === 'paid'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {invoice.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {formatDate(invoice.created_at)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        <Link 
                          href={`/invoice/${invoice.invoice_number}`}
                          className="text-blue-600 hover:text-blue-800"
                        >
                          View
                        </Link>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}