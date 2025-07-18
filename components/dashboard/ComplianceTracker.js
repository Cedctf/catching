import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Shield, 
  CheckCircle, 
  AlertCircle, 
  Clock, 
  XCircle,
  FileText,
  Upload,
  Download,
  Eye,
  RefreshCw,
  Building2,
  CreditCard,
  Users,
  Lock,
  Award,
  AlertTriangle,
  Calendar,
  ArrowRight
} from 'lucide-react';

export default function ComplianceTracker({ businessData, onDataUpdate }) {
  const [selectedCompliance, setSelectedCompliance] = useState(null);
  const [showUploadModal, setShowUploadModal] = useState(false);

  // Mock compliance data
  const complianceItems = [
    {
      id: 'ssm',
      name: 'SSM Registration',
      description: 'Companies Commission of Malaysia registration',
      status: 'verified',
      validUntil: '2025-12-31',
      lastUpdated: '2024-01-15',
      documents: ['SSM Certificate', 'Form 24', 'Form 49'],
      priority: 'high',
      icon: Building2,
      color: 'green'
    },
    {
      id: 'kyc',
      name: 'KYC Verification',
      description: 'Know Your Customer verification',
      status: 'verified',
      validUntil: '2025-06-30',
      lastUpdated: '2024-01-10',
      documents: ['IC Copy', 'Bank Statement', 'Utility Bill'],
      priority: 'high',
      icon: Users,
      color: 'green'
    },
    {
      id: 'psp',
      name: 'PSP License',
      description: 'Payment Service Provider license',
      status: 'pending',
      validUntil: null,
      lastUpdated: '2024-01-20',
      documents: ['Application Form', 'Financial Statements'],
      priority: 'medium',
      icon: CreditCard,
      color: 'yellow'
    },
    {
      id: 'aml',
      name: 'AML Compliance',
      description: 'Anti-Money Laundering compliance',
      status: 'action_required',
      validUntil: '2024-03-31',
      lastUpdated: '2024-01-05',
      documents: ['AML Policy', 'Training Records'],
      priority: 'high',
      icon: Shield,
      color: 'red'
    },
    {
      id: 'data_protection',
      name: 'Data Protection',
      description: 'Personal Data Protection Act compliance',
      status: 'verified',
      validUntil: '2025-01-31',
      lastUpdated: '2024-01-18',
      documents: ['Privacy Policy', 'Data Handling Procedures'],
      priority: 'medium',
      icon: Lock,
      color: 'green'
    },
    {
      id: 'tax',
      name: 'Tax Compliance',
      description: 'Income tax and GST compliance',
      status: 'expiring_soon',
      validUntil: '2024-02-28',
      lastUpdated: '2024-01-12',
      documents: ['Tax Returns', 'GST Registration'],
      priority: 'high',
      icon: FileText,
      color: 'orange'
    }
  ];

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-MY', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'verified': return 'bg-green-100 text-green-600';
      case 'pending': return 'bg-yellow-100 text-yellow-600';
      case 'action_required': return 'bg-red-100 text-red-600';
      case 'expiring_soon': return 'bg-orange-100 text-orange-600';
      case 'expired': return 'bg-red-100 text-red-600';
      default: return 'bg-gray-100 text-gray-600';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'verified': return <CheckCircle className="h-4 w-4" />;
      case 'pending': return <Clock className="h-4 w-4" />;
      case 'action_required': return <AlertCircle className="h-4 w-4" />;
      case 'expiring_soon': return <AlertTriangle className="h-4 w-4" />;
      case 'expired': return <XCircle className="h-4 w-4" />;
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

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: "easeOut" }
    }
  };

  const getComplianceScore = () => {
    const verified = complianceItems.filter(item => item.status === 'verified').length;
    return Math.round((verified / complianceItems.length) * 100);
  };

  const getActionItems = () => {
    return complianceItems.filter(item => 
      item.status === 'action_required' || 
      item.status === 'expiring_soon' || 
      item.status === 'expired'
    );
  };

  return (
    <div className="w-full px-4 xl:px-6">
      <div className="w-full space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Compliance Tracker</h2>
          <p className="text-gray-600">Monitor your regulatory compliance status</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 bg-gray-100 px-4 py-2 rounded-lg">
            <Award className="h-4 w-4 text-gray-600" />
            <span className="text-sm font-medium">Score: {getComplianceScore()}%</span>
          </div>
          <button className="flex items-center gap-2 bg-[#002fa7] hover:bg-[#002fa7]/90 text-white px-4 py-2 rounded-lg transition-colors">
            <RefreshCw className="h-4 w-4" />
            Refresh
          </button>
        </div>
      </div>

      {/* Compliance Score Card */}
      <motion.div
        variants={cardVariants}
        initial="hidden"
        animate="visible"
        className="bg-white rounded-xl shadow-sm border border-gray-200"
      >
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Compliance Overview</h3>
            <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium ${
              getComplianceScore() >= 80 ? 'bg-green-100 text-green-600' : 
              getComplianceScore() >= 60 ? 'bg-yellow-100 text-yellow-600' : 
              'bg-red-100 text-red-600'
            }`}>
              <Shield className="h-4 w-4" />
              <span>{getComplianceScore()}% Compliant</span>
            </div>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-4 gap-4 xl:gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600">
                {complianceItems.filter(item => item.status === 'verified').length}
              </div>
              <div className="text-sm text-gray-600">Verified</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-yellow-600">
                {complianceItems.filter(item => item.status === 'pending').length}
              </div>
              <div className="text-sm text-gray-600">Pending</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-red-600">
                {complianceItems.filter(item => item.status === 'action_required').length}
              </div>
              <div className="text-sm text-gray-600">Action Required</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-orange-600">
                {complianceItems.filter(item => item.status === 'expiring_soon').length}
              </div>
              <div className="text-sm text-gray-600">Expiring Soon</div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Action Items */}
      {getActionItems().length > 0 && (
        <motion.div
          variants={cardVariants}
          initial="hidden"
          animate="visible"
          className="bg-white rounded-xl shadow-sm border border-gray-200"
        >
          <div className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Action Items ({getActionItems().length})
            </h3>
            <div className="space-y-3">
              {getActionItems().map((item) => {
                const Icon = item.icon;
                return (
                  <div key={item.id} className="flex items-center justify-between p-4 bg-red-50 rounded-lg border border-red-200">
                    <div className="flex items-center gap-4">
                      <div className="p-2 bg-red-100 rounded-lg">
                        <Icon className="h-5 w-5 text-red-600" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{item.name}</p>
                        <p className="text-sm text-gray-600">{item.description}</p>
                        {item.validUntil && (
                          <p className="text-xs text-red-600">
                            {item.status === 'expiring_soon' ? 'Expires' : 'Action needed by'}: {formatDate(item.validUntil)}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(item.priority)}`}>
                        {item.priority.toUpperCase()}
                      </div>
                      <button 
                        onClick={() => setSelectedCompliance(item)}
                        className="text-[#002fa7] hover:text-[#002fa7]/80 p-1"
                      >
                        <ArrowRight className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </motion.div>
      )}

      {/* All Compliance Items */}
      <motion.div
        variants={cardVariants}
        initial="hidden"
        animate="visible"
        className="bg-white rounded-xl shadow-sm border border-gray-200"
      >
        <div className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">All Compliance Items</h3>
          <div className="space-y-4">
            {complianceItems.map((item) => {
              const Icon = item.icon;
              return (
                <div key={item.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-gray-100 rounded-lg">
                      <Icon className="h-6 w-6 text-gray-600" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{item.name}</p>
                      <p className="text-sm text-gray-600">{item.description}</p>
                      <div className="flex items-center gap-4 mt-2">
                        <p className="text-xs text-gray-500">
                          Last updated: {formatDate(item.lastUpdated)}
                        </p>
                        {item.validUntil && (
                          <p className="text-xs text-gray-500">
                            Valid until: {formatDate(item.validUntil)}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(item.priority)}`}>
                      {item.priority.toUpperCase()}
                    </div>
                    <div className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(item.status)}`}>
                      {getStatusIcon(item.status)}
                      <span className="capitalize">{item.status.replace('_', ' ')}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <button 
                        onClick={() => setSelectedCompliance(item)}
                        className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-200 rounded-lg transition-colors"
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                      <button 
                        onClick={() => setShowUploadModal(true)}
                        className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-200 rounded-lg transition-colors"
                      >
                        <Upload className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </motion.div>

      {/* Compliance Tips */}
      <motion.div
        variants={cardVariants}
        initial="hidden"
        animate="visible"
        className="bg-white rounded-xl shadow-sm border border-gray-200"
      >
        <div className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Compliance Tips</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-blue-50 rounded-lg">
              <div className="flex items-start gap-3">
                <Calendar className="h-5 w-5 text-blue-600 mt-0.5" />
                <div>
                  <p className="font-medium text-gray-900">Set Reminders</p>
                  <p className="text-sm text-gray-600">
                    Set up automatic reminders 30 days before documents expire
                  </p>
                </div>
              </div>
            </div>
            <div className="p-4 bg-green-50 rounded-lg">
              <div className="flex items-start gap-3">
                <FileText className="h-5 w-5 text-green-600 mt-0.5" />
                <div>
                  <p className="font-medium text-gray-900">Keep Records</p>
                  <p className="text-sm text-gray-600">
                    Maintain digital copies of all compliance documents
                  </p>
                </div>
              </div>
            </div>
            <div className="p-4 bg-yellow-50 rounded-lg">
              <div className="flex items-start gap-3">
                <RefreshCw className="h-5 w-5 text-yellow-600 mt-0.5" />
                <div>
                  <p className="font-medium text-gray-900">Regular Reviews</p>
                  <p className="text-sm text-gray-600">
                    Review compliance status monthly to stay ahead
                  </p>
                </div>
              </div>
            </div>
            <div className="p-4 bg-purple-50 rounded-lg">
              <div className="flex items-start gap-3">
                <Shield className="h-5 w-5 text-purple-600 mt-0.5" />
                <div>
                  <p className="font-medium text-gray-900">Stay Updated</p>
                  <p className="text-sm text-gray-600">
                    Monitor regulatory changes that may affect your business
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Detail Modal */}
      {selectedCompliance && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            className="bg-white rounded-xl shadow-xl max-w-md w-full"
          >
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-gray-900">{selectedCompliance.name}</h3>
                <button
                  onClick={() => setSelectedCompliance(null)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <XCircle className="h-5 w-5 text-gray-500" />
                </button>
              </div>
              
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-600 mb-2">Status</p>
                  <div className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(selectedCompliance.status)}`}>
                    {getStatusIcon(selectedCompliance.status)}
                    <span className="capitalize">{selectedCompliance.status.replace('_', ' ')}</span>
                  </div>
                </div>
                
                <div>
                  <p className="text-sm text-gray-600 mb-2">Description</p>
                  <p className="text-gray-900">{selectedCompliance.description}</p>
                </div>
                
                <div>
                  <p className="text-sm text-gray-600 mb-2">Required Documents</p>
                  <ul className="space-y-1">
                    {selectedCompliance.documents.map((doc, index) => (
                      <li key={index} className="text-sm text-gray-900 flex items-center gap-2">
                        <FileText className="h-3 w-3 text-gray-500" />
                        {doc}
                      </li>
                    ))}
                  </ul>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Last Updated</p>
                    <p className="text-sm text-gray-900">{formatDate(selectedCompliance.lastUpdated)}</p>
                  </div>
                  {selectedCompliance.validUntil && (
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Valid Until</p>
                      <p className="text-sm text-gray-900">{formatDate(selectedCompliance.validUntil)}</p>
                    </div>
                  )}
                </div>
              </div>
              
              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => setSelectedCompliance(null)}
                  className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg transition-colors"
                >
                  Close
                </button>
                <button
                  onClick={() => {
                    setSelectedCompliance(null);
                    setShowUploadModal(true);
                  }}
                  className="flex-1 bg-[#002fa7] hover:bg-[#002fa7]/90 text-white px-4 py-2 rounded-lg transition-colors"
                >
                  Upload Documents
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}

      {/* Upload Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            className="bg-white rounded-xl shadow-xl max-w-md w-full"
          >
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-gray-900">Upload Documents</h3>
                <button
                  onClick={() => setShowUploadModal(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <XCircle className="h-5 w-5 text-gray-500" />
                </button>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Document Type
                  </label>
                  <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#002fa7] focus:border-transparent">
                    <option>Select document type</option>
                    <option>SSM Certificate</option>
                    <option>IC Copy</option>
                    <option>Bank Statement</option>
                    <option>Tax Return</option>
                    <option>Other</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Upload File
                  </label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                    <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                    <p className="text-sm text-gray-600">
                      Drag and drop your file here, or click to browse
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      Supported formats: PDF, JPG, PNG (Max 5MB)
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => setShowUploadModal(false)}
                  className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => setShowUploadModal(false)}
                  className="flex-1 bg-[#002fa7] hover:bg-[#002fa7]/90 text-white px-4 py-2 rounded-lg transition-colors"
                >
                  Upload
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
      </div>
    </div>
  );
} 