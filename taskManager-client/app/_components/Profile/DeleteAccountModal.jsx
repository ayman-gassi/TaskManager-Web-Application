'use client';
import { useState } from 'react';
import { FiAlertTriangle } from 'react-icons/fi';

export default function DeleteAccountModal({ isOpen, onClose, onConfirmDelete }) {
  const [confirmText, setConfirmText] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  const handleDelete = async () => {
    if (confirmText.toLowerCase() !== 'delete my account') {
      return;
    }
    
    setIsLoading(true);
    try {
      await onConfirmDelete();
      onClose();
    } catch (error) {
      console.error('Error deleting account:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-screen items-center justify-center p-4 text-center sm:p-0">
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" onClick={onClose} />

        <div className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
          <div className="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
            <div className="sm:flex sm:items-start">
              <div className="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                <FiAlertTriangle className="h-6 w-6 text-red-600" />
              </div>
              <div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
                <h3 className="text-base font-semibold leading-6 text-gray-900">
                  Delete Account
                </h3>
                <div className="mt-2">
                  <p className="text-sm text-gray-500">
                    Are you sure you want to delete your account? This action cannot be undone. 
                    All of your data will be permanently removed from our servers forever. 
                    This includes your:
                  </p>
                  <ul className="mt-2 list-disc list-inside text-sm text-gray-500">
                    <li>Profile information</li>
                    <li>Tasks and projects</li>
                    <li>Activity history</li>
                    <li>Settings and preferences</li>
                  </ul>
                  <div className="mt-4 space-y-3">
                    <p className="text-sm font-medium text-gray-700">
                      To confirm, type <span className="font-mono bg-gray-100 text-red-600 px-2 py-0.5 rounded">delete my account</span> below:
                    </p>
                    <div className="relative">
                      <input
                        type="text"
                        value={confirmText}
                        onChange={(e) => setConfirmText(e.target.value)}
                        className={`block w-full rounded-lg border-2 px-4 py-3 text-sm font-medium placeholder:text-gray-400 focus:outline-none focus:ring-0 ${
                          confirmText.length > 0
                            ? confirmText.toLowerCase() === 'delete my account'
                              ? 'border-green-500 bg-green-50 text-green-700 placeholder:text-green-400'
                              : 'border-red-300 bg-red-50 text-red-700 placeholder:text-red-400'
                            : 'border-gray-200 focus:border-red-300'
                        }`}
                        placeholder="Type here to confirm"
                      />
                      <div className="absolute right-3 top-1/2 -translate-y-1/2">
                        {confirmText.length > 0 && (
                          confirmText.toLowerCase() === 'delete my account' ? (
                            <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                            </svg>
                          ) : (
                            <svg className="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                          )
                        )}
                      </div>
                    </div>
                    <p className={`text-xs transition-all ${
                      confirmText.length > 0 && confirmText.toLowerCase() !== 'delete my account'
                        ? 'text-red-500'
                        : 'text-transparent'
                    }`}>
                      Please type the exact phrase to continue
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
            <button
              type="button"
              disabled={confirmText.toLowerCase() !== 'delete my account' || isLoading}
              onClick={handleDelete}
              className={`inline-flex w-full justify-center rounded-md px-3 py-2 text-sm font-semibold text-white shadow-sm sm:ml-3 sm:w-auto ${
                confirmText.toLowerCase() === 'delete my account' && !isLoading
                  ? 'bg-red-600 hover:bg-red-500'
                  : 'bg-red-300 cursor-not-allowed'
              }`}
            >
              {isLoading ? 'Deleting...' : 'Delete Account'}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
