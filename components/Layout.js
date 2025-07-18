import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Navbar from './Navbar';

const Layout = ({ children, noPadding }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user] = useState({
    name: "John Doe",
    email: "john@example.com",
    avatar: "JD"
  });

  return (
    <>
      <Navbar isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} user={user} />
      <div className={`min-h-screen w-full flex flex-col items-center bg-white px-0 pb-8 ${noPadding ? '' : 'pt-16'} text-gray-900 overflow-hidden`}>
        {/* Background */}
        <div className="absolute inset-0 bg-white z-0" />
        <div className="absolute inset-0 bg-white z-0" />
        <div className="absolute inset-0 bg-white z-10" />

        {/* Floating Background Elements */}
        <div className="absolute inset-0 overflow-hidden z-10">
          <motion.div
            animate={{ y: [0, -20, 0], rotate: [0, 5, -5, 0] }}
            transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-1/4 left-1/4 w-48 h-48 bg-white rounded-full blur-2xl"
          />
          <motion.div
            animate={{ y: [0, 15, 0], x: [0, 10, 0], rotate: [0, -3, 3, 0] }}
            transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 1 }}
            className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-white rounded-full blur-2xl"
          />
        </div>

        {/* Main Content */}
        <div className="relative w-full max-w-7xl mx-auto space-y-6 z-20">
          {children}
        </div>
      </div>
    </>
  );
};

export default Layout; 