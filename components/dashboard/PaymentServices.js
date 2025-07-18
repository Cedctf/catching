import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  CreditCard, 
  Wallet, 
  QrCode, 
  Link,
  Unlink,
  Plus,
  CheckCircle,
  AlertCircle,
  Clock,
  TrendingUp,
  Download,
  Share2,
  Copy,
  Eye,
  RefreshCw,
  Activity,
  DollarSign,
  Calendar,
  Filter,
  ArrowUpRight,
  ArrowDownLeft,
  X
} from 'lucide-react';

export default function PaymentServices({ businessData, onDataUpdate }) {
  const [activeSection, setActiveSection] = useState('overview');
  const [showQRModal, setShowQRModal] = useState(false);
  const [showLinkModal, setShowLinkModal] = useState(false);
  const [selectedService, setSelectedService] = useState(null);

  // Mock data for connected services
  const connectedServices = [
    {
      id: 'duitnow',
      name: 'DuitNow',
      type: 'bank_transfer',
      status: 'connected',
      logo: '/logos/DuitNowLogo-1.jpg',
      accountNumber: '1234567890',
      bank: 'Maybank',
      monthlyVolume: 75000,
      connectedDate: '2024-01-15'
    },
    {
      id: 'grabpay',
      name: 'GrabPay',
      type: 'e_wallet',
      status: 'connected',
      logo: '/logos/grabpay.png',
      accountNumber: 'grab_merchant_123',
      monthlyVolume: 25000,
      connectedDate: '2024-01-20'
    },
    {
      id: 'boost',
      name: 'Boost',
      type: 'e_wallet',
      status: 'pending',
      logo: '/logos/boost.png',
      accountNumber: 'boost_pending',
      monthlyVolume: 0,
      connectedDate: null
    },
    {
      id: 'tng',
      name: 'Touch \'n Go eWallet',
      type: 'e_wallet',
      status: 'disconnected',
      logo: '/logos/tng.webp',
      accountNumber: null,
      monthlyVolume: 0,
      connectedDate: null
    }
  ];

  const availableServices = [
    { id: 'fpx', name: 'FPX', type: 'bank_transfer', logo: '/logos/bnm.png' },
    { id: 'maybank', name: 'Maybank QRPay', type: 'qr_payment', logo: '/logos/maybank.jpeg' },
    { id: 'cimb', name: 'CIMB Pay', type: 'bank_transfer', logo: '/logos/cimb.jpeg' },
    { id: 'public_bank', name: 'Public Bank', type: 'bank_transfer', logo: '/logos/public.png' },
    { id: 'hsbc', name: 'HSBC Pay', type: 'bank_transfer', logo: '/logos/hsbc.png' },
    { id: 'alliance', name: 'Alliance Bank', type: 'bank_transfer', logo: '/logos/alliance.jpeg' }
  ];

  const recentTransactions = [
    {
      id: 'txn001',
      type: 'payment_received',
      amount: 150.50,
      service: 'DuitNow',
      customer: 'Ahmad Ibrahim',
      date: '2024-01-20T14:30:00Z',
      status: 'completed'
    },
    {
      id: 'txn002',
      type: 'payment_received',
      amount: 89.90,
      service: 'GrabPay',
      customer: 'Siti Nurhaliza',
      date: '2024-01-20T13:15:00Z',
      status: 'completed'
    },
    {
      id: 'txn003',
      type: 'payment_received',
      amount: 299.00,
      service: 'DuitNow',
      customer: 'Lim Wei Ming',
      date: '2024-01-20T11:45:00Z',
      status: 'pending'
    },
    {
      id: 'txn004',
      type: 'payment_received',
      amount: 45.00,
      service: 'GrabPay',
      customer: 'Rajesh Kumar',
      date: '2024-01-20T10:20:00Z',
      status: 'completed'
    }
  ];

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-MY', {
      style: 'currency',
      currency: 'MYR',
      minimumFractionDigits: 2
    }).format(amount);
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

  const getStatusColor = (status) => {
    switch (status) {
      case 'connected': return 'bg-green-100 text-green-600';
      case 'pending': return 'bg-yellow-100 text-yellow-600';
      case 'disconnected': return 'bg-red-100 text-red-600';
      default: return 'bg-gray-100 text-gray-600';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'connected': return <CheckCircle className="h-4 w-4" />;
      case 'pending': return <Clock className="h-4 w-4" />;
      case 'disconnected': return <AlertCircle className="h-4 w-4" />;
      default: return <AlertCircle className="h-4 w-4" />;
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: "easeOut" }
    }
  };

  const handleLinkService = (service) => {
    setSelectedService(service);
    setShowLinkModal(true);
  };

  const handleShareQR = async () => {
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

  const handleDownloadQR = () => {
    const link = document.createElement('a');
    link.href = '/duitnowqr_whole_exported.jpg';
    link.download = 'duitnow-qr-code.jpg';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const sections = [
    { id: 'overview', label: 'Overview', icon: Activity },
    { id: 'connected', label: 'Connected Services', icon: Link },
    { id: 'qr_codes', label: 'QR Codes', icon: QrCode },
    { id: 'transactions', label: 'Transaction Logs', icon: DollarSign }
  ];

  return (
    <div className="space-y-6">
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
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <motion.div
              variants={cardVariants}
              initial="hidden"
              animate="visible"
              className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
            >
              <div className="flex items-center gap-4">
                <div className="p-3 bg-green-100 rounded-lg">
                  <CheckCircle className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Connected Services</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {connectedServices.filter(s => s.status === 'connected').length}
                  </p>
                </div>
              </div>
            </motion.div>

            <motion.div
              variants={cardVariants}
              initial="hidden"
              animate="visible"
              className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
            >
              <div className="flex items-center gap-4">
                <div className="p-3 bg-blue-100 rounded-lg">
                  <TrendingUp className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Monthly Volume</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {formatCurrency(connectedServices.reduce((sum, s) => sum + s.monthlyVolume, 0))}
                  </p>
                </div>
              </div>
            </motion.div>

            <motion.div
              variants={cardVariants}
              initial="hidden"
              animate="visible"
              className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
            >
              <div className="flex items-center gap-4">
                <div className="p-3 bg-purple-100 rounded-lg">
                  <Activity className="h-6 w-6 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Today's Transactions</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {recentTransactions.filter(t => t.status === 'completed').length}
                  </p>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Quick Actions */}
          <motion.div
            variants={cardVariants}
            initial="hidden"
            animate="visible"
            className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
          >
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <button
                onClick={() => setShowQRModal(true)}
                className="flex flex-col items-center gap-2 p-4 bg-[#002fa7]/10 rounded-lg hover:bg-[#002fa7]/20 transition-colors"
              >
                <QrCode className="h-8 w-8 text-[#002fa7]" />
                <span className="text-sm font-medium text-gray-900">View QR Code</span>
              </button>
              <button
                onClick={() => setActiveSection('connected')}
                className="flex flex-col items-center gap-2 p-4 bg-green-100 rounded-lg hover:bg-green-200 transition-colors"
              >
                <Plus className="h-8 w-8 text-green-600" />
                <span className="text-sm font-medium text-gray-900">Add Service</span>
              </button>
              <button
                onClick={() => setActiveSection('transactions')}
                className="flex flex-col items-center gap-2 p-4 bg-blue-100 rounded-lg hover:bg-blue-200 transition-colors"
              >
                <Activity className="h-8 w-8 text-blue-600" />
                <span className="text-sm font-medium text-gray-900">View Transactions</span>
              </button>
              <button className="flex flex-col items-center gap-2 p-4 bg-purple-100 rounded-lg hover:bg-purple-200 transition-colors">
                <RefreshCw className="h-8 w-8 text-purple-600" />
                <span className="text-sm font-medium text-gray-900">Sync All</span>
              </button>
            </div>
          </motion.div>
        </div>
      )}

      {/* Connected Services Section */}
      {activeSection === 'connected' && (
        <div className="space-y-6">
          {/* Connected Services */}
          <motion.div
            variants={cardVariants}
            initial="hidden"
            animate="visible"
            className="bg-white rounded-xl shadow-sm border border-gray-200"
          >
            <div className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-6">Connected Payment Services</h3>
              <div className="space-y-4">
                {connectedServices.map((service) => (
                  <div key={service.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 flex items-center justify-center">
                        <img 
                          src={service.logo} 
                          alt={service.name}
                          className="w-10 h-10 object-contain"
                        />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{service.name}</p>
                        <p className="text-sm text-gray-500">
                          {service.accountNumber || 'Not configured'}
                        </p>
                        {service.monthlyVolume > 0 && (
                          <p className="text-sm text-gray-500">
                            Monthly Volume: {formatCurrency(service.monthlyVolume)}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(service.status)}`}>
                        {getStatusIcon(service.status)}
                        <span className="capitalize">{service.status}</span>
                      </div>
                      {service.status === 'connected' && (
                        <button className="text-red-600 hover:text-red-700 p-1">
                          <Unlink className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Available Services */}
          <motion.div
            variants={cardVariants}
            initial="hidden"
            animate="visible"
            className="bg-white rounded-xl shadow-sm border border-gray-200"
          >
            <div className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-6">Available Services</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {availableServices.map((service) => (
                  <div key={service.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 flex items-center justify-center">
                        <img 
                          src={service.logo} 
                          alt={service.name}
                          className="w-8 h-8 object-contain"
                        />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{service.name}</p>
                        <p className="text-sm text-gray-500 capitalize">{service.type.replace('_', ' ')}</p>
                      </div>
                    </div>
                    <button
                      onClick={() => handleLinkService(service)}
                      className="text-[#002fa7] hover:text-[#002fa7]/80 p-1"
                    >
                      <Plus className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      )}

      {/* QR Codes Section */}
      {activeSection === 'qr_codes' && (
        <div className="space-y-6">
          <motion.div
            variants={cardVariants}
            initial="hidden"
            animate="visible"
            className="bg-white rounded-xl shadow-sm border border-gray-200"
          >
            <div className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-6">DuitNow QR Code</h3>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="flex flex-col items-center space-y-4">
                  <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
                    <img 
                      src="/duitnowqr_whole_exported.jpg" 
                      alt="DuitNow QR Code" 
                      className="w-64 h-64 object-contain"
                    />
                  </div>
                  <div className="flex gap-3">
                    <button
                      onClick={handleShareQR}
                      className="flex items-center gap-2 bg-[#002fa7] hover:bg-[#002fa7]/90 text-white px-4 py-2 rounded-lg transition-colors"
                    >
                      <Share2 className="h-4 w-4" />
                      Share
                    </button>
                    <button
                      onClick={handleDownloadQR}
                      className="flex items-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg transition-colors"
                    >
                      <Download className="h-4 w-4" />
                      Download
                    </button>
                  </div>
                </div>
                <div className="space-y-6">
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-3">QR Code Information</h4>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Business Name:</span>
                        <span className="font-medium">Tech Solutions Sdn Bhd</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Account Number:</span>
                        <span className="font-medium">1234567890</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Bank:</span>
                        <span className="font-medium">Maybank</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">QR Type:</span>
                        <span className="font-medium">Static QR</span>
                      </div>
                    </div>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-3">Usage Instructions</h4>
                    <ul className="text-sm text-gray-600 space-y-2">
                      <li>• Display this QR code for customers to scan</li>
                      <li>• Compatible with all Malaysian banking apps</li>
                      <li>• No transaction fees for DuitNow payments</li>
                      <li>• Payments are processed instantly</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}

      {/* Transaction Logs Section */}
      {activeSection === 'transactions' && (
        <div className="space-y-6">
          <motion.div
            variants={cardVariants}
            initial="hidden"
            animate="visible"
            className="bg-white rounded-xl shadow-sm border border-gray-200"
          >
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900">Recent Transactions</h3>
                <button className="flex items-center gap-2 text-[#002fa7] hover:text-[#002fa7]/80 font-medium">
                  <Filter className="h-4 w-4" />
                  Filter
                </button>
              </div>
              <div className="space-y-4">
                {recentTransactions.map((transaction) => (
                  <div key={transaction.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-4">
                      <div className={`p-2 rounded-full ${
                        transaction.status === 'completed' ? 'bg-green-100' : 'bg-yellow-100'
                      }`}>
                        {transaction.status === 'completed' ? (
                          <ArrowDownLeft className="h-4 w-4 text-green-600" />
                        ) : (
                          <Clock className="h-4 w-4 text-yellow-600" />
                        )}
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">
                          Payment from {transaction.customer}
                        </p>
                        <p className="text-sm text-gray-500">
                          {formatDate(transaction.date)} • {transaction.service}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-gray-900">
                        {formatCurrency(transaction.amount)}
                      </p>
                      <p className={`text-xs capitalize ${
                        transaction.status === 'completed' ? 'text-green-600' : 'text-yellow-600'
                      }`}>
                        {transaction.status}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      )}

      {/* QR Code Modal */}
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
                  onClick={handleShareQR}
                  className="flex items-center gap-2 bg-[#002fa7] hover:bg-[#002fa7]/90 text-white px-4 py-2 rounded-lg transition-colors"
                >
                  <Share2 className="h-4 w-4" />
                  Share
                </button>
                <button
                  onClick={handleDownloadQR}
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

      {/* Link Service Modal */}
      {showLinkModal && selectedService && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            className="bg-white rounded-xl shadow-xl max-w-md w-full p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-gray-900">Link {selectedService.name}</h3>
              <button
                onClick={() => setShowLinkModal(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="h-5 w-5 text-gray-500" />
              </button>
            </div>
            <div className="space-y-4">
              <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                <div className="text-3xl">{selectedService.icon}</div>
                <div>
                  <p className="font-medium text-gray-900">{selectedService.name}</p>
                  <p className="text-sm text-gray-500 capitalize">{selectedService.type.replace('_', ' ')}</p>
                </div>
              </div>
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Account Number/ID
                  </label>
                  <input
                    type="text"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#002fa7] focus:border-transparent"
                    placeholder="Enter your account details"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Display Name
                  </label>
                  <input
                    type="text"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#002fa7] focus:border-transparent"
                    placeholder="How this should appear to customers"
                  />
                </div>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowLinkModal(false)}
                  className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => setShowLinkModal(false)}
                  className="flex-1 bg-[#002fa7] hover:bg-[#002fa7]/90 text-white px-4 py-2 rounded-lg transition-colors"
                >
                  Link Service
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
} 