'use client';
import React from 'react';
import { FiX, FiUser } from 'react-icons/fi';
export default function AboutModal({ isOpen, onClose, description }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[80vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b shrink-0">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-purple-50 rounded-full">
              <FiUser className="w-5 h-5 text-purple-600" />
            </div>
            <h2 className="text-xl font-semibold text-gray-900">About</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-50 transition-colors"
          >
            <FiX className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto flex-grow scrollbar-hide hover:scrollbar-default transition-all">
          <div className="max-w-full pr-4">
            <p className="text-sm text-gray-600 leading-relaxed break-words whitespace-pre-wrap">
              {description}
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t shrink-0">
          <button
            onClick={onClose}
            className="w-full px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
