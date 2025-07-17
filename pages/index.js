import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { Inter, Poppins } from "next/font/google";
import Hero from "../components/Hero";
import Navbar from "../components/Navbar";
import { FlippingCard } from "../components/flipping-card";
import { 
  FaceRecognitionIcon, 
  QRCodeIcon, 
  InvoiceIcon,
  SecurityIcon,
  VerifiedIcon 
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
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState({
    name: "John Doe",
    email: "john@example.com",
    avatar: "JD"
  });

  const features = [
    {
      icon: <FaceRecognitionIcon />,
      title: "Face Recognition",
      description: "Secure biometric authentication for instant payments. No cards, no cash, just your face.",
      color: "blue"
    },
    {
      icon: <QRCodeIcon />,
      title: "QR Code Payments",
      description: "Quick and easy QR code scanning for contactless payments anywhere, anytime.",
      color: "green"
    },
    {
      icon: <InvoiceIcon />,
      title: "E-Invoicing",
      description: "Automatic invoice generation and digital receipts for every transaction.",
      color: "purple"
    }
  ];

  return (
    <div className={`${inter.variable} ${poppins.variable} font-sans`}>
      {/* Navbar */}
      <Navbar isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} user={user} />

      {/* Scrollable Sections Container */}
      <div className="h-screen overflow-y-auto snap-y snap-mandatory">
        {/* Hero Section */}
        <section className="h-screen snap-start">
          <div className="h-full pt-[72px]">
            <Hero />
          </div>
        </section>

        {/* Features Section */}
        <section className="min-h-screen snap-start bg-white flex items-center">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 pt-24">
            <h2 className="text-4xl font-bold text-center mb-12">
              Experience Next-Gen Payment Features
            </h2>
            <div className="grid md:grid-cols-3 gap-6 mb-16">
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
              <h3 className="text-2xl font-bold mb-4">Try the Demo</h3>
              <p className="text-lg text-gray-600 mb-6">
                Experience our payment simulation with mock data. No real money involved!
              </p>
              <Link href="/payment/start">
                <button className="bg-gradient-to-r from-[#002fa7] to-purple-600 text-white px-6 py-3 rounded-full text-lg font-semibold hover:from-[#002fa7]/90 hover:to-purple-700 transition-all transform hover:scale-105">
                  Start Demo Payment
                </button>
              </Link>
            </div>
          </div>
        </section>

        {/* Footer Section */}
        <footer className="snap-start py-8 bg-white border-t">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center text-gray-600">
              <p>&copy; 2025 PayID - Digital Payment Platform</p>
            </div>
          </div>
        </footer>
      </div>

      <style jsx global>{`
        html {
          scroll-behavior: smooth;
        }
      `}</style>
    </div>
  );
}