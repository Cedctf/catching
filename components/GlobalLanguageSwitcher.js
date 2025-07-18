import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Globe, ChevronDown } from 'lucide-react';

const GlobalLanguageSwitcher = () => {
  const { i18n } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const languages = [
    { code: 'en', name: 'English', flag: '🇺🇸' },
    { code: 'zh', name: '中文', flag: '🇨🇳' },
    { code: 'ms', name: 'Bahasa Melayu', flag: '🇲🇾' }
  ];

  const changeLanguage = (languageCode) => {
    i18n.changeLanguage(languageCode);
    setIsOpen(false);
  };

  // Prevent hydration mismatch - show static version until mounted
  if (!mounted) {
    return (
      <div className="fixed top-4 right-4 z-50">
        <div className="relative">
          <div className="flex items-center space-x-2 px-4 py-2 bg-white/95 backdrop-blur-sm rounded-lg shadow-lg border border-gray-200">
            <Globe className="w-4 h-4 text-gray-600" />
            <span className="text-sm font-medium text-gray-700 hidden sm:inline">
              🇺🇸 English
            </span>
            <span className="text-sm font-medium text-gray-700 sm:hidden">
              🇺🇸
            </span>
            <ChevronDown className="w-4 h-4 text-gray-600" />
          </div>
        </div>
      </div>
    );
  }

  const currentLanguage = languages.find(lang => lang.code === i18n.language) || languages[0];

  return (
    <div className="fixed top-4 right-4 z-50">
      <div className="relative">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center space-x-2 px-4 py-2 bg-white/95 backdrop-blur-sm rounded-lg hover:bg-white shadow-lg border border-gray-200 transition-all duration-200 hover:shadow-xl"
        >
          <Globe className="w-4 h-4 text-gray-600" />
          <span className="text-sm font-medium text-gray-700 hidden sm:inline">
            {currentLanguage.flag} {currentLanguage.name}
          </span>
          <span className="text-sm font-medium text-gray-700 sm:hidden">
            {currentLanguage.flag}
          </span>
          <ChevronDown className={`w-4 h-4 text-gray-600 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
        </button>

        {isOpen && (
          <>
            {/* Backdrop */}
            <div 
              className="fixed inset-0 z-10" 
              onClick={() => setIsOpen(false)}
            />
            
            {/* Dropdown */}
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl border border-gray-200 z-20 overflow-hidden">
              <div className="py-1">
                {languages.map((language) => (
                  <button
                    key={language.code}
                    onClick={() => changeLanguage(language.code)}
                    className={`w-full text-left px-4 py-3 text-sm hover:bg-gray-50 transition-colors flex items-center space-x-3 ${
                      currentLanguage.code === language.code 
                        ? 'bg-blue-50 text-blue-600 border-r-2 border-blue-600' 
                        : 'text-gray-700'
                    }`}
                  >
                    <span className="text-lg">{language.flag}</span>
                    <span className="font-medium flex-1">{language.name}</span>
                    {currentLanguage.code === language.code && (
                      <span className="text-blue-600 text-sm">✓</span>
                    )}
                  </button>
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default GlobalLanguageSwitcher;