'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';

const TaskCard = ({ 
  title, 
  category, 
  description,
  daysLeft, 
  avatar 
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [count, setCount] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  // Animate count up to daysLeft
  useEffect(() => {
    if (count < daysLeft) {
      setIsAnimating(true);
      const timer = setTimeout(() => {
        setCount(prev => Math.min(prev + 1, daysLeft));
      }, 100);
      return () => clearTimeout(timer);
    } else {
      setIsAnimating(false);
    }
  }, [count, daysLeft]);

  // Reset count when daysLeft changes
  useEffect(() => {
    setCount(0);
    setIsAnimating(true);
  }, [daysLeft]);

  return (
    <div className="bg-[#4DDF96] rounded-3xl p-8 text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02] cursor-pointer group">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="flex items-center px-3 py-1.5 bg-white bg-opacity-20 rounded-full backdrop-blur-sm transition-all duration-300 group-hover:bg-opacity-30">
            <div className="w-1.5 h-1.5 bg-white rounded-full mr-2 animate-pulse"></div>
            <span className="text-[11px] font-light tracking-wider group-hover:tracking-widest transition-all duration-300">
              <span className={`font-medium mr-1 inline-block transition-all duration-300 ${isAnimating ? 'scale-110 text-white' : ''} ${isHovered ? 'animate-bounce' : ''}`}>
                {count}
              </span>
              <span className={`text-white/80 text-[12px] normal-case inline-block transition-all duration-300 ${isHovered ? 'translate-x-1 text-white' : ''}`}>
                Days Left
              </span>
            </span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full overflow-hidden">
            <Image
            src="/images/ayman-wa3r.jpg"
            alt="User Avatar"
              width={32}
              height={32}
              className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-110"
              onError={(e) => {
                e.target.src = '/images/ayman-wa3r.jpg'
              }}
              priority
            />
          </div>
          <button className="text-white opacity-60 hover:opacity-100 transition-opacity duration-200">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
            </svg>
          </button>
        </div>
      </div>

      <h3 className="text-2xl font-semibold mb-2 group-hover:tracking-wide transition-all duration-300">{title}</h3>
      <div className="text-base opacity-90 mb-4 transition-all duration-300 group-hover:opacity-100">{category}</div>
      
      <p className="text-base opacity-90 line-clamp-2 transition-all duration-300 group-hover:opacity-100">
        {description}
      </p>
    </div>
  );
};

export default TaskCard;
