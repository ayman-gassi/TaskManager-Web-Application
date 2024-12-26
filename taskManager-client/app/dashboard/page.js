'use client';

import React, { useState } from 'react';
import Sidebar from '../_components/Dashboard/Sidebar';
import UserHeader from '../_components/Dashboard/UserHeader';
import SearchBar from '../_components/Dashboard/SearchBar';
import TaskCard from '../_components/Dashboard/TaskCard';
import ProposalsSidebar from '../_components/Dashboard/ProposalsSidebar';
import MainNav from '../_components/Navigation/MainNav';

const taskData = {
  daysLeft: 2,
  title: "Build a Chat Application",
  category: "Web Development",
  description: "Looking for a developer to build a real-time chat application with features like message encryption, file sharing, and group chat functionality.",
  avatar: "https://ui-avatars.com/api/?name=John+Doe"
};

const DashboardPage = () => {
  const [searchResults, setSearchResults] = useState([]);
  const [hasSearched, setHasSearched] = useState(false);

  const handleSearch = (query) => {
    setHasSearched(!!query.trim());
    
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }

    // Example search implementation - modify based on your data structure
    const filteredResults = [taskData].filter(task => 
      task.title.toLowerCase().includes(query.toLowerCase()) ||
      task.category.toLowerCase().includes(query.toLowerCase()) ||
      task.description.toLowerCase().includes(query.toLowerCase())
    );

    setSearchResults(filteredResults);
  };

  const NoTasksFound = () => (
    <div className="absolute inset-0 flex flex-col items-center justify-center animate-fadeIn">
      <div className="relative w-32 h-32 mb-6 group">
        <div className="absolute inset-0 bg-[#4DDF96] bg-opacity-10 rounded-full animate-pulse group-hover:scale-110 transition-all duration-300"></div>
        <div className="absolute inset-0 flex items-center justify-center">
          <svg 
            className="w-16 h-16 text-[#4DDF96] transform group-hover:rotate-12 transition-all duration-300" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth="2" 
              d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M12 21a9 9 0 110-18 9 9 0 010 18z" 
              className="animate-draw"
            />
          </svg>
        </div>
      </div>
      <h3 className="text-2xl font-medium text-gray-900 mb-2 animate-slideUp [animation-delay:200ms]">
        No Tasks Found
      </h3>
      <p className="text-base text-gray-500 animate-slideUp [animation-delay:400ms]">
        Try adjusting your search to find what you&apos;re looking for.
      </p>
    </div>
    
  );

  return (
    <div className="flex min-h-screen bg-gray-50 animate-fadeIn">
      <Sidebar />
      
      <div className="flex-1 ml-20"> 
        <div className="flex flex-col h-screen">
          <MainNav />
          <main className="flex-1 p-8 relative">
            <UserHeader />
            <SearchBar onSearch={handleSearch} />
            
            {hasSearched ? (
              searchResults.length > 0 ? (
                <div className="max-w-md">
                  {searchResults.map((task, index) => (
                    <TaskCard key={index} {...task} />
                  ))}
                </div>
              ) : (
                <NoTasksFound />
              )
            ) : (
              <div className="max-w-md">
                <TaskCard {...taskData} />
              </div>
            )}
          </main>
        </div>
      </div>

      <ProposalsSidebar />
    </div>
  );
};

export default DashboardPage;
