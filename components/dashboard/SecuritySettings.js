import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Shield, 
  Lock, 
  Smartphone, 
  Monitor, 
  Globe, 
  Eye,
  EyeOff,
  Key,
  Camera,
  RefreshCw,
  LogOut,
  AlertTriangle,
  CheckCircle,
  Clock,
  MapPin,
  Calendar,
  Settings,
  Bell,
  Wifi,
  WifiOff,
  Trash2,
  Edit3,
  X,
  Plus,
  Download,
  Upload,
  Activity,
  History,
  Fingerprint
} from 'lucide-react';

export default function SecuritySettings({ businessData, onDataUpdate }) {
  const [activeSection, setActiveSection] = useState('overview');
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [showFaceIdModal, setShowFaceIdModal] = useState(false);
  const [show2FAModal, setShow2FAModal] = useState(false);
  const [faceIdEnabled, setFaceIdEnabled] = useState(true);
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);

  // Mock security data
  const securityOverview = {
    lastPasswordChange: '2024-01-15T10:30:00Z',
    faceIdStatus: 'active',
    twoFactorStatus: 'disabled',
    trustedDevices: 3,
    activeSessions: 2,
    securityScore: 85,
    lastSecurityScan: '2024-01-20T09:00:00Z'
  };

  const loginHistory = [
    {
      id: 'login_001',
      timestamp: '2024-01-20T14:30:00Z',
      device: 'iPhone 15 Pro',
      browser: 'Safari',
      location: 'Kuala Lumpur, Malaysia',
      ipAddress: '203.192.123.45',
      status: 'success',
      method: 'face_id'
    },
    {
      id: 'login_002',
      timestamp: '2024-01-20T09:15:00Z',
      device: 'MacBook Pro',
      browser: 'Chrome',
      location: 'Kuala Lumpur, Malaysia',
      ipAddress: '203.192.123.45',
      status: 'success',
      method: 'password'
    },
    {
      id: 'login_003',
      timestamp: '2024-01-19T16:45:00Z',
      device: 'Windows PC',
      browser: 'Edge',
      location: 'Shah Alam, Malaysia',
      ipAddress: '203.192.156.78',
      status: 'failed',
      method: 'password'
    },
    {
      id: 'login_004',
      timestamp: '2024-01-19T11:20:00Z',
      device: 'iPad Air',
      browser: 'Safari',
      location: 'Kuala Lumpur, Malaysia',
      ipAddress: '203.192.123.45',
      status: 'success',
      method: 'face_id'
    },
    {
      id: 'login_005',
      timestamp: '2024-01-18T18:30:00Z',
      device: 'Samsung Galaxy S23',
      browser: 'Chrome',
      location: 'Petaling Jaya, Malaysia',
      ipAddress: '203.192.167.89',
      status: 'success',
      method: 'password'
    }
  ];

  const activeSessions = [
    {
      id: 'session_001',
      device: 'iPhone 15 Pro',
      browser: 'Safari 17.2',
      location: 'Kuala Lumpur, Malaysia',
      ipAddress: '203.192.123.45',
      lastActive: '2024-01-20T14:30:00Z',
      current: true
    },
    {
      id: 'session_002',
      device: 'MacBook Pro',
      browser: 'Chrome 120.0',
      location: 'Kuala Lumpur, Malaysia',
      ipAddress: '203.192.123.45',
      lastActive: '2024-01-20T09:15:00Z',
      current: false
    },
    {
      id: 'session_003',
      device: 'iPad Air',
      browser: 'Safari 17.2',
      location: 'Kuala Lumpur, Malaysia',
      ipAddress: '203.192.123.45',
      lastActive: '2024-01-19T20:45:00Z',
      current: false
    }
  ];

  const securityRecommendations = [
    {
      id: 'rec_001',
      title: 'Enable Two-Factor Authentication',
      description: 'Add an extra layer of security to your account',
      priority: 'high',
      status: 'pending'
    },
    {
      id: 'rec_002',
      title: 'Update Password',
      description: 'Your password was last changed 30 days ago',
      priority: 'medium',
      status: 'pending'
    },
    {
      id: 'rec_003',
      title: 'Review Login History',
      description: 'Check recent login attempts for suspicious activity',
      priority: 'low',
      status: 'completed'
    }
  ];

  const formatDateTime = (dateString) => {
    return new Date(dateString).toLocaleString('en-MY', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'success': return 'bg-green-100 text-green-600';
      case 'failed': return 'bg-red-100 text-red-600';
      case 'pending': return 'bg-yellow-100 text-yellow-600';
      case 'active': return 'bg-green-100 text-green-600';
      default: return 'bg-gray-100 text-gray-600';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'success': return <CheckCircle className="h-4 w-4" />;
      case 'failed': return <X className="h-4 w-4" />;
      case 'pending': return <Clock className="h-4 w-4" />;
      case 'active': return <CheckCircle className="h-4 w-4" />;
      default: return <Clock className="h-4 w-4" />;
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-600';
      case 'medium': return 'bg-yellow-100 text-yellow-600';
      case 'low': return 'bg-green-100 text-green-600';
      default: return 'bg-gray-100 text-gray-600';
    }
  };

  const getDeviceIcon = (device) => {
    if (device.includes('iPhone') || device.includes('iPad')) {
      return <Smartphone className="h-5 w-5" />;
    } else if (device.includes('Mac') || device.includes('Windows')) {
      return <Monitor className="h-5 w-5" />;
    } else {
      return <Globe className="h-5 w-5" />;
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: "easeOut" }
    }
  };

  const sections = [
    { id: 'overview', label: 'Overview', icon: Shield },
    { id: 'login_history', label: 'Login History', icon: History },
    { id: 'sessions', label: 'Active Sessions', icon: Monitor },
    { id: 'settings', label: 'Security Settings', icon: Settings }
  ];

  const handleLogoutSession = (sessionId) => {
    console.log('Logging out session:', sessionId);
  };

  const handleRefreshFaceId = () => {
    setShowFaceIdModal(true);
  };

  const handleEnable2FA = () => {
    setShow2FAModal(true);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Security Settings</h2>
          <p className="text-gray-600">Manage your account security and access</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 bg-gray-100 px-4 py-2 rounded-lg">
            <Shield className="h-4 w-4 text-gray-600" />
            <span className="text-sm font-medium">Security Score: {securityOverview.securityScore}%</span>
          </div>
          <button className="flex items-center gap-2 bg-[#002fa7] hover:bg-[#002fa7]/90 text-white px-4 py-2 rounded-lg transition-colors">
            <Download className="h-4 w-4" />
            Export Log
          </button>
        </div>
      </div>

      {/* Section Navigation */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-2">
        <div className="flex flex-wrap gap-2">
          {sections.map((section) => {
            const Icon = section.icon;
            return (
              <button
                key={section.id}
                onClick={() => setActiveSection(section.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  activeSection === section.id
                    ? 'bg-[#002fa7] text-white'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <Icon className="h-4 w-4" />
                {section.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Overview Section */}
      {activeSection === 'overview' && (
        <div className="space-y-6">
          {/* Security Score Card */}
          <motion.div
            variants={cardVariants}
            initial="hidden"
            animate="visible"
            className="bg-white rounded-xl shadow-sm border border-gray-200"
          >
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900">Security Overview</h3>
                <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium ${
                  securityOverview.securityScore >= 80 ? 'bg-green-100 text-green-600' : 
                  securityOverview.securityScore >= 60 ? 'bg-yellow-100 text-yellow-600' : 
                  'bg-red-100 text-red-600'
                }`}>
                  <Shield className="h-4 w-4" />
                  <span>{securityOverview.securityScore}% Secure</span>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">
                    {securityOverview.trustedDevices}
                  </div>
                  <div className="text-sm text-gray-600">Trusted Devices</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">
                    {securityOverview.activeSessions}
                  </div>
                  <div className="text-sm text-gray-600">Active Sessions</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-yellow-600">
                    {securityRecommendations.filter(r => r.status === 'pending').length}
                  </div>
                  <div className="text-sm text-gray-600">Pending Actions</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-600">
                    {loginHistory.filter(l => l.status === 'success').length}
                  </div>
                  <div className="text-sm text-gray-600">Recent Logins</div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Security Recommendations */}
          <motion.div
            variants={cardVariants}
            initial="hidden"
            animate="visible"
            className="bg-white rounded-xl shadow-sm border border-gray-200"
          >
            <div className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-6">Security Recommendations</h3>
              <div className="space-y-4">
                {securityRecommendations.map((rec) => (
                  <div key={rec.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-4">
                      <div className="p-2 bg-white rounded-lg border border-gray-200">
                        <AlertTriangle className="h-5 w-5 text-yellow-600" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{rec.title}</p>
                        <p className="text-sm text-gray-600">{rec.description}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(rec.priority)}`}>
                        {rec.priority.toUpperCase()}
                      </div>
                      <div className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(rec.status)}`}>
                        {getStatusIcon(rec.status)}
                        <span className="capitalize">{rec.status}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Quick Actions */}
          <motion.div
            variants={cardVariants}
            initial="hidden"
            animate="visible"
            className="bg-white rounded-xl shadow-sm border border-gray-200"
          >
            <div className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <button
                  onClick={() => setShowPasswordModal(true)}
                  className="flex flex-col items-center gap-2 p-4 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
                >
                  <Lock className="h-6 w-6 text-blue-600" />
                  <span className="text-sm font-medium text-gray-900">Change Password</span>
                </button>
                <button
                  onClick={handleRefreshFaceId}
                  className="flex flex-col items-center gap-2 p-4 bg-green-50 rounded-lg hover:bg-green-100 transition-colors"
                >
                  <Camera className="h-6 w-6 text-green-600" />
                  <span className="text-sm font-medium text-gray-900">Refresh Face ID</span>
                </button>
                <button
                  onClick={handleEnable2FA}
                  className="flex flex-col items-center gap-2 p-4 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors"
                >
                  <Shield className="h-6 w-6 text-purple-600" />
                  <span className="text-sm font-medium text-gray-900">Enable 2FA</span>
                </button>
                <button className="flex flex-col items-center gap-2 p-4 bg-orange-50 rounded-lg hover:bg-orange-100 transition-colors">
                  <Activity className="h-6 w-6 text-orange-600" />
                  <span className="text-sm font-medium text-gray-900">Security Scan</span>
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}

      {/* Login History Section */}
      {activeSection === 'login_history' && (
        <motion.div
          variants={cardVariants}
          initial="hidden"
          animate="visible"
          className="bg-white rounded-xl shadow-sm border border-gray-200"
        >
          <div className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Login History</h3>
            <div className="space-y-4">
              {loginHistory.map((login) => (
                <div key={login.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-4">
                    <div className="p-2 bg-white rounded-lg border border-gray-200">
                      {getDeviceIcon(login.device)}
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{login.device}</p>
                      <p className="text-sm text-gray-600">{login.browser}</p>
                      <div className="flex items-center gap-2 text-sm text-gray-500">
                        <MapPin className="h-3 w-3" />
                        <span>{login.location}</span>
                        <span>•</span>
                        <span>{login.ipAddress}</span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-900">{formatDateTime(login.timestamp)}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <div className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(login.status)}`}>
                        {getStatusIcon(login.status)}
                        <span className="capitalize">{login.status}</span>
                      </div>
                      <span className="text-xs text-gray-500 capitalize">{login.method.replace('_', ' ')}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      )}

      {/* Active Sessions Section */}
      {activeSection === 'sessions' && (
        <motion.div
          variants={cardVariants}
          initial="hidden"
          animate="visible"
          className="bg-white rounded-xl shadow-sm border border-gray-200"
        >
          <div className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Active Sessions</h3>
            <div className="space-y-4">
              {activeSessions.map((session) => (
                <div key={session.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-4">
                    <div className="p-2 bg-white rounded-lg border border-gray-200">
                      {getDeviceIcon(session.device)}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="font-medium text-gray-900">{session.device}</p>
                        {session.current && (
                          <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-600">
                            <Wifi className="h-3 w-3" />
                            Current
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-gray-600">{session.browser}</p>
                      <div className="flex items-center gap-2 text-sm text-gray-500">
                        <MapPin className="h-3 w-3" />
                        <span>{session.location}</span>
                        <span>•</span>
                        <span>{session.ipAddress}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <p className="text-sm text-gray-900">Last Active</p>
                      <p className="text-sm text-gray-500">{formatDateTime(session.lastActive)}</p>
                    </div>
                    {!session.current && (
                      <button
                        onClick={() => handleLogoutSession(session.id)}
                        className="p-2 text-red-600 hover:text-red-800 hover:bg-red-100 rounded-lg transition-colors"
                      >
                        <LogOut className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      )}

      {/* Security Settings Section */}
      {activeSection === 'settings' && (
        <div className="space-y-6">
          {/* Authentication Settings */}
          <motion.div
            variants={cardVariants}
            initial="hidden"
            animate="visible"
            className="bg-white rounded-xl shadow-sm border border-gray-200"
          >
            <div className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-6">Authentication Settings</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <Camera className="h-5 w-5 text-gray-600" />
                    <div>
                      <p className="font-medium text-gray-900">Face ID</p>
                      <p className="text-sm text-gray-500">Use Face ID for secure authentication</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
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
                    <button
                      onClick={handleRefreshFaceId}
                      className="text-[#002fa7] hover:text-[#002fa7]/80 text-sm font-medium"
                    >
                      Refresh
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <Shield className="h-5 w-5 text-gray-600" />
                    <div>
                      <p className="font-medium text-gray-900">Two-Factor Authentication</p>
                      <p className="text-sm text-gray-500">Add an extra layer of security</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => setTwoFactorEnabled(!twoFactorEnabled)}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                        twoFactorEnabled ? 'bg-[#002fa7]' : 'bg-gray-200'
                      }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                          twoFactorEnabled ? 'translate-x-6' : 'translate-x-1'
                        }`}
                      />
                    </button>
                    <button
                      onClick={handleEnable2FA}
                      className="text-[#002fa7] hover:text-[#002fa7]/80 text-sm font-medium"
                    >
                      Setup
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <Lock className="h-5 w-5 text-gray-600" />
                    <div>
                      <p className="font-medium text-gray-900">Password</p>
                      <p className="text-sm text-gray-500">
                        Last changed: {formatDateTime(securityOverview.lastPasswordChange)}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => setShowPasswordModal(true)}
                    className="text-[#002fa7] hover:text-[#002fa7]/80 text-sm font-medium"
                  >
                    Change Password
                  </button>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Privacy Settings */}
          <motion.div
            variants={cardVariants}
            initial="hidden"
            animate="visible"
            className="bg-white rounded-xl shadow-sm border border-gray-200"
          >
            <div className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-6">Privacy Settings</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <Activity className="h-5 w-5 text-gray-600" />
                    <div>
                      <p className="font-medium text-gray-900">Login Notifications</p>
                      <p className="text-sm text-gray-500">Get notified of new login attempts</p>
                    </div>
                  </div>
                  <button className="relative inline-flex h-6 w-11 items-center rounded-full bg-[#002fa7]">
                    <span className="inline-block h-4 w-4 transform rounded-full bg-white translate-x-6" />
                  </button>
                </div>

                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <Globe className="h-5 w-5 text-gray-600" />
                    <div>
                      <p className="font-medium text-gray-900">Location Tracking</p>
                      <p className="text-sm text-gray-500">Track login locations for security</p>
                    </div>
                  </div>
                  <button className="relative inline-flex h-6 w-11 items-center rounded-full bg-[#002fa7]">
                    <span className="inline-block h-4 w-4 transform rounded-full bg-white translate-x-6" />
                  </button>
                </div>

                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <History className="h-5 w-5 text-gray-600" />
                    <div>
                      <p className="font-medium text-gray-900">Login History</p>
                      <p className="text-sm text-gray-500">Keep detailed login records</p>
                    </div>
                  </div>
                  <button className="relative inline-flex h-6 w-11 items-center rounded-full bg-[#002fa7]">
                    <span className="inline-block h-4 w-4 transform rounded-full bg-white translate-x-6" />
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}

      {/* Password Change Modal */}
      {showPasswordModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            className="bg-white rounded-xl shadow-xl max-w-md w-full"
          >
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-gray-900">Change Password</h3>
                <button
                  onClick={() => setShowPasswordModal(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X className="h-5 w-5 text-gray-500" />
                </button>
              </div>

              <form className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Current Password
                  </label>
                  <input
                    type="password"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#002fa7] focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    New Password
                  </label>
                  <input
                    type="password"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#002fa7] focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Confirm New Password
                  </label>
                  <input
                    type="password"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#002fa7] focus:border-transparent"
                  />
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowPasswordModal(false)}
                    className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 bg-[#002fa7] hover:bg-[#002fa7]/90 text-white px-4 py-2 rounded-lg transition-colors"
                  >
                    Change Password
                  </button>
                </div>
              </form>
            </div>
          </motion.div>
        </div>
      )}

      {/* Face ID Modal */}
      {showFaceIdModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            className="bg-white rounded-xl shadow-xl max-w-md w-full"
          >
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-gray-900">Refresh Face ID</h3>
                <button
                  onClick={() => setShowFaceIdModal(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X className="h-5 w-5 text-gray-500" />
                </button>
              </div>

              <div className="text-center">
                <div className="p-4 bg-[#002fa7]/10 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                  <Camera className="h-8 w-8 text-[#002fa7]" />
                </div>
                <h4 className="text-lg font-semibold text-gray-900 mb-2">Update Face ID</h4>
                <p className="text-gray-600 mb-6">
                  Position your face in the camera frame to update your Face ID data for better recognition.
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
            </div>
          </motion.div>
        </div>
      )}

      {/* 2FA Setup Modal */}
      {show2FAModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            className="bg-white rounded-xl shadow-xl max-w-md w-full"
          >
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-gray-900">Setup 2FA</h3>
                <button
                  onClick={() => setShow2FAModal(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X className="h-5 w-5 text-gray-500" />
                </button>
              </div>

              <div className="text-center">
                <div className="p-4 bg-[#002fa7]/10 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                  <Shield className="h-8 w-8 text-[#002fa7]" />
                </div>
                <h4 className="text-lg font-semibold text-gray-900 mb-2">Two-Factor Authentication</h4>
                <p className="text-gray-600 mb-6">
                  Add an extra layer of security to your account with SMS or authenticator app verification.
                </p>
                
                <div className="space-y-3 mb-6">
                  <button className="w-full flex items-center justify-center gap-3 p-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                    <Smartphone className="h-5 w-5 text-gray-600" />
                    <span>SMS Verification</span>
                  </button>
                  <button className="w-full flex items-center justify-center gap-3 p-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                    <Key className="h-5 w-5 text-gray-600" />
                    <span>Authenticator App</span>
                  </button>
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={() => setShow2FAModal(false)}
                    className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => setShow2FAModal(false)}
                    className="flex-1 bg-[#002fa7] hover:bg-[#002fa7]/90 text-white px-4 py-2 rounded-lg transition-colors"
                  >
                    Continue
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
} 