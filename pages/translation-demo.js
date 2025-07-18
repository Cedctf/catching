import React from 'react';
import TranslationDemo from '../components/TranslationDemo';
import Navbar from '../components/Navbar';
import { useState } from 'react';

export default function TranslationDemoPage() {
  const [isLoggedIn, setIsLoggedIn] = useState(true);
  const [user] = useState({
    name: "Demo User",
    email: "demo@example.com",
    avatar: "DU"
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} user={user} />
      <div className="pt-32 pb-12 px-4">
        <TranslationDemo />
      </div>
    </div>
  );
}