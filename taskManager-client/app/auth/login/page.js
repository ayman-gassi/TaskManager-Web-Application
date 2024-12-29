"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { useState } from "react";
import axios from "axios";
import Cookies from 'js-cookie';

function Login() {
  const router = useRouter();
  const { register, handleSubmit, formState: { errors } } = useForm();
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const onSubmit = async (data) => {
    try {
      setIsLoading(true);
      setErrorMessage("");
      
      const response = await axios.post("http://localhost:9000/api/users/login", {
        email: data.email,
        password: data.password
      });

      if (response.data.state) {
        // Store the token and user data immediately
        if (response.data.token && response.data.user) {
          // Capitalize the first letter of each word in the name
          const formattedName = response.data.user.fullName
            .split(' ')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
            .join(' ');
            
          localStorage.setItem('token', response.data.token);
          localStorage.setItem('userName', formattedName);
          localStorage.setItem('userEmail', response.data.user.email);
          localStorage.setItem('userJob', response.data.user.job);
          localStorage.setItem('userLocation', response.data.user.location || 'Casablanca, Morocco');
          localStorage.setItem('userJoinedDate', response.data.user.joinedDate || new Date().toISOString());
          Cookies.set('token', response.data.token, { expires: 7 });
          // Redirect immediately after setting tokens
          router.replace('/overview?welcome=true');
        }
      } else {
        setErrorMessage(response.data.message || "Login failed");
      }
    } catch (error) {
      console.error("Login error:", error);
      setErrorMessage(error.response?.data?.message || "An error occurred during login");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex w-screen flex-wrap text-slate-800">
      <div className="flex w-full flex-col md:w-1/2">
        <div className="flex justify-center pt-12 md:justify-start md:pl-12">
          <Link href="/" className="text-2xl font-bold text-primeColor"> Star Company </Link>
        </div>
        <div className="my-auto mx-auto flex flex-col justify-center px-6 pt-8 md:justify-start lg:w-[28rem]">
          <p className="text-center text-3xl font-bold md:leading-tight md:text-left md:text-5xl">
            Welcome back <br />
            to <span className="text-primeColor">Star Company</span>
          </p>
          <p className="mt-6 text-center font-medium md:text-left">Sign in to your account below.</p>

          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col items-stretch pt-3 md:pt-8">
            <div className="flex flex-col pt-4">
              <div className="relative flex overflow-hidden rounded-md border-2 transition focus-within:border-primeColor">
                <input
                  type="email"
                  id="login-email"
                  {...register("email", { 
                    required: "Email is required",
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: "Invalid email address"
                    }
                  })}
                  className="w-full flex-shrink appearance-none border-gray-300 bg-white py-2 px-4 text-base text-gray-700 placeholder-gray-400 focus:outline-none"
                  placeholder="Email"
                  disabled={isLoading}
                />
              </div>
              {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}
            </div>
            <div className="mb-4 flex flex-col pt-4">
              <div className="relative flex overflow-hidden rounded-md border-2 transition focus-within:border-primeColor">
                <input
                  type="password"
                  id="login-password"
                  {...register("password", { 
                    required: "Password is required",
                    minLength: {
                      value: 6,
                      message: "Password must be at least 6 characters"
                    }
                  })}
                  className="w-full flex-shrink appearance-none border-gray-300 bg-white py-2 px-4 text-base text-gray-700 placeholder-gray-400 focus:outline-none"
                  placeholder="Password"
                  disabled={isLoading}
                />
              </div>
              {errors.password && <p className="text-red-500 text-sm">{errors.password.message}</p>}
            </div>
            {errorMessage && <p className="mt-4 text-center text-sm text-red-500">{errorMessage}</p>}
            <Link href="/auth/forgot-password" className="mb-6 text-center text-sm font-medium text-gray-600 md:text-left">Forgot password?</Link>
            <button
              type="submit"
              disabled={isLoading}
              className={`rounded-lg bg-primeColor px-4 py-2 text-center text-base font-semibold text-white shadow-md outline-none ring-thirdColor ring-offset-2 transition hover:bg-thirdColor focus:ring-2 md:w-32 ${
                isLoading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-thirdColor'
              }`}
            >
              {isLoading ? 'Signing in...' : 'Sign in'}
            </button>
          </form>
         
          <div className="py-12 text-center">
            <p className="text-gray-600">
              Don't have an account?
              <Link href="/auth/register" className="ml-1 whitespace-nowrap font-semibold text-thirdColor">Sign up for free.</Link>
            </p>
          </div>
        </div>
      </div>
      <div className="relative hidden h-screen select-none bg-thirdColor bg-gradient-to-br md:block md:w-1/2">
        <div className="py-16 px-8 text-white xl:w-[40rem]">
          <span className="rounded-full bg-white px-3 py-1 font-medium text-primeColor">New Feature</span>
          <p className="my-6 text-3xl font-semibold leading-10">Manage Your tasks now with <span className="abg-white whitespace-nowrap py-2 text-cyan-300">Chat-Star</span>.</p>
          <p className="mb-4">Streamline your workflow and boost productivity with our intuitive task management system.</p>
          <a href="#" className="font-semibold tracking-wide text-white underline underline-offset-4">Learn More</a>
        </div>
        <img className="ml-8 w-11/12 max-w-lg rounded-lg object-cover" src="https://cdn.devdojo.com/images/march2021/green-dashboard.jpg" alt="Dashboard Preview" />
      </div>
    </div>
  );
}

export default Login;
