import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Wallet, 
  TrendingUp, 
  DollarSign, 
  Award, 
  FileText,
  CheckCircle,
  Clock,
  XCircle,
  AlertCircle,
  Building2,
  Users,
  Calendar,
  ArrowRight,
  ExternalLink,
  Download,
  Upload,
  Info,
  Star,
  Target,
  Zap
} from 'lucide-react';

export default function FinancialAccess({ businessData, onDataUpdate }) {
  const [selectedProgram, setSelectedProgram] = useState(null);
  const [showApplicationModal, setShowApplicationModal] = useState(false);

  // Mock financial access data
  const financialPrograms = [
    {
      id: 'msme_loan',
      name: 'MSME Development Loan',
      provider: 'Bank Rakyat',
      type: 'microcredit',
      amount: '50,000 - 500,000',
      currency: 'MYR',
      interestRate: '3.5% - 6.5%',
      tenure: '1-5 years',
      eligibility: 'qualified',
      status: 'available',
      requirements: [
        'Business registration (SSM)',
        'Minimum 1 year operation',
        'Monthly revenue > RM 10,000',
        'Good credit score'
      ],
      benefits: [
        'Competitive interest rates',
        'Flexible repayment terms',
        'No collateral required',
        'Quick approval process'
      ],
      description: 'Specially designed for micro, small and medium enterprises to support business growth and expansion.',
      applicationDeadline: '2024-12-31',
      processingTime: '7-14 days',
      icon: DollarSign,
      color: 'green'
    },
    {
      id: 'digital_grant',
      name: 'Digital Transformation Grant',
      provider: 'MDEC',
      type: 'grant',
      amount: '10,000 - 100,000',
      currency: 'MYR',
      interestRate: '0%',
      tenure: 'Grant (No repayment)',
      eligibility: 'qualified',
      status: 'available',
      requirements: [
        'Malaysian-owned business',
        'Technology adoption plan',
        'Business digitalization roadmap',
        'Minimum 5 employees'
      ],
      benefits: [
        'No repayment required',
        'Up to 70% funding',
        'Business consultation support',
        'Technology training included'
      ],
      description: 'Government grant to help businesses adopt digital technologies and improve operational efficiency.',
      applicationDeadline: '2024-06-30',
      processingTime: '21-30 days',
      icon: Zap,
      color: 'blue'
    },
    {
      id: 'export_financing',
      name: 'Export Financing Scheme',
      provider: 'Export-Import Bank',
      type: 'credit_facility',
      amount: '100,000 - 2,000,000',
      currency: 'MYR',
      interestRate: '4.0% - 7.0%',
      tenure: '6 months - 2 years',
      eligibility: 'partial',
      status: 'available',
      requirements: [
        'Export license',
        'Confirmed export orders',
        'Minimum 2 years operation',
        'Export experience'
      ],
      benefits: [
        'Pre and post-shipment financing',
        'Letter of credit services',
        'Trade finance solutions',
        'Export credit insurance'
      ],
      description: 'Financial support for businesses engaged in export activities to boost international trade.',
      applicationDeadline: '2024-09-30',
      processingTime: '14-21 days',
      icon: Building2,
      color: 'purple'
    },
    {
      id: 'startup_fund',
      name: 'Startup Development Fund',
      provider: 'Malaysian Investment Development Authority',
      type: 'equity_funding',
      amount: '25,000 - 250,000',
      currency: 'MYR',
      interestRate: 'Equity participation',
      tenure: '3-7 years',
      eligibility: 'not_qualified',
      status: 'available',
      requirements: [
        'Technology-based business',
        'Less than 5 years operation',
        'Innovative product/service',
        'Scalable business model'
      ],
      benefits: [
        'Equity investment',
        'Business mentorship',
        'Market access support',
        'Networking opportunities'
      ],
      description: 'Equity funding for innovative startups with high growth potential and scalable business models.',
      applicationDeadline: '2024-08-31',
      processingTime: '30-45 days',
      icon: Target,
      color: 'orange'
    }
  ];

  const currentApplications = [
    {
      id: 'app_001',
      programName: 'MSME Development Loan',
      provider: 'Bank Rakyat',
      appliedDate: '2024-01-15',
      status: 'under_review',
      amount: '200,000',
      nextAction: 'Waiting for document verification',
      expectedDecision: '2024-02-15'
    },
    {
      id: 'app_002',
      programName: 'Digital Transformation Grant',
      provider: 'MDEC',
      appliedDate: '2024-01-10',
      status: 'approved',
      amount: '50,000',
      nextAction: 'Sign agreement documents',
      expectedDecision: '2024-01-25'
    }
  ];

  const formatCurrency = (amount) => {
    return `RM ${amount.toLocaleString()}`;
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-MY', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getEligibilityColor = (eligibility) => {
    switch (eligibility) {
      case 'qualified': return 'bg-green-100 text-green-600';
      case 'partial': return 'bg-yellow-100 text-yellow-600';
      case 'not_qualified': return 'bg-red-100 text-red-600';
      default: return 'bg-gray-100 text-gray-600';
    }
  };

  const getEligibilityIcon = (eligibility) => {
    switch (eligibility) {
      case 'qualified': return <CheckCircle className="h-4 w-4" />;
      case 'partial': return <AlertCircle className="h-4 w-4" />;
      case 'not_qualified': return <XCircle className="h-4 w-4" />;
      default: return <Clock className="h-4 w-4" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'approved': return 'bg-green-100 text-green-600';
      case 'under_review': return 'bg-yellow-100 text-yellow-600';
      case 'rejected': return 'bg-red-100 text-red-600';
      case 'pending': return 'bg-blue-100 text-blue-600';
      default: return 'bg-gray-100 text-gray-600';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'approved': return <CheckCircle className="h-4 w-4" />;
      case 'under_review': return <Clock className="h-4 w-4" />;
      case 'rejected': return <XCircle className="h-4 w-4" />;
      case 'pending': return <Clock className="h-4 w-4" />;
      default: return <Clock className="h-4 w-4" />;
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

  const getEligibilityScore = () => {
    const qualified = financialPrograms.filter(p => p.eligibility === 'qualified').length;
    const partial = financialPrograms.filter(p => p.eligibility === 'partial').length;
    return Math.round(((qualified * 1 + partial * 0.5) / financialPrograms.length) * 100);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Financial Access</h2>
          <p className="text-gray-600">Explore funding opportunities for your business</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 bg-gray-100 px-4 py-2 rounded-lg">
            <Star className="h-4 w-4 text-gray-600" />
            <span className="text-sm font-medium">Eligibility Score: {getEligibilityScore()}%</span>
          </div>
          <button className="flex items-center gap-2 bg-[#002fa7] hover:bg-[#002fa7]/90 text-white px-4 py-2 rounded-lg transition-colors">
            <Download className="h-4 w-4" />
            Download Guide
          </button>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <motion.div
          variants={cardVariants}
          initial="hidden"
          animate="visible"
          className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
        >
          <div className="flex items-center gap-4">
            <div className="p-3 bg-green-100 rounded-lg">
              <CheckCircle className="h-6 w-6 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Qualified Programs</p>
              <p className="text-2xl font-bold text-gray-900">
                {financialPrograms.filter(p => p.eligibility === 'qualified').length}
              </p>
            </div>
          </div>
        </motion.div>

        <motion.div
          variants={cardVariants}
          initial="hidden"
          animate="visible"
          className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
        >
          <div className="flex items-center gap-4">
            <div className="p-3 bg-blue-100 rounded-lg">
              <FileText className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Active Applications</p>
              <p className="text-2xl font-bold text-gray-900">
                {currentApplications.length}
              </p>
            </div>
          </div>
        </motion.div>

        <motion.div
          variants={cardVariants}
          initial="hidden"
          animate="visible"
          className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
        >
          <div className="flex items-center gap-4">
            <div className="p-3 bg-purple-100 rounded-lg">
              <TrendingUp className="h-6 w-6 text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Potential Funding</p>
              <p className="text-2xl font-bold text-gray-900">
                RM 650K
              </p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Current Applications */}
      {currentApplications.length > 0 && (
        <motion.div
          variants={cardVariants}
          initial="hidden"
          animate="visible"
          className="bg-white rounded-xl shadow-sm border border-gray-200"
        >
          <div className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Current Applications</h3>
            <div className="space-y-4">
              {currentApplications.map((app) => (
                <div key={app.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-4">
                    <div className="p-2 bg-white rounded-lg border border-gray-200">
                      <FileText className="h-5 w-5 text-gray-600" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{app.programName}</p>
                      <p className="text-sm text-gray-600">{app.provider}</p>
                      <p className="text-sm text-gray-500">
                        Applied: {formatDate(app.appliedDate)} • Amount: {formatCurrency(app.amount)}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <div className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(app.status)}`}>
                        {getStatusIcon(app.status)}
                        <span className="capitalize">{app.status.replace('_', ' ')}</span>
                      </div>
                      <p className="text-xs text-gray-500 mt-1">{app.nextAction}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      )}

      {/* Available Programs */}
      <motion.div
        variants={cardVariants}
        initial="hidden"
        animate="visible"
        className="bg-white rounded-xl shadow-sm border border-gray-200"
      >
        <div className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Available Programs</h3>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {financialPrograms.map((program) => {
              const Icon = program.icon;
              return (
                <div key={program.id} className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-lg ${
                        program.color === 'green' ? 'bg-green-100' :
                        program.color === 'blue' ? 'bg-blue-100' :
                        program.color === 'purple' ? 'bg-purple-100' :
                        'bg-orange-100'
                      }`}>
                        <Icon className={`h-5 w-5 ${
                          program.color === 'green' ? 'text-green-600' :
                          program.color === 'blue' ? 'text-blue-600' :
                          program.color === 'purple' ? 'text-purple-600' :
                          'text-orange-600'
                        }`} />
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900">{program.name}</h4>
                        <p className="text-sm text-gray-600">{program.provider}</p>
                      </div>
                    </div>
                    <div className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${getEligibilityColor(program.eligibility)}`}>
                      {getEligibilityIcon(program.eligibility)}
                      <span className="capitalize">{program.eligibility.replace('_', ' ')}</span>
                    </div>
                  </div>

                  <p className="text-sm text-gray-600 mb-4">{program.description}</p>

                  <div className="space-y-2 mb-4">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Amount:</span>
                      <span className="font-medium">{program.amount} {program.currency}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Interest Rate:</span>
                      <span className="font-medium">{program.interestRate}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Tenure:</span>
                      <span className="font-medium">{program.tenure}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Processing Time:</span>
                      <span className="font-medium">{program.processingTime}</span>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => setSelectedProgram(program)}
                      className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg transition-colors text-sm"
                    >
                      View Details
                    </button>
                    <button
                      onClick={() => setShowApplicationModal(true)}
                      disabled={program.eligibility === 'not_qualified'}
                      className={`flex-1 px-4 py-2 rounded-lg transition-colors text-sm ${
                        program.eligibility === 'not_qualified'
                          ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                          : 'bg-[#002fa7] hover:bg-[#002fa7]/90 text-white'
                      }`}
                    >
                      Apply Now
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </motion.div>

      {/* Financial Tips */}
      <motion.div
        variants={cardVariants}
        initial="hidden"
        animate="visible"
        className="bg-white rounded-xl shadow-sm border border-gray-200"
      >
        <div className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Financial Tips</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-blue-50 rounded-lg">
              <div className="flex items-start gap-3">
                <Info className="h-5 w-5 text-blue-600 mt-0.5" />
                <div>
                  <p className="font-medium text-gray-900">Prepare Your Documents</p>
                  <p className="text-sm text-gray-600">
                    Keep all business documents updated and readily available for applications
                  </p>
                </div>
              </div>
            </div>
            <div className="p-4 bg-green-50 rounded-lg">
              <div className="flex items-start gap-3">
                <TrendingUp className="h-5 w-5 text-green-600 mt-0.5" />
                <div>
                  <p className="font-medium text-gray-900">Improve Your Score</p>
                  <p className="text-sm text-gray-600">
                    Maintain good financial records and credit history to improve eligibility
                  </p>
                </div>
              </div>
            </div>
            <div className="p-4 bg-yellow-50 rounded-lg">
              <div className="flex items-start gap-3">
                <Calendar className="h-5 w-5 text-yellow-600 mt-0.5" />
                <div>
                  <p className="font-medium text-gray-900">Watch Deadlines</p>
                  <p className="text-sm text-gray-600">
                    Monitor application deadlines and submit applications early
                  </p>
                </div>
              </div>
            </div>
            <div className="p-4 bg-purple-50 rounded-lg">
              <div className="flex items-start gap-3">
                <FileText className="h-5 w-5 text-purple-600 mt-0.5" />
                <div>
                  <p className="font-medium text-gray-900">Diversify Sources</p>
                  <p className="text-sm text-gray-600">
                    Consider multiple funding sources to reduce dependency on single programs
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Program Detail Modal */}
      {selectedProgram && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
          >
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-gray-900">{selectedProgram.name}</h3>
                <button
                  onClick={() => setSelectedProgram(null)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <XCircle className="h-5 w-5 text-gray-500" />
                </button>
              </div>

              <div className="space-y-6">
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Program Details</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-600">Provider</p>
                      <p className="font-medium">{selectedProgram.provider}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Type</p>
                      <p className="font-medium capitalize">{selectedProgram.type.replace('_', ' ')}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Amount</p>
                      <p className="font-medium">{selectedProgram.amount} {selectedProgram.currency}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Interest Rate</p>
                      <p className="font-medium">{selectedProgram.interestRate}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Tenure</p>
                      <p className="font-medium">{selectedProgram.tenure}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Processing Time</p>
                      <p className="font-medium">{selectedProgram.processingTime}</p>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Requirements</h4>
                  <ul className="space-y-1">
                    {selectedProgram.requirements.map((req, index) => (
                      <li key={index} className="text-sm text-gray-600 flex items-center gap-2">
                        <CheckCircle className="h-3 w-3 text-green-500" />
                        {req}
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Benefits</h4>
                  <ul className="space-y-1">
                    {selectedProgram.benefits.map((benefit, index) => (
                      <li key={index} className="text-sm text-gray-600 flex items-center gap-2">
                        <Star className="h-3 w-3 text-yellow-500" />
                        {benefit}
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Important Dates</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-600">Application Deadline</p>
                      <p className="font-medium">{formatDate(selectedProgram.applicationDeadline)}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Expected Decision</p>
                      <p className="font-medium">{selectedProgram.processingTime}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => setSelectedProgram(null)}
                  className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg transition-colors"
                >
                  Close
                </button>
                <button
                  onClick={() => {
                    setSelectedProgram(null);
                    setShowApplicationModal(true);
                  }}
                  disabled={selectedProgram.eligibility === 'not_qualified'}
                  className={`flex-1 px-4 py-2 rounded-lg transition-colors ${
                    selectedProgram.eligibility === 'not_qualified'
                      ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                      : 'bg-[#002fa7] hover:bg-[#002fa7]/90 text-white'
                  }`}
                >
                  Apply Now
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}

      {/* Application Modal */}
      {showApplicationModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            className="bg-white rounded-xl shadow-xl max-w-md w-full"
          >
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-gray-900">Start Application</h3>
                <button
                  onClick={() => setShowApplicationModal(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <XCircle className="h-5 w-5 text-gray-500" />
                </button>
              </div>

              <div className="text-center">
                <div className="p-4 bg-[#002fa7]/10 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                  <FileText className="h-8 w-8 text-[#002fa7]" />
                </div>
                <h4 className="text-lg font-semibold text-gray-900 mb-2">Application Process</h4>
                <p className="text-gray-600 mb-6">
                  You will be redirected to the external application portal to complete your application.
                </p>
                
                <div className="space-y-3 mb-6">
                  <div className="flex items-center gap-3 text-sm text-gray-600">
                    <div className="w-6 h-6 bg-[#002fa7] text-white rounded-full flex items-center justify-center text-xs">1</div>
                    <span>Fill application form</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm text-gray-600">
                    <div className="w-6 h-6 bg-[#002fa7] text-white rounded-full flex items-center justify-center text-xs">2</div>
                    <span>Upload required documents</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm text-gray-600">
                    <div className="w-6 h-6 bg-[#002fa7] text-white rounded-full flex items-center justify-center text-xs">3</div>
                    <span>Submit application</span>
                  </div>
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={() => setShowApplicationModal(false)}
                    className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => setShowApplicationModal(false)}
                    className="flex-1 bg-[#002fa7] hover:bg-[#002fa7]/90 text-white px-4 py-2 rounded-lg transition-colors flex items-center justify-center gap-2"
                  >
                    <ExternalLink className="h-4 w-4" />
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