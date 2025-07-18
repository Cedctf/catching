import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, X, ChevronDown, Building, Plus } from 'lucide-react';
import { accountsData, ACCOUNT_TYPES } from '../lib/accountData';
import { useRouter } from 'next/router';

// All available banks and e-wallets that can be linked
const availableBanks = [
  { id: 'maybank', name: 'Maybank', type: ACCOUNT_TYPES.BANK, icon: '/logos/maybank.png' },
  { id: 'cimb', name: 'CIMB Bank', type: ACCOUNT_TYPES.BANK, icon: '/logos/cimb.jpeg' },
  { id: 'hsbc', name: 'HSBC Bank', type: ACCOUNT_TYPES.BANK, icon: '/logos/hsbc.png' },
  { id: 'rhb', name: 'RHB Bank', type: ACCOUNT_TYPES.BANK, icon: '/logos/rhb.png' },
  { id: 'agro', name: 'Agrobank', type: ACCOUNT_TYPES.BANK, icon: '/logos/agro.png' },
  { id: 'affin', name: 'Affin Bank', type: ACCOUNT_TYPES.BANK, icon: '/logos/affin.png' },
  { id: 'ambank', name: 'AmBank', type: ACCOUNT_TYPES.BANK, icon: '/logos/ambank.png' },
  { id: 'ocbc', name: 'OCBC Bank', type: ACCOUNT_TYPES.BANK, icon: '/logos/ocbc.png' },
  { id: 'citi', name: 'Citibank', type: ACCOUNT_TYPES.BANK, icon: '/logos/citi.png' },
  { id: 'bsn', name: 'Bank Simpanan Nasional', type: ACCOUNT_TYPES.BANK, icon: '/logos/bsn.png' },
  { id: 'bankmuamalat', name: 'Bank Muamalat', type: ACCOUNT_TYPES.BANK, icon: '/logos/bankmuamalat.png' },
  { id: 'bankislam', name: 'Bank Islam', type: ACCOUNT_TYPES.BANK, icon: '/logos/bankislam.jpeg' },
  { id: 'alliance', name: 'Alliance Bank', type: ACCOUNT_TYPES.BANK, icon: '/logos/alliance.jpeg' },
  { id: 'hongleong', name: 'Hong Leong Bank', type: ACCOUNT_TYPES.BANK, icon: '/logos/hongleong.jpeg' },
  { id: 'public', name: 'Public Bank', type: ACCOUNT_TYPES.BANK, icon: '/logos/public.png' }
];

const availableEwallets = [
  { id: 'tng', name: 'Touch \'n Go', type: ACCOUNT_TYPES.EWALLET, icon: '/logos/tng.png' },
  { id: 'boost', name: 'Boost', type: ACCOUNT_TYPES.EWALLET, icon: '/logos/boost.png' },
  { id: 'grabpay', name: 'GrabPay', type: ACCOUNT_TYPES.EWALLET, icon: '/logos/grabpay.png' }
];

const AddAccountModal = ({ isOpen, onClose }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedBank, setSelectedBank] = useState(null);
  const [consentChecked, setConsentChecked] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const router = useRouter();

  // Filter accounts based on search term
  const filteredAccounts = [...availableBanks, ...availableEwallets].filter(account =>
    account.name.toLowerCase().includes(searchTerm.toLowerCase())
  ).sort((a, b) => {
    // Sort by type (banks first) and then alphabetically
    if (a.type !== b.type) {
      return a.type === ACCOUNT_TYPES.BANK ? -1 : 1;
    }
    return a.name.localeCompare(b.name);
  });

  // Handle bank selection
  const handleBankSelect = (bank) => {
    setSelectedBank(bank);
    setSearchTerm(bank.name);
    setShowDropdown(false);
  };

  // Handle search input
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setShowDropdown(true);
    if (selectedBank && selectedBank.name !== e.target.value) {
      setSelectedBank(null);
    }
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!selectedBank || !consentChecked) return;
    
    // Redirect to the bank linking flow
    if (selectedBank.id === 'public') {
      router.push('/link-bank/redirect');
    } else {
      // For other banks, we'll implement their flows later
      console.log('Linking bank:', selectedBank);
    }
    onClose();
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (!e.target.closest('.search-container')) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Reset state when modal closes
  useEffect(() => {
    if (!isOpen) {
      setSearchTerm('');
      setSelectedBank(null);
      setConsentChecked(false);
      setShowDropdown(false);
    }
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            className="bg-white border border-gray-200 rounded-3xl w-full max-w-lg overflow-hidden shadow-xl"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className="text-xl font-bold text-gray-900">Link a New Bank Account</h2>
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-100 rounded-xl transition-colors"
              >
                <X className="h-5 w-5 text-gray-500" />
              </button>
            </div>

            {/* Content */}
            <div className="p-6 space-y-6">
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Search Input */}
                <div className="space-y-2">
                  <label className="text-sm text-gray-600">Search Bank/E-Wallet</label>
                  <div className="relative search-container">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                      type="text"
                      value={searchTerm}
                      onChange={handleSearchChange}
                      onFocus={() => setShowDropdown(true)}
                      placeholder="Search for your bank or e-wallet"
                      className="w-full pl-10 pr-12 py-3 bg-white border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#002fa7]/50"
                    />
                    <ChevronDown 
                      className={`absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 transition-transform duration-200 ${showDropdown ? 'rotate-180' : ''}`}
                    />

                    {/* Selected Bank Preview */}
                    {selectedBank && !showDropdown && (
                      <div className="absolute inset-0 flex items-center px-3 pointer-events-none bg-white">
                        <div className="flex items-center gap-3 w-full">
                          <div className="w-8 h-8 flex-shrink-0">
                            <img
                              src={selectedBank.icon}
                              alt={selectedBank.name}
                              className="w-full h-full rounded-full object-cover"
                            />
                          </div>
                          <span className="text-gray-900 flex-1 truncate">{selectedBank.name}</span>
                        </div>
                      </div>
                    )}

                    {/* Dropdown */}
                    <AnimatePresence>
                      {showDropdown && (filteredAccounts.length > 0 || searchTerm) && (
                        <motion.div
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-xl shadow-lg overflow-hidden z-50 max-h-[300px] overflow-y-auto"
                        >
                          {filteredAccounts.length > 0 ? (
                            <>
                              {/* Banks Section */}
                              {filteredAccounts.filter(acc => acc.type === ACCOUNT_TYPES.BANK).length > 0 && (
                                <div className="px-3 py-2 text-xs font-medium text-gray-500 bg-[#002fa7]/[0.03]">Banks</div>
                              )}
                              {filteredAccounts
                                .filter(acc => acc.type === ACCOUNT_TYPES.BANK)
                                .map((bank) => (
                                  <button
                                    key={bank.id}
                                    type="button"
                                    onClick={() => handleBankSelect(bank)}
                                    className="w-full flex items-center gap-3 px-3 py-2 hover:bg-[#002fa7]/[0.03] transition-colors"
                                  >
                                    <div className="w-8 h-8 flex-shrink-0">
                                      <img
                                        src={bank.icon}
                                        alt={bank.name}
                                        className="w-full h-full rounded-full object-cover"
                                      />
                                    </div>
                                    <div className="flex-1 text-left min-w-0">
                                      <div className="text-gray-900 font-medium truncate">{bank.name}</div>
                                      <div className="text-xs text-gray-500">Bank</div>
                                    </div>
                                  </button>
                                ))}

                              {/* E-Wallets Section */}
                              {filteredAccounts.filter(acc => acc.type === ACCOUNT_TYPES.EWALLET).length > 0 && (
                                <div className="px-3 py-2 text-xs font-medium text-gray-500 bg-[#002fa7]/[0.03]">E-Wallets</div>
                              )}
                              {filteredAccounts
                                .filter(acc => acc.type === ACCOUNT_TYPES.EWALLET)
                                .map((wallet) => (
                                  <button
                                    key={wallet.id}
                                    type="button"
                                    onClick={() => handleBankSelect(wallet)}
                                    className="w-full flex items-center gap-3 px-3 py-2 hover:bg-[#002fa7]/[0.03] transition-colors"
                                  >
                                    <div className="w-8 h-8 flex-shrink-0">
                                      <img
                                        src={wallet.icon}
                                        alt={wallet.name}
                                        className="w-full h-full rounded-full object-cover"
                                      />
                                    </div>
                                    <div className="flex-1 text-left min-w-0">
                                      <div className="text-gray-900 font-medium truncate">{wallet.name}</div>
                                      <div className="text-xs text-gray-500">E-Wallet</div>
                                    </div>
                                  </button>
                                ))}

                              {/* Create Business Account Box */}
                              <button
                                onClick={() => router.push('/business/create')}
                                className="group w-full flex items-center gap-3 px-3 py-2 border-2 border-dashed border-[#002fa7]/20 hover:border-[#002fa7] rounded-xl transition-colors"
                              >
                                <div className="w-8 h-8 flex-shrink-0 bg-[#002fa7]/5 group-hover:bg-[#002fa7]/10 rounded-full flex items-center justify-center transition-colors">
                                  <Plus className="h-5 w-5 text-[#002fa7]" />
                                </div>
                                <div className="flex-1 text-left min-w-0">
                                  <div className="text-gray-900 font-medium truncate">Create Business Account</div>
                                  <div className="text-xs text-gray-500">Link a new business to your identity token</div>
                                </div>
                              </button>
                            </>
                          ) : (
                            <div className="p-3 text-gray-500 text-center">
                              No results found
                            </div>
                          )}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>

                {/* Consent Checkbox */}
                <label className="flex items-start gap-3 cursor-pointer group">
                  <div className="relative flex items-center">
                    <input
                      type="checkbox"
                      checked={consentChecked}
                      onChange={(e) => setConsentChecked(e.target.checked)}
                      className="w-5 h-5 border-2 border-gray-200 rounded bg-white checked:bg-[#002fa7] checked:border-[#002fa7] focus:outline-none focus:ring-2 focus:ring-[#002fa7]/50 transition-colors"
                    />
                  </div>
                  <span className="text-sm text-gray-600 group-hover:text-gray-900 transition-colors">
                    I agree to share my banking data as per Open Banking guidelines and understand that this service is governed by the terms and conditions of both the bank and this platform.
                  </span>
                </label>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={!selectedBank || !consentChecked}
                  className="w-full py-3 px-4 bg-[#002fa7] hover:bg-[#002fa7]/90 disabled:bg-gray-200 disabled:cursor-not-allowed rounded-xl text-white font-medium transition-colors duration-200"
                >
                  Link Bank Account
                </button>
              </form>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default AddAccountModal; 