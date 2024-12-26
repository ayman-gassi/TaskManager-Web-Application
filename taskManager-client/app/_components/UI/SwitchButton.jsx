"use client";

import React from 'react';
import { useRouter } from 'next/navigation';

const SwitchButton = ({ isChat }) => {
  const router = useRouter();

  const togglePage = () => {
    if (isChat) {
      router.push('/dashboard');
    } else {
      router.push('/chat');
    }
  };

  return (
    <button
      onClick={togglePage}
      className="relative w-32 h-16 bg-gray-100 rounded-full p-2 transition-colors duration-300 ease-in-out hover:bg-gray-200 overflow-hidden"
    >
      <div
        className={`absolute inset-0 flex items-center justify-between px-3 transition-transform duration-300 ${
          isChat ? 'translate-x-0' : 'translate-x-0'
        }`}
      >
        {/* Dashboard icon */}
        <div className={`transition-opacity duration-300 ${isChat ? 'opacity-40' : 'opacity-100'}`}>
          <svg
            className={`w-7 h-7 ${isChat ? 'text-gray-400' : 'text-green-400'}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z"
            />
          </svg>
        </div>

        {/* Chatbot icon */}
        <div className={`transition-opacity duration-300 ${isChat ? 'opacity-100' : 'opacity-40'}`}>
          <svg
            className={`w-7 h-7 ${isChat ? 'text-green-400' : 'text-gray-400'}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
            />
          </svg>
        </div>
      </div>
    </button>
  );
};

export default SwitchButton;
