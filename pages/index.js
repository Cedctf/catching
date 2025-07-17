import Image from "next/image";
import Link from "next/link";
import { Geist, Geist_Mono } from "next/font/google";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function Home() {
  return (
    <div
      className={`${geistSans.className} ${geistMono.className} font-sans min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100`}
    >
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xl">C</span>
              </div>
              <h1 className="text-2xl font-bold text-gray-900">Catching</h1>
            </div>
            <nav className="flex space-x-4">
              <Link href="/payment/start" className="text-blue-600 hover:text-blue-800 font-medium">
                Pay Now
              </Link>
              <Link href="/business/dashboard" className="text-gray-600 hover:text-gray-800 font-medium">
                Business
              </Link>
            </nav>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h2 className="text-5xl font-bold text-gray-900 mb-6">
            The Future of <span className="text-blue-600">Digital Payments</span>
          </h2>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Experience seamless, secure payments with face recognition and QR code technology. 
            Fast, reliable, and built for the modern world.
          </p>
          <div className="flex gap-4 justify-center">
            <Link href="/payment/start">
              <button className="bg-blue-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-blue-700 transition-colors">
                Start Payment
              </button>
            </Link>
            <Link href="/business/dashboard">
              <button className="border border-gray-300 text-gray-700 px-8 py-4 rounded-lg text-lg font-semibold hover:bg-gray-50 transition-colors">
                Business Dashboard
              </button>
            </Link>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <div className="bg-white rounded-2xl p-8 shadow-lg">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-6">
              <span className="text-lg font-bold">FACE</span>
            </div>
            <h3 className="text-xl font-semibold mb-4">Face Recognition</h3>
            <p className="text-gray-600">
              Secure biometric authentication for instant payments. No cards, no cash, just your face.
            </p>
          </div>

          <div className="bg-white rounded-2xl p-8 shadow-lg">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-6">
              <span className="text-lg font-bold">QR</span>
            </div>
            <h3 className="text-xl font-semibold mb-4">QR Code Payments</h3>
            <p className="text-gray-600">
              Quick and easy QR code scanning for contactless payments anywhere, anytime.
            </p>
          </div>

          <div className="bg-white rounded-2xl p-8 shadow-lg">
            <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mb-6">
              <span className="text-lg font-bold">INV</span>
            </div>
            <h3 className="text-xl font-semibold mb-4">E-Invoicing</h3>
            <p className="text-gray-600">
              Automatic invoice generation and digital receipts for every transaction.
            </p>
          </div>
        </div>

        {/* Demo Section */}
        <div className="bg-white rounded-2xl p-8 shadow-lg text-center">
          <h3 className="text-2xl font-semibold mb-4">Try the Demo</h3>
          <p className="text-gray-600 mb-6">
            Experience our payment simulation with mock data. No real money involved!
          </p>
          <div className="flex gap-4 justify-center">
            <Link href="/payment/start">
              <button className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition-all">
                Start Demo Payment
              </button>
            </Link>
          </div>
        </div>
      </main>

      <footer className="row-start-3 flex gap-[24px] flex-wrap items-center justify-center py-8">
        <div className="text-center text-gray-600">
          <p>&copy; 2025 Catching - Digital Payment Platform</p>
        </div>
      </footer>
    </div>
  );
}