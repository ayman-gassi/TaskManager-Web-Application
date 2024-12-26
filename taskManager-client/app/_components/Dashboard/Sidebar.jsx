import React from 'react';
import { SiTask } from "react-icons/si";

const Sidebar = () => {
  const menuItems = [
    { icon: "M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6", label: "Dashboard" },
    { icon: "M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2", label: "Projects" },
    { icon: "M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z", label: "History" },
  ];

  return (
    <div className="fixed top-0 left-0 h-screen w-20 bg-white border-r border-gray-200 flex flex-col py-8 z-10">
      <div className="mb-8">
        <div className="w-12 h-12 mx-auto bg-green-400 rounded-xl flex items-center justify-center">
       
          <SiTask className="w-8 h-8 text-white" />
        </div>
      </div>

      <nav className="flex-1 flex flex-col justify-center space-y-8">
        {menuItems.map((item, index) => (
          <button
            key={index}
            className="w-12 h-12 mx-auto flex items-center justify-center rounded-xl hover:bg-gray-100 text-gray-500 hover:text-gray-900 transition-all duration-200"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={item.icon} />
            </svg>
          </button>
        ))}
      </nav>

      <div className="mt-auto">
        <button className="w-12 h-12 mx-auto flex items-center justify-center rounded-xl bg-green-400 text-white hover:bg-green-500 transition-all duration-200">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
