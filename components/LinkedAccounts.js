import { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Eye, EyeOff, Check, Clock, AlertTriangle } from 'lucide-react';
import { getAllAccounts, ACCOUNT_STATUS, ACCOUNT_TYPES, formatAccountBalance } from '../lib/accountData';
import { useRouter } from 'next/navigation';
import AddAccountModal from './AddAccountModal';

const LinkedAccounts = () => {
  const [showBalances, setShowBalances] = useState(true);
  const [showAddAccountModal, setShowAddAccountModal] = useState(false);
  const accounts = getAllAccounts();
  const router = useRouter();

  const getStatusIcon = (status) => {
    switch (status) {
      case ACCOUNT_STATUS.VERIFIED:
        return <Check className="h-4 w-4 text-green-600" />;
      case ACCOUNT_STATUS.PENDING:
        return <Clock className="h-4 w-4 text-yellow-600" />;
      case ACCOUNT_STATUS.NEEDS_VERIFICATION:
        return <AlertTriangle className="h-4 w-4 text-red-600" />;
      default:
        return null;
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case ACCOUNT_STATUS.VERIFIED:
        return 'Verified';
      case ACCOUNT_STATUS.PENDING:
        return 'Pending';
      case ACCOUNT_STATUS.NEEDS_VERIFICATION:
        return 'Needs Verification';
      default:
        return '';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case ACCOUNT_STATUS.VERIFIED:
        return 'text-green-600';
      case ACCOUNT_STATUS.PENDING:
        return 'text-yellow-600';
      case ACCOUNT_STATUS.NEEDS_VERIFICATION:
        return 'text-red-600';
      default:
        return 'text-gray-500';
    }
  };

  return (
    <div className="w-full space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">
          Manage Linked Accounts
        </h2>
        <button 
          onClick={() => setShowAddAccountModal(true)}
          className="p-2 bg-[#002fa7] hover:bg-[#002fa7]/90 rounded-full text-white transition-colors duration-200 shadow-lg"
          aria-label="Add New Account"
        >
          <Plus className="h-5 w-5" />
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {accounts.map((account) => (
          <motion.div
            key={account.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-6 bg-white border border-gray-200 rounded-2xl hover:bg-gray-50 transition-colors duration-200 shadow-lg"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <img src={account.icon} alt={account.name} className="h-8 w-8 rounded-full object-cover" />
                <div>
                  <h3 className="font-semibold text-gray-900">{account.name}</h3>
                  <div className="flex items-center gap-2">
                    <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                      account.type === ACCOUNT_TYPES.BANK 
                        ? 'bg-[#002fa7]/10 text-[#002fa7]' 
                        : 'bg-green-100 text-green-600'
                    }`}>
                      {account.type}
                    </span>
                    <div className={`flex items-center gap-1 text-xs ${getStatusColor(account.status)}`}>
                      {getStatusIcon(account.status)}
                      <span>{getStatusText(account.status)}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <div>
                <div className="text-sm text-gray-500">
                  {account.type === ACCOUNT_TYPES.BANK ? 'Account' : 'ID'}
                </div>
                <div className="text-sm text-gray-700">
                  {account.type === ACCOUNT_TYPES.BANK ? account.accountNumber : account.accountId}
                </div>
              </div>

              <div>
                <div className="text-sm text-gray-500">Balance</div>
                <div className="text-lg font-bold text-gray-900">
                  {showBalances ? formatAccountBalance(account.balance, account.currency) : '••••'}
                </div>
              </div>

              <div className="flex items-center justify-between pt-2">
                <button 
                  onClick={() => router.push(`/accounts/${account.id}`)}
                  className="text-sm text-[#002fa7] hover:text-[#002fa7]/80 transition-colors"
                >
                  View Details
                </button>
                <button className="text-sm text-red-600 hover:text-red-700 transition-colors">
                  Unlink
                </button>
              </div>
            </div>
          </motion.div>
        ))}

        {/* Add New Account Card */}
        <motion.div
          onClick={() => setShowAddAccountModal(true)}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-6 bg-white border border-[#002fa7]/20 border-dashed rounded-2xl hover:bg-[#002fa7]/5 transition-colors duration-200 flex flex-col items-center justify-center gap-3 cursor-pointer min-h-[250px] shadow-lg"
        >
          <div className="h-12 w-12 rounded-full bg-[#002fa7]/10 flex items-center justify-center">
            <Plus className="h-6 w-6 text-[#002fa7]" />
          </div>
          <div className="text-center">
            <h3 className="font-medium text-gray-900">Add Account/E-Wallet</h3>
            <p className="text-sm text-gray-500 mt-1">Connect a new account or e-wallet</p>
          </div>
        </motion.div>
      </div>

      {/* Add Account Modal */}
      <AddAccountModal
        isOpen={showAddAccountModal}
        onClose={() => setShowAddAccountModal(false)}
      />
    </div>
  );
};

export default LinkedAccounts; 