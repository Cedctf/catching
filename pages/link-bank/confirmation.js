import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { motion } from 'framer-motion';
import { Check, Building, CreditCard, Calendar, ArrowRight } from 'lucide-react';
import Layout from '../../components/Layout';

const ConfirmationPage = () => {
  const router = useRouter();

  // Mock account data that would normally come from the bank's API
  const accountData = {
    bankName: 'Public Bank',
    accountType: 'Savings Account',
    accountNumber: '•••• 8888',
    balance: 'MYR 25,420.65',
    lastSync: new Date().toLocaleString('en-MY'),
    status: 'Active'
  };

  useEffect(() => {
    // Store the transaction data
    const storeTransaction = async () => {
      try {
        const transaction = {
          payer_identity_token: '',  // Left blank as requested
          business_identity_token: null,
          transaction_type: 'payment',
          amount: 0.00, // No amount for account linking
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

    // Store transaction and redirect after delay
    const init = async () => {
      await storeTransaction();
      const timer = setTimeout(() => {
        router.push('/accounts');
      }, 5000);
      return () => clearTimeout(timer);
    };

    init();
  }, [router]);

  return (
    <Layout>
      <div className="min-h-screen w-full flex flex-col items-center px-4">
        <div className="relative z-20 max-w-lg w-full mx-auto pt-20 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-8"
          >
            {/* Success Icon */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center"
            >
              <Check className="h-8 w-8 text-green-600" />
            </motion.div>

            {/* Success Message */}
            <div className="space-y-2">
              <h1 className="text-2xl font-bold text-gray-900">
                Account Successfully Linked!
              </h1>
              <p className="text-gray-600">
                Your Public Bank account has been successfully connected to Catching.
              </p>
            </div>

            {/* Account Details Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white border border-gray-200 rounded-2xl p-6 text-left shadow-sm"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <img
                      src="/logos/public.png"
                      alt="Public Bank"
                      className="h-10 w-10 rounded-lg"
                    />
                    <div>
                      <h3 className="font-medium text-gray-900">{accountData.bankName}</h3>
                      <p className="text-sm text-gray-500">{accountData.accountType}</p>
                    </div>
                  </div>
                  <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full">
                    {accountData.status}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-4 pt-2">
                  <div>
                    <p className="text-sm text-gray-500">Account Number</p>
                    <p className="text-gray-900 font-medium">{accountData.accountNumber}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Current Balance</p>
                    <p className="text-gray-900 font-medium">{accountData.balance}</p>
                  </div>
                </div>

                <div className="pt-2">
                  <p className="text-sm text-gray-500">Last Synchronized</p>
                  <p className="text-gray-900">{accountData.lastSync}</p>
                </div>
              </div>
            </motion.div>

            <p className="text-sm text-gray-500">
              You will be redirected to your accounts page in a few seconds...
            </p>
          </motion.div>
        </div>
      </div>
    </Layout>
  );
};

export default ConfirmationPage; 