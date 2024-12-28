"use client";
import Link from "next/link";
import { FaBriefcase, FaUser , FaEnvelope, FaLock, FaEye, FaEyeSlash } from "react-icons/fa";
import { set, useForm } from "react-hook-form";
import { useState } from "react";
import SideNotification from "@/app/_components/Notifications/SideNotification";
import ErrorAlert from "@/app/_components/Notifications/ErrorAlert";
import axios from "axios";
import { useRouter } from "next/navigation";
function Register() {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [message, setMessage] = useState("");
  const [showSuccess, setShowSuccess] = useState(false);
  const [showError, setShowError] = useState(false);
  const navigate = useRouter();
  const onSubmit = async (data) => {
    setMessage("");
    setShowError(false);
    if(data.password !== data.confirmPassword){
      setMessage("Password and Confirm Password do not match");
      setShowError(true);
    }else{
    try {
      const response = await axios.post(process.env.NEXT_PUBLIC_API_URL+"users/register", data);
      if(response.data.state === false){
        setMessage(response.data.message);
        setShowError(true);
      }
      else{
        setTimeout(() => {
          navigate.push("/auth/login");
      }, 3000);
        setMessage(response.data.message);
        setShowSuccess(true);
      }
    } catch (error) {
        console.log(error);
      }
    }
  };

  return (
    <div className="h-screen md:flex">
      {showSuccess && (
      <SideNotification message={message} duration={3000} onClose={() => setShowSuccess(false)} />
      )}
      <div
        className="relative overflow-hidden md:flex w-1/2 bg-gradient-to-tr from-primeColor to-secondColor justify-around items-center hidden">
        <div>
          <h1 className="text-white font-bold text-4xl font-sans">Achieve More with TaskMaster</h1>
          <p className="text-white mt-1 text-lg font-semibold">Boost your productivity with our easy-to-use task manager!</p>
          <div className="grid xl:grid-cols-2 sm:grid-cols-2 gap-6 mt-4">
            <div className="flex items-center gap-3">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" className="fill-green-500 shrink-0" viewBox="0 0 24 24">
                <path d="M9.707 19.121a.997.997 0 0 1-1.414 0l-5.646-5.647a1.5 1.5 0 0 1 0-2.121l.707-.707a1.5 1.5 0 0 1 2.121 0L9 14.171l9.525-9.525a1.5 1.5 0 0 1 2.121 0l.707.707a1.5 1.5 0 0 1 0 2.121z" data-original="#000000"></path>
              </svg>
              <h6 className="text-base text-white">Easy Customization</h6>
            </div>
            <div className="flex items-center gap-3">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" className="fill-green-500 shrink-0" viewBox="0 0 24 24">
                <path d="M9.707 19.121a.997.997 0 0 1-1.414 0l-5.646-5.647a1.5 1.5 0 0 1 0-2.121l.707-.707a1.5 1.5 0 0 1 2.121 0L9 14.171l9.525-9.525a1.5 1.5 0 0 1 2.121 0l.707.707a1.5 1.5 0 0 1 0 2.121z" data-original="#000000"></path>
              </svg>
              <h6 className="text-base text-white">Seamless Communication</h6>
            </div>
            <div className="flex items-center gap-3">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" className="fill-green-500 shrink-0" viewBox="0 0 24 24">
                <path d="M9.707 19.121a.997.997 0 0 1-1.414 0l-5.646-5.647a1.5 1.5 0 0 1 0-2.121l.707-.707a1.5 1.5 0 0 1 2.121 0L9 14.171l9.525-9.525a1.5 1.5 0 0 1 2.121 0l.707.707a1.5 1 .5 0 0 1 0 2.121z" data-original="#000000"></path>
              </svg>
              <h6 className="text-base text-white">Powerful Integration</h6>
            </div>
            <div className="flex items-center gap-3">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" className="fill-green-500 shrink-0" viewBox="0 0 24 24">
                <path d="M9.707 19.121a.997.997 0 0 1-1.414 0l-5.646-5.647a1.5 1.5 0 0 1 0-2.121l.707-.707a1.5 1.5 0 0 1 2.121 0L9 14.171l9.525-9.525a1.5 1.5 0 0 1 2.121 0l.707.707a1.5 1.5 0 0 1 0 2.121z" data-original="#000000"></path>
              </svg>
              <h6 className="text-base text-white">Unlimited Scalability</h6>
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
        <form  autoComplete="off" className="bg-white w-4/5" onSubmit={handleSubmit(onSubmit)}>
          <h1 className="text-gray-800 font-bold text-2xl mb-1">Hello, Welcome !</h1>
          <p className="text-sm font-normal text-gray-600 mb-7">Join Us</p>
          <div className={`flex items-center border-2 py-2 px-3 rounded-md mb-4 ${errors.fullName ? 'border-red-400 ' : ''}`}>
            <FaUser className={`h-5 w-5 text-gray-400 ${errors.fullName ? 'text-red-400' : ''}`} />
            <input 
              className={`pl-2 outline-none border-none w-full ${errors.fullName ? 'placeholder-red-400' : ''}`} 
              type="text" 
              placeholder={errors.fullName ? 'Full name is required' : 'Full name'} 
              {...register("fullName", { required: true })} 
            />
          </div>
          <div className={`flex items-center border-2 py-2 px-3 rounded-md mb-4 ${errors.position ? 'border-red-400 ' : ''}`}>
            <FaBriefcase className={`h-5 w-5 text-gray-400 ${errors.position ? 'text-red-400' : ''}`} />
            <select 
              className={`pl-2 outline-none border-none text-gray-400 w-full ${errors.position ? 'text-red-400' : ''}`} 
              {...register("job", { required: true })}>
              <option disabled defaultValue>{errors.position ? 'Position is required' : 'Select Your Position'}</option>
              <option value="Student">Student</option>
              <option value="Employer">Employer</option>
              <option value="Business Owner">Business Owner</option>
              <option value="Other">Other</option>
            </select>
          </div>
          <div className={`flex items-center border-2 py-2 px-3 rounded-md mb-4 ${errors.email ? 'border-red-400 ' : ''}`}>
            <FaEnvelope className={`h-5 w-5 text-gray-400 ${errors.email ? 'text-red-400' : ''}`} />
            <input 
              className={`pl-2 outline-none border-none w-full ${errors.email ? 'placeholder-red-400' : ''}`} 
              type="email" 
              placeholder={errors.email ? 'Email is required' : 'Email Address'} 
              {...register("email", { required: true })} 
            />
          </div>
          <div className={`flex items-center border-2 py-2 px-3 rounded-md mb-4 ${errors.email ? 'border-red-400 ' : ''}`}>
            <FaLock className={`h-5 w-5 text-gray-400 ${errors.email ? 'text-red-400' : ''}`} />
            <input 
              className={`pl-2 outline-none border-none w-full ${errors.password ? 'placeholder-red-400' : ''}`} 
              type={showPassword ? "text" : "password"} 
              placeholder={errors.password ? 'Password is required' : 'Password'} 
              {...register("password", { required: true })} 
            />
            <button className="h-5 w-5 text-gray-400" type="button" onClick={() => setShowPassword(!showPassword)}>
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>
          <div className={`flex items-center border-2 py-2 px-3 rounded-md mb-4 ${errors.email ? 'border-red-400 ' : ''}`}>
            <FaLock className={`h-5 w-5 text-gray-400 ${errors.email ? 'text-red-400' : ''}`} />
            <input 
              className={`pl-2 outline-none border-none w-full  ${errors.confirmPassword ? 'placeholder-red-400' : ''}`}
              type={showConfirmPassword ? "text" : "password"} 
              placeholder={errors.confirmPassword ? 'Password is required' : 'Confirm Password'} 
              {...register("confirmPassword", { required: true })} 
            />
            <button className="h-5 w-5 text-gray-400" type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)}>
              {showConfirmPassword ? <FaEyeSlash   /> : <FaEye />}
            </button>
          </div>
          {showError && (
            <ErrorAlert errorMessage={message} />
          )}
          <button type="submit" className="block w-full bg-secondColor mt-4 py-2 rounded-md text-white font-semibold mb-2">Register</button>
          <Link href='/auth/login' className="text-sm ml-2 hover:text-secondColor cursor-pointer">Have an Account?</Link>
          <p className="text-center text-gray-500 mt-4">By signing up, you agree to our <span className="text-secondColor cursor-pointer">Terms of Service</span> and <span className="text-secondColor cursor-pointer">Privacy Policy</span>.</p>
        </form>
      </div>
    </div>
  );
}

export default Register;