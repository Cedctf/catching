import { useState, useRef } from 'react';
import { useRouter } from 'next/router';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Building, 
  Upload, 
  Phone, 
  Mail, 
  FileText, 
  Loader2, 
  CheckCircle, 
  AlertCircle,
  ArrowLeft,
  X,
  Plus,
  User
} from 'lucide-react';

export default function RegisterBusinessPage() {
  const router = useRouter();
  const ssmFileInputRef = useRef(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [businessType, setBusinessType] = useState('formal'); // 'formal' or 'informal'
  const [formData, setFormData] = useState({
    businessName: '',
    phoneNumber: '',
    email: '',
    ssmDocuments: [],
    ssmDocumentPreviews: []
  });

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleFileUpload = (e) => {
    const files = Array.from(e.target.files);
    const validFiles = [];
    const previews = [];

    files.forEach(file => {
      if (file.size > 5 * 1024 * 1024) {
        setError('Each file must be less than 5MB');
        return;
      }
      
      validFiles.push(file);
      
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (e) => {
          previews.push({
            name: file.name,
            url: e.target.result,
            type: 'image'
          });
          
          if (previews.length === validFiles.length) {
            setFormData(prev => ({
              ...prev,
              ssmDocuments: [...prev.ssmDocuments, ...validFiles],
              ssmDocumentPreviews: [...prev.ssmDocumentPreviews, ...previews]
            }));
          }
        };
        reader.readAsDataURL(file);
      } else {
        previews.push({
          name: file.name,
          url: null,
          type: 'document'
        });
      }
    });

    if (validFiles.length > 0 && !files.some(f => f.type.startsWith('image/'))) {
      setFormData(prev => ({
        ...prev,
        ssmDocuments: [...prev.ssmDocuments, ...validFiles],
        ssmDocumentPreviews: [...prev.ssmDocumentPreviews, ...previews]
      }));
    }
  };

  const removeDocument = (index) => {
    setFormData(prev => ({
      ...prev,
      ssmDocuments: prev.ssmDocuments.filter((_, i) => i !== index),
      ssmDocumentPreviews: prev.ssmDocumentPreviews.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.businessName || !formData.phoneNumber) {
      setError('Please fill in all required fields');
      return;
    }

    if (businessType === 'formal' && formData.ssmDocuments.length === 0) {
      setError('Please upload at least one SSM document');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Redirect to dashboard
      router.push('/business/dashboard');
    } catch (error) {
      setError('Registration failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-2xl shadow-xl max-w-2xl w-full p-8"
      >
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-[#002fa7] rounded-full flex items-center justify-center mx-auto mb-4">
            <Building className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Business Registration</h1>
          <p className="text-gray-600">Complete your business account setup</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Business Type Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Business Type *
            </label>
            <div className="grid grid-cols-2 gap-4">
              <button
                type="button"
                onClick={() => setBusinessType('formal')}
                className={`p-4 border-2 rounded-xl text-left transition-all ${
                  businessType === 'formal'
                    ? 'border-[#002fa7] bg-[#002fa7]/5'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center gap-3">
                  <FileText className="h-5 w-5 text-[#002fa7]" />
                  <div>
                    <p className="font-medium text-gray-900">Formal Business</p>
                    <p className="text-sm text-gray-600">Registered with SSM</p>
                  </div>
                </div>
              </button>
              
              <button
                type="button"
                onClick={() => setBusinessType('informal')}
                className={`p-4 border-2 rounded-xl text-left transition-all ${
                  businessType === 'informal'
                    ? 'border-[#002fa7] bg-[#002fa7]/5'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center gap-3">
                  <User className="h-5 w-5 text-[#002fa7]" />
                  <div>
                    <p className="font-medium text-gray-900">Informal Business</p>
                    <p className="text-sm text-gray-600">Individual/Small business</p>
                  </div>
                </div>
              </button>
            </div>
          </div>

          {/* Business Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Business Name *
            </label>
            <input
              type="text"
              value={formData.businessName}
              onChange={(e) => handleInputChange('businessName', e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#002fa7] focus:border-transparent"
              placeholder="Enter your business name"
              required
            />
          </div>

          {/* Phone Number */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Phone Number *
            </label>
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="tel"
                value={formData.phoneNumber}
                onChange={(e) => handleInputChange('phoneNumber', e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#002fa7] focus:border-transparent"
                placeholder="e.g., +60123456789"
                required
              />
            </div>
          </div>

          {/* Email (Optional) */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email Address (Optional)
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#002fa7] focus:border-transparent"
                placeholder="your.email@example.com"
              />
            </div>
          </div>

          {/* SSM Documents (Only for formal business) */}
          {businessType === 'formal' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                SSM Documents *
              </label>
              <p className="text-sm text-gray-600 mb-3">
                Upload your SSM certificate and related business documents
              </p>
              
              <div
                onClick={() => ssmFileInputRef.current?.click()}
                className="w-full border-2 border-dashed border-gray-300 rounded-xl p-6 text-center cursor-pointer hover:border-[#002fa7] transition-colors"
              >
                <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                <p className="text-gray-600 mb-1">Click to upload SSM documents</p>
                <p className="text-sm text-gray-500">PDF, PNG, JPG up to 5MB each</p>
              </div>

              <input
                ref={ssmFileInputRef}
                type="file"
                multiple
                accept=".pdf,.png,.jpg,.jpeg"
                onChange={handleFileUpload}
                className="hidden"
              />

              {/* Document Previews */}
              {formData.ssmDocumentPreviews.length > 0 && (
                <div className="mt-4 space-y-3">
                  {formData.ssmDocumentPreviews.map((preview, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-3">
                        {preview.type === 'image' ? (
                          <img src={preview.url} alt={preview.name} className="w-12 h-12 object-cover rounded" />
                        ) : (
                          <FileText className="h-12 w-12 text-gray-400" />
                        )}
                        <span className="text-sm font-medium text-gray-900 truncate max-w-xs">
                          {preview.name}
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeDocument(index)}
                        className="text-red-500 hover:text-red-700 p-1"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Informal Business Note */}
          {businessType === 'informal' && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <CheckCircle className="h-5 w-5 text-blue-500 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-blue-900">Informal Business</p>
                  <p className="text-sm text-blue-700 mt-1">
                    No SSM documents required. You can start accepting payments immediately.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <div className="flex items-center gap-2">
                <AlertCircle className="h-5 w-5 text-red-500" />
                <p className="text-sm text-red-700">{error}</p>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-4 pt-4">
            <button
              type="button"
              onClick={() => router.push('/auth/register')}
              className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-3 px-4 rounded-xl transition-colors flex items-center justify-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Back
            </button>
            
            <button
              type="submit"
              disabled={isLoading}
              className="flex-1 bg-[#002fa7] hover:bg-[#002fa7]/90 disabled:bg-gray-300 text-white font-medium py-3 px-4 rounded-xl transition-colors flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Setting up...
                </>
              ) : (
                <>
                  <CheckCircle className="h-4 w-4" />
                  Complete Registration
                </>
              )}
            </button>
          </div>
        </form>

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