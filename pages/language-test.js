import React from 'react';
import { useTranslation } from 'react-i18next';
import { Globe, CheckCircle, ArrowRight, Languages } from 'lucide-react';
import Link from 'next/link';

export default function LanguageTest() {
  const { t, i18n } = useTranslation();

  const testTranslations = [
    { key: 'hero.title', label: 'Hero Title' },
    { key: 'hero.titleHighlight', label: 'Hero Title Highlight' },
    { key: 'nav.signup', label: 'Navigation Signup' },
    { key: 'nav.login', label: 'Navigation Login' },
    { key: 'nav.payNow', label: 'Navigation Pay Now' },
    { key: 'features.title', label: 'Features Title' },
    { key: 'features.faceRecognition.title', label: 'Face Recognition Title' },
    { key: 'dashboard.title', label: 'Dashboard Title' },
    { key: 'common.success', label: 'Common Success' },
    { key: 'footer.copyright', label: 'Footer Copyright' }
  ];

  const currentLang = i18n.language;
  const langNames = {
    'en': 'English',
    'zh': 'Chinese (Simplified)',
    'ms': 'Bahasa Melayu'
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Languages className="w-10 h-10 text-blue-600" />
            <h1 className="text-4xl font-bold text-gray-900">Language Switcher Test</h1>
          </div>
          <p className="text-lg text-gray-600 mb-6">
            Test the global language switcher functionality
          </p>
          <div className="inline-flex items-center gap-2 px-6 py-3 bg-green-100 text-green-800 rounded-full border border-green-200">
            <CheckCircle className="w-5 h-5" />
            <span className="font-medium">
              Current Language: {langNames[currentLang] || currentLang}
            </span>
          </div>
        </div>

        {/* Instructions */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8 border border-gray-200">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Globe className="w-6 h-6 text-blue-600" />
            How to Test
          </h2>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <h3 className="font-semibold text-gray-800 mb-2">Step 1: Find the Language Switcher</h3>
              <p className="text-gray-600 text-sm">Look for the globe icon in the top-right corner of your screen</p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-800 mb-2">Step 2: Switch Languages</h3>
              <p className="text-gray-600 text-sm">Click the dropdown and select English, Chinese, or Malay</p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-800 mb-2">Step 3: Watch Changes</h3>
              <p className="text-gray-600 text-sm">See how the translations below update instantly</p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-800 mb-2">Step 4: Test Other Pages</h3>
              <p className="text-gray-600 text-sm">Visit other pages - the language switcher follows you everywhere!</p>
            </div>
          </div>
        </div>

        {/* Translation Examples */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8 border border-gray-200">
          <h2 className="text-2xl font-semibold text-gray-900 mb-6">Live Translation Examples</h2>
          <div className="grid gap-4">
            {testTranslations.map((item, index) => (
              <div key={index} className="p-4 bg-gray-50 rounded-lg border border-gray-200 hover:bg-gray-100 transition-colors">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="text-sm text-gray-500 mb-1">{item.label}</div>
                    <div className="text-lg font-medium text-gray-900">{t(item.key)}</div>
                  </div>
                  <div className="text-xs text-gray-400 font-mono bg-gray-200 px-2 py-1 rounded">
                    {item.key}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Test Other Pages */}
        <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
          <h2 className="text-2xl font-semibold text-gray-900 mb-6">Test on Other Pages</h2>
          <div className="grid md:grid-cols-2 gap-4">
            {[
              { name: 'Homepage', path: '/', description: 'Main landing page with hero section' },
              { name: 'Dashboard', path: '/dashboard', description: 'User dashboard interface' },
              { name: 'Business Dashboard', path: '/business/dashboard', description: 'Business analytics page' },
              { name: 'Accounts', path: '/accounts', description: 'Account management page' },
              { name: 'Settings', path: '/settings', description: 'User settings page' },
              { name: 'Translation Demo', path: '/translation-demo', description: 'Translation demonstration' }
            ].map((page, index) => (
              <Link key={index} href={page.path}>
                <div className="p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-all cursor-pointer group">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold text-gray-900 group-hover:text-blue-600">
                        {page.name}
                      </h3>
                      <p className="text-sm text-gray-600">{page.description}</p>
                    </div>
                    <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-blue-600" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Status */}
        <div className="text-center mt-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100 text-blue-800 rounded-full">
            <Globe className="w-4 h-4" />
            <span className="text-sm font-medium">
              Global Language Switcher Active on All Pages
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}