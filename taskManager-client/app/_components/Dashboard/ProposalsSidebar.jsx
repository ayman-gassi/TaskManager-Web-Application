"use client";

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import styles from './ProposalsSidebar.module.css';

const ProposalsSidebar = ({ onToggle }) => {
  const [isOpen, setIsOpen] = useState(false);

  // Effect to add padding to main content when sidebar is open
  useEffect(() => {
    const mainContent = document.querySelector('.main-content');
    if (mainContent) {
      mainContent.style.transition = 'padding-right 300ms ease-in-out';
      mainContent.style.paddingRight = isOpen ? '320px' : '0';
    }
    return () => {
      if (mainContent) {
        mainContent.style.paddingRight = '0';
      }
    };
  }, [isOpen]);

  // Notify parent of sidebar state changes
  useEffect(() => {
    if (onToggle) {
      onToggle(isOpen);
    }
  }, [isOpen, onToggle]);

  // Added more sample data to demonstrate scrolling
  const proposals = [
    { title: "Translation of legal documents", category: "Translation" },
    { title: "Content writing", category: "Copywriting" },
    { title: "Website redesign", category: "Web Design" },
    { title: "Mobile app development", category: "Development" },
    { title: "Marketing strategy", category: "Marketing" }
  ];

  const projects = [
    { title: "Part time marketing support", status: "active" },
    { title: "Copywriting for Web", status: "active" },
    { title: "Direct Response Selling", status: "active" },
    { title: "Social Media Campaign", status: "active" },
    { title: "Email Marketing", status: "active" }
  ];

  return (
    <>
      {/* Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`fixed right-0 top-1/2 transform -translate-y-1/2 bg-white p-2 rounded-l-lg shadow-md z-50 hover:bg-gray-100 transition-all duration-300 ${
          isOpen ? 'translate-x-0' : 'translate-x-0'
        }`}
      >
        <svg
          className={`w-6 h-6 text-gray-600 transform transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M9 5l7 7-7 7"
          />
        </svg>
      </button>

      {/* Sidebar Content */}
      <aside 
        className={`fixed right-0 top-0 h-screen bg-white border-l border-gray-200 transform transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        } flex flex-col z-40`}
        style={{ width: '320px' }}
      >
        {/* Fixed Header */}
        <div className="p-6 border-b border-gray-200 bg-white">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-4">
              <Image 
                src="/images/ayman-wa3r.jpg"
                alt="Ayman Gassi"
                width={40}
                height={40}
                className="rounded-full object-cover w-10 h-10"
                priority
              />
              <span className="font-medium">Ayman gassi</span>
            </div>
            <div className="flex items-center gap-2 ml-auto">
              <button 
                className="relative group p-2 rounded-full hover:bg-gray-100 transition-all duration-200"
                onClick={() => {/* Handle click */}}
              >
                <svg className="w-6 h-6 text-gray-600 group-hover:text-gray-800 transition-colors duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
                <span className="absolute -top-1 -right-1 min-w-[20px] h-5 bg-[#FA716C] text-white text-xs font-medium rounded-full flex items-center justify-center px-1.5 shadow-sm group-hover:scale-110 transition-transform duration-200">
                  2
                </span>
              </button>
            </div>
          </div>
        </div>

        {/* Scrollable Content */}
        <div className={`flex-1 overflow-y-auto ${styles['custom-scrollbar']}`}>
          <div className="p-6">
            {/* Proposals Section */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold mb-4">Recent Proposals</h3>
              <div className="space-y-3">
                {proposals.map((proposal, index) => (
                  <div key={index} className="p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors cursor-pointer">
                    <h4 className="font-medium text-gray-900">{proposal.title}</h4>
                    <span className="text-sm text-gray-500">{proposal.category}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Projects Section */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-4">Active Projects</h3>
              <div className="space-y-3">
                {projects.map((project, index) => (
                  <div key={index} className="p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors cursor-pointer">
                    <h4 className="font-medium text-gray-900">{project.title}</h4>
                    <span className="inline-block px-2 py-1 mt-2 text-xs bg-green-100 text-green-800 rounded-full">
                      {project.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Fixed Footer */}
        <div className="p-6 border-t border-gray-200 bg-white">
          <button className="w-full p-4 bg-[#4DDF96] text-white rounded-2xl hover:bg-opacity-90 transition-colors flex items-center justify-center gap-2">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            Add Tasks
          </button>
        </div>
      </aside>
    </>
  );
};

export default ProposalsSidebar;
