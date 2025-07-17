import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/router';
import Image from 'next/image';

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
  const videoRef = useRef(null);

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

  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, []);

  const simulateFaceScan = () => {
    setIsProcessing(true);
    setScanProgress(0);
    
    // Simulate progressive face scanning
    const progressInterval = setInterval(() => {
      setScanProgress(prev => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          setTimeout(() => {
            stopCamera();
            processPayment();
          }, 500);
          return 100;
        }
        return prev + 10;
      });
    }, 200);
  };

  const simulateQRScan = () => {
    setIsProcessing(true);
    // Simulate QR scan delay
    setTimeout(() => {
      processPayment();
    }, 2000);
  };

  const processPayment = async () => {
    try {
      const response = await fetch('/api/payment/process', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: parseFloat(amount),
          paymentMethod,
          payerToken: 'encrypted_token_here', // John Doe's token
          receiverToken: 'encrypted_business_token_here', // Doe's Bakery token
        }),
      });

      const result = await response.json();
      
      if (result.success) {
        router.push(`/payment/success?txnId=${result.transactionId}&amount=${amount}&method=${paymentMethod}`);
      } else {
        alert('Payment failed. Please try again.');
        setIsProcessing(false);
        setShowFaceScan(false);
        setShowQRScan(false);
        stopCamera();
      }
    } catch (error) {
      console.error('Payment error:', error);
      alert('Payment failed. Please try again.');
      setIsProcessing(false);
      setShowFaceScan(false);
      setShowQRScan(false);
      stopCamera();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-md mx-auto pt-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Catching Pay</h1>
          <p className="text-gray-600">Secure and instant payments</p>
        </div>

        {/* Payment Form */}
        <div className="bg-white rounded-2xl shadow-xl p-6 mb-6">
          <h2 className="text-xl font-semibold mb-6 text-center">Make Payment</h2>
          
          {/* Amount Input */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Amount (RM)
            </label>
            <input
              type="number"
              step="0.01"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg"
              placeholder="0.00"
              disabled={isProcessing}
            />
          </div>

          {/* Payment Method Selection */}
          {!showFaceScan && !showQRScan && (
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-900">Choose Payment Method</h3>
              
              <button
                onClick={() => handlePaymentMethodSelect('face')}
                disabled={!amount || isProcessing}
                className="w-full p-4 border-2 border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                    <span className="text-2xl">👤</span>
                  </div>
                  <div className="text-left">
                    <div className="font-medium">Pay with Face</div>
                    <div className="text-sm text-gray-500">Secure facial recognition</div>
                  </div>
                </div>
              </button>

              <button
                onClick={() => handlePaymentMethodSelect('qr')}
                disabled={!amount || isProcessing}
                className="w-full p-4 border-2 border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                    <span className="text-2xl">📱</span>
                  </div>
                  <div className="text-left">
                    <div className="font-medium">Scan QR Code</div>
                    <div className="text-sm text-gray-500">Quick QR payment</div>
                  </div>
                </div>
              </button>
            </div>
          )}

          {/* Face Scan Simulation */}
          {showFaceScan && (
            <div className="text-center">
              {/* Camera Preview */}
              <div className="relative w-80 h-60 mx-auto mb-4 bg-gray-900 rounded-lg overflow-hidden">
                {cameraError ? (
                  <div className="flex items-center justify-center h-full text-white">
                    <div className="text-center">
                      <div className="text-4xl mb-2">📷</div>
                      <p className="text-sm">{cameraError}</p>
                      <button
                        onClick={startCamera}
                        className="mt-2 px-4 py-2 bg-blue-600 text-white rounded text-sm hover:bg-blue-700"
                      >
                        Try Again
                      </button>
                    </div>
                  </div>
                ) : (
                  <>
                    <video
                      ref={videoRef}
                      autoPlay
                      playsInline
                      muted
                      className="w-full h-full object-cover"
                    />
                    {/* Face Detection Overlay */}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className={`w-48 h-48 border-2 rounded-full transition-colors duration-300 ${
                        scanProgress > 0 ? 'border-green-400' : 'border-blue-400'
                      }`}>
                        <div className="w-full h-full rounded-full border-2 border-dashed border-white opacity-50"></div>
                      </div>
                    </div>
                    {/* Scan Progress Indicator */}
                    {isProcessing && (
                      <div className="absolute bottom-4 left-4 right-4">
                        <div className="bg-black bg-opacity-50 rounded-lg p-2">
                          <div className="text-white text-sm mb-1">Scanning face... {scanProgress}%</div>
                          <div className="w-full bg-gray-600 rounded-full h-2">
                            <div 
                              className="bg-green-400 h-2 rounded-full transition-all duration-200" 
                              style={{width: `${scanProgress}%`}}
                            ></div>
                          </div>
                        </div>
                      </div>
                    )}
                  </>
                )}
              </div>
              
              <h3 className="text-lg font-medium mb-2">Face Recognition Payment</h3>
              <p className="text-gray-600 mb-4">
                {isProcessing ? 'Analyzing facial features...' : 'Position your face within the circle'}
              </p>
              
              {!isProcessing && !cameraError && (
                <div className="space-y-3">
                  <button
                    onClick={simulateFaceScan}
                    className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Start Face Scan
                  </button>
                  <div>
                    <button
                      onClick={() => {
                        setShowFaceScan(false);
                        stopCamera();
                        setPaymentMethod('');
                      }}
                      className="text-gray-500 hover:text-gray-700 text-sm"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}
              
              {isProcessing && (
                <div className="text-blue-600 font-medium">
                  {scanProgress < 100 ? 'Scanning...' : 'Processing payment...'}
                </div>
              )}
            </div>
          )}

          {/* QR Scan Simulation */}
          {showQRScan && (
            <div className="text-center">
              {/* Mock QR Code */}
              <div className="w-64 h-64 mx-auto mb-4 bg-white border-2 border-gray-300 rounded-lg p-4 flex items-center justify-center">
                <div className="w-full h-full bg-black relative">
                  {/* QR Code Pattern Simulation */}
                  <div className="absolute inset-2 grid grid-cols-8 gap-1">
                    {Array.from({ length: 64 }, (_, i) => (
                      <div
                        key={i}
                        className={`${
                          Math.random() > 0.5 ? 'bg-black' : 'bg-white'
                        } w-full h-full`}
                      />
                    ))}
                  </div>
                  {/* Corner markers */}
                  <div className="absolute top-1 left-1 w-6 h-6 border-2 border-white bg-black"></div>
                  <div className="absolute top-1 right-1 w-6 h-6 border-2 border-white bg-black"></div>
                  <div className="absolute bottom-1 left-1 w-6 h-6 border-2 border-white bg-black"></div>
                </div>
              </div>
              
              {/* QR Code Info */}
              <div className="bg-gray-50 rounded-lg p-4 mb-4 text-left max-w-sm mx-auto">
                <h4 className="font-medium text-gray-900 mb-2">Payment Details</h4>
                <div className="text-sm text-gray-600 space-y-1">
                  <div>Merchant: Doe's Bakery</div>
                  <div>Amount: RM {amount}</div>
                  <div>Payment ID: QR-{Date.now().toString().slice(-6)}</div>
                </div>
              </div>
              
              <h3 className="text-lg font-medium mb-2">QR Code Payment</h3>
              <p className="text-gray-600 mb-4">
                {isProcessing ? 'Processing QR payment...' : 'Scan the QR code above to complete payment'}
              </p>
              
              {!isProcessing && (
                <div className="space-y-3">
                  <button
                    onClick={simulateQRScan}
                    className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors"
                  >
                    Simulate QR Scan
                  </button>
                  <div>
                    <button
                      onClick={() => {
                        setShowQRScan(false);
                        setPaymentMethod('');
                      }}
                      className="text-gray-500 hover:text-gray-700 text-sm"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}
              
              {isProcessing && (
                <div className="text-green-600 font-medium">
                  <div className="animate-pulse">Processing QR payment...</div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Back Button */}
        <button
          onClick={() => router.push('/')}
          className="w-full text-gray-600 hover:text-gray-800 py-2"
          disabled={isProcessing}
        >
          ← Back to Home
        </button>
      </div>
    </div>
  );
}