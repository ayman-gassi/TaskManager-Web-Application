'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { SiTask } from "react-icons/si";

function Footer() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return (
<footer className="bg-gray-100">
  <div className="mx-auto max-w-screen-xl px-4 py-16 sm:px-6 lg:px-8">
    <div
      className="flex flex-col items-center gap-4 rounded-lg bg-[#1F509A] p-6 shadow-lg sm:flex-row sm:justify-between"
    >
      <strong className="text-xl text-white sm:text-xl"> Make Your Next Career Move! </strong>

      <Link
        className="inline-flex items-center gap-2 rounded-full border border-white bg-white px-8 py-3 text-[#1F509A] hover:bg-transparent hover:text-white focus:outline-none focus:ring active:bg-white/90"
        href="/auth/register"
      >
        <span className="text-sm font-medium"> Let's Get Started </span>

        <svg
          className="size-5 rtl:rotate-180"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M17 8l4 4m0 0l-4 4m4-4H3"
          />
        </svg>
      </Link>
    </div>


    <div className="mt-16">

      <div className="mt-16 sm:flex sm:items-center sm:justify-between">
        <div className=" font-bold flex justify-center items-center text-[#1F509A] sm:justify-start">
        <SiTask className="h-10 w-10" />
        <p className="ml-2">Star Company</p>
        </div>

        <p className="mt-4 text-center text-sm text-gray-500 sm:mt-0 sm:text-right">
          StarCompany &copy; 2024. All rights reserved.
        </p>
      </div>
    </div>
  </div>
</footer>
  )
}

export default Footer
