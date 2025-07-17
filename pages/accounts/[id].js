import { useState } from 'react';
import { useRouter } from 'next/router';
import { motion } from 'framer-motion';
import { 
  ArrowLeft, 
  QrCode, 
  Plus, 
  Settings,
  ArrowUpRight,
  ArrowDownLeft,
  Check,
  Search,
  Calendar,
  Building,
  CreditCard,
  Filter,
  ChevronDown,
  Phone,
  Globe,
  Clock,
  DollarSign,
  Tag
} from 'lucide-react';
import { getAccountById, formatAccountBalance } from '../../lib/accountData';

// Mock transaction data - In real app, this would come from an API
const mockTransactions = [
  {
    id: 'TX123456',
    date: '2024-03-20T10:30:00Z',
    amount: 1500.00,
    type: 'incoming',
    payee: 'Company ABC',
    category: 'Salary',
    description: 'March 2024 Salary',
    status: 'completed'
  },
  {
    id: 'TX123457',
    date: '2024-03-19T15:45:00Z',
    amount: 250.50,
    type: 'outgoing',
    payee: 'Grocery Store XYZ',
    category: 'Groceries',
    description: 'Weekly groceries',
    status: 'completed'
  },
  // Add more mock transactions as needed
];

const AccountDetailsPage = () => {
  const router = useRouter();
  const { id } = router.query;
  const account = getAccountById(id);
  const [activeTab, setActiveTab] = useState('all');
  const [showBalances, setShowBalances] = useState(true);

  const [dateRange, setDateRange] = useState('all');
  const [amountMin, setAmountMin] = useState('');
  const [amountMax, setAmountMax] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  if (!account) {
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

  const filteredTransactions = mockTransactions.filter(tx => {
    if (activeTab !== 'all' && tx.type !== activeTab) return false;
    if (searchTerm && !tx.description.toLowerCase().includes(searchTerm.toLowerCase())) return false;
    if (amountMin && tx.amount < parseFloat(amountMin)) return false;
    if (amountMax && tx.amount > parseFloat(amountMax)) return false;
    if (selectedCategory !== 'all' && tx.category !== selectedCategory) return false;
    return true;
  });

  const cardVariants = {
    hidden: { opacity: 0, y: 50, rotateX: 15 },
    visible: {
      opacity: 1, y: 0, rotateX: 0,
      transition: { duration: 0.8, ease: [0.25, 0.4, 0.25, 1] }
    }
  };

  return (
    <div className="relative w-full max-w-7xl mx-auto px-6 py-8 space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <button 
          onClick={() => router.push('/accounts')}
          className="p-2 bg-[#002fa7]/10 hover:bg-[#002fa7]/20 rounded-xl transition-colors"
        >
          <ArrowLeft className="h-5 w-5 text-gray-700" />
        </button>
        <h1 className="text-2xl font-bold text-gray-900">
          {account.name}
        </h1>
      </div>

      {/* Account Summary Card */}
      <motion.div
        variants={cardVariants}
        initial="hidden"
        animate="visible"
        className="bg-white border border-gray-200 rounded-3xl shadow-lg p-6"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Balance Section */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-[#002fa7]/10 rounded-xl">
                <DollarSign className="h-6 w-6 text-[#002fa7]" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Current Balance</p>
                <p className="text-2xl font-bold text-gray-900">
                  {showBalances ? formatAccountBalance(account.balance) : '••••••'}
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <div className="p-3 bg-green-100 rounded-xl">
                <Building className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Account Type</p>
                <p className="font-medium text-gray-900">{account.type}</p>
              </div>
            </div>
          </div>

          {/* Status Section */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-purple-100 rounded-xl">
                <Check className="h-6 w-6 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Status</p>
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  account.status === 'Active' 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-gray-100 text-gray-800'
                }`}>
                  {account.status}
                </span>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <div className="p-3 bg-orange-100 rounded-xl">
                <Clock className="h-6 w-6 text-orange-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Last Sync</p>
                <p className="text-sm text-gray-900">{account.lastSync}</p>
              </div>
            </div>
          </div>

          {/* Actions Section */}
          <div className="space-y-3">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full flex items-center gap-2 bg-[#002fa7] hover:bg-[#002fa7]/90 text-white font-medium py-3 px-4 rounded-xl transition-colors duration-200"
            >
              <QrCode className="h-5 w-5" />
              <span>Generate QR</span>
            </motion.button>
            
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full flex items-center gap-2 bg-white hover:bg-gray-50 text-gray-700 font-medium py-3 px-4 rounded-xl transition-colors duration-200 border border-gray-200"
            >
              <Settings className="h-5 w-5" />
              <span>Settings</span>
            </motion.button>
          </div>
        </div>
      </motion.div>

      {/* Transactions Section */}
      <motion.div
        variants={cardVariants}
        initial="hidden"
        animate="visible"
        className="bg-white border border-gray-200 rounded-3xl shadow-lg overflow-hidden"
      >
        {/* Tabs */}
        <div className="flex border-b border-gray-200">
          <button
            onClick={() => setActiveTab('all')}
            className={`py-4 px-6 text-sm font-medium transition-colors relative ${
              activeTab === 'all' ? 'text-[#002fa7]' : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            All Transactions
            {activeTab === 'all' && (
              <motion.div
                layoutId="activeTab"
                className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#002fa7]"
              />
            )}
          </button>
          <button
            onClick={() => setActiveTab('incoming')}
            className={`py-4 px-6 text-sm font-medium transition-colors relative ${
              activeTab === 'incoming' ? 'text-[#002fa7]' : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Incoming
            {activeTab === 'incoming' && (
              <motion.div
                layoutId="activeTab"
                className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#002fa7]"
              />
            )}
          </button>
          <button
            onClick={() => setActiveTab('outgoing')}
            className={`py-4 px-6 text-sm font-medium transition-colors relative ${
              activeTab === 'outgoing' ? 'text-[#002fa7]' : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Outgoing
            {activeTab === 'outgoing' && (
              <motion.div
                layoutId="activeTab"
                className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#002fa7]"
              />
            )}
          </button>
        </div>

        {/* Filters */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex flex-wrap gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search transactions..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#002fa7]/30 focus:border-[#002fa7]/20 transition-all duration-200"
              />
            </div>
            
            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className="px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#002fa7]/30 focus:border-[#002fa7]/20 transition-all duration-200"
            >
              <option value="all">All Time</option>
              <option value="today">Today</option>
              <option value="week">This Week</option>
              <option value="month">This Month</option>
            </select>
            
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#002fa7]/30 focus:border-[#002fa7]/20 transition-all duration-200"
            >
              <option value="all">All Categories</option>
              <option value="Salary">Salary</option>
              <option value="Groceries">Groceries</option>
              <option value="Utilities">Utilities</option>
            </select>
          </div>
        </div>

        {/* Transaction List */}
        <div className="p-6">
          <div className="space-y-4">
            {filteredTransactions.map((transaction) => (
              <div key={transaction.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                <div className="flex items-center gap-4">
                  <div className="p-2 bg-white rounded-xl border border-gray-200">
                    {transaction.type === 'incoming' ? (
                      <ArrowDownLeft className="h-5 w-5 text-green-500" />
                    ) : (
                      <ArrowUpRight className="h-5 w-5 text-red-500" />
                    )}
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{transaction.description}</p>
                    <p className="text-sm text-gray-500">{transaction.payee} • {transaction.category}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className={`font-semibold ${transaction.type === 'incoming' ? 'text-green-600' : 'text-red-600'}`}>
                    {transaction.type === 'incoming' ? '+' : '-'}${transaction.amount.toFixed(2)}
                  </p>
                  <p className="text-sm text-gray-500">
                    {new Date(transaction.date).toLocaleDateString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default AccountDetailsPage; 