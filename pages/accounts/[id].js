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
    return <div>Loading...</div>;
  }

  const filteredTransactions = mockTransactions.filter(tx => {
    if (activeTab !== 'all' && tx.type !== activeTab) return false;
    if (searchTerm && !tx.description.toLowerCase().includes(searchTerm.toLowerCase())) return false;
    if (amountMin && tx.amount < parseFloat(amountMin)) return false;
    if (amountMax && tx.amount > parseFloat(amountMax)) return false;
    if (selectedCategory !== 'all' && tx.category !== selectedCategory) return false;
    return true;
  });

  return (
    <div className="relative w-full max-w-7xl space-y-6">
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
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="p-6 bg-blue-500/10 backdrop-blur-xl border border-blue-400/20 rounded-3xl"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Balance Section */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-blue-100/80">Current Balance</h3>
              <div className="flex gap-2">
                <button className="p-2 bg-blue-500/10 hover:bg-blue-500/20 rounded-xl transition-colors">
                  <QrCode className="h-4 w-4" />
                </button>
                <button className="p-2 bg-blue-500/10 hover:bg-blue-500/20 rounded-xl transition-colors">
                  <Plus className="h-4 w-4" />
                </button>
                <button className="p-2 bg-blue-500/10 hover:bg-blue-500/20 rounded-xl transition-colors">
                  <Settings className="h-4 w-4" />
                </button>
              </div>
            </div>
            <div className="text-3xl font-bold">
              {showBalances ? formatAccountBalance(account.balance, account.currency) : '••••'}
            </div>
            <div className="flex items-center gap-2 text-sm text-blue-200/60">
              <Clock className="h-4 w-4" />
              Last updated: {new Date(account.lastSync).toLocaleString()}
            </div>
          </div>

          {/* Account Details */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-blue-100/80">Account Info</h3>
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm">
                <Building className="h-4 w-4 text-blue-300/70" />
                <span className="text-blue-200/60">Type:</span>
                <span>{account.type}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <CreditCard className="h-4 w-4 text-blue-300/70" />
                <span className="text-blue-200/60">Account:</span>
                <span>{account.accountNumber || account.accountId}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Globe className="h-4 w-4 text-blue-300/70" />
                <span className="text-blue-200/60">Currency:</span>
                <span>{account.currency}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Phone className="h-4 w-4 text-blue-300/70" />
                <span className="text-blue-200/60">Phone:</span>
                <span>+60 12-345 6789</span>
              </div>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-blue-100/80">This Month</h3>
            <div className="space-y-3">
              <div className="p-3 bg-blue-500/5 rounded-xl">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <ArrowDownLeft className="h-4 w-4 text-green-400" />
                    <span className="text-sm text-blue-200/60">Income</span>
                  </div>
                  <span className="text-green-400">+{formatAccountBalance(15000, account.currency)}</span>
                </div>
              </div>
              <div className="p-3 bg-blue-500/5 rounded-xl">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <ArrowUpRight className="h-4 w-4 text-red-400" />
                    <span className="text-sm text-blue-200/60">Expenses</span>
                  </div>
                  <span className="text-red-400">-{formatAccountBalance(8500, account.currency)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Transactions Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-blue-500/5 backdrop-blur-xl border border-blue-400/20 rounded-3xl overflow-hidden"
      >
        {/* Tabs */}
        <div className="flex border-b border-blue-400/20">
          <button
            onClick={() => setActiveTab('all')}
            className={`py-4 px-6 text-sm font-medium transition-colors relative ${
              activeTab === 'all' ? 'text-white' : 'text-blue-200/60 hover:text-white'
            }`}
          >
            All Transactions
            {activeTab === 'all' && (
              <motion.div
                layoutId="activeTab"
                className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-400"
              />
            )}
          </button>
          <button
            onClick={() => setActiveTab('incoming')}
            className={`py-4 px-6 text-sm font-medium transition-colors relative ${
              activeTab === 'incoming' ? 'text-white' : 'text-blue-200/60 hover:text-white'
            }`}
          >
            Incoming
            {activeTab === 'incoming' && (
              <motion.div
                layoutId="activeTab"
                className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-400"
              />
            )}
          </button>
          <button
            onClick={() => setActiveTab('outgoing')}
            className={`py-4 px-6 text-sm font-medium transition-colors relative ${
              activeTab === 'outgoing' ? 'text-white' : 'text-blue-200/60 hover:text-white'
            }`}
          >
            Outgoing
            {activeTab === 'outgoing' && (
              <motion.div
                layoutId="activeTab"
                className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-400"
              />
            )}
          </button>
        </div>

        {/* Filters */}
        <div className="p-4 border-b border-blue-400/20 space-y-4">
          {/* Search and Date Range */}
          <div className="flex gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-blue-300/50" />
              <input
                type="text"
                placeholder="Search transactions..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-blue-500/10 border border-blue-400/20 rounded-xl text-white placeholder-blue-300/50 focus:outline-none focus:ring-2 focus:ring-blue-400/50"
              />
            </div>
            <div className="relative">
              <select
                value={dateRange}
                onChange={(e) => setDateRange(e.target.value)}
                className="appearance-none bg-blue-500/10 border border-blue-400/20 rounded-xl text-sm text-blue-200 pl-9 pr-8 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400/50"
              >
                <option value="all">All Time</option>
                <option value="today">Today</option>
                <option value="week">This Week</option>
                <option value="month">This Month</option>
                <option value="year">This Year</option>
              </select>
              <Calendar className="absolute left-2.5 top-1/2 transform -translate-y-1/2 h-4 w-4 text-blue-300/70" />
            </div>
          </div>

          {/* Amount Range and Category */}
          <div className="flex gap-4">
            <div className="flex items-center gap-2">
              <div className="relative">
                <DollarSign className="absolute left-2.5 top-1/2 transform -translate-y-1/2 h-4 w-4 text-blue-300/70" />
                <input
                  type="number"
                  placeholder="Min"
                  value={amountMin}
                  onChange={(e) => setAmountMin(e.target.value)}
                  className="pl-9 pr-4 py-2 bg-blue-500/10 border border-blue-400/20 rounded-xl text-sm text-white placeholder-blue-300/50 focus:outline-none focus:ring-2 focus:ring-blue-400/50 w-32"
                />
              </div>
              <span className="text-blue-200/60">to</span>
              <div className="relative">
                <DollarSign className="absolute left-2.5 top-1/2 transform -translate-y-1/2 h-4 w-4 text-blue-300/70" />
                <input
                  type="number"
                  placeholder="Max"
                  value={amountMax}
                  onChange={(e) => setAmountMax(e.target.value)}
                  className="pl-9 pr-4 py-2 bg-blue-500/10 border border-blue-400/20 rounded-xl text-sm text-white placeholder-blue-300/50 focus:outline-none focus:ring-2 focus:ring-blue-400/50 w-32"
                />
              </div>
            </div>
            <div className="relative flex-1">
              <Tag className="absolute left-2.5 top-1/2 transform -translate-y-1/2 h-4 w-4 text-blue-300/70" />
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full appearance-none bg-blue-500/10 border border-blue-400/20 rounded-xl text-sm text-blue-200 pl-9 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400/50"
              >
                <option value="all">All Categories</option>
                <option value="Salary">Salary</option>
                <option value="Groceries">Groceries</option>
                <option value="Shopping">Shopping</option>
                <option value="Transfer">Transfer</option>
                <option value="Bills">Bills</option>
              </select>
            </div>
          </div>
        </div>

        {/* Transactions Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-blue-200/60 uppercase">
              <tr>
                <th scope="col" className="px-6 py-3">Transaction ID</th>
                <th scope="col" className="px-6 py-3">Date & Time</th>
                <th scope="col" className="px-6 py-3">Amount</th>
                <th scope="col" className="px-6 py-3">Payee/Merchant</th>
                <th scope="col" className="px-6 py-3">Category</th>
                <th scope="col" className="px-6 py-3">Description</th>
                <th scope="col" className="px-6 py-3">Status</th>
              </tr>
            </thead>
            <tbody>
              {filteredTransactions.map((tx) => (
                <tr key={tx.id} className="border-b border-blue-400/10 hover:bg-blue-500/10 transition-colors">
                  <td className="px-6 py-4 font-medium">{tx.id}</td>
                  <td className="px-6 py-4">{new Date(tx.date).toLocaleString()}</td>
                  <td className={`px-6 py-4 font-semibold ${
                    tx.type === 'incoming' ? 'text-green-400' : 'text-red-400'
                  }`}>
                    {tx.type === 'incoming' ? '+' : '-'}{formatAccountBalance(tx.amount, account.currency)}
                  </td>
                  <td className="px-6 py-4">{tx.payee}</td>
                  <td className="px-6 py-4">
                    <span className="px-2 py-1 bg-blue-500/10 rounded-full text-xs">
                      {tx.category}
                    </span>
                  </td>
                  <td className="px-6 py-4">{tx.description}</td>
                  <td className="px-6 py-4">
                    <span className="flex items-center gap-1 text-green-400">
                      <Check className="h-4 w-4" />
                      {tx.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  );
};

export default AccountDetailsPage; 