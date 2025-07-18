import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/router';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Camera, 
  Upload, 
  User, 
  Loader2, 
  CheckCircle, 
  AlertCircle,
  ArrowLeft,
  ArrowRight,
  Shield,
  FileText,
  X
} from 'lucide-react';

export default function RegisterPage() {
  const router = useRouter();
  const videoRef = useRef(null);
  const fileInputRef = useRef(null);
  const [step, setStep] = useState(1); // 1: IC Details, 2: Face Scan
  const [isLoading, setIsLoading] = useState(false);
  const [cameraStream, setCameraStream] = useState(null);
  const [cameraError, setCameraError] = useState(null);
  const [scanProgress, setScanProgress] = useState(0);
  const [scanStatus, setScanStatus] = useState('idle');
  const [formData, setFormData] = useState({
    icNumber: '',
    icPicture: null,
    icPicturePreview: null
  });

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
      setCameraError('Unable to access camera. Please check permissions.');
    }
  };

  const stopCamera = () => {
    if (cameraStream) {
      cameraStream.getTracks().forEach(track => track.stop());
      setCameraStream(null);
    }
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        setCameraError('File size must be less than 5MB');
        return;
      }
      
      const reader = new FileReader();
      reader.onload = (e) => {
        setFormData(prev => ({
          ...prev,
          icPicture: file,
          icPicturePreview: e.target.result
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleNext = () => {
    if (!formData.icNumber || !formData.icPicture) {
      setCameraError('Please fill in all required fields');
      return;
    }

    setCameraError(null);
    setStep(2);
    setTimeout(() => {
      startCamera();
    }, 500);
  };

  const handleFaceScan = async () => {
    if (!cameraStream) {
      await startCamera();
      return;
    }

    setIsLoading(true);
    setScanStatus('scanning');
    setScanProgress(0);

    // Simulate face scan process
    const interval = setInterval(() => {
      setScanProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setScanStatus('success');
          setTimeout(() => {
            setIsLoading(false);
            router.push('/auth/register-business');
          }, 1000);
          return 100;
        }
        return prev + 10;
      });
    }, 200);
  };

  const removeImage = () => {
    setFormData(prev => ({
      ...prev,
      icPicture: null,
      icPicturePreview: null
    }));
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  useEffect(() => {
    return () => stopCamera();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-2xl shadow-xl max-w-md w-full p-8"
      >
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-[#002fa7] rounded-full flex items-center justify-center mx-auto mb-4">
            <User className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Create Account</h1>
          <p className="text-gray-600">Step {step} of 2</p>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm text-gray-600">IC Details</span>
            <span className="text-sm text-gray-600">Face Scan</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-[#002fa7] h-2 rounded-full transition-all duration-300"
              style={{ width: `${(step / 2) * 100}%` }}
            />
          </div>
        </div>

        <AnimatePresence mode="wait">
          {/* Step 1: IC Details */}
          {step === 1 && (
            <motion.div
              key="ic-details"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  IC Number *
                </label>
                <input
                  type="text"
                  value={formData.icNumber}
                  onChange={(e) => handleInputChange('icNumber', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#002fa7] focus:border-transparent"
                  placeholder="e.g., 901234-56-7890"
                  maxLength={14}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  IC Picture *
                </label>
                
                {!formData.icPicturePreview ? (
                  <div
                    onClick={() => fileInputRef.current?.click()}
                    className="w-full border-2 border-dashed border-gray-300 rounded-xl p-8 text-center cursor-pointer hover:border-[#002fa7] transition-colors"
                  >
                    <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600 mb-2">Click to upload IC picture</p>
                    <p className="text-sm text-gray-500">PNG, JPG up to 5MB</p>
                  </div>
                ) : (
                  <div className="relative">
                    <img
                      src={formData.icPicturePreview}
                      alt="IC Preview"
                      className="w-full h-40 object-cover rounded-xl"
                    />
                    <button
                      onClick={removeImage}
                      className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white p-1 rounded-full"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                )}
                
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </div>

              {cameraError && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <div className="flex items-center gap-2">
                    <AlertCircle className="h-5 w-5 text-red-500" />
                    <p className="text-sm text-red-700">{cameraError}</p>
                  </div>
                </div>
              )}

              <button
                onClick={handleNext}
                className="w-full bg-[#002fa7] hover:bg-[#002fa7]/90 text-white font-medium py-3 px-4 rounded-xl transition-colors flex items-center justify-center gap-2"
              >
                Next: Face Scan
                <ArrowRight className="h-4 w-4" />
              </button>
            </motion.div>
          )}

          {/* Step 2: Face Scan */}
          {step === 2 && (
            <motion.div
              key="face-scan"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <div className="text-center mb-6">
                <Shield className="h-12 w-12 text-[#002fa7] mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Face Registration</h3>
                <p className="text-sm text-gray-600">
                  Position your face in the camera frame and click start
                </p>
              </div>

              <div className="relative">
                <div className="aspect-square bg-gray-100 rounded-xl overflow-hidden">
                  <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    className="w-full h-full object-cover"
                  />
                  
                  {/* Scanning Overlay */}
                  {scanStatus === 'scanning' && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50">
                      <div className="text-center text-white">
                        <Loader2 className="h-8 w-8 animate-spin mx-auto mb-2" />
                        <p className="text-sm">Scanning face...</p>
                        <div className="w-32 bg-gray-600 rounded-full h-2 mt-2 mx-auto">
                          <div 
                            className="bg-white h-2 rounded-full transition-all duration-300"
                            style={{ width: `${scanProgress}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Success Overlay */}
                  {scanStatus === 'success' && (
                    <div className="absolute inset-0 flex items-center justify-center bg-green-600 bg-opacity-90">
                      <div className="text-center text-white">
                        <CheckCircle className="h-12 w-12 mx-auto mb-2" />
                        <p className="font-medium">Face registered!</p>
                        <p className="text-sm">Proceeding to business setup...</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {cameraError && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <div className="flex items-center gap-2">
                    <AlertCircle className="h-5 w-5 text-red-500" />
                    <p className="text-sm text-red-700">{cameraError}</p>
                  </div>
                </div>
              )}

              <div className="flex gap-3">
                <button
                  onClick={() => setStep(1)}
                  className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-3 px-4 rounded-xl transition-colors flex items-center justify-center gap-2"
                >
                  <ArrowLeft className="h-4 w-4" />
                  Back
                </button>
                
                <button
                  onClick={handleFaceScan}
                  disabled={isLoading}
                  className="flex-1 bg-[#002fa7] hover:bg-[#002fa7]/90 disabled:bg-gray-300 text-white font-medium py-3 px-4 rounded-xl transition-colors flex items-center justify-center gap-2"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Scanning...
                    </>
                  ) : (
                    <>
                      <Camera className="h-4 w-4" />
                      Start Scan
                    </>
                  )}
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Footer */}
        <div className="mt-8 text-center">
          <p className="text-sm text-gray-600">
            Already have an account?{' '}
            <button
              onClick={() => router.push('/auth/login')}
              className="text-[#002fa7] hover:text-[#002fa7]/80 font-medium"
            >
              Sign in
            </button>
          </p>
        </div>
      </motion.div>
    </div>
  );
} 