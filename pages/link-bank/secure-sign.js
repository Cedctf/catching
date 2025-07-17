import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { motion } from 'framer-motion';
import { Smartphone, Check } from 'lucide-react';
import Layout from '../../components/Layout';

const SecureSignPage = () => {
  const router = useRouter();
  const [countdown, setCountdown] = useState(10);
  const [approved, setApproved] = useState(false);

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      // Simulate approval after countdown
      setApproved(true);
      // Wait a moment to show the success state before redirecting
      const redirectTimer = setTimeout(() => {
        router.push('/link-bank/confirmation');
      }, 1500);
      return () => clearTimeout(redirectTimer);
    }
  }, [countdown, router]);

  return (
    <Layout>
      <div className="min-h-screen w-full flex flex-col items-center px-4">
        <div className="relative z-20 max-w-lg w-full mx-auto pt-20 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-8"
          >
            {/* Icon */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center"
            >
              {approved ? (
                <Check className="h-8 w-8 text-green-600" />
              ) : (
                <Smartphone className="h-8 w-8 text-[#002fa7]" />
              )}
            </motion.div>

            {/* Message */}
            <div className="space-y-2">
              <h1 className="text-2xl font-bold text-gray-900">
                {approved ? 'Approval Confirmed!' : 'Waiting for Approval'}
              </h1>
              <p className="text-gray-600">
                {approved
                  ? 'Your bank account connection has been approved.'
                  : 'Please approve the connection request in your Public Bank mobile app.'}
              </p>
            </div>

            {/* Timer */}
            {!approved && (
              <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
                <div className="space-y-4">
                  <div className="flex items-center justify-center gap-2">
                    <div className="w-12 h-12 rounded-lg bg-[#002fa7] text-white flex items-center justify-center text-2xl font-bold">
                      {countdown}
                    </div>
                    <span className="text-gray-600">seconds remaining</span>
                  </div>
                  <p className="text-sm text-gray-500">
                    Open your Public Bank mobile app and approve the connection request.
                  </p>
                </div>
              </div>
            )}

            {/* Instructions */}
            {!approved && (
              <div className="text-sm text-gray-500 space-y-2">
                <p>Haven't received the request?</p>
                <ul className="space-y-1">
                  <li>1. Make sure you have the latest Public Bank app installed</li>
                  <li>2. Check your notifications</li>
                  <li>3. Try refreshing the app</li>
                </ul>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </Layout>
  );
};

export default SecureSignPage; 