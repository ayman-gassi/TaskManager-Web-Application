"use client";
import Link from "next/link";
import { SiTask } from "react-icons/si";
import { IoIosArrowDown } from "react-icons/io";
import { FaRegUserCircle  } from "react-icons/fa";
import { SlSettings } from "react-icons/sl";
import { RiDashboardLine } from "react-icons/ri";
import { PiSignOut } from "react-icons/pi";
import { LuSquareUserRound } from "react-icons/lu";
import { GoTasklist } from "react-icons/go";
import { CiViewTimeline } from "react-icons/ci";
import { useContext, useEffect , useState } from "react";
import { AuthContext } from "../../_context/AuthContext";
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';
import axios from "axios";

function  Narbar() {
  const { user, setUser } = useContext(AuthContext);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const navigate = useRouter();
  useEffect(() => {
    AuthInfo();
  }, []);
  const AuthInfo = async () => {
    try {
      const token = Cookies.get('token');
      if (token) {
        const res = await axios.get(process.env.NEXT_PUBLIC_API_URL+'users/auth', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        setUser(res.data.user);
      }
    } catch (error) {
      console.log(error);
    }
  }
  const logout = async () => {  
    try {
      Cookies.remove('token');
      setUser(null);
      navigate.push('/auth/login');
    } catch (error) {
      console.log(error);
    }
  }
  return (
    <header className="bg-white">
      <div className="mx-auto max-w-screen-xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="flex md:flex md:items-center md:gap-12">
            <Link className=" text-primeColor flex justify-center items-center" href="/">
              <span className="sr-only">Home</span>
              <SiTask className="h-10 w-10" />
              <h1 className="ml-2 font-bold" >Star Company</h1>
            </Link>
          </div>

          <div className="md:flex md:items-center md:gap-12">
            <nav aria-label="Global" className="hidden md:block">
              <ul className="flex items-center gap-6 text-sm">
              <li>
                  <Link className="text-gray-500 transition hover:text-gray-500/75" href="/"> Home </Link>
                </li>
                <li>
                  <Link className="text-gray-500 transition hover:text-gray-500/75" href="/guide"> Guide </Link>
                </li>
                <li>
                  <Link className="text-gray-500 transition hover:text-gray-500/75" href="/contact"> Contact Us </Link>
                </li>
              </ul>
            </nav>

            <div className="flex items-center gap-4">
              {user == null ? (
                <div className="sm:flex sm:gap-4">
                  <Link
                    className="rounded-md bg-primeColor px-5 py-2.5 text-sm font-medium text-white shadow"
                    href="/auth/login"
                  >
                    Login
                  </Link>

                  <div className="hidden sm:flex">
                    <Link
                      className="rounded-md bg-gray-100 px-5 py-2.5 text-sm font-medium text-primeColor shadow"
                      href="/auth/register"
                    >
                      Register
                    </Link>
                  </div>
                </div>
              ) : (
                <div className="relative inline-flex">
                  <button onClick={()=>{setIsDropdownOpen(!isDropdownOpen)}}  type="button" className="hs-dropdown-toggle py-2 px-4 inline-flex items-center gap-x-2 text-sm font-medium rounded-lg border border-gray-200 bg-white text-gray-800 shadow-sm hover:bg-gray-50 focus:outline-none focus:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-800 dark:border-neutral-700 dark:text-white dark:hover:bg-neutral-700 dark:focus:bg-neutral-700" aria-haspopup="menu" aria-expanded="false" aria-label="Dropdown">
                    <FaRegUserCircle className="size-5" />
                    <span>{user.fullName}</span>
                    <IoIosArrowDown className={`size-4 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
                  </button>
                  {isDropdownOpen && (
                  <div className="absolute left-0 transition-[opacity,margin] duration min-w-60 bg-white shadow-md rounded-lg mt-10 divide-y divide-gray-200 dark:bg-neutral-800 dark:border dark:border-neutral-700 dark:divide-neutral-700" role="menu" aria-orientation="vertical" aria-labelledby="hs-dropdown-with-dividers">
                    <div className="p-1 space-y-0.5">
                    <a className="flex items-center gap-x-3.5 py-2 px-3 rounded-lg text-sm text-gray-800 hover:bg-gray-100 focus:outline-none focus:bg-gray-100 dark:text-neutral-400 dark:hover:bg-neutral-700 dark:hover:text-neutral-300 dark:focus:bg-neutral-700" href="#">
                        <RiDashboardLine  className="size-5" />
                        Dashboard
                      </a>
                      <a className="flex items-center gap-x-3.5 py-2 px-3 rounded-lg text-sm text-gray-800 hover:bg-gray-100 focus:outline-none focus:bg-gray-100 dark:text-neutral-400 dark:hover:bg-neutral-700 dark:hover:text-neutral-300 dark:focus:bg-neutral-700" href="#">
                        <CiViewTimeline  className="size-5" />
                        Overview
                      </a>
                      <a className="flex items-center gap-x-3.5 py-2 px-3 rounded-lg text-sm text-gray-800 hover:bg-gray-100 focus:outline-none focus:bg-gray-100 dark:text-neutral-400 dark:hover:bg-neutral-700 dark:hover:text-neutral-300 dark:focus:bg-neutral-700" href="#">
                        <GoTasklist  className="size-5" />
                        Tasks
                      </a>
                    </div>
                    <div className="p-1 space-y-0.5">
                      <a className="flex items-center gap-x-3.5 py-2 px-3 rounded-lg text-sm text-gray-800 hover:bg-gray-100 focus:outline-none focus:bg-gray-100 dark:text-neutral-400 dark:hover:bg-neutral-700 dark:hover:text-neutral-300 dark:focus:bg-neutral-700" href="#">
                      <LuSquareUserRound className="size-5" />
                        Profil
                      </a>
                    </div>
                    <div className="p-1 space-y-0.5">
                      <a className="flex items-center gap-x-3.5 py-2 px-3 rounded-lg text-sm text-gray-800 hover:bg-gray-100 focus:outline-none focus:bg-gray-100 dark:text-neutral-400 dark:hover:bg-neutral-700 dark:hover:text-neutral-300 dark:focus:bg-neutral-700" href="#">
                        <SlSettings className="size-5" />
                        Account Settings
                      </a>
                      <button onClick={()=>{logout()}} className="flex w-full items-center gap-x-3.5 py-2 px-3 rounded-lg text-sm text-gray-800 hover:bg-red-50 focus:outline-none focus:bg-gray-100 dark:text-neutral-400 dark:hover:bg-neutral-700 dark:hover:text-neutral-300 dark:focus:bg-neutral-700">
                         <PiSignOut className="size-5" />
                        Sign out
                      </button>
                    </div>
                  </div>
                  )}
                </div>
              )}


              <div className="block md:hidden">
                <button className="rounded bg-gray-100 p-2 text-gray-600 transition hover:text-gray-600/75">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="size-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}

export default Narbar
