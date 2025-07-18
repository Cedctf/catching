import Image from 'next/image';
import { Inter } from 'next/font/google';
import { useTranslation } from 'react-i18next';

const inter = Inter({
  variable: '--font-inter',
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800', '900'],
});

export default function Hero() {
  const { t } = useTranslation();
  
  return (
    <div className={`${inter.variable} relative h-full flex items-center`}>
      {/* Main Content */}
      <div className="relative w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Column - Text */}
          <div className="space-y-8">
            <div className="space-y-4">
              <h1 className="text-[80px] font-black text-gray-900 leading-none tracking-tight">
                {t('hero.title')}<br />
                <span className="text-[#002fa7]">{t('hero.titleHighlight')}</span>
              </h1>
            </div>
            
            <div className="max-w-xl">
              <p className="text-xl text-gray-600">
                {t('hero.subtitle')}
              </p>
            </div>
            
            <div className="flex items-center space-x-6">
              <button className="bg-[#002fa7] text-white px-8 py-4 rounded-full text-lg font-semibold hover:bg-[#002fa7]/90 transition-all">
                {t('hero.getStarted')}
              </button>
              <button className="text-gray-700 border border-gray-200 px-8 py-4 rounded-full text-lg font-semibold hover:bg-gray-50 transition-all">
                {t('hero.learnMore')}
              </button>
            </div>
          </div>
          
          {/* Right Column - Interactive Elements */}
          <div className="relative h-[500px]">
            {/* Face Recognition Frame */}
            <div className="absolute top-0 right-0 w-64 h-64 border-2 border-[#002fa7] rounded-2xl p-4">
              <div className="w-full h-full bg-gray-50 rounded-xl flex items-center justify-center">
                <div className="relative">
                  {/* Face Scan Animation */}
                  <div className="w-32 h-32 rounded-full bg-gradient-to-b from-gray-100 to-white shadow-lg" />
                  <div className="absolute inset-0 border-t-2 border-[#002fa7] animate-scan" 
                       style={{animation: 'scan 2s infinite'}} />
                </div>
              </div>
            </div>
            
            {/* Payment Success Circle */}
            <div className="absolute bottom-10 left-10 w-40 h-40 bg-[#002fa7]/10 rounded-full flex items-center justify-center">
              <div className="w-32 h-32 bg-white rounded-full shadow-lg flex items-center justify-center">
                <div className="text-[#002fa7] text-4xl">✓</div>
              </div>
            </div>

            {/* Floating Payment Amount */}
            <div className="absolute bottom-32 right-10 bg-white shadow-lg rounded-full px-6 py-3">
              <span className="text-[#002fa7] font-semibold">$99.99</span>
            </div>

            {/* Security Badge */}
            <div className="absolute top-32 left-0 w-20 h-20 bg-green-100 rounded-full flex items-center justify-center shadow-lg">
              <span className="text-green-600 text-3xl">🔒</span>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes scan {
          0% { transform: translateY(0); }
          50% { transform: translateY(120px); }
          100% { transform: translateY(0); }
        }
        .animate-scan {
          animation: scan 2s infinite;
        }
      `}</style>
    </div>
  );
} 