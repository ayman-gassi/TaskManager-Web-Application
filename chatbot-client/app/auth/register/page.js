import Image from "next/image"
import Link from "next/link"
import { FaBriefcase, FaUser, FaEnvelope, FaLock } from "react-icons/fa";

function Register() {
  return (
    <div className="h-screen md:flex">
      <div
        className="relative overflow-hidden md:flex w-1/2 bg-gradient-to-tr from-primeColor to-secondColor justify-around items-center hidden">
<div>
  <h1 className="text-white font-bold text-4xl font-sans">Achieve More with TaskMaster</h1>
  <p className="text-white mt-1 text-lg font-semibold">Boost your productivity with our easy-to-use task manager!</p>
  <div class="grid xl:grid-cols-2 sm:grid-cols-2 gap-6 mt-4">
            <div class="flex items-center gap-3">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" class="fill-green-500 shrink-0" viewBox="0 0 24 24">
                <path d="M9.707 19.121a.997.997 0 0 1-1.414 0l-5.646-5.647a1.5 1.5 0 0 1 0-2.121l.707-.707a1.5 1.5 0 0 1 2.121 0L9 14.171l9.525-9.525a1.5 1.5 0 0 1 2.121 0l.707.707a1.5 1.5 0 0 1 0 2.121z" data-original="#000000"></path>
              </svg>
              <h6 class="text-base text-white">Easy Customization</h6>
            </div>
            <div class="flex items-center gap-3">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" class="fill-green-500 shrink-0" viewBox="0 0 24 24">
                <path d="M9.707 19.121a.997.997 0 0 1-1.414 0l-5.646-5.647a1.5 1.5 0 0 1 0-2.121l.707-.707a1.5 1.5 0 0 1 2.121 0L9 14.171l9.525-9.525a1.5 1.5 0 0 1 2.121 0l.707.707a1.5 1.5 0 0 1 0 2.121z" data-original="#000000"></path>
              </svg>
              <h6 class="text-base text-white">Seamless Communication</h6>
            </div>
            <div class="flex items-center gap-3">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" class="fill-green-500 shrink-0" viewBox="0 0 24 24">
                <path d="M9.707 19.121a.997.997 0 0 1-1.414 0l-5.646-5.647a1.5 1.5 0 0 1 0-2.121l.707-.707a1.5 1.5 0 0 1 2.121 0L9 14.171l9.525-9.525a1.5 1.5 0 0 1 2.121 0l.707.707a1.5 1.5 0 0 1 0 2.121z" data-original="#000000"></path>
              </svg>
              <h6 class="text-base text-white">Powerful Integration</h6>
            </div>
            <div class="flex items-center gap-3">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" class="fill-green-500 shrink-0" viewBox="0 0 24 24">
                <path d="M9.707 19.121a.997.997 0 0 1-1.414 0l-5.646-5.647a1.5 1.5 0 0 1 0-2.121l.707-.707a1.5 1.5 0 0 1 2.121 0L9 14.171l9.525-9.525a1.5 1.5 0 0 1 2.121 0l.707.707a1.5 1.5 0 0 1 0 2.121z" data-original="#000000"></path>
              </svg>
              <h6 class="text-base text-white">Unlimited Scalability</h6>
            </div>
          </div>
  <p className="text-white mt-4 text-sm">Sign up today and start organizing your tasks like never before!</p>
</div>


        <div className="absolute -bottom-32 -left-40 w-80 h-80 border-4 rounded-full border-opacity-30 border-t-8"></div>
        <div className="absolute -bottom-40 -left-20 w-80 h-80 border-4 rounded-full border-opacity-30 border-t-8"></div>
        <div className="absolute -top-40 -right-0 w-80 h-80 border-4 rounded-full border-opacity-30 border-t-8"></div>
        <div className="absolute -top-20 -right-20 w-80 h-80 border-4 rounded-full border-opacity-30 border-t-8"></div>
      </div>
      <div className="flex md:w-1/2 justify-center py-10 items-center ">
        <form className="bg-white w-4/5">
          <h1 className="text-gray-800 font-bold text-2xl mb-1">Hello, Welcome !</h1>
          <p className="text-sm font-normal text-gray-600 mb-7">Join Us</p>
          <div className="flex items-center border-2 py-2 px-3 rounded-2xl mb-4">
            <FaUser className="h-5 w-5 text-gray-400" />
            <input className="pl-2 outline-none border-none w-full" type="text" name="" id="" placeholder="Full name" />
          </div>
          <div className="flex items-center border-2 py-2 px-3 rounded-2xl mb-4">
            <FaBriefcase className="h-5 w-5 text-gray-400" />
            <select className="pl-2 outline-none border-none text-gray-400 w-full" placeholder="Country">
              <option disabled defaultValue >Select Your Position</option>
              <option value="Indonesia">Student</option>
              <option value="Malaysia">Employer</option>
              <option value="Singapore">Business Owner</option>
              <option value="Thailand">other</option>
            </select>
          </div>
          <div className="flex items-center border-2 py-2 px-3 rounded-2xl mb-4">
            <FaEnvelope className="h-5 w-5 text-gray-400" />
            <input className="pl-2 outline-none border-none w-full" type="text" name="" id="" placeholder="Email Address" />
          </div>
          <div className="flex items-center border-2 py-2 px-3 rounded-2xl mb-3">
            <FaLock className="h-5 w-5 text-gray-400" />
            <input className="pl-2 outline-none border-none w-full" type="text" name="" id="" placeholder="Password" />
          </div>
          <div className="flex items-center border-2 py-2 px-3 rounded-2xl">
            <FaLock className="h-5 w-5 text-gray-400" />
            <input className="pl-2 outline-none border-none w-full" type="text" name="" id="" placeholder="Confirm Password" />
          </div>
          <button type="submit" className="block w-full bg-secondColor mt-4 py-2 rounded-2xl text-white font-semibold mb-2">Login</button>
          <Link href='/auth/login' className="text-sm ml-2 hover:text-secondColor cursor-pointer">Have Account ?</Link>
          <p className="text-center text-gray-500 mt-4">By signing up, you agree to our <span className="text-secondColor cursor-pointer">Terms of Service</span> and <span className="text-secondColor cursor-pointer">Privacy Policy</span>.</p>
        </form>
      </div>
    </div>
  )
}

export default Register
