import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { motion } from 'framer-motion';

const RedirectPage = () => {
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      router.push('/link-bank/pbe-login');
    }, 2000);

    return () => clearTimeout(timer);
  }, [router]);

  return (
    <div className="relative w-full max-w-7xl mx-auto px-6 py-8">
      <div className="flex items-center justify-center min-h-[60vh]">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center space-y-8"
        >
          <div className="w-20 h-20 mx-auto bg-white rounded-2xl shadow-lg flex items-center justify-center">
            <img
              src="/logos/public.png" 
              alt="Public Bank" 
              className="h-12 w-auto"
            />
          </div>
          
          <div className="space-y-4">
            <h1 className="text-2xl font-bold text-gray-900">
              Redirecting to Public Bank...
            </h1>
            <p className="text-gray-600 max-w-md mx-auto">
              You will be redirected to Public Bank's secure login page to authorize access to your account.
            </p>
          </div>

          <div className="flex items-center justify-center gap-3">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              className="w-6 h-6 border-2 border-[#002fa7] border-t-transparent rounded-full"
            />
            <span className="text-gray-600">Redirecting...</span>
          </div>

          <div className="text-sm text-gray-500 max-w-sm mx-auto">
            For your security, you will need to log in to your Public Bank account to authorize this connection.
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default RedirectPage; 