"use client";

import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

interface Message {
  role: string;
  text: string;
}

interface TranscriberProps {
  conversation: Message[];
}

const Transcriber: React.FC<TranscriberProps> = ({ conversation }) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [conversation]);

  const renderWords = (text: string) => {
    const words = text.split(' ');
    return (
      <div className="inline-block">
        {words.map((word, index) => (
          <motion.span
            key={index}
            initial={{ opacity: 0, filter: 'blur(10px)' }}
            animate={{ opacity: 1, filter: 'blur(0px)' }}
            transition={{ duration: 0.2, delay: index * 0.1 }} // Slightly increased delay for better readability
            className="inline-block mr-1" // Added margin-right to space words properly
          >
            {word}
          </motion.span>
        ))}
      </div>
    );
  };

  const groupedConversation = conversation.reduce((acc, message) => {
    const lastMessage = acc[acc.length - 1];
    if (lastMessage && lastMessage.role === message.role) {
      lastMessage.text += ' ' + message.text;
    } else {
      acc.push({ role: message.role, text: message.text });
    }
    return acc;
  }, [] as Message[]);

  return (
    <div ref={scrollRef} className="h-40 overflow-y-auto p-4 bg-gray-100 rounded-lg">
      {groupedConversation.map((message, index) => (
        <div key={index} className={`mb-2 ${message.role === 'user' ? 'text-right' : ''}`}>
          <div className={`inline-block px-2 py-1 rounded-lg ${message.role === 'user' ? 'bg-blue-500 text-white' : 'bg-gray-300'}`}>
            {renderWords(message.text)}
          </div>
        </div>
      ))}
    </div>
  );
};

export default Transcriber;
