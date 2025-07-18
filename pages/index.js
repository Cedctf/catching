import Link from "next/link";
import { useState } from "react";
import { Inter, Poppins } from "next/font/google";
import { useTranslation } from 'react-i18next';
import Navbar from "../components/Navbar";
import ScrollExpandMedia from "../components/scroll-expansion-hero";
import { FlippingCard } from "../components/flipping-card";
import { 
  FaceRecognitionIcon, 
  QRCodeIcon, 
  InvoiceIcon,
} from "../components/FeatureIcons";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
});

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
});

export default function Home() {
  const { t } = useTranslation();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user] = useState({
    name: "John Doe",
    email: "john@example.com",
    avatar: "JD"
  });

  const features = [
    {
      icon: <FaceRecognitionIcon />,
      title: t('features.faceRecognition.title'),
      description: t('features.faceRecognition.description'),
      color: "blue"
    },
    {
      icon: <QRCodeIcon />,
      title: t('features.qrCode.title'),
      description: t('features.qrCode.description'),
      color: "green"
    },
    {
      icon: <InvoiceIcon />,
      title: t('features.eInvoicing.title'),
      description: t('features.eInvoicing.description'),
      color: "purple"
    }
  ];

  return (
    <div className={`${inter.variable} ${poppins.variable} font-sans bg-white`}>
      {/* Navbar */}
      <Navbar isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} user={user} />

      {/* Main Content Container */}
      <div className="bg-white">
        {/* Hero Section */}
        <section className="h-screen bg-white">
          <ScrollExpandMedia
            mediaType="image"
            mediaSrc="/face.png"
            bgImageSrc=""
            title="The Future of | Digital Payments"
            scrollToExpand="Experience seamless, secure payments with face recognition and QR code technology. Fast, reliable, and built for the modern world."
            textBlend={false}
          >
          </ScrollExpandMedia>
        </section>

        {/* Features Section */}
        <section className="bg-white py-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-4xl font-bold text-center mb-12">
              {t('features.title')}
            </h2>
            <div className="grid md:grid-cols-3 gap-6 mb-16 place-items-center justify-center max-w-6xl mx-auto">
              {features.map((feature, index) => (
                <FlippingCard
                  key={index}
                  frontContent={
                    <div className="h-full w-full flex flex-col items-center justify-center p-4 text-center">
                      <div className={`w-16 h-16 bg-${feature.color}-50 rounded-full flex items-center justify-center mb-4`}>
                        {feature.icon}
                      </div>
                      <h3 className="text-xl font-bold text-gray-900">{feature.title}</h3>
                    </div>
                  }
                  backContent={
                    <div className="h-full w-full flex flex-col items-center justify-center p-6 text-center">
                      <div className="space-y-4">
                        <p className="text-base text-gray-600 leading-relaxed">
                          {feature.description}
                        </p>
                      </div>
                    </div>
                  }
                  height={250}
                  width={300}
                />
              ))}
            </div>
            
            {/* Demo CTA */}
            <div className="text-center max-w-3xl mx-auto">
              <h3 className="text-2xl font-bold mb-4">{t('demo.title')}</h3>
              <p className="text-lg text-gray-600 mb-6">
                {t('demo.description')}
              </p>
              <Link href="/payment/start">
                <button className="bg-gradient-to-r from-[#002fa7] to-purple-600 text-white px-6 py-3 rounded-full text-lg font-semibold hover:from-[#002fa7]/90 hover:to-purple-700 transition-all transform hover:scale-105">
                  {t('demo.startButton')}
                </button>
              </Link>
            </div>
          </div>
        </section>

        {/* Footer Section */}
        <footer className="py-8 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center text-gray-600">
              <p>{t('footer.copyright')}</p>
            </div>
          </div>
        </footer>
      </div>

      <style jsx global>{`
        html {
          background: white;
        }
        body {
          background: white;
        }
      `}</style>
    </div>
  );
}