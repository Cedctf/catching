import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Layout from '../../components/Layout';

const PBeLoginPage = () => {
  const router = useRouter();
  const [userId, setUserId] = useState('');
  const [step, setStep] = useState(1);
  const [personalPhrase] = useState('1234567890abcd');
  const [phraseConfirmed, setPhraseConfirmed] = useState(false);
  const [password, setPassword] = useState('');
  const [currentDateTime, setCurrentDateTime] = useState('');

  useEffect(() => {
    // Format date as "Friday, 18 July 2025 03:22:01"
    const date = new Date();
    const options = { 
      weekday: 'long', 
      day: 'numeric', 
      month: 'long', 
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false
    };
    setCurrentDateTime(date.toLocaleString('en-MY', options));
  }, []);

  const handleNext = (e) => {
    e.preventDefault();
    if (step === 1 && userId) {
      setStep(2);
    } else if (step === 2 && phraseConfirmed) {
      setStep(3);
    } else if (step === 3 && password) {
      // Simulate successful login
      router.push('/link-bank/secure-sign');
    }
  };

  return (
    <Layout>
      <div className="min-h-screen w-full flex flex-col items-center px-4 bg-[#f0f0f0]">
        <div className="w-full max-w-[800px] mx-auto pt-8">
          <div className="bg-white border border-gray-300">
            {/* Header */}
            <div className="bg-[#1a4f72] text-white p-4 flex items-center justify-between">
              <img
                src="/logos/public.png"
                alt="Public Bank"
                className="h-8"
              />
              <div className="text-sm">{currentDateTime}</div>
            </div>

            <div className="p-6">
              <table className="w-full border-collapse">
                <tbody>
                  <tr>
                    {/* Left Side - Login Form */}
                    <td className="w-[65%] pr-8 border-r border-gray-300 align-top">
                      <div className="mb-6">
                        <h1 className="text-xl font-bold text-[#1a4f72] mb-2">
                          PBe Online Banking
                        </h1>
                        <div className="h-1 w-16 bg-[#1a4f72]"></div>
                      </div>

                      <form onSubmit={handleNext}>
                        {step === 1 && (
                          <div className="space-y-4">
                            <div>
                              <label className="block text-sm font-bold text-[#1a4f72] mb-1">
                                User ID
                              </label>
                              <input
                                type="text"
                                value={userId}
                                onChange={(e) => setUserId(e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 focus:border-[#1a4f72] focus:outline-none"
                                placeholder="Enter your User ID"
                              />
                            </div>
                            <button
                              type="submit"
                              disabled={!userId}
                              className="px-6 py-2 bg-[#1a4f72] text-white font-bold disabled:bg-gray-400 disabled:cursor-not-allowed"
                            >
                              Next
                            </button>
                          </div>
                        )}

                        {step === 2 && (
                          <div className="space-y-4">
                            <div>
                              <label className="block text-sm font-bold text-[#1a4f72] mb-1">
                                Personal Phrase
                              </label>
                              <div className="p-3 bg-[#f5f5f5] border border-gray-300">
                                <p className="font-mono">{personalPhrase}</p>
                              </div>
                              <div className="mt-4">
                                <label className="flex items-center gap-2">
                                  <input
                                    type="checkbox"
                                    checked={phraseConfirmed}
                                    onChange={(e) => setPhraseConfirmed(e.target.checked)}
                                    className="border-gray-300 text-[#1a4f72] focus:ring-[#1a4f72]"
                                  />
                                  <span className="text-sm">
                                    I confirm this is my personal phrase
                                  </span>
                                </label>
                              </div>
                            </div>
                            <button
                              type="submit"
                              disabled={!phraseConfirmed}
                              className="px-6 py-2 bg-[#1a4f72] text-white font-bold disabled:bg-gray-400 disabled:cursor-not-allowed"
                            >
                              Next
                            </button>
                          </div>
                        )}

                        {step === 3 && (
                          <div className="space-y-4">
                            <div>
                              <label className="block text-sm font-bold text-[#1a4f72] mb-1">
                                Password
                              </label>
                              <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 focus:border-[#1a4f72] focus:outline-none"
                                placeholder="Enter your password"
                              />
                            </div>
                            <button
                              type="submit"
                              disabled={!password}
                              className="px-6 py-2 bg-[#1a4f72] text-white font-bold disabled:bg-gray-400 disabled:cursor-not-allowed"
                            >
                              Login
                            </button>
                          </div>
                        )}
                      </form>
                    </td>

                    {/* Right Side - Help Section */}
                    <td className="w-[35%] pl-8 align-top">
                      <div>
                        <h2 className="text-sm font-bold text-[#1a4f72] mb-3">New to PBe?</h2>
                        <ul className="space-y-2 text-sm">
                          <li>
                            <a href="#" className="text-[#1a4f72] hover:underline">
                              ▶ Register
                            </a>
                          </li>
                          <li>
                            <a href="#" className="text-[#1a4f72] hover:underline">
                              ▶ PBe Online Security
                            </a>
                          </li>
                          <li>
                            <a href="#" className="text-[#1a4f72] hover:underline">
                              ▶ FAQs
                            </a>
                          </li>
                          <li>
                            <a href="#" className="text-[#1a4f72] hover:underline">
                              ▶ PBe Tutorials
                            </a>
                          </li>
                        </ul>

                        <h2 className="text-sm font-bold text-[#1a4f72] mt-6 mb-3">Need Help?</h2>
                        <ul className="space-y-2 text-sm">
                          <li>
                            <a href="#" className="text-[#1a4f72] hover:underline">
                              ▶ Reset Password / Reactivate User ID
                            </a>
                          </li>
                          <li>
                            <a href="#" className="text-[#1a4f72] hover:underline">
                              ▶ Report Fraud/Scam Incident
                            </a>
                          </li>
                          <li>
                            <a href="#" className="text-red-600 hover:underline">
                              ▶ Kill Switch
                            </a>
                          </li>
                        </ul>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Footer */}
            <div className="bg-[#1a4f72] text-white p-3 text-xs text-center">
              © 2024 Public Bank Berhad (6463-H)
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default PBeLoginPage; 