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
import Layout from '../components/Layout';

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

  // Mock identity token data
  const tokenData = {
    token: "0x7f5d3f6a2c3b1e8d4a9c0b5e7f2d1c8a3b6e9f4",
    lastUpdated: "2025-07-10T15:30:00Z",
    businessAccounts: [
      {
        businessName: "ABC Trading Co.",
        logo: "/logos/abc.png",
        accountType: "Business Account",
        status: "Active",
        dateLinked: "2025-07-09T14:20:00Z",
        location: "Kuala Lumpur, MY"
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

  // Don't render dates until client-side
  if (!mounted) {
    return null;
  }

  return (
    <Layout>
      <div className="min-h-screen w-full flex flex-col items-center px-4 sm:px-6 md:px-8 pb-8 pt-28 overflow-hidden">
        <div className="relative z-20 w-full max-w-7xl">
          <div className="flex gap-8">
            {/* Sidebar Navigation */}
            <div className="w-64 shrink-0">
              <div className="sticky top-28 space-y-1">
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
                <button
                  onClick={() => setActiveSection('preferences')}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${
                    activeSection === 'preferences' ? 'bg-[#002fa7] text-white' : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  <Globe className="h-5 w-5" />
                  <span>Preferences</span>
                </button>
              </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 space-y-8">
              {/* Identity Token Section */}
              <section
                id="identity"
                className={`space-y-6 ${activeSection !== 'identity' && 'hidden'}`}
              >
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold text-gray-900">Identity Token</h2>
                </div>

                {/* Token Display */}
                <div className="bg-white border border-gray-200 rounded-2xl p-6 space-y-4 shadow-sm">
                  <div className="space-y-2">
                    <label className="text-sm text-gray-600">Your Identity Token</label>
                    <div className="flex items-center gap-2">
                      <code className="flex-1 font-mono bg-gray-50 px-4 py-2 rounded-xl text-gray-900">
                        {tokenData.token}
                      </code>
                      <button
                        onClick={() => copyToClipboard(tokenData.token)}
                        className="p-2 hover:bg-gray-100 rounded-xl transition-colors text-gray-600"
                      >
                        <Copy className="h-5 w-5" />
                      </button>
                    </div>
                    <p className="text-sm text-gray-500">
                      Created by: {formatDate(tokenData.lastUpdated)}
                    </p>
                  </div>
                </div>

                {/* Usage History */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-gray-900">Business Accounts</h3>
                    <button className="text-sm text-[#002fa7] hover:text-blue-700 transition-colors">
                      View All
                    </button>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {tokenData.businessAccounts.map((business, index) => (
                      <div
                        key={index}
                        className="bg-white border border-gray-200 rounded-2xl p-6 hover:shadow-md transition-all"
                      >
                        <div className="flex items-start gap-4">
                          <img
                            src={business.logo}
                            alt={business.businessName}
                            className="h-12 w-12 rounded-xl object-cover"
                          />
                          <div className="flex-1">
                            <div className="flex items-start justify-between">
                              <div>
                                <h4 className="font-medium text-gray-900">{business.businessName}</h4>
                                <p className="text-sm text-gray-600">{business.accountType}</p>
                              </div>
                              <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full">
                                {business.status}
                              </span>
                            </div>
                            <div className="flex items-center gap-2 mt-2 text-sm text-gray-600">
                              <Building className="h-4 w-4" />
                              {business.location}
                            </div>
                            <p className="text-xs text-gray-500 mt-3">
                              Linked on {formatDate(business.dateLinked)}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}

                    {/* Create Business Account Box */}
                    <button
                      onClick={() => router.push('/business/create')}
                      className="group border-2 border-dashed border-[#002fa7]/20 hover:border-[#002fa7] rounded-2xl p-6 transition-colors h-full min-h-[180px] flex flex-col items-center justify-center gap-3"
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
              </section>

              {/* Other sections would go here */}
              <section className={`space-y-6 ${activeSection !== 'profile' && 'hidden'}`}>
                <h2 className="text-2xl font-bold text-gray-900">Profile Settings</h2>
                {/* Profile settings content */}
              </section>

              <section className={`space-y-6 ${activeSection !== 'security' && 'hidden'}`}>
                <h2 className="text-2xl font-bold text-gray-900">Security Settings</h2>
                {/* Security settings content */}
              </section>

              <section className={`space-y-6 ${activeSection !== 'notifications' && 'hidden'}`}>
                <h2 className="text-2xl font-bold text-gray-900">Notification Preferences</h2>
                {/* Notifications settings content */}
              </section>

              <section className={`space-y-6 ${activeSection !== 'preferences' && 'hidden'}`}>
                <h2 className="text-2xl font-bold text-gray-900">General Preferences</h2>
                {/* Preferences settings content */}
              </section>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default SettingsPage; 