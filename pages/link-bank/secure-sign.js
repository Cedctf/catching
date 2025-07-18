import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { motion } from 'framer-motion';
import { Smartphone, CheckCircle } from 'lucide-react';

const SecureSignPage = () => {
  const router = useRouter();
  const [countdown, setCountdown] = useState(10);
  const [approved, setApproved] = useState(false);

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      setApproved(true);
      const redirectTimer = setTimeout(() => {
        router.push('/link-bank/confirmation');
      }, 1500);
      return () => clearTimeout(redirectTimer);
    }
  }, [countdown, router]);

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
    <div className="relative w-full max-w-7xl mx-auto px-6 py-8">
      <div className="flex items-center justify-center min-h-[60vh]">
        <motion.div
          variants={cardVariants}
          initial="hidden"
          animate="visible"
          className="max-w-md mx-auto bg-white border border-gray-200 rounded-3xl shadow-lg p-8 text-center space-y-8"
        >
          {/* Icon */}
          <motion.div
            variants={successVariants}
            initial="hidden"
            animate="visible"
            className="w-20 h-20 mx-auto bg-gray-100 rounded-full flex items-center justify-center"
          >
            {approved ? (
              <CheckCircle className="h-12 w-12 text-green-600" />
            ) : (
              <Smartphone className="h-12 w-12 text-[#002fa7]" />
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
            <div className="space-y-4">
              <div className="w-20 h-20 mx-auto bg-[#002fa7]/10 rounded-full flex items-center justify-center">
                <span className="text-2xl font-bold text-[#002fa7]">{countdown}</span>
              </div>
              <p className="text-sm text-gray-500">
                Simulating approval process...
              </p>
            </div>
          )}

          {/* Success State */}
          {approved && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-4"
            >
              <div className="p-4 bg-green-100 rounded-xl">
                <p className="text-green-700 font-medium">Connection Approved</p>
                <p className="text-sm text-green-600">Redirecting to confirmation...</p>
              </div>
              <div className="flex items-center justify-center gap-3">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  className="w-4 h-4 border-2 border-green-600 border-t-transparent rounded-full"
                />
                <span className="text-sm text-gray-500">Please wait...</span>
              </div>
            </motion.div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default SecureSignPage; 