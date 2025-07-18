import "@/styles/globals.css";
import Layout from "@/components/Layout";
import Head from 'next/head';
import '../lib/i18n'; // Import i18n configuration
import Navbar from '@/components/Navbar';
import { useState, useEffect } from 'react';
import Chatbot from '@/components/Chatbot';

export default function App({ Component, pageProps }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState({
    name: "John Doe",
    email: "john@example.com",
    avatar: "JD"
  });

  // Initialize login state from localStorage
  useEffect(() => {
    const storedLoginState = localStorage.getItem('isLoggedIn');
    const storedUser = localStorage.getItem('user');
    
    if (storedLoginState === 'true') {
      setIsLoggedIn(true);
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
    }
  }, []);

  return (
    <>
      <Head>
        <title>PayID - Digital Payment Platform</title>
        <link rel="icon" href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>P</text></svg>" />
      </Head>
      <Navbar isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} user={user} />
      <div className="min-h-screen w-full flex flex-col items-center bg-white pb-8 text-gray-900 overflow-hidden">
        <Component {...pageProps} />
      </div>
      <Chatbot />
    </>
  );
} 