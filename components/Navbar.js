import Link from "next/link";
import { Poppins } from "next/font/google";
import { useTranslation } from 'react-i18next';
import LanguageSwitcher from './LanguageSwitcher';

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
});

export default function Navbar({ isLoggedIn, setIsLoggedIn, user }) {
  const { t } = useTranslation();
  
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <h1 className="text-2xl font-black text-[#002fa7] font-poppins tracking-tight">PayID</h1>
          </div>
          <nav className="flex items-center space-x-6">
            <LanguageSwitcher />
            {!isLoggedIn ? (
              <>
                <button 
                  onClick={() => setIsLoggedIn(true)}
                  className="text-gray-600 hover:text-gray-900 font-medium transition-colors"
                >
                  {t('nav.signup')}
                </button>
                <button 
                  onClick={() => setIsLoggedIn(true)}
                  className="bg-[#002fa7] text-white px-6 py-2 rounded-full font-medium hover:bg-[#002fa7]/90 transition-all duration-300"
                >
                  {t('nav.login')}
                </button>
              </>
            ) : (
              <div className="flex items-center space-x-6">
                <Link href="/payment/start" className="text-gray-600 hover:text-gray-900 font-medium transition-colors">
                  {t('nav.payNow')}
                </Link>
                <Link href="/business/dashboard" className="text-gray-600 hover:text-gray-900 font-medium transition-colors">
                  {t('nav.business')}
                </Link>
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-[#002fa7] rounded-full flex items-center justify-center">
                    <span className="text-white text-sm font-medium">{user.avatar}</span>
                  </div>
                  <div className="text-sm">
                    <div className="font-medium text-gray-900">{user.name}</div>
                  </div>
                  <button 
                    onClick={() => setIsLoggedIn(false)}
                    className="text-gray-600 hover:text-gray-900 text-sm transition-colors"
                  >
                    {t('nav.logout')}
                  </button>
                </div>
              </div>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
} 