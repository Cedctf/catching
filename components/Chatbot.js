import React, { useState } from 'react';
import { useRouter } from 'next/router';

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const router = useRouter();

  const handleSend = async () => {
    if (input.trim() === '') return;

    const newMessages = [...messages, { text: input, user: 'You' }];
    setMessages(newMessages);

    try {
      const response = await fetch('/api/chatbot', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: input }),
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();
      const botMessage = {
        text: data.reply,
        buttons: data.buttons,
        user: 'Bot',
      };
      setMessages([...newMessages, botMessage]);
    } catch (error) {
      console.error('Error fetching from chatbot API:', error);
      const botMessage = {
        text: "Sorry, I'm having trouble connecting. Please try again later.",
        user: 'Bot',
      };
      setMessages([...newMessages, botMessage]);
    }

    setInput('');
  };

  const handleButtonClick = (url) => {
    if (url) {
      router.push(url);
    }
  };

  const toggleChat = () => {
    setIsOpen(!isOpen);
  };

  if (!isOpen) {
    return (
      <button
        onClick={toggleChat}
        className="fixed bottom-4 right-4 bg-blue-500 text-white w-16 h-16 rounded-full flex items-center justify-center shadow-lg hover:bg-blue-600 transition-colors"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
        </svg>
      </button>
    );
  }

  return (
    <div className="fixed bottom-4 right-4 w-80 h-96 z-50 bg-white rounded-lg shadow-lg flex flex-col">
      <div className="p-4 bg-gray-800 text-white rounded-t-lg flex justify-between items-center">
        <span>Chatbot</span>
        <button onClick={toggleChat} className="text-white hover:text-gray-300">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
      <div className="flex-1 p-4 overflow-y-auto">
        {messages.map((msg, index) => (
          <div key={index} className={`my-2 ${msg.user === 'You' ? 'text-right' : ''}`}>
            <div className={`inline-block p-2 rounded-lg ${msg.user === 'You' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}>
              {msg.text}
              {msg.buttons && (
                <div className="mt-2">
                  {msg.buttons.map((button, i) => (
                    <button
                      key={i}
                      onClick={() => handleButtonClick(button.url)}
                      className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-2 rounded text-sm"
                    >
                      {button.text}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
      <div className="p-4 border-t">
        <div className="flex">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            className="flex-1 p-2 border rounded-l-lg"
            placeholder="Type a message..."
          />
          <button onClick={handleSend} className="bg-blue-500 text-white p-2 rounded-r-lg">
            Send
          </button>
        </div>
      </div>
    </div>
  );
};

export default Chatbot;