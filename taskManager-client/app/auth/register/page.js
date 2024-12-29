"use client";
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { FaBriefcase, FaUser, FaEnvelope, FaLock } from "react-icons/fa";

function Register() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    fullName: "",
    job: "",
    email: "",
    password: "",
    confirmPassword: ""
  });
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    try {
      const response = await fetch("http://localhost:9000/api/users/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          fullName: formData.fullName,
          job: formData.job,
          email: formData.email,
          password: formData.password
        }),
      });

      const data = await response.json();

      if (data.state) {
        router.push("/auth/login");
      } else {
        setError(data.message);
      }
    } catch (err) {
      setError("An error occurred during registration");
      console.error(err);
    }
  };

  return (
    <div className="h-screen md:flex">
      <div className="relative overflow-hidden md:flex w-1/2 bg-gradient-to-tr from-primeColor to-secondColor justify-around items-center hidden">
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
                <path d="M9.707 19.121a.997.997 0 0 1-1.414 0l-5.646-5.647a1.5 1.5 0 0 1 0-2.121l.707-.707a1.5 1.5 0 0 1 2.121 0L9 14.171l9.525-9.525a1.5 1.5 0 0 1 2.121 0l.707.707a1.5 1.5 0 0 1 0 2.121z" data-original="#000000"></path>
              </svg>
              <h6 className="text-base text-white">Powerful Integration</h6>
            </div>
            <div className="flex items-center gap-3">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" className="fill-green-500 shrink-0" viewBox="0 0 24 24">
                <path d="M9.707 19.121a.997.997 0 0 1-1.414 0l-5.646-5.647a1.5 1.5 0 0 1 0-2.121l.707-.707a1.5 1.5 0 0 1 2.121 0L9 14.171l9.525-9.525a1.5 1.5 0 0 1 2.121 0l.707.707a1.5 1.5 0 0 1 0 2.121z" data-original="#000000"></path>
              </svg>
              <h6 className="text-base text-white">Smart Task Management</h6>
            </div>
          </div>
        </div>
      </div>
      <div className="flex md:w-1/2 justify-center py-10 items-center bg-white">
        <form className="bg-white" onSubmit={handleSubmit}>
          <h1 className="text-gray-800 font-bold text-2xl mb-1">Hello Again!</h1>
          <p className="text-sm font-normal text-gray-600 mb-7">Join Us</p>
          {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
          <div className="flex items-center border-2 py-2 px-3 rounded-2xl mb-4">
            <FaUser className="h-5 w-5 text-gray-400" />
            <input 
              className="pl-2 outline-none border-none w-full" 
              type="text" 
              name="fullName" 
              value={formData.fullName}
              onChange={handleChange}
              placeholder="Full name" 
              required 
            />
          </div>
          <div className="flex items-center border-2 py-2 px-3 rounded-2xl mb-4">
            <FaBriefcase className="h-5 w-5 text-gray-400" />
            <select 
              className="pl-2 outline-none border-none text-gray-400 w-full" 
              name="job"
              value={formData.job}
              onChange={handleChange}
              required
            >
              <option value="" disabled>Select Your Position</option>
              <option value="Student">Student</option>
              <option value="Employer">Employer</option>
              <option value="Business Owner">Business Owner</option>
              <option value="Other">Other</option>
            </select>
          </div>
          <div className="flex items-center border-2 py-2 px-3 rounded-2xl mb-4">
            <FaEnvelope className="h-5 w-5 text-gray-400" />
            <input 
              className="pl-2 outline-none border-none w-full" 
              type="email" 
              name="email" 
              value={formData.email}
              onChange={handleChange}
              placeholder="Email Address" 
              required 
            />
          </div>
          <div className="flex items-center border-2 py-2 px-3 rounded-2xl mb-3">
            <FaLock className="h-5 w-5 text-gray-400" />
            <input 
              className="pl-2 outline-none border-none w-full" 
              type="password" 
              name="password" 
              value={formData.password}
              onChange={handleChange}
              placeholder="Password" 
              required 
            />
          </div>
          <div className="flex items-center border-2 py-2 px-3 rounded-2xl">
            <FaLock className="h-5 w-5 text-gray-400" />
            <input 
              className="pl-2 outline-none border-none w-full" 
              type="password" 
              name="confirmPassword" 
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="Confirm Password" 
              required 
            />
          </div>
          <button type="submit" className="block w-full bg-secondColor mt-4 py-2 rounded-2xl text-white font-semibold mb-2">Register</button>
          <Link href='/auth/login' className="text-sm ml-2 hover:text-secondColor cursor-pointer">Have Account ?</Link>
          <p className="text-center text-gray-500 mt-4">By signing up, you agree to our <span className="text-secondColor cursor-pointer">Terms of Service</span> and <span className="text-secondColor cursor-pointer">Privacy Policy</span>.</p>
        </form>
      </div>
    </div>
  )
}

export default Register
