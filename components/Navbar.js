import Link from "next/link";
import { Poppins } from "next/font/google";
import { HelpCircle } from "lucide-react";
import { useTranslation } from 'react-i18next';
import LanguageSwitcher from './LanguageSwitcher';
import { ScrollText } from 'lucide-react';
import { useRouter } from 'next/router';
import { ChevronDown, User } from 'lucide-react';
import { useState } from 'react';


const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
});


export default function Navbar({ isLoggedIn, setIsLoggedIn, user, onStartTutorial }) {
  const { t } = useTranslation();
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  return (
    <div className="fixed top-0 left-0 right-0 bg-white z-50 border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link href="/" className="flex items-center">
              <h1 className="text-2xl font-black text-[#002fa7] font-poppins tracking-tight">PayID</h1>
            </Link>
          </div>

          {/* Navigation */}
          <nav className="flex items-center space-x-6">
            
            
            {!isLoggedIn ? (
              <div className="flex items-center space-x-6">
                <button
                  onClick={onStartTutorial}
                  className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 font-medium transition-colors"
                >
                  <HelpCircle className="h-4 w-4" />
                  <span>{t('nav.tutorial')}</span>
                </button>
                <LanguageSwitcher />
                <Link 
                  href="/auth/register-business"
                  className="text-gray-600 hover:text-gray-900 font-medium transition-colors"
                >
                  {t('nav.signup')}
                </Link>
                <Link 
                  href="/auth/login"
                  className="bg-[#002fa7] text-white px-6 py-2 rounded-full font-medium hover:bg-[#002fa7]/90 transition-all duration-300"
                >
                  {t('nav.login')}
                </Link>
              </div>
            ) : (
              <div className="flex items-center space-x-6">
                <Link href="/payment/start" className="text-gray-600 hover:text-gray-900 font-medium transition-colors">
                  {t('nav.payNow')}
                </Link>
                <button
                  onClick={onStartTutorial}
                  className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 font-medium transition-colors"
                >
                  <HelpCircle className="h-4 w-4" />
                  <span>{t('nav.tutorial')}</span>
                </button>
                <LanguageSwitcher />
                <div className="relative">
                  <button 
                    onClick={() => setShowProfileMenu(!showProfileMenu)}
                    className="flex items-center space-x-3 hover:opacity-80 transition-opacity bg-gray-50 px-3 py-2 rounded-xl group"
                  >
                    <div className="w-8 h-8 bg-[#002fa7] rounded-full flex items-center justify-center">
                      <span className="text-white text-sm font-medium">{user.avatar}</span>
                    </div>
                    <div className="text-sm">
                      <div className="font-medium text-gray-900">{user.name}</div>
                    </div>
                    <ChevronDown className="h-4 w-4 text-gray-500 group-hover:text-gray-700 transition-colors" />
                  </button>

                  {/* Profile Dropdown Menu */}
                  {showProfileMenu && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-100 py-1 z-50">
                      <Link 
                        href="/business/dashboard"
                        className="flex items-center space-x-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 w-full text-left"
                      >
                        <User className="h-4 w-4" />
                        <span>Business Dashboard</span>
                      </Link>
                      <button 
                        onClick={() => {
                          localStorage.removeItem('isLoggedIn');
                          setIsLoggedIn(false);
                          setShowProfileMenu(false);
                        }}
                        className="flex items-center space-x-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 w-full text-left"
                      >
                        <span>{t('nav.logout')}</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )}
          </nav>
        </div>
      </div>
    </div>
  );
} 