import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/router';
import {
  Shield,
  Bell,
  Lock,
  User,
  Globe,
  CreditCard,
  Clock,
  Building,
  ChevronRight,
  ExternalLink,
  Copy,
  Plus
} from 'lucide-react';

// Helper function for consistent date formatting
const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleString('en-US', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: true
  });
};

const SettingsPage = () => {
  const router = useRouter();
  const { section } = router.query;
  const [activeSection, setActiveSection] = useState('identity');
  const [mounted, setMounted] = useState(false);

  // Identity token data from businesses.json
  const tokenData = {
    token: "encrypted_user_token_here",
    lastUpdated: "2025-07-05T00:00:00Z",
    businessAccounts: [
      {
        businessName: "Doe's Bakery",
        logo: "/logos/bakery.png",
        accountType: "Business Account",
        status: "approved",
        dateLinked: "2025-07-05T00:00:00Z",
        location: "456 Bakery St",
        identity_token: "encrypted_business_token_here",
        email: "info@doesbakery.com",
        phone: "+60123456780",
        employees: [
          {
            name: "Alice Smith",
            role: "Manager",
            email: "alice.smith@doesbakery.com"
          },
          {
            name: "Bob Johnson",
            role: "Cashier",
            email: "bob.johnson@doesbakery.com"
          }
        ]
      }
    ]
  };

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (section) {
      setActiveSection(section);
      const element = document.getElementById(section);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  }, [section]);

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 50, rotateX: 15 },
    visible: {
      opacity: 1, y: 0, rotateX: 0,
      transition: { duration: 0.8, ease: [0.25, 0.4, 0.25, 1] }
    }
  };

  // Don't render dates until client-side
  if (!mounted) {
    return null;
  }

  return (
    <div className="relative w-full max-w-7xl mx-auto px-6 py-8">
      <div className="flex gap-8">
        {/* Sidebar Navigation */}
        <div className="w-64 shrink-0">
          <div className="sticky top-8 space-y-1">
            <button
              onClick={() => setActiveSection('profile')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${
                activeSection === 'profile' ? 'bg-[#002fa7] text-white' : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <User className="h-5 w-5" />
              <span>Profile</span>
            </button>
            <button
              onClick={() => setActiveSection('security')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${
                activeSection === 'security' ? 'bg-[#002fa7] text-white' : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <Lock className="h-5 w-5" />
              <span>Security</span>
            </button>
            <button
              onClick={() => setActiveSection('identity')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${
                activeSection === 'identity' ? 'bg-[#002fa7] text-white' : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <Shield className="h-5 w-5" />
              <span>Identity Token</span>
            </button>
            <button
              onClick={() => setActiveSection('notifications')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${
                activeSection === 'notifications' ? 'bg-[#002fa7] text-white' : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <Bell className="h-5 w-5" />
              <span>Notifications</span>
            </button>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 space-y-6">
          {/* Identity Token Section */}
          <section id="identity" className={`space-y-6 ${activeSection !== 'identity' && 'hidden'}`}>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Identity Token</h2>
              <p className="text-gray-600 mt-1">Your unique digital identity for secure transactions</p>
            </div>

            {/* Token Display */}
            <motion.div
              variants={cardVariants}
              initial="hidden"
              animate="visible"
              className="bg-white border border-gray-200 rounded-3xl shadow-lg p-6"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Your Identity Token</h3>
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <Clock className="h-4 w-4" />
                  <span>Updated {formatDate(tokenData.lastUpdated)}</span>
                </div>
              </div>

              <div className="bg-gray-50 rounded-xl p-4 mb-4">
                <div className="flex items-center justify-between">
                  <code className="text-sm font-mono text-gray-900 break-all">
                    {tokenData.token}
                  </code>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => copyToClipboard(tokenData.token)}
                    className="ml-3 p-2 bg-white hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <Copy className="h-4 w-4 text-gray-600" />
                  </motion.button>
                </div>
              </div>

              <div className="text-sm text-gray-600 space-y-2">
                <p>
                  <strong>Security:</strong> This token is encrypted and unique to your identity. Never share it with unauthorized parties.
                </p>
                <p>
                  <strong>Usage:</strong> Used for secure authentication in business transactions and account linking.
                </p>
              </div>
            </motion.div>

            {/* Business Accounts */}
            <motion.div
              variants={cardVariants}
              initial="hidden"
              animate="visible"
              className="bg-white border border-gray-200 rounded-3xl shadow-lg p-6"
            >
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Linked Business Accounts</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {tokenData.businessAccounts.map((business, index) => (
                  <motion.div 
                    key={index} 
                    className="p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors cursor-pointer"
                    onClick={() => router.push('/business/dashboard')}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center">
                          <Building className="w-6 h-6 text-[#002fa7]" />
                        </div>
                        <div>
                          <h4 className="font-medium text-gray-900">{business.businessName}</h4>
                          <p className="text-sm text-gray-500">{business.accountType}</p>
                        </div>
                      </div>
                      <ChevronRight className="h-5 w-5 text-gray-400" />
                    </div>
                    
                    <div className="space-y-3 text-sm">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Status:</span>
                        <span className={`font-medium px-2 py-1 rounded-full text-xs ${
                          business.status === 'approved' ? 'bg-green-100 text-green-600' : 'bg-yellow-100 text-yellow-600'
                        }`}>
                          {business.status.charAt(0).toUpperCase() + business.status.slice(1)}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Linked:</span>
                        <span className="text-gray-900">{formatDate(business.dateLinked)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Location:</span>
                        <span className="text-gray-900">{business.location}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Contact:</span>
                        <span className="text-gray-900">{business.email}</span>
                      </div>
                      <div className="pt-2 border-t border-gray-200">
                        <p className="text-xs font-medium text-gray-600 mb-2">Authorized Employees:</p>
                        <div className="space-y-1">
                          {business.employees.map((employee, i) => (
                            <div key={i} className="flex justify-between items-center">
                              <span className="text-gray-900">{employee.name}</span>
                              <span className="text-xs px-2 py-0.5 bg-[#002fa7]/10 text-[#002fa7] rounded-full">
                                {employee.role}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
                
                <div className="p-4">
                  <button
                    onClick={() => router.push('/business/create')}
                    className="group border-2 border-dashed border-[#002fa7]/20 hover:border-[#002fa7] rounded-2xl p-6 transition-colors h-full min-h-[180px] flex flex-col items-center justify-center gap-3 w-full"
                  >
                    <div className="h-12 w-12 rounded-full bg-[#002fa7]/5 flex items-center justify-center group-hover:bg-[#002fa7]/10 transition-colors">
                      <Plus className="h-6 w-6 text-[#002fa7]" />
                    </div>
                    <div className="text-center">
                      <h4 className="font-medium text-gray-900 group-hover:text-[#002fa7] transition-colors">Create Business Account</h4>
                      <p className="text-sm text-gray-500 mt-1">Link a new business to your identity token</p>
                    </div>
                  </button>
                </div>
              </div>
            </motion.div>
          </section>

          {/* Other sections would go here */}
          <section className={`space-y-6 ${activeSection !== 'profile' && 'hidden'}`}>
            <motion.div
              variants={cardVariants}
              initial="hidden"
              animate="visible"
              className="bg-white border border-gray-200 rounded-3xl shadow-lg p-6"
            >
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Profile Settings</h2>
              <p className="text-gray-600">Manage your profile information and preferences.</p>
            </motion.div>
          </section>

          <section className={`space-y-6 ${activeSection !== 'security' && 'hidden'}`}>
            <motion.div
              variants={cardVariants}
              initial="hidden"
              animate="visible"
              className="bg-white border border-gray-200 rounded-3xl shadow-lg p-6"
            >
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Security Settings</h2>
              <p className="text-gray-600">Configure your security preferences and authentication methods.</p>
            </motion.div>
          </section>

          <section className={`space-y-6 ${activeSection !== 'notifications' && 'hidden'}`}>
            <motion.div
              variants={cardVariants}
              initial="hidden"
              animate="visible"
              className="bg-white border border-gray-200 rounded-3xl shadow-lg p-6"
            >
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Notification Preferences</h2>
              <p className="text-gray-600">Manage how you receive notifications and alerts.</p>
            </motion.div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage; 