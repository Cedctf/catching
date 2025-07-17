import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { motion } from 'framer-motion';
import { CheckCircle, Building, CreditCard, Calendar, ArrowRight } from 'lucide-react';

const ConfirmationPage = () => {
  const router = useRouter();

  const accountData = {
    bankName: 'Public Bank',
    accountType: 'Savings Account',
    accountNumber: '•••• 8888',
    balance: 'MYR 25,420.65',
    lastSync: new Date().toLocaleString('en-MY'),
    status: 'Active'
  };

  useEffect(() => {
    const storeTransaction = async () => {
      try {
        const transaction = {
          payer_identity_token: '',
          business_identity_token: null,
          transaction_type: 'payment',
          amount: 0.00,
          transaction_date: new Date().toISOString().split('T')[0],
          payment_method: 'QR',
          transaction_status: 'completed'
        };

        const response = await fetch('/api/transactions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(transaction),
        });

        if (!response.ok) {
          console.error('Failed to store transaction');
        }
      } catch (error) {
        console.error('Error storing transaction:', error);
      }
    };

    const init = async () => {
      await storeTransaction();
      const timer = setTimeout(() => {
        router.push('/accounts');
      }, 5000);
      return () => clearTimeout(timer);
    };

    init();
  }, [router]);

  const cardVariants = {
    hidden: { opacity: 0, y: 50, rotateX: 15 },
    visible: {
      opacity: 1, y: 0, rotateX: 0,
      transition: { duration: 0.8, ease: [0.25, 0.4, 0.25, 1] }
    }
  };

  const successVariants = {
    hidden: { scale: 0 },
    visible: { 
      scale: 1,
      transition: { 
        type: "spring",
        stiffness: 200,
        damping: 20
      }
    }
  };

  return (
    <div className="relative w-full max-w-7xl mx-auto px-6 py-8 space-y-6">
      {/* Success Animation */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center space-y-4"
      >
        <motion.div
          variants={successVariants}
          initial="hidden"
          animate="visible"
          className="w-20 h-20 mx-auto bg-green-100 rounded-full flex items-center justify-center"
        >
          <CheckCircle className="h-12 w-12 text-green-600" />
        </motion.div>
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Account Linked Successfully!</h1>
          <p className="text-gray-600">Your bank account has been securely connected</p>
        </div>
      </motion.div>

      {/* Account Details */}
      <motion.div
        variants={cardVariants}
        initial="hidden"
        animate="visible"
        className="max-w-md mx-auto bg-white border border-gray-200 rounded-3xl shadow-lg p-6"
      >
        <div className="space-y-6">
          <div className="text-center">
            <div className="w-16 h-16 mx-auto bg-white rounded-2xl shadow-lg flex items-center justify-center mb-4">
              <img
                src="/logos/public.png" 
                alt="Public Bank" 
                className="h-10 w-auto"
              />
            </div>
            <h2 className="text-xl font-semibold text-gray-900">{accountData.bankName}</h2>
            <p className="text-gray-600">{accountData.accountType}</p>
          </div>

          <div className="space-y-4">
            <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl">
              <div className="p-2 bg-[#002fa7]/10 rounded-lg">
                <CreditCard className="h-5 w-5 text-[#002fa7]" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Account Number</p>
                <p className="font-mono text-gray-900">{accountData.accountNumber}</p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl">
              <div className="p-2 bg-green-100 rounded-lg">
                <Building className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Current Balance</p>
                <p className="font-semibold text-gray-900">{accountData.balance}</p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Calendar className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Last Sync</p>
                <p className="text-sm text-gray-900">{accountData.lastSync}</p>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-center gap-2 pt-4 border-t border-gray-200">
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            <span className="text-sm text-gray-600">
              Status: <span className="font-medium text-green-600">{accountData.status}</span>
            </span>
          </div>
        </div>
      </motion.div>

      {/* Redirect Notice */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2 }}
        className="text-center space-y-4"
      >
        <p className="text-gray-600">Redirecting to your accounts page...</p>
        <div className="flex items-center justify-center gap-3">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            className="w-4 h-4 border-2 border-[#002fa7] border-t-transparent rounded-full"
          />
          <span className="text-sm text-gray-500">Please wait...</span>
        </div>
      </motion.div>
    </div>
  );
};

export default ConfirmationPage; 