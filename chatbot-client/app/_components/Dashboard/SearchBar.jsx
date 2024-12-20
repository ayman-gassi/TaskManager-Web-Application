"use client";

import React, { useState, useRef, useEffect } from 'react';

const SearchBar = ({ onSearch }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleSearch = (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    if (onSearch) {
      onSearch(query);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (onSearch) {
      onSearch(searchQuery);
    }
  };

  return (
    <div className="flex justify-between items-center mb-8">
      <form onSubmit={handleSubmit} className={`max-w-md w-full relative bg-white rounded-full shadow-sm transition-all duration-200 ${isFocused ? 'shadow-md scale-[1.01]' : ''}`}>
        <input
          type="text"
          value={searchQuery}
          onChange={handleSearch}
          placeholder="Search Keyword"
          className="w-full pl-12 pr-4 h-11 rounded-3xl text-sm text-gray-600 placeholder-gray-400 focus:outline-none bg-white transition-all duration-200"
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
        />
        <button 
          type="submit"
          className="absolute left-4 top-1/2 -translate-y-1/2"
        >
          <svg 
            className={`w-5 h-5 transition-colors duration-200 ${isFocused ? 'text-[#4DDF96]' : 'text-gray-400'}`} 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </button>
      </form>

      <div className="flex items-center gap-2 ml-4">
        <button className="h-10 w-10 rounded-lg bg-gray-50 border border-[#BEBEC6] flex items-center justify-center transition-all duration-200 hover:bg-gray-100 active:scale-95">
          <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h7" />
          </svg>
        </button>

        <div className="relative" ref={dropdownRef}>
          <button 
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="h-10 pl-4 pr-3 rounded-lg bg-gray-50 border border-[#BEBEC6] flex items-center gap-3 hover:bg-gray-100 transition-all duration-200 active:scale-95"
          >
            <span className="text-sm text-gray-400">Filter Button</span>
            <svg 
              className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`}
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          {isDropdownOpen && (
            <div className="absolute top-full mt-1 w-full bg-white border border-[#BEBEC6] rounded-lg shadow-lg py-1">
              <button className="w-full px-4 py-2 text-sm text-gray-600 hover:bg-gray-50 text-left transition-all duration-200">Highest budget</button>
              <button className="w-full px-4 py-2 text-sm text-gray-600 hover:bg-gray-50 text-left transition-all duration-200">Lowest budget</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SearchBar;
