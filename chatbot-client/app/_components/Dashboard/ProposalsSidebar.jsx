"use client";

import React from 'react';
import Image from 'next/image';

const ProposalsSidebar = () => {
  const proposals = [
    { title: "Translation of legal documents", category: "Translation" },
    { title: "Content writing", category: "Copywriting" }
  ];

  const projects = [
    { title: "Part time marketing support", status: "active" },
    { title: "Copywriting for Web", status: "active" },
    { title: "Direct Response Selling", status: "active" }
  ];

  const TaskItem = ({ task }) => (
    <div className="p-4 bg-white rounded-xl mb-3 hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start mb-2">
        <div>
          <h4 className="font-medium text-gray-900">{task.title}</h4>
          <span className="text-xs text-gray-500">{task.category}</span>
        </div>
        <span className={`px-2 py-1 text-xs rounded-full ${
          task.status === "In Progress" 
            ? "bg-blue-100 text-blue-800" 
            : "bg-green-100 text-green-800"
        }`}>
          {task.status}
        </span>
      </div>
      <div className="text-xs text-gray-500">{task.time}</div>
    </div>
  );

  return (
    <aside className="w-80 p-6 border-l border-gray-200">
      {/* User Profile */}
      <div className="flex items-center gap-3 mb-8">
        <div className="flex items-center gap-4">
          <Image 
            src="/images/ayman-wa3r.jpg"
            alt="Ayman Gassi"
            width={40}
            height={40}
            className="rounded-full object-cover w-10 h-10"
            style={{ borderRadius: '50%' }}
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

      {/* Recent Tasks Section */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm uppercase tracking-wider text-gray-400 font-['Inter'] relative inline-flex items-center">
            <span className="relative">
              Recent Tasks
              <div className="absolute -bottom-1 left-0 w-1/2 h-0.5 bg-gradient-to-r from-green-400 to-transparent"></div>
            </span>
            <span className="ml-2 px-2 py-0.5 bg-gray-100 rounded-full text-[10px] font-medium text-gray-500">
              {proposals.length}
            </span>
          </h2>
          <button className="text-xs text-green-500 hover:text-green-600 font-medium">
            View All
          </button>
        </div>
        {proposals.map((proposal, index) => (
          <div 
            key={index}
            className="p-4 rounded-2xl bg-gray-50 hover:bg-gray-100 transition-colors cursor-pointer"
          >
            <h3 className="font-medium mb-1">{proposal.title}</h3>
            <span className="text-sm text-gray-500">{proposal.category}</span>
          </div>
        ))}
      </div>

      {/* Last Tasks Section */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm uppercase tracking-wider text-gray-400 font-['Inter'] relative inline-flex items-center">
            <span className="relative">
              Last Tasks
              <div className="absolute -bottom-1 left-0 w-1/2 h-0.5 bg-gradient-to-r from-green-400 to-transparent"></div>
            </span>
            <span className="ml-2 px-2 py-0.5 bg-gray-100 rounded-full text-[10px] font-medium text-gray-500">
              {projects.length}
            </span>
          </h2>
          <button className="text-xs text-green-500 hover:text-green-600 font-medium">
            View All
          </button>
        </div>
        {projects.map((project, index) => (
          <div 
            key={index}
            className="p-4 rounded-2xl bg-gray-50 hover:bg-gray-100 transition-colors cursor-pointer flex items-center"
          >
            <div className="mr-3">
              <div className="w-2 h-2 rounded-full bg-green-400"></div>
            </div>
            <span className="font-medium">{project.title}</span>
          </div>
        ))}
      </div>

      {/* Add Tasks Button */}
      <button className="w-full mt-6 p-4 bg-[#4DDF96] text-white rounded-2xl hover:bg-opacity-90 transition-colors flex items-center justify-center gap-2">
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
        </svg>
        Add Tasks
      </button>
    </aside>
  );
};

export default ProposalsSidebar;
