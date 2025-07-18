import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/router';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, Mic, ChevronLeft } from 'lucide-react';

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([{
    text: "Hello! I'm your AI assistant. How can I help you today?",
    user: 'Bot'
  }]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isVoiceMode, setIsVoiceMode] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [transcript, setTranscript] = useState('');
  const recognitionRef = useRef(null);
  const router = useRouter();
  const messagesEndRef = useRef(null);

  // Add new state for wave animation
  const [waveAmplitude, setWaveAmplitude] = useState(0);
  
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      console.error("This browser doesn't support SpeechRecognition.");
      return;
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.continuous = false; // Changed to false to process one utterance at a time
    recognition.interimResults = true;
    recognition.lang = 'en-US';

    recognition.onstart = () => {
      setIsListening(true);
      setTranscript('');
    };

    recognition.onresult = (event) => {
      let currentTranscript = '';
      for (let i = 0; i < event.results.length; i++) {
        currentTranscript = event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          setTranscript(currentTranscript);
          handleVoiceInput(currentTranscript);
        }
      }
    };

    recognition.onerror = (event) => {
      console.error('Speech recognition error:', event.error);
      setIsListening(false);
      speak("I'm sorry, I couldn't hear that. Could you try again?");
    };

    recognition.onend = () => {
      setIsListening(false);
    };
    
    recognitionRef.current = recognition;

    return () => {
      recognition.abort();
    };
  }, []);

  // Update useEffect for wave animation
  useEffect(() => {
    let animationFrame;
    if (isListening) {
      const animate = () => {
        setWaveAmplitude(Math.random() * 0.5 + 0.5);
        animationFrame = requestAnimationFrame(animate);
      };
      animate();
    }
    return () => {
      if (animationFrame) {
        cancelAnimationFrame(animationFrame);
      }
    };
  }, [isListening]);

  const speak = async (text) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel(); // Cancel any ongoing speech
      setIsSpeaking(true);

      const utterance = new SpeechSynthesisUtterance(text);
      
      // Get available voices and select a good English voice
      const voices = window.speechSynthesis.getVoices();
      const englishVoice = voices.find(voice => 
        voice.lang.includes('en') && (voice.name.includes('Female') || voice.name.includes('Google'))
      ) || voices[0];
      
      utterance.voice = englishVoice;
      utterance.rate = 1.0;
      utterance.pitch = 1.0;
      utterance.volume = 1.0;

      utterance.onend = () => {
        setIsSpeaking(false);
        // Start listening again after speaking if still in voice mode
        if (isVoiceMode && !isListening) {
          setTimeout(() => {
            recognitionRef.current?.start();
          }, 1000);
        }
      };

      window.speechSynthesis.speak(utterance);
    }
  };

  const handleVoiceInput = async (voiceText) => {
    if (!voiceText.trim()) return;

    // Add user's voice input to messages
    const newMessages = [...messages, { text: voiceText, user: 'You' }];
    setMessages(newMessages);
    setIsTyping(true);

    try {
      const response = await fetch('/api/chatbot', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: voiceText }),
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
      
      // Speak the response
      speak(data.reply);

    } catch (error) {
      console.error('Error fetching from chatbot API:', error);
      const errorMessage = "Sorry, I'm having trouble connecting. Please try again later.";
      const botMessage = {
        text: errorMessage,
        user: 'Bot',
      };
      setMessages([...newMessages, botMessage]);
      speak(errorMessage);
    } finally {
      setIsTyping(false);
    }
  };

  const handleSend = async () => {
    const message = input.trim();
    if (message === '') return;

    const newMessages = [...messages, { text: message, user: 'You' }];
    setMessages(newMessages);
    setInput('');
    setIsTyping(true);

    try {
      const response = await fetch('/api/chatbot', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: message }),
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
    } finally {
      setIsTyping(false);
    }
  };

  const handleButtonClick = (url) => {
    if (url) {
      router.push(url);
      setIsOpen(false);
    }
  };

  const toggleChat = () => {
    setIsOpen(!isOpen);
    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
    }
    if (isVoiceMode) {
      setIsVoiceMode(false);
      window.speechSynthesis.cancel();
    }
  };

  const toggleVoiceMode = () => {
    const newVoiceMode = !isVoiceMode;
    setIsVoiceMode(newVoiceMode);
    
    if (newVoiceMode) {
      speak("Voice mode activated. How can I help you today?");
    } else {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      window.speechSynthesis.cancel();
      setIsListening(false);
      setIsSpeaking(false);
    }
  };

  const WaveAnimation = () => {
    const waves = Array.from({ length: 20 });
    return (
      <div className="relative w-full h-32 flex items-center justify-center overflow-hidden">
        {waves.map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-[400px] h-[400px] border border-[#002fa7] rounded-full opacity-20"
            animate={{
              scale: [1, 1.1, 1],
              opacity: [0.1, 0.3, 0.1],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              delay: i * 0.1,
              ease: "linear"
            }}
            style={{
              borderColor: `hsl(${220 + i * 5}, 100%, ${60 + i}%)`,
            }}
          />
        ))}
      </div>
    );
  };

  if (!isOpen) {
    return (
      <motion.button
        onClick={toggleChat}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        className="fixed bottom-4 right-4 bg-[#002fa7] text-white w-12 h-12 rounded-full flex items-center justify-center shadow-lg hover:bg-[#002fa7]/90 transition-colors"
      >
        <MessageSquare className="h-5 w-5" />
      </motion.button>
    );
  }

  return (
    <>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed bottom-4 right-20 w-[400px] h-[500px] bg-white rounded-2xl shadow-[0_4px_32px_0_rgba(60,60,60,0.08)] flex flex-col overflow-hidden z-50"
      >
        {isVoiceMode ? (
          <>
            {/* Voice Mode Header */}
            <div className="flex items-center justify-between px-5 pt-5 pb-3">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={toggleVoiceMode}
                className="p-2 text-[#002fa7] hover:bg-[#E8EDFF] rounded-xl transition-colors"
              >
                <ChevronLeft className="h-5 w-5" />
              </motion.button>
              <h1 className="text-lg font-medium text-[#002fa7]">Talk to AI</h1>
              <div className="w-8" /> {/* Spacer for alignment */}
            </div>

            {/* Voice Mode Content */}
            <div className="flex-1 flex flex-col items-center justify-center px-5">
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-base text-[#6B7280] mb-8"
              >
                {isListening ? "Go ahead, I'm listening..." : "I am here to assist you with anything today."}
              </motion.p>

              <div className="flex-1 w-full max-h-[240px] flex items-center justify-center">
                <WaveAnimation />
              </div>

              <div className="flex flex-col items-center gap-3 mb-8">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  animate={isListening ? {
                    scale: [1, 1.2, 1],
                    transition: { repeat: Infinity, duration: 1.5 }
                  } : {}}
                  onClick={() => {
                    if (isListening) {
                      recognitionRef.current?.stop();
                    } else {
                      recognitionRef.current?.start();
                    }
                  }}
                  className={`p-5 rounded-xl ${
                    isListening 
                      ? 'bg-[#002fa7] text-white'
                      : 'bg-[#F8FAFF] text-[#002fa7] border-2 border-[#E8EDFF] hover:bg-[#E8EDFF]'
                  } transition-all duration-200`}
                >
                  <Mic className="h-6 w-6" />
                </motion.button>
                <span className="text-sm text-[#6B7280] font-medium">
                  {isListening ? "Listening..." : "Tap to speak"}
                </span>
              </div>
            </div>
          </>
        ) : (
          <>
            {/* Chat Mode Header */}
            <div className="px-5 pt-5 pb-3 flex flex-col items-center w-full">
              <div
                className="font-extrabold text-xl mb-2 tracking-[-0.5px] bg-gradient-to-r from-[#002fa7] from-30% to-[#4FC3F7] to-100% bg-clip-text text-transparent text-center"
              >
                Welcome to PayID Chatbot
              </div>
              <div className="text-[#6B7280] text-sm mb-2 font-medium">
                Your AI assistant for PayID
              </div>
              <div className="w-full h-[1px] bg-gradient-to-r from-[#E8EDFF] to-[#F0F1F3] mb-3" />
            </div>

            {/* Messages Area */}
            <div className="flex-1 p-4 overflow-y-auto bg-[#F8FAFF] mx-5 rounded-xl mb-3 border border-[#E8EDFF]">
              {messages.map((msg, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex ${msg.user === 'You' ? 'justify-end' : 'justify-start'} mb-3`}
                >
                  <div
                    className={`max-w-[75%] px-4 py-2 rounded-xl ${
                      msg.user === 'You'
                        ? 'bg-[#002fa7] text-white'
                        : 'bg-[#F0F1F3] text-[#222]'
                    }`}
                  >
                    <p className="text-sm">{msg.text}</p>
                    {msg.buttons && (
                      <div className="mt-2 space-y-1">
                        {msg.buttons.map((button, i) => (
                          <motion.button
                            key={i}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => handleButtonClick(button.url)}
                            className="w-full bg-white text-[#002fa7] py-1.5 px-3 rounded-lg text-xs font-medium hover:bg-[#F8FAFF] transition-colors"
                          >
                            {button.text}
                          </motion.button>
                        ))}
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}
              {isTyping && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex justify-start mb-3"
                >
                  <div className="bg-[#F0F1F3] px-4 py-2 rounded-xl">
                    <div className="flex space-x-1">
                      <motion.div
                        animate={{ y: [0, -3, 0] }}
                        transition={{ duration: 0.6, repeat: Infinity, delay: 0 }}
                        className="w-1 h-1 bg-gray-400 rounded-full"
                      />
                      <motion.div
                        animate={{ y: [0, -3, 0] }}
                        transition={{ duration: 0.6, repeat: Infinity, delay: 0.2 }}
                        className="w-1 h-1 bg-gray-400 rounded-full"
                      />
                      <motion.div
                        animate={{ y: [0, -3, 0] }}
                        transition={{ duration: 0.6, repeat: Infinity, delay: 0.4 }}
                        className="w-1 h-1 bg-gray-400 rounded-full"
                      />
                    </div>
                  </div>
                </motion.div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="px-5 pb-5 flex items-center gap-2">
              <div className="flex-1 flex items-center gap-2 border-[1.5px] border-[#E8EDFF] rounded-xl bg-[#F8FAFF] focus-within:border-[#002fa7] transition-colors">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                  placeholder="Write your message"
                  className="flex-1 text-sm px-4 py-2.5 bg-transparent focus:outline-none min-w-[200px]"
                />
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleSend()}
                  className="mr-2 p-1.5 text-[#002fa7] hover:bg-[#E8EDFF] rounded-lg transition-colors"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="22" y1="2" x2="11" y2="13" />
                    <polygon points="22 2 15 22 11 13 2 9 22 2" />
                  </svg>
                </motion.button>
              </div>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={toggleVoiceMode}
                className="p-2.5 rounded-xl bg-[#002fa7] text-white hover:bg-[#002fa7]/90 transition-colors"
              >
                <Mic className="h-4 w-4" />
              </motion.button>
            </div>
          </>
        )}
      </motion.div>

      {/* Floating Close Button */}
      <motion.button
        onClick={toggleChat}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        className="fixed bottom-4 right-4 bg-[#002fa7] text-white w-12 h-12 rounded-full flex items-center justify-center shadow-lg hover:bg-[#002fa7]/90 transition-colors z-50"
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <line x1="18" y1="6" x2="6" y2="18"></line>
          <line x1="6" y1="6" x2="18" y2="18"></line>
        </svg>
      </motion.button>
    </>
  );
};

export default Chatbot; 