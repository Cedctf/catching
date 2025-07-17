import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/router';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Camera, 
  QrCode, 
  CreditCard, 
  DollarSign, 
  ArrowRight, 
  X, 
  CheckCircle,
  AlertCircle,
  Loader2,
  Scan
} from 'lucide-react';

export default function PaymentStart() {
  const router = useRouter();
  const [amount, setAmount] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [showFaceScan, setShowFaceScan] = useState(false);
  const [showQRScan, setShowQRScan] = useState(false);
  const [cameraStream, setCameraStream] = useState(null);
  const [cameraError, setCameraError] = useState(null);
  const [scanProgress, setScanProgress] = useState(0);
  const [paymentProcessed, setPaymentProcessed] = useState(false);
  const videoRef = useRef(null);
  const processingRef = useRef(false);

  const handlePaymentMethodSelect = async (method) => {
    setPaymentMethod(method);
    if (method === 'face') {
      setShowFaceScan(true);
      await startCamera();
    } else if (method === 'qr') {
      setShowQRScan(true);
    }
  };

  const startCamera = async () => {
    try {
      setCameraError(null);
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { 
          width: { ideal: 640 },
          height: { ideal: 480 },
          facingMode: 'user'
        } 
      });
      setCameraStream(stream);
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (error) {
      console.error('Error accessing camera:', error);
      setCameraError('Unable to access camera. Please ensure camera permissions are granted.');
    }
  };

  const stopCamera = () => {
    if (cameraStream) {
      cameraStream.getTracks().forEach(track => track.stop());
      setCameraStream(null);
    }
  };

  const simulateFaceScan = async () => {
    try {
      if (processingRef.current) return;
      processingRef.current = true;
      
      setIsProcessing(true);
      setScanProgress(0);
      setCameraError(null);
      
      for (let i = 0; i <= 100; i += 10) {
        setScanProgress(i);
        await new Promise(resolve => setTimeout(resolve, 200));
      }
      
      await processPayment();
    } catch (error) {
      console.error('Face scan error:', error);
      setCameraError(error.message || 'Face scan failed. Please try again.');
      setIsProcessing(false);
      setScanProgress(0);
    } finally {
      processingRef.current = false;
    }
  };

  const simulateQRScan = async () => {
    try {
      if (processingRef.current) return;
      processingRef.current = true;
      
      setIsProcessing(true);
      setScanProgress(0);
      setCameraError(null);
      
      for (let i = 0; i <= 100; i += 20) {
        setScanProgress(i);
        await new Promise(resolve => setTimeout(resolve, 300));
      }
      
      await processPayment();
    } catch (error) {
      console.error('QR scan error:', error);
      setCameraError(error.message || 'QR scan failed. Please try again.');
      setIsProcessing(false);
      setScanProgress(0);
    } finally {
      processingRef.current = false;
    }
  };

  const processPayment = async () => {
    try {
      if (!amount || parseFloat(amount) <= 0) {
        throw new Error('Invalid payment amount');
      }

      if (!paymentMethod) {
        throw new Error('Payment method not selected');
      }

      const response = await fetch('/api/payment/process', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: parseFloat(amount),
          paymentMethod: paymentMethod.toUpperCase(),
        }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setPaymentProcessed(true);
        
        setTimeout(() => {
          router.push(`/payment/success?transactionId=${data.transactionId}`);
        }, 2000);
      } else {
        throw new Error(data.message || 'Payment processing failed');
      }
    } catch (error) {
      console.error('Payment error:', error);
      const errorMessage = error.message || 'Payment processing failed. Please try again.';
      setCameraError(errorMessage);
      setIsProcessing(false);
      setScanProgress(0);
    }
  };

  const resetPayment = () => {
    setPaymentMethod('');
    setShowFaceScan(false);
    setShowQRScan(false);
    setIsProcessing(false);
    setScanProgress(0);
    setPaymentProcessed(false);
    setCameraError(null);
    stopCamera();
  };

  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, []);

  const cardVariants = {
    hidden: { opacity: 0, y: 50, rotateX: 15 },
    visible: {
      opacity: 1, y: 0, rotateX: 0,
      transition: { duration: 0.8, ease: [0.25, 0.4, 0.25, 1] }
    }
  };

  const modalVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 0.8 }
  };

  return (
    <div className="relative w-full max-w-7xl mx-auto px-6 py-8 space-y-6">
      {/* Header */}
      <header className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Payment Gateway</h1>
        <p className="text-gray-600">Secure and fast payment processing</p>
      </header>

      {/* Main Payment Form */}
      <div className="max-w-md mx-auto">
        <motion.div
          variants={cardVariants}
          initial="hidden"
          animate="visible"
          className="bg-white border border-gray-200 rounded-3xl shadow-lg p-6 space-y-6"
        >
          {/* Amount Input */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Payment Amount
            </label>
            <div className="relative">
              <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0.00"
                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#002fa7]/30 focus:border-[#002fa7]/20 transition-all duration-200 text-lg"
              />
            </div>
          </div>

          {/* Payment Method Selection */}
          {!paymentMethod && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">Choose Payment Method</h3>
              <div className="grid grid-cols-2 gap-3">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handlePaymentMethodSelect('face')}
                  disabled={!amount || parseFloat(amount) <= 0}
                  className="p-4 bg-[#002fa7] hover:bg-[#002fa7]/90 text-white rounded-xl transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Camera className="h-6 w-6 mx-auto mb-2" />
                  <span className="text-sm font-medium">Face Scan</span>
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handlePaymentMethodSelect('qr')}
                  disabled={!amount || parseFloat(amount) <= 0}
                  className="p-4 bg-[#002fa7] hover:bg-[#002fa7]/90 text-white rounded-xl transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <QrCode className="h-6 w-6 mx-auto mb-2" />
                  <span className="text-sm font-medium">QR Code</span>
                </motion.button>
              </div>
            </div>
          )}

          {/* Reset Button */}
          {paymentMethod && (
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={resetPayment}
              className="w-full flex items-center justify-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-3 px-4 rounded-xl transition-colors duration-200"
            >
              <X className="h-4 w-4" />
              <span>Change Payment Method</span>
            </motion.button>
          )}
        </motion.div>
      </div>

      {/* Face Scan Modal */}
      <AnimatePresence>
        {showFaceScan && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          >
            <motion.div
              variants={modalVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="bg-white rounded-3xl p-6 max-w-md w-full space-y-6"
            >
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">Face Recognition</h3>
                <button
                  onClick={resetPayment}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <X className="h-5 w-5 text-gray-500" />
                </button>
              </div>

              {cameraError ? (
                <div className="text-center space-y-4">
                  <div className="p-4 bg-red-100 rounded-full w-fit mx-auto">
                    <AlertCircle className="h-8 w-8 text-red-600" />
                  </div>
                  <p className="text-red-600">{cameraError}</p>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={startCamera}
                    className="bg-[#002fa7] hover:bg-[#002fa7]/90 text-white font-medium py-2 px-4 rounded-xl transition-colors duration-200"
                  >
                    Try Again
                  </motion.button>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="relative bg-gray-100 rounded-xl overflow-hidden aspect-video">
                    <video
                      ref={videoRef}
                      autoPlay
                      playsInline
                      muted
                      className="w-full h-full object-cover"
                    />
                    {isProcessing && (
                      <div className="absolute inset-0 bg-[#002fa7]/20 flex items-center justify-center">
                        <div className="text-center space-y-2">
                          <Loader2 className="h-8 w-8 animate-spin text-white mx-auto" />
                          <p className="text-white font-medium">Processing... {scanProgress}%</p>
                        </div>
                      </div>
                    )}
                  </div>
                  
                  {!isProcessing && !paymentProcessed && (
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={simulateFaceScan}
                      className="w-full bg-[#002fa7] hover:bg-[#002fa7]/90 text-white font-medium py-3 px-4 rounded-xl transition-colors duration-200 flex items-center justify-center gap-2"
                    >
                      <Scan className="h-5 w-5" />
                      <span>Start Face Scan</span>
                    </motion.button>
                  )}

                  {paymentProcessed && (
                    <div className="text-center space-y-4">
                      <div className="p-4 bg-green-100 rounded-full w-fit mx-auto">
                        <CheckCircle className="h-8 w-8 text-green-600" />
                      </div>
                      <p className="text-green-600 font-medium">Payment Successful!</p>
                    </div>
                  )}
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* QR Scan Modal */}
      <AnimatePresence>
        {showQRScan && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          >
            <motion.div
              variants={modalVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="bg-white rounded-3xl p-6 max-w-md w-full space-y-6"
            >
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">QR Code Payment</h3>
                <button
                  onClick={resetPayment}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <X className="h-5 w-5 text-gray-500" />
                </button>
              </div>

              <div className="space-y-4">
                <div className="relative bg-gray-100 rounded-xl p-8 aspect-square flex items-center justify-center">
                  <QrCode className="h-32 w-32 text-gray-400" />
                  {isProcessing && (
                    <div className="absolute inset-0 bg-[#002fa7]/20 flex items-center justify-center rounded-xl">
                      <div className="text-center space-y-2">
                        <Loader2 className="h-8 w-8 animate-spin text-[#002fa7] mx-auto" />
                        <p className="text-[#002fa7] font-medium">Scanning... {scanProgress}%</p>
                      </div>
                    </div>
                  )}
                </div>

                <p className="text-center text-gray-600 text-sm">
                  Scan this QR code with your mobile banking app
                </p>
                
                {!isProcessing && !paymentProcessed && (
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={simulateQRScan}
                    className="w-full bg-[#002fa7] hover:bg-[#002fa7]/90 text-white font-medium py-3 px-4 rounded-xl transition-colors duration-200 flex items-center justify-center gap-2"
                  >
                    <QrCode className="h-5 w-5" />
                    <span>Simulate QR Scan</span>
                  </motion.button>
                )}

                {paymentProcessed && (
                  <div className="text-center space-y-4">
                    <div className="p-4 bg-green-100 rounded-full w-fit mx-auto">
                      <CheckCircle className="h-8 w-8 text-green-600" />
                    </div>
                    <p className="text-green-600 font-medium">Payment Successful!</p>
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}