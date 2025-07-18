import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/router';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Camera, 
  Eye, 
  EyeOff, 
  Loader2, 
  Shield, 
  CheckCircle, 
  AlertCircle,
  ArrowLeft,
  User,
  Lock
} from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const videoRef = useRef(null);
  const [loginMethod, setLoginMethod] = useState('face'); // 'face' or 'password'
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [cameraStream, setCameraStream] = useState(null);
  const [cameraError, setCameraError] = useState(null);
  const [scanProgress, setScanProgress] = useState(0);
  const [scanStatus, setScanStatus] = useState('idle'); // 'idle', 'scanning', 'success', 'failed'
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const setLoginState = () => {
    // Save login state and user data
    localStorage.setItem('isLoggedIn', 'true');
    localStorage.setItem('user', JSON.stringify({
      name: "John Doe",
      email: formData.email || "john@example.com",
      avatar: "JD"
    }));
    // Force a page reload to update the navbar
    window.location.href = '/business/dashboard';
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
      setCameraError('Unable to access camera. Please check permissions.');
    }
  };

  const stopCamera = () => {
    if (cameraStream) {
      cameraStream.getTracks().forEach(track => track.stop());
      setCameraStream(null);
    }
  };

  const handleFaceLogin = async () => {
    if (!cameraStream) {
      await startCamera();
      return;
    }

    setIsLoading(true);
    setScanStatus('scanning');
    setScanProgress(0);

    // Simulate face recognition process
    const interval = setInterval(() => {
      setScanProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setScanStatus('success');
          setTimeout(() => {
            setIsLoading(false);
            setLoginState();
          }, 1000);
          return 100;
        }
        return prev + 10;
      });
    }, 200);
  };

  const handlePasswordLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      if (formData.email && formData.password) {
        setLoginState();
      } else {
        throw new Error('Invalid credentials');
      }
    } catch (error) {
      setCameraError('Invalid email or password');
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  useEffect(() => {
    if (loginMethod === 'face') {
      startCamera();
    } else {
      stopCamera();
    }

    return () => stopCamera();
  }, [loginMethod]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4 pt-20">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-2xl shadow-xl max-w-md w-full p-8"
      >
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-[#002fa7] rounded-full flex items-center justify-center mx-auto mb-4">
            <Shield className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Welcome Back</h1>
          <p className="text-gray-600">Sign in to your account</p>
        </div>

        {/* Login Method Toggle */}
        <div className="flex bg-gray-100 rounded-xl p-1 mb-6">
          <button
            onClick={() => setLoginMethod('face')}
            className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-lg font-medium transition-all ${
              loginMethod === 'face'
                ? 'bg-[#002fa7] text-white shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <Camera className="h-4 w-4" />
            Face Recognition
          </button>
          <button
            onClick={() => setLoginMethod('password')}
            className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-lg font-medium transition-all ${
              loginMethod === 'password'
                ? 'bg-[#002fa7] text-white shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <Lock className="h-4 w-4" />
            Password
          </button>
        </div>

        {/* Face Recognition Login */}
        <AnimatePresence mode="wait">
          {loginMethod === 'face' && (
            <motion.div
              key="face-login"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
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
                        <p className="font-medium">Face recognized!</p>
                        <p className="text-sm">Redirecting...</p>
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

              <button
                onClick={handleFaceLogin}
                disabled={isLoading}
                className="w-full bg-[#002fa7] hover:bg-[#002fa7]/90 disabled:bg-gray-300 text-white font-medium py-3 px-4 rounded-xl transition-colors"
              >
                {isLoading ? (
                  <div className="flex items-center justify-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Scanning...
                  </div>
                ) : (
                  'Start Face Recognition'
                )}
              </button>
            </motion.div>
          )}

          {/* Password Login */}
          {loginMethod === 'password' && (
            <motion.div
              key="password-login"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              <form onSubmit={handlePasswordLogin} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#002fa7] focus:border-transparent"
                      placeholder="Enter your email"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={formData.password}
                      onChange={(e) => handleInputChange('password', e.target.value)}
                      className="w-full pl-10 pr-10 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#002fa7] focus:border-transparent"
                      placeholder="Enter your password"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </button>
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

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-[#002fa7] hover:bg-[#002fa7]/90 disabled:bg-gray-300 text-white font-medium py-3 px-4 rounded-xl transition-colors"
                >
                  {isLoading ? (
                    <div className="flex items-center justify-center gap-2">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Signing in...
                    </div>
                  ) : (
                    'Sign In'
                  )}
                </button>
              </form>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Footer */}
        <div className="mt-8 text-center">
          <p className="text-sm text-gray-600">
            Don't have an account?{' '}
            <button
              onClick={() => router.push('/auth/register')}
              className="text-[#002fa7] hover:text-[#002fa7]/80 font-medium"
            >
              Sign up
            </button>
          </p>
        </div>
      </motion.div>
    </div>
  );
} 