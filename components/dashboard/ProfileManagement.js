import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  User, 
  Phone, 
  Mail, 
  MapPin, 
  Camera, 
  Edit3, 
  Save, 
  X,
  Shield,
  Lock,
  Unlock,
  Eye,
  EyeOff,
  CheckCircle,
  AlertCircle,
  RefreshCw,
  Upload,
  Settings
} from 'lucide-react';

export default function ProfileManagement({ businessData, onDataUpdate }) {
  const [isEditing, setIsEditing] = useState(false);
  const [showFaceIdModal, setShowFaceIdModal] = useState(false);
  const [faceIdEnabled, setFaceIdEnabled] = useState(true);
  const [profileData, setProfileData] = useState({
    ownerName: businessData?.ownerName || 'Ahmad Bin Hassan',
    ownerEmail: businessData?.ownerEmail || 'ahmad.hassan@techsolutions.com.my',
    ownerPhone: businessData?.ownerPhone || '+60 12-345-6789',
    ownerAddress: businessData?.ownerAddress || '123 Jalan Bukit Bintang, 55100 Kuala Lumpur',
    icNumber: businessData?.icNumber || '901234-56-7890',
    position: businessData?.position || 'Managing Director',
    faceIdStatus: businessData?.faceIdStatus || 'active',
    lastFaceIdUpdate: businessData?.lastFaceIdUpdate || '2024-01-15T10:30:00Z'
  });

  const [formData, setFormData] = useState(profileData);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSave = () => {
    setProfileData(formData);
    setIsEditing(false);
    if (onDataUpdate) {
      onDataUpdate({
        ...businessData,
        ...formData
      });
    }
  };

  const handleCancel = () => {
    setFormData(profileData);
    setIsEditing(false);
  };

  const refreshFaceId = () => {
    setShowFaceIdModal(true);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-MY', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: "easeOut" }
    }
  };

  const inputClass = "w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#002fa7] focus:border-transparent transition-all duration-200";
  const readOnlyClass = "w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-gray-700";

  return (
    <div className="space-y-6">
      {/* Profile Information */}
      <motion.div
        variants={cardVariants}
        initial="hidden"
        animate="visible"
        className="bg-white rounded-xl shadow-sm border border-gray-200"
      >
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Profile Management</h2>
            <div className="flex items-center gap-3">
              {isEditing ? (
                <>
                  <button
                    onClick={handleSave}
                    className="flex items-center gap-2 bg-[#002fa7] hover:bg-[#002fa7]/90 text-white px-4 py-2 rounded-lg transition-colors"
                  >
                    <Save className="h-4 w-4" />
                    Save
                  </button>
                  <button
                    onClick={handleCancel}
                    className="flex items-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg transition-colors"
                  >
                    <X className="h-4 w-4" />
                    Cancel
                  </button>
                </>
              ) : (
                <button
                  onClick={() => setIsEditing(true)}
                  className="flex items-center gap-2 text-[#002fa7] hover:text-[#002fa7]/80 font-medium"
                >
                  <Edit3 className="h-4 w-4" />
                  Edit Profile
                </button>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Personal Information */}
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-gray-900 border-b border-gray-200 pb-2">
                Personal Information
              </h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={formData.ownerName}
                    onChange={(e) => handleInputChange('ownerName', e.target.value)}
                    className={isEditing ? inputClass : readOnlyClass}
                    disabled={!isEditing}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    IC Number
                  </label>
                  <input
                    type="text"
                    value={formData.icNumber}
                    onChange={(e) => handleInputChange('icNumber', e.target.value)}
                    className={isEditing ? inputClass : readOnlyClass}
                    disabled={!isEditing}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Position
                  </label>
                  <input
                    type="text"
                    value={formData.position}
                    onChange={(e) => handleInputChange('position', e.target.value)}
                    className={isEditing ? inputClass : readOnlyClass}
                    disabled={!isEditing}
                  />
                </div>
              </div>
            </div>

            {/* Contact Information */}
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-gray-900 border-b border-gray-200 pb-2">
                Contact Information
              </h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={formData.ownerEmail}
                    onChange={(e) => handleInputChange('ownerEmail', e.target.value)}
                    className={isEditing ? inputClass : readOnlyClass}
                    disabled={!isEditing}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    value={formData.ownerPhone}
                    onChange={(e) => handleInputChange('ownerPhone', e.target.value)}
                    className={isEditing ? inputClass : readOnlyClass}
                    disabled={!isEditing}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Address
                  </label>
                  <textarea
                    value={formData.ownerAddress}
                    onChange={(e) => handleInputChange('ownerAddress', e.target.value)}
                    className={isEditing ? inputClass : readOnlyClass}
                    disabled={!isEditing}
                    rows="3"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Face ID Security */}
      <motion.div
        variants={cardVariants}
        initial="hidden"
        animate="visible"
        className="bg-white rounded-xl shadow-sm border border-gray-200"
      >
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Face ID Security</h3>
            <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium ${
              profileData.faceIdStatus === 'active' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'
            }`}>
              {profileData.faceIdStatus === 'active' ? (
                <CheckCircle className="h-4 w-4" />
              ) : (
                <AlertCircle className="h-4 w-4" />
              )}
              <span className="capitalize">{profileData.faceIdStatus}</span>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Face ID Status */}
            <div className="space-y-4">
              <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                <div className="p-3 bg-[#002fa7]/10 rounded-lg">
                  <Shield className="h-6 w-6 text-[#002fa7]" />
                </div>
                <div>
                  <p className="font-medium text-gray-900">Face ID Authentication</p>
                  <p className="text-sm text-gray-500">
                    {profileData.faceIdStatus === 'active' ? 'Enabled and working' : 'Disabled or needs refresh'}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                <div className="p-3 bg-blue-100 rounded-lg">
                  <RefreshCw className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <p className="font-medium text-gray-900">Last Updated</p>
                  <p className="text-sm text-gray-500">
                    {formatDate(profileData.lastFaceIdUpdate)}
                  </p>
                </div>
              </div>
            </div>

            {/* Face ID Controls */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-gray-900">Enable Face ID</p>
                  <p className="text-sm text-gray-500">Use Face ID for secure authentication</p>
                </div>
                <button
                  onClick={() => setFaceIdEnabled(!faceIdEnabled)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    faceIdEnabled ? 'bg-[#002fa7]' : 'bg-gray-200'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      faceIdEnabled ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>

              <button
                onClick={refreshFaceId}
                className="w-full flex items-center justify-center gap-2 bg-[#002fa7] hover:bg-[#002fa7]/90 text-white px-4 py-3 rounded-lg transition-colors"
              >
                <Camera className="h-4 w-4" />
                Refresh Face ID
              </button>

              <div className="text-sm text-gray-500 space-y-1">
                <p>• Face ID provides secure biometric authentication</p>
                <p>• Refresh Face ID if authentication fails</p>
                <p>• Your biometric data is stored securely on device</p>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Account Settings */}
      <motion.div
        variants={cardVariants}
        initial="hidden"
        animate="visible"
        className="bg-white rounded-xl shadow-sm border border-gray-200"
      >
        <div className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Account Settings</h3>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-3">
                <Lock className="h-5 w-5 text-gray-600" />
                <div>
                  <p className="font-medium text-gray-900">Change Password</p>
                  <p className="text-sm text-gray-500">Update your account password</p>
                </div>
              </div>
              <button className="text-[#002fa7] hover:text-[#002fa7]/80 font-medium">
                Change
              </button>
            </div>

            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-3">
                <Shield className="h-5 w-5 text-gray-600" />
                <div>
                  <p className="font-medium text-gray-900">Two-Factor Authentication</p>
                  <p className="text-sm text-gray-500">Add an extra layer of security</p>
                </div>
              </div>
              <button className="text-[#002fa7] hover:text-[#002fa7]/80 font-medium">
                Enable
              </button>
            </div>

            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-3">
                <Settings className="h-5 w-5 text-gray-600" />
                <div>
                  <p className="font-medium text-gray-900">Privacy Settings</p>
                  <p className="text-sm text-gray-500">Manage your data and privacy</p>
                </div>
              </div>
              <button className="text-[#002fa7] hover:text-[#002fa7]/80 font-medium">
                Manage
              </button>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Face ID Modal */}
      {showFaceIdModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            className="bg-white rounded-xl shadow-xl max-w-md w-full p-6"
          >
            <div className="text-center">
              <div className="p-4 bg-[#002fa7]/10 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <Camera className="h-8 w-8 text-[#002fa7]" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Refresh Face ID</h3>
              <p className="text-gray-600 mb-6">
                Position your face in the camera frame to update your Face ID data
              </p>
              
              <div className="flex gap-3">
                <button
                  onClick={() => setShowFaceIdModal(false)}
                  className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => setShowFaceIdModal(false)}
                  className="flex-1 bg-[#002fa7] hover:bg-[#002fa7]/90 text-white px-4 py-2 rounded-lg transition-colors"
                >
                  Start Scan
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
} 