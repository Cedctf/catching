import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  BarChart3, 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  Users, 
  Calendar,
  Filter,
  Download,
  RefreshCw,
  ArrowUpRight,
  ArrowDownLeft,
  PieChart,
  Activity,
  Clock,
  CreditCard
} from 'lucide-react';

export default function AnalyticsSection({ businessData, onDataUpdate }) {
  const [timeRange, setTimeRange] = useState('7days');
  const [chartType, setChartType] = useState('revenue');

  // Mock analytics data
  const analyticsData = {
    overview: {
      totalRevenue: 25750.80,
      revenueGrowth: 12.5,
      totalTransactions: 145,
      transactionGrowth: 8.2,
      avgTransactionValue: 177.59,
      avgGrowth: 4.1,
      conversionRate: 89.3,
      conversionGrowth: 2.8
    },
    dailyRevenue: [
      { date: '2024-01-14', revenue: 1250.50, transactions: 12 },
      { date: '2024-01-15', revenue: 1890.25, transactions: 18 },
      { date: '2024-01-16', revenue: 2150.75, transactions: 22 },
      { date: '2024-01-17', revenue: 1750.30, transactions: 15 },
      { date: '2024-01-18', revenue: 2890.40, transactions: 28 },
      { date: '2024-01-19', revenue: 3250.80, transactions: 32 },
      { date: '2024-01-20', revenue: 2750.60, transactions: 25 }
    ],
    paymentMethods: [
      { method: 'DuitNow', amount: 12750.30, percentage: 49.5, color: '#002fa7' },
      { method: 'GrabPay', amount: 7250.20, percentage: 28.1, color: '#00C853' },
      { method: 'Boost', amount: 3850.15, percentage: 14.9, color: '#FF5722' },
      { method: 'Touch n Go', amount: 1900.15, percentage: 7.4, color: '#2196F3' }
    ],
    hourlyData: [
      { hour: '09:00', revenue: 125.50, transactions: 2 },
      { hour: '10:00', revenue: 275.30, transactions: 4 },
      { hour: '11:00', revenue: 450.75, transactions: 6 },
      { hour: '12:00', revenue: 625.20, transactions: 8 },
      { hour: '13:00', revenue: 890.40, transactions: 12 },
      { hour: '14:00', revenue: 1250.60, transactions: 15 },
      { hour: '15:00', revenue: 975.80, transactions: 11 },
      { hour: '16:00', revenue: 850.45, transactions: 9 },
      { hour: '17:00', revenue: 1125.75, transactions: 13 },
      { hour: '18:00', revenue: 1350.90, transactions: 16 }
    ]
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-MY', {
      style: 'currency',
      currency: 'MYR',
      minimumFractionDigits: 2
    }).format(amount);
  };

  const formatPercentage = (value) => {
    return `${value.toFixed(1)}%`;
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-MY', {
      month: 'short',
      day: 'numeric'
    });
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: "easeOut" }
    }
  };

  const SimpleChart = ({ data, type }) => {
    const maxValue = Math.max(...data.map(d => type === 'revenue' ? d.revenue : d.transactions));
    
    return (
      <div className="h-64 flex items-end justify-between gap-2 p-4">
        {data.map((item, index) => {
          const value = type === 'revenue' ? item.revenue : item.transactions;
          const height = (value / maxValue) * 200;
          
          return (
            <div key={index} className="flex-1 flex flex-col items-center">
              <div className="relative w-full bg-gray-100 rounded-t-lg overflow-hidden">
                <motion.div
                  initial={{ height: 0 }}
                  animate={{ height: `${height}px` }}
                  transition={{ delay: index * 0.1, duration: 0.6 }}
                  className="bg-[#002fa7] w-full rounded-t-lg"
                  style={{ minHeight: '4px' }}
                />
              </div>
              <div className="text-xs text-gray-600 mt-2 text-center">
                {formatDate(item.date)}
              </div>
              <div className="text-xs font-medium text-gray-900">
                {type === 'revenue' ? formatCurrency(value) : value}
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  const PieChartComponent = ({ data }) => {
    const total = data.reduce((sum, item) => sum + item.amount, 0);
    let cumulativePercentage = 0;
    
    return (
      <div className="flex flex-col lg:flex-row items-center gap-6 lg:gap-8 w-full">
        <div className="relative w-40 h-40 lg:w-48 lg:h-48 flex-shrink-0">
          <svg width="100%" height="100%" viewBox="0 0 192 192" className="transform -rotate-90">
            <circle
              cx="96"
              cy="96"
              r="80"
              fill="none"
              stroke="#f3f4f6"
              strokeWidth="16"
            />
            {data.map((item, index) => {
              const percentage = (item.amount / total) * 100;
              const strokeDasharray = `${percentage * 5.02} 502`;
              const strokeDashoffset = -cumulativePercentage * 5.02;
              cumulativePercentage += percentage;
              
              return (
                <circle
                  key={index}
                  cx="96"
                  cy="96"
                  r="80"
                  fill="none"
                  stroke={item.color}
                  strokeWidth="16"
                  strokeDasharray={strokeDasharray}
                  strokeDashoffset={strokeDashoffset}
                  className="transition-all duration-500"
                />
              );
            })}
          </svg>
        </div>
        
        <div className="space-y-4 flex-1 w-full lg:w-auto">
          {data.map((item, index) => (
            <div key={index} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
              <div
                className="w-4 h-4 rounded-full flex-shrink-0"
                style={{ backgroundColor: item.color }}
              />
              <div className="flex-1 min-w-0">
                <p className="font-medium text-gray-900 truncate">{item.method}</p>
                <p className="text-sm text-gray-600">
                  {formatCurrency(item.amount)} ({formatPercentage(item.percentage)})
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="w-full px-4 xl:px-6">
      <div className="w-full space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Analytics & Insights</h2>
          <p className="text-gray-600">Track your business performance and trends</p>
        </div>
        <div className="flex items-center gap-3">
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#002fa7] focus:border-transparent"
          >
            <option value="7days">Last 7 Days</option>
            <option value="30days">Last 30 Days</option>
            <option value="90days">Last 90 Days</option>
            <option value="1year">Last Year</option>
          </select>
          <button className="flex items-center gap-2 bg-[#002fa7] hover:bg-[#002fa7]/90 text-white px-4 py-2 rounded-lg transition-colors">
            <Download className="h-4 w-4" />
            Export
          </button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-4 gap-4 xl:gap-6">
        <motion.div
          variants={cardVariants}
          initial="hidden"
          animate="visible"
          className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-[#002fa7]/10 rounded-lg">
              <DollarSign className="h-6 w-6 text-[#002fa7]" />
            </div>
            <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
              analyticsData.overview.revenueGrowth >= 0 ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'
            }`}>
              {analyticsData.overview.revenueGrowth >= 0 ? (
                <ArrowUpRight className="h-3 w-3" />
              ) : (
                <ArrowDownLeft className="h-3 w-3" />
              )}
              {formatPercentage(Math.abs(analyticsData.overview.revenueGrowth))}
            </div>
          </div>
          <div>
            <p className="text-sm text-gray-600">Total Revenue</p>
            <p className="text-2xl font-bold text-gray-900">
              {formatCurrency(analyticsData.overview.totalRevenue)}
            </p>
          </div>
        </motion.div>

        <motion.div
          variants={cardVariants}
          initial="hidden"
          animate="visible"
          className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-green-100 rounded-lg">
              <Activity className="h-6 w-6 text-green-600" />
            </div>
            <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
              analyticsData.overview.transactionGrowth >= 0 ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'
            }`}>
              {analyticsData.overview.transactionGrowth >= 0 ? (
                <ArrowUpRight className="h-3 w-3" />
              ) : (
                <ArrowDownLeft className="h-3 w-3" />
              )}
              {formatPercentage(Math.abs(analyticsData.overview.transactionGrowth))}
            </div>
          </div>
          <div>
            <p className="text-sm text-gray-600">Total Transactions</p>
            <p className="text-2xl font-bold text-gray-900">
              {analyticsData.overview.totalTransactions.toLocaleString()}
            </p>
          </div>
        </motion.div>

        <motion.div
          variants={cardVariants}
          initial="hidden"
          animate="visible"
          className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-blue-100 rounded-lg">
              <BarChart3 className="h-6 w-6 text-blue-600" />
            </div>
            <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
              analyticsData.overview.avgGrowth >= 0 ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'
            }`}>
              {analyticsData.overview.avgGrowth >= 0 ? (
                <ArrowUpRight className="h-3 w-3" />
              ) : (
                <ArrowDownLeft className="h-3 w-3" />
              )}
              {formatPercentage(Math.abs(analyticsData.overview.avgGrowth))}
            </div>
          </div>
          <div>
            <p className="text-sm text-gray-600">Avg Transaction Value</p>
            <p className="text-2xl font-bold text-gray-900">
              {formatCurrency(analyticsData.overview.avgTransactionValue)}
            </p>
          </div>
        </motion.div>

        <motion.div
          variants={cardVariants}
          initial="hidden"
          animate="visible"
          className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-purple-100 rounded-lg">
              <TrendingUp className="h-6 w-6 text-purple-600" />
            </div>
            <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
              analyticsData.overview.conversionGrowth >= 0 ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'
            }`}>
              {analyticsData.overview.conversionGrowth >= 0 ? (
                <ArrowUpRight className="h-3 w-3" />
              ) : (
                <ArrowDownLeft className="h-3 w-3" />
              )}
              {formatPercentage(Math.abs(analyticsData.overview.conversionGrowth))}
            </div>
          </div>
          <div>
            <p className="text-sm text-gray-600">Success Rate</p>
            <p className="text-2xl font-bold text-gray-900">
              {formatPercentage(analyticsData.overview.conversionRate)}
            </p>
          </div>
        </motion.div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Chart */}
        <motion.div
          variants={cardVariants}
          initial="hidden"
          animate="visible"
          className="bg-white rounded-xl shadow-sm border border-gray-200"
        >
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">Daily Revenue</h3>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setChartType('revenue')}
                  className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                    chartType === 'revenue' 
                      ? 'bg-[#002fa7] text-white' 
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  Revenue
                </button>
                <button
                  onClick={() => setChartType('transactions')}
                  className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                    chartType === 'transactions' 
                      ? 'bg-[#002fa7] text-white' 
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  Transactions
                </button>
              </div>
            </div>
            <div className="min-h-[300px]">
              <SimpleChart data={analyticsData.dailyRevenue} type={chartType} />
            </div>
          </div>
        </motion.div>

        {/* Payment Methods Breakdown */}
        <motion.div
          variants={cardVariants}
          initial="hidden"
          animate="visible"
          className="bg-white rounded-xl shadow-sm border border-gray-200"
        >
          <div className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Payment Methods</h3>
            <div className="min-h-[300px] flex items-center justify-center">
              <PieChartComponent data={analyticsData.paymentMethods} />
            </div>
          </div>
        </motion.div>
      </div>

      {/* Peak Hours Analysis */}
      <motion.div
        variants={cardVariants}
        initial="hidden"
        animate="visible"
        className="bg-white rounded-xl shadow-sm border border-gray-200"
      >
        <div className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Peak Hours Analysis</h3>
          <div className="grid grid-cols-2 md:grid-cols-5 lg:grid-cols-10 gap-4">
            {analyticsData.hourlyData.map((item, index) => {
              const maxRevenue = Math.max(...analyticsData.hourlyData.map(d => d.revenue));
              const intensity = (item.revenue / maxRevenue) * 100;
              
              return (
                <div key={index} className="text-center">
                  <div className="text-xs text-gray-600 mb-2">{item.hour}</div>
                  <div
                    className={`h-16 rounded-lg mb-2 ${
                      intensity > 80 ? 'bg-red-200' :
                      intensity > 60 ? 'bg-orange-200' :
                      intensity > 40 ? 'bg-yellow-200' :
                      intensity > 20 ? 'bg-green-200' :
                      'bg-gray-200'
                    }`}
                    style={{ 
                      backgroundColor: intensity > 0 ? `rgba(0, 47, 167, ${intensity / 100})` : '#f3f4f6'
                    }}
                  />
                  <div className="text-xs font-medium text-gray-900">
                    {formatCurrency(item.revenue)}
                  </div>
                  <div className="text-xs text-gray-500">
                    {item.transactions} txns
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </motion.div>

      {/* Insights */}
      <motion.div
        variants={cardVariants}
        initial="hidden"
        animate="visible"
        className="bg-white rounded-xl shadow-sm border border-gray-200"
      >
        <div className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Key Insights</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="flex items-start gap-3 p-4 bg-blue-50 rounded-lg">
                <TrendingUp className="h-5 w-5 text-blue-600 mt-0.5" />
                <div>
                  <p className="font-medium text-gray-900">Revenue Growth</p>
                  <p className="text-sm text-gray-600">
                    Your revenue has increased by {formatPercentage(analyticsData.overview.revenueGrowth)} this week
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-4 bg-green-50 rounded-lg">
                <Clock className="h-5 w-5 text-green-600 mt-0.5" />
                <div>
                  <p className="font-medium text-gray-900">Peak Hours</p>
                  <p className="text-sm text-gray-600">
                    Most transactions occur between 2-6 PM
                  </p>
                </div>
              </div>
            </div>
            <div className="space-y-4">
              <div className="flex items-start gap-3 p-4 bg-purple-50 rounded-lg">
                <CreditCard className="h-5 w-5 text-purple-600 mt-0.5" />
                <div>
                  <p className="font-medium text-gray-900">Top Payment Method</p>
                  <p className="text-sm text-gray-600">
                    DuitNow accounts for {formatPercentage(analyticsData.paymentMethods[0].percentage)} of payments
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-4 bg-orange-50 rounded-lg">
                <BarChart3 className="h-5 w-5 text-orange-600 mt-0.5" />
                <div>
                  <p className="font-medium text-gray-900">Average Transaction</p>
                  <p className="text-sm text-gray-600">
                    Transaction value increased by {formatPercentage(analyticsData.overview.avgGrowth)}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
      </div>
    </div>
  );
} 