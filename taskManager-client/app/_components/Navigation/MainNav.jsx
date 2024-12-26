"use client";

import React from 'react';
import { usePathname } from 'next/navigation';
import SwitchButton from '../UI/SwitchButton';

const MainNav = () => {
  const pathname = usePathname();
  const isChat = pathname === '/chat';

  return (
    <nav className="h-16 flex items-center justify-center mt-8">
      <SwitchButton isChat={isChat} />
    </nav>
  );
};

export default MainNav;
